import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import { parse as parseSRT, stringify as stringifySRT } from 'subtitle';
import { saveAs } from 'file-saver';

export default class SentenceSRT2WordSRT extends Component {
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
    return words.map((text,i)=>({ start: i==0?start:0, end: 0, text }));
  }

  onDrop = async (acceptedFiles) => {
    let file = acceptedFiles[0];
    let content = await this.readFile(file);
    let parsed = parseSRT(content);
    let wordsSRT = [].concat(...parsed.map(this.sentence2wordSRT));
    let outputData = stringifySRT(wordsSRT);
    let blob = new Blob([outputData], {type: "text/plain;charset=utf-8"});

    let outFilePathComponent = file.path.split('.');
    outFilePathComponent.pop();
    saveAs(blob, `${outFilePathComponent.join(".")}_word.srt`);
  }


  on = () => {
    var fs = require('fs');
    var path = require('path');
    const csv = require('csvtojson')
    const rootDirPath = path.resolve(__dirname, './csv');
    const extName = ".csv";

    //get directory names
    const batchDirPath = path.resolve(__dirname, `./${new Date().getTime()}`);
    fs.mkdirSync(batchDirPath, 0744);

    fs.readdirSync(rootDirPath, { withFileTypes: true }).filter(_=>!_.isDirectory()).map(async (dn)=>{
      //read csv json
      let data = await csv().fromFile(`${rootDirPath}/${dn.name}`);
      let dirName = dn.name.substr(0, dn.name.length - extName.length);
      let dirPath = `${batchDirPath}/${dirName}`;
      fs.mkdirSync(dirPath, 0744);
      
      //create time file
      fs.writeFile(`${dirPath}/time`, data.map(_=>`${_.start_ms} ${_.end_ms}`).join("\n"), e=>{if(e) throw new Error(e)});
      
      ['id', 'en', 'hk', 'cn', 'tw', 'jp', 'kr'].forEach(fn=>{
        fs.writeFile(`${dirPath}/${fn}`, data.map(_=>_[fn]).join("\n"), e=>{if(e) throw new Error(e)});
      })
      
    });
  }


  render() {
    return (
      <div className="example">
        <h1>sentence srt to words srt</h1>
        <Dropzone onDrop={this.onDrop}>
          {({getRootProps, getInputProps}) => (
            <section >
              <div {...getRootProps()} style={{ border: '1px solid black', width: 600, color: 'black', padding: 20 }}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
        <form onSubmit={this.handleSubmit}>
          <textarea style={{ margin: '20px', width: '95%' }} value={this.state.value} rows={50} />
        </form>
        <div className="preview">
          <h1>Preview</h1>
          <textarea style={{ margin: '20px', width: '95%' }} value={this.state.result} rows={100}/>
        </div>
      </div>
    );
  }
}