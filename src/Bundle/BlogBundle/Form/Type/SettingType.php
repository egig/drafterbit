<?php

namespace Drafterbit\Bundle\BlogBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Drafterbit\Bundle\SystemBundle\FrontpageProvider;

use Drafterbit\Bundle\SystemBundle\Model\System as SystemModel;

class SettingType extends AbstractType
{
    protected $systemModel;

    public function __construct(SystemModel $systemModel)
    {
        $this->systemModel = $systemModel;
    }

    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('post_perpage', 'text', ['data' => $this->data('blog.post_perpage')])
            ->add('feed_shows', 'text', ['data' => $this->data('blog.feed_shows')])
            ->add('feed_content', 'choice', [
                'choices' => [
                    1 => 'Full Text',
                    2 => 'Summary'
                ],
                'data' => $this->data('blog.feed_content')]
            )->add('comment_moderation', 'choice', [
                'choices' => [
                    0 => 'Never',
                    1 => 'Always'
                ],
                'data' => $this->data('blog.comment_moderation')]
            );
            //->add('Save', 'submit');
    }

    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults([
            'required' => false,
            'mapped' => false
        ]);
    }

    public function getName()
    {
        return 'blog';
    }

    private function data($key)
    {
        return  $this->systemModel->get($key);
    }
}