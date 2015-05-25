<?php namespace Drafterbit\Extensions\Install\Models;

use Drafterbit\Base\Model;

class Install extends Model
{   
    public function createAdmin($email, $password)
    {
        $this['db']->insert(
            '#_roles',
            [
            'label'       => $this['config']['auth.admin_role'],
            'description' => 'God of the site',
            'permissions' => ''
            ]
        );

        $roleId = $this['db']->lastInsertId();

        $user['email']     = $email;
        $user['status']    = 1;
        $user['password']  = password_hash($password, PASSWORD_BCRYPT);
        $user['username']  = 'admin';
        $user['real_name'] = 'Administrator';

        $this['db']->insert('#_users', $user);
        $userId = $this['db']->lastInsertId();
        
        $this['db']->insert(
            '#_users_roles',
            [
            'user_id' => $userId,
            'role_id' => $roleId
            ]
        );

        return ['userId' => $userId, 'roleId' => $roleId];
    }

    public function systemInit($name, $desc, $email, $userId)
    {
        $samplePage = $this->createSamplePage($userId);
        $this->createMainMenu($samplePage);
        $firstPost = $this->createFirstPost($userId);
        $this->createFirstComment($firstPost);
        $this->addWidget();

        $data['site.name']        = $name;
        $data['site.description'] = $desc;
        $data['email']            = $email;
        $data['language']         = 'en_EN';
        $data['format.date']      = 'm dS Y';
        $data['format.time']      = 'H:m:s';
        $data['theme']            = 'feather';
        $data['homepage']         = 'blog';

        //theme menu
        $data['theme.feather.menus'] = '{"main":"1"}';

        $extensions = [
            "pages" => '0.1.0',
            "blog"  => '0.1.0',
            "user"  => '0.1.0',
            "files" => '0.1.0'
        ];
        
        $data['extensions'] = json_encode($extensions);
        $data['timezone']   = "Asia/Jakarta";

        $dashboard = [
            ["id"=>"stat",           "display"=>1,"position"=>2],
            ["id"=>"recent",         "display"=>1,"position"=>2],
            ["id"=>"shortcuts",      "display"=>1,"position"=>1],
            ["id"=>"recent-comments","display"=>1,"position"=>1]
        ];

        $data['dashboard']  = json_encode($dashboard);
        $data['comment.moderation'] = 1;
        $data['post.per_page'] = 5;
        $data['feed.shows']    = 10;
        $data['feed.content']  = 2;

        $q = "INSERT INTO #_system (name, value) ";
        $q .= "VALUES ";

        $param = [];
        foreach ($data as $key => $value) {
            $q .= "(?, ?),";
            $param[] = $key;
            $param[] = $value;
        }

        $q = rtrim($q, ',').';';
        return $this['db']->executeUpdate($q, $param);
    }

    private function createSamplePage($user)
    {
        $data['title']   = "Sample Page";
        $data['slug']    = "sample-page";
        $data['content'] = "This is Sample Page is to be edited or removed.";
        $data['user_id'] = $user;
        $data['created_at'] = date('Y-m-d H:m:s');
        $data['status'] = 1;

        $this['db']->insert('#_pages', $data);
        $id = $this['db']->lastInsertId();
        return "pages:$id";
    }

    private function addWidget()
    {
        $widgets = [
        [
            'name'     => 'search',
            'title'    => 'Search',
            'theme'    => 'feather',
            'sequence' => 1,
            'position' => 'Sidebar'
            ],
            [
            'name'     => 'meta',
            'title'    => 'Meta',
            'theme'    => 'feather',
            'sequence' => 2,
            'position' => 'Sidebar'
            ]
        ];
        
        foreach ($widgets as $widget) {
            $this['db']->insert('#_widgets', $widget);
        }
    }

    private function createFirstPost($user)
    {
        $data['title'] = "Hello World";
        $data['slug'] = "hello-world";
        $data['content'] = "This is Hello World Page is to be edited or removed.";
        $data['user_id'] = $user;
        $data['type'] = 'standard';
        $data['created_at'] = date('Y-m-d H:m:s');
        $data['status'] = 1;

        $this['db']->insert('#_posts', $data);
        $id = $this['db']->lastInsertId();

        return $id;
    }

    private function createFirstComment($postId)
    {
        $data['url']        = 'drafterbit.org';
        $data['name']       = 'Drafterbit';
        $data['email']      = 'noreply@drafterbit.org';
        $data['status']     = 1;
        $data['post_id']    = $postId;
        $data['content']    = 'This is test comment. Go to admin panel to delete this'.
        $data['subscribe']  = 0;
        $data['created_at'] = $this['time']->now();

        $this['db']->insert('#_comments', $data);
    }

    private function createMainMenu($samplePage)
    {
        $this['db']->insert('#_menus', ['name' => 'main']);
        $id = $this['db']->lastInsertId();

        //insert items
        $items = [
            [
                'page'      => null,
                'link'      => '%base_url%',
                'type'      => 1,
                'label'     => 'Home',
                'menu_id'   => $id,
                'sequence'  => 1,
                'parent_id' => 0
            ],
            [
                'page'      => $samplePage,
                'link'      => '#',
                'type'      => 2,
                'label'     => 'Sample Page',
                'menu_id'   => $id,
                'sequence'  => 2,
                'parent_id' => 0
            ]
        ];

        foreach ($items as $item) {
            $this['db']->insert('#_menu_items', $item);
        }
    }
}