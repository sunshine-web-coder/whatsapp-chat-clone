import { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usersData, setUsersData] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const userDocs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsersData(userDocs);
    });

    return () => unsubscribe();
  }, []);

  const allData = {
    usersData,
  };


  return (
    <UserContext.Provider value={allData}>
      {children}
    </UserContext.Provider>
  );
};

export const UserContextData = () => {
    return useContext(UserContext);
  };
  