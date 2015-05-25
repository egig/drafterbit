(function($, document, drafTerbit){

    var displaySection = function(){
        var h = window.location.hash || '#start';
        
        $('.install-section').hide();
        $(h).fadeIn();
    };
    
    displaySection();

    window.onhashchange = function(){
        displaySection();
    }

    $('.static-form').ajaxForm(
        {
            dataType: 'json',
            success: function(res, status, xhr, form){
                if (res.message == 'ok') {
                    var next = form.data('next');
                    $('.install-section').hide();
                    window.location.hash = next;
            
                } else if (res.config) {
                    $('.config-textarea textarea').text(res.config);
                    $('.config-textarea').modal('show');

                } else {
                    $.notify(res.message, 'danger');
                }
            }
        }
    );

    $('.install-form').ajaxForm(
        {
            beforeSend: function(){
                $('.install-trapper').fadeIn();
            },
            success: function(res, status, xhr, form){
            
                $('.install-trapper').fadeOut();

                if (res.message == 'ok') {
                    $.notify('Installation success !', 'success');
                    setTimeout(
                        window.location.hash = 'success',
                        3000
                    );
                }
            }
        }
    );

})(jQuery, document, drafTerbit);