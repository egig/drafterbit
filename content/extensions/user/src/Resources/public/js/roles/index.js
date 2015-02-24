 (function($, drafTerbit) {

    drafTerbit.roles = {};

    drafTerbit.roles.dt =   $("#roles-data-table").dataTable(
        {
            ajax: {
                url: drafTerbit.adminUrl+"/user/roles/data/all.json",
            },
            columnDefs: [
                {orderable: false, searchable:false, targets:0, render: function(d,t,f,m){ return '<input type="checkbox" name="roles[]" value="'+d+'">' }},
                {targets:1, render: function(d,t,f,m){ return '<a class="role-edit-link" href="'+drafTerbit.adminUrl+'/user/roles/edit/'+f[0]+'">'+d+'</a>' }}
            ]
        }
    );

        drafTerbit.replaceDTSearch(drafTerbit.roles.dt);

        $('#roles-checkall').checkAll({showIndeterminate:true});

        $('#roles-index-form').ajaxForm(
            {
                dataType: 'json',
                beforeSend: function(){
                    if (confirm(__('Are you sure you want to delete those roles, this con not be undone ?'))) {
                        return true;
                    } else {
                        return false;
                    }
                },
                success: function(res){
                    $.notify(res.message, res.status);
                      drafTerbit.roles.dt.api().ajax.url(drafTerbit.adminUrl+"/user/roles/data/all.json").load();
                }
            }
        );

})(jQuery, drafTerbit);