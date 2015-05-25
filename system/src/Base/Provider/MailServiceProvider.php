<?php namespace Drafterbit\Bisa\Provider;

use Swift_Mailer;
use Swift_Message;
use Pimple\Container;
use Swift_SmtpTransport;
use Pimple\ServiceProviderInterface;

class MailServiceProvider implements ServiceProviderInterface
{
    
    public function register(Container $app)
    {
        $app['mailer'] = function($app){
            return new Swift_Mailer($app['mailer.transport']);
        };

        //For now, we only use smtp
        $app['mailer.transport'] = function($app){

            $config = $app->getExtension('system')->model('System')->all();

            $host = $config['smtp.host'];
            $port = $config['smtp.port'];
            $user = $config['smtp.user'];
            $pass = $config['smtp.pass'];
            
            $transport = Swift_SmtpTransport::newInstance($host, $port, 'ssl')
            ->setUsername($user)
            ->setPassword($pass);

            return $transport;
        };

        $app['mail'] = $app->factory(
            function(){
                return Swift_Message::newInstance();
            }
        );
    }
}
