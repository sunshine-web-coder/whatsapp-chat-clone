import { createContext, useState, useContext, useEffect } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { db, auth, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

// create context
const AuthContext = createContext();
// Provider Context
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = (displayName, email, password, profilePicture) => {
    return createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;

        // Send email verification immediately after user creation
        return sendEmailVerification(user).then(() => {
          const joined = new Date();
          return updateProfile(user, { displayName: displayName }).then(() => {
            if (profilePicture) {
              // ...existing code...

              // Upload the profile picture and update user profile
              const storageRef = ref(storage, `/profile_images/${user.uid}`);
              return uploadBytes(storageRef, profilePicture)
                .then((snapshot) => getDownloadURL(snapshot.ref))
                .then((photoURL) => {
                  updateProfile(user, { photoURL });

                  // Store user data in Firestore
                  const userRef = doc(db, "users", user.uid);
                  return setDoc(userRef, {
                    uid: user.uid,
                    displayName,
                    email,
                    photoURL,
                    joined: joined.toString(),
                  }).then(() => {
                    // Create user chat data
                    const userChatRef = doc(db, "userChat", user.uid);
                    return setDoc(userChatRef, {});
                  });
                });
            } else {
              return user;
            }
          });
        });
      }
    );
  };

  // signin with google
  const signinWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  // signout
  const logout = () => signOut(auth);

  // set currentUser
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const presenceRef = doc(db, "presence", user.uid);
        setDoc(presenceRef, {
          online: true,
          lastActive: new Date(),
        });
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return () => {
      if (currentUser) {
        const presenceRef = doc(db, "presence", currentUser.uid);
        setDoc(presenceRef, {
          online: false,
          lastActive: new Date(),
        });
      }
      unsubscribe();
    };
  }, [currentUser]);

  const value = {
    currentUser,
    setCurrentUser,
    login,
    signUp,
    signinWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
