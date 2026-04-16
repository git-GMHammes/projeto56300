<?php

namespace App\Requests\V1\Mec\VehicleBrand;

/**
 * Regras de validação para POST /create (tabela mec_01_vehicle_brand).
 *
 * Valida o formato e os tipos dos campos conforme o DDL da tabela.
 * Validações de unicidade (name) são responsabilidade
 * do Processor (Service), pois envolvem regra de negócio.
 *
 * DDL de referência:
 *   name  VARCHAR(100) NOT NULL UNIQUE
 */
class CreateRequest
{
    /**
     * Regras de validação CI4.
     *
     * name → obrigatório, máx. 100 caracteres (VARCHAR 100 NOT NULL UNIQUE)
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max_length[100]',
        ];
    }

    /**
     * Mensagens de erro customizadas por campo e regra.
     */
    public function messages(): array
    {
        return [
            'name' => [
                'required'   => 'O campo name é obrigatório',
                'max_length' => 'O nome não pode exceder 100 caracteres',
            ],
        ];
    }
}
