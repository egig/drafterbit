(function($, drafTerbit){

    // Helper function to get parameters from the query string.
    function getUrlParam(paramName)
    {
        var reParam = new RegExp('(?:[\?&]|&amp;)' + paramName + '=([^&]+)', 'i');
        var match = window.location.search.match(reParam);

        return (match && match.length > 1) ? match[1] : '' ;
    }
    var CKEditorFuncNum = getUrlParam('CKEditorFuncNum');

    var aCallback;
    if (CKEditorFuncNum != '') {
        aCallback = function(e){
            e.preventDefault();
            var url = $(e.currentTarget).data('path');
            url = url.substr(2); // remove #/

            window.opener.CKEDITOR.tools.callFunction(CKEditorFuncNum, drafTerbit.contentUrl+url);
            window.close();
        }
    }

    var DTCustomizer = getUrlParam('DTCustomizer');
    var fallback = getUrlParam('fallback');

    if(DTCustomizer) {
        aCallback = function(a) {
            var href = $(a.target).data('path');
            href = href.substr(2); // remove #/
            window.opener.drafTerbit.useImg(fallback, drafTerbit.contentUrl+href);
            window.close();
        }
    }

    $('#finder-container').dtfinder(
        {
            url: drafTerbit.adminUrl+'file/data',
            onISelect: aCallback,
            data: {
                csrf: drafTerbit.csrfToken
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
