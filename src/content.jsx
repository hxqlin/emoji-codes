import React from "react";
import ReactDOM from "react-dom";
import EmojiContainer from "./EmojiContainer";
import "./App.less";

const setupEditorTracker = () => {
  const chat = document.querySelector('div[role="main"]');
  const emojiContainer = document.createElement("div");
  const editor = document.querySelector("div[contenteditable=true]");

  chat.appendChild(emojiContainer);
  ReactDOM.render(<EmojiContainer editor={editor} />, emojiContainer);
};

window.addEventListener("load", setupEditorTracker);
