<?php $this->extend('@system/main'); ?>

<?php $this->css(':bootstrap_datatables_css'); ?>

<form method="POST" id="<?php echo $id; ?>-index-form" action="<?php echo isset($action) ? $action : '' ?>">
    <div class="container-fluid sticky-toolbar-wrapper" id="sticky-toolbar">
        <div class="container">
            <div class="row row-sticky-toolbar" style="margin:10px 0;">
                <div class="pull-right">
                    <div style="display:inline-block; float:right;margin-left:5px;">
                        <input type="search" class="form-control input-sm" placeholder="<?php echo __('Search') ?>">
                    </div>

                    <?php echo $this->block('filter'); ?>
                </div>

                    <?php echo $this->block('action'); ?>
            </div>
        </div>
    </div>
    
    <div class="container">
        <div class="row row-content">
           <div class="col-md-12 content-full">
                <?php echo $this->block('table'); ?>
            </div>
        </div>
     </div>
    <input type="hidden" name="csrf" value="<?php echo csrf_token(); ?>"/>
</form>

<?php $this->js(':datatables_js, :bootstrap_datatables_js, :jquery_check_all, :jquery_form'); 