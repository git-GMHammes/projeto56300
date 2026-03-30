<?php

/**
 * Class CreateRequest
 *
 * Define as regras e mensagens de validação para criação de usuário.
 * Desacoplada do Controller — segue o princípio da Responsabilidade Única (SRP).
 *
 * @package App\Request\Api\V1\UserManagement
 */

namespace App\Request\Api\V1\UserManagement;

class CreateRequest
{
    /**
     * Regras de validação do CI4 para o endpoint POST /create.
     *
     * @return array<string, string>
     */
    public function rules(): array
    {
        return [
            'user'     => 'required|min_length[3]|max_length[50]|is_unique[user_management.user]',
            'password' => 'required|min_length[8]|max_length[200]',
        ];
    }

    /**
     * Mensagens de erro customizadas por campo e regra.
     *
     * @return array<string, array<string, string>>
     */
    public function messages(): array
    {
        return [
            'user' => [
                'required'   => 'O campo usuário é obrigatório.',
                'min_length' => 'O usuário deve ter no mínimo 3 caracteres.',
                'max_length' => 'O usuário deve ter no máximo 50 caracteres.',
                'is_unique'  => 'Este nome de usuário já está em uso.',
            ],
            'password' => [
                'required'   => 'O campo senha é obrigatório.',
                'min_length' => 'A senha deve ter no mínimo 8 caracteres.',
                'max_length' => 'A senha deve ter no máximo 200 caracteres.',
            ],
        ];
    }
}
