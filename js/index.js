/*global angular,alert,w5cValidator*/
(function () {
    "use strict";
    var app = angular.module("app", []);
    window.app = app;

    app.config(function () {
        w5cValidator.init({
            //blur_trig   : false,
            show_error  : function (elem, error_messages) {

            },
            remove_error: function (elem) {

            }

        });
        w5cValidator.set_rules({
            email: {
                required: "输入的邮箱地址不能为空",
                email : "输入邮箱地址格式不正确"
            },
            user_name: {
                required: "输入的用户名不能为空",
                pattern : "用户名必须输入字母、数字、下划线,以字母开头"
            }
        })
    });
    app.controller("validate_ctrl", function ($scope) {

        $scope.js_save_entity = function (form) {
            //do somethings for bz
        };
    });

})();