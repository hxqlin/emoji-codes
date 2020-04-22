import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import EmojiPicker from "./EmojiPicker";

ReactDOM.render(<App />, document.getElementById("root"));

const setupEmojiPicker = () => {
  const chat = document.querySelector('div[role="main"]');
  chat.style.position = "relative";

  const emojiContainer = document.createElement("div");
  emojiContainer.classList.add("emoji-container");

  const editor = document.querySelector("div[contenteditable=true]");

  chat.appendChild(emojiContainer);
  ReactDOM.render(<EmojiPicker editor={editor} />, emojiContainer);
};

window.addEventListener("load", setupEmojiPicker);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
