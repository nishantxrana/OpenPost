import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Spinner,
  TextInput,
} from "flowbite-react";
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
import { CiWarning } from "react-icons/ci";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch } from "react-redux";
import {
  updateError,
  updateStart,
  updateSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserError,
  logout,
} from "../app/user/userSlice.js";
import { Link } from "react-router-dom";

function DashboardProfile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const fileUplaodComponentRef = useRef();
  const dispatch = useDispatch();
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState("");
  const [formData, setFormData] = useState({});
  const [successMessage, setsuccessMessage] = useState(null);
  const [errorMessage, seterrorMessage] = useState(null);
  const [imageUploading, setImageUploading] = useState(true);
  const [showModal, setshowModal] = useState(false);

  // changing form data
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
    seterrorMessage(null);
    setsuccessMessage(null);
  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (Object.keys(formData).length === 0) {
      seterrorMessage("No changes were made");
      setTimeout(() => {
        seterrorMessage(null);
      }, 3000);
      return;
    }
    const hasChanges = Object.values(formData).some((value) => value !== "");

    if (!hasChanges) {
      seterrorMessage("all feilds are missing");
      setTimeout(() => {
        seterrorMessage(null);
      }, 3000);
      return;
    }
    try {
      dispatch(updateStart());
      const data = await fetch(`/api/users/update/${currentUser.rest._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const res = await data.json();
      if (!data.ok) {
        seterrorMessage(res.message);
        setTimeout(() => {
          seterrorMessage(null);
        }, 3000);
        dispatch(updateError(res.message));
      } else {
        // console.log(formData);
        setsuccessMessage("update successfully");
        setTimeout(() => {
          setsuccessMessage(null);
        }, 3000);
        dispatch(updateSuccess(res));
      }
    } catch (error) {
      seterrorMessage(error.message);
      setTimeout(() => {
        seterrorMessage(null);
      }, 3000);
      dispatch(updateError(error.message));
    }
  };

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
  const uploadImageToFirebase = async () => {
    // set errror message to null during upload
    // set progress to 0 during upload
    setFileUploadProgress(null);

    const firebaseStorage = getStorage(app);
    if (imageFile) {
      setImageUploading(false);
      const imageName = new Date().getTime() + imageFile.name;
      const imageRef = ref(firebaseStorage, imageName);
      const uploadTask = uploadBytesResumable(imageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadProgress(progress.toFixed(0));
          setFileUploadError(null);
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
              setImageUploading(true);
              setFormData({ ...formData, profilePic: firebaseDownloadURL });
            }
          );
        }
      );
    }
  };
  useEffect(() => {
    uploadImageToFirebase();
  }, [imageFile]);

  const handleDeleteUser = async () => {
    setshowModal(false);

    try {
      dispatch(deleteUserStart());
      const data = await fetch(`/api/users/delete/${currentUser.rest._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const res = await data.json();
      if (!data.ok) {
        seterrorMessage(res.message);
        setTimeout(() => {
          seterrorMessage(null);
        }, 3000);
        dispatch(deleteUserError(res.message));
      } else {
        dispatch(deleteUserSuccess(res));
      }
    } catch (error) {
      seterrorMessage(error.message);
      setTimeout(() => {
        seterrorMessage(null);
      }, 3000);
      dispatch(deleteUserError(error.message));
    }
  };

  const handleLogOut = async () => {
    try {
      const data = await fetch("/api/users/logout", {
        method: "POST",
      });
      const res = await data.json();
      if (data.ok) {
        dispatch(logout());
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col s mx-auto mt-16 ">
      <span className=" self-center">Profile</span>
      <form
        onSubmit={handleFormSubmit}
        className="flex self-center flex-col gap-4 min-w-80 "
      >
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
          onChange={handleChange}
        />
        <TextInput
          disabled
          type="email"
          placeholder="email"
          defaultValue={currentUser.rest.email}
          id="username"
        />
        <TextInput
          type="text"
          placeholder="Change password"
          id="password"
          onChange={handleChange}
        />
        <Button
          disabled={!imageUploading}
          type="submit"
          gradientDuoTone="purpleToBlue"
        >
          {!imageUploading ? (
            <>
              <Spinner className="mr-3" color={"warning"} size="sm" />
              Loading...
            </>
          ) : (
            "Update"
          )}
        </Button>
        {currentUser.rest.isAdmin && (
          <Link to={'/createPost'}>
            <Button type="button" className="w-full" gradientDuoTone="purpleToBlue" outline>
              Create a post
            </Button>
          </Link>
        )}
      </form>
      <div className="flex justify-between text-red-400 mt-3">
        <span className=" cursor-pointer" onClick={() => setshowModal(true)}>
          Delete Account
        </span>
        <span onClick={handleLogOut} className=" cursor-pointer">
          Sign Out
        </span>
      </div>
      {errorMessage && (
        <Alert className="mt-4" color={"failure"}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert className="mt-4" color={"success"}>
          {successMessage}
        </Alert>
      )}
      <Modal
        show={showModal}
        onClose={() => setshowModal(false)}
        popup
        size="md"
      >
        <ModalHeader className=" w-full  bg-red-50">Warning</ModalHeader>
        <ModalBody className="mt-4 flex flex-col items-center">
          <CiWarning className=" text-5xl text-gray-500 mb-6" />
          <span className=" text-center">
            Are you sure you want to{" "}
            <span className=" text-red-400">delete</span> your account?
          </span>
        </ModalBody>
        <div className="flex justify-center gap-16 mt-4 mb-4">
          <Button color={"failure"} onClick={handleDeleteUser}>
            <span>Delete</span>
          </Button>
          <Button onClick={() => setshowModal(false)} color={"dark"}>
            <span>Cancel</span>
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default DashboardProfile;
