<?php

namespace drafterbit\Bundle\CoreBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Question\Question;

class InstallCommand extends ContainerAwareCommand
{
    protected function configure()
    {
        $this
            ->setName('drafterbit:install')
            ->setDescription('Install drafterbit');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $username = $this->askUsername($input, $output);
        $email = $this->askEmail($input, $output);
        $password = $this->askPassword($input, $output);

        $this->getContainer()->get('installer')->set('account', [
            'username' => $username,
            'email' => $email,
            'password' => $password,
        ]);

        $createSchemeCommand = $this->getApplication()->find('doctrine:schema:create');
        $loadFixturesCommand = $this->getApplication()->find('doctrine:fixtures:load');

        $input = new ArrayInput(['command' => 'doctrine:schema:create']);
        $returnCode = $createSchemeCommand->run($input, $output);

        $input = new ArrayInput(['command' => 'doctrine:fixtures:load', '--append' => true]);
        $returnCode = $loadFixturesCommand->run($input, $output);
        if ($returnCode == 0) {
            $output->writeln('fixtures successfully loaded ...');
        }

        $output->writeln('Installation Complete.');
    }

    protected function askUsername($input, $output)
    {
        $helper = $this->getHelper('question');
        $usernameQuestion = new Question('Username for the Administrator : ');

        $username = $helper->ask($input, $output, $usernameQuestion);
        while ($error = $this->validateUsername($username)) {
            $output->writeln($error);
            $username = $helper->ask($input, $output, $usernameQuestion);
        }

        return $username;
    }

    protected function askPassword($input, $output)
    {
        $helper = $this->getHelper('question');
        $password = $helper->ask($input, $output, new Question('Password for the Administrator : '));

        return $password;
    }

    protected function askEmail($input, $output)
    {
        $helper = $this->getHelper('question');

        $email = $helper->ask($input, $output, new Question('Email for the Administrator : '));
        while (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
            $output->writeln('Not a valid email');
            $email = $helper->ask($input, $output, new Question('Email for the Administrator : '));
        }

        return $email;
    }

    protected function validateUsername($username)
    {

        // each array entry is an special char allowed
        // besides the ones from ctype_alnum
        $allowed = array('.', '-', '_');

        if (!ctype_alnum(str_replace($allowed, '', $username))) {
            return 'Invalid Username';
        }

        // username is valid
        return false;
    }
}
