<?php $this->extend('@system/main') ?>

<?php $this->css('@system/css/menus.css'); ?>
<div class="container">
	<div class="row">
		<div class="col-md-3">
		<ul class="nav nav-stacked nav-stacked-left" role="tablist">
			<?php foreach ($menus as $menu): ?>
				<li role="presentation"><a href="#<?php echo slug($menu['name'])  ?>" aria-controls="<?php echo $menu['name']  ?>" role="tab" data-toggle="tab"><?php echo $menu['name']  ?></a></li>
			<?php endforeach; ?>
  			<li><a href="#add-menu" data-toggle="tab" id="menu-adder"><?php echo __('Add Menu'); ?></a></li>
		</ul>
		</div>
		<div class="col-md-9 tab-content">
			<?php foreach ($menus as $menu): ?>
        <div role="tabpanel" class="tab-pane" id="<?php echo slug($menu['name'])  ?>">
          <div class="col-md-4 menu-name" style="padding:0">
            <input type="text" name="name" class="form-control input-sm" value="<?php echo $menu['name'] ?>"/>
            <input type="hidden" name="id" value="<?php echo $menu['id'] ?>"/>
          </div>
          <div class="col-md-8">
            <a href="#" class="btn btn-sm btn-default menu-item-saver"><?php echo __('Save') ?></a>
            <a href="#" class="btn btn-sm menu-item-adder" data-menu-id="<?php echo $menu['id']; ?>"><?php echo __('Add Menu Item') ?></a>
            <a href="#" class="btn btn-sm btn-default menu-delete pull-right" data-id="<?php echo $menu['id'] ?>"><i class="fa fa-trash-o  "></i></a>
          </div>
          <div class="clearfix"></div>
          <div class="menu-items">
            <?php echo _print_menu_items($menu['items'], $pageOptions); ?>
          </div>
        </div>
      <?php endforeach; ?>
        <div role="tabpanel" class="tab-pane" id="add-menu">
          <form method="post" class="menu-add-form" action="<?php echo admin_url('menus/add') ?>">
            <div class="col-md-4" style="padding:0">
              <input type="text" name="name" class="form-control input-sm" value=""/>
            </div>
            <div class="col-md-6 form-group">
              <button type="submit" class="btn btn-default btn-sm"><?php echo __('Save') ?></button>
            </div>
          </form>
        </div>
		</div>
	</div>
</div>

<?php function _print_menu_items($items, $pageOptions){ ?>
          <ol class="menu-sortable">
            <?php foreach ($items as $item): ?>
            <li id="<?php echo $item['id'] ?>">
              <div class="panel panel-default menu-item-container">
                <div class="panel-heading">
                  <h4 class="panel-title">
                    <a href="#menu-<?php echo $item['id'] ?>" data-parent=".menu-items li" data-toggle="collapse" aria-expanded="false">
                    <?php echo $item['label'] ?>
                    </a>
                  </h4>
                </div>
                <div class="panel-collapse collapse" id="menu-<?php echo $item['id']; ?>" aria-expanded="false">
                    <form method="POST" class="menu-form" action="<?php echo admin_url('menus/item/save') ?>">
                    <div class="panel-body">
                      <div class="form-group">
                        <label>Label</label>
                        <input type="text" value="<?php echo $item['label'] ?>" name="label" class="form-control input-sm menu-label">
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
                            <option value="<?php echo $v ?>"><?php echo $label ?></option>
                          <?php endforeach;?>
                        </select>
                      </div>

                      <input type="hidden" value="<?php echo $item['id'] ?>" name="id">
                      <div class="form-group">
                        <button class="btn btn-xs btn-primary">Save</button>
                        <a class="btn btn-xs delete-menu-item" href="#">Remove</a>
                      </div>

                    </div>
                  </form>
                  </div>
              </div>
              <?php if($item['childs']): ?>
                <?php echo _print_menu_items($item['childs'], $pageOptions) ?>
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
                <option value="<?php echo $v ?>"><?php echo $label ?></option>
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

<?php $this->js(':jquery_ui_js, :nested_sortable, :notify_js, :jquery_form, @system/js/menus.js, :handlebars'); ?>

