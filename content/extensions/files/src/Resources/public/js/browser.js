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
            url = $(e.currentTarget).attr('href');
            console.log(e.currentTarget);
            // @todo create content path
            window.opener.CKEDITOR.tools.callFunction(CKEditorFuncNum, drafTerbit.contentUrl+'/files/'+url);
            window.close();
        }
    }

    var DTCustomizer = getUrlParam('DTCustomizer');
    var fallback = getUrlParam('fallback');

    if(DTCustomizer) {
        aCallback = function(a) {
            var href = $(a.target).parent('a').attr('href');
            window.opener.drafTerbit.useImg(fallback, drafTerbit.contentUrl+'/files/'+href);
            window.close();
        }
    }

    $('#finder-container').finder(
        {
            url: drafTerbit.adminUrl+'/files/data',
            onISelect: aCallback,
            data: {
                csrf: drafTerbit.csrfToken
            },
            permissions: {             
                create: drafTerbit.permissions.files.create,
                move: drafTerbit.permissions.files.move,
                delete: drafTerbit.permissions.files.delete
            }
        }
    );

})(jQuery, drafTerbit);