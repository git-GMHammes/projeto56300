<?php

namespace App\Requests\V1\Msg\MessageGroupRead;

/**
 * Validação para PUT /update/{id} e PATCH /mark-read (msg_007_group_read).
 * group_id e user_id são imutáveis.
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'last_read_id' => 'permit_empty|is_natural_no_zero',
        ];
    }

    public function messages(): array
    {
        return [];
    }
}
