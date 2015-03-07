<?php namespace Drafterbit\App\Asset\Filter;

use Assetic\Asset\AssetInterface;
use Assetic\Filter\FilterInterface;

class BasePathFilter implements FilterInterface
{
    protected $path;
    public function __construct($path)
    {
        $this->path = $path;
    }

    public function filterLoad(AssetInterface $asset)
    {

    }
    
    public function filterDump(AssetInterface $asset)
    {

    }
}
