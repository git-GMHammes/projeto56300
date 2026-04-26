<?php

namespace App\Requests\V1\Msg\MessageGroupMember;

/**
 * Validação para PUT /update/{id} (msg_005_group_member).
 * group_id e user_id são imutáveis.
 * role, joined_at e left_at aceitam atualização.
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'role'      => 'permit_empty|in_list[admin,member]',
            'joined_at' => 'permit_empty|valid_date[Y-m-d H:i:s]',
            'left_at'   => 'permit_empty|valid_date[Y-m-d H:i:s]',
        ];
    }

    public function messages(): array
    {
        return [
            'role' => ['in_list' => 'Role inválido. Valores aceitos: admin, member'],
        ];
    }
}
