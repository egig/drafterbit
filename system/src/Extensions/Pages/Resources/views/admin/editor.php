<?php _extend('@system/main-edit'); ?>

<?php $this->css('@pages/css/editor.css'); ?>

<?php _start('action'); ?>
<button class="btn btn-sm btn-success" type="submit" name="action" value="save">
    <i class="fa fa-check spinner"></i> <?= __('Save') ?>
</button>
<a class="btn btn-sm btn-default" href="<?= admin_url('pages') ?>">
    <i class="fa fa-times" style="color: #A94442;"></i> <span class="dt-editor-close-text"><?= __('Cancel') ?></span>
</a>
<?php _end(); ?>

<div class="row">
    <div class="col-md-9">
        <div class="form-group">
            <input name="title" type="text" class="form-control input-lg" id="post-title" placeholder="<?= __('Title') ?>" value="<?= value('title', $pageTitle); ?>">
            <input type="hidden" name="id" value="<?= $pageId; ?>" />
         </div>
         <div class="form-group">
            <?= wysiwyg('content', value('content', $content)); ?>
         </div>
    </div>
    <div class="col-md-3">
        <div class="form-group">
            <input name="slug" type="text" class="form-control" placeholder="Slug" value="<?= value('slug', $slug); ?>">
         </div>
        <div class="form-group">
            <label>Status</label>
            <select name="status" type="text" class="form-control" value="<?= value('slug', $slug); ?>">
                <option <?= selected('status', 1, $status == 1) ?> value="1" ><?= __('Published') ?></option>
                <option <?= selected('status', 0, $status == 0) ?> value="0" ><?= __('Pending Review') ?></option>
            </select>
         </div>
         <div class="form-group">
            <label>Layout</label>
            <?= input_select('layout', $layoutOptions, value('layout', $layout), 'class="form-control"'); ?>
         </div>
    </div>
</div>

<?php $this->js('@pages/js/editor.js'); 