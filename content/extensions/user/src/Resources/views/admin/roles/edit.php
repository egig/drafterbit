<?php $this->extend('@system/main-edit'); ?>

<?php $this->start('action'); ?>
<button class="btn btn-success btn-sm" type="submit" name="action" value="update">
    <i class="fa fa-check"></i> Save
</button>
<a href="<?php echo admin_url('user/roles'); ?>" class="btn btn-default btn-sm">
    <i class="fa fa-times" style=""></i> Cancel
</a>
<?php $this->end(); ?>

<div class="row row-content">
    <div class="col-md-8 col-md-offset-2 content-full">
        <div class="form-group">
            <label for="name" class="control-label">Role Name</label>
             <input name="name" type="text" class="form-control" placeholder="Role Name" value="<?php echo value('name', $roleName); ?>">
        </div>
        <div class="form-group">
            <label for="description" class="control-label">Description</label>
             <textarea name="description" type="text" class="form-control" ><?php echo value('description', $description); ?></textarea>
        </div>
    </div>

    <div class="col-md-8 col-md-offset-2 content-full">
    <h3 style="">Permissions</h3>
    <div class="row">
    <?php foreach ($permissions as $ext => $pms) : ?>
        <div class="col-md-6">
            <div class="panel panel-default">
                <div class="panel-heading">
                    <h4 class="panel-title"><?php echo ucfirst($ext); ?></h4>
                </div>
                <div class="panel-body" style="height:200px;overflow:auto">
                <ul>
                <?php foreach ($pms as $id => $label) : ?>
                    <li class="checkbox permission">
                        <?php $v = in_array($id, $permissionIds) || ($roleName == $adminRole); ?>
                        <input <?php echo $disabled.' '.checked('permissions', $id, $v); ?> type="checkbox" name="permissions[]" value="<?php echo $id ?>" ><?php echo ucfirst($label) ?>
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

<input type="hidden" name="id" value="<?php echo $roleId; ?>">

<?php $this->js('@user/js/roles/edit.js'); 