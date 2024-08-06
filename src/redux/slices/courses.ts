import { createSlice } from '@reduxjs/toolkit'

export interface ICourse {
  id: string,
  title: string,
  description: string,
  image: string,
  matriculationCode: string,
  teacherUserId: string,
  students: any[],
  sections: any[],
 }

// TODO: Match with potential User.model.ts
export interface CoursesState {
 courses?: ICourse[]
}

const initialState: CoursesState = {}

export const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    addCourse: (state, action) => {
      return {
        ...state,
        courses: state.courses ? [...state.courses, action.payload] : [action.payload]
      }
    },
    reset: () => {
      return {}
    },
    setCourses: (state, action) => {
      return {
        courses: action.payload
      }
  },
  },
})

// Action creators are generated for each case reducer function
export const { addCourse, reset, setCourses } = courseSlice.actions

export default courseSlice.reducer