import React, { Component } from 'react';
import SentenceSRT2WordSRT from  './Components/SentenceSRT2WordSRT'
import SentenceCSV2DataFiles from  './Components/SentenceCSV2DataFiles'
import I18nJSON2CSV from './Components/I18nJSON2CSV'
import CSV2I18nJSON from './Components/CSV2I18nJSON'
class App extends Component {
  render() {
    return (
      <div className="App">
        <SentenceSRT2WordSRT />
        <SentenceCSV2DataFiles />
        <I18nJSON2CSV />
        <CSV2I18nJSON />
      </div>
    );
  }
}

export default App;
