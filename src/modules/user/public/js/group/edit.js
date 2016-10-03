(function($){

  let dirty =false;

    if (location.hash) {
        $('a[href="'+location.hash+'"]').tab('show');
    } else {
        $('ul#dt-group-role-tab li:first-child a').tab('show');
    }

    var form = $('#group-edit-form'),
        id = $('input[name="group[id]"]');

    // remove error message
    $(':input').on(
        'focus',
        function(){
            $(this).siblings('.error-msg').remove();
            $(this).closest('.form-group').removeClass('has-error');
        }
    );
    //form
    form.ajaxForm(
        {
          error: function(xhr) {
            var data = xhr.responseJSON;
            if (data.errors) {
                if (data.errorType == 'validation') {
                    for (var i in data.errors) {

                        var inputCtn = $(':input[name="'+data.errors[i].param+'"]').closest('.form-group');
                        inputCtn.addClass('has-error');

                        if (!inputCtn.children('.error-msg').length) {
                            inputCtn.append('<span class="help-block error-msg">'+data.errors[i].msg+'</span>');
                        }
                    }
                }
            }
          },
            success: function(data){

                dirty = false;

                if (data.id) {
                    id.val(data.id);

                    $.notify(data.message, data.status);
                }
            }
        }
    );

    // check form before leaving page
    dirty = false;

    window.onbeforeunload = (function() {


        form.on(
            'change',
            ':input',
            function() {
                dirty = true;
            }
        );

        return function(e) {
            if (dirty) {
                return __('Discard unsaved changes ?');
            }
        };

    })();

})(jQuery);
