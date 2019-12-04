import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import { parse as parseSRT, stringify as stringifySRT } from 'subtitle';
import { saveAs } from 'file-saver';

export default class SentenceSRT2WordSRT extends Component {
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
    let parsed = parseSRT(content);

    //output words SRT
    let wordsSRT = [].concat(...parsed.map(this.sentence2wordSRT));
    let outputData = stringifySRT(wordsSRT);
    let blob = new Blob([outputData], {type: "text/plain;charset=utf-8"});
 
    let fn = this.getFileName(file);
    saveAs(blob, `${fn}_word.srt`);


    const specialWords = [
      'e.g.', 'a.m.', 'p.m.'
    ];
    //output sentence CSV
    outputData = "\uFEFF";
    outputData += "start_ms,end_ms,id,word_count,en,hk,cn,tw,jp,kr\n";
    outputData += parsed.map(_=>{
      let text = _.text;
      specialWords.forEach(_=>text=text.replace(_, 'word'));
      //replace
      text = text.replace(/-/g,' ');
      text = text.replace(/,/g,' ');
      text = text.replace(/\./g,' ');
      text = text.replace(/!/g,' ');
      text = text.replace(/;/g,' ');
      const wordCount = text.split(' ').filter(_=>_!=='').length;
      return `${_.start},${_.end},,${wordCount},"${_.text}",,,,,`;
    }).join("\n");
    blob = new Blob([outputData], {type: "text/plain;charset=utf-8"});
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
              <center><h1>1. Sentences SRT -> Words SRT + Sentences CSV </h1></center>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}