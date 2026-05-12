import type { IUserRepository } from '../repositories/IUserRepository'

export interface UploadUserFilesInput {
  userId: string
  fileUri: string
}

export class UploadUserFilesUseCase {
  constructor(private readonly repo: IUserRepository) {}

  async execute(input: UploadUserFilesInput): Promise<void> {
    await this.repo.uploadFiles(input.userId, input.fileUri)
  }
}
