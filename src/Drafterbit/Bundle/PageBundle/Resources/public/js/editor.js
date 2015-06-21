(function($, CKEDITOR){


    drafTerbit.pageEditor = {

        titleSelector: 'input[name="page[title]"]',
        slugSelector: 'input[name="page[slug]"]',

        syncSlugAndTitle: function() {
            $(this.titleSelector).on('keyup', this.syncSlugTitle);
        },

        desyncSlugAndTitle: function() {
            $(this.titleSelector).off('keyup', this.syncSlugTitle);

        },

        syncSlugTitle: function(e) {
            var val = $(drafTerbit.pageEditor.titleSelector).val()
                .toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
            $(drafTerbit.pageEditor.slugSelector).val(val);
        }
    }

    var form = $('#page-edit-form'),
        spinner = $('i.spinner'),
        id = $('input[name="page[id]"]'),
        closeText = $('.dt-editor-close-text');

    // remove error message
    $(':input').on(
        'focus',
        function(){
            $(this).siblings('.error-msg').remove();
            $(this).closest('.form-group').removeClass('has-error');
        }
    );

    form.ajaxForm({
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
                    drafTerbit.pageEditor.desyncSlugAndTitle();
                    $.notify(data.message, data.status);
                }
            }

            closeText.text(__('Close'));
        }
    });

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
                return __('Discard unsaved changes ?'); }
        };

    })();

})(jQuery, CKEDITOR);