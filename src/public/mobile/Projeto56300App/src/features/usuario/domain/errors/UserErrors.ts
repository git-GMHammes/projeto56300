export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Este nome de usuário já está em uso.')
    this.name = 'UserAlreadyExistsError'
  }
}

export class UserNotFoundError extends Error {
  constructor() {
    super('Usuário não encontrado.')
    this.name = 'UserNotFoundError'
  }
}

export class WeakPasswordError extends Error {
  constructor() {
    super('A senha deve ter no mínimo 6 caracteres.')
    this.name = 'WeakPasswordError'
  }
}
