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
    removeStudentFromCourse: (state, action) => {
      const { courseId, studentId } = action.payload;
      
      const courseIndex = state.courses?.findIndex(course => course.id === courseId);
      
      if (courseIndex !== undefined && courseIndex >= 0) {
        const updatedStudents = state.courses![courseIndex].students.filter(
          student => student.id !== studentId
        );
        
        state.courses![courseIndex] = {
          ...state.courses![courseIndex],
          students: updatedStudents,
        };
      }
    },    
  },
})

// Action creators are generated for each case reducer function
export const { addCourse, reset, setCourses, removeStudentFromCourse } = courseSlice.actions

export default courseSlice.reducer