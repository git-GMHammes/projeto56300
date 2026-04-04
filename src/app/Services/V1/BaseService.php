<?php

namespace App\Services\V1;

/**
 * Service base para a API V1.
 *
 * Fornece utilitários de sanitização, formatação e normalização de dados
 * compartilhados por todos os Services da V1.
 * Nenhuma regra de negócio específica de módulo deve existir aqui.
 */
abstract class BaseService
{
    // -------------------------------------------------------------------------
    // Sanitização
    // -------------------------------------------------------------------------

    /**
     * Campos que possuem máscara e devem ser armazenados/consultados apenas com dígitos.
     * Cobre tanto a tabela (cpf, whatsapp, phone, zip_code)
     * quanto a view com prefixo uc_ (uc_cpf, uc_whatsapp, uc_phone, uc_zip_code).
     */
    private const MASKED_FIELDS = [
        'cpf', 'whatsapp', 'phone', 'zip_code',
        'uc_cpf', 'uc_whatsapp', 'uc_phone', 'uc_zip_code',
    ];

    /**
     * Remove tags HTML e espaços em branco extras de uma string.
     */
    protected function sanitizeString(string $value): string
    {
        return trim(strip_tags($value));
    }

    /**
     * Sanitiza um array de dados:
     *  - Remove tags e espaços extras em strings
     *  - Remove chaves cujo valor seja null ou string vazia
     *
     * @param array $data Dados brutos recebidos da requisição
     * @return array Dados limpos, prontos para persistência
     */
    protected function sanitizeData(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            $sanitized[$key] = \is_string($value) ? $this->sanitizeString($value) : $value;
        }

        return $sanitized;
    }

    /**
     * Remove máscaras (parênteses, traços, pontos, espaços) dos campos definidos
     * em MASKED_FIELDS, mantendo apenas dígitos.
     *
     * Funciona para valores escalares (create/update/find) e para arrays de valores
     * (get-grouped). Deve ser chamado APÓS sanitizeData em operações de escrita,
     * e diretamente nos filtros de leitura antes de montar a query.
     *
     * @param array $data Mapa [campo => valor_escalar] ou [campo => array_de_valores]
     * @return array Dados com máscaras removidas nos campos pertinentes
     */
    protected function removeMasks(array $data): array
    {
        foreach (self::MASKED_FIELDS as $field) {
            if (!isset($data[$field])) {
                continue;
            }

            if (\is_array($data[$field])) {
                // Filtros multivalorados (get-grouped): remove máscara de cada elemento
                $data[$field] = array_map(
                    static fn($v) => \is_string($v) ? preg_replace('/\D/', '', $v) : $v,
                    $data[$field]
                );
            } elseif (\is_string($data[$field])) {
                $data[$field] = preg_replace('/\D/', '', $data[$field]);
            }
        }

        return $data;
    }

    // -------------------------------------------------------------------------
    // Formatação
    // -------------------------------------------------------------------------

    /**
     * Formata uma data para o padrão Y-m-d.
     * Retorna null se o valor estiver vazio ou for inválido.
     */
    protected function formatDate(?string $date): ?string
    {
        if (empty($date)) {
            return null;
        }

        $timestamp = strtotime($date);

        return $timestamp !== false ? date('Y-m-d', $timestamp) : null;
    }

    /**
     * Formata uma data/hora para o padrão Y-m-d H:i:s (MySQL DATETIME).
     * Aceita qualquer formato parseável por strtotime (incluindo datetime-local: Y-m-d\TH:i).
     * Retorna null se o valor estiver vazio ou for inválido.
     */
    protected function formatDatetime(?string $datetime): ?string
    {
        if (empty($datetime)) {
            return null;
        }

        $timestamp = strtotime($datetime);

        return $timestamp !== false ? date('Y-m-d H:i:s', $timestamp) : null;
    }

    // -------------------------------------------------------------------------
    // Normalização de parâmetros
    // -------------------------------------------------------------------------

    /**
     * Extrai e normaliza parâmetros de paginação recebidos via query string.
     *
     * @param array $params Array associativo com page, limit, sort, order
     * @return array Parâmetros normalizados e com limites seguros
     */
    protected function buildPaginationParams(array $params): array
    {
        return [
            'page' => max(1, (int) ($params['page'] ?? 1)),
            'limit' => min(100, max(1, (int) ($params['limit'] ?? 20))),
            'sort' => trim((string) ($params['sort'] ?? 'id')),
            'order' => trim((string) ($params['order'] ?? 'desc')),
        ];
    }
}
