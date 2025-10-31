import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Experience, TimeSlot } from '../types';

interface BookingContextType {
  selectedExperience: Experience | null;
  selectedSlot: TimeSlot | null;
  numPeople: number;
  setSelectedExperience: (exp: Experience | null) => void;
  setSelectedSlot: (slot: TimeSlot | null) => void;
  setNumPeople: (num: number) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [numPeople, setNumPeople] = useState(1);

  const resetBooking = () => {
    setSelectedExperience(null);
    setSelectedSlot(null);
    setNumPeople(1);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedExperience,
        selectedSlot,
        numPeople,
        setSelectedExperience,
        setSelectedSlot,
        setNumPeople,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
