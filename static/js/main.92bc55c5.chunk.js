(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{115:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),c=n(63),o=n.n(c),u=(n(72),n(6)),i=n(7),s=n(10),l=n(9),p=n(11),f=n(65),d=n(1),m=n.n(d),v=n(4),h=n(8),b=n(17),j=n(36),x=n(14),O=function(e){function t(e){var n;return Object(u.a)(this,t),(n=Object(s.a)(this,Object(l.a)(t).call(this,e))).parseWord=function(e){return e=e.replace(/(^['":,.!?\s]+)|(['":,.!?\s]+$)/g,"")},n.handleDroppedFile=function(e){var t=e.result;n.setState({value:t})},n.readFile=function(){var e=Object(v.a)(m.a.mark(function e(t){return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new Promise(function(e){var n=new FileReader;n.onloadend=function(){return e(n.result)},n.readAsText(t)});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.sentence2wordSRT=function(e){var t=e.start;return e.text.split(" ").map(n.parseWord).filter(function(e){return""!=e}).map(function(e,n){return{start:0==n?t:0,end:0==n?t:0,text:e}})},n.getFileName=function(e){var t=e.path.split(".");return t.pop(),t.join(".")},n.convert=function(){var e=Object(v.a)(m.a.mark(function e(t){var r,a,c,o,u,i,s;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.readFile(t);case 2:a=e.sent,c=Object(j.a)(a),o=(r=[]).concat.apply(r,Object(f.a)(c.map(n.sentence2wordSRT))),u=Object(j.b)(o),i=new Blob([u],{type:"text/plain;charset=utf-8"}),s=n.getFileName(t),Object(x.saveAs)(i,"".concat(s,"_word.srt")),u="\ufeff",u+="start_ms,end_ms,id,en,hk,cn,tw,jp,kr\n",u+=c.map(function(e){return"".concat(e.start,",").concat(e.end,',,"').concat(e.text,'",,,,,')}).join("\n"),i=new Blob([u],{type:"text/plain;charset=utf-8"}),Object(x.saveAs)(i,"".concat(s,".csv"));case 14:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.onDrop=function(){var e=Object(v.a)(m.a.mark(function e(t){return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.forEach(n.convert);case 1:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.state={},n.onTextAreaChange=n.onTextAreaChange.bind(Object(h.a)(n)),n}return Object(p.a)(t,e),Object(i.a)(t,[{key:"onTextAreaChange",value:function(e){var t=this;e.target.value.split("\n").map(function(e){return e.split(" ").map(t.parseWord).filter(function(e){return""!=e})})}},{key:"render",value:function(){return a.a.createElement(b.a,{onDrop:this.onDrop},function(e){var t=e.getRootProps,n=e.getInputProps;return a.a.createElement("section",null,a.a.createElement("div",Object.assign({},t(),{style:{border:"1px solid black",maxWidth:"100%",color:"black",margin:20}}),a.a.createElement("input",n()),a.a.createElement("center",null,a.a.createElement("h1",null,"1. Sentences SRT -> Words SRT + Sentences CSV "))))})}}]),t}(r.Component),w=n(28),g=n.n(w),k=n(29),y=n.n(k),E=function(e){function t(e){var n;return Object(u.a)(this,t),(n=Object(s.a)(this,Object(l.a)(t).call(this,e))).parseWord=function(e){return e=e.replace(/(^['":,.!?\s]+)|(['":,.!?\s]+$)/g,"")},n.handleDroppedFile=function(e){var t=e.result;n.setState({value:t})},n.readFile=function(){var e=Object(v.a)(m.a.mark(function e(t){return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new Promise(function(e){var n=new FileReader;n.onloadend=function(){return e(n.result)},n.readAsText(t)});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.sentence2wordSRT=function(e){var t=e.start;return e.text.split(" ").map(n.parseWord).filter(function(e){return""!=e}).map(function(e,n){return{start:0==n?t:0,end:0==n?t:0,text:e}})},n.convert=function(){var e=Object(v.a)(m.a.mark(function e(t){var r,a,c,o,u;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.readFile(t);case 2:return r=(r=e.sent).replace("\ufeff",""),a=new y.a,e.next=7,g()().fromString(r);case 7:return c=e.sent,a.file("time",c.map(function(e){return"".concat(e.start_ms," ").concat(e.end_ms)}).join("\n")),["id","en","hk","cn","tw","jp","kr"].forEach(function(e){a.file("".concat(e),c.map(function(t){return t[e]}).join("\n"))}),e.next=12,a.generateAsync({type:"blob"});case 12:o=e.sent,(u=t.path.split(".")).pop(),Object(x.saveAs)(o,"".concat(u.join("."),".zip"));case 16:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.onDrop=function(){var e=Object(v.a)(m.a.mark(function e(t){return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.forEach(n.convert);case 1:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.state={},n.onTextAreaChange=n.onTextAreaChange.bind(Object(h.a)(n)),n}return Object(p.a)(t,e),Object(i.a)(t,[{key:"onTextAreaChange",value:function(e){var t=this;e.target.value.split("\n").map(function(e){return e.split(" ").map(t.parseWord).filter(function(e){return""!=e})})}},{key:"render",value:function(){return a.a.createElement(b.a,{onDrop:this.onDrop},function(e){var t=e.getRootProps,n=e.getInputProps;return a.a.createElement("section",null,a.a.createElement("div",Object.assign({},t(),{style:{border:"1px solid black",maxWidth:"100%",color:"black",margin:20}}),a.a.createElement("input",n()),a.a.createElement("center",null,a.a.createElement("h1",null,"2. CSV -> Data Zip"))))})}}]),t}(r.Component),A=function(e){function t(e){var n;return Object(u.a)(this,t),(n=Object(s.a)(this,Object(l.a)(t).call(this,e))).parseWord=function(e){return e=e.replace(/(^['":,.!?\s]+)|(['":,.!?\s]+$)/g,"")},n.handleDroppedFile=function(e){var t=e.result;n.setState({value:t})},n.readFile=function(){var e=Object(v.a)(m.a.mark(function e(t){return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new Promise(function(e){var n=new FileReader;n.onloadend=function(){return e(n.result)},n.readAsText(t)});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.sentence2wordSRT=function(e){var t=e.start;return e.text.split(" ").map(n.parseWord).filter(function(e){return""!=e}).map(function(e,n){return{start:0==n?t:0,end:0==n?t:0,text:e}})},n.getFileName=function(e){var t=e.path.split(".");return t.pop(),t.join(".")},n.convert=function(){var e=Object(v.a)(m.a.mark(function e(t){var r,a,c,o,u;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.readFile(t);case 2:r=e.sent,a=JSON.parse(r),c="\ufeff",c+="id,en,translate\n",c+=Object.keys(a).map(function(e){return"".concat(e,',"').concat(a[e].replace(new RegExp("\n","g"),"\r"),'",')}).join("\n"),o=new Blob([c],{type:"text/plain;charset=utf-8"}),u=n.getFileName(t),Object(x.saveAs)(o,"".concat(u,".csv"));case 10:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.onDrop=function(){var e=Object(v.a)(m.a.mark(function e(t){return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.forEach(n.convert);case 1:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.state={},n.onTextAreaChange=n.onTextAreaChange.bind(Object(h.a)(n)),n}return Object(p.a)(t,e),Object(i.a)(t,[{key:"onTextAreaChange",value:function(e){var t=this;e.target.value.split("\n").map(function(e){return e.split(" ").map(t.parseWord).filter(function(e){return""!=e})})}},{key:"render",value:function(){return a.a.createElement(b.a,{onDrop:this.onDrop},function(e){var t=e.getRootProps,n=e.getInputProps;return a.a.createElement("section",null,a.a.createElement("div",Object.assign({},t(),{style:{border:"1px solid black",maxWidth:"100%",color:"black",margin:20}}),a.a.createElement("input",n()),a.a.createElement("center",null,a.a.createElement("h1",null,"I18n JSON -> CSV"))))})}}]),t}(r.Component),F=n(66),S=function(e){function t(e){var n;return Object(u.a)(this,t),(n=Object(s.a)(this,Object(l.a)(t).call(this,e))).parseWord=function(e){return e=e.replace(/(^['":,.!?\s]+)|(['":,.!?\s]+$)/g,"")},n.handleDroppedFile=function(e){var t=e.result;n.setState({value:t})},n.readFile=function(){var e=Object(v.a)(m.a.mark(function e(t){return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,new Promise(function(e){var n=new FileReader;n.onloadend=function(){return e(n.result)},n.readAsText(t)});case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.sentence2wordSRT=function(e){var t=e.start;return e.text.split(" ").map(n.parseWord).filter(function(e){return""!=e}).map(function(e,n){return{start:0==n?t:0,end:0==n?t:0,text:e}})},n.getFileName=function(e){var t=e.path.split(".");return t.pop(),t.join(".")},n.convert=function(){var e=Object(v.a)(m.a.mark(function e(t){var r,a,c,o,u,i;return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.readFile(t);case 2:return r=(r=e.sent).replace("\ufeff",""),e.next=6,g()().fromString(r);case 6:return a=e.sent,c=new y.a,o=a[0],o.id,u=Object(F.a)(o,["id"]),Object.keys(u).forEach(function(e){var t={};a.forEach(function(n){return t[n.id]=n[e]}),c.file("".concat(e),JSON.stringify(t))}),e.next=13,c.generateAsync({type:"blob"});case 13:i=e.sent,Object(x.saveAs)(i,"".concat(n.getFileName(t),".zip"));case 15:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.onDrop=function(){var e=Object(v.a)(m.a.mark(function e(t){return m.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t.forEach(n.convert);case 1:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),n.state={},n.onTextAreaChange=n.onTextAreaChange.bind(Object(h.a)(n)),n}return Object(p.a)(t,e),Object(i.a)(t,[{key:"onTextAreaChange",value:function(e){var t=this;e.target.value.split("\n").map(function(e){return e.split(" ").map(t.parseWord).filter(function(e){return""!=e})})}},{key:"render",value:function(){return a.a.createElement(b.a,{onDrop:this.onDrop},function(e){var t=e.getRootProps,n=e.getInputProps;return a.a.createElement("section",null,a.a.createElement("div",Object.assign({},t(),{style:{border:"1px solid black",maxWidth:"100%",color:"black",margin:20}}),a.a.createElement("input",n()),a.a.createElement("center",null,a.a.createElement("h1",null,"Cosolidated I18n CSV -> I18n JSON Data Files"))))})}}]),t}(r.Component),T=function(e){function t(){return Object(u.a)(this,t),Object(s.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return a.a.createElement("div",{className:"App"},a.a.createElement(O,null),a.a.createElement(E,null),a.a.createElement(A,null),a.a.createElement(S,null))}}]),t}(r.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(a.a.createElement(T,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},67:function(e,t,n){e.exports=n(115)},72:function(e,t,n){},81:function(e,t){},83:function(e,t){}},[[67,1,2]]]);
//# sourceMappingURL=main.92bc55c5.chunk.js.map