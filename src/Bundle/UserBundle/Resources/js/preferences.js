(function($, drafTerbit) {

	drafTerbit.userPreferences = {

		showFirstTab: function() {
            if (location.hash) {
                $('a[href="'+location.hash+'"]').tab('show');
            } else {
                $('ul#dt-preferences-tab li:first-child a').tab('show');
            }
        },

		handlePanelEdit: function(){
			$('#dt-panel-edit-modal').on('show.bs.modal', function(e) {
				$('#dt-available-panels').modal('hide');

				var id = $(e.relatedTarget).data('id');
				$(this).find('.modal-content').load(drafTerbit.adminUrl+'system/dashboard/edit/'+id);
			});
		},

		handleTablcollapse: function(){
            $('#dt-preferences-tab').tabCollapse();
		},

		handleEditForm: function() {

            $(document).on('submit', '.dt-panel-edit-form', function(e){
                e.preventDefault();
                $(this).ajaxSubmit({
                    success: function(response) {
                        if(!response.errors) {
                            $.notify(response.data.message, 'success');
                        }
                    }
                });
            });
        },

        handlePanelDelete: function() {
        	$('.dt-panel-delete').click(function() {

        		var id = $(this).data('id');

        		if(confirm(__('Are you sure ?'))) {    			
	        		$.ajax({
	        			type: 'POST',
	        			data: {
	        				id: id,
	        				_token: drafTerbit.csrfToken
	        			},
	        			url: drafTerbit.adminUrl+'system/dashboard/delete'
	        		});
        		}

        	});
        }
	}

	drafTerbit.userPreferences.showFirstTab();
	drafTerbit.userPreferences.handleTablcollapse();
	drafTerbit.userPreferences.handlePanelEdit();
	drafTerbit.userPreferences.handleEditForm();
	drafTerbit.userPreferences.handlePanelDelete();

})(jQuery, drafTerbit);