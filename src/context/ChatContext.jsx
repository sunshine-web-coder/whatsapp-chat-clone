import { createContext, useReducer, useState } from "react";
import { UserAuth } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = UserAuth();
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
    setShowOnboarding(false); // Hide onboarding when user selects a chat
  };

  return (
    <ChatContext.Provider value={{ data: state, dispatch, showOnboarding, closeOnboarding, handleSelect }}>
      {children}
    </ChatContext.Provider>
  );
};
