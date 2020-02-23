export interface StateType {
  status?: 'ok' | 'error'
  type?: string
  currentAuthority?: 'user' | 'guest' | 'admin'
}
