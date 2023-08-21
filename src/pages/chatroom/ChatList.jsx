import { useContext, useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { ChatContext } from "../../context/ChatContext";

export default function ChatList() {
  const [chats, setChats] = useState([]);
  const { currentUser } = UserAuth();
  const { handleSelect } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChat", currentUser.uid), (doc) => {
        if (doc.exists()) {
          setChats(doc.data());
        }
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  return (
    <ul role="list" className="">
      {chats &&
        Object.entries(chats)
          .sort((a, b) => {
            // Handle cases where 'date' is null
            const dateA = a[1]?.date?.seconds || 0;
            const dateB = b[1]?.date?.seconds || 0;
            return dateB - dateA;
          })
          .map((chat) => {
            if (chat[1]?.userInfo?.displayName) {
              return (
                <li
                  key={chat[0]}
                  className="flex p-3 border-l-0 border-r-0 last:border-b border hover:bg-gray-800 border-slate-700 cursor-pointer"
                  onClick={() => handleSelect(chat[1].userInfo)}
                >
                  <img
                    className="h-12 w-12 rounded-full"
                    src={chat[1].userInfo.photoURL}
                    alt=""
                  />
                  <div className="ml-3 overflow-hidden w-full">
                    <p className="text-lg font-bold text-grey-darkest">
                      {chat[1].userInfo.displayName}
                    </p>
                    <div className="flex justify-between w-full">
                      <p className="text-sm text-slate-400 truncate">
                        {chat[1]?.lastMessage?.text || ""}
                      </p>
                      <div className="text-xs w-24 flex justify-end relative bottom-6">
                        {chat[1]?.date &&
                          new Date(chat[1].date.seconds * 1000).toLocaleTimeString(
                            [],
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            } else {
              return null;
            }
          })}
    </ul>
  );
}
