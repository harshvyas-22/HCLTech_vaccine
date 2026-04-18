import { createContext, useContext, useMemo, useState } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState({
    hospital: null,
    vaccine: null,
    vaccineId: null,
    slotDate: null,
    price: null,
    doseNumber: 1,
    result: null,
  });

  const selectBooking = (payload) => {
    setBooking((prev) => ({ ...prev, ...payload }));
  };

  const clearBooking = () => {
    setBooking({
      hospital: null,
      vaccine: null,
      vaccineId: null,
      slotDate: null,
      price: null,
      doseNumber: 1,
      result: null,
    });
  };

  const value = useMemo(() => ({ booking, selectBooking, clearBooking }), [booking]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  return useContext(BookingContext);
}
