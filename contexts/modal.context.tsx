import { createContext, FC, useContext, useEffect, useState } from "react";

interface AppModalContextType {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppModalContext = createContext<AppModalContextType>({
  openModal: true,
  setOpenModal: () => {},
} as AppModalContextType);

export const AppModalProvider: FC = ({ children }) => {
  const [openModal, setOpenModal] = useState(true);

  useEffect(() => {
    setOpenModal(true);
  }, []);

  return (
    <AppModalContext.Provider
      value={{
        openModal,
        setOpenModal,
      }}
    >
      {children}
    </AppModalContext.Provider>
  );
};

export const AppModalConsumer = AppModalContext.Consumer;

export const useAppModal = () => {
  return useContext(AppModalContext);
};
