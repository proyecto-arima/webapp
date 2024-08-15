import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ISection {
  id: string;
  name: string;
  description: string;
  visible: boolean;
}

export interface SectionsState {
  sections?: ISection[];
}

const initialState: SectionsState = {}

export const sectionSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    addSection: (state, action: PayloadAction<ISection>) => {
      return {
        ...state,
        sections: state.sections ? [...state.sections, action.payload] : [action.payload]
      }
    },
    removeSection: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        sections: state.sections?.filter(section => section.id !== action.payload)
      }
    },
    resetSections: () => {
      return {}
    },
    setSections: (state, action: PayloadAction<ISection[]>) => {
      return {
        sections: action.payload
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { addSection, removeSection, resetSections, setSections } = sectionSlice.actions

export default sectionSlice.reducer
