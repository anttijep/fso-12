import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateBlog from "./CreateBlog";



describe("<CreateBlog/> test", () => {
  test("Submit test", async () => {
    const user = userEvent.setup();
    const createBlog = jest.fn();
    render(<CreateBlog onCreateBlog={createBlog}/>);
    const input = screen.getAllByRole("textbox");
    const blog = {
      title: "testtitle",
      author: "testauthor",
      url: "testurl.url",
    };
    await user.type(input[0], blog.title);
    await user.type(input[1], blog.author);
    await user.type(input[2], blog.url);
    const submit = screen.getByText("create");
    await user.click(submit);
    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0]).toContainEqual(blog);
  });
});

