<?php

namespace drafterbit\Bundle\CoreBundle;

class Installer
{
    private $container;
    private $data = [];
    private $cacheFile;

    public function __construct($container)
    {
        $this->container = $container;
        $this->cacheFile = $this->container->get('kernel')->getCacheDir().'/install.data';
        $this->read();
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
}
