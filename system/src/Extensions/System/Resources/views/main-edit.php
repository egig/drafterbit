<?php _extend('@system/main'); ?>

<form method="POST" id="<?= $id; ?>-form" action="<?= isset($action) ? $action : '' ?>">
    <div class="container-fluid sticky-toolbar-wrapper" id="sticky-toolbar">
        <div class="container">
            <div class="row row-sticky-toolbar" style="margin:10px 0;">
                <?= $this->block('action'); ?>
            </div>
        </div>
    </div>
    
    <div class="container">
        <?= $this->block('content'); ?>
     </div>
    <input type="hidden" name="csrf" value="<?= csrf_token(); ?>"/>
</form>

<?php $this->js(':jquery_form, :sticky_kit'); 