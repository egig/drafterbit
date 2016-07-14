(function($, drafTerbit) {

    drafTerbit.files = {};
    drafTerbit.file = {

        handleTable: function () {
             drafTerbit.files.dt = $("#file-data-table").dataTable(
                {
                    responsive: true,
                    ajax: {
                        url: drafTerbit.adminUrl+"file/data"
                    },
                    columns: [
                        {},
                        {},
                        {}
                    ],
                    columnDefs: [
                        {orderable: false, searchable:false, targets:[0], render: function(d,t,f,m) { return '<input type="checkbox" name="pages[]" value="'+d+'">'}},
                        {render: function(d,t,f,m) { return '<a href="'+drafTerbit.adminUrl+'page/edit/'+f[0]+'">'+d+'</a>'}, targets:1},
                    ],
                    drawCallback: function() {
                        drafTerbit.handleFooter();
                    }
                }
            );
            drafTerbit.replaceDTSearch(drafTerbit.files.dt);

            // Checks
            $('#file-checkall').checkAll({showIndeterminate:true});
        }
    }

    drafTerbit.file.handleTable();

})(jQuery, drafTerbit);
