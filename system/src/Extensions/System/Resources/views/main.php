<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?= strip_tags($title) ?> | <?= $siteName.' Admin'; ?></title>
        <link rel="stylesheet" href="<?= base_url('system/drafterbit.css'); ?>" type="text/css">
        <?php $this->css(':fontawesome', ':fontawesome'); ?>
        <?php $this->css('
          :notify_css,
          @system/css/overrides-bootstrap.css,
          @system/css/overrides-datatables.css,
          @system/css/style.css,
          @system/css/style-desktop.css,
          @system/css/style-mobile.css
        ') ?>
        <?php $this->css(':bootstrap_css', ':bootstrap_css'); ?>
        <?= $this->block('css'); ?> 
    </head>

    <body>
    <noscript>
      <style type="text/css"> div:not(.noscript), nav {margin: 0; padding: 0; display: none; } body {margin: 0;padding: 0} </style>
      <div class="noscript">Please use javascript-supported browser.</div>
    </noscript>
        <?= $this->render('@system/partials/nav'); ?>
            <div class="page-wrapper">
                <div class="container row-header-container">
                    <div class="row row-header">
                      <div class="col-lg-12" style="margin-bottom:10px;">
                          <h2> <?= $title; ?> </h2>
                      </div>
                    </div>
                </div>
                <?= $this->block('content'); ?>
            </div>
            <?= $this->render('@system/partials/footer'); ?>

        <div class="preloader">
            <img alt="loading&hellip;" src="<?= asset_url('@system/img/preloader.gif'); ?>" />
        </div>
        
        <script src="<?= asset_url('@vendor/jquery/dist/jquery.min.js'); ?>" /></script>
        <script src="<?= base_url('system/drafterbit.js'); ?>" /></script>
        <script src="<?= base_url('system/session.js'); ?>" /></script>
        <?php $this->js(':bootstrap_js, :notify_js, :jquery_form, @system/js/layout.js'); ?>          
        <?= $this->block('js'); ?>

        <script>
          $(window).load(function(){
            $('.preloader').hide();
          });

          <?php if (isset($messages)) : ?>
                  <?php foreach ($messages as $message) : ?>
                      msg = "<?= $this->escape($message['text'], 'js'); ?>";
                      $.notify(msg, "<?= $message['type'] == 'error' ? 'danger' : $message['type']; ?>");
                  <?php endforeach; ?>
          <?php endif;?>
        </script>
</body>
</html>