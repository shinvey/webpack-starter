import { hackerNewsReducer } from './reducer'
import { pingReducer } from './pingReducer'
import heyReducer from './heyReducer'
import pingEpic from './pingEpic'
import heyEpic from './heyEpic'
import { fetchStories } from './actions'

export function getHackerNewsModule () {
  return {
    // Unique id of the module
    id: 'hacker-news',
    // Maps the Store key to the reducer
    reducerMap: {
      hackerNews: hackerNewsReducer,
      ping: pingReducer,
      greeting: heyReducer
    },
    epics: [heyEpic, pingEpic],
    // Optional: Any actions to dispatch when the module is loaded
    initialActions: [fetchStories()],
    // Optional: Any actions to dispatch when the module is unloaded
    finalActions: []
  }
}
