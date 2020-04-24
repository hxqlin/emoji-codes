import React from "react";
import ReactDOM from "react-dom";
import EmojiPicker from "./EmojiPicker";

/*
 * Appends an emoji picker to a node.
 *
 * This function should be called with a node matching the selector
 * "div[aria-label='New message']" for a Messenger conversation or
 * a child of "[id=ChatTabsPagelet]" with class name "opened" for a
 * Facebook chat tab.
 */
const injectEmojiPicker = (parent) => {
  const emojiContainer = document.createElement("div");
  emojiContainer.classList.add("emoji-container");
  parent.appendChild(emojiContainer);

  const editor = document.querySelector(
    "div[contenteditable=true][role=combobox]"
  );

  ReactDOM.render(
    <EmojiPicker editor={editor} parent={parent} />,
    emojiContainer
  );
};

/*
 * Set up emoji pickers for Messenger.
 *
 * Injects an emoji picker into the current conversation and attaches
 * a listener for clicks on the conversation list to inject additional
 * emoji pickers if the current conversation changes.
 */
const setupMessengerEmojiPicker = () => {
  const currentMessage = document.querySelector(
    "div[aria-label='New message']"
  );
  injectEmojiPicker(currentMessage);

  const conversations = document.querySelector(
    "ul[aria-label='Conversation List'"
  );

  conversations.addEventListener("click", () => {
    setTimeout(() => {
      const newMessage = document.querySelector(
        "div[aria-label='New message']"
      );
      injectEmojiPicker(newMessage);
    }, 0);
  });
};

/*
 * Set up emoji pickers for chat tabs on Facebook.
 *
 * Attaches a listener to the chat tabs so that when one is opened, an
 * emoji picker is attached.
 */
const setupChatTabEmojiPicker = () => {
  const chatTabs = document.querySelector("[id=ChatTabsPagelet]");

  const callback = (mutations) => {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (node.classList.contains("opened")) {
          injectEmojiPicker(node);
        }
      }
    }
  };

  const observer = new MutationObserver(callback);
  const configurations = {
    childList: true,
    subtree: true,
  };

  observer.observe(chatTabs, configurations);
};

const facebookRegex = /https:\/\/www.facebook.com\/*/;
const messengerRegex1 = /https:\/\/www.facebook.com\/messages\/*/;
const messengerRegex2 = /https:\/\/www.messenger.com\/*/;
const href = window.location.href;

if (messengerRegex1.test(href) || messengerRegex2.test(href)) {
  window.addEventListener("load", setupMessengerEmojiPicker);
} else if (facebookRegex.test(href)) {
  window.addEventListener("load", setupChatTabEmojiPicker);
} else {
  throw new Error("Content script should not be running on this page");
}
