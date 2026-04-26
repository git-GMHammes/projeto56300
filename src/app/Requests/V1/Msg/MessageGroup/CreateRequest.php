<?php

namespace App\Requests\V1\Msg\MessageGroup;

use App\Libraries\Msg\ContentFilter;

/**
 * Validação para POST /create (msg_006_group_message).
 * DDL: group_id NOT NULL, user_id NOT NULL, content TEXT nullable,
 *      reply_to_id BIGINT nullable (auto-referência)
 *
 * Campos sanitizados pelo ContentFilter: content
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'group_id'    => 'required|is_natural_no_zero',
            'user_id'     => 'required|is_natural_no_zero',
            'content'     => 'permit_empty|string',
            'reply_to_id' => 'permit_empty|is_natural_no_zero',
        ];
    }

    public function messages(): array
    {
        return [
            'group_id' => ['required' => 'O group_id é obrigatório'],
            'user_id'  => ['required' => 'O user_id é obrigatório'],
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
