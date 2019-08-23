import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import { saveAs } from 'file-saver';
import Csv from "csvtojson";
import { parse as parseSRT, stringify as stringifySRT } from 'subtitle';
import JSZip from "jszip";
import * as XLSX from 'xlsx';

export default class GetCNRegionBase extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onTextAreaChange = this.onTextAreaChange.bind(this);
  }

  parseWord = (word) => {
    //remove leading and trailing character space,.!
    word = word.replace(/(^['":,.!?\s]+)|(['":,.!?\s]+$)/g, '');
    return word;
  }

  onTextAreaChange(event) {
    let para = event.target.value;
    let sentences = para.split("\n");
    let words = sentences.map(_=>_.split(" ").map(this.parseWord).filter(_=>_!=""));
  }

  handleDroppedFile = (file) => {
    const value = file.result;
    this.setState({ value });
  }
  

  readFile = async (file) => {
    return await new Promise((resolve) => {
      let reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsText(file);
    });
  }


  sentence2wordSRT = (parsedSRT) => {
    let { start, text } = parsedSRT;
    let words = text.split(" ").map(this.parseWord).filter(_=>_!="");
    return words.map((text,i)=>({ start: i==0?start:0, end:i==0?start:0, text }));
  }


  getFileName = (file) => {
    let outFilePathComponent = file.path.split('.');
    outFilePathComponent.pop();
    return outFilePathComponent.join(".");
  }

  convert = async () => {
    let resp = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vSd9wPw4mD1f-Uvyk7DxRP892wFohetQzKABnLJq_T4bDfYbowuPP_hR98vu47eWdwUKI5JVtDAZPVK/pub?output=xlsx");
    if(!resp.ok) return;

    let blog = await resp.arrayBuffer();
    let workbook = XLSX.read(blog, { type: 'buffer' });
    let data = {}; 
    for (const sheet in workbook.Sheets) {
      if (workbook.Sheets.hasOwnProperty(sheet)) {
        data[sheet] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
      }
    }


    //publisher handler
    const parsePublisher = _=> {
      let { id, name_ref, region_ids, level_ids, ...props } = _;
      props.region_idxes = region_ids.split(",").map(_=>data.regions.findIndex(r=>r.id==_));
      props.level_values = level_ids.split(",").map(_=>data.levels.find(l=>l.id==_).value);
      return props; 
    }

    //vocab_publishers
    let vocab_publishers = data.vocab_publishers.map(parsePublisher);
    let grammar_publishers = data.grammar_publishers.map(parsePublisher);
    let listening_speaking_publishers = data.listening_speaking_publishers.map(parsePublisher); 

    //regions
    let regions = data.regions.map(_=>{
      let { id, name_ref, ...props } = _;
      return props;
    });

    //region
    console.log(`{
      "region": [
        ${regions.map(_=>JSON.stringify(_)).join(',\n')}
      ]
    }`);
    //vocab_publishers
    console.log(`{
      "vocab_publishers": [
        ${vocab_publishers.map(_=>JSON.stringify(_)).join(',\n')}
      ]
    }`);
    //grammar_publishers
    console.log(`{
      "grammar_publishers": [
        ${grammar_publishers.map(_=>JSON.stringify(_)).join(',\n')}
      ]
    }`);
    //listening_speaking_publishers
    console.log(`{
      "listening_speaking_publishers": [
        ${listening_speaking_publishers.map(_=>JSON.stringify(_)).join(',\n')}
      ]
    }`);

    // console.log(JSON.stringify(results, null, 1));    

  }

  render() {
    return (
      <section >
        <div style={{ border: '1px solid black', maxWidth: '100%', color: 'black', margin: 20 }} onClick={this.convert} >
          <center><h1>Get CN RegionBase</h1></center>
        </div>
      </section>
    );
  }
}
