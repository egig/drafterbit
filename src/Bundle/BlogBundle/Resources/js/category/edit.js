(function($){

    var form = $('#category-edit-form'),
        id = $('input[name="blog_category[id]"]'),
        closeText = $('.dt-editor-close-text');

    // remove error message
    $(':input').on(
        'focus',
        function(){
            $(this).siblings('.error-msg').remove();
            $(this).closest('.form-group').removeClass('has-error');
        }
    );

    form.ajaxForm(
        {
            dataType: 'json',

            success:function(data){
            
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

                closeText.text('Close');
            }
        }
    );

    // check form before leaving page
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