import { useContext, useState, useRef } from "react";
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
import toast from "react-hot-toast";

export default function InputBox() {
  const { currentUser } = UserAuth();
  const { data } = useContext(ChatContext);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [showBtn, setShowBtn] = useState(false);
  const inputFileRef = useRef(null); // Ref for the file input element

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

            // Clear input after successful upload
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

      // Clear input after sending text message
      clearInput();
    }

    // Update userChat documents
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
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setShowBtn(e.target.value !== "");
  };

  const clearInput = () => {
    setImg(null);
    setShowBtn(false);
    if (inputFileRef.current) {
      inputFileRef.current.value = null; // Reset the file input value
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const imgSizeKB = selectedImage.size / 1024; // Convert bytes to KB
      if (imgSizeKB > 266) {
        toast.error("Image size is too large. Please select an image below 266KB.");
        clearInput();
        return;
      }
      setImg(selectedImage);
      setShowBtn(true);
    }
  };

  return (
    <div className="bg-grey-lighter messageInput relative z-10 px-4 py-4 flex border border-slate-800 flex-col shadow-md">
      <div className="previewImg">
        {img && (
          <div className="preview-container relative">
            <img src={URL.createObjectURL(img)} alt="Preview" />
            <button
              className="btn h-8 absolute top-1 right-1"
              onClick={clearInput}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        )}
      </div>
      <div className="bg-grey-lighter px-4 py-4 flex items-center">
        <div className="flex gap-4 text-lg text-grey-darkest">
          <div className="upload-btn-wrapper">
            <button className="btn_u">
              <i className="fa-regular cursor-pointer fa-image"></i>
            </button>
            <input
              ref={inputFileRef}
              type="file"
              name="myfile"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="flex-1 flex relative mx-4">
          <textarea
            placeholder="Type a message"
            className="w-full border-0 rounded px-2 py-2 outline-0"
            onChange={handleTextChange}
            value={text}
          />
          {showBtn && (
            <button
              className="text-center py-2 pb-1 px-2 right-0"
              onClick={handleSend}
            >
              <i className="fa-solid text-lg fa-paper-plane"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
