import React, { Component } from 'react';
import SentenceSRT2WordSRT from  './Components/SentenceSRT2WordSRT'
import SentenceCSV2DataFiles from  './Components/SentenceCSV2DataFiles'
import I18nJSON2CSV from './Components/I18nJSON2CSV'
import ConsolidatedCSV2I18nJSONFiles from './Components/ConsolidatedCSV2I18nJSONFiles'
import GetCNRegionBase from './Components/GetCNRegionBase'
import GetCacheBundles from './Components/GetCacheBundles'
class App extends Component {
  render() {
    return (
      <div className="App">
        <div>3 March 2020 9:49pm</div>
        <SentenceSRT2WordSRT />
        <SentenceCSV2DataFiles />
        <I18nJSON2CSV />
        <ConsolidatedCSV2I18nJSONFiles />
        <GetCNRegionBase />
        <GetCacheBundles />
      </div>
    );
  }
}

export default App;
