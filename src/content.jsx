import React from "react";
import ReactDOM from "react-dom";
import EmojiPicker from "./EmojiPicker";
import "./App.less";

const setupEditorTracker = () => {
  const chat = document.querySelector('div[role="main"]');
  chat.style.position = "relative";

  const emojiContainer = document.createElement("div");
  emojiContainer.classList.add("emoji-container");

  const editor = document.querySelector(
    "div[contenteditable=true][role=combobox]"
  );

  chat.appendChild(emojiContainer);
  ReactDOM.render(<EmojiPicker chat={chat} editor={editor} />, emojiContainer);
};

window.addEventListener("load", setupEditorTracker);
