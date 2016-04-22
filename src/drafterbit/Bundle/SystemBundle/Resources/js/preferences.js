(function($, drafTerbit) {

    drafTerbit.userPreferences = {

        init: function(){
            this.loadTable();
            this.showFirstTab();
            this.handleTablcollapse();
            this.handlePanelEdit();
            this.handleEditForm();
            this.handlePanelDelete();
        },

        loadTable: function (){
            $('.dt-panels-container').load(drafTerbit.adminUrl+'system/dashboard/data');
        },

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

            $(document).on('submit', 'form.dt-panel-edit-form', function(e){
                e.preventDefault();
                var _this = $(this);
                $(this).ajaxSubmit({
                    success: function(response) {
                        if(!response.errors) {
                            $.notify(response.data.message, 'success');
                        }

                        _this.find('input[name="panel[id]"]').val(response.data.id);
                        drafTerbit.userPreferences.loadTable();
                    }
                });
            });
        },

        handlePanelDelete: function() {
            $(document).on('click', '.dt-panel-delete', function() {

                var id = $(this).data('id');

                var _this = $(this);

                if(confirm(__('Are you sure ?'))) {                
                    $.ajax({
                        type: 'POST',
                        data: {
                            id: id,
                            _token: drafTerbit.csrfToken
                        },
                        url: drafTerbit.adminUrl+'system/dashboard/delete',
                        success: function(){
                            _this.closest('.dt-panel-item').fadeOut();
                            _this.closest('.dt-panel-item').remove();
                        }
                    });
                }

            });
        }
    }

    drafTerbit.userPreferences.init();

})(jQuery, drafTerbit);