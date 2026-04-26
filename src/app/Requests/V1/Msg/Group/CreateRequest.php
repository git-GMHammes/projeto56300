<?php

namespace App\Requests\V1\Msg\Group;

use App\Libraries\Msg\ContentFilter;

/**
 * Validação para POST /create (msg_004_group).
 * DDL: tenant_id NOT NULL, name VARCHAR(150) NOT NULL, created_by NOT NULL,
 *      description VARCHAR(500) nullable, avatar VARCHAR(200) nullable
 *
 * Campos sanitizados pelo ContentFilter: name, description
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'tenant_id'   => 'required|is_natural_no_zero',
            'name'        => 'required|string|max_length[150]',
            'created_by'  => 'required|is_natural_no_zero',
            'description' => 'permit_empty|string|max_length[500]',
            'avatar'      => 'permit_empty|string|max_length[200]',
        ];
    }

    public function messages(): array
    {
        return [
            'tenant_id'  => ['required' => 'O tenant_id é obrigatório'],
            'name'       => ['required' => 'O nome do grupo é obrigatório', 'max_length' => 'O nome não pode exceder 150 caracteres'],
            'created_by' => ['required' => 'O criador do grupo é obrigatório'],
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
