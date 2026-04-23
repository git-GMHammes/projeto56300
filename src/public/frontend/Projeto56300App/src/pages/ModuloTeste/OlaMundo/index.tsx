import FormGrid, { FormGridSchema } from '../../../components/ui/FormGrid/Input'

const schema: FormGridSchema = {
  rows: [
    {
      fields: [
        {
          col: 4,
          label: 'Campo 1',
          id: 'campo1',
          name: 'campo1',
          placeholder: 'Digite o campo 1',
          required: true,
          noSpecialChars: true,
        },
        {
          col: 4,
          label: 'Campo 2',
          id: 'campo2',
          name: 'campo2',
          value: 'Valor fixo',
          minLength: 5,
          noLetters: true,
        },
        {
          col: 4,
          label: 'Campo 3',
          id: 'campo3',
          name: 'campo3',
          placeholder: 'Digite o campo 3',
          datalist: ['Opção 1', 'Opção 2', 'Opção 3', 'Opção 4'],
          readOnly: true,
          noNumbers: true,
        },
      ],
    },
    {
      fields: [
        {
          col: 2,
          label: 'Campo 1',
          id: 'campo4',
          name: 'campo4',
          placeholder: 'Digite o campo 1'
        },
        {
          col: 2,
          label: 'Campo 2',
          id: 'campo5',
          name: 'campo5',
          value: 'Valor fixo',
          readOnly: true,
        },
        {
          col: 8,
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
