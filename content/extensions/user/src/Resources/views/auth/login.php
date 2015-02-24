<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="/img/ico/favicon.ico">

    <title>Login</title>
    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <link rel="stylesheet" href="<?php echo base_url('system/drafterbit.css'); ?>" type="text/css">
    <?php $this->css(':fontawesome', ':fontawesome'); ?>
    <?php $this->css(':bootstrap_css, :notify_css, @user/css/login.css'); ?>
    <?php echo $this->block('css');?>
  </head>

  <body>
    <noscript>
      <style type="text/css"> div:not(.noscript), nav {margin: 0; padding: 0; display: none; } body {margin: 0;padding: 0} </style>
      <div class="noscript">Please use javascript-supported browser.</div>
    </noscript>
    <div class="container">
      <div class="panel panel-default form-signin-panel">
        <div class="panel-body">
            <div style="text-align:center; margin-bottom:20px;"><h1 class="title"><?php echo $siteName; ?></h1></div>       
                  <form role="form" class="form-signin" method="POST" action="<?php echo admin_url('do_login'); ?>">
                    <input name="login" type="text" class="form-control input-sm" placeholder="<?= __('USERNAME OR EMAIL'); ?>" autofocus value="<?php echo value('email'); ?>">
                    <input name="password" type="password" class="form-control input-sm" placeholder="<?= __('PASSWORD'); ?>">
                    <input name="next" type="hidden" value="<?php echo $next; ?>">
                    <div class="clearfix">
                        <button class="btn btn-sm btn-primary form-control btn-login" type="submit"><?= __('LOGIN'); ?></button>
                    </div>
                  </form>
              </div>
        </div>
        <div class="copyright dt-brand">
            <p>Drafterbit v<?php echo app('version'); ?> &copy; <?php echo date('Y') ?></p>
        </div>
    </div> <!-- /container -->
    
    <div class="preloader">
        <img alt="loading&hellip;" src="<?php echo asset_url('@system/img/preloader.GIF'); ?>" />
    </div>

    <script src="<?php echo asset_url('@vendor/jquery/dist/jquery.min.js'); ?>" /></script>
    <script src="<?php echo base_url('system/drafterbit.js'); ?>" /></script>
    <script type="text/javascript">

      $(window).load(function(){
        $('.preloader').fadeOut('fast');
      });

    </script>
    <?php $this->js(':jquery_form, :notify_js, @user/js/login.js'); ?>
    <?php echo $this->block('js');?>
  </body>
</html>