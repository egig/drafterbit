(function($, drafTerbit) {

    let dt = $("#log-data-table").dataTable(
        {
            ajax: {
                url: drafTerbit.deskUrl+'system/log/data'
            },
            columns: [
                {data: 'id', orderable: false, searchable:false, render: function(d,t,f,m) { return '<input type="checkbox" name="log[]" value="'+d+'">' } },
                {data: 'time'},
                {data: 'msg'}
            ],
            drawCallback: function() {
                drafTerbit.handleFooter();
            }
        }
    );

    drafTerbit.replaceDTSearch(dt);

    $('#log-checkall').checkAll({showIndeterminate:true});

    // handle inder form
    $('#log-index-form').ajaxForm(
        {
            beforeSend: function(){
              return confirm(__('Are you sure you want to clear logs, this con not be undone ?'));
            },
            success: function(response){
                $.notify(response.message, response.status);
                dt.api().ajax.reload();
            }
        }
    );


})(jQuery,drafTerbit);
