(function($){
     // sort widgets
    drafTerbit.dashboard = {

        handleEditToggler: function(){
            /*$('.dt-panel-edit-toggler').click(function(e){
                e.preventDefault();
                alert('ok');
            });*/
            $('#dt-panel-edit-modal').on('show.bs.modal', function(e){
                var id = $(e.relatedTarget).data('id');
                var content = $(this).find('.modal-content');
                content.load(drafTerbit.adminUrl+'system/dashboard/edit/'+id);
            });
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

        makePanelSortable: function() {

            $('#dt-panels-left, #dt-panels-right').sortable(
                {
                    items: "div.panel-item:not(.placeholder)",
                    connectWith:'.panel-row',
                    placeholder: 'placeholder',
                    forcePlaceholderSize: true,
                    update: function(e, ui) {

                        //var parent = ui.item.parent();
                        var pos = $(e.target).data('pos');

                        var ids = $(e.target).sortable('toArray');

                        var orders = ids.join(',');

                        $.ajax(
                            {
                                url: drafTerbit.adminUrl+"system/dashboard/sort",
                                global: false,
                                type: "POST",
                                async: false,
                                dataType: "html",
                                data: {
                                    order:orders,
                                    pos: pos
                                },
                                success: function(html){}
                            }
                        );
                    }
                }
            );
        }
    }


    drafTerbit.dashboard.makePanelSortable();
    drafTerbit.dashboard.handleEditToggler();
    drafTerbit.dashboard.handleEditForm();

})(jQuery);
