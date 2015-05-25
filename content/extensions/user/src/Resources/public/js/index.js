(function($, drafTerbit) {

    drafTerbit.users = {};

    if (window.location.hash == '') {
        window.location.hash = 'all';
    }

    $('.users-status-filter option[value="'+urlHash+'"]').prop('selected', true);

    
    var urlHash = window.location.hash.replace('#','');

      drafTerbit.users.dt =  $("#users-data-table").dataTable(
        {
            ajax: {
                url: drafTerbit.adminUrl+"/user/data/"+urlHash,
            },
            columnDefs: [
                {orderable: false, searchable:false, targets:0, render: function(d,t,f,m) { return '<input type="checkbox" name="users[]" value="'+d+'">' } },
                {targets:1, render: function(d,t,f,m){ return '<a class="user-edit-link" href="'+drafTerbit.adminUrl+'/user/edit/'+f[0]+'">'+d+'</a>' }}
            ]
          }
      );
  
        drafTerbit.replaceDTSearch(drafTerbit.users.dt);

        $('#users-checkall').checkAll({showIndeterminate:true});

        filterByStatus = function(status){

            var status = status || 'all';

            drafTerbit.users.dt.api().ajax.url(drafTerbit.adminUrl+"/user/data/"+status).load();
            window.location.hash = status;
        }

    $('#users-index-form').ajaxForm(
        {
            beforeSend: function(){
                if (confirm(__('Are you sure you want to delete those users, this con not be undone ?'))) {
                    return true;
                } else {
                    return false;
                }
            },
            success: function(){
                var urlHash2 = window.location.hash.replace('#','');
                drafTerbit.users.dt.api().ajax.url(drafTerbit.adminUrl+"/user/data/"+urlHash2).load();
            }
        }
    );

        //status-filter
        $('.users-status-filter').on(
            'change',
            function(){
                var s = $(this).val();
                filterByStatus(s);
            }
        );


})(jQuery, drafTerbit);