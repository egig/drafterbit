<?php namespace Drafterbit\Blog\Controllers;

use Drafterbit\Extensions\System\BackendController;
use Drafterbit\Component\Validation\Exceptions\ValidationFailsException;

class Blog extends BackendController
{
    public function index()
    {
        $status = 'all';
        $data['id']        = 'posts';
        $data['title']     = __('Blog');
        $data['status']    = $status;
        $data['action']    = admin_url('blog/trash');

        return $this->render('@blog/admin/index', $data);
    }

    public function trash()
    {
        $post = $this['input']->post();
        $model = $this->model('Post');

        $postIds = $post['posts'];

        switch($post['action']) {
            case "trash":
                $model->trash($postIds);
                break;
            case 'delete':
                $model->delete($postIds);
            case 'restore':
                $model->restore($postIds);
                break;
            default:
                break;
        }
    }

    public function filter($status)
    {
        $posts = $this->model('@blog\Post')->all(['status' => $status]);
        
        $editUrl = admin_url('blog/edit');

        $pagesArr  = [];

        foreach ($posts as $post) {
            $data = [];
            $data['id'] = $post['id'];
            $data['title'] = $post['title'];
            $data['author'] = $post['authorName'];
            $data['user_id'] = $post['user_id'];

            if ($status == 'trashed') {
                $s = ucfirst($status);
            } else {
                $s = $post['status'] == 1 ? __('Published') : __('Unpublished');
            }

            $data['status'] = $s;
            $data['created_at'] = $post['created_at'];

            $pagesArr[] = $data;
        }

        $ob = new \StdClass;
        $ob->data = $pagesArr;
        $ob->recordsTotal= count($pagesArr);
        $ob->recordsFiltered = count($pagesArr);

        return $this->jsonResponse($ob);
    }

    public function edit($id)
    {
        $tagOptionsArray = $this->model('Tag')->all();
        $tagOptions = '[';
        foreach ($tagOptionsArray as $tO) {
            $tO = (object) $tO;
            $tagOptions .= "'{$tO->label}',";
        }
        $tagOptions = rtrim($tagOptions, ',').']';

        if ('new' == $id) {
            $data = [
                'postId' => null,
                'postTitle' => null,
                'slug' => null,
                'content' => null,
                'tagOptions' => $tagOptions,
                'tags' => [],
                'revisions' => [],
                'status' => 1,
                'title' => __('New Post'),
            ];
        } else {
            $model = $this->model('Post'); 
            $post = $model->getBy('id', $id);
            $post->tags = $model->getTags($id);
            $post->revisions = array_map(function($item) {
                $item['time_human'] = $this['time']->parse($item['time'])->diffForHumans();
                $item['time'] = $this['time']->parse($item['time'])->format('d F Y, @H:s');
                return $item;
            }, $model->getRevisions($id));

            $tags = [];
            foreach ($post->tags as $tag) {
                $tag = (object) $tag;
                $tags [] = $tag->label;
            }

            $data = [
                'postId' => $id,
                'postTitle' => $post->title,
                'slug' => $post->slug,
                'content' => $post->content,
                'revisions' => $post->revisions,
                'tags' => $tags,
                'tagOptions' => $tagOptions,
                'status' => $post->status,
                'title' => __('Edit Post'),
            ];
        }

        $data['id'] = 'post-edit';
        $data['action'] = admin_url('blog/save');
        
        return $this->render('@blog/admin/edit', $data);
    }

    public function save()
    {
        $model = $this->model('Post');
        
        try {
            $postData = $this['input']->post();

            $this->validate('blog', $postData);

            $id = $postData['id'];

            if (is_numeric($id)) {

                $this->createRevision($id, $postData['content']);

                $data = $this->createUpdateData($postData);
                $model->update($data, $id);
            
            } else {
                $data = $this->createInsertData($postData);
                $id = $model->insert($data);
            }

            if (isset($postData['tags'])) {
                $this->insertTags($postData['tags'], $id);
            }

            // @todo log here
            return $this->jsonResponse(['message' => __('Post succesfully saved'), 'status' => 'success', 'id' => $id]);

        } catch (ValidationFailsException $e) {
            return $this->jsonResponse(
                ['error' => [
                    'type' => 'validation',
                    'message' => $e->getMessage(),
                    'messages' => $e->getMessages()
                ]
                ]
            );
        }
    }

    /**
     * Create a post revision
     *
     * @param int $id
     */
    private function createRevision($id, $new_content)
    {
        $current = $this->model('Post')->getOneBy('id', $id);

        if($current['content'] == $new_content) {
            return;
        }

        $insert_data = [
            'content' => $current['content'],
            'created_at' => $this['time']->now(),
            'type' => 'revision:'.$id,
            'user_id' => $this['session']->get('user.id')
        ];

        $this->model('Post')->insert($insert_data);
    }

    /**
     * Parse post data to insert to db
     *
     * @param  array $post
     * @return array
     */
    protected function createInsertData($post, $isUpdate = false)
    {
        $data = [];
        
        $data['slug']       = $post['slug'];
        $data['title']      = $post['title'];
        $data['status']     = $post['status'];
        $data['content']    = $post['content'];
        $data['user_id']    = $this['session']->get('user.id');
        $data['updated_at'] = $this['time']->now();
        
        if (! $isUpdate) {
            $data['created_at'] = $this['time']->now();
        }

        return $data;
    }

    /**
     * Parse post data for update
     *
     * @param  array $post
     * @return array
     */
    public function createUpdateData($post)
    {
        return $this->createInsertData($post, true);
    }

    protected function insertTags($tags, $postId)
    {
        $post = $this->model('Post');
        $tag = $this->model('Tag');
        
        //delete all related tag first
        $post->clearTag($postId);

        foreach ($tags as $t) {
            if (! $tagId = $tag->getIdBy('label', $t)) {
                $tagId = $tag->save($t);
            }

            $post->addTag($tagId, $postId);
        }
    }

    public function setting()
    {
        $data['title'] = __('Blog Setting');

        $model = $this->model('@system\System');

        if ($post = $this['input']->post()) {

            $newSetting = [
                'feed.shows'         => $post['feed_shows'],
                'post.per_page'      => $post['post_perpage'],
                'feed.content'       => $post['feed_content'],
                'comment.moderation' => $post['comment_moderation']
            ];

            $model->updateSetting($newSetting);

            $this['template']->addGlobal('messages', [['text' => "Setting updated", "type" => 'success']]);
        }

        $data['mode']        = $model->get('comment.moderation');
        $data['postPerpage'] = $model->get('post.per_page', 5);
        $data['feedShows']   = $model->get('feed.shows', 10);
        $data['feedContent'] = $model->get('feed.content', 2);
        return $this->render('@blog/admin/setting', $data);
    }

    public function revision($id)
    {
        $data['title'] = __('Post Revision');
        $old_rev = $this->model('Post')->getOneBy('id', $id);
        $old_content = $old_rev['content'];

        //get newer content
        $revs = $this['db']->createQueryBuilder()
            ->select('*')
            ->from('#_posts', 'p')
            ->where('type = :type')
            ->andWhere('created_at > :created')
            ->setParameter('type', $old_rev['type'])
            ->setParameter('created', $old_rev['created_at'])
            ->orderBy('p.created_at', 'asc')
            ->getResult();

        if(count($revs) > 0) {
            $new_rev = reset($revs);
        } else {
            // get curent version
            $_tmp = explode(':', $old_rev['type']);
            $post_id = end($_tmp);

            $new_rev = $this->model('Post')->getOneBy('id', $post_id);
        }
        
        $new_content = $new_rev['content'];

        // @todo clean this
        $granularity = new \cogpowered\FineDiff\Granularity\Word;
        $renderer = new \cogpowered\FineDiff\Render\Html;
        $data['diff'] = html_entity_decode((new \cogpowered\FineDiff\Diff($granularity, $renderer))
            ->render($old_content, $new_content));

        return $this->render('@blog/admin/revision', $data);
    }
}