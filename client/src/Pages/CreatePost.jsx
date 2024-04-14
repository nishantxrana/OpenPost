import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

function CreatePost() {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  return (
    <div className=" h-screen">
      <h1 className=" text-center text-3xl mt-5 font-semibold text-gray-600">
        Create Post
      </h1>
      <form className=" mx-auto max-w-3xl flex justify-center flex-col mt-10 gap-4 px-5">
        <div className="flex flex-col sm:flex-row flex-1 gap-4">
          <TextInput
            className=" w-full"
            type="text"
            placeholder="Title"
            id="title"
          />
          <Select>
            <option value={"uncategorized"}>Select a Category</option>
            <option value={"tech"}>Tech</option>
            <option value={"Science"}>Science</option>
            <option value={"ai"}>Ai</option>
            <option value={"development"}>Development</option>
          </Select>
        </div>
        <div className="flex gap-4 justify-center border-2  p-3 border-gray-300 rounded-lg ">
          <FileInput accept="image/*" />
          <Button type="button" gradientDuoTone={"purpleToBlue"} outline>
            Upload image
          </Button>
        </div>
        <Editor
          apiKey="q878nwk9myxanu80k0bo1s13ap6w4wa9dso3rzciguq1de25"
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue="<p>This is the initial content of the editor.</p>"
          
          
          init={{
            height: 400,
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
          }}
        />
        <Button className="mb-10" color={"dark"} onClick={log}>
          Publish
        </Button>
      </form>
    </div>
  );
}

export default CreatePost;
