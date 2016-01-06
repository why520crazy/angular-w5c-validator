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
                min           : "该选项输入值不能小于{min}",
                customizer    : "自定义验证不通过"

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
            this.rules = {};
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
                this.rules = angular.extend(this.rules, rules);
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
