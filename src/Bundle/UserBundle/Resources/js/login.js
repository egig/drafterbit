(function($){
    $('form').ajaxForm({
            beforeSend: function(){
                $('.btn-login').text(__('LOGGING IN')+'\u2026');
                $('.btn-login').addClass('disabled');
            },
            success: function(res){
                if (res.error) {
                $('.btn-login').text(__('LOGIN'));
                $('.btn-login').removeClass('disabled');
                    $.notify(res.message, 'error');
                } else {
                    window.location.replace(res.next);
                }
            }
        }
    );
    
})(jQuery);