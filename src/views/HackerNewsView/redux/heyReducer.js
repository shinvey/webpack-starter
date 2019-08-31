export const heyReducer = (state = { say: '...' }, action) => {
  switch (action.type) {
    case 'HEY':
      return { say: 'Hey!' }

    case 'HI':
      return { say: 'Hi!' }

    default:
      return state
  }
}
