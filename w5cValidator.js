/*! w5cValidator v2.4.5 2015-10-28 */
angular.module("w5c.validator", ["ng"])
    .provider('w5cValidator', [function () {
        var defaultRules = {
                required      : "该选项不能为空",
                maxlength     : "该选项输入值长度不能大于{maxlength}",
                minlength     : "该选项输入值长度不能小于{minlength}",
                email         : "输入邮件的格式不正确",
                repeat        : "两次输入不一致",
                pattern       : "该选项输入格式不正确",
                number        : "必须输入数字",
                w5cuniquecheck: "该输入值已经存在，请重新输入",
                url           : "输入URL格式不正确",
                max           : "该选项输入值不能大于{max}",
                min           : "该选项输入值不能小于{min}"

            },
            elemTypes = ['text', 'password', 'email', 'number', 'url', 'tel', 'hidden', ['textarea'], ['select'], ['select-multiple'], ['select-one'], 'radio', 'checkbox'];

        var getParentGroup = function (elem) {
            if (elem[0].tagName === "FORM" || elem[0].nodeType == 11) {
                return null;
            }
            if (elem && elem.hasClass("form-group")) {
                return elem;
            } else {
                return getParentGroup(elem.parent())
            }
        };

        var validatorFn = function () {
            this.elemTypes = elemTypes;
            this.rules = [];
            this.isEmpty = function (object) {
                if (!object) {
                    return true;
                }
                if (object instanceof Array && object.length === 0) {
                    return true;
                }
                return false;
            };
            this.defaultShowError = function (elem, errorMessages) {
                var $elem = angular.element(elem),
                    $group = getParentGroup($elem);

                if (!this.isEmpty($group) && !$group.hasClass("has-error")) {
                    $group.addClass("has-error");

                }
                var $next = $elem.next();
                if (!$next || !$next.hasClass("w5c-error")) {
                    $elem.after('<span class="w5c-error">' + errorMessages[0] + '</span>');
                }
            };
            this.defaultRemoveError = function (elem) {
                var $elem = angular.element(elem),
                    $group = getParentGroup($elem);

                if (!this.isEmpty($group) && $group.hasClass("has-error")) {
                    $group.removeClass("has-error");
                }
                var $next = $elem.next();
                if ($next.hasClass && $next.hasClass("w5c-error")) {
                    $next.remove();
                }

            };
            this.options = {
                blurTrig   : false,
                showError  : true,
                removeError: true
            }
        };

        validatorFn.prototype = {
            constructor     : validatorFn,
            config          : function (options) {
                this.options = angular.extend(this.options, options);
            },
            setRules        : function (rules) {
                this.rules = rules;
            },
            getErrorMessage : function (validationName, elem) {
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
                    case "max":
                        if (msgTpl !== null) {
                            return msgTpl.replace("{max}", elem.getAttribute("max"));
                        }
                        return defaultRules.max.replace("{max}", elem.getAttribute("max"));
                    case "min":
                        if (msgTpl !== null) {
                            return msgTpl.replace("{min}", elem.getAttribute("min"));
                        }
                        return defaultRules.min.replace("{min}", elem.getAttribute("min"));
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
            showError       : function (elem, errorMessages, options) {
                var useOptions = angular.extend({}, this.options, options);
                angular.element(elem).removeClass("valid").addClass("error");
                if (useOptions.showError === false) {
                    return;
                }
                if (angular.isFunction(useOptions.showError)) {
                    return useOptions.showError(elem, errorMessages);
                }
                if (useOptions.showError === true) {
                    return this.defaultShowError(elem, errorMessages);
                }
            },
            removeError     : function (elem, options) {
                var useOptions = angular.extend({}, this.options, options);
                angular.element(elem).removeClass("error").addClass("valid");
                if (useOptions.removeError === false) {
                    return;
                }
                if (angular.isFunction(useOptions.removeError)) {
                    return useOptions.removeError(elem);
                }
                if (useOptions.removeError === true) {
                    return this.defaultRemoveError(elem);
                }
            }
        };

        var validator = new validatorFn();

        /**
         * 配置验证属性
         * @param options
         */
        this.config = function (options) {
            validator.config(options);
        };

        /**
         * 设置验证规则，提示信息
         * @param rules
         */
        this.setRules = function (rules) {
            validator.setRules(rules);
        };

        /**
         * 设置默认规则
         * @param rules
         */
        this.setDefaultRules = function (rules) {
            defaultRules = angular.extend(defaultRules, rules);
        };

        /**
         * get method
         * @returns {validatorFn}
         */
        this.$get = function () {
            return validator;
        }
    }]);

angular.module("w5c.validator")
    .directive("w5cFormValidate", ['$parse', 'w5cValidator', '$timeout', function ($parse, w5cValidator, $timeout) {
        return {
            require   : ['w5cFormValidate', '^?form'],
            controller: ['$scope', function ($scope) {
                this.needBindKeydown = false;
                this.form = null;
                this.formElement = null;
                this.submitSuccessFn = null;
                this.validElements = [];
                this.init = function (formCtrl, form, attr) {
                    this.form = formCtrl;
                    this.formElement = form;
                    this.formName = form.attr("name");
                };
                this.doValidate = function (success) {
                    if (angular.isFunction(this.form.doValidate)) {
                        this.form.doValidate();
                    }
                    if (this.form.$valid && angular.isFunction(success)) {
                        $scope.$apply(function () {
                            success($scope);
                        });
                    }
                };
                this.removeElementValidation = function (name) {
                    var index = this.validElements.indexOf(name);
                    if (index >= 0) {
                        this.validElements.splice(index, 1);
                        if(!w5cValidator.isEmpty(this.form.$errors)){
                            this.doValidate(angular.noop);
                        }
                    }
                };
                this.initElememt = function (elem) {
                    var $elem = angular.element(elem);
                    var ctrl = this;

                    if (w5cValidator.elemTypes.toString().indexOf(elem.type) > -1 && !w5cValidator.isEmpty(elem.name)) {
                        //formCtrl[elem.name].$viewChangeListeners.push(function () {
                        //    formCtrl.$errors = [];
                        //    w5cValidator.removeError($elem, options);
                        //});
                        if (this.validElements.indexOf(elem.name) < 0) {
                            this.validElements.push(elem.name);
                        } else {
                            return;
                        }
                        var $viewValueName = this.formName + "." + elem.name + ".$viewValue";
                        //监控输入框的value值当有变化时移除错误信息
                        //可以修改成当输入框验证通过时才移除错误信息，只要监控$valid属性即可
                        $scope.$watch($viewValueName, function () {
                            ctrl.form.$errors = [];
                            w5cValidator.removeError($elem, ctrl.options);
                        }, true);
                        //光标移走的时候触发验证信息
                        if (ctrl.options.blurTrig) {
                            $elem.bind("blur", function () {
                                if (!ctrl.options.blurTrig) {
                                    return;
                                }
                                var self = this;
                                var $elem = angular.element(this);
                                $timeout(function () {
                                    if (!ctrl.form[self.name].$valid) {
                                        var errorMessages = w5cValidator.getErrorMessages(self, ctrl.form[self.name].$error);
                                        w5cValidator.showError($elem, errorMessages, ctrl.options);
                                    } else {
                                        w5cValidator.removeError($elem, ctrl.options);
                                    }
                                }, 50);
                            });
                        }
                    }
                };
            }],
            link      : function (scope, form, attr, ctrls) {
                var ctrl = ctrls[0], formCtrl = ctrls[1];
                var formElem = form[0],
                    formSubmitFn = $parse(attr.w5cSubmit),
                    options = scope.$eval(attr.w5cFormValidate);
                if (!attr.name) {
                    throw Error("form must has name when use w5cFormValidate");
                }
                ctrl.init(formCtrl, form, attr);
                // w5cFormValidate has value,watch it
                if (attr.w5cFormValidate) {
                    scope.$watch(attr.w5cFormValidate, function (newValue) {
                        if (newValue) {
                            ctrl.options = options = angular.extend({}, w5cValidator.options, newValue);
                        }
                    }, true)
                }
                ctrl.options = options = angular.extend({}, w5cValidator.options, options);

                //初始化验证规则，并时时监控输入值的变话
                for (var i = 0; i < formElem.length; i++) {
                    var elem = formElem[i];
                    ctrl.initElememt(elem);
                }

                //触发验证事件
                var doValidate = function () {
                    var errorMessages = [];
                    //循环验证
                    for (var i = 0; i < ctrl.validElements.length; i++) {
                        var elemName = ctrl.validElements[i];
                        var elem = formElem[elemName];
                        if (formCtrl[elemName] && elem && w5cValidator.elemTypes.toString().indexOf(elem.type) > -1 && !w5cValidator.isEmpty(elem.name)) {
                            if (formCtrl[elemName].$valid) {
                                angular.element(elem).removeClass("error").addClass("valid");
                                continue;
                            } else {
                                var elementErrors = w5cValidator.getErrorMessages(elem, formCtrl[elem.name].$error);
                                errorMessages.push(elementErrors[0]);
                                w5cValidator.removeError(elem, options);
                                w5cValidator.showError(elem, elementErrors, options);
                            }
                        }
                    }
                    if (!w5cValidator.isEmpty(errorMessages) && errorMessages.length > 0) {
                        formCtrl.$errors = errorMessages;
                    } else {
                        formCtrl.$errors = [];
                    }
                    if (!scope.$$phase) {
                        scope.$apply(formCtrl.$errors);
                    }
                };
                if (formCtrl) {
                    formCtrl.doValidate = doValidate;
                    formCtrl.reset = function () {
                        $timeout(function () {
                            formCtrl.$setPristine();
                            for (var i = 0; i < formElem.length; i++) {
                                var elem = formElem[i];
                                var $elem = angular.element(elem);
                                w5cValidator.removeError($elem, options);
                            }
                        });
                    };
                }

                //w5cSubmit is function
                if (attr.w5cSubmit && angular.isFunction(formSubmitFn)) {

                    form.bind("submit", function () {
                        doValidate();
                        if (formCtrl.$valid && angular.isFunction(formSubmitFn)) {
                            scope.$apply(function () {
                                formSubmitFn(scope);
                            });
                        }
                    });
                    ctrl.needBindKeydown = true;
                }
                if (ctrl.needBindKeydown) {
                    form.bind("keydown keypress", function (event) {
                        if (event.which === 13) {
                            var currentInput = document.activeElement;
                            if (currentInput.type !== "textarea") {
                                var button = form.find("button");
                                if (button && button[0]) {
                                    button[0].focus();
                                }
                                currentInput.focus();
                                doValidate();
                                event.preventDefault();
                                if (formCtrl.$valid && angular.isFunction(ctrl.submitSuccessFn)) {
                                    scope.$apply(function () {
                                        ctrl.submitSuccessFn(scope);
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
        return {
            require: "^w5cFormValidate",
            link   : function (scope, element, attr, ctrl) {
                var validSuccessFn = $parse(attr.w5cFormSubmit);
                element.bind("click", function () {
                    ctrl.doValidate(validSuccessFn);
                });
                ctrl.needBindKeydown = true;
                ctrl.submitSuccessFn = validSuccessFn;
            }
        };
    }])
    .directive("w5cRepeat", [function () {
        'use strict';
        return {
            require: "ngModel",
            link   : function (scope, elem, attrs, ctrl) {
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
    .directive("w5cUniqueCheck", ['$timeout', '$http', 'w5cValidator', function ($timeout, $http, w5cValidator) {
        return {
            require: ["ngModel", "?^w5cFormValidate", "?^form"],
            link   : function (scope, elem, attrs, ctrls) {
                var ngModelCtrl = ctrls[0], w5cFormCtrl = ctrls[1], formCtrl = ctrls[2];

                var doValidate = function () {
                    var attValues = scope.$eval(attrs.w5cUniqueCheck);
                    var url = attValues.url;
                    var isExists = attValues.isExists;//default is true
                    $http.get(url).success(function (data) {
                        var state = isExists === false ? (data == 'true' || data == true) : !(data == 'true' || data == true);
                        ngModelCtrl.$setValidity('w5cuniquecheck', state);
                        if (!state) {
                            var errorMsg = w5cValidator.getErrorMessage("w5cuniquecheck", elem[0]);
                            w5cValidator.showError(elem[0], [errorMsg], w5cFormCtrl.options);
                            if (!formCtrl.$errors) {
                                formCtrl.$errors = [errorMsg];
                            } else {
                                formCtrl.$errors.unshift(errorMsg);
                            }
                        }
                    });
                };

                ngModelCtrl.$viewChangeListeners.push(function () {
                    formCtrl.$errors = [];
                    ngModelCtrl.$setValidity('w5cuniquecheck', true);
                    if (ngModelCtrl.$invalid && !ngModelCtrl.$error.w5cuniquecheck) {
                        return;
                    }
                    if (ngModelCtrl.$dirty) {
                        doValidate();
                    }
                });

                var firstValue = scope.$eval(attrs.ngModel);
                if (firstValue) {
                    if (ngModelCtrl.$invalid && !ngModelCtrl.$error.w5cuniquecheck) {
                        return;
                    }
                    doValidate();
                }
            }
        };
    }])
    .directive('w5cDynamicName', [function () {
        return {
            restrict: 'A',
            require : "ngModel",
            link    : function (scope, elm, attrs, ngModelCtr) {
                ngModelCtr.$name = scope.$eval(attrs.w5cDynamicName);
                elm.attr('name', scope.$eval(attrs.w5cDynamicName));
                var formController = elm.controller('form') || {
                        $addControl: angular.noop
                    };
                formController.$addControl(ngModelCtr);
            }
        };
    }])
    .directive('w5cDynamicElement', ["$timeout",function ($timeout) {
        return {
            restrict: 'A',
            require : ["ngModel", "?^w5cFormValidate", "?^form"],
            link    : function (scope, elm, attrs, ctrls) {
                var name = elm[0].name,formCtrl = ctrls[2];
                if (name) {
                    elm.on("$destroy", function (e) {
                        ctrls[1].removeElementValidation(name);
                    });
                    if(!formCtrl[name]){
                        formCtrl.$addControl(ctrls[0]);
                    }
                    var needValidate = false;
                    if(ctrls[2].$errors && ctrls[2].$errors.length > 0){
                        needValidate = true;
                    }
                    ctrls[1].initElememt(elm[0]);
                    if(needValidate){
                        $timeout(function(){
                            ctrls[1].doValidate(angular.noop);
                        });

                    }
                }
            }
        };
    }]);