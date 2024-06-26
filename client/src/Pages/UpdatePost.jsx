import {
  Alert,
  Button,
  FileInput,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function UpdatePost() {
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const editorRef = useRef(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [initialEditorContent, setInitialEditorContent] = useState(null);
  const log = () => {
    if (editorRef.current) {
      // console.log(editorRef.current.getContent());
      setFormData({ ...formData, content: editorRef.current.getContent() });
    }
  };
  // console.log(formData);
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await fetch(
          `/api/post/getposts?postId=${postId}&userId=${currentUser._id}`
        );
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        } else {
          setFormData(data.posts[0]);
          setInitialEditorContent(data.posts[0].content);
        }
      } catch (error) {
        setPublishError(error.message);
      }
    };
    fetchPostData();
  }, [postId]);

  const handleImageUpload = async (e) => {
    try {
      if (!imageFile) {
        setImageUploadError("Please select an image");

        return;
      }
      setImageUploadProgress(null);
      const firebaseStorage = getStorage(app);
      const imageName = new Date().getTime() + "-" + imageFile.name;
      const imageRef = ref(firebaseStorage, imageName);
      const uploadTask = uploadBytesResumable(imageRef, imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(error.message);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            (firebaseDownloadURL) => {
              setFormData({ ...formData, image: firebaseDownloadURL });
              setImageUploadError(null);
              setImageUploadProgress(null);
            }
          );
        }
      );
    } catch (error) {
      setImageUploadError(error.message);
    }
  };

  const handleDataSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch(
        `/api/post/updatepost?userId=${currentUser._id}&postId=${formData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setPublishError(null);
        // console.log(data);
        // console.log(data.slug);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError(error.message);
    }
  };
  return (
    <div className=" h-full">
      <h1 className=" text-center text-3xl pt-20 font-semibold text-gray-500">
        Update Post
      </h1>
      <form className=" mx-auto max-w-3xl flex justify-center flex-col mt-10 gap-4 px-5">
        <div className="flex flex-col sm:flex-row flex-1 gap-4">
          <TextInput
            className=" w-full"
            type="text"
            placeholder="Title"
            id="title"
            onChange={(event) =>
              setFormData({ ...formData, title: event.target.value })
            }
            value={formData.title}
          />
          <Select
            value={formData.category}
            onChange={(event) =>
              setFormData({ ...formData, category: event.target.value })
            }
          >
            <option value={"uncategorized"}>Select a Category</option>
            <option value={"tech"}>Tech</option>
            <option value={"Science"}>Science</option>
            <option value={"ai"}>Ai</option>
            <option value={"development"}>Development</option>
          </Select>
        </div>
        <div className="flex gap-4 justify-center border-2  p-3 border-gray-300 rounded-lg ">
          <FileInput
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <Button
            className=" text-nowrap"
            onClick={handleImageUpload}
            type="button"
            gradientDuoTone={"purpleToBlue"}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <>
                {imageUploadProgress}%
                <Spinner size="sm" className="ml-2" />
              </>
            ) : (
              "Upload image"
            )}
          </Button>
        </div>
        {!imageUploadProgress && !imageUploadError && formData.image && (
          <img
            className=" h-60 object-cover self-center"
            src={formData.image}
            alt="uploaded image"
          />
        )}
        {imageUploadError && (
          <Alert color={"failure"}>{imageUploadError}</Alert>
        )}
        <Editor
          initialValue={initialEditorContent}
          onChange={log}
          apiKey="q878nwk9myxanu80k0bo1s13ap6w4wa9dso3rzciguq1de25"
          onInit={(evt, editor) => (editorRef.current = editor)}
          init={{
            mobile: {
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "link",
                "image",
                "lists",
                "charmap",
                "preview",
                "anchor",
                "pagebreak",
                "searchreplace",
                "wordcount",
                "visualblocks",
                "visualchars",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "emoticons",
                "help",
              ],
              toolbar:
                "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              menubar: "file edit view insert format tools table",
            },
            placeholder: "Start typing your amazing content here!",
            height: 400,
            menubar: false,
            selector: "textarea",
            skin: `${theme == "dark" ? "oxide-dark" : "oxide"}`,
            content_css: `${theme}`,
            plugins: [
              "advlist",
              "autolink",
              "link",
              "image",
              "lists",
              "charmap",
              "preview",
              "anchor",
              "pagebreak",
              "searchreplace",
              "wordcount",
              "visualblocks",
              "visualchars",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "emoticons",
              "help",
            ],
            toolbar:
              "undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media | forecolor backcolor emoticons",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            menubar: "file edit view insert format tools table",
          }}
        />
        <Button className="mb-10" color={"dark"} onClick={handleDataSubmit}>
          Update
        </Button>
        {publishError && <Alert color={"failure"}>{publishError}</Alert>}
      </form>
    </div>
  );
}

export default UpdatePost;
