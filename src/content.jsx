import React from "react";
import ReactDOM from "react-dom";
import EmojiPicker from "./EmojiPicker";
import "./App.less";

/*
 * Injects an emoji picker into the current conversation.
 */
const injectEmojiPicker = () => {
  setTimeout(() => {
    const chat = document.querySelector('div[role="main"]');
    chat.style.position = "relative";

    const emojiContainer = document.createElement("div");
    emojiContainer.classList.add("emoji-container");

    const editor = document.querySelector(
      "div[contenteditable=true][role=combobox]"
    );

    chat.appendChild(emojiContainer);
    ReactDOM.render(
      <EmojiPicker chat={chat} editor={editor} />,
      emojiContainer
    );
  }, 0);
};

/*
 * Set up an emoji picker for the current conversation and
 * attach listener for changes to the conversation.
 */
const setupEmojiPicker = () => {
  injectEmojiPicker();

  /*
   * When a different conversation is clicked, inject an emoji picker
   * for the selected conversation.
   */
  const conversations = document.querySelector('div[role="main"]')
    .previousSibling;
  conversations.addEventListener("click", injectEmojiPicker);
};

window.addEventListener("load", setupEmojiPicker);
