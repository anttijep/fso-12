const dummy = () => {
  return 1;
};

const totalLikes = blogs => blogs.reduce((p, n) => p + n.likes, 0);

const favoriteBlog = blogs => {
  if (blogs.length === 0) return {};
  return blogs.reduce((p, n) => p.likes < n.likes ? n : p);
};

const parseblogs = (blogs, f) => {
  const bloggers = new Map();
  blogs.forEach(b => bloggers.set(b.author, f(bloggers.get(b.author), b.likes)));
  return [...bloggers.entries()].reduce((p, n) => p[1] < n[1] ? n : p);
};

const mostBlogs = blogs => {
  if (blogs.length === 0) return {};
  const [author, numblogs] = parseblogs(blogs, prev => prev ? prev + 1 : 1);
  return {author, blogs:numblogs};
};

const mostLikes = blogs => {
  if (blogs.length === 0) return {};
  const [author, likes] = parseblogs(blogs, (prev, next) => prev ? prev + next: next);
  return {author, likes};
};

module.exports = {dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes};
