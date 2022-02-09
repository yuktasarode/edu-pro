import { initializeApp } from "firebase/app";

//import firebase from "firebase";
//import * as firebase from 'firebase';

import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

var config = {
  apiKey: "AIzaSyA_vnSOZP0XCHe1JD_Pj3jwKOnZMkCbiS8",
  authDomain: "exceled-61aed.firebaseapp.com",
  databaseURL: "https://exceled-61aed-default-rtdb.firebaseio.com",
  projectId: "exceled-61aed",
  storageBucket: "exceled-61aed.appspot.com",
  messagingSenderId: "382192921219"
};

var fire = initializeApp(config);
//export default fire;

// if (!firebase.apps.length) {
//   //initializing with the config object
//   firebase.initializeApp(config);
// }

//separting database API and authentication
const db = firebase.database();
const auth = firebase.auth();

const facebookProvider = new firebase.auth.FacebookAuthProvider();

export { db, auth, facebookProvider, fire };
