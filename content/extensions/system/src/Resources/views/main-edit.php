<?php $this->extend('@system/main'); ?>

<form method="POST" id="<?php echo $id; ?>-form" action="<?php echo isset($action) ? $action : '' ?>">
    <div class="container-fluid sticky-toolbar-wrapper" id="sticky-toolbar">
        <div class="container">
            <div class="row row-sticky-toolbar" style="margin:10px 0;">
                <?php echo $this->block('action'); ?>
            </div>
        </div>
    </div>
    
    <div class="container">
        <?php echo $this->block('content'); ?>
     </div>
    <input type="hidden" name="csrf" value="<?php echo csrf_token(); ?>"/>
</form>

<?php $this->js(':jquery_form'); 