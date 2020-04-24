import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import EmojiPicker from "./EmojiPicker";

ReactDOM.render(<App />, document.getElementById("root"));

const setupEmojiPicker = () => {
  const currentMessage = document.querySelector(
    "div[aria-label='New message']"
  );

  const emojiContainer = document.createElement("div");
  emojiContainer.classList.add("emoji-container");

  const editor = document.querySelector(
    "div[contenteditable=true][role=combobox]"
  );

  currentMessage.appendChild(emojiContainer);
  ReactDOM.render(
    <EmojiPicker editor={editor} parent={currentMessage} />,
    emojiContainer
  );
};

window.addEventListener("load", setupEmojiPicker);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
