/*global angular,alert,w5cValidator*/
(function () {
    "use strict";
    var app = angular.module("app", []);
    window.app = app;

    app.config(function () {
        w5cValidator.init({blur_trig: false});
        w5cValidator.set_rules({
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