<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?php echo $title ?> | <?php echo $siteName.' Administrator'; ?></title>
        <link rel="stylesheet" href="<?php echo base_url('system/drafterbit.css'); ?>" type="text/css">
        <?php $this->css(':fontawesome', ':fontawesome'); ?>
        <?php $this->css('
          :bootstrap_css, :notify_css,
          @system/css/overrides-bootstrap.css,
          @system/css/overrides-datatables.css,
          @system/css/style.css,
          @system/css/style-desktop.css,
          @system/css/style-mobile.css
        ') ?>
        <?php echo $this->block('css'); ?> 
    </head>

    <body>
    <noscript>
      <style type="text/css"> div:not(.noscript), nav {margin: 0; padding: 0; display: none; } body {margin: 0;padding: 0} </style>
      <div class="noscript">Please use javascript-supported browser.</div>
    </noscript>
        <?php echo $this->render('@system/partials/nav'); ?>
            <div class="page-wrapper">
                <div class="container row-header-container">
                    <div class="row row-header">
                      <div class="col-lg-12" style="margin-bottom:10px;">
                          <h2> <?php echo $title; ?> </h2>
                      </div>
                    </div>
                </div>
                <?php echo $this->block('content'); ?>
            </div>
            <?php echo $this->render('@system/partials/footer'); ?>

        <div class="preloader">
            <img alt="loading&hellip;" src="<?php echo asset_url('@system/img/preloader.gif'); ?>" />
        </div>
        
        <script src="<?php echo asset_url('@vendor/jquery/dist/jquery.min.js'); ?>" /></script>
        <script src="<?php echo base_url('system/drafterbit.js'); ?>" /></script>
        <script src="<?php echo base_url('system/session.js'); ?>" /></script>
        <?php $this->js(':bootstrap_js, :notify_js, :jquery_form, @system/js/layout.js'); ?>          
        <?php echo $this->block('js'); ?>

        <script>
          $(window).load(function(){
            $('.preloader').hide();
          });

          <?php if (isset($messages)) : ?>
                  <?php foreach ($messages as $message) : ?>
                      msg = "<?php echo $this->escape($message['text'], 'js'); ?>";
                      $.notify(msg, "<?php echo $message['type'] == 'error' ? 'danger' : $message['type']; ?>");
                  <?php endforeach; ?>
          <?php endif;?>
        </script>
</body>
</html>