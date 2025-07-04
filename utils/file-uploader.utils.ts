import { storage } from "../config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const handleFileUpload = async (file: any, name: string, callback: any) => {
	if (!file) {
		alert("Please upload an image first!");
	}
	const storageRef = ref(storage, `/files/${name}`); // progress can be paused and resumed. It also exposes progress updates. // Receives the storage reference and the file to upload.
	const uploadTask = uploadBytesResumable(storageRef, file);
	uploadTask.on(
		"state_changed",
		(snapshot) => {
			const percent = Math.round(
				(snapshot.bytesTransferred / snapshot.totalBytes) * 100
			); // update progress
			console.log("upload percent", percent);
		},
		(err) => {
			console.log("err", err);
			callback(false, err);
		},
		() => {
			// download url
			getDownloadURL(uploadTask.snapshot.ref).then((url) => {
				console.log(url);
				callback(true, url);
			});
		}
	);
};
