<?php

namespace App\Requests\V1\Msg\MessageFile;

/**
 * Validação para PUT /update/{id} (msg_003_timeline_file).
 * Arquivos são imutáveis após o upload.
 * Apenas category e mime podem ser corrigidos.
 */
class UpdateRequest
{
    public function rules(): array
    {
        return [
            'category' => 'permit_empty|in_list[image,video,document,audio,other]',
            'mime'     => 'permit_empty|string|max_length[100]',
        ];
    }

    public function messages(): array
    {
        return [
            'category' => ['in_list' => 'Categoria inválida. Valores aceitos: image, video, document, audio, other'],
        ];
    }
}
