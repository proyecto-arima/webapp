import { createSlice } from '@reduxjs/toolkit'


// TODO: Match with potential User.model.ts
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
  institution?: string,
  learningType?: string,
}

const initialState: UserState = {}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state = action.payload
      
      // TODO: Add attributes to state
      state.institution = 'SIN_INSTITUCION'
      state.learningType = 'SIN_TIPO_APRENDIZAJE'

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