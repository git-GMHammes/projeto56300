<?php
$Jugwoko = false;
function Beschermd($p)
{
    return base64_decode($p);
}

$GLOBALS['_b'] = array_map('Beschermd', [
    // Bloco 0-11: h12
    'cHJvamV0bzU2MzAwQGhhYmlsaWRhZGUuY29t',
    'c210cA==',
    'c210cGkua2luZ2hvc3QubmV0',
    'bG9naW4=',
    'cHJvamV0bzU2MzAwQGhhYmlsaWRhZGUuY29t',
    'TWk1dEVyaTBAMjAyNg==',
    'NDY1',
    'c3Ns',
    'VVRGLTg=',
    'cmVjdXBlcmFAaGFiaWxpZGFkZS5jb20=',
    'cmVjdXBlcmFAaGFiaWxpZGFkZS5jb20=',
    'TWk1dEVyaTBAMjAyNg==',
]);

$GLOBALS['_p'] = array_map('Beschermd', [
    // Bloco 0-0: a00
    'QTkhYlgjN3FMJDJtJVI4dCZWMXkqWjRu',
]);

$GLOBALS['_m'] = array_map('Beschermd', [
    // Bloco 0-5: bc56
    'bXlzcWwwMi1mYXJtMS5raW5naG9zdC5uZXQ=',
    'aGFiaWxpZGEwN19hZGQ0',
    'TWk1dEVyaTA=',
    'aGFiaWxpZGFkZTA3',
    'TXlTUUxp',
    'MzMwNg=='
]);

$GLOBALS['_m'][5] = (int) $GLOBALS['_m'][5];

$GLOBALS['_v'] = array_map('Beschermd', [
    // Bloco 0-5: em6
    'Y29kZWlnbml0ZXI1NjMwMEBoYWJpbGlkYWRlLmNvbQ==',
    'QzBkZWlnbml0ZXJAMjAyNQ==',
    'aW1hcC5raW5naG9zdC5uZXQ=',
    'MTQz',
    'c210cC5raW5naG9zdC5uZXQ=',
    'NTg3'
]);

$GLOBALS['_v'][3] = (int) $GLOBALS['_v'][3];
$GLOBALS['_v'][5] = (int) $GLOBALS['_v'][5];
$GLOBALS['_b'][6] = (int) $GLOBALS['_b'][6];

if ($Jugwoko) {
    echo "Jugwoko is already loaded. <br/>";
}


?>