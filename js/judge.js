/**
 * Make sure to use the same value than the server to run validations.
 * Used by validations that need access to the database in real time such as uniqueness.
 * Change if you use a custom path.
 */
//judge.enginePath = '/judge';

/**
 * Dynamic validation field by field on events. (i.e: onblur, ...)
 * Based on the bootstrapValidator design but don't use it.
 * Icons require font-awesome.
 *
 * @see https://github.com/joecorcoran/judge/issues/13
 * @see http://bootstrapvalidator.com/getting-started/
 *
 * @example To no validate an entire form, just add the data-novalidate html5 attr.
 *            html: { 'data-novalidate' => true }
 */
(function($, window) {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  var FormValidator = (function() {
    // Parent of all inputs.
    var PARENT_INPUT_BASE_CLASSES = 'has-feedback';

    var PARENT_INPUT_ERROR_CLASS = 'has-error';
    var PARENT_INPUT_SUCCESS_CLASS = 'has-success';
    //var PARENT_INPUT_VALIDATING_CLASS = 'has-warning';

    // Inputs.
    var INPUT_ERROR_CLASS = 'error';
    var INPUT_SUCCESS_CLASS = 'success';

    // Error messages.
    var DIV_ERROR_MESSAGE_CLASS = 'help-block';

    // Icons.
    var ICON_BASE_CLASSES = 'form-control-feedback';

    var ICON_SUCCESS = 'fa fa-check';
    var ICON_ERROR = 'fa fa-times';
    //var ICON_VALIDATING = 'fa fa-refresh';

    // Default options to apply.
    FormValidator.prototype.defaultOptions = {
      // Performs live validation, on value change.
      live: {
        not_validated: true,
        valid: true,
        invalid: true
      }
    };

    /**
     * Initialize.
     * Bind functions.
     *
     * @param $el
     * @param options
     * @constructor
     */
    function FormValidator($el, options) {
      this._invalid = __bind(this._invalid, this);
      this._valid = __bind(this._valid, this);
      this.validateInput = __bind(this.validateInput, this);
      this.validateAll = __bind(this.validateAll, this);
      this.$el = $el;
      this.options = $.extend({}, this.defaultOptions, options);
      this.bindEvents();
    }

    /**
     * Bind all events on the input. (i.e: blur, ...)
     *
     * @returns {*}
     */
    FormValidator.prototype.bindEvents = function() {
      // Bind - Validate the field if it contains the data-validate attribute.
      this.$el.on('blur', '[data-validate]', (function(_this) {
        return function(e) {
          return _this.validateInput(e.currentTarget);
        };
      })(this));

      // Bind - Validate the field if the element has already been checked when we change the value.
      this.$el.on('input', this._generateSelectorOnInput(), (function(_this) {
        return function(e) {
          return _this.validateInput(e.currentTarget);
        };
      })(this));

      // Bind - Validate the field if the value is changed, for select inputs.
      this.$el.on('change', this._generateSelectorOnInput(), (function(_this) {
        return function(e) {
          return _this.validateInput(e.currentTarget);
        };
      })(this));

      // Bind - On form submit, validate all elements.
      return this.$el.on('submit', this.validateAll);
    };

    FormValidator.prototype._generateSelectorOnInput = function() {
      var selector = '';

      if(this.options.live && this.options.live.not_validated){
        selector += '[data-validate]:not(.' + INPUT_SUCCESS_CLASS + ', .' + INPUT_ERROR_CLASS + ')';
      }

      if(this.options.live && this.options.live.valid){
        selector += (selector.length ? ', ' : '') + '[data-validate].' + INPUT_SUCCESS_CLASS;
      }

      if(this.options.live && this.options.live.invalid){
        selector += (selector.length ? ', ' : '') + '[data-validate].' + INPUT_ERROR_CLASS;
      }

      return selector;
    };

    /**
     * Validate all inputs.
     *
     * @param e
     * @returns {*}
     */
    FormValidator.prototype.validateAll = function(e) {
      // Run the validation for each field.
      $(e.currentTarget).find('[data-validate]').each((function(_this) {
        return function(_, el) {
          return _this.validateInput(el);
        };
      })(this));

      // If an input exist with the error class then don't send the form.
      if ($(e.currentTarget).find('[data-validate].' + INPUT_ERROR_CLASS)[0]) {
        e.stopPropagation();
        return e.preventDefault();
      }
    };

    /**
     * Validate one input.
     *
     * @param el
     * @returns {*}
     */
    FormValidator.prototype.validateInput = function(el) {
      return judge.validate(el, {
        valid: this._valid,
        invalid: this._invalid
      });
    };

    /**
     * Displays the first error message if exists or return null.
     *
     * @param el
     * @returns {*}
     */
    FormValidator.prototype.findOrCreateMsgItem = function(el) {
      var $item, x;
      if ((x = this.getMsgItem(el))) {
        return x;
      } else {
        $item = $("<div class='" + DIV_ERROR_MESSAGE_CLASS + "' />");
        $item.insertAfter($(el));
        return $item;
      }
    };

    /**
     * Returns the first error message if exists, or null.
     *
     * @param el
     * @returns {*}
     */
    FormValidator.prototype.getMsgItem = function(el) {
      var x;
      if ((x = $(el).parent().find('.' + DIV_ERROR_MESSAGE_CLASS))[0]) {
        return x;
      } else {
        return null;
      }
    };

    /**
     * Called when an element is valid.
     * Remove error class/messages and add success class.
     *
     * @param el
     * @returns {*}
     * @private
     */
    FormValidator.prototype._valid = function(el) {
      var _ref;
      if ((_ref = this.getMsgItem(el)) != null) {
        _ref.remove();
      }
      this._addDefaultParentClasses(el);

      $(el).removeClass(INPUT_ERROR_CLASS).addClass(INPUT_SUCCESS_CLASS);
      $(el).parent().removeClass(PARENT_INPUT_ERROR_CLASS).addClass(PARENT_INPUT_SUCCESS_CLASS);

      this._refreshIcon(el, ICON_SUCCESS);

      return $(el);
    };

    /**
     * Refresh the displayed icon.
     * Remove the element from the DOM and recreate it.
     *
     * @param el
     * @param classToApply - Either ICON_SUCCESS or ICON_ERROR
     * @private
     */
    FormValidator.prototype._refreshIcon = function(el, classToApply) {
      $(el).parent().children('i').remove();
      $item = $("<i class='" + ICON_BASE_CLASSES + " " + classToApply + "' />");
      $item.insertAfter($(el));
    };

    /**
     * Called when an element is valid.
     * Add error class and remove success class/messages.
     *
     * @param el
     * @param messages
     * @returns {*}
     * @private
     */
    FormValidator.prototype._invalid = function(el, messages) {
      this.findOrCreateMsgItem(el).text(messages.join(', '));
      this._addDefaultParentClasses(el);

      $(el).removeClass(INPUT_SUCCESS_CLASS).addClass(INPUT_ERROR_CLASS);
      $(el).parent().removeClass(PARENT_INPUT_SUCCESS_CLASS).addClass(PARENT_INPUT_ERROR_CLASS);

      this._refreshIcon(el, ICON_ERROR);

      return $(el);
    };

    /**
     * Add the default class to the parent element if they don't exists.
     * TODO Works fine when PARENT_INPUT_BASE_CLASSES contains only one class, won't if several.
     * @param el
     * @private
     */
    FormValidator.prototype._addDefaultParentClasses = function(el) {
      if(!$(el).parent().hasClass(PARENT_INPUT_BASE_CLASSES)){
        $(el).parent().addClass(PARENT_INPUT_BASE_CLASSES);
      }
    };

    return FormValidator;

  })();

  // Form.
  // Key used as data to know if the form should not be validated.
  var FORM_NO_VALIDATE = 'novalidate';
  var FORM_INPUT_BASE_CLASSES = 'form-control';

  return $.fn.extend({
    /**
     * Bind the form validation to a form or an array of forms.
     *
     * @param options - Object that contains the options for the validator. [{}]
     * @param args [infinite]
     *
     * @returns {*}
     */
    addFormValidation: function() {
      var options = arguments[0];
      var args = ((2 <= arguments.length) ? __slice.call(arguments, 1) : []);

      return this.each(function() {
        var data;

        /*
         Auto add default classes.
         */
        $(this).each(function(){
          // Filter to take only inputs.
          _.map($(this).filter(':input').context, function(element){
            // Filter to take only element that have an ID. (All simple_form have an ID)
            if($(element).context.id && $(element).context.id.length > 0){
              // Add default classes to all elements except checkboxes and buttons.
              if($(element).attr('type') != 'checkbox' && $(element).attr('type') != 'button'){
                $(element).addClass(FORM_INPUT_BASE_CLASSES);
              }
            }
          });
        });

        /*
         Don't validate forms that should not be validated.
         data-novalidate="true"
         */
        if ($(this).data(FORM_NO_VALIDATE) === true) {
          return;
        }

        // Inject the form-validator data to the form, if that wasn't already done before.
        data = $(this).data('form-validator');
        if (!data) {
          $(this).data('form-validator', (formValidator = new FormValidator($(this), options)));
        }

        // Apply options if correct format.
        if (typeof options === 'string') {
          return formValidator[options].apply(formValidator, args);
        }
      });
    }
  });
})(window.jQuery, window);

$(function(){
  // Add the form validation on all existing forms. Doesn't execute it.
  $('form').addFormValidation();
});