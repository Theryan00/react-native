import * as firebase from 'firebase';
import '@firebase/auth';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDTNN2xnU_gpm4AdlriXjfhQWhWGs206pk",
    authDomain: "hexoft-rms.firebaseapp.com",
    databaseURL: "https://hexoft-rms.firebaseio.com",
    projectId: "hexoft-rms",
    storageBucket: "hexoft-rms.appspot.com",
    messagingSenderId: "390077080883",
    appId: "1:390077080883:web:934a8bc746be182b70ca46",
    measurementId: "G-CM655B0KM7"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase };