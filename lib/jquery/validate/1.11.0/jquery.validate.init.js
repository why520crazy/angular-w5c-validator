define(function(require, exports, module) {
	require('jquery');
	require.async('./jquery.validate', function() {
		require.async('./additional-methods');
		require.async('./localization/messages_zh');

		$.validator.setDefaults({

			messages: {},
			groups: {},
			rules: {},
			errorClass: 'help-inline',
			validClass: 'help-inline',
			errorElement: "label",
			focusInvalid: false,
			errorContainer: $([]),
			errorLabelContainer: $([]),
			onsubmit: true,
			focusCleanup: false,
			// onfocusout: true,
			// onkeyup: true,
			onclick: true,
			errorElement: 'span',
			// wrapper: "",
			submitHandler: function(form) {
				seajs.log('submited!!');
			},
			invalidHandler: function(form) {
				//在Submit之前，且驗證失敗。
				seajs.log('un-submited');
			},
			onfocusin: function( element, event ) {
				this.lastActive = element;

				// hide error label and remove error class on focus if enabled
				if ( this.settings.focusCleanup && !this.blockFocusCleanup ) {
					exports.unhighlight(element, this.settings.errorClass, this.settings.validClass );
					this.addWrapper(this.errorsFor(element)).hide();
				}
			},
			errorPlacement:function(error,element){
				error.appendTo(element.parent().parent(".controls"));
			},
			showErrors: function() {
				// seajs.log(this.errorList);
				var i, elements;
				for (i = 0; this.errorList[i]; i++) {
					var error = this.errorList[i];
					exports.highlight(error.element, this.settings.errorClass, this.settings.validClass);
					this.showLabel(error.element, error.message);
				}
				if (this.errorList.length) {
					this.toShow = this.toShow.add(this.containers);
				}
				if (this.settings.success) {
					for (i = 0; this.successList[i]; i++) {
						this.showLabel(this.successList[i]);
					}
				}
				for (i = 0, elements = this.validElements(); elements[i]; i++) {
					exports.unhighlight(elements[i], this.settings.errorClass, this.settings.validClass);
				}
				this.toHide = this.toHide.not(this.toShow);
				this.hideErrors();
				this.addWrapper(this.toShow).show();
			}
		});
	});

	exports.highlight = function(element, errorClass, validClass) {
		$(element).parent().parent().parent(".control-group").removeClass("success");
		$(element).parent().parent().parent(".control-group").addClass("error");
	}
	exports.unhighlight = function(element, errorClass, validClass) {
		$(element).parent().parent().parent(".control-group").removeClass("error");
	}
})