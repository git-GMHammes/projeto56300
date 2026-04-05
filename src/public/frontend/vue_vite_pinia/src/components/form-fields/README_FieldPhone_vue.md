# FieldPhone.vue — Fábrica de Campos Celular / Telefone

Componente Vue 3 + Bootstrap 5 que substitui o `filed_celular_telefone.js`.
Aplica máscara dinâmica brasileira e valida o DDD contra a lista oficial da ANATEL.

---

## 1) Props disponíveis

### Visual

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `label` | `String` | `'Celular / Telefone'` | Texto do rótulo acima do campo |
| `label-class` | `String` | `'form-label fw-semibold'` | Classes CSS do `<label>` |
| `wrapper-class` | `String` | `'mb-3'` | Classes CSS do `<div>` container |
| `input-class` | `String` | `'form-control'` | Classes CSS do `<input>` |
| `placeholder` | `String` | `'(XX) XXXXX-XXXX'` | Texto placeholder do input |

### HTML nativo

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `model-value` | `String` | `''` | Valor vinculado via `v-model` |
| `id` | `String` | **obrigatório** | Atributo `id` do input (também vincula o `<label>`) |
| `name` | `String` | **obrigatório** | Atributo `name` do input (necessário no submit do form) |

### Controle de acesso

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `readonly` | `Boolean` | `false` | Campo somente leitura — exibido, não editável, enviado no submit |
| `disabled` | `Boolean` | `false` | Campo desabilitado — bloqueado visualmente, **não enviado** no submit |
| `required` | `Boolean` | `false` | Campo obrigatório — adiciona `*` no label e valida se vazio |

### Comportamento

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `validate-on-mount` | `Boolean` | `false` | Exibe erros imediatamente ao renderizar, sem aguardar interação |

---

## 2) Eventos emitidos

| Evento | Payload | Quando |
|--------|---------|--------|
| `update:modelValue` | `String` — **somente dígitos** | A cada digitação — atualiza o v-model do pai |
| `validation` | `{ id, valid, errors[] }` | A cada digitação — permite o form pai controlar o estado global |

> **Importante:** o `v-model` devolve apenas os dígitos numéricos (ex: `51999998888`),
> sem a máscara. Ideal para enviar ao backend ou banco de dados.
> A máscara `(51) 99999-8888` existe somente na exibição do input.

---

## 3) Máscara dinâmica

| Dígitos digitados | Formato aplicado | Tipo |
|-------------------|-----------------|------|
| 10 dígitos | `(XX) XXXX-XXXX` | Telefone fixo |
| 11 dígitos | `(XX) XXXXX-XXXX` | Celular |

A máscara é aplicada em tempo real a cada tecla digitada.

---

## 4) Validação de DDD — ANATEL

O componente valida o DDD contra a lista oficial da Agência Nacional de Telecomunicações.

| Região | DDDs válidos |
|--------|-------------|
| São Paulo | 11, 12, 13, 14, 15, 16, 17, 18, 19 |
| Rio de Janeiro | 21, 22, 24 |
| Espírito Santo | 27, 28 |
| Minas Gerais | 31, 32, 33, 34, 35, 37, 38 |
| Paraná | 41, 42, 43, 44, 45, 46 |
| Santa Catarina | 47, 48, 49 |
| Rio Grande do Sul | 51, 53, 54, 55 |
| DF / GO / TO | 61, 62, 63, 64 |
| MT / MS / AC / RO | 65, 66, 67, 68, 69 |
| Bahia | 71, 73, 74, 75, 77 |
| Sergipe | 79 |
| Pernambuco | 81, 87 |
| AL / PB / RN | 82, 83, 84 |
| CE / PI | 85, 86, 88, 89 |
| PA / AM / RR / AP / MA | 91–99 |

---

## 5) Exemplos de uso

### Exemplo 1 — Campo simples obrigatório

```vue
<FieldPhone
  v-model="form.telefone"
  id="telefone"
  name="telefone"
  :required="true"
/>
```

---

### Exemplo 2 — Label customizado

```vue
<FieldPhone
  v-model="form.celular"
  id="celular"
  name="celular"
  label="Celular para contato"
  placeholder="(51) 99999-9999"
  :required="true"
/>
```

---

### Exemplo 3 — Somente leitura (exibição de dado cadastrado)

```vue
<FieldPhone
  v-model="form.telefoneCadastrado"
  id="tel_cadastrado"
  name="tel_cadastrado"
  label="Telefone cadastrado"
  :readonly="true"
/>
```

---

### Exemplo 4 — Desabilitado

```vue
<FieldPhone
  v-model="form.telAntigo"
  id="tel_antigo"
  name="tel_antigo"
  label="Telefone anterior"
  :disabled="true"
/>
```

---

### Exemplo 5 — Valida ao renderizar (campo pré-preenchido inválido)

```vue
<FieldPhone
  v-model="form.telImportado"
  id="tel_importado"
  name="tel_importado"
  label="Telefone importado"
  :validate-on-mount="true"
/>
```

---

### Exemplo 6 — Capturando estado de validação no form pai

```vue
<script setup>
import { reactive, computed } from 'vue'
import { FieldPhone } from '@/components/form-fields'

const form   = reactive({ celular: '', fixo: '' })
const status = reactive({})

function onValidation({ id, valid, errors }) {
  status[id] = { valid, errors }
}

const formValido = computed(() =>
  Object.values(status).length > 0 &&
  Object.values(status).every(f => f.valid)
)
</script>

<template>
  <form @submit.prevent>
    <FieldPhone
      v-model="form.celular"
      id="celular"
      name="celular"
      label="Celular"
      :required="true"
      @validation="onValidation"
    />
    <FieldPhone
      v-model="form.fixo"
      id="fixo"
      name="fixo"
      label="Telefone fixo"
      @validation="onValidation"
    />
    <button type="submit" :disabled="!formValido" class="btn btn-primary">
      Enviar
    </button>
  </form>
</template>
```

---

### Exemplo 7 — Dentro da Row Factory (JSON)

```js
import { FieldPhone } from '@/components/form-fields'

const grid = [
  {
    line: '1',
    wrapper_class: 'bg-light border rounded p-3 mb-3',
    row_classes: 'row g-3',
    total_cols: 12,
    columns: [
      {
        'col-md': 6,
        content: {
          component: FieldPhone,
          props: {
            id: 'celular', name: 'celular',
            label: 'Celular',
            modelValue: form.celular,
            required: true,
          },
        },
      },
      {
        'col-md': 6,
        content: {
          component: FieldPhone,
          props: {
            id: 'fixo', name: 'fixo',
            label: 'Telefone fixo',
            modelValue: form.fixo,
          },
        },
      },
    ],
  },
]
```

```vue
<RowLayout :grid="grid" />
```

---

## 6) Estrutura HTML gerada

```html
<div class="mb-3">
  <label for="celular" class="form-label fw-semibold">
    Celular / Telefone <span class="text-danger ms-1">*</span>
  </label>
  <input
    id="celular"
    name="celular"
    type="tel"
    maxlength="15"
    class="form-control is-invalid"
    placeholder="(XX) XXXXX-XXXX"
    required
  />
  <div class="invalid-feedback d-block" style="font-size: 0.72rem; font-style: italic;">
    <span class="d-block">Campo "Celular / Telefone" é obrigatório.</span>
  </div>
</div>
```

---

## 7) Comportamento de validação

- Validação ativada no evento `blur` (saída do campo) ou `input` (digitação)
- `is-invalid` (borda vermelha) + mensagem abaixo quando há erros
- `is-valid` (borda verde) quando o número está completo e o DDD é válido

### Ordem de prioridade das regras

1. `required` com campo vazio → erro imediato
2. Número com menos de 10 dígitos → "Número incompleto"
3. DDD inválido segundo ANATEL → "DDD XX não é válido"

---

## 8) Mapeamento JS → Vue

| `filed_celular_telefone.js` | `FieldPhone.vue` (prop) |
|-----------------------------|-------------------------|
| `data-label="Celular"` | `label="Celular"` |
| `data-ReadOnly="true"` | `:readonly="true"` |
| `data-Disabled="true"` | `:disabled="true"` |
| `data-Required="true"` | `:required="true"` |
| `data-value="51999998888"` | `v-model="ref"` |
| `attachCelularTelefoneValidation()` | Reativo via `computed` + `watch` |
| `formatCelularTelefone()` | `formatPhone()` — mesma lógica |
| `DDDS_VALIDOS` array | `DDDS_VALIDOS` Set (busca O(1)) |

---

## 9) Dependências

- **Vue 3** — `ref`, `computed`, `watch` (Composition API)
- **Bootstrap 5.3+** — classes `form-control`, `is-invalid`, `is-valid`, `invalid-feedback`, `form-label`
