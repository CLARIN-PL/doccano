import { UserItem } from '~/domain/models/user/user'

export class UserDTO {
  id: number
  username: string
  email: string
  isStaff: boolean

  constructor(item: UserItem) {
    this.id = item.id
    this.username = item.username
    this.email = item.email
    this.isStaff = item.isStaff
  }
}
