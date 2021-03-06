import React, { Component } from "react";
import { emojiIndex } from "emoji-mart-lite";
import { isWhitespace } from "./Util";
import EmojiList from "./EmojiList.jsx";
import PropTypes from "prop-types";
import "./less/EmojiPicker.less";

const propTypes = {
  editor: PropTypes.object.isRequired,
  parent: PropTypes.object,
};

/**
 * Component that watches for changes in a contenteditable field
 * to show a list of emojis if an emoji code is used.
 */
class EmojiPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cursor: 0,
      activeEmojiIndex: 0,
      text: this.props.editor.textContent,
      emojis: [],
    };

    this.getEmojis = this.getEmojis.bind(this);
    this.onEmojiClick = this.onEmojiClick.bind(this);
    this.onEmojiHover = this.onEmojiHover.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
    this.isInEmojiCode = this.isInEmojiCode.bind(this);
    this._setupObserver = this._setupObserver.bind(this);
  }

  componentDidMount() {
    this._setupObserver();

    this.props.editor.addEventListener("keydown", this.onKeyDown);
    this.props.editor.addEventListener("click", this.onEditorChange);
  }

  componentWillUnmount() {
    this.observer.disconnect();

    this.props.editor.removeEventListener("keydown");
    this.props.editor.removeEventListener("click");
  }

  componentDidUpdate() {
    /*
     * If a chat element is provided, the component is being used
     * on Facebook Messenger so the `top` attribute needs to be set
     * relative to other elements on the page and not just the emoji
     * picker height.
     */
    if (this.props.parent) {
      const chatHeight = this.props.parent.clientHeight;
      const emojiPickerHeight = this.emojiPicker.clientHeight;
      const top = chatHeight - emojiPickerHeight - 60;

      if (top !== this.state.top) {
        this.setState({
          top: top,
        });
      }
    } else {
      const height = this.emojiPicker.clientHeight;
      const top = height * -1;

      if (top !== this.state.top) {
        this.setState({
          top: top,
        });
      }
    }
  }

  /**
   * Replaces an emoji code region with an emoji.
   *
   * @param {string} emoji The emoji to replace the emoji code with.
   */
  replaceCode(emoji) {
    this.props.editor.focus();

    const selection = document.getSelection();
    const focusNode = selection.focusNode;
    const text = focusNode.wholeText;

    let startColon;

    for (
      let i = this.isCompleteEmojiCode(this.state.cursor, text)
        ? this.state.cursor - 2
        : this.state.cursor - 1;
      i >= 0;
      i -= 1
    ) {
      if (text.charAt(i) === ":") {
        startColon = i;
        break;
      }
    }

    const range = document.createRange();
    range.setStart(focusNode, startColon);
    range.setEnd(focusNode, this.state.cursor);

    selection.empty();
    selection.addRange(range);

    document.execCommand("insertText", true, emoji);

    this.hideEmojiPicker();
  }

  /**
   * Hides the emoji picker.
   */
  hideEmojiPicker() {
    this.setState({
      activeEmojiIndex: 0,
      emojis: [],
    });
  }

  /**
   * Handler for when an emoji in the emoji list is clicked.
   *
   * @param {Event} e The event that triggered the callback.
   */
  onEmojiClick(e) {
    const emojiIndex = parseInt(e.target.getAttribute("data-index"));
    const emoji = this.state.emojis[emojiIndex].native;

    this.replaceCode(emoji);
  }

  /**
   * Handler for when an emoji in the emoji list is hovered over.
   *
   * @param {Event} e The event that triggered the callback.
   */
  onEmojiHover(e) {
    const emojiIndex = parseInt(e.target.getAttribute("data-index"));

    this.setState({
      activeEmojiIndex: emojiIndex,
    });
  }

  /**
   * Handler for when a key is pressed in the editor.
   *
   * If the emoji picker is visible, pressing the up or down arrow keys
   * will change the currently selected emoji, pressing the escape key
   * will hide the emoji picker, and pressing the enter or tab key will
   * insert the currently selected emoji.
   *
   * If the right or left arrow keys are pressed, the new cursor position
   * and current text content is used to determine whether the emoji picker
   * should be shown.
   *
   * @param {Event} e The event that triggered the callback.
   */
  onKeyDown(e) {
    const isVisible = this.state.emojis.length > 0;

    let newActiveEmojiIndex;

    switch (e.key) {
      case "ArrowUp":
        if (isVisible) {
          e.preventDefault();
          e.stopPropagation();

          if (this.state.activeEmojiIndex === 0) {
            newActiveEmojiIndex = this.state.emojis.length - 1;
          } else {
            newActiveEmojiIndex = this.state.activeEmojiIndex - 1;
          }

          this.setState({
            activeEmojiIndex: newActiveEmojiIndex,
          });
        }
        break;
      case "ArrowDown":
        if (isVisible) {
          e.preventDefault();
          e.stopPropagation();

          if (this.state.activeEmojiIndex === this.state.emojis.length - 1) {
            newActiveEmojiIndex = 0;
          } else {
            newActiveEmojiIndex = this.state.activeEmojiIndex + 1;
          }

          this.setState({
            activeEmojiIndex: newActiveEmojiIndex,
          });
        }
        break;
      case "ArrowLeft":
      case "ArrowRight":
        const selection = document.getSelection();
        let cursor = selection.focusOffset;
        const text = selection.focusNode.wholeText;

        if (e.key === "ArrowLeft") {
          cursor--;
        } else {
          cursor++;
        }

        if (!this.isInEmojiCode(cursor, text)) {
          this.hideEmojiPicker();
        } else {
          this.setState({
            cursor: cursor,
            emojis: this.getEmojis(cursor, text),
          });
        }
        break;
      case "Enter":
      case "Tab":
        if (isVisible) {
          e.preventDefault();
          e.stopPropagation();

          const emoji = this.state.emojis[this.state.activeEmojiIndex].native;
          this.replaceCode(emoji);
        }
      case "Escape":
        if (isVisible) {
          e.preventDefault();
          e.stopPropagation();

          this.hideEmojiPicker();
        }
    }
  }

  /**
   * Get the text to search for an emoji.
   *
   * @param {number} cursor The current cursor position.
   * @param {string} text The text to search.
   * @throws {Error} Will throw an error if the start of the emoji text was
   *                 not found.
   */
  getEmojiText(cursor, text) {
    let emojiStart = null;

    for (let i = cursor - 1; i >= 0; i -= 1) {
      const char = text.charAt(i);

      if (isWhitespace(char)) {
        break;
      } else if (char === ":") {
        if (i === 0 || isWhitespace(text.charAt(i - 1))) {
          emojiStart = i + 1;
        }
      }
    }

    if (emojiStart === null) {
      throw new Error("Start of emoji text was not found");
    }

    const emojiText = text.substring(emojiStart, cursor);

    return emojiText.endsWith(":") ? emojiText.slice(0, -1) : emojiText;
  }

  /**
   * Whether the cursor is positioned after a complete emoji code.
   *
   * Returns true if there is a ":" character followed by some characters
   * and another ":" before the cursor position.
   *
   * @param {number} cursor The current cursor position.
   * @param {string} text The text to search.
   * @returns {boolean}
   */
  isCompleteEmojiCode(cursor, text) {
    return (
      cursor !== 0 &&
      text[cursor - 1] === ":" &&
      this.isInEmojiCode(cursor - 1, text)
    );
  }

  /**
   * Whether the cursor is within a possible emoji code.
   *
   * Returns true if there is a ":" character preceded by whitespace
   * before the cursor position. If there is a ":" at the current
   * cursor position, it's ignored. The whitespace is not required if
   * the cursor is at the beginning of the text.
   *
   * @param {number} cursor The current cursor position.
   * @param {string} text The text to search.
   * @returns {boolean}
   */
  isInEmojiCode(cursor, text) {
    for (let i = cursor - 1; i >= 0; i -= 1) {
      const char = text.charAt(i);

      if (isWhitespace(char)) {
        return false;
      } else if (char === ":") {
        if (i === cursor - 1) {
          continue;
        } else {
          return i === 0 || isWhitespace(text.charAt(i - 1));
        }
      }
    }

    return false;
  }

  /**
   * Gets a list of emojis.
   *
   * Performs an emoji lookup and strips unnecessary properties
   * from the emojis, returning the new objects. If an emoji lookup
   * should not be performed, an empty list is returned.
   *
   * @param {number} cursor The current cursor position.
   * @param {string} text The text to search.
   * @returns {Array<Object>} An array of emoji objects.
   */
  getEmojis(cursor, text) {
    if (this.isInEmojiCode(cursor, text)) {
      const textToSearch = this.getEmojiText(cursor, text);

      if (textToSearch !== ":") {
        const emojis = emojiIndex.search(textToSearch) || [];

        return emojis.map((o) => ({
          id: o.id,
          colons: o.colons,
          native: o.native,
        }));
      }
    }

    return [];
  }

  /**
   * Updates state when the editor changes.
   */
  onEditorChange() {
    const selection = document.getSelection();
    const cursor = selection.focusOffset;
    const text = selection.focusNode.wholeText;
    const emojis = this.getEmojis(cursor, text);

    this.setState({
      cursor: cursor,
      emojis: emojis,
    });

    if (this.isCompleteEmojiCode(cursor, text)) {
      const emojiText = this.getEmojiText(cursor, text);
      const emoji = emojis.find((o) => o.id === emojiText);

      if (emoji) {
        this.replaceCode(emoji.native);
      }
    }
  }

  /**
   * Set up an observer on the editor to watch for changes.
   */
  _setupObserver() {
    const callback = (mutations) => {
      const maybeNewText = mutations[mutations.length - 1].target.textContent;

      if (maybeNewText !== this.state.text) {
        this.onEditorChange();
        this.setState({
          text: maybeNewText,
        });
      }
    };

    this.observer = new MutationObserver(callback.bind(this));

    const configurations = {
      childList: true,
      characterData: true,
      subtree: true,
    };

    this.observer.observe(this.props.editor, configurations);
  }

  render() {
    const showEmojis = this.state.emojis.length > 0;
    const emojiPickerStyle = {
      top: `${this.state.top}px`,
      left: this.props.parent ? "15%" : 0,
    };

    return (
      <div
        className={`emoji-picker ${showEmojis ? "" : "-is-hidden"}`}
        ref={(node) => {
          this.emojiPicker = node;
        }}
        style={emojiPickerStyle}
      >
        {showEmojis && (
          <EmojiList
            activeEmojiIndex={this.state.activeEmojiIndex}
            emojis={this.state.emojis}
            onEmojiClick={this.onEmojiClick}
            onEmojiHover={this.onEmojiHover}
          />
        )}
      </div>
    );
  }
}

EmojiPicker.propTypes = propTypes;

export default EmojiPicker;
