import React, { Component } from 'react';
import SentenceSRT2WordSRT from  './Components/SentenceSRT2WordSRT'
import SentenceCSV2DataFiles from  './Components/SentenceCSV2DataFiles'

class App extends Component {
  render() {
    return (
      <div className="App">
        <SentenceSRT2WordSRT />
        <SentenceCSV2DataFiles/>
      </div>
    );
  }
}

export default App;
