<?php

namespace App\Requests\V1\Msg\Group;

use App\Libraries\Msg\ContentFilter;

/**
 * Validação para PUT /update/{id} (msg_004_group).
 * tenant_id e created_by são imutáveis.
 * name, description e avatar aceitam atualização.
 *
 * Campos sanitizados pelo ContentFilter: name, description
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'name'        => 'permit_empty|string|max_length[150]',
            'description' => 'permit_empty|string|max_length[500]',
            'avatar'      => 'permit_empty|string|max_length[200]',
        ];
    }

    public function messages(): array
    {
        return [
            'name' => ['max_length' => 'O nome não pode exceder 150 caracteres'],
        ];
    }

    /** Campos de texto sujeitos ao filtro de conteúdo. */
    public function textFields(): array
    {
        return ['name', 'description'];
    }

    /** Retorna $data com os campos de texto sanitizados. */
    public function sanitize(array $data): array
    {
        return ContentFilter::sanitizeFields($data, $this->textFields());
    }
}
