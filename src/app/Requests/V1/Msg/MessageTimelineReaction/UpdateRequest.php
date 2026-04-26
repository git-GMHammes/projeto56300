<?php

namespace App\Requests\V1\Msg\MessageTimelineReaction;

/**
 * Validação para PUT /update/{id} (msg_002_timeline_reaction).
 * timeline_id e user_id são imutáveis — apenas reaction pode ser alterado.
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'reaction' => 'permit_empty|in_list[like,love,haha,wow,sad,angry]',
        ];
    }

    public function messages(): array
    {
        return [
            'reaction' => ['in_list' => 'Reação inválida. Valores aceitos: like, love, haha, wow, sad, angry'],
        ];
    }
}
