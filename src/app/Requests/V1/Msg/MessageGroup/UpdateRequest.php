<?php

namespace App\Requests\V1\Msg\MessageGroup;

use App\Libraries\Msg\ContentFilter;

/**
 * Validação para PUT /update/{id} (msg_006_group_message).
 * group_id, user_id e reply_to_id são imutáveis.
 * Apenas o conteúdo da mensagem pode ser editado.
 *
 * Campos sanitizados pelo ContentFilter: content
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'content' => 'permit_empty|string',
        ];
    }

    public function messages(): array
    {
        return [];
    }

    /** Campos de texto sujeitos ao filtro de conteúdo. */
    public function textFields(): array
    {
        return ['content'];
    }

    /** Retorna $data com os campos de texto sanitizados. */
    public function sanitize(array $data): array
    {
        return ContentFilter::sanitizeFields($data, $this->textFields());
    }
}
