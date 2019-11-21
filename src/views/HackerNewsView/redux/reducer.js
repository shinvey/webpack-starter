import produce from 'immer'
import { HackerNewsStoriesAvailable } from './actions'

/**
 * 使用immer的produce包装reducer需要了解的相关知识点
 * Curried producers
 * https://immerjs.github.io/immer/docs/curried-produce
 * Returning new data from producers
 * https://immerjs.github.io/immer/docs/return
 */
export const hackerNewsReducer = produce((draft, action) => {
  switch (action.type) {
    case HackerNewsStoriesAvailable: {
      draft.items = action.payload.items
      break
    }
  }
}, { items: [] })
