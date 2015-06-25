(function($){

    if (location.hash) {
        $('a[href="'+location.hash+'"]').tab('show');
    } else {
        $('ul.nav-stacked-left li:first-child a').tab('show');
    }

})(jQuery);