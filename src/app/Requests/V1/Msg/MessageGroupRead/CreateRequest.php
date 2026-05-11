<?php

namespace App\Requests\V1\Msg\MessageGroupRead;

/**
 * Validação para POST /create (msg_007_group_read).
 * DDL: group_id NOT NULL, user_id NOT NULL, last_read_id BIGINT nullable
 * Constraint UNIQUE (group_id, user_id) — usar markRead() para upsert.
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'group_id'     => 'required|is_natural_no_zero',
            'user_management_id'      => 'required|is_natural_no_zero',
            'last_read_id' => 'permit_empty|is_natural_no_zero',
        ];
    }

    public function messages(): array
    {
        return [
            'group_id' => ['required' => 'O group_id é obrigatório'],
            'user_management_id'  => ['required' => 'O user_management_id é obrigatório'],
        ];
    }
}
