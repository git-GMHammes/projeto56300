<?php

namespace App\Requests\V1\AuthUser;

/**
 * Regras de validação para POST /api/v1/auth/recover-password.
 *
 * Valida o corpo JSON da requisição de recuperação de senha.
 * Apenas uc_mail é aceito — nenhuma lógica de negócio aqui.
 */
class RecoverPasswordRequest
{
    /**
     * Regras de validação CI4.
     */
    public function rules(): array
    {
        return [
            'uc_mail' => 'required|string|min_length[1]|valid_email',
        ];
    }

    /**
     * Mensagens de erro customizadas por campo e regra.
     */
    public function messages(): array
    {
        return [
            'uc_mail' => [
                'required'    => 'O campo e-mail é obrigatório',
                'string'      => 'O campo e-mail deve ser uma string',
                'min_length'  => 'O campo e-mail não pode estar vazio',
                'valid_email' => 'O campo e-mail deve conter um endereço válido',
            ],
        ];
    }
}
