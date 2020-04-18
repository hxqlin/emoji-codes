import React, { Component } from "react";
import { emojiIndex } from "emoji-mart-lite";
import EmojiList from "./EmojiList.jsx";
import PropTypes from "prop-types";

const propTypes = {
  editor: PropTypes.object.isRequired,
};

class EmojiContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: this.props.editor.textContent,
      emojis: [],
    };
  }

  componentDidMount() {
    this._setupObserver();
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

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
          const emojis = emojiIndex.search(maybeNewText) || [];
          this.setState({
            text: maybeNewText,
            emojis: emojis.map((o) => ({
              id: o.id,
              colons: o.colons,
              native: o.native,
            })),
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
    const showEmojis = this.state.emojis.length;

    return (
      <div className={`emoji-container ${showEmojis ? "" : "-is-hidden"}`}>
        {showEmojis && <EmojiList emojis={this.state.emojis} />}
      </div>
    );
  }
}

EmojiContainer.propTypes = propTypes;

export default EmojiContainer;
