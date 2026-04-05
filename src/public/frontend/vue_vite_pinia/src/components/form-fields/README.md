# form-fields — Fábricas de Campos de Formulário

Coleção de componentes Vue 3 + Bootstrap 5 para montagem declarativa de campos de formulário.
Cada componente é uma **fábrica independente** — pode ser usado em qualquer view ou página sem dependência entre si.

---

## Estrutura da pasta

```
src/components/form-fields/
├── README.md                  ← este índice
├── index.js                   ← barrel export (importação centralizada)
│
├── FieldInput.vue             ← <input> text, hidden, email, password...
├── README_FieldInput_vue.md   ← documentação detalhada do FieldInput
│
├── FieldPhone.vue             ← celular/telefone com máscara e validação DDD ANATEL
├── README_FieldPhone.md       ← documentação detalhada do FieldPhone
│
│   (próximas fábricas)
├── FieldSelect.vue            ← <select> com opções estáticas ou dinâmicas
├── FieldTextarea.vue          ← <textarea> com contagem de caracteres
├── FieldCheckbox.vue          ← <input type="checkbox"> individual ou grupo
├── FieldRadio.vue             ← <input type="radio"> grupo
├── FieldSwitch.vue            ← toggle switch (checkbox estilizado)
├── FieldFile.vue              ← <input type="file"> com preview
└── FieldDate.vue              ← <input type="date"> com máscaras
```

---

## Índice de componentes

| Componente      | Status        | Descrição                                                                          | Documentação                                         |
| --------------- | ------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `FieldInput`    | ✅ Disponível | Campos `<input>` com validação de caracteres, datalist, readonly/disabled/required | [README_FieldInput_vue.md](README_FieldInput_vue.md) |
| `FieldPhone`    | ✅ Disponível | Celular/Telefone com máscara dinâmica e validação de DDD ANATEL                    | [README_FieldPhone_vue.md](README_FieldPhone_vue.md) |
| `FieldSelect`   | 🔜 Em breve   | Dropdown com opções estáticas e carregamento assíncrono                            | —                                                    |
| `FieldTextarea` | 🔜 Em breve   | Área de texto com limite de caracteres e contagem                                  | —                                                    |
| `FieldCheckbox` | 🔜 Em breve   | Checkbox individual ou grupo com v-model array                                     | —                                                    |
| `FieldRadio`    | 🔜 Em breve   | Grupo de opções exclusivas                                                         | —                                                    |
| `FieldSwitch`   | 🔜 Em breve   | Toggle estilizado Bootstrap                                                        | —                                                    |
| `FieldFile`     | 🔜 Em breve   | Upload com preview de imagem e validação de tipo/tamanho                           | —                                                    |
| `FieldDate`     | 🔜 Em breve   | Campo de data com máscara e validação de intervalo                                 | —                                                    |

---

## Como importar

```js
// Importação nomeada via barrel (recomendado)
import { FieldInput, FieldPhone } from "@/components/form-fields";

// Importação direta (melhor tree-shaking em bundles grandes)
import FieldInput from "@/components/form-fields/FieldInput.vue";
import FieldPhone from "@/components/form-fields/FieldPhone.vue";
```

---

## Convenções desta coleção

| Convenção           | Detalhe                                                                        |
| ------------------- | ------------------------------------------------------------------------------ |
| **Nome**            | Sempre prefixo `Field` + tipo em PascalCase                                    |
| **v-model**         | Todos os campos implementam `modelValue` / `emit('update:modelValue')`         |
| **Validação**       | Evento `@validation` emite `{ id, valid, errors[] }` para controle do form pai |
| **Bootstrap**       | Classes Bootstrap 5 aplicadas via props — sem CSS próprio salvo exceções       |
| **Acessibilidade**  | `for/id` sempre vinculados, `aria-*` onde necessário                           |
| **Props booleanas** | Todas com `default: false` — o comportamento restritivo é opt-in               |

---

## Dependências

- **Vue 3** (Composition API / `<script setup>`)
- **Bootstrap 5.3+** (classes CSS — deve estar disponível globalmente)
- **Vite** com alias `@` apontando para `src/`
