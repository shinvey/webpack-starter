export function elderApp ({ reducers: reducerMap, epics }) {
  return {
    id: 'elder-app',
    reducerMap,
    epics,
  }
}
