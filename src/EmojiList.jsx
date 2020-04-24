import React, { Component } from "react";
import PropTypes from "prop-types";
import "./less/EmojiPicker.less";

const propTypes = {
  activeEmojiIndex: PropTypes.number.isRequired,
  emojis: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      colons: PropTypes.string.isRequired,
      native: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEmojiClick: PropTypes.func.isRequired,
  onEmojiHover: PropTypes.func.isRequired,
};

/**
 * Component that displays a list of emojis and their codes.
 */
class EmojiList extends Component {
  constructor(props) {
    super(props);

    this.emojiNodes = [];

    this.isEmojiActive = this.isEmojiActive.bind(this);
    this._addEventListeners = this._addEventListeners.bind(this);
    this._removeEventListeners = this._removeEventListeners.bind(this);
  }

  componentDidMount() {
    this.emojiNodes = this.emojiList.childNodes;

    this._addEventListeners();
  }

  componentWillUnmount() {
    this._removeEventListeners();
  }

  componentDidUpdate() {
    this._removeEventListeners();

    this.emojiNodes = this.emojiList.childNodes;

    this._addEventListeners();

    const activeEmojiNode = this.emojiNodes.item(this.props.activeEmojiIndex);
    if (activeEmojiNode) {
      activeEmojiNode.scrollIntoViewIfNeeded(false);
    }
  }

  isEmojiActive(index) {
    return index === this.props.activeEmojiIndex;
  }

  _addEventListeners() {
    for (let emojiNode of this.emojiNodes) {
      emojiNode.addEventListener("click", this.props.onEmojiClick);
    }
  }

  _removeEventListeners() {
    for (let emojiNode of this.emojiNodes) {
      emojiNode.removeEventListener("click", this.props.onEmojiClick);
    }
  }

  render() {
    return (
      <div className="emoji-list">
        <ul
          ref={(node) => {
            this.emojiList = node;
          }}
        >
          {this.props.emojis.map((emoji, index) => (
            <li
              className={`emoji-list__item${
                this.isEmojiActive(index) ? " -is-active" : ""
              }`}
              data-index={index}
              key={emoji.id}
              onMouseOver={this.props.onEmojiHover}
            >
              {emoji.native} {emoji.colons}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

EmojiList.propTypes = propTypes;

export default EmojiList;
