import React, { useState } from 'react'

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface FormFieldSchema {
  /** Largura da coluna Bootstrap (1-12). Ex: 4 → col-md-4 */
  col: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

  /** Texto do <label> acima do campo */
  label?: string

  /** Opções do datalist (gera <datalist> automaticamente vinculado ao campo) */
  datalist?: string[]

  // ── Validações em tempo real (mostram alerta ao digitar) ──────────────────
  /** Não aceita números (ex: campo Nome) */
  noNumbers?: boolean
  /** Não aceita letras (ex: campo CPF, Telefone) */
  noLetters?: boolean
  /** Não aceita caracteres especiais */
  noSpecialChars?: boolean

  // ── Atributos específicos do input[type="text"] ───────────────────────────
  id?: string
  name?: string
  placeholder?: string
  defaultValue?: string
  value?: string
  readOnly?: boolean
  disabled?: boolean
  required?: boolean
  maxLength?: number
  minLength?: number
  size?: number
  pattern?: string
  autoComplete?: string
  autoFocus?: boolean
  spellCheck?: boolean
  inputMode?: 'text' | 'numeric' | 'decimal' | 'email' | 'tel' | 'url' | 'search' | 'none'
  /** ID de um <datalist> externo (use `datalist` acima para gerar automaticamente) */
  list?: string

  // ── Atributos globais ─────────────────────────────────────────────────────
  className?: string
  style?: React.CSSProperties
  title?: string
  tabIndex?: number
  hidden?: boolean
  dir?: 'ltr' | 'rtl'
  lang?: string

  // ── Handlers ──────────────────────────────────────────────────────────────
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  onFocus?: React.FocusEventHandler<HTMLInputElement>
}

export interface FormRowSchema {
  fields: FormFieldSchema[]
}

export interface FormGridSchema {
  rows: FormRowSchema[]
}

// ─── Validação no blur (required, minLength, maxLength, pattern) ─────────────

function validarBlur(field: FormFieldSchema, valor: string): string | null {
  const nome = field.label ?? field.name ?? field.id ?? 'Campo'

  if (field.required && !valor.trim())
    return `${nome} é obrigatório`

  if (field.minLength && valor.length > 0 && valor.length < field.minLength)
    return `${nome} deve ter no mínimo ${field.minLength} caractere${field.minLength > 1 ? 's' : ''}`

  if (field.maxLength && valor.length > field.maxLength)
    return `${nome} deve ter no máximo ${field.maxLength} caractere${field.maxLength > 1 ? 's' : ''}`

  if (field.pattern && valor.trim() && !new RegExp(`^(?:${field.pattern})$`).test(valor))
    return `${nome} está em formato inválido`

  return null
}

// ─── Validação em tempo real (noNumbers, noLetters, noSpecialChars) ──────────

function validarDigitacao(field: FormFieldSchema, valor: string): string | null {
  const nome = field.label ?? field.name ?? field.id ?? 'Campo'

  if (field.noNumbers && /\d/.test(valor))
    return `${nome} não deve conter números`

  if (field.noLetters && /[a-zA-ZÀ-ÿ]/.test(valor))
    return `${nome} não deve conter letras`

  if (field.noSpecialChars && /[^a-zA-ZÀ-ÿ0-9\s]/.test(valor))
    return `${nome} não deve conter caracteres especiais`

  return null
}

// ─── Componente ───────────────────────────────────────────────────────────────

interface FormGridProps {
  schema: FormGridSchema
}

function FormGrid({ schema }: FormGridProps) {
  const [erros, setErros] = useState<Record<string, string>>({})

  function setErro(chave: string, erro: string | null) {
    setErros(prev => {
      if (!erro) {
        const next = { ...prev }
        delete next[chave]
        return next
      }
      return { ...prev, [chave]: erro }
    })
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    field: FormFieldSchema,
    chave: string
  ) {
    setErro(chave, validarDigitacao(field, e.target.value))
    field.onChange?.(e)
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement>,
    field: FormFieldSchema,
    chave: string
  ) {
    // Mantém erro de digitação se houver; só aplica blur se não tiver
    const erroDigitacao = validarDigitacao(field, e.target.value)
    setErro(chave, erroDigitacao ?? validarBlur(field, e.target.value))
    field.onBlur?.(e)
  }

  return (
    <>
      {schema.rows.map((row, rowIndex) => (
        <div key={rowIndex} className="row g-3">
          {row.fields.map((field, fieldIndex) => {
            const {
              col,
              label,
              datalist,
              className,
              hidden,
              id,
              noNumbers: _n,
              noLetters: _l,
              noSpecialChars: _s,
              ...inputProps
            } = field

            const chave = id ?? `r${rowIndex}f${fieldIndex}`
            const erro = erros[chave]

            const datalistId = datalist
              ? (id ? `${id}-list` : `datalist-${chave}`)
              : undefined

            const { value, onChange: _onChange, onBlur: _onBlur, ...restInputProps } = inputProps

            // value + onChange externo → controlado
            // value sem onChange      → defaultValue (não-controlado editável)
            // sem value               → não-controlado
            const controlProps: React.InputHTMLAttributes<HTMLInputElement> =
              value !== undefined
                ? _onChange !== undefined
                  ? { value }
                  : { defaultValue: value }
                : {}

            return (
              <div key={fieldIndex} className={`col-md-${col} mb-1`} hidden={hidden}>
                {label && (
                  <label htmlFor={id} className="form-label">
                    {label}
                    {restInputProps.required && (
                      <span className="text-danger ms-1">*</span>
                    )}
                  </label>
                )}
                <input
                  type="text"
                  id={id}
                  className={`form-control${erro ? ' is-invalid' : ''}${className ? ` ${className}` : ''}`}
                  list={datalist ? datalistId : restInputProps.list}
                  {...restInputProps}
                  {...controlProps}
                  onChange={e => handleChange(e, field, chave)}
                  onBlur={e => handleBlur(e, field, chave)}
                />
                {datalist && (
                  <datalist id={datalistId}>
                    {datalist.map((opt, i) => (
                      <option key={i} value={opt} />
                    ))}
                  </datalist>
                )}
                {/* Espaço reservado fixo — não empurra o layout quando o erro aparece */}
                <div className="text-danger small mt-1" style={{ minHeight: '1.25rem' }}>
                  {erro}
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </>
  )
}

export default FormGrid
