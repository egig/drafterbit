(function($){

    if (location.hash) {
        $('a[href="'+location.hash+'"]').tab('show');
    } else {
        $('ul#dt-menu-tab li:first-child a').tab('show');
    }

    $('.menu-sortable').nestedSortable({
        forcePlaceholderSize: true,
        placeholder: 'placeholder',
        handle: 'div',
        items: 'li',
        toleranceElement: '> div'
    });

    //tabCollapse
    $('#dt-menu-tab').tabCollapse();

     // add menu
    $(document).on(
        'click',
        '.menu-item-adder',
        function(e){
            e.preventDefault();
            var menu_id = $(this).data('menu-id');
            var id = null;
            var label = null;
            var type = null;
            var link = null;

            $.ajax({
                url: drafTerbit.adminUrl+'menu/item/add',
                async:false,
                data: {menu_id: menu_id},
                dataype:'json',
                type: 'POST',
                success: function(res) {
                    id = res.id
                    label = res.label;
                    type = res.type;
                    link = res.link;
                }
            });

            var source   = $("#menu-item-template").html();
            var html    = nunjucks.renderString(source,
                {
                    label: label,
                    link: link,
                    type: type,
                    id: id,
                    formAction: drafTerbit.adminUrl+'menu/item/save'
                }
            );

            $(this).parent().closest('.menu-items').children('ol').append('<li id="'+id+'">'+html+'</li>');
        }
    );

    $(document).on('click', '.menu-item-saver', function(e){
        e.preventDefault();
        var menus = $(this)
            .parent()
            .siblings('.menu-items').children('.menu-sortable').find('li').toArray();

        var data = Array();

        for(i in menus) {
           var parent = $(menus[i]).parent('ol').parent('li');

            data[i] = {
                id: $(menus[i]).attr('id'),
                parent: parent.attr('id') == undefined ? 0 : parent.attr('id'),
                sequence: i
            }
        }

        var name = $(this).parent().siblings('.menu-setting').find('input[name="name"]').val();
        var id = $(this).parent().siblings('.menu-setting').find('input[name="id"]').val();

        $.ajax({
            dataType: 'json',
            type: 'POST',
            data: {menus: data, name: name, id:id},
            url: drafTerbit.adminUrl+'menu/sort',
            success: function(res) {
                $.notify(res.message, res.status);
            }
        })
    });


    $(document).on('click','.menu-delete', function(e){
        e.preventDefault();

        if(confirm(__('Are you sure to delete this menu ?'))) {
            $.ajax({
                data: {id: $(this).data('id')},
                type: 'POST',
                url: drafTerbit.adminUrl+'menu/delete',
                success: function() {
                    window.location.reload();
                }
            });
        }

    });

    $(document).on(
        'keyup',
        '.menu-label',
        function(){
            var val= $(this).val();

            if (val.trim() == '') {
                val = 'unlabeled';
            }

            $(this).closest('.panel-collapse').siblings('.panel-heading').find('a').text(val);;
        }
    );

    //delete menu
    $(document).on(
        'click',
        '.delete-menu-item',
        function(e){
            e.preventDefault();
            var id = $(this).closest('.menu-form').find('input[name="id"]').val();

            $.post(drafTerbit.adminUrl+'menu/item/delete', {id:id});

            $(this).closest('.menu-item-container').fadeOut('fast');
            $(this).closest('.menu-item-container').parent('li').remove();
        }
    );

    // menu form
    $(document).on(
        'submit',
        '.menu-form',
        function(e){
            e.preventDefault();
            $(this).ajaxSubmit(
                {
                    dataType: 'json',
                    success: function(res, a, b, form){
                        if (res.error) {
                            if (res.error.type == 'validation') {
                                for (name in res.error.messages) {
                                    var ctn =$(form).find(':input[name="'+name+'"]').parent();
                                        ctn.append('<span class="help-block">'+res.error.messages[name]+'</span>');
                                        ctn.addClass('has-error');
                                }
                            }
                        }

                        if (!res.error) {
                            $(form).find('input[name="id"]').val(res.id);
                            $(form).closest('.menu-item-container').prop('id', res.id+'-menu-item-container');

                            $.notify(res.message, 'success');
                        }
                    }
                }
            );
        }
    );

    $(document).on(
        'submit',
        '.menu-add-form',
        function(e){
            e.preventDefault();
            $(this).ajaxSubmit(
                {
                    dataType: 'json',
                    success: function(res, a, b, form){
                        if (res.error) {
                            if (res.error.type == 'validation') {
                                for (name in res.error.messages) {

                                    var input = $(form).find(':input[name="'+name+'"]');

                                    if(!input.data('has-error')) {
                                        input.parent().addClass('has-error');
                                        input.after('<span class="help-block">'+res.error.messages[name]+'</span>');
                                        input.data('has-error', 1);
                                    }
                                }
                            }
                        }

                        if(res.id && res.slug) {
                            var url = location.toString();

                            if(url.indexOf('#') !== -1) {
                                url = url.substr(0, url.indexOf('#'));
                            }

                            window.location.replace(url+'#'+res.slug);
                            window.location.reload(true);
                        }
                    }
                }
            );
        }
    );

    // Helper function to get parameters from the query string.
    function getUrlParam(paramName)
    {
        var reParam = new RegExp('(?:[\?&]|&amp;)' + paramName + '=([^&]+)', 'i');
        var match = window.location.search.match(reParam);

        return (match && match.length > 1) ? match[1] : '' ;
    }
    var position = getUrlParam('pos');


    $(document).on(
        'click',
        '.menu-item-selector',
        function(e) {
            var label = $(this).data('label');
            var id = $(this).data('id');
            window.opener.drafTerbit.MENU.set(position, id, label);
            window.close();
        }
    );
})(jQuery);
