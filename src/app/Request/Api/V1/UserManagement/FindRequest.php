<?php

/**
 * Class FindRequest
 *
 * Define as regras e mensagens de validação para busca paginada com filtros.
 * Valida os parâmetros de query string e os filtros do corpo da requisição
 * do endpoint POST /find.
 *
 * @package App\Request\Api\V1\UserManagement
 */

namespace App\Request\Api\V1\UserManagement;

class FindRequest
{
    /**
     * Regras de validação para o endpoint POST /find.
     * Parâmetros de paginação vêm da query string; filtros vêm do body.
     *
     * @return array<string, string>
     */
    public function rules(): array
    {
        return [
            // Paginação (query string)
            'page'  => 'permit_empty|integer|greater_than[0]',
            'limit' => 'permit_empty|integer|greater_than[0]|less_than_equal_to[100]',
            'sort'  => 'permit_empty|alpha_dash|max_length[50]',
            'order' => 'permit_empty|in_list[asc,desc,ASC,DESC]',
            // Filtros (body)
            'user'  => 'permit_empty|max_length[50]',
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
            'page' => [
                'integer'      => 'O campo page deve ser um número inteiro.',
                'greater_than' => 'O campo page deve ser maior que zero.',
            ],
            'limit' => [
                'integer'            => 'O campo limit deve ser um número inteiro.',
                'greater_than'       => 'O campo limit deve ser maior que zero.',
                'less_than_equal_to' => 'O campo limit deve ser no máximo 100.',
            ],
            'sort' => [
                'alpha_dash' => 'O campo sort deve conter apenas letras, números, hífens ou underscores.',
                'max_length' => 'O campo sort deve ter no máximo 50 caracteres.',
            ],
            'order' => [
                'in_list' => 'O campo order deve ser "asc" ou "desc".',
            ],
            'user' => [
                'max_length' => 'O filtro de usuário deve ter no máximo 50 caracteres.',
            ],
        ];
    }
}
