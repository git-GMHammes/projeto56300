<?php

/**
 * Class UpdateRequest
 *
 * Define as regras e mensagens de validação para atualização de usuário.
 * Suporta exclusão dinâmica do registro atual na verificação de unicidade
 * via o parâmetro $id passado ao método rules().
 *
 * @package App\Request\Api\V1\UserManagement
 */

namespace App\Request\Api\V1\UserManagement;

class UpdateRequest
{
    /**
     * Regras de validação para o endpoint PUT /update/{id}.
     *
     * A regra is_unique exclui o próprio registro do usuário sendo editado,
     * evitando falso positivo de duplicidade no campo user.
     *
     * @param int $id ID do usuário sendo atualizado
     * @return array<string, string>
     */
    public function rules(int $id): array
    {
        return [
            // permit_empty permite atualização parcial (PATCH-like sobre PUT)
            'user'     => "permit_empty|min_length[3]|max_length[50]|is_unique[user_management.user,id,{$id}]",
            'password' => 'permit_empty|min_length[8]|max_length[200]',
        ];
    }

    /**
     * Mensagens de erro customizadas.
     *
     * @return array<string, array<string, string>>
     */
    public function messages(): array
    {
        return [
            'user' => [
                'min_length' => 'O usuário deve ter no mínimo 3 caracteres.',
                'max_length' => 'O usuário deve ter no máximo 50 caracteres.',
                'is_unique'  => 'Este nome de usuário já está em uso por outro registro.',
            ],
            'password' => [
                'min_length' => 'A senha deve ter no mínimo 8 caracteres.',
                'max_length' => 'A senha deve ter no máximo 200 caracteres.',
            ],
        ];
    }
}
