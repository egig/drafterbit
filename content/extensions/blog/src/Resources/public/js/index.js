(function($, drafTerbit) {

    drafTerbit.blog = {};

    if (window.location.hash == '') {
        window.location.hash = 'all';
    }
        
    var urlHash = window.location.hash.replace('#','');

    $('.blog-status-filter option[value="'+urlHash+'"]').prop('selected', true);

    drafTerbit.blog.dt =  $("#posts-data-table").dataTable({
        columns: [
            {data: 'id'},
            {data: 'title'},
            {data: 'author'},
            {data: 'updated_at'},
        ],
        ajax: {
            url: drafTerbit.adminUrl+"/posts/data/"+urlHash,
        },
        columnDefs: [
            {orderable: false, searchable:false, targets:0, render: function(d,t,f,m) { return '<input type="checkbox" name="posts[]" value="'+d+'">'}},
            {render: function(d,t,f,m){ return '<a href="'+drafTerbit.adminUrl+'/posts/edit/'+f.id+'">'+d+'</a>'}, targets:1},
            {render: function(d,t,f,m){ return '<a href="'+drafTerbit.adminUrl+'/user/edit/'+f.user_id+'">'+d+'</a>'}, targets:2},
            {align:"center", targets:2}
        ]
    });

    drafTerbit.replaceDTSearch(drafTerbit.blog.dt);

    $('#posts-checkall').checkAll({showIndeterminate:true});

    filterByStatus = function(status) {

        var status = status || 'all';

        drafTerbit.blog.dt.api().ajax.url(drafTerbit.adminUrl+"/posts/data/"+status).load();
        window.location.hash = status;
    }

    // change trash, add restore button
    changeUncreateAction = function(s){
        if (s === 'trashed') {
            $('.uncreate-action').html('<i class="fa fa-trash-o"></i> '+__('Delete')).val('delete');
            $('.uncreate-action').before('<button type="submit" name="action" value="restore" class="btn btn-sm btn-default posts-restore"><i class="fa fa-refresh"></i> '+__('Restore')+'</button>');
        } else {
            $('.uncreate-action').html('<i class="fa fa-trash-o"></i> '+__('Trash')).val('trash');
            $('.posts-restore').remove();
        }
    }

    changeUncreateAction(urlHash);
    
    $('#posts-index-form').ajaxForm(
        function(response){
            if (response.error) {
                $.notify(response.error.message, 'error');
            }

            var urlHash2 = window.location.hash.replace('#','');
            drafTerbit.blog.dt.api().ajax.url(drafTerbit.adminUrl+"/posts/data/"+urlHash2).load();
        }
    );

    //status-filter
    $('.blog-status-filter').on(
        'change',
        function(){
            var s = $(this).val();
            filterByStatus(s);
            changeUncreateAction(s);
        }
    );

})(jQuery, drafTerbit);