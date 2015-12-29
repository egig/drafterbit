(function($, drafTerbit){

    $('#finder-container').dtfinder(
        {
            url: drafTerbit.adminUrl+'file/data',
            data: {
                csrf: drafTerbit.csrfToken,
            },
            locale: drafTerbit.locale,
            permissions: {                
                create: drafTerbit.permissions.files.create,
                move: drafTerbit.permissions.files.move,
                delete: drafTerbit.permissions.files.delete
            }
        }
    );

})(jQuery, drafTerbit);