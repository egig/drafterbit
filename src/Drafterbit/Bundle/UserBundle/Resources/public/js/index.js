(function($, drafTerbit) {

    drafTerbit.users = {};

    if (window.location.hash == '') {
        window.location.hash = 'all';
    }

    $('.users-status-filter option[value="'+urlHash+'"]').prop('selected', true);
    
    var urlHash = window.location.hash.replace('#','');
    var renderCol1 = function(d,t,f,m){
        return '<input type="checkbox" name="users[]" value="'+d+'">';
    }
    var renderCol2 = function(d,t,f,m){
        return '<a class="user-edit-link" href="'+drafTerbit.adminUrl+'user/edit/'+f[0]+'">'+d+'</a>'
    }
    var renderCol3 = function(d,t,f,m){
        if(d == 1) {
            return __('Enabled');
        }

        return __('Disabled');
    }

      drafTerbit.users.dt =  $("#users-data-table").dataTable(
        {
            ajax: {
                url: drafTerbit.adminUrl+"user/data/"+urlHash,
            },
            columnDefs: [
                {orderable: false, searchable:false, targets:0, render: renderCol1 },
                {targets:1, render: renderCol2 },
                {targets:3, render: renderCol3 }
            ]
          }
      );
  
        drafTerbit.replaceDTSearch(drafTerbit.users.dt);

        $('#users-checkall').checkAll({showIndeterminate:true});

        filterByStatus = function(status){

            var status = status || 'all';

            drafTerbit.users.dt.api().ajax.url(drafTerbit.adminUrl+"user/data/"+status).load();
            window.location.hash = status;
        }

    // listen table form
    $('#user-index-form').ajaxForm(
        {
            beforeSend: function(){
                if (confirm(__('Are you sure you want to delete those users, this con not be undone ?'))) {
                    return true;
                } else {
                    return false;
                }
            },
            success: function(response){
                $.notify(response.message, response.status);
                var urlHash2 = window.location.hash.replace('#','');
                drafTerbit.users.dt.api().ajax.url(drafTerbit.adminUrl+"user/data/"+urlHash2).load();
            }
        }
    );

    //status-filter
    $('.user-status-filter').on(
        'change',
        function(){
            var s = $(this).val();
            filterByStatus(s);
        }
    );


})(jQuery, drafTerbit);