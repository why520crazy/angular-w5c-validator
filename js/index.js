/*global angular,alert,w5cValidator*/
(function () {
    "use strict";
    var app = angular.module("app", []);
    window.app = app;
    app.config(function(){
        w5cValidator.init({blur_trig:false});
    });
    app.controller("validate_ctrl",function($scope){

        $scope.js_submit = function(form){
            //alert("jj");
            form.do_validate();
        };
    });

})();