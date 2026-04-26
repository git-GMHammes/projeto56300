<?php

namespace App\Requests\V1\Msg\MessageTimeline;

use App\Libraries\Msg\ContentFilter;

/**
 * Validação para PUT /update/{id} (msg_001_timeline).
 * tenant_id e user_id são imutáveis — apenas content e is_pinned aceitam update.
 *
 * Campos sanitizados pelo ContentFilter: content
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'content'   => 'permit_empty|string',
            'is_pinned' => 'permit_empty|in_list[0,1]',
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
