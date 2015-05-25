<?php namespace Drafterbit\Component\Support;

use Carbon\Carbon;
use Drafterbit\Component\Translation\Translator;

class TimeHelper extends Carbon {

    /**
     * Translator
     *
     * @var string
     */
    protected static $translator;

    /**
     * @{inheritdoc}
     */
    public function format($format)
    {
        return $this->translate(parent::format($format));
    }

    /**
     * Translate given date
     *
     * @param string $data
     */
    protected function translate($date)
    {
        $temp = explode(' ', $date);

        $temp = array_map(function($v){
            return static::$translator->trans($v);

        }, $temp);

        return implode(' ', $temp);
    }

    /**
     * Set translator
     *
     * @param Drafterbit\Component\Translation\Translator
     */
    public static function setTranslator(Translator $translator)
    {
        static::$translator = $translator;
    }

    public function diffForHumans(Carbon $other = null, $absolute = false)
    {
        return $this->translate(parent::diffForHumans($other));
    }
}