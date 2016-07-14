<?php

namespace drafterbit\Core;

class Util
{
    /**
     * Flatten a multi-dimensional associative array with dots.
     *
     * @param array  $array
     * @param string $prepend
     *
     * @return array
     */
    public static function dot($array, $prepend = '')
    {
        $results = [];

        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $results = array_merge($results, static::dot($value, $prepend.$key.'.'));
            } else {
                $results[$prepend.$key] = $value;
            }
        }

        return $results;
    }

    /**
     * Base64 encode theme screenshot image.
     *
     * @param $imagePath string
     **/
    public static function encodeImage($imagePath)
    {
        $extension = pathinfo($imagePath, PATHINFO_EXTENSION);

        $imgBinary = fread(fopen($imagePath, 'r'), filesize($imagePath));

        return 'data:image/'.$extension.';base64,'.base64_encode($imgBinary);
    }
}
