import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import { saveAs } from 'file-saver';
import Csv from "csvtojson";
import JSZip from "jszip";

export default class ConsolidatedCSV2I18nJSONFiles extends Component {
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

  convert = async (file) => {
    let content = await this.readFile(file);
    content = content.replace("\uFEFF", "");
    let data = await Csv().fromString(content);
 

    let zip = new JSZip();
    
    //get fields details
    let { id, ...fields } = data[0];
    let langs = Object.keys(fields);
    
    langs.forEach(lang=>{
      let i18nJSON = {}
      data.forEach(_=>i18nJSON[_.id] = _[lang]);
      zip.file(`${lang}`, JSON.stringify(i18nJSON));
    });

    let blob = await zip.generateAsync({type:"blob"});
    saveAs(blob, `${this.getFileName(file)}.zip`);

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
              <center><h1>Cosolidated I18n CSV -> I18n JSON Data Files</h1></center>
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}