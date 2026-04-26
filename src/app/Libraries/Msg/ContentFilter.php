<?php

namespace App\Libraries\Msg;

/**
 * Filtro de conteúdo para o módulo de mensagens.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * COMO USAR (desenvolvedor):
 *
 *   Edite apenas as duas seções marcadas abaixo:
 *     - BANNED_PHRASES : frases multi-palavra (verificadas PRIMEIRO)
 *     - BANNED_WORDS   : palavras isoladas    (verificadas DEPOIS)
 *
 *   Frases: todas têm o mesmo substituto '_____________ '
 *   Palavras: cada uma tem seu próprio substituto (defina no array)
 *
 *   Matching: case-insensitive, Unicode (funciona com acentos)
 *   Frases : sem word-boundary (captura em qualquer posição do texto)
 *   Palavras: com word-boundary \b (somente palavras completas)
 * ─────────────────────────────────────────────────────────────────────────────
 */
final class ContentFilter
{
    // =========================================================================
    // FRASES PROIBIDAS
    // Coloque frases mais longas ANTES das mais curtas para evitar
    // substituição parcial. Ex: "vai tomar no cu" antes de "tomar no cu".
    // Substituto fixo: '_____________'
    // =========================================================================
    private const BANNED_PHRASES = [
        'vai tomar no cu'    => '_____________',
        'vai tomar no cú'    => '_____________',
        'vai tomar no rabo'  => '_____________',
        'tomar no cu'        => '_____________',
        'tomar no cú'        => '_____________',
        'vai se foder'       => '_____________',
        'vá se foder'        => '_____________',
        'filho da puta'      => '_____________',
        'filha da puta'      => '_____________',
        'cu arrombado'       => '_____________',
        'cú arrombado'       => '_____________',
        'puta merda'         => '_____________',
        'sua mãe'            => '_____________',
        'sua mae'            => '_____________',
        'vá tomar banho'     => '_____________',
    ];

    // =========================================================================
    // PALAVRAS PROIBIDAS
    // Cada palavra tem seu próprio substituto. Use strings distintas para
    // diferenciar o tipo de restrição (palavrão vs. nome restrito, etc.).
    //
    // Exemplos de substitutos:
    //   '_______' — conteúdo ofensivo genérico
    //   '#######' — nome de pessoa restrito
    //   '@@@@@@@' — outro tipo de restrição
    // =========================================================================
    private const BANNED_WORDS = [
        // --- Palavrões ---
        'merda'    => '_______',
        'porra'    => '_______',
        'caralho'  => '_______',
        'buceta'   => '_______',
        'puta'     => '_______',
        'foda'     => '_______',
        'foder'    => '_______',
        'viado'    => '_______',
        'idiota'   => '_______',
        'imbecil'  => '_______',
        'cretino'  => '_______',
        'cu'       => '_______',
        'cú'       => '_______',

        // --- Nomes restritos (exemplos — ajuste conforme necessário) ---
        'gustavo'  => '#######',
        'fábio'    => '@@@@@@@',
        'fabio'    => '@@@@@@@',
    ];

    // ─────────────────────────────────────────────────────────────────────────
    // API pública
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Sanitiza um texto:
     *   1º — substitui frases proibidas inteiras
     *   2º — substitui palavras proibidas isoladas
     */
    public static function sanitize(string $text): string
    {
        // Passo 1: frases (sem word-boundary — captura em qualquer posição)
        foreach (self::BANNED_PHRASES as $phrase => $replacement) {
            $text = (string) preg_replace(
                '/' . preg_quote($phrase, '/') . '/iu',
                $replacement,
                $text
            );
        }

        // Passo 2: palavras (com word-boundary — somente palavras completas)
        foreach (self::BANNED_WORDS as $word => $replacement) {
            $text = (string) preg_replace(
                '/\b' . preg_quote($word, '/') . '\b/iu',
                $replacement,
                $text
            );
        }

        return $text;
    }

    /**
     * Sanitiza campos específicos de um array de dados.
     * Campos ausentes ou não-string são ignorados.
     *
     * @param array  $data   Array de dados (ex: body da requisição)
     * @param array  $fields Nomes dos campos a sanitizar (ex: ['content', 'name'])
     */
    public static function sanitizeFields(array $data, array $fields): array
    {
        foreach ($fields as $field) {
            if (isset($data[$field]) && is_string($data[$field])) {
                $data[$field] = self::sanitize($data[$field]);
            }
        }

        return $data;
    }
}
