export default function heyReducer (state = { say: '...' }, action) {
  switch (action.type) {
    case 'HEY':
      return { say: 'Hey!' }

    case 'HI':
      return { say: 'da!' }

    default:
      return state
  }
}
