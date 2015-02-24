<?php $this->extend('@system/main') ?>

<?php $this->css(':chosen_css', ':chosen_css'); ?>
<?php $this->css(':chosen_bootstrap_css'); ?>

<form method="POST" id="<?php echo $id; ?>-form" action="<?php echo isset($action) ? $action : '' ?>">
<input type="hidden" name="id" value="<?php echo $userId; ?>" />

<div class="container">
<div class="row">
    <div class="col-md-4">
        <div class="form-group">
            <label for="username" class="control-label"><?php echo __('Username'); ?></label>
            <input name="username" type="text" class="form-control" value="<?php echo value('username', $username); ?>">
        </div>
        <div class="form-group">
            <label for="email" class="control-label"><?php echo  __('Email'); ?></label>
            <input name="email" type="email" class="form-control" placeholder="Email" value="<?php echo value('email', $email); ?>">
        </div>
        <div class="form-group">
            <label for="password" class="control-label"><?php echo __('Password'); ?></label>
            <input name="password" autocomplete="off" type="password" class="form-control" autocomplete="off">
        </div>
        <div class="form-group">
            <label for="password-confirm" class="control-label"><?php echo __('Password Again'); ?></label>
            <input name="password-confirm" type="password" class="form-control" autocomplete="off">
        </div>
         <div class="form-group">
            <label for="groups" class="control-label"><?php echo __('Role') ?></label>
              <select name="roles[]" multiple id="user-roles" class="form-control" data-placeholder="Select Role">
                <?php foreach ($roleOptions as $option) : ?>
                  <option <?php echo selected('roles', $option['id'], in_array($option['id'], $roleIds)); ?> value="<?php echo $option['id'] ?>"><?php echo $option['label']; ?></option>
                <?php endforeach?>
              </select>
        </div>
    </div>
    <div class="col-md-4">
        <div class="form-group">
            <label for="real-name" class="control-label"><?php echo  __('Real Name'); ?></label>
            <input name="real-name" type="text" class="form-control" placeholder="Real Name" value="<?php echo value('real-name', $realName); ?>">
        </div>
         <div class="form-group">
            <label for="url" class="control-label"><?php echo  __('Url'); ?></label>
            <input name="url" type="text" class="form-control" placeholder="http://" value="<?php echo value('url', $url); ?>">
        </div>
        <div class="form-group">
            <label for="website" class="control-label">Bio</label>
             <textarea name="bio" class="form-control"><?php echo value('bio', $bio); ?></textarea>
             <span class="help-block">A little biographical information may be shown publicly.</span>
        </div>
        <div class="form-group">
            <label for="status" class="control-label"><?php echo __('Status'); ?></label>
            <div class="radio">
                <label>
                  <input <?php echo checked('status', 1, $status == 1); ?> type="radio" name="status" value="1"> <?php echo __('Active') ?>
                </label>
                <label>
                  <input <?php echo checked('status', 0, $status == 0); ?> type="radio" name="status" value="0"> <?php echo __('Banned') ?>
                </label>
            </div>
        </div>
        <div class="form-group">
            <input type="submit" class="btn btn-primary pull-right" name="action" value="Submit"/>
         </div>
    </div>
</div>

    <input type="hidden" name="csrf" value="<?php echo csrf_token(); ?>"/>
</form>

<?php $this->js(':chosen_js, :jquery_form, @user/js/edit.js'); 