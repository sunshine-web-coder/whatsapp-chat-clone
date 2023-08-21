import { useEffect, useState } from "react";
import { UserContextData } from "../../context/UserContext";
import { UserAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default function SearchChat() {
  const { currentUser } = UserAuth();
  const { usersData } = UserContextData();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [filteredUsers, setfilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setResults(usersData); // Set 'blogPosts' data as the initial 'results'
  }, [usersData]);

  useEffect(() => {
    // Remove non-alphanumeric characters from the search term
    const sanitizedSearchTerm = searchTerm.replace(/\W/g, "");

    // Filter the blog posts based on the search term
    const filteredUsers = results.filter((result) => {
      // Remove non-alphanumeric characters from the displayName
      const sanitizedDisplayName = result.displayName
        .replace(/\W/g, "")
        .toLowerCase();

      // Check if the sanitized search term is present in the sanitized displayName
      return sanitizedDisplayName.includes(sanitizedSearchTerm.toLowerCase());
    });

    setfilteredUsers(filteredUsers);
    setIsLoading(false);
  }, [searchTerm, results]);

  const handleSearchInputChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
  };

  const handleSelect = async (selectedUser) => {
    //check whether the group(chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChat", currentUser.uid), {
        [combinedId + ".userInfo"]: {
          uid: selectedUser.uid,
          displayName: selectedUser.displayName,
          photoURL: selectedUser.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChat", selectedUser.uid), {
        [combinedId + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [combinedId + ".date"]: serverTimestamp(),
      });
      }
    } catch (err) {
      console.log(err);
    }
    setSearchTerm("")
  };

  return (
    <div className="pb-2 pt-2">
      <div className="w-full pl-3 pr-4">
        <div className="relative">
          <i className="absolute fa fa-search text-gray-100 top-2.5 left-4"></i>
          <input
            type="text"
            className="bg-gray-800 h-9 w-full px-12 rounded-lg focus:outline-none hover:cursor-pointer"
            name="username"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
        </div>
      </div>
      {searchTerm.length > 0 && (
        <div className="mt-2 h-full userChat">
          <ul role="list" className="">
            {isLoading ? (
              <>Loading...</>
            ) : filteredUsers.length === 0 ? (
              <li className="p-3 text-center">User not found</li>
            ) : (
              filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="flex p-3 border-l-0 border-r-0 last:border-b border hover:bg-gray-800 border-slate-700 cursor-pointer"
                  onClick={() => handleSelect(user)}
                >
                  <img
                    className="h-12 w-12 rounded-full"
                    src={user.photoURL}
                    alt="avatar"
                  />
                  <div className="ml-3 overflow-hidden">
                    <p className="text-lg font-bold text-grey-darkest">
                      {user.displayName}
                    </p>
                    {/* <p className="text-sm text-slate-400 truncate">
                      How are you?
                    </p> */}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
