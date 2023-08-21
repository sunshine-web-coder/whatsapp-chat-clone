import { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../../../context/ChatContext";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { UserAuth } from "../../../context/AuthContext";
import { Popover } from "antd";

export default function Message() {
  const { currentUser } = UserAuth();
  const { data } = useContext(ChatContext);
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data().messages);
      }
    });

    return () => {
      unsub();
    };
  }, [data.chatId]);

  const handleDeleteMessage = async (messageId) => {
    try {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: messages.filter((message) => message.id !== messageId),
      });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the messages
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="overflow-auto h-screen chat_container py-2 px-3">
      {messages.map((message) => (
        <div
          className={`chat ${
            message.senderId === currentUser.uid ? "chat-end" : "chat-start"
          }`}
          key={message.id}
        >
          <div className="mb-3">
            <div className="flex">
              <div className="p-0 mr-4">
                <div className="w-8 h-8 avatar rounded-full">
                  <img
                    src={
                      message.senderId === currentUser.uid
                        ? currentUser.photoURL
                        : data.user.photoURL
                    }
                    alt="User profile"
                    className="relative rounded-full"
                  />
                </div>
              </div>
              <div className="chat-box rounded">
                <div className="relative p-3 pb-1 pt-1 max-w-lg">
                  {/* <p>Wale</p> */}
                  <div className="flex justify-between w-full">
                    <p className="break-all">{message.text}</p>{" "}
                    {/* <div>
                      {message.senderId === currentUser.uid && (
                        <Popover
                          placement="bottom"
                          content={
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                            >
                              Delete
                            </button>
                          }
                          trigger="click"
                          className="z-0"
                        >
                          <i className="fa-solid cursor-pointer fa-angle-down ml-4"></i>
                        </Popover>
                      )}
                    </div> */}
                  </div>
                  {!message.img && (
                    <div className="text-xs w-full flex justify-end">
                      {new Date(message.date.seconds * 1000).toLocaleTimeString(
                        [],
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </div>
                  )}
                </div>
                <div className="message_img max-w-xs">
                  {/* <div className="text_message mb-3 p-3">
                Hello, how are you how are you how are youhow are youhow are
                you?
              </div> */}
                  <div className="pl-1 pr-1 pb-1 mt-1 relative">
                    <img src={message.img} alt="" className="rounded" />
                    {message.img && (
                      <div className="text-xs w-14 h-5 absolute right-2 bottom-3 z-1">
                        {new Date(
                          message.date.seconds * 1000
                        ).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef}></div>
    </div>
  );
}
