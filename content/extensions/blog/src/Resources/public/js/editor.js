(function($, tagOptions, tags, CKEDITOR){

    var form = $('#post-edit-form'),
        spinner = $('i.spinner'),
        id = $('input[name="id"]'),
        closeText = $('.dt-editor-close-text');

    //magisuggest-ify tags
    var tagsInput = $('#tags').magicSuggest(
        {
            name: 'tags',
            cls: 'tags-input',
            placeholder: 'add tags here',
            hideTrigger: true,
            toggleOnClick: true,
            maxSuggestions: 5,
            data: tagOptions,
            value: tags,
            highlight: false
        }
    );

    // change dropdown default width and position
    // of magicsuggest
    $(tagsInput).on(
        'expand',
        function(c){

            pos = $('.ms-sel-ctn').find('input').position();
            h = $('.ms-sel-ctn').find('input').height();

            var ctn = $('.ms-res-ctn');

            if(ctn.children().length < 1) {
                ctn.css({display: 'none'});
            } else {
                ctn.css(
                    {
                        width: "auto",
                        position: "absolute",
                        top: (pos.top + h) + "px",
                        left: (pos.left) + "px",
                    }
                );
            }
        }
    );

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
            beforeSerialize: function() {
                // fixes ckeditor content
                for (instance in CKEDITOR.instances) {
                    CKEDITOR.instances[instance].updateElement();
                }
            },

            beforeSend: function(){
                spinner.removeClass('fa-check');
                spinner.addClass('fa-spin fa-spinner');
            },

            success:function(data){
            
                dirty = false;
                spinner.removeClass('fa-spin fa-spinner');
                spinner.addClass('fa-check');

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

        for (instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].on(
                'change',
                function(){
                    dirty = true;
                }
            );
        }

        return function(e) {
            if (dirty) {
                return __('Discard unsaved changes ?');
            }
        };

    })();

})(jQuery, tagOptions, tags, CKEDITOR);