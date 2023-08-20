import { useContext, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function InputBox() {
  const { currentUser } = UserAuth();
  const { data } = useContext(ChatContext);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [showBtn, setShowBtn] = useState(false);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
            clearInput();
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
      clearInput();
    }

    await updateDoc(doc(db, "userChat", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChat", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };
  
  const handleTextChange = (e) => {
    setText(e.target.value);
    setShowBtn(e.target.value !== "");
  };

 const clearInput = () => {
    setImg(null);
    setShowBtn(false);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImg(selectedImage);
      setShowBtn(true);
    }
  };

  return (
    <div className="bg-grey-lighter messageInput relative z-10 px-4 py-4 flex border border-slate-800 flex-col shadow-md">
      <div className="previewImg">
        {img && (
          <div className="preview-container">
            <img src={URL.createObjectURL(img)} alt="Preview" />
            <button className="delete-btn" onClick={clearInput}>
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="bg-grey-lighter px-4 py-4 flex items-center">
        <div className="text-xl text-grey-darkest">
          <i className="fa-regular cursor-pointer fa-face-smile"></i>
        </div>
        <div className="flex-1 relative mx-4">
          <input
            type="text"
            placeholder="Type a message"
            className="w-full border-0 rounded px-2 py-2 pr-16 outline-0"
            onChange={handleTextChange}
            value={text}
          />
          {showBtn && (
            <button
              className="absolute text-center py-2 pb-1 px-2 right-0"
              onClick={handleSend}
            >
              <i className="fa-solid text-lg fa-paper-plane"></i>
            </button>
          )}
        </div>
        <div className="flex gap-4 text-lg text-grey-darkest">
          <div className="upload-btn-wrapper">
            <button className="btn_u">
              <i className="fa-regular cursor-pointer fa-image"></i>
            </button>
            <input
              type="file"
              name="myfile"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
