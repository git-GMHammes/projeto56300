<?php

namespace App\Requests\V1\Msg\MessageGroupMember;

/**
 * Validação para POST /create (msg_005_group_member).
 * DDL: group_id NOT NULL, user_id NOT NULL, role ENUM('admin','member') DEFAULT 'member',
 *      joined_at DATETIME nullable, left_at DATETIME nullable
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'group_id'  => 'required|is_natural_no_zero',
            'user_id'   => 'required|is_natural_no_zero',
            'role'      => 'permit_empty|in_list[admin,member]',
            'joined_at' => 'permit_empty|valid_date[Y-m-d H:i:s]',
        ];
    }

    public function messages(): array
    {
        return [
            'group_id' => ['required' => 'O group_id é obrigatório'],
            'user_id'  => ['required' => 'O user_id é obrigatório'],
            'role'     => ['in_list'  => 'Role inválido. Valores aceitos: admin, member'],
        ];
    }
}
