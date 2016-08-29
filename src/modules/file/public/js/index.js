(function($, drafTerbit){

    $('#finder-container').dtfinder(
        {
            url: drafTerbit.deskUrl+'file/data',
            data: {
                csrf: drafTerbit.csrfToken,
            },
            locale: drafTerbit.locale,
            /* @todo
             permissions: {
                create: drafTerbit.permissions.files.create,
                move: drafTerbit.permissions.files.move,
                delete: drafTerbit.permissions.files.delete
            }*/
        }
    );

})(jQuery, drafTerbit);
