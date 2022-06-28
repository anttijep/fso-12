import { useState } from "react";
import PropTypes from "prop-types";


const Blog = ({ blog, onLike, onDelete, isDeletable }) => {
  const [expand, setExpand] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  };
  const toggle = () => setExpand(!expand);
  const small = () => {
    return (
      <p>
        <label htmlFor={blog.id + "show"}>{blog.title} {blog.author}</label> <button id={blog.id + "show"} onClick={toggle}>show</button>
      </p>
    );
  };
  const deletebutton = (blog) => <button id={blog.id + "remove"} onClick={() => onDelete(blog)}>remove</button>;


  const all = () => {
    return (
      <div className="blogs">
        <div>
          <label htmlFor={blog.id + "hide"}>{blog.title} {blog.author}</label> <button id={blog.id + "hide"} onClick={toggle}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button id={blog.id + "like"} onClick={() => onLike(blog)}>like</button></div>
        <div>{blog.user.name}</div>
        <div>{isDeletable && deletebutton(blog)}</div>
      </div>
    );
  };

  return (
    <div style={blogStyle}>
      {(expand && all()) || small()}
    </div>
  );
};

Blog.propTypes = {
  blog : PropTypes.object.isRequired,
  onLike : PropTypes.func.isRequired,
  onDelete : PropTypes.func.isRequired,
  isDeletable : PropTypes.bool.isRequired
};

export default Blog;