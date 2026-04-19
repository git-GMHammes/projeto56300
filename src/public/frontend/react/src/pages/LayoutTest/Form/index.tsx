import FormGrid, { FormGridSchema } from '../../../components/ui/FormGrid/Input'

const schema: FormGridSchema = {
  rows: [
    // ── Dados Pessoais ──────────────────────────────────────────────────────
    {
      fields: [
        {
          col: 5,
          label: 'Nome Completo',
          id: 'nome',
          name: 'nome',
          placeholder: 'Digite o nome completo',
          required: true,
          noSpecialChars: true,
          noNumbers: true,
        },
        {
          type: 'cpf',
          col: 3,
          label: 'CPF',
          id: 'cpf',
          name: 'cpf',
          required: true,
          autoComplete: 'off',
        },
        {
          type: 'data',
          col: 2,
          label: 'Data de Nascimento',
          id: 'data_nascimento',
          name: 'data_nascimento',
          required: true,
        },
        {
          type: 'hora',
          col: 2,
          label: 'Horário',
          id: 'horario',
          name: 'horario',
        },
      ],
    },

    // ── Contato e Endereço ──────────────────────────────────────────────────
    {
      fields: [
        {
          type: 'phone',
          col: 3,
          label: 'Telefone',
          id: 'telefone',
          name: 'telefone',
          placeholder: '(00) 00000-0000',
          required: true,
        },
        {
          type: 'cep',
          col: 3,
          label: 'CEP',
          id: 'cep',
          name: 'cep',
          required: true,
        },
        {
          col: 6,
          label: 'Logradouro',
          id: 'logradouro',
          name: 'logradouro',
          placeholder: 'Rua, Avenida, etc.',
          noSpecialChars: false,
        },
      ],
    },

    // ── Dados Financeiros ───────────────────────────────────────────────────
    {
      fields: [
        {
          type: 'cnpj',
          col: 4,
          label: 'CNPJ',
          id: 'cnpj',
          name: 'cnpj',
          required: true,
        },
        {
          type: 'moeda',
          col: 4,
          label: 'Salário',
          id: 'salario',
          name: 'salario',
          placeholder: 'R$ 0,00',
          required: true,
        },
        {
          type: 'pis',
          col: 4,
          label: 'PIS / PASEP',
          id: 'pis',
          name: 'pis',
          required: true,
        },
      ],
    },

    // ── Documentos ──────────────────────────────────────────────────────────
    {
      fields: [
        {
          type: 'cnh',
          col: 3,
          label: 'CNH',
          id: 'cnh',
          name: 'cnh',
          required: true,
        },
        {
          type: 'titulo',
          col: 4,
          label: 'Título de Eleitor',
          id: 'titulo',
          name: 'titulo',
        },
        {
          type: 'processo',
          col: 5,
          label: 'Número do Processo',
          id: 'processo',
          name: 'processo',
        },
      ],
    },

    // ── Veículo ─────────────────────────────────────────────────────────────
    {
      fields: [
        {
          type: 'placa',
          col: 3,
          label: 'Placa do Veículo',
          id: 'placa',
          name: 'placa',
          required: true,
        },
        {
          type: 'renavam',
          col: 3,
          label: 'RENAVAM',
          id: 'renavam',
          name: 'renavam',
          required: true,
        },
        {
          col: 6,
          label: 'Modelo do Veículo',
          id: 'modelo_veiculo',
          name: 'modelo_veiculo',
          placeholder: 'Ex: Fiat Uno, VW Gol...',
          datalist: ['Fiat Uno', 'VW Gol', 'Honda Civic', 'Toyota Corolla', 'Chevrolet Onix'],
          noSpecialChars: true,
        },
      ],
    },
  ],
}

function LayoutTestForm() {
  return (
    <div className="container mt-4">
      <h1 className="mb-1">Layout Test</h1>
      <p className="text-muted mb-4">
        Demonstração de todos os campos disponíveis no componente <code>FormGrid</code>.
      </p>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Formulário Completo</h5>
        </div>
        <div className="card-body">
          <form>
            <h6 className="text-muted mb-3 border-bottom pb-1">Dados Pessoais</h6>
            <FormGrid schema={{ rows: [schema.rows[0]] }} />

            <h6 className="text-muted mt-4 mb-3 border-bottom pb-1">Contato e Endereço</h6>
            <FormGrid schema={{ rows: [schema.rows[1]] }} />

            <h6 className="text-muted mt-4 mb-3 border-bottom pb-1">Dados Financeiros</h6>
            <FormGrid schema={{ rows: [schema.rows[2]] }} />

            <h6 className="text-muted mt-4 mb-3 border-bottom pb-1">Documentos</h6>
            <FormGrid schema={{ rows: [schema.rows[3]] }} />

            <h6 className="text-muted mt-4 mb-3 border-bottom pb-1">Veículo</h6>
            <FormGrid schema={{ rows: [schema.rows[4]] }} />

            <div className="mt-4 d-flex gap-2">
              <button type="submit" className="btn btn-primary">Salvar</button>
              <button type="reset" className="btn btn-secondary">Limpar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LayoutTestForm
