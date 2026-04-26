<?php

namespace App\Requests\V1\Msg\MsgFile;

/**
 * Validação para POST /create (msg_008_file).
 * DDL: source ENUM NOT NULL, source_id NOT NULL, user_id NOT NULL,
 *      original_name VARCHAR(255) NOT NULL, filename VARCHAR(255) NOT NULL,
 *      stored_path VARCHAR(255) NOT NULL UNIQUE, uuid CHAR(36) UNIQUE,
 *      mime VARCHAR(100), size INT, category ENUM, checksum CHAR(64)
 */
class CreateRequest
{
    public function rules(): array
    {
        return [
            'source'        => 'required|in_list[timeline,private,group]',
            'source_id'     => 'required|is_natural_no_zero',
            'user_id'       => 'required|is_natural_no_zero',
            'original_name' => 'required|string|max_length[255]',
            'filename'      => 'required|string|max_length[255]',
            'stored_path'   => 'required|string|max_length[255]',
            'uuid'          => 'permit_empty|string|max_length[36]',
            'mime'          => 'permit_empty|string|max_length[100]',
            'size'          => 'permit_empty|is_natural',
            'category'      => 'permit_empty|in_list[image,video,document,audio,other]',
            'checksum'      => 'permit_empty|string|max_length[64]',
        ];
    }

    public function messages(): array
    {
        return [
            'source'        => ['required' => 'O tipo de origem é obrigatório', 'in_list' => 'Origem inválida. Valores aceitos: timeline, private, group'],
            'source_id'     => ['required' => 'O source_id é obrigatório'],
            'user_id'       => ['required' => 'O user_id é obrigatório'],
            'original_name' => ['required' => 'O nome original do arquivo é obrigatório'],
            'filename'      => ['required' => 'O filename é obrigatório'],
            'stored_path'   => ['required' => 'O stored_path é obrigatório'],
            'category'      => ['in_list'  => 'Categoria inválida. Valores aceitos: image, video, document, audio, other'],
        ];
    }
}
