export const SYSTEM_CODE = 1
export const APP_VERSION = 'V1'

export const ENVIRONMENT = 'development'
// export const ENVIRONMENT = 'production'
// export const ENVIRONMENT = 'test'

// Em produção: frontend e backend no mesmo host → window.location.origin
// Em development: backend em porta separada do Vite dev server
export const APP_BASE_HOST = (ENVIRONMENT as string) === 'production'
    ? window.location.origin
    : 'http://localhost:56300'
export const THEME = 'Purple'

// export const THEME = 'Dark'
// export const THEME = 'Light'
// export const THEME = 'Green'
// export const THEME = 'Blue'
// export const THEME = 'Red'
