import { createSlice } from '@reduxjs/toolkit';

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

export interface CoursesState {
  courses?: ICourse[]
  loading?: boolean
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
      };
    },
    reset: () => {
      return {};
    },
    setCourses: (state, action) => {
      return {
        courses: action.payload
      };
    },
    editCourses: (state, action) => {
      return {
        ...state,
        courses: state.courses?.map(course => course.id === action.payload.id ? action.payload : course)
      };
    },
    removeCourse: (state, action) => {
      return {
        ...state,
        courses: state.courses?.filter(course => course.id !== action.payload)
      };
    },
    setLoading: (state, action) => {
      return {
        ...state,
        loading: action.payload
      };
    }
  },
});

export const { addCourse, reset, setCourses, editCourses, removeCourse, setLoading } = courseSlice.actions;

export default courseSlice.reducer;
