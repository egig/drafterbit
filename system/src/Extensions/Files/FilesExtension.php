<?php namespace Drafterbit\Extensions\Files;

use Drafterbit\Base\Application;

class FilesExtension extends \Drafterbit\Base\Extension
{
 	public function getNav()
 	{
	 	return [
	            [ 'id'=>'files', 'parent' =>'content', 'label' => 'Files', 'href' => 'files', 'order' => 3],
	    ];
 	}

 	public function getPermissions()
 	{
	    return [
	        'files.view'   => 'view files',
	        'files.create' => 'upload files or create folder',
	        'files.delete' => 'delete files',
	        'files.move'   => 'move or rename files',
	    ];
 	}

    public function register(Application $app)
    {
        $app['helper']->register('files', $this->getResourcesPath('helpers/files.php'));
        $app['helper']->load('files');
    }

    public function getShortcuts()
    {
        return [
            [
                'link' => admin_url('files'),
                'label' => 'Upload Files',
                'icon-class' => 'fa fa-cloud-upload',
                'order' => 3
            ]
        ];
    }
}
