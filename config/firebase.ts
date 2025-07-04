// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import getConfig from "next/config";
import { getStorage } from "firebase/storage";
const {
	publicRuntimeConfig: {
		rootUrl,
		apiKey,
		authDomain,
		projectId,
		storageBucket,
		messagingSenderId,
		appId,
		measurementId,
	},
} = getConfig();

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey,
	authDomain,
	projectId,
	storageBucket,
	messagingSenderId,
	appId,
	measurementId,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
