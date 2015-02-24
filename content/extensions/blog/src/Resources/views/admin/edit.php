<?php $this->extend('@system/main-edit'); ?>

<?php $this->css(':magicsuggest_css, @blog/css/editor.css'); ?>

<?php $this->start('action'); ?>
<button class="btn btn-sm btn-success" type="submit" name="action" value="save">
    <i class="fa fa-check spinner"></i> <?php echo __('Save') ?>
</button>
<a class="btn btn-sm btn-default" href="<?php echo admin_url('blog') ?>">
    <i class="fa fa-times" style="color: #A94442;"></i> <span class="dt-editor-close-text"><?php echo __('Cancel') ?></span>
</a>
<?php $this->end(); ?>

<div class="row">
    <div class="clearfix col-md-9">
        <div class="form-group">
                <input name="title" type="text" class="form-control input-lg" id="post-title" placeholder="<?php echo __('Title') ?>" value="<?php echo value('title', $postTitle); ?>">
                <input name="id" value="<?php echo $postId ?>" type="hidden"/>
             </div>
         <div class="form-group">
            <?php echo wysiwyg('content', value('content', $content)); ?>
         </div>
         <?php if($revisions): ?>
             <div class="revisions">
                <h5><strong><?php echo __('Revision'); ?> :</strong></h5>
                <ol style="list-style:none">
                    <?php foreach ($revisions as $revision): ?>
                        <li>
                            <a href="<?php echo admin_url('user/edit/'.$revision['user_id']) ?>"><?php echo $revision['authorName'] ?></a>
                            <?php echo $revision['time_human'] ?>
                            (<a href="<?php echo admin_url('blog/revision/'.$revision['id']) ?>"><?php echo $revision['time'] ?></a>)
                        </li>
                    <?php endforeach ?>
                </ol>
             </div>
         <?php endif; ?>
    </div>
    <div class="clearfix col-md-3">
        <div class="form-group" >
            <input name="slug" type="text" class="form-control" placeholder="<?php echo __('Slug') ?>" value="<?php echo value('slug', $slug); ?>">
        </div>
        <div class="form-group">
            <label><?php echo __('Status') ?></label>
            <select name="status" type="text" class="form-control" value="<?php echo value('slug', $slug); ?>">
                <option <?php echo selected('status', 1, $status == 1) ?> value="1" ><?php echo __('Published') ?></option>
                <option <?php echo selected('status', 0, $status == 0) ?> value="0" ><?php echo __('Unpublished') ?></option>
            </select>
         </div>
        <div class="form-group tags-input-wrapper">
            <label><?php echo __('Tags') ?></label>
            <input placeholder="Tags" id="tags" name="tags"/>
         </div>
    </div>
</div>

<script>
var tagOptions = <?php echo $tagOptions; ?>;
var tags = <?php echo json_encode(value('tags', $tags)); ?>
</script>

<?php $this->js(':magicsuggest_js, @blog/js/editor.js'); 