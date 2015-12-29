 (function($, drafTerbit) {

    drafTerbit.group = {};

    drafTerbit.group.dt =   $("#group-data-table").dataTable(
        {
            responsive: true,
            ajax: {
                url: drafTerbit.adminUrl+"user/group/data/all",
            },
            columnDefs: [
                {orderable: false, searchable:false, targets:0, render: function(d,t,f,m){ return '<input type="checkbox" name="group[]" value="'+d+'">' }},
                {targets:1, render: function(d,t,f,m){ return '<a class="role-edit-link" href="'+drafTerbit.adminUrl+'user/group/edit/'+f[0]+'">'+d+'</a>' }}
            ]
        }
    );

        drafTerbit.replaceDTSearch(drafTerbit.group.dt);

        $('#group-checkall').checkAll({showIndeterminate:true});

        $('#group-index-form').ajaxForm(
            {
                dataType: 'json',
                beforeSend: function(){
                    if (confirm(__('Are you sure you want to delete those group, this con not be undone ?'))) {
                        return true;
                    } else {
                        return false;
                    }
                },
                success: function(res){
                    $.notify(res.message, res.status);
                      drafTerbit.group.dt.api().ajax.url(drafTerbit.adminUrl+"user/group/data/all").load();
                }
            }
        );

})(jQuery, drafTerbit);
