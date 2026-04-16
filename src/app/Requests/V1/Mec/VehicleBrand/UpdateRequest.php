<?php

namespace App\Requests\V1\Mec\VehicleBrand;

/**
 * Regras de validação para PUT /update/{id} (tabela mec_01_vehicle_brand).
 *
 * Todos os campos são opcionais (permit_empty), pois o PUT parcial é aceito.
 * Validação de unicidade (name) é responsabilidade do Processor (Service),
 * pois depende do ID atual para exclusão correta.
 */
class UpdateRequest
{
    /**
     * Regras de validação CI4 para atualização.
     *
     * name → opcional, máx. 100 caracteres (VARCHAR 100 NOT NULL UNIQUE)
     */
    public function rules(): array
    {
        return [
            'name' => 'permit_empty|string|max_length[100]',
        ];
    }

    /**
     * Mensagens de erro customizadas por campo e regra.
     */
    public function messages(): array
    {
        return [
            'name' => [
                'max_length' => 'O nome não pode exceder 100 caracteres',
            ],
        ];
    }
}
