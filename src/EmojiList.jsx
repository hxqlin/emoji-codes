import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
  emojis: PropTypes.array.isRequired,
  onEmojiClick: PropTypes.func.isRequired,
};

class EmojiList extends Component {
  constructor(props) {
    super(props);

    this.emojiItems = [];

    this._addEventListeners = this._addEventListeners.bind(this);
    this._removeEventListeners = this._removeEventListeners.bind(this);
  }

  componentDidMount() {
    this.emojiItems = this.emojiList.childNodes;

    this._addEventListeners();
  }

  componentWillUnmount() {
    this._removeEventListeners();
  }

  componentDidUpdate() {
    this._removeEventListeners();

    this.emojiItems = this.emojiList.childNodes;

    this._addEventListeners();
  }

  _addEventListeners() {
    for (let emojiItem of this.emojiItems) {
      emojiItem.addEventListener("click", this.props.onEmojiClick);
    }
  }

  _removeEventListeners() {
    for (let emojiItem of this.emojiItems) {
      emojiItem.removeEventListener("click", this.props.onEmojiClick);
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
            <li key={emoji.id} className="emoji-list-item" data-index={index}>
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
