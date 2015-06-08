(function($, drafTerbit) {

    if (window.location.hash == '') {
        window.location.hash = 'all';
    }
    var urlHash = window.location.hash.replace('#','');
    var filterByStatus = function(status) {

        var status = status || 'all';

        drafTerbit.blog.dt.api().ajax.url(drafTerbit.adminUrl+"blog/post/data/"+status).load();
        window.location.hash = status;
    }

    // change trash, add restore button
    var changeUncreateAction = function(s){
        if (s === 'trashed') {
            $('.uncreate-action').html('<i class="fa fa-trash-o"></i> '+__('Delete')).val('delete');
            $('.uncreate-action').before('<button type="submit" name="action" value="restore" class="btn btn-sm btn-default posts-restore"><i class="fa fa-refresh"></i> '+__('Restore')+'</button>');
        } else {
            $('.uncreate-action').html('<i class="fa fa-trash-o"></i> '+__('Trash')).val('trash');
            $('.posts-restore').remove();
        }
    }

    drafTerbit.blog = {};
    drafTerbit.blog.post = {

        handleIndexForm: function(selector) {
            $(selector).ajaxForm({
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
                        drafTerbit.blog.dt.api().ajax.url(drafTerbit.adminUrl+"blog/post/data/"+urlHash2).load();
                    }
                }
            );
        },

        handleFilter: function (selector) {

            $(selector+' option[value="'+urlHash+'"]').prop('selected', true);

            //status-filter
            $(selector).on(
                'change',
                function(){
                    var s = $(this).val();
                    filterByStatus(s);
                    changeUncreateAction(s);
                }
            );

            changeUncreateAction(urlHash);
        },

        handleIndexTable: function (selector, checkSelector) {

            drafTerbit.blog.dt =  $(selector).dataTable({
                columns: [
                    {data: 'id'},
                    {data: 'title'},
                    {data: 'author'},
                    {data: 'updated_at'},
                ],
                ajax: {
                    url: drafTerbit.adminUrl+"blog/post/data/"+urlHash,
                },
                columnDefs: [
                    {orderable: false, searchable:false, targets:0, render: function(d,t,f,m) { return '<input type="checkbox" name="posts[]" value="'+d+'">'}},
                    {render: function(d,t,f,m){ return '<a href="'+drafTerbit.adminUrl+'blog/post/edit/'+f.id+'">'+d+'</a>'}, targets:1},
                    {render: function(d,t,f,m){ return '<a href="'+drafTerbit.adminUrl+'user/edit/'+f.user_id+'">'+d+'</a>'}, targets:2},
                    {align:"center", targets:2}
                ]
            });

            drafTerbit.replaceDTSearch(drafTerbit.blog.dt);

            $(checkSelector).checkAll({showIndeterminate:true});
        }
    }

})(jQuery, drafTerbit);