<?php _extend('@system/main'); ?>

<div class="container">
  <div class="row">
    <div class="col-md-4">
    <form method="POST">
        <div class="form-group">
            <label for="post_perpage" class="control-label"><?= __('Post per Page') ?></label>
            <input type="text" name="post_perpage" value="<?= value('post_perpage', $postPerpage); ?>" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="post_perpage" class="control-label"><?= __('Feeds shows') ?></label>
            <input type="text" name="feed_shows" value="<?= value('feed_shows', $feedShows); ?>" class="form-control"/>
        </div>
        <div class="form-group">
            <label for="post_perpage" class="control-label"><?= __('Feeds content') ?></label>
            <div>
              <label class="radio-inline"><input type="radio" name="feed_content" value="1" <?= checked('feed_content', 1, $feedContent == 1); ?> >Full text</label>
              <label class="radio-inline"><input type="radio" name="feed_content" value="2" <?= checked('feed_content', 2, $feedContent == 2); ?> >Sumarry</label>
            </div>
        </div>
        <div class="form-group">
            <label for="comment_moderation" class="control-label"><?= __('Comment Moderation') ?></label>
            <select class="form-control" name="comment_moderation">
              <option value="0" <?= selected('comment_moderation', '0', $mode == '0') ?>><?= __('Never'); ?></option>
              <option value="1" <?= selected('comment_moderation', '1', $mode == '1') ?>><?= __('Always'); ?></option>
            </select>
        </div>
        <div class="form-group">
          <button type="submit" class="btn btn-sm btn-primary"><?= __('Submit') ?></button>
        </div>
    </form>
    </div>
 </div>
</div>