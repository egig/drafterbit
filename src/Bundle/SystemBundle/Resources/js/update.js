(function($){
    $('#dt-update-form').ajaxForm({
        success: function(res) {
            $.notify(res.message, res.status);
        }
    });
})(jQuery);