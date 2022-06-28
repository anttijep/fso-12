import { useState, useImperativeHandle, forwardRef } from "react";

const Toggleable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);
  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };
  const toggleVisibility = () => {
    setVisible(!visible);
  };
  const Hide = () => setVisible(false);
  useImperativeHandle(ref, () => {return { Hide };});
  return (
    <div>
      <div style={hideWhenVisible}>
        <button id="toggleshow" onClick={toggleVisibility}>show</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>hide</button>
      </div>
    </div>
  );
});


Toggleable.displayName = "Toggleable";
export default Toggleable;
