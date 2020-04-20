import React, { Component } from "react";
import { emojiIndex } from "emoji-mart-lite";
import { isWhitespace } from "./Util";
import EmojiList from "./EmojiList.jsx";
import PropTypes from "prop-types";

const propTypes = {
  editor: PropTypes.object.isRequired,
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
    this.shouldSearchEmojis = this.shouldSearchEmojis.bind(this);
    this._setupObserver = this._setupObserver.bind(this);
  }

  componentDidMount() {
    this._setupObserver();
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  componentDidUpdate() {
    const height = this.emojiPicker.clientHeight;
    const top = height * -1;

    if (top !== this.state.top) {
      this.setState({
        top: top,
      });
    }
  }

  /**
   * Handler for when an emoji in the emoji list is clicked.
   *
   * @param {Event} e The event that triggered the callback.
   */
  onEmojiClick(e) {
    this.props.editor.focus();

    const selection = document.getSelection();
    const focusNode = selection.focusNode;
    const text = focusNode.wholeText;

    let startColon;

    for (let i = this.state.cursor - 1; i >= 0; i -= 1) {
      if (text.charAt(i) === ":") {
        startColon = i;
        break;
      }
    }

    const emojiIndex = parseInt(e.target.getAttribute("data-index"));
    const emoji = this.state.emojis[emojiIndex].native;

    const range = document.createRange();
    range.setStart(focusNode, startColon);
    range.setEnd(focusNode, this.state.cursor);

    selection.empty();
    selection.addRange(range);

    document.execCommand("insertText", true, emoji + " ");

    this.setState({
      emojis: [],
    });
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
   * Get the text to search for an emoji.
   *
   * @param {number} cursor The current cursor position.
   * @param {string} text The text to search.
   */
  getEmojiText(cursor, text) {
    let emojiStart = 0;

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

    return text.substring(emojiStart, cursor);
  }

  /**
   * Whether an emoji lookup should be performed.
   *
   * An emoji lookup should be performed if there is a ":" character
   * preceded by whitespace before the cursor position. The whitespace
   * is not required if the cursor is at the beginning of the text.
   *
   * @param {number} cursor The current cursor position.
   * @param {string} text The text to search.
   * @returns {boolean} Whether to perform an emoji lookup.
   */
  shouldSearchEmojis(cursor, text) {
    for (let i = cursor - 1; i >= 0; i -= 1) {
      const char = text.charAt(i);

      if (isWhitespace(char)) {
        return false;
      } else if (char === ":") {
        return i === 0 || isWhitespace(text.charAt(i - 1));
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
    if (this.shouldSearchEmojis(cursor, text)) {
      const textToSearch = this.getEmojiText(cursor, text) || ":";
      const emojis = emojiIndex.search(textToSearch) || [];

      return emojis.map((o) => ({
        id: o.id,
        colons: o.colons,
        native: o.native,
      }));
    } else {
      return [];
    }
  }

  /**
   * Set up an observer on the editor to watch for changes.
   */
  _setupObserver() {
    const callback = (mutations) => {
      const characterDataMutations = mutations.filter(
        (m) => m.type === "characterData"
      );

      if (characterDataMutations.length) {
        const maybeNewText =
          characterDataMutations[characterDataMutations.length - 1].target
            .textContent;

        if (maybeNewText !== this.state.text) {
          const selection = document.getSelection();
          const cursor = selection.focusOffset;
          const text = selection.focusNode.wholeText;

          this.setState({
            cursor: cursor,
            text: maybeNewText,
            emojis: this.getEmojis(cursor, text),
          });
        }
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
