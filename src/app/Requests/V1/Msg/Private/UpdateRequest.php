<?php

namespace App\Requests\V1\Msg\Private;

use App\Libraries\Msg\ContentFilter;

/**
 * Validação para PUT /update/{id} (msg_003_private).
 * tenant_id, sender_id e receiver_id são imutáveis.
 * Apenas content e read_at aceitam atualização.
 *
 * Campos sanitizados pelo ContentFilter: content
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'content' => 'permit_empty|string',
            'read_at' => 'permit_empty|valid_date[Y-m-d H:i:s]',
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
