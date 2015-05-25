<?php _extend('@system/main') ?>

<?php _css('@system/css/menus.css'); ?>
<div class="container">
    <div class="row">
        <div class="col-md-2">
        <ul class="nav nav-stacked nav-stacked-left" role="tablist">
            <?php foreach ($menus as $menu): ?>
                <li role="presentation"><a href="#<?= slug($menu['name'])  ?>" aria-controls="<?= $menu['name']  ?>" role="tab" data-toggle="tab"><?= $menu['name']  ?></a></li>
            <?php endforeach; ?>
              <li><a href="#add-menu" data-toggle="tab" id="menu-adder"><i class="fa fa-plus"></i></a></li>
        </ul>
        </div>
        <div class="col-md-10 tab-content">
            <?php foreach ($menus as $menu): ?>
        <div role="tabpanel" class="tab-pane" id="<?= slug($menu['name'])  ?>">
          <div class="clearfix menu-setting">
            <div class="col-md-4 menu-name" style="padding:0">
              <label><?= __('Menu name') ?></label>
              <input type="text" name="name" class="form-control input-sm" value="<?= $menu['name'] ?>"/>
              <input type="hidden" name="id" value="<?= $menu['id'] ?>"/>
            </div>
          </div>
          <div class="menu-items">
            <label><?= __('Menu Items'); ?></label>
            <?= _print_menu_items($menu['items'], $pageOptions); ?>
            <a href="#" class="btn btn-sm menu-item-adder" data-menu-id="<?= $menu['id']; ?>"><?= __('Add Menu Item') ?></a>
          </div>
          <div class="menu-action">
              <a href="#" class="btn btn-sm btn-default menu-item-saver"><?= __('Save') ?></a>
              <a href="#" class="btn btn-sm menu-delete" data-id="<?= $menu['id'] ?>"><?= __('Delete') ?></a>
          </div>
        </div>
      <?php endforeach; ?>
        <div role="tabpanel" class="tab-pane" id="add-menu">
          <form method="post" class="menu-add-form" action="<?= admin_url('menus/add') ?>">
            <div class="clearfix menu-setting">
              <div class="col-md-4" style="padding:0">
                <label><?= __('Menu name') ?></label>
                <input type="text" name="name" class="form-control input-sm" value=""/>
                <button type="submit" class="btn btn-default btn-sm" style="margin-top:10px;"><?= __('Submit') ?></button>
              </div>
            </div>
          </form>
        </div>
        </div>
    </div>
</div>

<?php function _print_menu_items($items, $pageOptions){ ?>
          <ol class="menu-sortable">
            <?php foreach ($items as $item): ?>
            <li id="<?= $item['id'] ?>">
              <div class="panel panel-default menu-item-container">
                <div class="panel-heading">
                  <h4 class="panel-title">
                    <a href="#menu-<?= $item['id'] ?>" data-parent=".menu-items li" data-toggle="collapse" aria-expanded="false">
                    <?= $item['label'] ?>
                    </a>
                  </h4>
                </div>
                <div class="panel-collapse collapse" id="menu-<?= $item['id']; ?>" aria-expanded="false">
                    <form method="POST" class="menu-form" action="<?= admin_url('menus/item-save') ?>">
                    <div class="panel-body">
                      <div class="form-group">
                        <label>Label</label>
                        <input type="text" value="<?= $item['label'] ?>" name="label" class="form-control input-sm menu-label">
                      </div>

                      <div class="form-group">
                        <label>Type</label>
                        <select class="form-control input-sm menu-type" name="type">
                          <option value="1" selected="selected">Custom Link</option>
                          <option value="2">Page</option>
                        </select>
                      </div>

                      <div class="form-group menu-type-link">
                        <label>Link</label>
                        <input type="text" value="#" name="link" class="form-control input-sm">
                      </div>
                      
                      <div class="form-group menu-type-page" style="display:none">
                        <label>Page</label>
                        <select class="form-control input-sm" name="page">
                          <?php foreach ($pageOptions as $v => $label) : ?>
                            <option value="<?= $v ?>"><?= $label ?></option>
                          <?php endforeach;?>
                        </select>
                      </div>

                      <input type="hidden" value="<?= $item['id'] ?>" name="id">
                      <div class="form-group">
                        <button class="btn btn-xs btn-primary">Save</button>
                        <a class="btn btn-xs delete-menu-item" href="#">Remove</a>
                      </div>

                    </div>
                  </form>
                  </div>
              </div>
              <?php if($item['childs']): ?>
                <?= _print_menu_items($item['childs'], $pageOptions) ?>
              <?php endif;?>
            </li>
            <?php endforeach ?>
          </ol>
<?php } ?>

<script id="menu-item-template" type="text/x-handlebars-template">
  <div class="panel panel-default menu-item-container">
    <div class="panel-heading">
      <h4 class="panel-title">
      <a href="#new-menu-{{id}}" data-parent=".menu-items li" data-toggle="collapse" aria-expanded="false">
        {{label}}
      </a>
      </h4>
    </div>
    <div class="panel-collapse collapse" id="new-menu-{{id}}" aria-expanded="false">
        <form method="POST" class="menu-form" action="{{formAction}}">
        <div class="panel-body">
          <div class="form-group">
            <label>Label</label>
            <input type="text" value="{{label}}" name="label" class="form-control input-sm menu-label">
          </div>

          <div class="form-group">
            <label>Type</label>
            <select class="form-control input-sm menu-type" name="type">
              <option value="1" selected="selected">Custom Link</option>
              <option value="2">Page</option>
            </select>
          </div>

          <div class="form-group menu-type-link">
            <label>Link</label>
            <input type="text" value="#" name="link" class="form-control input-sm">
          </div>
          
          <div class="form-group menu-type-page" style="display:none">
            <label>Page</label>
            <select class="form-control input-sm" name="page">
              <?php foreach ($pageOptions as $v => $label) : ?>
                <option value="<?= $v ?>"><?= $label ?></option>
              <?php endforeach;?>
            </select>
          </div>

          <input type="hidden" value="{{id}}" name="id">
          <div class="form-group">
            <button class="btn btn-xs btn-primary">Save</button>
            <a class="btn btn-xs delete-menu-item" href="#">Remove</a>
          </div>

        </div>
      </form>
      </div>
  </div>
</script>

<?php _js(':jquery_ui_js, :nested_sortable, :notify_js, :jquery_form, @system/js/menus.js, :handlebars'); ?>

