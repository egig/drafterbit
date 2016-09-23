'use strict';

(function ($) {
    $('#user_groups').chosen();

    var form = $('#user-edit-form'),
        id = $('input[name="id"]');

    //form
    $('#user_roles_chosen input', ':input').on('focus', function () {});

    // remove error message
    $(':input').on('focus', function () {
        $(this).closest('.form-group').find('.error-msg').remove();
        $(this).closest('.form-group').removeClass('has-error');
    });

    form.ajaxForm({
        error: function error(xhr) {
            var data = xhr.responseJSON;
            if (data.errors) {
                if (data.errorType == 'validation') {
                    for (var i in data.errors) {

                        var inputCtn = $(':input[name="' + data.errors[i].param + '"]').closest('.form-group');
                        inputCtn.addClass('has-error');

                        if (!inputCtn.children('.error-msg').length) {
                            inputCtn.append('<span class="help-block error-msg">' + data.errors[i].msg + '</span>');
                        }
                    }
                }
            }
        },
        success: function success(data) {

            dirty = false;

            if (data.errors) {
                if (data.errorType == 'validation') {
                    for (err in data.errors) {

                        var inputCtn = $(':input[name="' + err.param + '"]').closest('.form-group');
                        inputCtn.addClass('has-error');

                        if (!inputCtn.children('.error-msg').length) {
                            inputCtn.append('<span class="help-block error-msg">' + err.msg + '</span>');
                        }
                    }
                }
            } else {
                if (data.id) {
                    id.val(data.id);

                    $.notify(data.message, data.status);
                }
            }
        }
    });

    // check form before leaving page
    dirty = false;

    window.onbeforeunload = function () {

        form.on('change', ':input', function () {
            dirty = true;
        });

        return function (e) {
            if (dirty) {
                return __('Discard unsaved changes ?');
            }
        };
    }();
})(jQuery);