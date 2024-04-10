import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function DashboardProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const fileUplaodComponentRef = useRef();
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);

  // create a component that will be used to display the image file and set the image file url
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const fileUrl = URL.createObjectURL(file);
      setImageFileUrl(fileUrl);
    }
  };

  // uploading on firebase
  const uploadImageToFirebase = async (event) => {
    // set errror message to null during upload
    setFileUploadError(null);
    // set progress to 0 during upload
    setFileUploadProgress(null);

    const firebaseStorage = getStorage(app);
    if (imageFile) {
      const imageName = new Date().getTime() + imageFile.name;
      const imageRef = ref(firebaseStorage, imageName);
      const uploadTask = uploadBytesResumable(imageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setFileUploadError("Image upload failed (max file size: 2Mb)");
          setImageFile(null);
          setImageFileUrl(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            (firebaseDownloadURL) => {
              setImageFileUrl(firebaseDownloadURL);
            }
          );
        }
      );
    }
  };
  useEffect(() => {
    uploadImageToFirebase();
  }, [imageFile]);

  return (
    <div className="flex flex-col s mx-auto mt-16 ">
      <span className=" self-center">Profile</span>
      <form className="flex self-center flex-col gap-4 min-w-80 ">
        <div
          className=" relative  rounded-full self-center h-32 w-32"
          onClick={() => fileUplaodComponentRef.current.click()}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
            ref={fileUplaodComponentRef}
          />
          {fileUploadProgress && (
            <CircularProgressbar
              strokeWidth={4}
              text={`${fileUploadProgress}%`}
              value={fileUploadProgress}
              styles={{
                root: {
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: ` rgba(69, 116,227, ${fileUploadProgress / 100})`,
                },
                text: {
                  fontSize: "14px",
                  fontWeight: "bold",
                  fill: "#4574E3",
                },
                
              }}
            />
          )}
          <img
            className={`mx-auto cursor-pointer object-cover w-full h-full rounded-full border-gray-400 border-4 {${
              fileUploadProgress < 100 && " opacity-80"
            }`}
            src={imageFileUrl || currentUser.rest.profilePic}
            alt="user"
          />
        </div>
        {fileUploadError && <Alert color={"failure"}>{fileUploadError}</Alert>}
        <TextInput
          type="text"
          placeholder="Username"
          defaultValue={currentUser.rest.username}
          id="username"
        />
        <TextInput
          disabled
          type="email"
          placeholder="email"
          defaultValue={currentUser.rest.email}
          id="username"
        />
        <TextInput type="text" placeholder="Change password" id="password" />
        <Button type="submit" gradientDuoTone="purpleToBlue">
          Update
        </Button>
      </form>
      <div className="flex justify-between text-red-400 mt-3">
        <span>Delete Account</span>
        <span>Sign Out</span>
      </div>
    </div>
  );
}

export default DashboardProfile;
