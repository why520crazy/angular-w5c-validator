w5c-validator
=====================

w5c-validator for angular.js
主要是基于angular.js做的一个扩展插件，统一验证规则和提示信息

博客园博客详细介绍：http://www.cnblogs.com/why520crazy/p/w5cValidator.html

demo演示：http://why520crazy.github.io/w5c-validator-angular/demo/index.html


w5c validator自身提示信息样式使用了bootstrap的方式，当然你可以很好的扩展自己的提示方式


开始使用：<br>
1. HTML代码如下：validate_ctrl是angular.js的控制器，你只需要在form表单上加上 w5c-form-validate，w5c-submit即可完成验证信息的提示，w5c-submit函数只有验证成功后才会调用
<code>

              <div class="container" data-ng-controller="validate_ctrl">

                  <form class="form-horizontal cw-form demo-form" role="form" w5c-submit="js_save_entity(form_validate)"
                        w5c-form-validate="" novalidate name="form_validate">
                      <div class="form-group">
                          <label class="col-sm-2 control-label">邮箱</label>

                          <div class="col-sm-10">
                              <input type="email" name="email" ng-model="entity.email" required="" class="form-control"
                                     placeholder="输入邮箱">
                          </div>
                      </div>
                      <div class="form-group">
                          <label class="col-sm-2 control-label">用户名</label>

                          <div class="col-sm-10">
                              <input required="" ng-pattern="/^[A-Za-z]{1}[0-9A-Za-z_]{1,19}$/" ng-model="entity.name" class="form-control" name="user_name" placeholder="输入用户名">
                          </div>
                      </div>
                      <div class="form-group">
                          <label class="col-sm-2 control-label">密码</label>

                          <div class="col-sm-10">
                              <input type="password" required="" ng-model="entity.password" name="password" class="form-control"
                                     placeholder="输入密码">
                          </div>
                      </div>
                      <div class="form-group">
                          <label class="col-sm-2 control-label">数字</label>

                          <div class="col-sm-10">
                              <input type="number" required="" ng-model="entity.number" name="number" class="form-control"
                                     placeholder="输入数字">
                          </div>
                      </div>

                      <div class="form-group">
                          <div class="col-sm-offset-2 col-sm-10">
                              <button type="submit" class="btn btn-success"> 验证</button>
                          </div>
                      </div>
                  </form>
              </div>
          
</code>

2.js 代码如下：<br>
w5cValidator.init方法是提供自定义属性和现实错误信息的方法，默认以bootstrap的方式提示错误信息，<br>
w5cValidator.set_rules方法可以设置提示信息，格式为json，输入元素名称:{规则名称:提示信息}<br>
blur_trig 属性设置光标移走是否触发验证事件，默认false <br>
<pre>
(function () {
    "use strict";
    var app = angular.module("app", []);
    window.app = app;
    app.config(function () {
        w5cValidator.init({
            //blur_trig   : false,
            //show_error  : function (elem, error_messages) {
            //
            //},
            //remove_error: function (elem) {
            //
            //}

        });
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
</pre>
