<?php _extend('@system/main-edit'); ?>

<?php $this->css(':magicsuggest_css, :datetimepicker_css, @blog/css/editor.css'); ?>

<?php _start('action'); ?>
<button class="btn btn-sm btn-success" type="submit" name="action" value="save">
    <i class="fa fa-check spinner"></i> <?= __('Save') ?>
</button>
<a class="btn btn-sm btn-default" href="<?= admin_url('posts') ?>">
    <i class="fa fa-times" style="color: #A94442;"></i> <span class="dt-editor-close-text"><?= __('Cancel') ?></span>
</a>
<?php _end(); ?>

<div class="row">
    <div class="clearfix col-md-9">
        <div class="form-group">
            <input name="title" type="text" class="form-control input-lg" id="post-title" placeholder="<?= __('Title') ?>" value="<?= value('title', $postTitle); ?>">
            <input name="id" value="<?= $postId ?>" type="hidden"/>
         </div>
         <div class="form-group">
            <?= wysiwyg('content', value('content', $content)); ?>
         </div>
         <?php if($revisions): ?>
          <div class="panel panel-default revisions-container">
            <div class="panel-heading">
              <h5 class="panel-title" style="font-size:14px;text-align:center">
                <a href="#revisions" data-parent="" data-toggle="collapse" aria-expanded="false">
                    <?= __('Revisions') ?> (<?= count($revisions) ?>)
                </a>
              </h5>
            </div>
            <div class="panel-collapse collapse" id="revisions" aria-expanded="false">
                <div class="panel-body">
                    <div class="pull-right">
                        <a class="clear-history" href="" data-post-id="<?= $postId; ?>"><i class="fa fa-times"></i> <?= __('Clear') ?></a>
                    </div>
                    <ol style="list-style:none">
                        <?php foreach ($revisions as $revision): ?>
                            <li>
                                <a href="<?= admin_url('user/edit/'.$revision['user_id']) ?>"><?= $revision['authorName'] ?></a>
                                <?= $revision['time_human'] ?>
                                (<a href="<?= admin_url('posts/'.$postId.'/revisions#rev-'.$revision['id']) ?>"><?= $revision['time'] ?></a>)
                            </li>
                        <?php endforeach ?>
                    </ol>
                </div>
              </div>
          </div>
         <?php endif; ?>
    </div>
    <div class="clearfix col-md-3">
        <div class="form-group" >
            <input name="slug" type="text" class="form-control" placeholder="<?= __('Slug') ?>" value="<?= value('slug', $slug); ?>">
        </div>
        <div class="form-group">
            <label><?= __('Status') ?></label>
            <select name="status" type="text" class="form-control" value="<?= value('slug', $slug); ?>">
                <option <?= selected('status', 1, $status == 1) ?> value="1" ><?= __('Published') ?></option>
                <option <?= selected('status', 0, $status == 0) ?> value="0" ><?= __('Pending Review') ?></option>
            </select>
         </div>
         <div class="form-group">
            <label><?= __('Publish Date') ?></label>
            <input name="publish-date" class="form-control publish-date" value="<?= value('publish-date', $publishDate); ?>">
         </div>
        <div class="form-group tags-input-wrapper">
            <label><?= __('Tags') ?></label>
            <input placeholder="Tags" id="tags" name="tags"/>
         </div>
    </div>
</div>

<script>
var tagOptions = <?= $tagOptions; ?>;
var tags = <?= json_encode(value('tags', $tags)); ?>
</script>

<?php $this->js(':magicsuggest_js, :datetimepicker_js, @blog/js/editor.js'); 