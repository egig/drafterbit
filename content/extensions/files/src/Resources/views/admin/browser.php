<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Drafterbit File Browser</title>

    <?php _css(':bootstrap_css, :finder_css, :notify_css'); ?>
    <?php _css(':fontawesome', ':fontawesome'); ?>
    <?=  _block('css'); ?>

<style>
    #finder-container {
        width: 100% !important;
        padding: 10px;
    }
</style>
</head>
<body>

<div id="finder-container"></div>

<script src="<?= asset_url('@vendor/jquery/dist/jquery.min.js'); ?>" /></script>
<script src="<?= base_url('system/drafterbit.js'); ?>" /></script>
<script src="<?= base_url('system/session.js'); ?>" /></script>
<?php _js(':bootstrap_js, :notify_js, :bootstrap_contextmenu, :jquery_form, :finder_js, @files/js/browser.js'); ?>
<?= _block('js'); ?>

</body>
</html>