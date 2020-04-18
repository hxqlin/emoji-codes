import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import EmojiContainer from './EmojiContainer';

ReactDOM.render(<App />, document.getElementById('root'));

const setupEditorTracker = () => {
    const emojiContainer = document.createElement('div');
    const editor = document.querySelector('div[contenteditable=true]');
    editor.append(emojiContainer);
    ReactDOM.render(<EmojiContainer editor={editor} />, emojiContainer);
}

window.addEventListener('load', setupEditorTracker);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
