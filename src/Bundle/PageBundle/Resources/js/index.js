(function($, drafTerbit) {

    drafTerbit.pages = {};

    if (window.location.hash == '') {
        window.location.hash = 'all';
    }

    var urlHash = window.location.hash.replace('#','');

    $('.page-status-filter option[value="'+urlHash+'"]').prop('selected', true);

    drafTerbit.pages.dt = $("#page-data-table").dataTable(
        {
            responsive: true,
            ajax: {
                url: drafTerbit.adminUrl+"page/data/"+urlHash,
            },
            columns: [
                {},
                {},
                {}
            ],
            columnDefs: [
                {orderable: false, searchable:false, targets:[0], render: function(d,t,f,m) { return '<input type="checkbox" name="pages[]" value="'+d+'">'}},
                {render: function(d,t,f,m) { return '<a href="'+drafTerbit.adminUrl+'page/edit/'+f[0]+'">'+d+'</a>'}, targets:1}
            ]
        }
    );

    drafTerbit.replaceDTSearch(drafTerbit.pages.dt);

    // Checks
    $('#page-checkall').checkAll({showIndeterminate:true});

    filterByStatus = function(status){

        var status = status || 'all';

        drafTerbit.pages.dt.api().ajax.url(drafTerbit.adminUrl+"page/data/"+status).load();
        window.location.hash = status;

        //refresh pages index form
    }

    // change trash, add restore button
    changeUncreateAction = function(s){
        if (s === 'trashed') {
            $('.uncreate-action').html('<i class="fa fa-trash-o"></i> '+__('Delete')).val('delete');
            $('.uncreate-action').before('<button type="submit" name="action" value="restore" class="btn btn-default pages-restore"><i class="fa fa-refresh"></i> '+__('Restore')+' </button>');
        } else {
            $('.uncreate-action').html('<i class="fa fa-trash-o"></i> '+__('Trash')).val('trash');
            $('.pages-restore').remove();
        }
    }

    changeUncreateAction(urlHash);

    $('#page-index-form').ajaxForm({
        beforeSubmit: function(formData, jqForm, x){

            for (var i=0; i < formData.length; i++) {
                if(formData[i].name == 'action') {

                    if (formData[i].value == 'delete') {
                        if (confirm(__('Are you sure ? this can not be undone.'))) {
                            return true;
                        }
                    }

                    return true;
                }
            }

            return false;
        },
        success: function(response){
           $.notify(response.message, response.status);
            var urlHash2 = window.location.hash.replace('#','');
            drafTerbit.pages.dt.api().ajax.url(drafTerbit.adminUrl+"page/data/"+urlHash2).load();
        }
    });

    //status-filter
    $('.page-status-filter').on(
        'change',
        function(){
            var s = $(this).val();
            filterByStatus(s);
            changeUncreateAction(s);
        }
    );

})(jQuery, drafTerbit);
