import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
  emojis: PropTypes.array.isRequired,
};

class EmojiList extends Component {
  render() {
    return (
      <div className="emoji-list">
        <ul
          ref={(node) => {
            this.emojiList = node;
          }}
        >
          {this.props.emojis.map((emoji) => (
            <li key={emoji.id} className="emoji-list-item">
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
