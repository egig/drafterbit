<?php  _extend('@system/main-edit.php')?>

<?php _css('@blog/css/categories/edit.css'); ?>


<?php _start('action'); ?>
<button class="btn btn-sm btn-success" type="submit" name="action" value="save">
    <i class="fa fa-check spinner"></i> <?= __('Save') ?>
</button>
<a class="btn btn-sm btn-default" href="<?= admin_url('posts/categories') ?>">
    <i class="fa fa-times" style="color: #A94442;"></i> <span class="dt-editor-close-text"><?= __('Cancel') ?></span>
</a>
<?php _end(); ?>

<div class="row">
    <div class="col-md-4">
        <div class="form-group">
            <label><?= __('Label') ?></label>
            <input name="label" class="form-control" value="<?= $label ?>">
        </div>
        <div class="form-group">
            <label><?= __('Slug') ?></label>
            <input name="slug" class="form-control" value="<?= $slug ?>">
        </div>
        <div class="form-group">
            <label><?= __('Parent') ?></label>
            <div class="parent_id">
                <?= _categories($categories, $parent_id, $catId); ?>
            </div>
        </div>
        <div class="form-group">
            <label><?= __('Description') ?></label>
            <textarea name="description" class="form-control"><?= $description ?></textarea>
        </div>
    </div>
</div>

<input type="hidden" name="id" value="<?= $catId ?>">

<?php _js('@blog/js/categories/edit.js'); ?>

<?php
  function _categories($categories, $parent_id, $current) {
    $html = '<ol>';
    foreach ($categories as $cat) {

      if($cat['id'] !== $current) {
          $html .= '<li><input '.checked('parent_id', $cat['id'], $cat['id'] == $parent_id).' type="radio" name="parent_id" value="'.$cat['id'].'"> '.$cat['label'];
          if($cat['childrens']) {
            $html .= _categories($cat['childrens'], $parent_id, $current);
          }
          $html .= '</li>';
        }
      }
    $html .= '</ol>';

    return $html;
  }
?> 