<?php

namespace App\Requests\V1\Msg\MessageTimeline;

use App\Libraries\Msg\ContentFilter;

/**
 * Validação para POST /create (msg_001_timeline).
 * DDL: tenant_id NOT NULL, user_id NOT NULL, content TEXT NOT NULL, is_pinned TINYINT DEFAULT 0
 *
 * Campos sanitizados pelo ContentFilter: content
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'tenant_id' => 'required|is_natural_no_zero',
            'user_id'   => 'required|is_natural_no_zero',
            'content'   => 'required|string',
            'is_pinned' => 'permit_empty|in_list[0,1]',
        ];
    }

    public function messages(): array
    {
        return [
            'tenant_id' => ['required' => 'O tenant_id é obrigatório'],
            'user_id'   => ['required' => 'O user_id é obrigatório'],
            'content'   => ['required' => 'O conteúdo do post é obrigatório'],
        ];
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
