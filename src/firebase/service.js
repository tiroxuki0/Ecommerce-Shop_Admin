import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, push, set, update, get, child } from "firebase/database";
import { auth, db } from "./config";
import { createdAt } from "../helpers/utils";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

/* AUTH ACTIONS */
const firebaseCreateNewAccount = async (data) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    data.email,
    data.password
  )
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      return { code: 1, message: "Create successful!", user };
    })
    .catch((error) => {
      return { code: 0, message: "Create failed!", error };
    });
  return result;
};

const firebaseNormalSignIn = async (data) => {
  const result = await signInWithEmailAndPassword(
    auth,
    data.email,
    data.password
  )
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      return { code: 1, message: "Signin successful!", user };
    })
    .catch((error) => {
      return { code: 0, message: "Signin failed!", error };
    });
  return result;
};

const facebookSignIn = async () => {
  const result = await signInWithPopup(auth, facebookProvider)
    .then((data) => {
      return { code: 1, message: "Signin successful!", data };
    })
    .catch((error) => {
      return { code: 0, message: "Signin failed!", error };
    });
  return result;
};

const googleSignIn = async () => {
  const result = await signInWithPopup(auth, googleProvider)
    .then((data) => {
      return { code: 1, message: "Signin successful!", data };
    })
    .catch((error) => {
      return { code: 0, message: "Signin failed!", error };
    });
  return result;
};

const twitterSignIn = async () => {
  const result = await signInWithPopup(auth, twitterProvider)
    .then((data) => {
      return { code: 1, message: "Signin successful!", data };
    })
    .catch((error) => {
      return { code: 0, message: "Signin failed!", error };
    });
  return result;
};

const firebaseSignOut = async () => {
  const result = await signOut(auth)
    .then(() => {
      // Sign-out successful.
      return { code: 1, message: "Sign out successful!" };
    })
    .catch((error) => {
      // An error happened.
      return { code: 0, message: error };
    });
  return result;
};

/* USER ACTIONS */
const addDocument = async (dbname, data) => {
  const dataRef = await ref(db, dbname);
  const newRef = await push(dataRef);
  await set(newRef, data);
  console.log(newRef);
  return newRef;
};

function updateUser(id, data) {
  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates["/usersData/" + id] = data;

  return update(ref(db), updates);
}

/* ORDER */
const writeOrder = async (userId, idOrder, data) => {
  await set(ref(db, "ordersData/" + userId + "/" + idOrder), {
    ...data,
    createdAt: createdAt(),
  });
};

const checkOrderId = async (userId, idOrder) => {
  const dbRef = await ref(db);
  get(child(dbRef, `ordersData/${userId}/${idOrder}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      return error;
    });
};

/* Cart */
const writeCart = async (userId, data) => {
  await set(ref(db, "/cartsData/" + userId), data);
};

function updateCart(userId, data) {
  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates["/cartsData/" + userId] = data;

  return update(ref(db), updates);
}

const checkCartUser = async (userId, data) => {
  const dbRef = ref(db);
  get(child(dbRef, `cartsData/${userId}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        // console.log("Cart previous", snapshot.val());
        // console.log("Update cart", data);
        updateCart(userId, data);
      } else {
        console.log("Write cart", data);
        writeCart(userId, data);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export {
  firebaseCreateNewAccount,
  firebaseNormalSignIn,
  firebaseSignOut,
  facebookSignIn,
  twitterSignIn,
  googleSignIn,
  addDocument,
  writeOrder,
  checkOrderId,
  writeCart,
  updateCart,
  updateUser,
  checkCartUser,
};
