<?php

namespace Drafterbit\Bundle\BlogBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Drafterbit\Bundle\SystemBundle\System\FrontpageProvider;

use Drafterbit\Bundle\SystemBundle\Model\System as SystemModel;

use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;

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
            ->add('post_perpage', TextType::class, ['data' => $this->data('blog.post_perpage')])
            ->add('feed_shows', TextType::class, ['data' => $this->data('blog.feed_shows')])
            ->add('feed_content', ChoiceType::class, [
                'choices' => [
                    'Full Text' => 1,
                    'Summary' => 2
                ],
                'data' => $this->data('blog.feed_content')]
            )->add('comment_moderation', ChoiceType::class, [
                'choices' => [
                    'Never' => 0,
                    'Always' => 1
                ],
                'data' => $this->data('blog.comment_moderation')]
            );
            //->add('Save', 'submit');
    }

    public function configureOptions(OptionsResolver $resolver)
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
