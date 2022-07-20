import { MemberItem } from '~/domain/models/member/member'

export class MemberDTO {
  id: number
  user: number
  role: number
  username: string
  email: string
  rolename: string

  constructor(item: MemberItem) {
    this.id = item.id
    this.user = item.user
    this.role = item.role
    this.username = item.username
    this.email = item.email
    this.rolename = item.rolename
  }
}
