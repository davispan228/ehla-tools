import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import { saveAs } from 'file-saver';
import Csv from "csvtojson";
import JSZip from "jszip";

export default class SentenceCSV2DataFiles extends Component {
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


  convert = async (file) => {
    let content = await this.readFile(file);
    
    let zip = new JSZip();
    let data = await Csv().fromString(content);
    //time file
    zip.file("time", data.map(_=>`${_.start_ms} ${_.end_ms}`).join("\n"));
    //other field
    ['id', 'en', 'hk', 'cn', 'tw', 'jp', 'kr'].forEach(fn=>{
      zip.file(`${fn}`, data.map(_=>_[fn]).join("\n"));
    })

    let blob = await zip.generateAsync({type:"blob"});
    let outFilePathComponent = file.path.split('.');
    outFilePathComponent.pop();
    saveAs(blob, `${outFilePathComponent.join(".")}.zip`);
  }

  onDrop = async (acceptedFiles) => {
    acceptedFiles.forEach(this.convert);
  }

  render() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({getRootProps, getInputProps}) => (
          <section >
            <div {...getRootProps()} style={{ border: '1px solid black', maxWidth: '100%', color: 'black', margin: 20 }}>
              <input {...getInputProps()} />
              <center><h1>Drag files here to convert sentance csv to data zip file</h1></center>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}
