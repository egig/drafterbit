<?php _extend('@system/main-edit'); ?>

<?php _start('action'); ?>
<button class="btn btn-success btn-sm" type="submit" name="action" value="update">
    <i class="fa fa-check"></i> Save
</button>
<a href="<?= admin_url('user/roles'); ?>" class="btn btn-default btn-sm">
    <i class="fa fa-times" style=""></i> Cancel
</a>
<?php _end(); ?>

<div class="row row-content">
    <div class="col-md-8 col-md-offset-2 content-full">
        <div class="form-group">
            <label for="name" class="control-label">Role Name</label>
             <input name="name" type="text" class="form-control" placeholder="Role Name" value="<?= value('name', $roleName); ?>">
        </div>
        <div class="form-group">
            <label for="description" class="control-label">Description</label>
             <textarea name="description" type="text" class="form-control" ><?= value('description', $description); ?></textarea>
        </div>
    </div>

    <div class="col-md-8 col-md-offset-2 content-full">
    <h3 style="">Permissions</h3>
    <div class="row">
    <?php foreach ($permissions as $ext => $pms) : ?>
        <div class="col-md-6">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h4 class="panel-title"><?= ucfirst($ext); ?></h4>
                </div>
                <div class="panel-body" style="height:200px;overflow:auto">
                <ul>
                <?php foreach ($pms as $id => $label) : ?>
                    <li class="checkbox permission">
                        <?php $v = in_array($id, $permissionIds) || ($roleName == $adminRole); ?>
                        <input <?= $disabled.' '.checked('permissions', $id, $v); ?> type="checkbox" name="permissions[]" value="<?= $id ?>" ><?= ucfirst($label) ?>
                    </li>
                <?php endforeach; ?>
                </ul>
                </div>
            </div>
        </div>
    <?php
endforeach;?>
    </div>
    </div>
</div>

<input type="hidden" name="id" value="<?= $roleId; ?>">

<?php $this->js('@user/js/roles/edit.js'); 