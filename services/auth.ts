import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signInWithPopup,
	GoogleAuthProvider,
	FacebookAuthProvider,
	EmailAuthProvider,
	linkWithPopup,
	linkWithCredential,
	unlink,
} from "firebase/auth";
import { auth } from "../config/firebase";

export const registerWithFirebaseCredentials = async (
	email: string,
	password: string
) => {
	const userCredential = await createUserWithEmailAndPassword(
		auth,
		email,
		password
	);

	return userCredential;
};

export const signInWithFirebaseCredentials = async (
	email: string,
	password: string
) => {
	const userCredential = await signInWithEmailAndPassword(
		auth,
		email,
		password
	);

	return userCredential;
};

export const signInWithGoogle = async () => {
	const provider = new GoogleAuthProvider();
	const auth = getAuth();
	try {
		const response = await signInWithPopup(auth, provider);
		const credential = GoogleAuthProvider.credentialFromResult(response);
		const token = credential?.accessToken;
		const user = response.user;
		return user;
	} catch (error: any) {
		const errorCode = error.code;
		const errorMessage = error.message;
		console.log("errorMessage", errorMessage);
		const email = error.customData.email;
		const credential = GoogleAuthProvider.credentialFromError(error);
	}
};

//TODO: Need to add the project to the facebook for devs platform.
export const signInWithFacebook = async () => {
	const provider = new FacebookAuthProvider();
	const auth = getAuth();
	try {
		const response = await signInWithPopup(auth, provider);
		const credential = FacebookAuthProvider.credentialFromResult(response);
		const accessToken = credential?.accessToken;
		const user = response.user;
	} catch (error: any) {
		const errorCode = error.code;
		const errorMessage = error.message;
		const email = error.customData.email;
		const credential = GoogleAuthProvider.credentialFromError(error);
	}
};

export const linkWithGoogle = async (): Promise<any> => {
	console.log("linkWithGoogle");
	const provider = new GoogleAuthProvider();
	const auth:any = getAuth();
	try {
		return linkWithPopup(auth.currentUser, provider).then(async (result) => {
			// Accounts successfully linked.
			const user = result.user;
			const providers = user.providerData;
			if (providers && providers.length) {
				let response = {};
				
				for (let i = 0; i < providers.length; i++) {
					const provider = providers[i];
					if (provider.providerId == "google.com") {
						if (auth.currentUser.email == provider.email) {
							response = {success: true, data: user};
						} else {
							response = await unlinkProvider(auth.currentUser, provider.providerId);
						}
					} 
				}
				return response;
			}
		}).catch((error) => {
			console.log("error", error);
			return {success: false, data: error.message};
		});
	} catch (error: any) {
		const errorMessage = error.message;
		console.log("errorMessage", errorMessage);
		return { success: false, data: error.message };
	}
};

export const unlinkWithGoogle = async () => {
	console.log("unlinkWithGoogle");
	const provider = new GoogleAuthProvider();
	const auth = getAuth();
	try {
		return unlinkProvider(auth.currentUser, provider.providerId);
	} catch (error: any) {
		const errorMessage = error.message;
		console.log("errorMessage", errorMessage);
		return { success: false, data: error.message };
	}
};

export const unlinkWithEmail = async () => {
	console.log("unlinkWithEmail");
	const provider = new EmailAuthProvider();
	const auth = getAuth();
	try {
		return unlinkProvider(auth.currentUser, provider.providerId);
	} catch (error: any) {
		const errorMessage = error.message;
		console.log("errorMessage", errorMessage);
		return { success: false, data: error.message };
	}
};

export const linkWithEmail = async (email: string, password: string): Promise<any> => {
	console.log("linkWithEmail");
	const auth:any = getAuth();
	if (auth.currentUser?.email != email) {
		return {success: false, data: "email does not match."};
	}
	
	try {
		const credential = EmailAuthProvider.credential(email, password);
		return linkWithCredential(auth.currentUser, credential)
			.then(async (usercred) => {
				const user = usercred.user;
				const providers = user.providerData;
				if (providers && providers.length) {
					let response = {};
					
					for (let i = 0; i < providers.length; i++) {
						const provider = providers[i];
						console.log(provider.email);
						if (provider.providerId == "password") {
							if (auth.currentUser.email == provider.email) {
								response = {success: true, data: user};
							} else {
								response = await unlinkProvider(auth.currentUser, provider.providerId);
							}
						} 
					}
					return response;
				}
			})
			.catch((error) => {
				console.log("Account linking error", error);
				return { success: false, data: error.message };
			});
	} catch (error: any) {
		const errorMessage = error.message;
		console.log("errorMessage", errorMessage);
		return { success: false, data: error.message };
	}
};

const unlinkProvider = async (user: any, providerId: string) => {
	return unlink(user, providerId)
		.then(() => {
			// Auth provider unlinked from account
			return { success: false, data: "email does not match." };
		})
		.catch((error) => {
			console.log("error", error);
			return { success: false, data: error.message };
		});
};
