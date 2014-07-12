/*global angular,alert,w5cValidator*/
(function () {
    "use strict";
    var app = angular.module("app", ["w5c.validator", "ui.bootstrap","hljs"]);
    window.app = app;

    app.config(["w5cValidatorProvider", function (w5cValidatorProvider) {
        w5cValidatorProvider.config({
            blurTrig: false,
            showError: function (element, errorMessages) {

            },
            removeError: function (element) {

            }

        });
        w5cValidatorProvider.rules({
            email: {
                required: "输入的邮箱地址不能为空",
                email: "输入邮箱地址格式不正确"
            },
            user_name: {
                required: "输入的用户名不能为空",
                pattern: "用户名必须输入字母、数字、下划线,以字母开头"
            }
        });
    }]);
    app.controller("validateCtrl", ["$scope", "$http", function ($scope, $http) {

        var vm = $scope.vm = {
            htmlSource: ""
        };

        vm.saveEntity = function (form) {
            //do somethings for bz
        };

        $http.get("index.js").success(function (result) {
            vm.jsSource = result;
        });
        $http.get("validate.form.html").success(function (result) {
            vm.htmlSource = result;
        });
        $http.get("validate.form.html").success(function (result) {
            vm.htmlSource = result;
        });

        $http.get("css/style.less").success(function (result) {
            vm.lessSource = result;
        });

    }]);
    app.directive('showHtml', [function ($compile) {
        return {
            scope: true,
            link: function (scope, element, attrs) {
                var el;

                scope.$watch(attrs.showHtml, function (tpl) {

                    if (angular.isDefined(tpl)) {
                        // compile the provided template against the current scope
                        el = $compile(tpl)(scope);
                        // stupid way of emptying the element
                        element.html("");

                        // add the template content
                        element.append(el);
                    } else {
                        element.html("<span>ddd</span>111");
                    }
                });
            }
        };
    }]);


})();