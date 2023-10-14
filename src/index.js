import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCSiWAG1iL-EkgzXM9Y3DcmCz443IQ2OaA",
    authDomain: "fir-mn-12.firebaseapp.com",
    projectId: "fir-mn-12",
    storageBucket: "fir-mn-12.appspot.com",
    messagingSenderId: "884464379070",
    appId: "1:884464379070:web:e66d37ca8a6501dca2eaef",
};

// Init firebase app
const app = initializeApp(firebaseConfig);

// Init services
const db = getFirestore(app);
const auth = getAuth();

// Collection Ref
const colRef = collection(db, "book");

// Queries
const q = query(
    colRef,
    // where("author", "==", "Muhammed Nget"),
    orderBy("createdAt", "desc")
);

// Get collection data
// const result = await getDocs(colRef);
// const array = [];
// result.docs.forEach(doc => array.push({ ...doc.data(), id: doc.id }));
// console.log(array);

// Real time collection data
const unSubCol = onSnapshot(q, snapshot => {
    const array = [];
    snapshot.docs.forEach(doc => array.push({ ...doc.data(), id: doc.id }));
    console.log(array);
});

// Add Book Document
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", async e => {
    e.preventDefault();

    const book = await addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp(),
    });
    addBookForm.reset();
});

// Deleting Document
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", async e => {
    e.preventDefault();

    try {
        const docRef = doc(db, "book", deleteBookForm.id.value);
        await deleteDoc(docRef);
        deleteBookForm.reset();
    } catch (error) {
        console.log(error.message);
    }
});

// Get single document
const docRef = doc(db, "book", "taVgXA1AmC4jOsX7qqPj");

const unSubDoc = onSnapshot(docRef, doc => {
    console.log(doc.data(), doc.id);
});

// Signing users up
const signupForm = document.querySelector(".signup");
signupForm.addEventListener("submit", async e => {
    e.preventDefault();

    try {
        const email = signupForm.email.value;
        const password = signupForm.password.value;

        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        console.log(credential.user);
        signupForm.reset();
    } catch (error) {
        console.log(error.message);
    }
});

// Loging in and out
const logoutButton = document.querySelector(".logout");
logoutButton.addEventListener("click", async e => {
    e.preventDefault();

    try {
        await signOut(auth);
        console.log("User signout");
    } catch (error) {
        console.log(error.message);
    }
});

const loginForm = document.querySelector(".login");
loginForm.addEventListener("submit", async e => {
    e.preventDefault();

    try {
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        const credential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
        console.log(credential.user);
        loginForm.reset();
    } catch (error) {
        console.log(error.message);
    }
});

// Subscribing to auth changes
const unSubAuth = onAuthStateChanged(auth, async user => {
    console.log("User state changed: ", user);
});

// Unsubscribing from changes (db and auth)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
    console.log("Unsubscribing ");
    unSubCol();
    unSubDoc();
    unSubAuth();
});
