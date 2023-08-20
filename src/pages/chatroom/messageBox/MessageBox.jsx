import { useContext } from "react";
import InputBox from "../InputBox";
import Message from "./Message";
import MessageNavBar from "./MessageNavBar";
import { ChatContext } from "../../../context/ChatContext";
import Onboarding from "../../../component/onboarding/Onboarding";

export default function MessageBox() {
  const { showOnboarding } = useContext(ChatContext);

  return (
    <div className="w-full h-screen flex flex-col">
      {showOnboarding ? (
        <Onboarding />
      ) : (
        <>
          <MessageNavBar />
          <Message />
          <InputBox />
        </>
      )}
    </div>
  );
}
