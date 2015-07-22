(function($){

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
            success: function(data){

                dirty = false;

                if (data.error) {
                    if (data.error.type == 'validation') {
                        for (name in data.error.messages) {
                            var inputCtn = $(':input[name="'+name+'"]').closest('.form-group');
                            inputCtn.addClass('has-error');

                            if (!inputCtn.children('.error-msg').length) {
                                inputCtn.append('<span class="help-block error-msg">'+data.error.messages[name]+'</span>');
                            }
                        }
                    }

                    if (data.error.type == 'auth') {
                        $.notify(data.error.message, 'error');
                    }

                } else {
                    if (data.id) {
                        id.val(data.id);

                        $.notify(data.message, data.status);
                    }
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

    //tabCollapse
    $('#dt-group-role-tab').tabCollapse();

})(jQuery);
