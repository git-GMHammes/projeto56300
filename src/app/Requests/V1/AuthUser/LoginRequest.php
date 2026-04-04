<?php

namespace App\Requests\V1\AuthUser;

/**
 * Regras de validação para POST /api/v1/auth/login.
 *
 * Valida o corpo JSON da requisição de autenticação.
 * Apenas user e password são aceitos — nenhuma lógica de negócio aqui.
 */
class LoginRequest
{
    /**
     * Regras de validação CI4.
     *
     * Ambos os campos são obrigatórios e devem ser strings não vazias.
     */
    public function rules(): array
    {
        return [
            'um_user'     => 'required|string|min_length[1]',
            'um_password' => 'required|string|min_length[1]',
        ];
    }

    /**
     * Mensagens de erro customizadas por campo e regra.
     */
    public function messages(): array
    {
        return [
            'um_user' => [
                'required'   => 'O campo user é obrigatório',
                'string'     => 'O campo user deve ser uma string',
                'min_length' => 'O campo user não pode estar vazio',
            ],
            'um_password' => [
                'required'   => 'O campo password é obrigatório',
                'string'     => 'O campo password deve ser uma string',
                'min_length' => 'O campo password não pode estar vazio',
            ],
        ];
    }
}
