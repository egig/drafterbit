(function($){

	var generalSetting = {

		showFirstTab: function() {
		    if (location.hash) {
		        $('a[href="'+location.hash+'"]').tab('show');
		    } else {
		        $('ul.nav-stacked-left li:first-child a').tab('show');
		    }
		},

		handleForm: function(){
			$('#setting-form').ajaxForm({
				success: function(response) {
					$.notify(response.message, response.status);
				}
			});
		}
	}

	generalSetting.showFirstTab();
	generalSetting.handleForm();

})(jQuery);