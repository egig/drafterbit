(function($, drafTerbit) {

    if (window.location.hash == '') {
        window.location.hash = '#category=0&status=all';
    }

    var hash = window.location.hash.substr(1);

    // change trash, add restore button
    var changeActions = function(s){
        if (s === 'trashed') {
            $('.uncreate-action').html('<i class="fa fa-trash-o"></i> '+__('Delete')).val('delete');
            $('.uncreate-action').before('<button type="submit" name="action" value="restore" class="btn btn-default posts-restore"><i class="fa fa-refresh"></i> '+__('Restore')+'</button>');
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
                        drafTerbit.blog.dt.api().ajax.reload();
                    }
                }
            );
        },

        handleFilter: function (statusFilterSelector, categoryFilterSelector, filterSelector) {

            var param = Qs.parse(hash);

            $(statusFilterSelector+' option[value="'+param.status+'"]').prop('selected', true);
            $(categoryFilterSelector+' option[value="'+param.category+'"]').prop('selected', true);

            $(filterSelector).on(
                'change',
                function(){

                    var param = {
                        category: $(categoryFilterSelector).val(),
                        status: $(statusFilterSelector).val()
                    }

                    hash = Qs.stringify(param);
                    window.location.hash = hash;
                    drafTerbit.blog.dt.api().ajax.reload();
                }
            );

            $(statusFilterSelector).on('change', function(){
                var status = $(statusFilterSelector).val();
                changeActions($(this).val());
            });

            changeActions($(statusFilterSelector).val());
        },

        handleIndexTable: function (selector, checkSelector) {

            drafTerbit.blog.dt =  $(selector).dataTable({
                responsive: true,
                columns: [
                    {data: 'id'},
                    {data: 'title'},
                    {data: 'author'},
                    {data: 'updated_at'},
                ],
                ajax: {
                    data: function(data) {
                        return Qs.parse(hash);
                    },
                    url: drafTerbit.adminUrl+"blog/post/data",
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
