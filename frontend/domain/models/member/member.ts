export class MemberItem {
  id: number
  user: number
  role: number
  username: string
  email: string
  rolename: string

  get isProjectAdmin(): boolean {
    return this.rolename === 'project_admin'
  }

  toObject(): Object {
    return {
      id: this.id,
      user: this.user,
      role: this.role,
      username: this.username,
      email: this.email,
      rolename: this.rolename
    }
  }
}
