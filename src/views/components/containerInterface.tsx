export interface ContainerPropsInterface<T> {
  [random: string]: any
  state: T
  dispatch(action: { type: string; payload?: any }): void
}

export interface ContainerStateInterface {
  [random: string]: any
}
