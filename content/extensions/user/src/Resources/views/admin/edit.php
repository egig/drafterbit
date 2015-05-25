<?php _extend('@system/main') ?>

<?php _css(':chosen_css', ':chosen_css'); ?>
<?php _css(':chosen_bootstrap_css'); ?>

<form method="POST" id="<?= $id; ?>-form" action="<?= isset($action) ? $action : '' ?>">
<input type="hidden" name="id" value="<?= $userId; ?>" />

<div class="container">
<div class="row">
    <div class="col-md-4">
        <div class="form-group">
            <label for="username" class="control-label"><?= __('Username'); ?></label>
            <input name="username" type="text" class="form-control" value="<?= value('username', $username); ?>">
        </div>
        <div class="form-group">
            <label for="email" class="control-label"><?=  __('Email'); ?></label>
            <input name="email" type="email" class="form-control" placeholder="Email" value="<?= value('email', $email); ?>">
        </div>
        <div class="form-group">
            <label for="password" class="control-label"><?= __('Password'); ?></label>
            <input name="password" autocomplete="off" type="password" class="form-control" autocomplete="off">
        </div>
        <div class="form-group">
            <label for="password-confirm" class="control-label"><?= __('Password Again'); ?></label>
            <input name="password-confirm" type="password" class="form-control" autocomplete="off">
        </div>
         <div class="form-group">
            <label for="groups" class="control-label"><?= __('Role') ?></label>
              <select name="roles[]" multiple id="user-roles" class="form-control" data-placeholder="Select Role">
                <?php foreach ($roleOptions as $option) : ?>
                  <option <?= selected('roles', $option['id'], in_array($option['id'], $roleIds)); ?> value="<?= $option['id'] ?>"><?= $option['label']; ?></option>
                <?php endforeach?>
              </select>
        </div>
    </div>
    <div class="col-md-4">
        <div class="form-group">
            <label for="real-name" class="control-label"><?=  __('Real Name'); ?></label>
            <input name="real-name" type="text" class="form-control" placeholder="Real Name" value="<?= value('real-name', $realName); ?>">
        </div>
         <div class="form-group">
            <label for="url" class="control-label"><?=  __('Url'); ?></label>
            <input name="url" type="text" class="form-control" placeholder="http://" value="<?= value('url', $url); ?>">
        </div>
        <div class="form-group">
            <label for="website" class="control-label">Bio</label>
             <textarea name="bio" class="form-control"><?= value('bio', $bio); ?></textarea>
             <span class="help-block">A little biographical information may be shown publicly.</span>
        </div>
        <div class="form-group">
            <label for="status" class="control-label"><?= __('Status'); ?></label>
            <div class="radio">
                <label>
                  <input <?= checked('status', 1, $status == 1); ?> type="radio" name="status" value="1"> <?= __('Active') ?>
                </label>
                <label>
                  <input <?= checked('status', 0, $status == 0); ?> type="radio" name="status" value="0"> <?= __('Banned') ?>
                </label>
            </div>
        </div>
        <div class="form-group">
            <input type="submit" class="btn btn-primary pull-right" name="action" value="Submit"/>
         </div>
    </div>
</div>

    <input type="hidden" name="csrf" value="<?= csrf_token(); ?>"/>
</form>

<?php _js(':chosen_js, :jquery_form, @user/js/edit.js'); 