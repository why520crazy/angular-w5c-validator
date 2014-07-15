/**
 * @license w5cValidator v2.0.0
 * (c) 2013-2014
 * Author: @why520crazy
 * License: NONE
 */
angular.module("w5c.validator", ["ng"])
    .provider('w5cValidator', [function () {
        var defaultRules = {
                required: "该选项不能为空",
                maxlength: "该选项输入值长度不能大于{maxlength}",
                minlength: "该选项输入值长度不能小于{minlength}",
                email: "输入邮件的格式不正确",
                repeat: "两次输入不一致",
                pattern: "该选项输入格式不正确",
                number: "必须输入数字",
                w5cuniquecheck: "该输入值已经存在，请重新输入"
            },
            elemTypes = ['text', 'password', 'email', 'number', ['textarea'], ['select'], ['select-one']];

        var validatorFn = function () {
            this.elemTypes = elemTypes;
            this.rules = [];
            this.isEmpty = function (object) {
                if (object === undefined || object === null) {
                    return true;
                }
                if (object instanceof Array && object.length === 0) {
                    return true;
                }
                return false;
            };
            this.defaultShowError = function (elem, errorMessages) {
                var $elem = angular.element(elem);
                var $group = $elem.parent().parent();
                if (!this.isEmpty($group) && !$group.hasClass("has-error")) {
                    $group.addClass("has-error");
                    $elem.after('<span class="w5c-error">' + errorMessages[0] + '</span>');
                }
            };
            this.defaultRemoveError = function (elem) {
                var $elem = angular.element(elem);
                var $group = $elem.parent().parent();
                if (!this.isEmpty($group) && $group.hasClass("has-error")) {
                    $group.removeClass("has-error");
                    $elem.next(".w5c-error").remove();
                }
            };
            this.options = {
                blurTrig: false
            }
        };

        validatorFn.prototype = {
            constructor: validatorFn,
            config: function (options) {
                this.options = angular.extend(this.options, options);
            },
            setRules: function (rules) {
                this.rules = rules;
            },
            getErrorMessage: function (validationName, elem) {
                var msgTpl = null;
                if (!this.isEmpty(this.rules[elem.name]) && !this.isEmpty(this.rules[elem.name][validationName])) {
                    msgTpl = this.rules[elem.name][validationName];
                }
                switch (validationName) {
                    case "maxlength":
                        if (msgTpl !== null) {
                            return msgTpl.replace("{maxlength}", elem.getAttribute("ng-maxlength"));
                        }
                        return defaultRules.maxlength.replace("{maxlength}", elem.getAttribute("ng-maxlength"));
                    case "minlength":
                        if (msgTpl !== null) {
                            return msgTpl.replace("{minlength}", elem.getAttribute("ng-minlength"));
                        }
                        return defaultRules.minlength.replace("{minlength}", elem.getAttribute("ng-minlength"));
                    default :
                    {
                        if (msgTpl !== null) {
                            return msgTpl;
                        }
                        if (defaultRules[validationName] === null) {
                            throw new Error("该验证规则(" + validationName + ")默认错误信息没有设置！");
                        }
                        return defaultRules[validationName];
                    }

                }
            },
            getErrorMessages: function (elem, errors) {
                var elementErrors = [];
                for (var err in errors) {
                    if (errors[err]) {
                        var msg = this.getErrorMessage(err, elem);
                        elementErrors.push(msg);
                    }
                }
                return elementErrors;
            },
            showError: function (elem, errorMessages, options) {
                var useOptions = angular.extend({}, this.options, options);
                if (useOptions.showError === false) {
                    return;
                }
                angular.element(elem).removeClass("valid").addClass("error");
                if (angular.isFunction(useOptions.showError)) {
                    return useOptions.showError(elem, errorMessages);
                }
                if (useOptions.showError === true) {
                    return this.defaultShowError(elem, errorMessages);
                }
            },
            removeError: function (elem, options) {
                var useOptions = angular.extend({}, this.options, options);
                if (useOptions.removeError === false) {
                    return;
                }
                angular.element(elem).removeClass("error").addClass("valid");
                if (angular.isFunction(useOptions.removeError)) {
                    return useOptions.removeError(elem);
                }
                if (useOptions.removeError === true) {
                    return this.defaultRemoveError(elem);
                }
            }
        };

        var validator = new validatorFn();

        this.config = function (options) {
            validator.config(options);
        };

        this.setRules = function (rules) {
            validator.setRules(rules);
        };

        this.$get = function () {
            return validator;
        }
    }]);
angular.module("w5c.validator")
    .directive("w5cFormValidate", ['$parse', 'w5cValidator', function ($parse, w5cValidator) {
        return{
            link: function (scope, form, attr) {
                var formElem = form[0],
                    formName = form.attr("name"),
                    formSubmitFn = $parse(attr.w5cSubmit),
                    options = scope.$eval(attr.w5cFormValidate);

                // w5cFormValidate has value,watch it
                if (attr.w5cFormValidate) {
                    scope.$watch(attr.w5cFormValidate, function (newValue) {
                        if (newValue) {
                            options = angular.extend({}, w5cValidator.options, newValue);
                        }
                    }, true)
                }
                options = angular.extend({}, w5cValidator.options, options);

                //初始化验证规则，并时时监控输入值的变话
                for (var i = 0; i < formElem.length; i++) {
                    var elem = formElem[i];
                    var $elem = angular.element(elem);
                    if (w5cValidator.elemTypes.toString().indexOf(elem.type) > -1 && !w5cValidator.isEmpty(elem.name)) {
                        var $viewValueName = formName + "." + elem.name + ".$viewValue";
                        //监控输入框的value值当有变化时移除错误信息
                        //可以修改成当输入框验证通过时才移除错误信息，只要监控$valid属性即可
                        scope.$watch("[" + $viewValueName + "," + i + "]", function (newValue) {
                            var $elem = formElem[newValue[1]];
                            scope[formName].$errors = [];
                            w5cValidator.removeError($elem, options);
                        }, true);

                        //光标移走的时候触发验证信息
                        if (options.blurTrig) {
                            $elem.bind("blur", function () {
                                if (!options.blurTrig) {
                                    return;
                                }
                                var $elem = angular.element(this);
                                if (!scope[formName][this.name].$valid) {
                                    var errorMessages = w5cValidator.getErrorMessages(this, scope[formName][this.name].$error);
                                    w5cValidator.showError($elem, errorMessages, options);
                                } else {
                                    w5cValidator.removeError($elem, options);
                                }
                            });
                        }
                    }
                }

                //触发验证事件
                var doValidate = function () {
                    var errorMessages = [];
                    //循环验证
                    for (var i = 0; i < formElem.length; i++) {
                        var elem = formElem[i];
                        if (w5cValidator.elemTypes.toString().indexOf(elem.type) > -1 && !w5cValidator.isEmpty(elem.name)) {
                            if (scope[formName][elem.name].$valid) {
                                angular.element(elem).removeClass("error").addClass("valid");
                                continue;
                            } else {
                                var elementErrors = w5cValidator.getErrorMessages(elem, scope[formName][elem.name].$error);
                                errorMessages.push(elementErrors[0]);
                                w5cValidator.removeError(elem, options);
                                w5cValidator.showError(elem, elementErrors, options);
                                angular.element(elem).removeClass("valid").addClass("error");
                            }
                        }
                    }
                    if (!w5cValidator.isEmpty(errorMessages) && errorMessages.length > 0) {
                        scope[formName].$errors = errorMessages;
                    } else {
                        scope[formName].$errors = [];
                    }
                    if (!scope.$$phase) {
                        scope.$apply(scope[formName].$errors);
                    }
                };
                scope[formName].doValidate = doValidate;

                //w5cSubmit is function
                if (attr.w5cSubmit && angular.isFunction(formSubmitFn)) {

                    form.bind("submit", function () {
                        doValidate();
                        if (scope[formName].$valid && angular.isFunction(formSubmitFn)) {
                            scope.$apply(function () {
                                formSubmitFn(scope);
                            });
                        }
                    });

                    form.bind("keydown keypress", function (event) {
                        if (event.which === 13) {
                            var currentInput = document.activeElement;
                            if (currentInput.type !== "textarea") {
                                angular.element(this).find("button").focus();
                                currentInput.focus();
                                doValidate();
                                event.preventDefault();
                                if (scope[formName].$valid && angular.isFunction(formSubmitFn)) {
                                    scope.$apply(function () {
                                        formSubmitFn(scope);
                                    });
                                }
                            }
                        }
                    });
                }


            }
        };
    }])
    .directive("w5cFormSubmit", ['$parse', function ($parse) {
        return{
            link: function (scope, element, attr) {
                var validSuccessFn = $parse(attr.w5cFormSubmit);
                var formName = element.parents("form").attr("name");
                var form = scope.$eval(formName);
                if (!form) {
                    throw new Error("w5cFormSubmit form is empty.");
                    return;
                }

                element.bind("click", function () {
                    if (angular.isFunction(form.doValidate)) {
                        form.doValidate();
                    }
                    if (form.$valid && angular.isFunction(validSuccessFn)) {
                        scope.$apply(function () {
                            validSuccessFn(scope);
                        });
                    }
                });

                element.parents("form").bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        var currentInput = document.activeElement;
                        if (currentInput.type !== "textarea") {
                            this.find("button").focus();
                            currentInput.focus();
                            if (angular.isFunction(form.doValidate)) {
                                form.doValidate();
                            }
                            event.preventDefault();
                            if (form.$valid && angular.isFunction(validSuccessFn)) {
                                scope.$apply(function () {
                                    validSuccessFn(scope);
                                });
                            }
                        }
                    }
                });
            }
        };
    }])
    .directive("w5cRepeat", [function () {
        'use strict';
        return {
            require: "ngModel",
            link: function (scope, elem, attrs, ctrl) {
                var otherInput = elem.inheritedData("$formController")[attrs.w5cRepeat];

                ctrl.$parsers.push(function (value) {
                    if (value === otherInput.$viewValue) {
                        ctrl.$setValidity("repeat", true);
                        return value;
                    }
                    ctrl.$setValidity("repeat", false);
                });

                otherInput.$parsers.push(function (value) {
                    ctrl.$setValidity("repeat", value === ctrl.$viewValue);
                    return value;
                });
            }
        };
    }])
    .directive("w5cUniqueCheck", ['$timeout', '$http', function ($timeout, $http) {
        return{
            require: "ngModel",
            link: function (scope, elem, attrs, ngModel) {
                var doValidate = function () {
                    var attValues = scope.$eval(attrs.w5cUniqueCheck);
                    var url = attValues.url;
                    var isExists = attValues.isExists;//default is true
                    $http.get(url).success(function (result) {
                        if (isExists === false) {
                            ngModel.$setValidity('w5cuniquecheck', result.data);
                        }
                        else {
                            ngModel.$setValidity('w5cuniquecheck', !result.data);
                        }
                    });
                };

                scope.$watch(attrs.ngModel, function (newValue) {
                    if (_.isEmpty(newValue)) {
                    } else if (!scope[elem[0].form.name][elem[0].name].$dirty) {
                        doValidate();
                    }
                });

                elem.bind("blur", function () {
                    $timeout(function () {
                        if (scope[elem[0].form.name][elem[0].name].$invalid) {
                            return;
                        }
                        doValidate();

                    });
                });
                elem.bind("focus", function () {
                    $timeout(function () {
                        ngModel.$setValidity('w5cuniquecheck', true);
                    });
                });
            }
        };
    }]);