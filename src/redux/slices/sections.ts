import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IContent {
  id: string;
  title: string;
  publicationType: string;
  presignedUrl: string;
}
export interface ISection {
  id: string;
  name: string;
  description: string;
  visible: boolean;
  content?: IContent[];
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
    removeContent: (state, action: PayloadAction<{ sectionId: string, contentId: string }>) => {
      return {
        ...state,
        sections: state.sections?.map(section =>
          section.id === action.payload.sectionId
            ? {
                ...section,
                content: section.content?.filter(content => content.id !== action.payload.contentId)
              }
            : section
        )
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
export const { addSection, removeSection, removeContent, resetSections, setSections } = sectionSlice.actions

export default sectionSlice.reducer
