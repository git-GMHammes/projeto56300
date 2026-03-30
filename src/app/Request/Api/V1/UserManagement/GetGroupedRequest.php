<?php

/**
 * Class GetGroupedRequest
 *
 * Define as regras e mensagens de validação para a busca agrupada paginada.
 * Endpoint GET /get-grouped — agrupa usuários por data de criação.
 *
 * @package App\Request\Api\V1\UserManagement
 */

namespace App\Request\Api\V1\UserManagement;

class GetGroupedRequest
{
    /**
     * Regras de validação para os parâmetros de query string do endpoint GET /get-grouped.
     *
     * @return array<string, string>
     */
    public function rules(): array
    {
        return [
            'page'  => 'permit_empty|integer|greater_than[0]',
            'limit' => 'permit_empty|integer|greater_than[0]|less_than_equal_to[100]',
            'sort'  => 'permit_empty|alpha_dash|max_length[50]',
            'order' => 'permit_empty|in_list[asc,desc,ASC,DESC]',
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
        ];
    }
}
