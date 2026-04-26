<?php

namespace App\Requests\V1\Msg\MessagePrivate;

use App\Libraries\Msg\ContentFilter;

/**
 * Validação para POST /create (msg_003_private).
 * DDL: tenant_id NOT NULL, sender_id NOT NULL, receiver_id NOT NULL,
 *      content TEXT (nullable), read_at DATETIME (nullable)
 *
 * Campos sanitizados pelo ContentFilter: content
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'tenant_id'   => 'required|is_natural_no_zero',
            'sender_id'   => 'required|is_natural_no_zero',
            'receiver_id' => 'required|is_natural_no_zero',
            'content'     => 'permit_empty|string',
            'read_at'     => 'permit_empty|valid_date[Y-m-d H:i:s]',
        ];
    }

    public function messages(): array
    {
        return [
            'tenant_id'   => ['required' => 'O tenant_id é obrigatório'],
            'sender_id'   => ['required' => 'O sender_id é obrigatório'],
            'receiver_id' => ['required' => 'O receiver_id é obrigatório'],
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
