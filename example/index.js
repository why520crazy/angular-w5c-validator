/*global angular,alert,w5cValidator*/
(function () {
    "use strict";
    var app = angular.module("app", ["w5c.validator"]);
    window.app = app;

    app.config(["w5cValidatorProvider", function (w5cValidatorProvider) {
        w5cValidatorProvider.config({
            blurTrig   : false,
            showError  : function (element, errorMessages) {

            },
            removeError: function (element) {

            }

        });
        w5cValidatorProvider.rules({
            email    : {
                required: "输入的邮箱地址不能为空",
                email   : "输入邮箱地址格式不正确"
            },
            user_name: {
                required: "输入的用户名不能为空",
                pattern : "用户名必须输入字母、数字、下划线,以字母开头"
            }
        });
    }]);
    app.controller("validateCtrl", ["$scope","$http",function ($scope,$http) {

        var vm = $scope.vam = {};

        vm.saveEntity = function (form) {
            //do somethings for bz
        };

        $http.get("index.js").success(function(result){
            vm.jsSource = result.data;
        });
        $http.get("validate.form.html").success(function(result){
            vm.htmlSource = result.data;
        });

        // 只是测试使用，实际Angular项目中不要在 controller中操作DOM元素
        $('.nav-tabs a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });

    }]);

})();