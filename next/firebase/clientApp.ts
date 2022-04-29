import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

initializeApp({
  apiKey: "AIzaSyAhxPUggAl2mzhsVYj5lYKxSeHBQvZ1QMY",
  authDomain: "helloportfol-io.firebaseapp.com",
  projectId: "helloportfol-io",
  storageBucket: "helloportfol-io.appspot.com",
  messagingSenderId: "1047286870694",
  appId: "1:1047286870694:web:1b048525e20dc8b574ba67",
});

const firestore = getFirestore();
export { firestore };
