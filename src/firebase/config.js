// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {
  getStorage,
  getDownloadURL,
  ref as storageRef,
  listAll,
  connectStorageEmulator,
} from "firebase/storage";
import {
  getDatabase,
  connectDatabaseEmulator,
  ref,
  set,
  push,
} from "firebase/database";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBc_6oqXoya11qwEW95I70g1rgtyJTFtpU",
  authDomain: "ecommerce-shop-fece7.firebaseapp.com",
  databaseURL:
    "https://ecommerce-shop-fece7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecommerce-shop-fece7",
  storageBucket: "ecommerce-shop-fece7.appspot.com",
  messagingSenderId: "83172421374",
  appId: "1:83172421374:web:a98d47e732fa21d5d0bfaf",
  measurementId: "G-68P82MHC8M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const dbFirestore = getFirestore(app);
connectFirestoreEmulator(dbFirestore, "localhost", 8080);

const storage = getStorage(app);
connectStorageEmulator(storage, "localhost", 9199);

const auth = getAuth();
connectAuthEmulator(auth, "http://localhost:9099");

const db = getDatabase();
connectDatabaseEmulator(db, "localhost", 9000);

const storageListAll = async (folder) => {
  // Create a reference under which you want to list
  const listRef = storageRef(storage, folder);
  let array = [];

  await listAll(listRef)
    .then(async (res) => {
      for (let i = 0; i < res.items.length; i++) {
        await getDownloadURL(res.items[i]).then((url) => {
          array.push(url);
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
  return array;
};

function writeNewProduct(data) {
  const productsDataRef = ref(db, "productsData");
  const newProductRef = push(productsDataRef);
  set(newProductRef, data);
}

export { auth, dbFirestore, db, storage, storageListAll, writeNewProduct };
