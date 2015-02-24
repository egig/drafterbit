<?php $this->extend('@system/main'); ?>

<div class="container">
  <div class="row">
    <div class="col-md-4">
    <form method="POST">
        <div class="form-group">
            <label for="post_perpage" class="control-label"><?php echo __('Post per Page') ?></label>
            <input type="text" name="post_perpage" value="<?php echo value('post_perpage', $postPerpage); ?>" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="post_perpage" class="control-label"><?php echo __('Feeds shows') ?></label>
            <input type="text" name="feed_shows" value="<?php echo value('feed_shows', $feedShows); ?>" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="post_perpage" class="control-label"><?php echo __('Feeds content') ?></label>
            <div>
              <label class="radio-inline"><input type="radio" name="feed_content" value="1" <?php echo checked('feed_content', 1, $feedContent == 1); ?> >Full text</label>
              <label class="radio-inline"><input type="radio" name="feed_content" value="2" <?php echo checked('feed_content', 2, $feedContent == 2); ?> >Sumarry</label>
            </div>
        </div>
        <div class="form-group">
            <label for="comment_moderation" class="control-label"><?php echo __('Comment Moderation') ?></label>
            <select class="form-control" name="comment_moderation">
              <option value="0" <?php echo selected('comment_moderation', '0', $mode == '0') ?>><?php echo __('Never'); ?></option>
              <option value="1" <?php echo selected('comment_moderation', '1', $mode == '1') ?>><?php echo __('Always'); ?></option>
            </select>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-sm btn-primary"><?php echo __('Submit') ?></button>
        </div>
    </form>
    </div>
 </div>
</div>