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
  surveyAvailable?: boolean,
}

const initialState: UserState = {}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state = action.payload

      // DEBUG: Activa la encuesta si hay 2 o más cursos asignados al usuario. 
      // DEBUG: Lo deberia hacer basado en base a la HU definida (cantidad multiplo)
      state.surveyAvailable = courses.length >= 2
      // state.surveyAvailable = false

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