<?php namespace Drafterbit\Base\Asset\Filter;

use Assetic\Asset\AssetInterface;

class FontAwesomeFilter extends BasePathFilter
{
    public function filterDump(AssetInterface $asset)
    {
        $content = $asset->getContent();
        $content = str_replace('../', base_url($this->path.'/fontawesome').'/', $content);
        $asset->setContent($content);
    }
}
