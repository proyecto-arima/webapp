import { createSlice } from '@reduxjs/toolkit'
import courses from './courses'


export interface UserState {
  id?: string,
  firstName?: string,
  lastName?: string,
  role?: string,
  document?: {
    type: string,
    number: string
  },
  email?: string,
  institute?: {
    id: string,
    name: string
  },
  learningProfile?: 'DIVERGENTE' | 'ASIMILADOR' | 'ACOMODADOR' | 'CONVERGENTE',
  requiresSurvey?: boolean,
}

const initialState: UserState = {}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state = action.payload
      return state
    },
    reset: () => {
      return {}
    },
  },
})

// Action creators are generated for each case reducer function
export const { setUser, reset } = userSlice.actions

export default userSlice.reducer