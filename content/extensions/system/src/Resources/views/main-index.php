<?php _extend('@system/main'); ?>

<?php _css(':bootstrap_datatables_css'); ?>

<form method="POST" id="<?= $id; ?>-index-form" action="<?= isset($action) ? $action : '' ?>">
    <div class="container-fluid sticky-toolbar-wrapper" id="sticky-toolbar">
        <div class="container">
            <div class="row row-sticky-toolbar" style="margin:10px 0;">
                <div class="pull-right">
                    <div style="display:inline-block; float:right;margin-left:5px;">
                        <input type="search" class="form-control input-sm" placeholder="<?= __('Search') ?>">
                    </div>

                    <?= _block('filter'); ?>
                </div>

                    <?= _block('action'); ?>
            </div>
        </div>
    </div>
    
    <div class="container">
        <div class="row row-content">
           <div class="col-md-12 content-full">
                <?= _block('table'); ?>
            </div>
        </div>
     </div>
    <input type="hidden" name="csrf" value="<?= csrf_token(); ?>"/>
</form>

<?php _js(':datatables_js, :bootstrap_datatables_js, :jquery_check_all, :jquery_form, :sticky_kit'); 