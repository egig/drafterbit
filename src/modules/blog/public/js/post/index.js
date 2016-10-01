(function($, drafTerbit) {

    drafTerbit.blog = {};
    drafTerbit.blog.post = {

        handleIndexForm: function(selector) {
            $(selector).ajaxForm({
                    beforeSubmit: function(formData, jqForm, x){

                        for (var i=0; i < formData.length; i++) {
                            if(formData[i].name == 'delete') {

                                if (formData[i].value == 1) {
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

        /*
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
        },*/

        handleIndexTable: function (selector, checkSelector) {

            drafTerbit.blog.dt =  $(selector).dataTable({
                responsive: true,
                columns: [
                    {data: 'id', orderable: false, searchable:false, render: function(d,t,f,m) { return '<input type="checkbox" name="posts[]" value="'+d+'">'}},
                    {data: 'title', render: function(d,t,f,m){ return '<a href="'+drafTerbit.deskUrl+'blog/post/edit/'+f.id+'">'+d+'</a>'}},
                    {data: 'author_id', render: function(d,t,f,m){ return '<a href="'+drafTerbit.deskUrl+'user/edit/'+d+'">'+f.author.realname+'</a>'}},
                    {data: 'updated_at'},
                ],
                ajax: {
                  /*
                    data: function(data) {
                        return Qs.parse(hash);
                    },*/
                    url: drafTerbit.deskUrl+"blog/post/data",
                }
            });

            drafTerbit.replaceDTSearch(drafTerbit.blog.dt);

            $(checkSelector).checkAll({showIndeterminate:true});
        }
    }

})(jQuery, drafTerbit);
