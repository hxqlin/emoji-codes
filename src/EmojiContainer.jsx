import React, { Component } from "react";
import PropTypes from "prop-types";

const propTypes = {
  editor: PropTypes.object.isRequired,
};

class EmojiContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: this.props.editor.textContent,
      showEmojis: false,
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
      const maybeNewText = mutations[mutations.length - 1].target.textContent;
      if (maybeNewText !== this.state.text) {
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
    return <div className="emoji-container"></div>;
  }
}

EmojiContainer.propTypes = propTypes;

export default EmojiContainer;
