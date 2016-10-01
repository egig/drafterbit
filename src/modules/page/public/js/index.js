(function($, drafTerbit) {

    drafTerbit.pages = {};

    drafTerbit.page = {

        handleForm: function() {
            $('#page-index-form').ajaxForm({
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
                    drafTerbit.pages.dt.api().ajax.url(drafTerbit.deskUrl+"page/data").load();
                }
            });
        }

        ,handleTable: function () {
             drafTerbit.pages.dt = $("#page-data-table").dataTable(
                {
                    responsive: false,
                    ajax: {
                        url: drafTerbit.deskUrl+"page/data/"
                    },
                    columns: [
                        {data: 'id', orderable: false, searchable:false, render: function(d,t,f,m) { return '<input type="checkbox" name="pages[]" value="'+d+'">'}},
                        {data: 'title', render: function(d,t,f,m) { return '<a href="'+drafTerbit.deskUrl+'page/edit/'+f.id+'">'+d+'</a>'}},
                        {data: 'updated_at'}
                    ],
                    drawCallback: function() {
                        drafTerbit.handleFooter();
                    }
                }
            );
            drafTerbit.replaceDTSearch(drafTerbit.pages.dt);

            // Checks
            $('#page-checkall').checkAll({showIndeterminate:true});
        }
    }

    drafTerbit.page.handleTable();
    drafTerbit.page.handleForm();

})(jQuery, drafTerbit);
