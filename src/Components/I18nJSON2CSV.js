import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import { saveAs } from 'file-saver';

export default class I18nJSON2CSV extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  parseWord = (word) => {
    //remove leading and trailing character space,.!
    word = word.replace(/(^['":,.!?\s]+)|(['":,.!?\s]+$)/g, '');
    return word;
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
    let words = text.split(" ").map(this.parseWord).filter(_=>_!=="");
    return words.map((text,i)=>({ start: i===0?start:0, end:i===0?start:0, text }));
  }


  getFileName = (file) => {
    let outFilePathComponent = file.path.split('.');
    outFilePathComponent.pop();
    return outFilePathComponent.join(".");
  }

  convert = async (file) => {
    let content = await this.readFile(file);
    let parsed = JSON.parse(content);

    //output sentence CSV
    let outputData = "\uFEFF";
    outputData += "id,en,translate\n";
    outputData += Object.keys(parsed).map(_=>`${_},"${parsed[_].replace(new RegExp('\n','g'),'\r')}",`).join("\n");
    let blob = new Blob([outputData], {type: "text/plain;charset=utf-8"});

    let fn = this.getFileName(file);
    saveAs(blob, `${fn}.csv`);
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
              <center><h1>I18n JSON -> CSV</h1></center>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}