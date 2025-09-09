import { configureStore } from '@reduxjs/toolkit'
import newsReducer from './slices/newsSlice'

export const store = configureStore({
  reducer: {
    news: newsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['news/fetchNews/pending', 'news/fetchNews/fulfilled', 'news/fetchNews/rejected'],
        ignoredPaths: ['news.currentDate'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch