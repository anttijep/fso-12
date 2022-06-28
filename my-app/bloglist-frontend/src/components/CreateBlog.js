import { useState } from "react";

import PropTypes from "prop-types";

const CreateBlog = ({ onCreateBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const handleCreate = async e => {
    e.preventDefault();
    if (await onCreateBlog({ title, author, url })) {
      setTitle("");
      setAuthor("");
      setUrl("");
    }
  };
  return (
    <form onSubmit={handleCreate}>
      <div>
      title <input id="ctitle" type="text" value={title} name="Title" onChange={({ target }) => setTitle(target.value)}/>
      </div>
      <div>
      author <input id="cauthor" type="text" value={author} name="Author" onChange={({ target }) => setAuthor(target.value)}/>
      </div>
      <div>
      url <input id="curl" type="text" value={url} name="Url" onChange={({ target }) => setUrl(target.value)}/>
      </div>
      <button id="csubmit" type="submit">create</button>
    </form>
  );
};

CreateBlog.propTypes = {
  onCreateBlog : PropTypes.func.isRequired
};

export default CreateBlog;


