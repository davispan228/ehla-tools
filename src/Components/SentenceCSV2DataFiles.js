import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import { saveAs } from 'file-saver';
import Csv from "csvtojson";
import { parse as parseSRT, stringify as stringifySRT } from 'subtitle';
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


  convert = async (files) => {

    //CSV => data files
    let content = await this.readFile(files.csv);
    content = content.replace("\uFEFF", "");
    
    let zip = new JSZip();
    let data = await Csv().fromString(content);
    //time file
    zip.file("time", data.map(_=>`${_.start_ms} ${_.end_ms}`).join("\n"));
    //other field
    ['id', 'en', 'hk', 'cn', 'tw', 'jp', 'kr'].forEach(fn=>{
      zip.file(`${fn}`, data.map(_=>_[fn]).join("\n"));
    })


    //tuning of words srt files 
    let sentenceTimeRanges = data.map(_=>({ text:_.en, start:parseInt(_.start_ms), end:parseInt(_.end_ms)}));
    content = await this.readFile(files.srt);
    let parsed = parseSRT(content);

    console.log(`sentenceTimeRanges:${JSON.stringify(sentenceTimeRanges)}`);
    console.log(`parsed[0]:${JSON.stringify(parsed[0])}`);
    

    let curIndex = 0, curSentence = {...sentenceTimeRanges[0]};
    let outboundRecords = [], tunedRecords = [];
    let turned = parsed.map(_=>{
      //check time range
      while(curSentence.text.indexOf(_.text) == -1){
        curSentence = {...sentenceTimeRanges[++curIndex]};
      }

      let { text, start, end } = curSentence;

      let returnSrt = null;
      if(_.end < start || _.start > end) outboundRecords.push(_);
      else if(_.start >= start && _.end <= end) returnSrt = _;
      else if(_.start < start) returnSrt = { ..._, start };
      else if(_.end > end) returnSrt = { ..._, end };

      if(returnSrt){
        if(returnSrt != _) tunedRecords.push({ from:_, to: returnSrt });
        curSentence.text = text.substring(text.indexOf(_.text) + _.text.length);
      }
      return returnSrt;
    }).filter(_=>_!=null);

    console.log(`outbound records:${JSON.stringify(outboundRecords)}`);
    console.log(`tuned records:${JSON.stringify(tunedRecords)}`);
    

    //output words SRT
    // let wordsSRT = [].concat(...parsed.map(this.sentence2wordSRT));
    let outputData = stringifySRT(turned);
    zip.file('word_tuned.srt', outputData);


    let blob = await zip.generateAsync({type:"blob"});
    let outFilePathComponent = files.csv.path.split('.');
    outFilePathComponent.pop();
    saveAs(blob, `${outFilePathComponent.join(".")}.zip`);
  }

  onDrop = async (acceptedFiles) => {
    let files = {
      csv: acceptedFiles.find(f=>f.path.endsWith('.csv')),
      srt: acceptedFiles.find(f=>f.path.endsWith('.srt'))
    }
    if(!files.csv || !files.srt) alert('please drop sentence csv and word srt files to me')
    this.convert(files);
  }

  render() {
    return (
      <Dropzone onDrop={this.onDrop}>
        {({getRootProps, getInputProps}) => (
          <section >
            <div {...getRootProps()} style={{ border: '1px solid black', maxWidth: '100%', color: 'black', margin: 20 }}>
              <input {...getInputProps()} />
              <center><h1>2. Words SRT + Sentence CSV -> Tuned Words SRT + Data Zip</h1></center>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}
