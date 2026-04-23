import FormGrid, { FormGridSchema } from '../../../components/ui/FormGrid/Input'

const schema: FormGridSchema = {
  rows: [
    {
      fields: [
        {
          col: 4,
          label: 'Nome',
          id: 'nome',
          name: 'nome',
          placeholder: 'Digite o Nome',
          required: true,
          noSpecialChars: true,
        },
        {
          type: 'phone',
          col: 4,
          label: 'Telefone',
          id: 'telefone',
          name: 'telefone',
          placeholder: '(00) 00000-0000',
          required: true,
        },
        {
          type: 'cnpj',
          col: 4,
          label: 'CNPJ',
          id: 'cnpj',
          name: 'cnpj',
          required: true,
        }
      ],
    },
    {
      fields: [
        {
          type: 'cpf',
          col: 2,
          label: 'CPF',
          id: 'cpf',
          name: 'cpf',
          required: true,
          autoComplete: 'off',
        },
        { 
          type: 'cep', 
          col: 3, 
          label: 'CEP', 
          id: 'cep', 
          name: 'cep', 
          required: true 
        },
        {
          col: 7,
          label: 'Campo 3',
          id: 'campo6',
          name: 'campo6',
          placeholder: 'Digite o campo 3',
          datalist: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
          noNumbers: true,
        },
      ],
    },
  ],
}

function OlaMundo() {
  return (
    <div className="container mt-4">
      <h1>Olá Mundo</h1>

      <form>
        <FormGrid schema={schema} />
      </form>

    </div>
  )
}

export default OlaMundo
