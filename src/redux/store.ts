import { configureStore } from '@reduxjs/toolkit'
import auth from './slices/auth'
import courses from './slices/courses'
import user from './slices/user'

export const store = configureStore({
  reducer: {
    auth: auth,
    user: user,
    courses: courses,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch