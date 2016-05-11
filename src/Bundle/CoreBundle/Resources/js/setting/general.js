(function($){

    var generalSetting = {

        showFirstTab: function() {
            if (location.hash) {
                $('a[href="'+location.hash+'"]').tab('show');
            } else {
                $('ul#dt-setting-tab li:first-child a').tab('show');
            }
        },

        handleForm: function(){
            $('#setting-form').ajaxForm({
                success: function(response) {
                    $.notify(response.message, response.status);
                }
            });
        },

        tabCollapse: function(){
            $('#dt-setting-tab').tabCollapse();
        }
    }

    generalSetting.showFirstTab();
    generalSetting.handleForm();
    generalSetting.tabCollapse();

})(jQuery);
