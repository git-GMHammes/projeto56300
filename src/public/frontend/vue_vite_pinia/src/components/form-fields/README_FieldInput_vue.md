# FieldInput.vue — Fábrica de Campos `<input>`

Componente Vue 3 + Bootstrap 5 que substitui o `filed_input.js`.
Gera campos `<input>` com label, validação reativa de caracteres, controle de acesso e suporte a datalist.

---

## 1) Props disponíveis

### Visual

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `label` | `String` | `''` | Texto do rótulo acima do campo |
| `label-class` | `String` | `'form-label fw-semibold'` | Classes CSS do `<label>` |
| `wrapper-class` | `String` | `'mb-3'` | Classes CSS do `<div>` container |
| `input-class` | `String` | `'form-control'` | Classes CSS do `<input>` |
| `placeholder` | `String` | `''` | Texto placeholder do input |

### HTML nativo

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `model-value` | `String` | `''` | Valor vinculado via `v-model` |
| `type` | `String` | `'text'` | Tipo do input: `text`, `hidden`, `email`, `password`, `number`, `search`, `tel`, `url` |
| `id` | `String` | **obrigatório** | Atributo `id` do input (também vincula o `<label>`) |
| `name` | `String` | **obrigatório** | Atributo `name` do input (necessário no submit do form) |

### Validação de caracteres

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `allow-special` | `Boolean` | `true` | Permite caracteres especiais (`@`, `#`, `!`, etc.) |
| `allow-numbers` | `Boolean` | `true` | Permite dígitos numéricos (`0–9`) |
| `allow-letters` | `Boolean` | `true` | Permite letras (incluindo acentuadas) |

### Controle de acesso

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `readonly` | `Boolean` | `false` | Campo somente leitura — exibido, não editável, enviado no submit |
| `disabled` | `Boolean` | `false` | Campo desabilitado — bloqueado visualmente, **não enviado** no submit |
| `required` | `Boolean` | `false` | Campo obrigatório — adiciona `*` no label e valida se vazio |

### Comportamento

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `options` | `Array` | `[]` | Array de strings para gerar `<datalist>` (sugestões de digitação) |
| `validate-on-mount` | `Boolean` | `false` | Exibe erros de validação imediatamente ao renderizar, sem aguardar interação |

---

## 2) Eventos emitidos

| Evento | Payload | Quando |
|--------|---------|--------|
| `update:modelValue` | `String` | A cada digitação — atualiza o v-model do pai |
| `validation` | `{ id, valid, errors[] }` | A cada digitação — permite o form pai controlar o estado global |

---

## 3) Exemplos de uso

### Exemplo 1 — Campo simples obrigatório

```vue
<FieldInput
  v-model="form.nome"
  id="nome"
  name="nome"
  label="Nome Completo"
  placeholder="Digite seu nome"
  :required="true"
/>
```

---

### Exemplo 2 — Campo que não aceita números

```vue
<FieldInput
  v-model="form.nomeClean"
  id="nome_clean"
  name="nome_clean"
  label="Nome (sem números)"
  :allow-numbers="false"
/>
```

---

### Exemplo 3 — Campo que aceita apenas números

```vue
<FieldInput
  v-model="form.codigo"
  id="codigo"
  name="codigo"
  label="Código Numérico"
  :allow-letters="false"
  :allow-special="false"
/>
```

---

### Exemplo 4 — Campo alfabético puro (sem números e sem especiais)

```vue
<FieldInput
  v-model="form.iniciais"
  id="iniciais"
  name="iniciais"
  label="Iniciais (somente letras)"
  :allow-numbers="false"
  :allow-special="false"
/>
```

---

### Exemplo 5 — Sem caracteres especiais

```vue
<FieldInput
  v-model="form.username"
  id="username"
  name="username"
  label="Username"
  :allow-special="false"
/>
```

---

### Exemplo 6 — Somente leitura

```vue
<FieldInput
  v-model="form.systemId"
  id="system_id"
  name="system_id"
  label="ID do Sistema"
  :readonly="true"
/>
```

---

### Exemplo 7 — Desabilitado

```vue
<FieldInput
  v-model="form.campoFixo"
  id="campo_bloqueado"
  name="campo_bloqueado"
  label="Campo Bloqueado"
  :disabled="true"
/>
```

---

### Exemplo 8 — Hidden (sem estrutura visual)

```vue
<FieldInput
  v-model="form.token"
  id="token"
  name="token"
  type="hidden"
/>
```

> Quando `type="hidden"`, o componente renderiza apenas o `<input>` sem label, wrapper ou feedback.

---

### Exemplo 9 — Com datalist (sugestões)

```vue
<FieldInput
  v-model="form.cidade"
  id="cidade"
  name="cidade"
  label="Cidade"
  placeholder="Digite ou escolha"
  :options="['Porto Alegre', 'São Paulo', 'Curitiba', 'Florianópolis']"
/>
```

---

### Exemplo 10 — Classe customizada

```vue
<FieldInput
  v-model="form.destaque"
  id="campo_destaque"
  name="campo_destaque"
  label="Campo Destacado"
  input-class="form-control form-control-lg border-primary"
/>
```

---

### Exemplo 11 — Capturando estado de validação no form pai

```vue
<script setup>
import { reactive } from 'vue'
import { FieldInput } from '@/components/form-fields'

const form = reactive({ nome: '', email: '' })
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
    <FieldInput
      v-model="form.nome"
      id="nome"
      name="nome"
      label="Nome"
      :required="true"
      @validation="onValidation"
    />
    <FieldInput
      v-model="form.email"
      id="email"
      name="email"
      label="E-mail"
      type="email"
      :required="true"
      @validation="onValidation"
    />
    <button type="submit" :disabled="!formValido" class="btn btn-primary">
      Enviar
    </button>
  </form>
</template>
```

---

## 4) Estrutura HTML gerada (type ≠ hidden)

```html
<div class="mb-3">
  <label for="nome" class="form-label fw-semibold">
    Nome Completo <span class="text-danger ms-1">*</span>
  </label>
  <input
    id="nome"
    name="nome"
    type="text"
    class="form-control is-invalid"
    required
  />
  <div class="invalid-feedback d-block" style="font-size: 0.72rem; font-style: italic;">
    <span class="d-block">Campo "Nome Completo" é obrigatório.</span>
  </div>
</div>
```

---

## 5) Comportamento de validação

- Validação ativada no evento `blur` (saída do campo) ou `input` (digitação)
- `is-invalid` (borda vermelha) + mensagem abaixo quando há erros
- `is-valid` (borda verde) quando o campo tem valor e passa em todas as regras
- Campos `disabled` e `readonly` **não** disparam validação

### Ordem de prioridade das regras

1. `required` com campo vazio → erro imediato, demais regras ignoradas
2. `allow-special`, `allow-numbers`, `allow-letters` → validados se o campo tiver valor

---

## 6) Mapeamento JS → Vue

| `filed_input.js` (data-*) | `FieldInput.vue` (prop) |
|---------------------------|-------------------------|
| `data-label="Nome"` | `label="Nome"` |
| `data-class="form-control-lg"` | `input-class="form-control-lg"` |
| `data-special="false"` | `:allow-special="false"` |
| `data-number="false"` | `:allow-numbers="false"` |
| `data-letter="false"` | `:allow-letters="false"` |
| `data-readonly="true"` | `:readonly="true"` |
| `data-disabled="true"` | `:disabled="true"` |
| `data-required="true"` | `:required="true"` |
| `data-options='["A","B"]'` | `:options="['A', 'B']"` |
| `data-value="x"` | `v-model="ref"` |

---

## 7) Dependências

- **Vue 3** — `ref`, `computed`, `watch` (Composition API)
- **Bootstrap 5.3+** — classes `form-control`, `is-invalid`, `is-valid`, `invalid-feedback`, `form-label`
