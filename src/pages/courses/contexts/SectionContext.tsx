import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { API_URL } from '../../../config';

interface ISection {
  id: string;
  title: string;
  description: string;
  visible: boolean;
}

interface ISectionContext {
  sections: ISection[];
  addSection: (section: ISection) => void;
}

const SectionContext = createContext<ISectionContext | undefined>(undefined);

const fetchSections = async (courseId: string) => {
  try {
    const response = await fetch(`${API_URL}/courses/${courseId}/sections`);
    if (!response.ok) {
      throw new Error('Error fetching sections');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sections:', error);
    return [];
  }
};

export const SectionProvider = ({ children }: { children: ReactNode }) => {
  const [sections, setSections] = useState<ISection[]>([]);

  const addSection = (section: ISection) => {
    setSections([...sections, section]);
  };

  return (
    <SectionContext.Provider value={{ sections, addSection }}>
      {children}
    </SectionContext.Provider>
  );
};

export const useSectionContext = () => {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error('useSectionContext must be used within a SectionProvider');
  }
  return context;
};
