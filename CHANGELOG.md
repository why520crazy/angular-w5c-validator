## v2.4.0
添加动态元素的验证

## v2.3.9

1. FIX BUG for https://github.com/why520crazy/angular-w5c-validator/issues/17

1. Form 表单添加了 reset 方法重置表单和错误信息，https://github.com/why520crazy/angular-w5c-validator/labels/enhancement

## v2.3.1
Fix BUG for https://github.com/why520crazy/angular-w5c-validator/issues/7，单层级表单元素的has-error添加到form元素上的问题

## v2.3.0
Fix BUG for https://github.com/why520crazy/angular-w5c-validator/issues/6，不依赖于jQuery

## v2.2.0

1. 添加 w5cValidatorProvider.setDefaultRules 方法，设置默认提示信息规则，可以通过次方法设置国际化。

1. 添加 type="url" 、max、min验证规则的错误提示。

## v2.1.0

1. 添加w5cRepeat directive做级联验证，如：重复密码验证。

1. 添加w5cUniqueCheck (远程验证，常用于检验用户名邮箱是否存在) ，w5cUniqueCheck默认检验是否已经存在，存在验证不通过，不存在验证通过，如果isExists设置为false表示：存在验证通过，不存在验证不通过。

1. 此版本添加到bower上了，可以通过`bower install angular-w5c-validator` 进行安装。

## v2.0.0

1. 模块独立为 w5c.validator ，引用需要显式的指定依赖；如：```angular.module("app",["w5c.validator"])```

1. 去除全局的w5cValidator对象，添加了w5cValidator 服务；

1. 设置全局属性的方法从 init 变成config；

1. 设置全局的配置和信息提示规则，需要使用 w5cValidator 服务；
    <pre>
     app.config(["w5cValidatorProvider", function (w5cValidatorProvider) {
            // 全局配置
            w5cValidatorProvider.config({
                blurTrig   : false,
                showError  : true, // bool or function
                removeError: true  // bool or function

            });
            w5cValidatorProvider.setRules({
                xxx   : {
                    required: "输入的邮箱地址不能为空",
                    email   : "输入邮箱地址格式不正确"
                }
            });
        }]);
    </pre>

1. 不仅提供全局的配置，还提供了单个form的配置功能，配置的参数写在 w5c-form-validate="{blurTrig:true}"

## v1.x


1. 全局的 w5cValidator对象，设置全局属性使用 w5cValidator.init，配置规则使用 w5cValidator.set_rules；

1. 在form上使用 w5c-form-validate 指令表示该form使用 w5cValidator；

1. form上使用w5c-submit指令设置验证成功后的form submit事件；

1. 在form元素内使用 w5c-form-submit 指令设置验证成功后的form submit事件；
