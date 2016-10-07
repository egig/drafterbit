let dirty;

(function($){

    var form = $('#category-edit-form'),
        id = $('input[name="category[id]"]'),
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

                if (data.id) {
                    id.val(data.id);

                    $.notify(data.message, data.status);
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
