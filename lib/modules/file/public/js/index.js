'use strict';

(function ($, drafTerbit) {

    $('#finder-container').dtfinder({
        url: drafTerbit.deskUrl + 'file/data',
        data: {
            csrf: drafTerbit.csrfToken
        },
        locale: drafTerbit.locale
    });
})(jQuery, drafTerbit);