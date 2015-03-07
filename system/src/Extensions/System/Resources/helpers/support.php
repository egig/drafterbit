<?php

if (! function_exists('admin_url')) {
     /**
     * admin url
     *
     * @param  string $sub
     * @return string
     */
    function admin_url($sub = null)
    {
         $admin = app('config')['path.admin'];
         $path = is_null($sub) ? $admin : $admin.'/'.$sub;
         return base_url($path);
    }
}

if (! function_exists('wysiwyg')) {
    /**
     * Get theme path
     *
     * @param string $path
     */
    function wysiwyg($name, $default = null, $attr = "")
    {
        // @todo create asset_url
        $path = base_url('system/src/Resources/public/assets');
        $src = base_url('system/vendor/web/ckeditor/ckeditor.js');
        $browserUrl = admin_url('files/browser?mode=image');
        $wpmore = base_url('/system/src/Resources/public/assets/ckeditor-custom/plugins/wpmore/plugin.js');

        $html = <<< EOD

<textarea $attr name="$name">$default</textarea>
<script src="$src"></script>
<script>

CKEDITOR.replace('$name', {

    customConfig : '$path/ckeditor-custom/config.js',
    skin: 'bootstrap, $path/ckeditor-custom/skins/bootstrap/',

    filebrowserWindowWidth  : 860,
    filebrowserWindowHeight : 453,
    filebrowserImageBrowseUrl : '$browserUrl'
});

CKEDITOR.plugins.addExternal( 'wpmore', '$wpmore');
CKEDITOR.config.extraPlugins = 'wpmore';


// handle footer position
CKEDITOR.on("instanceReady", function(event)
{
    var h = $('.page-wrapper').height();
    var hW = $(window).innerHeight();

    if(h+30 > hW) {
        $('.footer').removeClass('navbar-fixed-bottom');
    }
});

</script>

EOD;
        
        return $html;
    }
}

if (! function_exists('theme_url')) {
    /**
     * Get theme path
     *
     * @param string $path
     */
    function theme_url($path = null)
    {
        $theme = app('themes')->current();

        $themePath = str_replace(app('path.public'), '', app('path.themes'));

        return base_url("{$themePath}{$theme}".'/'.trim($path, '/'));
    }
}

if (! function_exists('asset_url')) {
    /**
     * Asset url
     *
     * @return void
     */
    function asset_url($path)
    {
        if ('@' === $path[0]) {
            $_temp = explode('/', $path);
            $ext = ltrim(array_shift($_temp), '@');

            if ($ext == 'vendor') {
                $base = 'system/vendor/web/';
            } else {
                $realPath = app()->getExtension($ext)->getResourcesPath('public');
                $base = str_replace(app('path.public'), '', $realPath).'/';
            }

            $path = implode('/', $_temp);
            $path = $base.$path;
        }

        return base_url($path);
    }
}

if (!function_exists('gravatar_url')) {
    /**
     * Create gravatar url byb given email
     *
     * @param  string $email
     * @param  int    $size
     * @return void
     * @author
     **/
    function gravatar_url($email, $size = 47)
    {
        $hash = md5(strtolower($email));
        return "http://www.gravatar.com/avatar/$hash?d=mm&s=$size";
    }
}


if (!function_exists('has_permission')) {
    /**
     * Check if current user has an access
     *
     * @param  string $email
     * @param  int    $size
     * @return void
     * @author
     **/
    function has_permission($accessKey)
    {
        return app()->getExtension('user')->model('Auth')->userHasPermission($accessKey);
    }
}