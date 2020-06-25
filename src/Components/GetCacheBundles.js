import React, { Component } from 'react';
import Csv from "csvtojson";
import { saveAs } from 'file-saver';
import { PromiseAllWithProgress }  from '../PromiseUtil';
import JSZip from "jszip";
import { CorsifyURL } from '../Common';
const uuidv1 = require('uuid/v1');


export default class GetCNRegionBase extends Component {
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

  getFileName = (file) => {
    let outFilePathComponent = file.path.split('.');
    outFilePathComponent.pop();
    return outFilePathComponent.join(".");
  }

  getURLExtention = _ => {
    if (_.lastIndexOf('#') > 0) _ = _.substr(0, _.lastIndexOf('#'));
    if (_.lastIndexOf('?') > 0) _ = _.substr(0, _.lastIndexOf('?'));
    return _.substr(_.lastIndexOf('.') + 1);
  }

  downloadAssetsBundle = async (data, resId) => {
    console.log(`downloading cache files for res Id = ${resId}`);

    this.setState({ assetsRes: resId });

    let zip = new JSZip();

    let forbiddenURLs = {};

    let promises = data.filter(_=>{
      if(!_) { console.log(`invalid record:`, _); return false; }
      if(!_['id']) { console.log(`invalid record:`, _); return false; }
      if(_['id'] === 'cache_bundle') { console.log(`cache_bundle record, ignore`); return false; }
      return true;
    }).map(async _=>{
      let id = _['id'];
      let filename = uuidv1();
      let url = this.getS3Link(_[resId]);
      let returnObj = {
        id, filename, url
      };
  

      try {
        let resp = await fetch(url);
        if(resp.status===200) returnObj.blob = await resp.blob();
      } catch (e) {
        // console.log(`download fail for obj:`, returnObj , `e:`, e);
      }

      return returnObj;
    });



    let p = await PromiseAllWithProgress(promises, _=>this.setState({ progress: _ }));

    let cacheMap = {};
    //generate zip file and download
    for (let i = 0; i < p.length; i++) {
      const { id, filename, blob, url } = p[i];
      if(blob){
        cacheMap[id] = { filename, extention: this.getURLExtention(url) };
        await zip.file(filename, blob);
      }else{
        forbiddenURLs[id] = url;
      }
    }
    await zip.file('cache', new Blob([JSON.stringify(cacheMap, null, 1)], {type: "text/plain;charset=utf-8"}));

    console.log(`forbiddenURLs:\n${JSON.stringify(forbiddenURLs, null, 2)}`);

    let blob = await zip.generateAsync({ type:"blob" });
    saveAs(blob, `${resId}.zip`);
  }


  getS3Link = (path) => `https://s3-ap-southeast-1.amazonaws.com/ehla-media-bucket/apps-dev/1.1.0/assets/${path}`;

  convert = async () => {
    this.setState({ isActive: true, assetsRes: null, progress: 0 });
    let fetchURL = CorsifyURL("https://docs.google.com/spreadsheets/d/e/2PACX-1vTdYNQ7IPRj4i7z41JFLK8hHOh09Ds-3-Jz18bSW6q4EQdomUrDLW2nt27AIsjZonOYXhRQFOnFLKjS/pub?gid=0&single=true&output=csv");
    let resp = await fetch(fetchURL);
    if(!resp.ok) return;

    let content = await resp.text();
    let data = await Csv().fromString(content.replace("\uFEFF", ""));


    let assetsRes = Object.keys(data[0]).filter(_=>_!=="id");
    console.log(`existing resolution:`, assetsRes);




    for(let i = 0; i < assetsRes.length; i++) {
      await this.downloadAssetsBundle(data, assetsRes[i]);
    }

    // await this.downloadAssetsBundle(data, '10');

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
          <center><h1>{!this.state.isActive?`Get Cached Bundle Zip`:`downloading scale:${this.state.assetsRes} progress:${this.state.progress}`}</h1></center>
        </div>
      </section>
    );
  }
}
