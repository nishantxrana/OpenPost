import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Posts from "./Pages/AllPosts";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import Header from "./components/Header";
import PrivateMask from "./components/PrivateMask";
import AdminOnlyPrivateMask from "./components/AdminOnlyPrivateMask";
import CreatePost from "./Pages/CreatePost";
import UpdatePost from "./Pages/UpdatePost";
import PostPage from "./Pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./Pages/Search";

function App() {
  return (
    <BrowserRouter>
    <ScrollToTop/>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/posts" element={<Posts />} />
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
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
