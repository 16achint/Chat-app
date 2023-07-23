import { createContext, useContextSelector } from 'use-context-selector';

const currentRoomContext = createContext();

export const CurrentRoomProvider = ({ children, data }) => {
  return (
    <currentRoomContext.Provider value={data}>
      {children}
    </currentRoomContext.Provider>
  );
};

export const useCurrentRoom = selector =>
  useContextSelector(currentRoomContext, selector);
