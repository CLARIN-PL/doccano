
export class UserItem {
  id: number
  username: string
  [key: string]: any

  toObject(): Object {
    return {
      id: this.id,
      username: this.username,
      is_superuser: this.is_superuser,
      is_staff: this.is_staff
    }
  }
}
