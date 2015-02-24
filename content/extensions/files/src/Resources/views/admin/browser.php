<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Drafterbit File Browser</title>

    <?php $this->css(':bootstrap_css, :finder_css, :notify_css'); ?>
    <?php $this->css(':fontawesome', ':fontawesome'); ?>
    <?php echo  $this->block('css'); ?>

<style>
    .upload-btn {
        margin-left: 20px !important;
    }
</style>
</head>
<body>

<div id="finder-container"></div>

<script src="<?php echo asset_url('@vendor/jquery/dist/jquery.min.js'); ?>" /></script>
<script src="<?php echo base_url('system/drafterbit.js'); ?>" /></script>
<script src="<?php echo base_url('system/session.js'); ?>" /></script>
<?php $this->js(':bootstrap_js, :notify_js, :bootstrap_contextmenu, :jquery_form, :finder_js, @files/js/browser.js'); ?>
<?php echo $this->block('js'); ?>

</body>
</html>