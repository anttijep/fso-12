import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";


describe("<Blog /> test", () => {
  let renderres;
  let handleDelete = () => {};
  const blog = {
    title: "testtitle",
    author: "testauthor",
    url: "testurl.url",
    likes: 1337,
    user: {
      username: "testusername",
      name: "testname",
      id: "testuserid"
    },
    id: "testid"
  };
  let canDelete = false;
  const mockHandler = jest.fn();
  beforeEach(() => {
    renderres = render(
      <Blog blog={blog} onLike={mockHandler} onDelete={handleDelete} isDeletable={canDelete} id="blogtest">
      </Blog>
    );
  });
  test("blog initial test", async () => {
    let elem = await screen.findByText(`${blog.title} ${blog.author}`);
    expect(elem).toBeDefined();
    elem = screen.queryByText(blog.url);
    expect(elem).toBeNull();
    elem = screen.queryByText("likes " + blog.likes);
    expect(elem).toBeNull();
  });
  test("show url and likes after click", async () => {
    const user = userEvent.setup();
    const button = renderres.container.querySelector("#" + blog.id + "show");
    await user.click(button);
    let elem = screen.queryByText(blog.url);
    expect(elem).not.toBeNull();
    elem = screen.queryByText("likes "+ blog.likes);
    expect(elem).not.toBeNull();
  });
  test("like twice", async () => {
    const user = userEvent.setup();
    let button = renderres.container.querySelector("#" + blog.id + "show");
    await user.click(button);
    button = screen.getByText("like");
    await user.click(button);
    await user.click(button);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});


