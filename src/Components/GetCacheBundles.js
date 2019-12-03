import React, { Component } from 'react';
import Csv from "csvtojson";
import { saveAs } from 'file-saver';
import LoadingOverlay from 'react-loading-overlay';
import { PromiseAllWithProgress }  from '../PromiseUtil';
import JSZip from "jszip";
const uuidv1 = require('uuid/v1');


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

  getFileName = (file) => {
    let outFilePathComponent = file.path.split('.');
    outFilePathComponent.pop();
    return outFilePathComponent.join(".");
  }



  downloadAssetsBundle = async (data, resId) => {
    console.log(`downloading cache files for res Id = ${resId}`);
    let zip = new JSZip();

    let forbiddenURLs = {};

    let promises = data.map(async _=>{
      let id = _['id'];
      let filename = uuidv1();
      let url = this.getS3Link(_[resId]);
      console.log(`url:${url}`);
      try {
        let resp = await fetch(url);
        console.log(resp);
        let blob = await resp.blob();
        return { id, filename, blob, url };
      } catch (e) {
        console.log(`download fail for url:${url}, e:`, e);
        return { id, filename, url };
      }
    });



    let p = await PromiseAllWithProgress(promises, _=>console.log(`res Id = ${resId}, progress:${_}`));

   

    //generate zip file and download
    for (let i = 0; i < p.length; i++) {
      const { id, filename, blob, url } = p[i];
      if(blob){
        await zip.file(filename, blob);
      }else{
        forbiddenURLs[id] = url;
      }
    }

    console.log(`forbiddenURLs:\n${JSON.stringify(forbiddenURLs)}`);

    let blob = await zip.generateAsync({ type:"blob" });
    saveAs(blob, `${resId}.zip`);
  }


  getS3Link = (path) => `https://ehla-media-bucket.s3-ap-southeast-1.amazonaws.com/apps/1.1.9/assets/${path}`;

  convert = async () => {
    this.setState({ isActive: true });

    let resp = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vTdYNQ7IPRj4i7z41JFLK8hHOh09Ds-3-Jz18bSW6q4EQdomUrDLW2nt27AIsjZonOYXhRQFOnFLKjS/pub?gid=0&single=true&output=csv");
    if(!resp.ok) return;

    let content = await resp.text();
    let data = await Csv().fromString(content.replace("\uFEFF", ""));


    let assetsRes = Object.keys(data[0]).filter(_=>_!="id");
    console.log(`existing resolution:`, assetsRes);

    await this.downloadAssetsBundle(data, '20');

    // let zip = new JSZip();
    // let data = await Csv().fromString(content);
    // //time file
    // zip.file("time", data.map(_=>`${_.start_ms} ${_.end_ms}`).join("\n"));
    // //other field
    // ['id', 'en', 'hk', 'cn', 'tw', 'jp', 'kr'].forEach(fn=>{
    //   zip.file(`${fn}`, data.map(_=>_[fn]).join("\n"));
    // })

    //PromiseAllWithProgress()


    // let links = data.map(_=>this.getS3Link(_['20']));
    // console.log(JSON.stringify(links));

    this.setState({ isActive: false });

    // let i18nJSON = {}
    // data.forEach(_=>i18nJSON[_.id] = _.translate);
    // let blob = new Blob([JSON.stringify(i18nJSON, null, 1)], {type: "text/plain;charset=utf-8"});
    // let fn = this.getFileName(file);
    // saveAs(blob, `${fn}.json`);

  }

  render() {
    return (
      <section >
        <div style={{ border: '1px solid black', maxWidth: '100%', color: 'black', margin: 20 }} onClick={this.convert} >
          <center><h1>Get Cached Bundle Zip</h1></center>
        </div>
        <LoadingOverlay active={this.state.isActive} spinner text='Loading your content...'>
        </LoadingOverlay>
      </section>
    );
  }
}
