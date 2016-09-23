'use strict';

window.__ = function (s) {
  return s;
};

window.drafTerbit = {
  csrfToken: 'token', // @todo csrf
  locale: 'en', // @todo move locale to configurable
  deskUrl: '/desk/',
  replaceDTSearch: function replaceDTSearch(dt) {
    $('.dataTables_filter').remove();

    $(document).on('keydown', "input[type=search]", function (e) {
      var code = e.keyCode || e.which;
      if (code == 13) {
        e.preventDefault();
      }
    });

    //search filter
    $(document).on('keyup', "input[type=search]", function (e) {

      var val = $(this).val();
      dt.api().search($(this).val()).draw();
    });
  },
  handleFooter: function handleFooter() {
    var h = $('body').height();
    var hW = $(window).height();
    var wW = $(window).innerWidth();

    if (h + 30 < hW && wW >= 720) {
      $('.dt-footer').addClass('navbar-fixed-bottom');
    } else {
      $('.dt-footer').removeClass('navbar-fixed-bottom');
    }
  }
};