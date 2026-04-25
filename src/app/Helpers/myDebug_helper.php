<?php

if (! function_exists('debug')) {
    function debug(mixed $data, string $label = '', bool $die = false): void
    {
        echo '<pre>';
        if ($label !== '') {
            echo "<strong>$label</strong>\n";
        }
        print_r($data);
        echo '</pre>';

        if ($die) {
            exit;
        }
    }
}
