(function($, CKEDITOR){

  let dirty = false;

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
            for (let instance in CKEDITOR.instances) {
                CKEDITOR.instances[instance].updateElement();
            }
        },

        beforeSend: function(){
            spinner.removeClass('fa-check');
            spinner.addClass('fa-spin fa-spinner');
        },
        /**
         * @todo make this usable
         */
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

        success:function(data){

            dirty = false;
            spinner.removeClass('fa-spin fa-spinner');
            spinner.addClass('fa-check');

            if (data.id) {
                id.val(data.id);
                drafTerbit.pageEditor.desyncSlugAndTitle();
                $.notify(data.message, data.status);
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

        for (let instance in CKEDITOR.instances) {
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
