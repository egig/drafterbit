<?php namespace Drafterbit\Blog\Controllers;

use Drafterbit\Extensions\System\BackendController;
use cogpowered\FineDiff\Granularity\Character as CharacterGranularity;
use cogpowered\FineDiff\Render\Html as HtmlRenderer;
use cogpowered\FineDiff\Diff;

class Revision extends BackendController
{
	/**
     * Post revision controller
     *
     * @todo clean this
     */
    public function view($postId)
    {
        $revs = $this['db']->createQueryBuilder()
            ->select('p.*, u.real_name as authorName')
            ->from('#_posts', 'p')
            ->leftJoin('p', '#_users', 'u', 'u.id = p.user_id')
            ->where('type = :type')
            ->setParameter('type', 'revision:'.$postId)
            ->orderBy('p.created_at', 'desc')
        ->getResult();

        $i = 0;

        $current = $this->model('Post')->getOneBy('id', $postId);

        for($i=0;$i<count($revs);$i++) {
        	$new = ($i-1 < 0) ? $current : $revs[$i-1];
        	$old = $revs[$i];

            $revs[$i]['diff_title'] =(new Diff)->render($old['title'], $new['title']);

            $granularity = new CharacterGranularity;
        	$renderer = new HtmlRenderer;
            $diff_content = (new Diff($granularity, $renderer))->render($old['content'], $new['content']);
            $revs[$i]['diff_content'] = str_replace('&lt;/p&gt;', '&lt;/p&gt;<br/><br/>', $diff_content);

           	$revs[$i]['authorUrl'] = admin_url('user/edit/'.$revs[$i]['user_id']);
            $revs[$i]['time'] = $this['time']->parse($revs[$i]['created_at'])->format('d F Y, @H:i');
            $revs[$i]['timeHumans'] = $this['time']->parse($revs[$i]['created_at'])->diffForHumans();
            $revs[$i]['pos'] = count($revs)-$i;
        }

        $data['revs'] = $revs;
        $data['count'] = count($revs);
        $data['postId'] = $postId;

        $data['title'] = __('Revisions of').' <a href="'.admin_url('posts/edit/'.$postId).'">'.$current['title'].'</a>';
        return $this->render('@blog/admin/revision', $data);
    }

    public function clear()
    {
        $postId = $this['input']->post('id');

        return $this['db']->delete('#_posts', ['type' => 'revision:'.$postId]);
    }

    public function revert()
    {
    	$id = $this['input']->post('id');
    	$postId = $this['input']->post('post-id');

        $rev = $this->model('Post')->getOneBy('id', $id);

        $data['title'] = $rev['title'];
        $data['content'] = $rev['content'];

        $this->create($postId, $data['title'], $data['content']);

        $this->model('Post')->update($data, $postId);

        return redirect(admin_url('posts/edit/'.$postId));
    }

    /**
     * Create a post revision
     *
     */
    private function create($id, $new_title, $new_content)
    {
        $current = $this->model('Post')->getOneBy('id', $id);

        if($current['title'] == $new_title &&
            $current['content'] == $new_content) {
            return;
        }

        $insert_data = [
            'title' => $current['title'],
            'content' => $current['content'],
            'created_at' => $this['time']->now(),
            'type' => 'revision:'.$id,
            'user_id' => $this['session']->get('user.id')
        ];

        $this->model('Post')->insert($insert_data);
    }
}