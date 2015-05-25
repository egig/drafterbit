<?php namespace Drafterbit\Base\Asset\Filter;

use Assetic\Asset\AssetInterface;

class ColorPickerFilter extends BasePathFilter
{
    public function filterDump(AssetInterface $asset)
    {
        $content = $asset->getContent();
        $content = str_replace('../', base_url($this->path.'/mjolnic-bootstrap-colorpicker/dist').'/', $content);
        $asset->setContent($content);
    }
}