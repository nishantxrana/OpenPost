import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Project from "./Pages/Project";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import Header from "./components/Header";
import PrivateMask from "./components/PrivateMask";
import AdminOnlyPrivateMask from "./components/AdminOnlyPrivateMask";
import CreatePost from "./Pages/CreatePost";
import UpdatePost from "./Pages/UpdatePost";
import PostPage from "./Pages/PostPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/project" element={<Project />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<PrivateMask />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/updatepost/:postId" element={<UpdatePost />} />
        </Route>
        <Route element={<AdminOnlyPrivateMask />}>
          <Route path="/createPost" element={<CreatePost />} />
        </Route>
        <Route path="/post/:slug" element={<PostPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
