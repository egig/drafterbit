<?php

namespace drafterbit\Bundle\DistributionBundle\Installer;

class Installer
{
    private $steps;
    private $container;
    private $data = [];
    private $cacheFile;
    private $connection;

    public function __construct($container)
    {
        $this->container = $container;
        $this->cacheFile = $this->container->get('kernel')->getCacheDir().'/install.data';
        $this->read();
    }

    public function addStep(Step\StepInterface $step)
    {
        $this->steps[] = $step;
    }

    public function getStep($index)
    {
        return $this->steps[$index];
    }

    public function getSteps()
    {
        return $this->steps;
    }

    public function getStepCount()
    {
        return count($this->steps);
    }

    public function read()
    {
        $this->data = (array) json_decode(unserialize(@file_get_contents($this->cacheFile)), true);
    }

    public function write()
    {
        $content = serialize(json_encode($this->data));
        @file_put_contents($this->cacheFile, $content);
    }

    public function set($name, $data)
    {
        $this->data[$name] = $data;
        $this->write();
    }

    public function get($name)
    {
        $this->read();

        return isset($this->data[$name]) ? $this->data[$name] : null;
    }

    public function finalize()
    {
        foreach ($this->steps as $step) {
            if (method_exists($step, 'finalize')) {
                $step->finalize();
            }
        }

        // Clear production cache
        $filesystem = $this->container->get('filesystem');
        $kernelDir = $this->container->get('kernel')->getRootDir();
        $filesystem->remove($kernelDir.'/../../app/cache/prod');
    }

    public function getConnection()
    {
        if (!$this->connection) {
            $param = $this->get('doctrine');
            $param['dbname'] = $param['name'];
            $this->connection = $this->container->get('doctrine.dbal.connection_factory')
                ->createConnection($param);
        }

        return $this->connection;
    }
}
