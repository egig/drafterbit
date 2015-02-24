<?php namespace Drafterbit\System\Asset\Filter;

use Assetic\Asset\AssetInterface;

class ChosenFilter extends BasePathFilter
{
    public function filterDump(AssetInterface $asset)
    {
        $content = $asset->getContent();
        $content = str_replace('chosen-sprite.png', base_url($this->path.'/chosen/chosen-sprite.png'), $content);
        $content = str_replace('chosen-sprite@2x.png', base_url($this->path.'/chosen/chosen-sprite@2x.png'), $content);
        $asset->setContent($content);
    }
}
