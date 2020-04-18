import React, { Component } from "react";
import "./App.css";
import "./App.less";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div role="main">
            <div
              className="editor"
              contentEditable="true"
              role="combobox"
              aria-controls="js_6"
              aria-expanded="false"
            ></div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
