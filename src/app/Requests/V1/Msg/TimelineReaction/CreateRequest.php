<?php

namespace App\Requests\V1\Msg\TimelineReaction;

/**
 * Validação para POST /create (msg_002_timeline_reaction).
 * DDL: timeline_id NOT NULL, user_id NOT NULL, reaction ENUM('like','love','haha','wow','sad','angry')
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'timeline_id' => 'required|is_natural_no_zero',
            'user_id'     => 'required|is_natural_no_zero',
            'reaction'    => 'required|in_list[like,love,haha,wow,sad,angry]',
        ];
    }

    public function messages(): array
    {
        return [
            'timeline_id' => ['required' => 'O timeline_id é obrigatório'],
            'user_id'     => ['required' => 'O user_id é obrigatório'],
            'reaction'    => [
                'required' => 'O tipo de reação é obrigatório',
                'in_list'  => 'Reação inválida. Valores aceitos: like, love, haha, wow, sad, angry',
            ],
        ];
    }
}
