/**
 * @license w5cValidator v1.0.0
 * (c) 2013-2014
 * Author: @why520crazy
 * License: NONE
 */

/* global angular */
(function () {
    "use strict";
    var default_rules = {
            required : "该选项不能为空",
            maxlength: "该选项输入值长度不能大于{maxlength}",
            minlength: "该选项输入值长度不能小于{minlength}",
            email    : "输入邮件的格式不正确",
            //repeat: "两次填写的密码不一致",
            pattern  : "该选项输入格式不正确",
            number   : "必须输入数字"
            //romoteuniquecheck: "该输入值已经存在，请重新输入"
        },
        elem_types = ['text', 'password', 'email', 'number', ['textarea'], ['select'], ['select-one']];

    var validator = function () {
        this.rules = [];
    };

    var show_error = function (elem, error_messages) {
        var $elem = angular.element(elem);
        var $group = $elem.parent().parent();
        if (!this.isEmpty($group) && !$group.hasClass("has-error")) {
            $group.addClass("has-error");
            $elem.after('<span class="w5c-error">' + error_messages[0] + '</span>');
        }
    };

    var remove_error = function (elem) {
        var $elem = angular.element(elem);
        var $group = $elem.parent().parent();
        if (!this.isEmpty($group) && $group.hasClass("has-error")) {
            $group.removeClass("has-error");
            $elem.next(".w5c-error").remove();
        }

    };

    validator.prototype.init = function (options) {
        var defaults = {
            blur_trig   : false,
            show_error  : show_error,
            remove_error: remove_error
        };
        this.options = angular.extend({}, defaults, options);
        validator.prototype.show_error = this.options.show_error;
        validator.prototype.remove_error = this.options.remove_error;
    };

    validator.prototype.isEmpty = function (object) {
        if (object === undefined || object === null) {
            return true;
        }
        if (object instanceof Array && object.length === 0) {
            return true;
        }
        return false;
    };

    validator.prototype.set_default_rules = function (rules) {
        default_rules = rules;
    };

    validator.prototype.set_rules = function (rules) {
        this.rules = rules;
    };

    validator.prototype.get_error_message = function (validation_name, elem) {
        var msg_tpl = null;
        if (!this.isEmpty(this.rules[elem.name]) && !this.isEmpty(this.rules[elem.name][validation_name])) {
            msg_tpl = this.rules[elem.name][validation_name];
        }
        switch (validation_name) {
            case "maxlength":
                if (msg_tpl !== null) {
                    return msg_tpl.replace("{maxlength}", elem.getAttribute("ng-maxlength"));
                }
                return default_rules.maxlength.replace("{maxlength}", elem.getAttribute("ng-maxlength"));
            case "minlength":
                if (msg_tpl !== null) {
                    return msg_tpl.replace("{minlength}", elem.getAttribute("ng-minlength"));
                }
                return default_rules.minlength.replace("{minlength}", elem.getAttribute("ng-minlength"));
            default :
            {
                if (msg_tpl !== null) {
                    return msg_tpl;
                }
                if (default_rules[validation_name] === null) {
                    throw new Error("该验证规则(" + validation_name + ")默认错误信息没有设置！");
                }
                return default_rules[validation_name];
            }

        }
    };

    validator.prototype.get_error_messages = function (elem, $error) {
        var element_errors = [];
        for (var err in $error) {
            if ($error[err]) {
                var msg = $validator.get_error_message(err, elem);
                element_errors.push(msg);
            }
        }
        return element_errors;
    };

    var $validator = window.w5cValidator = window.w5cValidator || new validator();

    angular.module("ng").directive("w5cFormValidate", ['$parse', function ($parse) {
        return{
            link: function (scope, $form, attr) {
                var form_elem = $form[0];
                var form_name = $form.attr("name");
                var form_submit_fn = $parse(attr.w5cSubmit);

                //初始化验证规则，并时时监控输入值的变话
                for (var i = 0; i < form_elem.length; i++) {
                    var elem = form_elem[i];
                    var $elem = angular.element(form_elem[i]);
                    if (elem_types.toString().indexOf(elem.type) > -1 && !$validator.isEmpty(elem.name)) {
                        var $viewValue_name = form_name + "." + elem.name + ".$viewValue";
                        //监控输入框的value值当有变化时移除错误信息
                        //可以修改成当输入框验证通过时才移除错误信息，只要监控$valid属性即可
                        scope.$watch("[" + $viewValue_name + "," + i + "]", function (newValue) {
                            var $elem = form_elem[newValue[1]];
                            scope[form_name].$errors = [];
                            $validator.remove_error($elem);
                        }, true);

                        //光标移走的时候触发验证信息
                        if ($validator.options.blur_trig === true) {
                            $elem.bind("blur", function () {
                                var $elem = angular.element(this);
                                if (!scope[form_name][this.name].$valid) {
                                    var error_messages = $validator.get_error_messages($elem, scope[form_name][this.name].$error);
                                    $validator.show_error($elem, error_messages);
                                } else {
                                    $validator.remove_error($elem);
                                }
                            });
                        }
                    }
                }

                //触发验证事件
                var do_validate = function () {
                    var error_messages = [];
                    //循环验证
                    for (var i = 0; i < form_elem.length; i++) {
                        var elem = form_elem[i];
                        if (elem_types.toString().indexOf(elem.type) > -1 && !$validator.isEmpty(elem.name)) {
                            if (scope[form_name][elem.name].$valid) {
                                continue;
                            } else {
                                var element_errors = $validator.get_error_messages(elem, scope[form_name][elem.name].$error);
                                error_messages.push(element_errors[0]);
                                $validator.remove_error(elem);
                                $validator.show_error(elem, element_errors);
                            }
                        }
                    }
                    if (!$validator.isEmpty(error_messages) && error_messages.length > 0) {
                        scope[form_name].$errors = error_messages;
                    } else {
                        scope[form_name].$errors = [];
                    }
                    if (!scope.$$phase) {
                        scope.$apply(scope[form_name].$errors);
                    }
                };
                scope[form_name].do_validate = do_validate;

                $form.bind("submit", function () {
                    do_validate();
                    if (scope[form_name].$valid && angular.isFunction(form_submit_fn)) {
                        scope.$apply(function () {
                            form_submit_fn(scope);
                        });
                    }
                })
            }
        };
    }]);
})();