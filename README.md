w5c-validator
=====================

w5c-validator for angular.js
主要是基于angular.js做的一个扩展插件，统一验证规则和提示信息

demo演示：http://why520crazy.github.io/w5c-validator-angular

w5c validator自身提示信息样式使用了bootstrap的方式，当然你可以很好的扩展自己的提示方式

w5cValidator 插件基于angular原有的表单验证，在原有的基础上扩展了一些错误提示的功能，让大家不用在每个表单上写一些提示信息的模板，专心的去实现业务逻辑。

>代码地址：https://github.com/why520crazy/w5c-validator-angular

关于v1.x版本的介绍参见：http://www.ngnice.com/posts/69f774dc4d3190

v1.0版本虽然简单的实现了想要的功能，但是没有按照模块独立出来，而且有很多代码不是很规范，这次正好抽时间重构了代码，直接升级到了 v2.0.0版本，同时也完善了一些展示案例功能。

如果你已经足够了解了angular或者之前使用过 w5cValidator，可以直接看展示程序：
>展示地址：http://why520crazy.github.io/w5c-validator-angular

使用步骤：

1. HTML 中引用 dest/w5cValidator.js；

2. 在`app.config`事件中配置全局属性和显示规则：
```javascript
app.config(["w5cValidatorProvider", function (w5cValidatorProvider) {

        // 全局配置
        w5cValidatorProvider.config({
            blurTrig   : false,
            showError  : true,
            removeError: true

        });
        w5cValidatorProvider.setRules({
            email   : {
                required: "输入的邮箱地址不能为空",
                email   : "输入邮箱地址格式不正确"
            },
            username: {
                required: "输入的用户名不能为空",
                pattern : "用户名必须输入字母、数字、下划线,以字母开头"
            },
            password: {
                required : "密码不能为空",
                minlength: "密码长度不能小于{minlength}",
                maxlength: "密码长度不能大于{maxlength}"
            },
            number  : {
                required: "数字不能为空"
            }
        });
    }]);
```

1. 在HTML模板中form上使用指令 w5c-form-validate 和 w5c-submit，w5c-form-validate指令表示该表单采用 w5cValidator的验证规则；w5c-submit 表示验证成功后调用的事件，当然w5c-submit可以不填写；
```
<form class="form-horizontal w5c-form demo-form" role="form" w5c-submit="vm.saveEntity(form_validate)"
      w5c-form-validate="vm.validateOptions" novalidate name="validateForm">
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
            <input required="" ng-pattern="/^[A-Za-z]{1}[0-9A-Za-z_]{1,19}$/" ng-model="entity.name"
                   class="form-control" name="username" placeholder="输入用户名">
        </div>
    </div>
    <div class="form-group">
        <label class="col-sm-2 control-label">密码</label>

        <div class="col-sm-10">
            <input type="password" required="" ng-model="entity.password" name="password"
                   class="form-control" ng-minlength="5" ng-maxlength="15"
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
    <div class="form-group" ng-show="validateForm.$errors.length > 0 && vm.showErrorType == 2">
        <label class="col-sm-2 control-label"></label>

        <div class="col-sm-10">
            <div class="alert alert-danger">{{validateForm.$errors[0]}}</div>
        </div>
    </div>

    <div class="form-group">
        <div class="col-sm-offset-2 col-sm-10">
            <button type="submit" class="btn btn-success"> 验证</button>
        </div>
    </div>
</form>
```

#注意事项：
1. 由于验证使用的是 angular的form验证，所以必须要保证form和验证的元素都要有name属性；
1. 如果你不想把验证成功事件w5c-submit写在 form上，可以直接在form里面的其他元素上使用w5cFormSubmit指令，如：
```
<button type="buttom" w5c-form-submit="vm.saveEntity()" class="btn btn-success"> 验证</button>```

#参数


|名称|默认值|作用
|------|-----|------
|blurTrig|false|光标移除元素后是否验证并显示错误提示信息
|showError|true|可以是bool和function，每个元素验证不通过后调用该方法显示错误信息，默认true，显示错误信息在元素的后面。
|removeError|true|可以是bool和function，每个元素验证通过后调用该方法移除错误信息，默认true，验证通过后在元素的后面移除错误信息。
