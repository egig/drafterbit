<?php namespace Drafterbit\Extensions\System\Controllers;

use Drafterbit\Extensions\System\BackendController;

class Theme extends BackendController {
	
	public function index()
	{
		$this->setting = $this->model('@system\System');

		$cache = $this->get('cache');
		$post = $this->get('input')->post();

		if($post) {
			$this->setting->updateTheme($post['theme']);

			$cache->delete('settings');
			
			message('Theme updated', 'success');
		}

		// @todo
		$settings = $this->setting->all();

		set('currentTheme', $settings['theme']);

		$themesDir = $this->get('path.themes');
		$themes = $this->get('themes')->all();

		set('themes', $themes);
		set('id', 'themes');
		set('title', __('Themes'));

		return $this->render('@system/setting/appearance', $this->getData());
	}

	public function customize()
	{
		$this->get('session')->set('customize_mode', 1);

		$currentTheme = $this->get('themes')->get();

		$positions = $currentTheme['widgets'];

		if(!isset($currentTheme->widget->position)) {
			//return 'Current theme does not support widget';
		}

		$model = $this->model('widget');

		foreach ($positions as $position) {
			$widgets[$position] = $model->widget($position);
		}

		foreach ($widgets as $name => $arrayOfWidget) {

			foreach ($arrayOfWidget as $widget) {

			$widgetObj = $this->get('widget')->get($widget->name);

				$widget->ui = $this->get('widget.ui')->build($widgetObj);
			}
		}

		$menuPositions = $currentTheme['menus'];

		$menuModel = $this->model('@system\\Menus');

		$theme = $this->get('themes')->current();

		foreach ($menuPositions as $position) {		
			$menus[$position] = $menuModel->getByThemePosition($theme, $position);
		}

		$availableWidget = $this->get('widget')->all();

		$config = $this->model('@system\System')->all();
		
		$data = [
			'siteName' => $config['site.name'],
			'tagLine' => $config['site.description'],
			'homepage' => $config['homepage'],
			'pageOptions' => $this->get('app')->getFrontPageOption(),
		];

		$data['availableWidget'] = $availableWidget;
		$data['menuPositions'] = $menuPositions;
		$data['widgetPositions'] = $positions;
		$data['widgets'] = $widgets;
		$data['menus'] = $menus;

		return $this->render('@system/setting/customize', $data);
	}

	public function customPreview()
	{
		if($this->get('input')->post('endSession')) {
			$this->get('session')->remove('customize_mode');
			$this->get('session')->remove('customize_data');

			return;
		}

		$general = $this->get('input')->post('general');
		$url = $this->get('input')->post('url');

		$c_data = array(
			'siteName' => $general['title'],
			'siteDesc' => $general['tagline'],
		);
		$this->get('session')->set('customize_data', $c_data);

		return $this->jsonResponse(array(
			'url' => $url,
		));
	}
}