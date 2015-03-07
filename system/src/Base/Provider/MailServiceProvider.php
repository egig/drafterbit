<?php namespace Drafterbit\Base\Provider;

use Swift_Mailer;
use Swift_Message;
use Pimple\Container;
use Swift_SmtpTransport;
use Pimple\ServiceProviderInterface;

class MailServiceProvider implements ServiceProviderInterface {
    public function register(Container $app)
    {
        $app['mailer'] = function($app){
            return new Swift_Mailer($app['mailer.transport']);
        };

        //For now, we only use smtp
        $app['mailer.transport'] = function($app){

            $host = $app['config']['mail.smtp.host'];
            $port = $app['config']['mail.smtp.port'];
            $user = $app['config']['mail.smtp.user'];
            $pass = $app['config']['mail.smtp.pass'];
            
            $transport = Swift_SmtpTransport::newInstance($host, $port, 'ssl')
            ->setUsername($user)
            ->setPassword($pass);

            return $transport;
        };

        $app['mail'] = $this->app->factory(function(){
            return Swift_Message::newInstance();
        });
    }
}
