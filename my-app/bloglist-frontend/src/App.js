import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import CreateBlog from "./components/CreateBlog";
import Toggleable from "./components/Toggleable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const Message = ({msg, style}) => {
  style = style || {color:"green"};
  if (msg) {
    return (
      <p id="message" style={style}>{msg}</p>
    );
  }
  return <></>;
};


const sortfunc = (b, b2) => {
  return b2.likes - b.likes;
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 4000);
  };
  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort(sortfunc);
      setBlogs( blogs );
    });
  }, []);
  useEffect(() => {
    const u = window.localStorage.getItem("user");
    if (u) {
      const usr = JSON.parse(u);
      setUser(usr);
      blogService.setToken(usr.token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const ret = await loginService.login({ username, password });
      setUser(ret);
      blogService.setToken(ret.token);
      window.localStorage.setItem("user", JSON.stringify(ret));
      setPassword("");
      setUsername("");
    }
    catch (exp) {
      showMessage("wrong username or password");
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("user");
    blogService.setToken(null);
  };

  const toggleHideRef = useRef();

  const handleCreate = async (blog) => {
    try {
      const resp = await blogService.create(blog);
      const updblogs = blogs.concat(resp);
      updblogs.sort(sortfunc);
      setBlogs(updblogs);
      showMessage(`a new blog ${resp.title} by ${resp.author} added`);
      toggleHideRef.current.Hide();
      return true;
    }
    catch (exp) {
      showMessage(`Failed to add new blog ${exp.response.data.error}`);
      return false;
    }
  };

  const handleLike = async (blog) => {
    try {
      ++blog.likes;
      const resp = await blogService.update(blog);
      const updblogs = [...blogs].filter(b => b.id !== blog.id);
      updblogs.push(resp);
      updblogs.sort(sortfunc);
      setBlogs(updblogs);
    }
    catch (exp) {
      showMessage(`Failed to like blog ${blog.title}`);
      if (exp.response.status === 404) {
        setBlogs(blogs.filter(b => b.id !== blog.id));
      }
    }
  };

  const handleDelete = async (blog) => {
    try {
      if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
        return;
      }
      await blogService.deleteblog(blog);
      setBlogs(blogs.filter(b => b.id !== blog.id));
      showMessage(`Deleted blog ${blog.title} by ${blog.author}`);
    }
    catch (exp) {
      showMessage(`Failed to delete blog ${blog.title}`);
      if (exp.response.status === 404) {
        setBlogs(blogs.filter(b => b.id !== blog.id));
      }
    }
  };

  if (user) {
    return (
      <div>
        <h2>blogs</h2>
        <Message msg={message}/>
        <p>{user.name} logged in<button onClick={handleLogout}>logout</button></p>
        <h3>create new</h3>
        <Toggleable ref={toggleHideRef}>
          <CreateBlog onCreateBlog={handleCreate}/>
        </Toggleable>
        <div>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} onLike={handleLike} onDelete={handleDelete} isDeletable={user.id === blog.user.id}/>
          )}
        </div>
      </div>
    );
  }
  return (
    <div>
      <h1>Login</h1>
      <Message msg={message} style={{color:"red"}}/>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="loginbutton" type="submit">login</button>
      </form>
    </div>
  );
};

export default App;
