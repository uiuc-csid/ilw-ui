"use strict";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const bt=globalThis,Gt=bt.ShadowRoot&&(bt.ShadyCSS===void 0||bt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Jt=Symbol(),pi=new WeakMap;let Ai=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==Jt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(Gt&&e===void 0){const o=t!==void 0&&t.length===1;o&&(e=pi.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),o&&pi.set(t,e))}return e}toString(){return this.cssText}};const _=n=>new Ai(typeof n=="string"?n:n+"",void 0,Jt),J=(n,...e)=>{const t=n.length===1?n[0]:e.reduce((o,i,r)=>o+(l=>{if(l._$cssResult$===!0)return l.cssText;if(typeof l=="number")return l;throw Error("Value passed to 'css' function must be a 'css' function result: "+l+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new Ai(t,n,Jt)},Gi=(n,e)=>{if(Gt)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const o=document.createElement("style"),i=bt.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=t.cssText,n.appendChild(o)}},ui=Gt?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(const o of e.cssRules)t+=o.cssText;return _(t)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ji,defineProperty:Yi,getOwnPropertyDescriptor:Zi,getOwnPropertyNames:Qi,getOwnPropertySymbols:Xi,getPrototypeOf:eo}=Object,ne=globalThis,gi=ne.trustedTypes,to=gi?gi.emptyScript:"",Rt=ne.reactiveElementPolyfillSupport,tt=(n,e)=>n,xt={toAttribute(n,e){switch(e){case Boolean:n=n?to:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},At=(n,e)=>!Ji(n,e),mi={attribute:!0,type:String,converter:xt,reflect:!1,useDefault:!1,hasChanged:At};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),ne.litPropertyMetadata??(ne.litPropertyMetadata=new WeakMap);let Ie=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=mi){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(e,o,t);i!==void 0&&Yi(this.prototype,e,i)}}static getPropertyDescriptor(e,t,o){const{get:i,set:r}=Zi(this.prototype,e)??{get(){return this[t]},set(l){this[t]=l}};return{get:i,set(l){const a=i==null?void 0:i.call(this);r==null||r.call(this,l),this.requestUpdate(e,a,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??mi}static _$Ei(){if(this.hasOwnProperty(tt("elementProperties")))return;const e=eo(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(tt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(tt("properties"))){const t=this.properties,o=[...Qi(t),...Xi(t)];for(const i of o)this.createProperty(i,t[i])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[o,i]of t)this.elementProperties.set(o,i)}this._$Eh=new Map;for(const[t,o]of this.elementProperties){const i=this._$Eu(t,o);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const o=new Set(e.flat(1/0).reverse());for(const i of o)t.unshift(ui(i))}else e!==void 0&&t.push(ui(e));return t}static _$Eu(e,t){const o=t.attribute;return o===!1?void 0:typeof o=="string"?o:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),(e=this.constructor.l)==null||e.forEach(t=>t(this))}addController(e){var t;(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&((t=e.hostConnected)==null||t.call(e))}removeController(e){var t;(t=this._$EO)==null||t.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const o of t.keys())this.hasOwnProperty(o)&&(e.set(o,this[o]),delete this[o]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Gi(e,this.constructor.elementStyles),e}connectedCallback(){var e;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(e=this._$EO)==null||e.forEach(t=>{var o;return(o=t.hostConnected)==null?void 0:o.call(t)})}enableUpdating(e){}disconnectedCallback(){var e;(e=this._$EO)==null||e.forEach(t=>{var o;return(o=t.hostDisconnected)==null?void 0:o.call(t)})}attributeChangedCallback(e,t,o){this._$AK(e,o)}_$ET(e,t){var r;const o=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,o);if(i!==void 0&&o.reflect===!0){const l=(((r=o.converter)==null?void 0:r.toAttribute)!==void 0?o.converter:xt).toAttribute(t,o.type);this._$Em=e,l==null?this.removeAttribute(i):this.setAttribute(i,l),this._$Em=null}}_$AK(e,t){var r,l;const o=this.constructor,i=o._$Eh.get(e);if(i!==void 0&&this._$Em!==i){const a=o.getPropertyOptions(i),c=typeof a.converter=="function"?{fromAttribute:a.converter}:((r=a.converter)==null?void 0:r.fromAttribute)!==void 0?a.converter:xt;this._$Em=i;const d=c.fromAttribute(t,a.type);this[i]=d??((l=this._$Ej)==null?void 0:l.get(i))??d,this._$Em=null}}requestUpdate(e,t,o){var i;if(e!==void 0){const r=this.constructor,l=this[e];if(o??(o=r.getPropertyOptions(e)),!((o.hasChanged??At)(l,t)||o.useDefault&&o.reflect&&l===((i=this._$Ej)==null?void 0:i.get(e))&&!this.hasAttribute(r._$Eu(e,o))))return;this.C(e,t,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:o,reflect:i,wrapped:r},l){o&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,l??t??this[e]),r!==!0||l!==void 0)||(this._$AL.has(e)||(this.hasUpdated||o||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var o;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,l]of this._$Ep)this[r]=l;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,l]of i){const{wrapped:a}=l,c=this[r];a!==!0||this._$AL.has(r)||c===void 0||this.C(r,void 0,l,c)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),(o=this._$EO)==null||o.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){var t;(t=this._$EO)==null||t.forEach(o=>{var i;return(i=o.hostUpdated)==null?void 0:i.call(o)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};Ie.elementStyles=[],Ie.shadowRootOptions={mode:"open"},Ie[tt("elementProperties")]=new Map,Ie[tt("finalized")]=new Map,Rt==null||Rt({ReactiveElement:Ie}),(ne.reactiveElementVersions??(ne.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const it=globalThis,kt=it.trustedTypes,vi=kt?kt.createPolicy("lit-html",{createHTML:n=>n}):void 0,zi="$lit$",oe=`lit$${Math.random().toFixed(9).slice(2)}$`,Oi="?"+oe,io=`<${Oi}>`,xe=document,ot=()=>xe.createComment(""),nt=n=>n===null||typeof n!="object"&&typeof n!="function",Yt=Array.isArray,oo=n=>Yt(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",Nt=`[ 	
\f\r]`,Xe=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,fi=/-->/g,bi=/>/g,fe=RegExp(`>|${Nt}(?:([^\\s"'>=/]+)(${Nt}*=${Nt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),wi=/'/g,yi=/"/g,Ti=/^(?:script|style|textarea|title)$/i,no=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),h=no(1),re=Symbol.for("lit-noChange"),S=Symbol.for("lit-nothing"),xi=new WeakMap,we=xe.createTreeWalker(xe,129);function Pi(n,e){if(!Yt(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return vi!==void 0?vi.createHTML(e):e}const ro=(n,e)=>{const t=n.length-1,o=[];let i,r=e===2?"<svg>":e===3?"<math>":"",l=Xe;for(let a=0;a<t;a++){const c=n[a];let d,p,u=-1,b=0;for(;b<c.length&&(l.lastIndex=b,p=l.exec(c),p!==null);)b=l.lastIndex,l===Xe?p[1]==="!--"?l=fi:p[1]!==void 0?l=bi:p[2]!==void 0?(Ti.test(p[2])&&(i=RegExp("</"+p[2],"g")),l=fe):p[3]!==void 0&&(l=fe):l===fe?p[0]===">"?(l=i??Xe,u=-1):p[1]===void 0?u=-2:(u=l.lastIndex-p[2].length,d=p[1],l=p[3]===void 0?fe:p[3]==='"'?yi:wi):l===yi||l===wi?l=fe:l===fi||l===bi?l=Xe:(l=fe,i=void 0);const f=l===fe&&n[a+1].startsWith("/>")?" ":"";r+=l===Xe?c+io:u>=0?(o.push(d),c.slice(0,u)+zi+c.slice(u)+oe+f):c+oe+(u===-2?a:f)}return[Pi(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),o]};let Ft=class Li{constructor({strings:e,_$litType$:t},o){let i;this.parts=[];let r=0,l=0;const a=e.length-1,c=this.parts,[d,p]=ro(e,t);if(this.el=Li.createElement(d,o),we.currentNode=this.el.content,t===2||t===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=we.nextNode())!==null&&c.length<a;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(zi)){const b=p[l++],f=i.getAttribute(u).split(oe),k=/([.?@])?(.*)/.exec(b);c.push({type:1,index:r,name:k[2],strings:f,ctor:k[1]==="."?so:k[1]==="?"?ao:k[1]==="@"?co:zt}),i.removeAttribute(u)}else u.startsWith(oe)&&(c.push({type:6,index:r}),i.removeAttribute(u));if(Ti.test(i.tagName)){const u=i.textContent.split(oe),b=u.length-1;if(b>0){i.textContent=kt?kt.emptyScript:"";for(let f=0;f<b;f++)i.append(u[f],ot()),we.nextNode(),c.push({type:2,index:++r});i.append(u[b],ot())}}}else if(i.nodeType===8)if(i.data===Oi)c.push({type:2,index:r});else{let u=-1;for(;(u=i.data.indexOf(oe,u+1))!==-1;)c.push({type:7,index:r}),u+=oe.length-1}r++}}static createElement(e,t){const o=xe.createElement("template");return o.innerHTML=e,o}};function je(n,e,t=n,o){var l,a;if(e===re)return e;let i=o!==void 0?(l=t._$Co)==null?void 0:l[o]:t._$Cl;const r=nt(e)?void 0:e._$litDirective$;return(i==null?void 0:i.constructor)!==r&&((a=i==null?void 0:i._$AO)==null||a.call(i,!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,t,o)),o!==void 0?(t._$Co??(t._$Co=[]))[o]=i:t._$Cl=i),i!==void 0&&(e=je(n,i._$AS(n,e.values),i,o)),e}let lo=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:o}=this._$AD,i=((e==null?void 0:e.creationScope)??xe).importNode(t,!0);we.currentNode=i;let r=we.nextNode(),l=0,a=0,c=o[0];for(;c!==void 0;){if(l===c.index){let d;c.type===2?d=new Zt(r,r.nextSibling,this,e):c.type===1?d=new c.ctor(r,c.name,c.strings,this,e):c.type===6&&(d=new ho(r,this,e)),this._$AV.push(d),c=o[++a]}l!==(c==null?void 0:c.index)&&(r=we.nextNode(),l++)}return we.currentNode=xe,i}p(e){let t=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(e,o,t),t+=o.strings.length-2):o._$AI(e[t])),t++}},Zt=class Mi{get _$AU(){var e;return((e=this._$AM)==null?void 0:e._$AU)??this._$Cv}constructor(e,t,o,i){this.type=2,this._$AH=S,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=o,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&(e==null?void 0:e.nodeType)===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=je(this,e,t),nt(e)?e===S||e==null||e===""?(this._$AH!==S&&this._$AR(),this._$AH=S):e!==this._$AH&&e!==re&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):oo(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==S&&nt(this._$AH)?this._$AA.nextSibling.data=e:this.T(xe.createTextNode(e)),this._$AH=e}$(e){var r;const{values:t,_$litType$:o}=e,i=typeof o=="number"?this._$AC(e):(o.el===void 0&&(o.el=Ft.createElement(Pi(o.h,o.h[0]),this.options)),o);if(((r=this._$AH)==null?void 0:r._$AD)===i)this._$AH.p(t);else{const l=new lo(i,this),a=l.u(this.options);l.p(t),this.T(a),this._$AH=l}}_$AC(e){let t=xi.get(e.strings);return t===void 0&&xi.set(e.strings,t=new Ft(e)),t}k(e){Yt(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let o,i=0;for(const r of e)i===t.length?t.push(o=new Mi(this.O(ot()),this.O(ot()),this,this.options)):o=t[i],o._$AI(r),i++;i<t.length&&(this._$AR(o&&o._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){var o;for((o=this._$AP)==null?void 0:o.call(this,!1,!0,t);e!==this._$AB;){const i=e.nextSibling;e.remove(),e=i}}setConnected(e){var t;this._$AM===void 0&&(this._$Cv=e,(t=this._$AP)==null||t.call(this,e))}},zt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,o,i,r){this.type=1,this._$AH=S,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=r,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=S}_$AI(e,t=this,o,i){const r=this.strings;let l=!1;if(r===void 0)e=je(this,e,t,0),l=!nt(e)||e!==this._$AH&&e!==re,l&&(this._$AH=e);else{const a=e;let c,d;for(e=r[0],c=0;c<r.length-1;c++)d=je(this,a[o+c],t,c),d===re&&(d=this._$AH[c]),l||(l=!nt(d)||d!==this._$AH[c]),d===S?e=S:e!==S&&(e+=(d??"")+r[c+1]),this._$AH[c]=d}l&&!i&&this.j(e)}j(e){e===S?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},so=class extends zt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===S?void 0:e}},ao=class extends zt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==S)}},co=class extends zt{constructor(e,t,o,i,r){super(e,t,o,i,r),this.type=5}_$AI(e,t=this){if((e=je(this,e,t,0)??S)===re)return;const o=this._$AH,i=e===S&&o!==S||e.capture!==o.capture||e.once!==o.once||e.passive!==o.passive,r=e!==S&&(o===S||i);i&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){var t;typeof this._$AH=="function"?this._$AH.call(((t=this.options)==null?void 0:t.host)??this.element,e):this._$AH.handleEvent(e)}},ho=class{constructor(e,t,o){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(e){je(this,e)}};const Ut=it.litHtmlPolyfillSupport;Ut==null||Ut(Ft,Zt),(it.litHtmlVersions??(it.litHtmlVersions=[])).push("3.3.1");const po=(n,e,t)=>{const o=(t==null?void 0:t.renderBefore)??e;let i=o._$litPart$;if(i===void 0){const r=(t==null?void 0:t.renderBefore)??null;o._$litPart$=i=new Zt(e.insertBefore(ot(),r),r,void 0,t??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ye=globalThis;let y=class extends Ie{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=po(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),(e=this._$Do)==null||e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._$Do)==null||e.setConnected(!1)}render(){return re}};var Ci;y._$litElement$=!0,y.finalized=!0,(Ci=ye.litElementHydrateSupport)==null||Ci.call(ye,{LitElement:y});const Dt=ye.litElementPolyfillSupport;Dt==null||Dt({LitElement:y});(ye.litElementVersions??(ye.litElementVersions=[])).push("4.2.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const x=n=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(n,e)}):customElements.define(n,e)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const uo={attribute:!0,type:String,converter:xt,reflect:!1,hasChanged:At},go=(n=uo,e,t)=>{const{kind:o,metadata:i}=t;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),o==="setter"&&((n=Object.create(n)).wrapped=!0),r.set(t.name,n),o==="accessor"){const{name:l}=t;return{set(a){const c=e.get.call(this);e.set.call(this,a),this.requestUpdate(l,c,n)},init(a){return a!==void 0&&this.C(l,void 0,n,a),a}}}if(o==="setter"){const{name:l}=t;return function(a){const c=this[l];e.call(this,a),this.requestUpdate(l,c,n)}}throw Error("Unsupported decorator location: "+o)};function s(n){return(e,t)=>typeof t=="object"?go(n,e,t):((o,i,r)=>{const l=i.hasOwnProperty(r);return i.constructor.createProperty(r,o),l?Object.getOwnPropertyDescriptor(i,r):void 0})(n,e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function U(n){return s({...n,state:!0,attribute:!1})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Qt=(n,e,t)=>(t.configurable=!0,t.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(n,e,t),t);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function he(n,e){return(t,o,i)=>{const r=l=>{var a;return((a=l.renderRoot)==null?void 0:a.querySelector(n))??null};return Qt(t,o,{get(){return r(this)}})}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let mo;function Ii(n){return(e,t)=>Qt(e,t,{get(){return(this.renderRoot??mo??(mo=document.createDocumentFragment())).querySelectorAll(n)}})}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function wt(n){return(e,t)=>{const{slot:o,selector:i}=n??{},r="slot"+(o?`[name=${o}]`:":not([name])");return Qt(e,t,{get(){var c;const l=(c=this.renderRoot)==null?void 0:c.querySelector(r),a=(l==null?void 0:l.assignedElements(n))??[];return i===void 0?a:a.filter(d=>d.matches(i))}})}}/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ji=n=>n??S,vo='.page{margin:0 var(--ilw-margin--side, max(1.875rem, calc(50cqw - 37.5rem) )) 0}.full,.auto{left:50%;margin-left:-50vw;margin-right:-50vw;padding-left:0;padding-right:0;position:relative;right:50%;width:100vw}.thick{--ilw-accordion-panel--border-left: 6px solid var(--ilw-accordion--accent)}.auto{--ilw-accordion-panel--margin: 0 var(--ilw-margin--side, max(1.875rem, calc(50cqw - 37.5rem) )) 0;--ilw-accordion-panel--padding: 5px var(--ilw-margin--side, max(1.875rem, calc(50cqw - 37.5rem) )) 20px}ul.buttons{column-gap:10px;display:flex;flex-direction:row;flex-wrap:wrap;justify-content:left;list-style:none;margin:10px 0;padding:0}ul.buttons[compact]{justify-content:right}ul.buttons[hidden]{display:none}ul.buttons li button{background-color:var(--ilw-color--white--control);border:2px solid var(--ilw-color--white--control-text);border-radius:.25em;color:var(--ilw-color--white--control-text);cursor:pointer;display:inline-block;font:700 1.188rem / 1.25rem var(--il-font-sans);letter-spacing:.01em;margin:6px 0;padding:12px 20px;text-align:center;text-decoration:none;transition:background-color .3s}.orange ul.buttons li button,.altgeld ul.buttons li button{background-color:var(--ilw-color--orange--control-text);border:2px solid var(--ilw-color--orange--control);color:var(--ilw-color--orange--control)}ul.buttons li button:hover{background-color:var(--ilw-color--white--control-text);border-color:var(--ilw-color--white--control-text);color:var(--ilw-color--white--control)}.orange ul.buttons li button:hover,.altgeld ul.buttons li button:hover{background-color:var(--ilw-color--orange--control);border:2px solid var(--ilw-color--orange--control-text);color:var(--ilw-color--orange--control-text)}ul.buttons li button:focus{background-color:var(--ilw-color--focus--background);border-color:var(--ilw-color--focus--text);color:var(--ilw-color--focus--text);outline:var(--ilw-color--focus--outline)}ul.buttons[compact] li button{background:none;border:none;margin:0;padding:0;cursor:pointer;font-family:inherit;font-size:inherit;font-weight:400;text-decoration:underline;color:var(--ilw-color--text)}ul.buttons[compact] li button:hover{background:#fff;color:var(--ilw-color--link-hover)}ul.buttons[compact] li button:focus{background:var(--ilw-color--focus--background);color:var(--ilw-color--focus--text)}ul.buttons[compact] li:after{content:" | ";margin-left:.5rem}ul.buttons[compact] li:last-child:after{content:none}';var fo=Object.defineProperty,bo=Object.getOwnPropertyDescriptor,Ge=(n,e,t,o)=>{for(var i=o>1?void 0:o?bo(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&fo(e,t,i),i};let ke=class extends y{constructor(){super(),this.accent="blue",this.width="",this.limit=!1,this.buttons=!1,this.compact=!1,this.width="",this.limit=!1,this.buttons=!1,this.addEventListener("collapse",e=>this.collapsePanel(e.target)),this.addEventListener("expand",e=>this.expandPanelListener(e.target))}static get styles(){return _(vo)}expandPanelListener(e){this.limit?this.expandPanelAndCollapseOthers(e):e.expand()}expandPanelAndCollapseOthers(e){this.getPanels().forEach(t=>{t!=e?this.collapsePanel(t):this.expandPanel(t)})}expandPanel(e){e.expand()}collapsePanel(e){e.collapse()}getPanels(){return this.querySelectorAll("ilw-accordion-panel")}getExpandedPanels(){return this.querySelectorAll("ilw-accordion-panel[open]")}expandAll(){this.getPanels().forEach(e=>{this.expandPanel(e)})}collapseAll(){this.getPanels().forEach(e=>{this.collapsePanel(e)})}getColorStyle(){return this.accent+(this.compact?"":" thick")}render(){return h`
            <div class="${this.width} ${this.getColorStyle()}">
                <ul class="buttons" ?compact="${this.compact}" ?hidden="${!this.buttons}">
                    <li><button @click="${this.expandAll}">Expand All</button></li>
                    <li><button @click="${this.collapseAll}">Collapse All</button></li>
                </ul>
                <slot></slot>
            </div>
        `}};Ge([s({type:String})],ke.prototype,"accent",2);Ge([s({type:String})],ke.prototype,"width",2);Ge([s({type:Boolean})],ke.prototype,"limit",2);Ge([s({type:Boolean})],ke.prototype,"buttons",2);Ge([s({type:Boolean})],ke.prototype,"compact",2);ke=Ge([x("ilw-accordion")],ke);const wo="#section{margin:var(--ilw-accordion-panel--section-margin)}#section.expanded{margin:var(--ilw-accordion-panel--expanded--section-margin)}#header-parent{cursor:pointer;color:var(--ilw-color--gray--text);padding:var(--ilw-accordion-panel--header-padding);background:var(--ilw-accordion-panel--background);border-left:var(--ilw-accordion-panel--border-left)}#header-parent:hover{background:var(--ilw-accordion-panel--background-hover)}#header-parent:focus-within{background-color:var(--ilw-color--focus--background);color:var(--ilw-color--focus--text);outline:var(--ilw-color--focus--outline)}#header-text{outline:none}#header-text-icon{display:flex;column-gap:20px;margin:var(--ilw-accordion-panel--margin)}#header{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}.expanded #panel{padding:var(--ilw-accordion-panel--padding)}#icon{display:flex;padding:0;margin:0;transform:var(--ilw-accordion-panel--image-transform);color:currentColor}#icon svg{width:var(--ilw-accordion-panel--image-size)}.expanded #icon{transform:var(--ilw-accordion-panel--image-transform-expand)}";var yo=Object.defineProperty,xo=Object.getOwnPropertyDescriptor,Ri=(n,e,t,o)=>{for(var i=o>1?void 0:o?xo(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&yo(e,t,i),i};let Bt=class extends y{constructor(){super(),this.open=!1,this.open=!1}static get styles(){return _(wo)}triggerToggle(){this.dispatchEvent(new CustomEvent(this.open?"collapse":"expand",{bubbles:!0,composed:!0}))}handleHeaderClick(e){this.triggerToggle(),e.stopPropagation()}handleHeaderKey(e){(e.key===" "||e.key==="Enter"||e.key==="Spacebar")&&(e.preventDefault(),this.triggerToggle())}beforeMatch(e){this.dispatchEvent(new CustomEvent("expand",{bubbles:!0,composed:!0}))}collapse(){this.open=!1}expand(){this.open=!0}renderArrow(){return h`<svg class="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.4 23.82" aria-hidden="true">
          <path id="chevron" d="m39.34,1.06c-1.41-1.41-3.7-1.41-5.12,0l-14.02,14.02L6.18,1.06C4.76-.35,2.47-.35,1.06,1.06s-1.41,3.7,0,5.12l16.58,16.58c1.41,1.41,3.7,1.41,5.12,0L39.34,6.18c1.41-1.41,1.41-3.7,0-5.12Z"/>
        </svg>`}render(){const e=this.open?"true":"false",t=this.open?"expanded":"",o=this.open?void 0:"until-found";return h` <div id="section" class="${t}">
            <div
                id="header-parent"
                @click="${this.handleHeaderClick}"
                @keydown=${this.handleHeaderKey}
                role="button" 
                tabindex="0" 
                aria-expanded="${e}"
                aria-controls="panel"
            >
                <div id="header-text-icon">
                    <span id="icon" aria-hidden="true">${this.renderArrow()} </span>
                    <div id="header-text"><slot name="summary"></slot></div>
                </div>
            </div>
            <div
                role="region"
                aria-labelledby="header-text"
                id="panel"
                hidden=${ji(o)}
                @beforematch=${this.beforeMatch}
            >
                <slot></slot>
            </div>
        </div>`}};Ri([s({type:Boolean,reflect:!0})],Bt.prototype,"open",2);Bt=Ri([x("ilw-accordion-panel")],Bt);const ko="@layer base{:host{--ilw-award-list--font: var(--il-font-sans);--ilw-award-list--heading-size: 2.5rem;--ilw-award-list--heading-weight: bold;--ilw-award-list--heading-color: var(--il-blue);--ilw-award-list--heading-border-top: 4px solid var(--il-orange);--ilw-award-list--heading-gradient: linear-gradient(4deg, #FFF 32.24%, rgba(255, 255, 255, .58) 84.44%);--ilw-award-list--heading-padding: 1.2rem 1.5rem 1rem;--ilw-award-list--heading-margin: 2.5rem 0 2rem;--ilw-award-list--spacing: 5.75rem}:host([size=large]){--ilw-award-list--heading-size: 4rem}}:host{display:block;font-family:var(--ilw-award-list--font)}.heading{background:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAxNjAgMTYwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNjAgMTYwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+Cgkuc3Qwe2ZpbGw6I0ZGNUYwNTt9Cjwvc3R5bGU+CjxnPjxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMTgxLC0xNjYuNyAtMTk1LjIsMjA5LjUgLTIwMS4xLDIxMC40IDE3NS42LC0xNjYuMyAJIi8+Cgk8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjIwMSwtMTQ2LjcgLTE3NS4yLDIyOS41IC0xODEuMSwyMzAuNCAxOTUuNiwtMTQ2LjMgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIyMjEsLTEyNi43IC0xNTUuMiwyNDkuNSAtMTYxLjEsMjUwLjQgMjE1LjYsLTEyNi4zIAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMjQxLC0xMDYuNyAtMTM1LjIsMjY5LjUgLTE0MSwyNzAuNCAyMzUuNiwtMTA2LjMgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIyNjEsLTg2LjcgLTExNS4xLDI4OS41IC0xMjEsMjkwLjQgMjU1LjcsLTg2LjMgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIyODEsLTY2LjYgLTk1LjEsMzA5LjUgLTEwMSwzMTAuNCAyNzUuNywtNjYuMyAJIi8+Cgk8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjMwMSwtNDYuNiAtNzUuMSwzMjkuNSAtODEsMzMwLjQgMjk1LjcsLTQ2LjMgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIzMjEuMSwtMjYuNiAtNTUuMSwzNDkuNiAtNjEsMzUwLjQgMzE1LjcsLTI2LjIgCSIvPgoJPHBvbHlnb24gY2xhc3M9InN0MCIgcG9pbnRzPSIzNDEuMSwtNi42IC0zNS4xLDM2OS42IC00MSwzNzAuNSAzMzUuNywtNi4yIAkiLz4KCTxwb2x5Z29uIGNsYXNzPSJzdDAiIHBvaW50cz0iMzYxLjEsMTMuNCAtMTUuMSwzODkuNiAtMjEsMzkwLjUgMzU1LjcsMTMuOCAJIi8+CjwvZz4KPC9zdmc+Cg==) repeat;background-size:40px;margin:var(--ilw-award-list--heading-margin)}.heading-inner{background:var(--ilw-award-list--heading-gradient);padding:var(--ilw-award-list--heading-padding);border-top:var(--ilw-award-list--heading-border-top)}";var $o=Object.defineProperty,So=Object.getOwnPropertyDescriptor,Xt=(n,e,t,o)=>{for(var i=o>1?void 0:o?So(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&$o(e,t,i),i};let $t=class extends y{constructor(){super(),this.theme="",this.size="normal"}static get styles(){return _(ko)}render(){return h`
            <div class="inner">
                <div class="heading">
                    <div class="heading-inner">
                        <slot name="heading"></slot>
                    </div>
                </div>
                <div class="content">
                    <slot></slot>
                </div>
            </div>
        `}};Xt([s()],$t.prototype,"theme",2);Xt([s()],$t.prototype,"size",2);$t=Xt([x("ilw-award-list")],$t);const _o="@layer base{:host{--ilw-award-category--font: var(--il-font-sans);--ilw-award-category--font-size: 18px;--ilw-award-category--heading-color: var(--il-orange);--ilw-award-category--heading-weight: bold;--ilw-award-category--heading-size: 1.61111em;--ilw-award-category--heading-padding: .3rem 0;--ilw-award-category--heading-border: 2px solid #e2e3e3;--ilw-award-category--padding: 0 1.5rem;--ilw-award-category--li-margin: 2rem 0 0 0;--ilw-award-category--li-heading-size: 1.16666em;--ilw-award-category--li-heading-font-weight: 600;--ilw-award-category--li-heading-font-style: italic;--ilw-award-category--li-heading-color: var(--il-orange);--ilw-award-category--li-heading-margin: .2rem 0;--ilw-award-category--li-heading-padding: 0;--ilw-award-category--line-height: 1.6666;--ilw-award-category--heading-margin: 3rem 0 0 0}:host([theme=blue]){--ilw-award-category--li-heading-color: var(--il-blue);--ilw-award-category--heading-color: var(--il-blue)}}:host{display:block;font-family:var(--ilw-award-category--font);padding:var(--ilw-award-category--padding)}.heading{margin:var(--ilw-award-category--heading-margin);padding:var(--ilw-award-category--heading-padding);border-bottom:var(--ilw-award-category--heading-border)}";var Eo=Object.defineProperty,Co=Object.getOwnPropertyDescriptor,Ni=(n,e,t,o)=>{for(var i=o>1?void 0:o?Co(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Eo(e,t,i),i};let qt=class extends y{constructor(){super(),this.theme="orange"}static get styles(){return _(_o)}render(){return h`
            <div class="inner">
                <div class="heading">
                    <slot name="heading"></slot>
                </div>
                <div class="content">
                    <slot></slot>
                </div>
            </div>
        `}};Ni([s()],qt.prototype,"theme",2);qt=Ni([x("ilw-award-category")],qt);const Ao=J`

:host {
  bottom: var(--ilw-back-to-top--bottom);
  position: fixed;
  right: var(--ilw-back-to-top--right);
  z-index: 2;
}
button {
  box-sizing: border-box;
  padding: 4px;
  display: block;
  background-color: var(--ilw-back-to-top--background);
  border: 2px solid var(--ilw-back-to-top--color);
  border-radius: 50%;
  width: 48px;
  height: 48px;
  transition: transform .4s;
  cursor: pointer;
}
button:hover {
  background-color: var(--ilw-back-to-top--color);
  border-color: var(--ilw-back-to-top--background);
}
button:focus {
  background-color: var(--ilw-back-to-top--focus-background-color);
  border-color: var(--ilw-back-to-top--focus-color);
  outline: var(--ilw-back-to-top--focus-outline);
}  
button.top-of-page {
  transform: translateY(88px);
}
svg {
  height: 36px;
  width: 36px;
}
path {
  fill: var(--ilw-back-to-top--color);
}
button:hover path, button:focus path {
  fill: var(--ilw-back-to-top--background);
}
`;var zo=Object.defineProperty,Oo=Object.getOwnPropertyDescriptor,Ot=(n,e,t,o)=>{for(var i=o>1?void 0:o?Oo(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&zo(e,t,i),i};let Re=class extends y{constructor(){super(),this.alt="Back to top",this.target=null,this.isTopOfPage=!0,this.expectedPositionAfterScroll=null,this.topOfPage=0,this.observer=null,this.continueScroll=this.continueScroll.bind(this),this.handleScroll=this.handleScroll.bind(this)}connectedCallback(){super.connectedCallback(),setTimeout(()=>{window.addEventListener("scroll",this.handleScroll),this.setResizeObserver(),this.handleScroll()},10)}setResizeObserver(){if(this.observer&&(this.observer.disconnect(),this.observer=null),this.target){const e=document.getElementById(this.target);e&&(this.topOfPage=e.getBoundingClientRect().top+document.documentElement.scrollTop,this.observer=new ResizeObserver(t=>{t.length>0&&e?this.topOfPage=e.getBoundingClientRect().top+document.documentElement.scrollTop:this.topOfPage=0,this.handleScroll()}),this.observer.observe(window.document.documentElement))}}updated(e){e.has("target")&&this.setResizeObserver()}continueScroll(){!this.isTopOfPage&&this.isInExpectedPosition()?this.scrollToTop():this.isTopOfPage&&this.focusFirstElement()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("scroll",this.handleScroll),this.observer&&this.observer.disconnect()}getButton(){var e;return((e=this.shadowRoot)==null?void 0:e.querySelector("button"))||null}getFoldPosition(){return window.innerHeight*.8}getNextScrollPosition(){return Math.max(this.topOfPage,this.getScrollPosition()-50)}getScrollPosition(){return window.scrollY||document.documentElement.scrollTop}prefersReducedMotion(){return typeof window.matchMedia=="function"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}getFirstFocusableElement(e=document){const t=["a[href]","button:not([disabled])","input:not([disabled])","select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])',"audio[controls]","video[controls]",'[contenteditable]:not([contenteditable="false"])',"details > summary"],o=e.querySelectorAll(t.join(","));for(let i of o){const r=window.getComputedStyle(i),l=i.getBoundingClientRect();if(r.display!=="none"&&r.visibility!=="hidden"&&i.tabIndex!==-1&&(l.width>0||l.height>0))return i}return null}focusFirstElement(){let e=null;if(this.target){const t=document.getElementById(this.target);t&&(t.tabIndex>=0||t.hasAttribute("href")||t.hasAttribute("controls")?e=t:e=this.getFirstFocusableElement(t))}e||(e=this.getFirstFocusableElement()),e&&e.focus()}handleClick(e){e.preventDefault();const t=this.getButton();t&&t.blur(),!this.prefersReducedMotion()&&this.isBelowFold()&&this.jumpToFold(),this.startScrollToTop()}handleScroll(){this.isTopOfPage=this.getScrollPosition()<=this.topOfPage}isBelowFold(){return this.getScrollPosition()>this.getFoldPosition()}isInExpectedPosition(){return this.expectedPositionAfterScroll===null?!1:this.getScrollPosition()<=this.expectedPositionAfterScroll+60}jumpToFold(){window.scrollTo(0,this.getFoldPosition())}scrollToTop(){this.expectedPositionAfterScroll=this.getNextScrollPosition(),window.scrollTo(0,this.expectedPositionAfterScroll),requestAnimationFrame(this.continueScroll)}scrollToTopImmediately(){this.expectedPositionAfterScroll=null,window.scrollTo(0,this.topOfPage),this.focusFirstElement()}startScrollToTop(){if(this.prefersReducedMotion()){this.scrollToTopImmediately();return}this.scrollToTop()}renderIcon(){return h`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" role="presentation">
      <path d="M8 24l2.83 2.83L22 15.66V40h4V15.66l11.17 11.17L40 24 24 8 8 24z"/>
    </svg>`}render(){return h`<button @click="${this.handleClick}" class="${this.isTopOfPage?"top-of-page":""}"
                        aria-label=${this.alt}>${this.renderIcon()}</button>`}};Re.styles=Ao;Ot([s({type:String,attribute:!0})],Re.prototype,"alt",2);Ot([s({type:String,attribute:!0})],Re.prototype,"target",2);Ot([U()],Re.prototype,"isTopOfPage",2);Re=Ot([x("ilw-back-to-top")],Re);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function*ei(n,e){if(n!==void 0){let t=0;for(const o of n)yield e(o,t++)}}const To=J`
  :host {
    display: block;
    background-color: var(--ilw-color--background);
    color: var(--ilw-color--text);
    --ilw-breadcrumbs--link-color: var(--ilw-color--link);
    --ilw-breadcrumbs--separator-color: var(--il-altgeld);
  }
  :host([theme="blue"]) {
    --ilw-breadcrumbs--separator-color: var(--il-orange);
    --ilw-breadcrumbs--link-color: #8DD1EB;
    --ilw-color--focus--outline: #ffffff;
  }
  ::slotted(a) {
    color: var(--ilw-breadcrumbs--link-color);
    text-decoration: underline;
    cursor: pointer;
  }
  ::slotted(a:visited) {
    color: var(--ilw-color--text);
  }
  ::slotted(a:hover) {
    color: var(--ilw-color--link-hover);
  }
  ::slotted(a:focus) {
    color: var(--ilw-color--focus--text);
    background-color: var(--ilw-color--focus--background);
    border-bottom: solid var(--ilw-color--focus--outline) 2px;
    text-decoration: none;
  }
  ::slotted(a:focus:hover) {
    color: var(--ilw-color--focus--text);
    background-color: var(--ilw-color--focus--background);
    border-bottom: solid var(--ilw-color--focus--outline) 2px;
    text-decoration: underline;
  }
  .breadcrumb {
    background-color: var(--ilw-color--background);
    color: var(--ilw-color--text);
    padding: 0.5rem 0;
  }
  .breadcrumb.fixed {
    left:50%;
    margin-left:-50vw;
    margin-right:-50vw;
    padding-left:0;
    padding-right:0;
    position:relative;
    right:50%;
    width:100vw;
  }
  .breadcrumb.page {
    margin: 0 var(--ilw-margin--side, 0);
  }
  .breadcrumb ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .breadcrumb li {
    display: inline;
    vertical-align: baseline;
    font: 400 0.875rem/1.5rem var(--il-font-sans);
  }
  .breadcrumb li + li::before {
    content: '>';
    padding: 0 6px;
    color: var(--ilw-breadcrumbs--separator-color);
  }
`;let Po=class{constructor(e){this._host=e,this._observer=new MutationObserver(()=>{this._host.requestUpdate()}),e.addController(this)}_refreshInternal(){var o;const e=Array.from(this._host.children),t=Array.from(((o=this._host.shadowRoot)==null?void 0:o.querySelectorAll("slot"))??[]);for(const i of t)e.length>0&&i.assign(e.shift())}hostUpdated(){this._refreshInternal()}hostConnected(){this._observer.observe(this._host,{childList:!0})}hostDisconnected(){this._observer.disconnect()}disconnect(){this._observer.disconnect()}};var Lo=Object.defineProperty,Mo=Object.getOwnPropertyDescriptor,Tt=(n,e,t,o)=>{for(var i=o>1?void 0:o?Mo(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Lo(e,t,i),i};let Ne=class extends y{constructor(){super(),this.label="Breadcrumbs",this.width="",this.theme="",this._observer=new Po(this)}static get styles(){return To}get outerWidth(){return this.width==="full"||this.width==="auto"?"fixed":this.width==="page"?"page":""}render(){return h`
      <nav aria-label=${this.label} class="breadcrumb ${this.outerWidth}">
        <ol>
          ${ei(Array.from(this.children),()=>h`<li><slot></slot></li>`)}
        </ol>
      </nav>
    `}};Ne.shadowRootOptions={...y.shadowRootOptions,slotAssignment:"manual"};Tt([s({type:String})],Ne.prototype,"label",2);Tt([s({type:String})],Ne.prototype,"width",2);Tt([s({type:String})],Ne.prototype,"theme",2);Ne=Tt([x("ilw-breadcrumbs")],Ne);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ui={ATTRIBUTE:1},ti=n=>(...e)=>({_$litDirective$:n,values:e});let ii=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,o){this._$Ct=e,this._$AM=t,this._$Ci=o}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const j=ti(class extends ii{constructor(n){var e;if(super(n),n.type!==Ui.ATTRIBUTE||n.name!=="class"||((e=n.strings)==null?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(n){return" "+Object.keys(n).filter(e=>n[e]).join(" ")+" "}update(n,[e]){var o,i;if(this.st===void 0){this.st=new Set,n.strings!==void 0&&(this.nt=new Set(n.strings.join(" ").split(/\s/).filter(r=>r!=="")));for(const r in e)e[r]&&!((o=this.nt)!=null&&o.has(r))&&this.st.add(r);return this.render(e)}const t=n.element.classList;for(const r of this.st)r in e||(t.remove(r),this.st.delete(r));for(const r in e){const l=!!e[r];l===this.st.has(r)||(i=this.nt)!=null&&i.has(r)||(l?(t.add(r),this.st.add(r)):(t.remove(r),this.st.delete(r)))}return re}}),Io='@layer base{:host{--ilw-call-to-action--font: var(--il-font-sans);--ilw-call-to-action--padding-top: 6.25rem;--ilw-call-to-action--padding-right: 30px;--ilw-call-to-action--padding-bottom: 5.75rem;--ilw-call-to-action--padding-left: 30px;--ilw-call-to-action--content-max-width: 814px;--ilw-call-to-action--content-padding: 8px;--ilw-call-to-action--content-padding-column: 8px 20px;--ilw-call-to-action--icon-margin: 2rem;--ilw-call-to-action--icon-width: 8rem;--ilw-call-to-action--icon-height: 6.5rem;--root-page-width: calc(100vw - (100vw - 100%)) }}:host{display:block;container-type:inline-size;contain:layout;color:var(--ilw-color--text);font-family:var(--ilw-call-to-action--font)}:host([align="center"]){text-align:center}:host([theme="orange-gradient"]),:host([theme="orange"]){--ilw-color--orange--heading: var(--ilw-color--orange--text)}.call-to-action{display:flex;flex-direction:row;justify-content:center;background:var(--ilw-color--background);padding-top:var(--ilw-call-to-action--padding-top);padding-right:var(--ilw-call-to-action--padding-right);padding-bottom:var(--ilw-call-to-action--padding-bottom);padding-left:var(--ilw-call-to-action--padding-left);column-gap:var(--ilw-call-to-action--icon-margin);row-gap:var(--ilw-call-to-action--icon-margin)}.call-to-action.fixed{left:50%;margin-left:-50vw;margin-right:-50vw;padding-left:0;padding-right:0;position:relative;right:50%;width:100vw}.call-to-action-icon{display:none;color:var(--ilw-color--text);max-width:var(--ilw-call-to-action--icon-width);max-height:var(--ilw-call-to-action--icon-height);flex:1}.graphic .call-to-action-icon{display:block}.call-to-action-content{max-width:var(--ilw-call-to-action--content-max-width);flex:1;padding:var(--ilw-call-to-action--content-padding)}@container (width <= 650px){.call-to-action{flex-direction:column;align-items:center}.call-to-action-content{padding:var(--ilw-call-to-action--content-padding-column)}}';var jo=Object.defineProperty,Ro=Object.getOwnPropertyDescriptor,st=(n,e,t,o)=>{for(var i=o>1?void 0:o?Ro(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&jo(e,t,i),i};let Ue=class extends y{constructor(){super(),this.theme="",this.align="",this.width="",this._hasGraphic=void 0,this.theme="gray",this.align="left",this.width="auto",this._hasGraphic=!1}static get styles(){return _(Io)}_slotsChanged(){var e,t,o;if((o=(t=(e=this.shadowRoot)==null?void 0:e.querySelector("slot[name=icon]"))==null?void 0:t.assignedElements())!=null&&o.length){this._hasGraphic=!0;return}this._hasGraphic=!1}render(){const e={"call-to-action":!0,graphic:!!this._hasGraphic,fixed:this.width==="full",page:this.width==="page"};return h`
            <div class=${j(e)}>
                <div class="call-to-action-icon">
                    <slot name="icon" @slotchange=${this._slotsChanged}></slot>
                </div>
                <div class="call-to-action-content">
                    <slot></slot>
                </div>
            </div>
        `}};st([s()],Ue.prototype,"theme",2);st([s()],Ue.prototype,"align",2);st([s()],Ue.prototype,"width",2);st([U()],Ue.prototype,"_hasGraphic",2);Ue=st([x("ilw-call-to-action")],Ue);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Di=Symbol.for(""),No=n=>{if((n==null?void 0:n.r)===Di)return n==null?void 0:n._$litStatic$},ki=(n,...e)=>({_$litStatic$:e.reduce((t,o,i)=>t+(r=>{if(r._$litStatic$!==void 0)return r._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${r}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})(o)+n[i+1],n[0]),r:Di}),$i=new Map,Uo=n=>(e,...t)=>{const o=t.length;let i,r;const l=[],a=[];let c,d=0,p=!1;for(;d<o;){for(c=e[d];d<o&&(r=t[d],(i=No(r))!==void 0);)c+=i+e[++d],p=!0;d!==o&&a.push(r),l.push(c),d++}if(d===o&&l.push(e[o]),p){const u=l.join("$$lit$$");(e=$i.get(u))===void 0&&(l.raw=l,$i.set(u,e=l)),t=a}return n(e,...t)},Do=Uo(h);/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fi="important",Fo=" !"+Fi,De=ti(class extends ii{constructor(n){var e;if(super(n),n.type!==Ui.ATTRIBUTE||n.name!=="style"||((e=n.strings)==null?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(n){return Object.keys(n).reduce((e,t)=>{const o=n[t];return o==null?e:e+`${t=t.includes("-")?t:t.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(n,[e]){const{style:t}=n.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(e)),this.render(e);for(const o of this.ft)e[o]==null&&(this.ft.delete(o),o.includes("-")?t.removeProperty(o):t[o]=null);for(const o in e){const i=e[o];if(i!=null){this.ft.add(o);const r=typeof i=="string"&&i.endsWith(Fo);o.includes("-")||r?t.setProperty(o,r?i.slice(0,-11):i,r?Fi:""):t[o]=i}}return re}}),Bo='@layer base{:host{--ilw-card--margin-top: 0;--ilw-card--margin-bottom: 0;--ilw-card--aspect-ratio: 16/10;--ilw-card--content-padding-top: 2.5rem;--ilw-card--content-padding-right: 2rem;--ilw-card--content-padding-bottom: 2rem;--ilw-card--content-padding-left: 2rem;--ilw-card--font-size: 1.2rem;--ilw-card--heading--font-size: 1.45em;--ilw-card--icon-width: 120px;--ilw-card--icon-height: 80px;--ilw-card--clickable--heading-size: 1.34rem;--ilw-card--clickable--content-padding-top: 1.75rem;--ilw-card--text-color: var(--ilw-color--text);--ilw-card--heading-color: var(--ilw-color--heading);--ilw-card--hover--text-color: var(--ilw-color--text);--ilw-card--hover--heading-color: var(--ilw-color--heading);--ilw-card--clickable--heading-color: var(--ilw-card--heading-color);--ilw-button--background-color: var(--ilw-color--control);--ilw-button--foreground-color: var(--ilw-color--control-text);--ilw-button--border-color: var(--ilw-color--control-text);--ilw-button--focused-background-color: var(--ilw-color--control-text);--ilw-button--focused-foreground-color: var(--ilw-color--control);--ilw-button--focused-border-color: var(--ilw-color--control)}:host([theme="gray"]){--ilw-card--heading-color: var(--il-blue);--ilw-card--text-color: var(--il-storm-darker-1);--ilw-card--clickable--heading-color: var(--il-altgeld)}:host([theme="blue"]){--ilw-card--heading-color: #fff;--ilw-card--text-color: #fff;--ilw-card--clickable--heading-color: #fff;--ilw-card--hover--heading-color: var(--il-orange);--ilw-card--hover--text-color: var(--ilw-text--color)}:host([theme="orange"]){--ilw-card--heading-color: #fff;--ilw-card--text-color: var(--il-blue);--ilw-card--clickable--heading-color: #fff;--ilw-card--hover--heading-color: var(--il-orange);--ilw-card--hover--text-color: var(--ilw-text--color)}:host([theme="blue-gradient"]){--ilw-card--heading-color: #fff;--ilw-card--text-color: #fff;--ilw-card--clickable--heading-color: #fff;--ilw-card--hover--heading-color: var(--il-orange);--ilw-card--hover--text-color: var(--ilw-text--color)}:host([theme="orange-gradient"]){--ilw-card--heading-color: var(--il-blue);--ilw-card--text-color: var(--il-blue);--ilw-card--clickable--heading-color: var(--il-blue);--ilw-card--hover--heading-color: var(--il-orange);--ilw-card--hover--text-color: var(--ilw-text--color)}}:host{--ilw-color--white--heading: var(--il-orange);--ilw-color--heading: var(--ilw-color--white--heading);display:flex;flex-direction:column;box-sizing:border-box;border:1px solid var(--ilw-color--border);background:var(--ilw-color--background);margin-top:var(--ilw-card--margin-top);margin-bottom:var(--ilw-card--margin-bottom);color:var(--ilw-color--text)}.theme-white{--ilw-color--white--heading: var(--il-orange)}:host[align=center]{text-align:center}.card{position:relative;flex:1;display:flex;flex-direction:column;justify-content:stretch}.card-graphic{display:none;position:relative;order:0}.graphic .card-graphic{display:block;min-height:var(--ilw-card--icon-height)}.card-icon{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:var(--ilw-card--icon-height);line-height:1}.card-icon ::slotted(*){max-height:var(--ilw-card--icon-height);max-width:var(--ilw-card--icon-width)}.force-ratio .card-graphic{aspect-ratio:var(--ilw-card--aspect-ratio);width:100%}.force-ratio .card-graphic ::slotted([slot="image"]){aspect-ratio:var(--ilw-card--aspect-ratio);width:100%!important;object-fit:cover}.card-image ::slotted(*){width:100%!important}.card-content{font-size:var(--ilw-card--font-size);padding:var(--ilw-card--content-padding-top) var(--ilw-card--content-padding-right) var(--ilw-card--content-padding-bottom) var(--ilw-card--content-padding-left);flex:1;order:1}.card-content ::slotted(:first-child){margin-top:0}.card-content ::slotted(:last-child){margin-bottom:0}.has-footer .card-content{padding-bottom:0}:host([clickable]) .card-content{padding-top:var(--ilw-card--clickable--content-padding-top)}.icon-only .card-content{padding-top:0}.card-footer{padding:0 var(--ilw-card--content-padding-right) var(--ilw-card--content-padding-bottom) var(--ilw-card--content-padding-left);order:2}.card-footer.empty{display:none}';var qo=Object.defineProperty,Wo=Object.getOwnPropertyDescriptor,X=(n,e,t,o)=>{for(var i=o>1?void 0:o?Wo(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&qo(e,t,i),i};let H=class extends y{constructor(){super(),this.theme="white",this.clickable=!1,this.align="left",this.aspectRatio="",this.tag="article",this._hasGraphic=!1,this._iconOnly=!1,this._hasFooter=!1,this.articleTag=ki`article`,this.divTag=ki`div`}static get styles(){return _(Bo)}_click(e){var o;const t=e.target;t.tagName!=="A"&&t.tagName!=="BUTTON"&&((o=this.querySelector("a"))==null||o.click())}_slotsChanged(){var o,i;const e=this.shadowRoot;if(!e)return;const t=e.querySelector("slot[name=footer]");if(this._hasFooter=(t==null?void 0:t.assignedElements().length)>0,((o=e.querySelector("slot[name=image]"))==null?void 0:o.assignedElements().length)>0){this._hasGraphic=!0;return}if(((i=e.querySelector("slot[name=icon]"))==null?void 0:i.assignedElements().length)>0){this._iconOnly=!0,this._hasGraphic=!0;return}this._hasGraphic=!1}connectedCallback(){super.connectedCallback()}render(){const e={card:!0,"force-ratio":!!this.aspectRatio,graphic:this._hasGraphic,"icon-only":this._iconOnly,"has-footer":this._hasFooter};e[`theme-${this.theme}`]=!0;const t={"--ilw-card--aspect-ratio":this.aspectRatio?this.aspectRatio:null};let o=this.tag==="div"?this.divTag:this.articleTag;return Do`
            <${o} class=${j(e)} style=${De(t)}
                         @click=${this.clickable?this._click:null}>
                <div class="card-content">
                    <slot></slot>
                </div>
                <div class="card-graphic">
                    <div class="card-image">
                        <slot
                            name="image"
                            @slotchange=${this._slotsChanged}
                        ></slot>
                    </div>
                    <div class="card-icon">
                        <slot
                            name="icon"
                            @slotchange=${this._slotsChanged}
                        ></slot>
                    </div>
                </div>
                <div class="card-footer ${this._hasFooter?"":"empty"}" @slotchange=${this._slotsChanged}>
                    <slot name="footer"></slot>
                </div>
            </${o}>
        `}};X([s({type:String})],H.prototype,"theme",2);X([s({type:Boolean})],H.prototype,"clickable",2);X([s({type:String})],H.prototype,"align",2);X([s({type:String})],H.prototype,"aspectRatio",2);X([s({type:String})],H.prototype,"tag",2);X([U()],H.prototype,"_hasGraphic",2);X([U()],H.prototype,"_iconOnly",2);X([U()],H.prototype,"_hasFooter",2);H=X([x("ilw-card")],H);const Ho='span:before{font-family:ilw-icon!important;font-style:normal;font-weight:400!important;font-variant:normal;text-transform:none;line-height:1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}span.ilw-icon-youtube:before{content:""}span.ilw-icon-youtube-line:before{content:""}span.ilw-icon-yelp:before{content:""}span.ilw-icon-yelp-line:before{content:""}span.ilw-icon-x:before{content:""}span.ilw-icon-x-line:before{content:""}span.ilw-icon-workshop:before{content:""}span.ilw-icon-workshop-line:before{content:""}span.ilw-icon-whatsapp:before{content:""}span.ilw-icon-whatsapp-line:before{content:""}span.ilw-icon-weibo:before{content:""}span.ilw-icon-weibo-line:before{content:""}span.ilw-icon-website:before{content:""}span.ilw-icon-website-line:before{content:""}span.ilw-icon-volume:before{content:""}span.ilw-icon-volume-line:before{content:""}span.ilw-icon-video:before{content:""}span.ilw-icon-video-line:before{content:""}span.ilw-icon-user:before{content:""}span.ilw-icon-user-line:before{content:""}span.ilw-icon-unit:before{content:""}span.ilw-icon-unit-line:before{content:""}span.ilw-icon-twitter:before{content:""}span.ilw-icon-twitter-line:before{content:""}span.ilw-icon-trash:before{content:""}span.ilw-icon-trash-line:before{content:""}span.ilw-icon-training:before{content:""}span.ilw-icon-training-line:before{content:""}span.ilw-icon-tiktok:before{content:""}span.ilw-icon-tiktok-line:before{content:""}span.ilw-icon-tickets:before{content:""}span.ilw-icon-tickets-line:before{content:""}span.ilw-icon-threads:before{content:""}span.ilw-icon-threads-line:before{content:""}span.ilw-icon-team:before{content:""}span.ilw-icon-team-line:before{content:""}span.ilw-icon-substack:before{content:""}span.ilw-icon-substack-line:before{content:""}span.ilw-icon-submit:before{content:""}span.ilw-icon-submit-line:before{content:""}span.ilw-icon-students:before{content:""}span.ilw-icon-students-line:before{content:""}span.ilw-icon-staff:before{content:""}span.ilw-icon-staff-line:before{content:""}span.ilw-icon-spotify:before{content:""}span.ilw-icon-spotify-line:before{content:""}span.ilw-icon-snapchat:before{content:""}span.ilw-icon-snapchat-line:before{content:""}span.ilw-icon-sitemap:before{content:""}span.ilw-icon-sitemap-line:before{content:""}span.ilw-icon-shop:before{content:""}span.ilw-icon-shop-line:before{content:""}span.ilw-icon-settings:before{content:""}span.ilw-icon-settings-line:before{content:""}span.ilw-icon-send:before{content:""}span.ilw-icon-send-line:before{content:""}span.ilw-icon-search:before{content:""}span.ilw-icon-search-line:before{content:""}span.ilw-icon-safety:before{content:""}span.ilw-icon-safety-line:before{content:""}span.ilw-icon-rss:before{content:""}span.ilw-icon-rss-line:before{content:""}span.ilw-icon-resources:before{content:""}span.ilw-icon-resources-line:before{content:""}span.ilw-icon-research:before{content:""}span.ilw-icon-research-line:before{content:""}span.ilw-icon-reddit:before{content:""}span.ilw-icon-reddit-line:before{content:""}span.ilw-icon-program-of-study:before{content:""}span.ilw-icon-program-of-study-line:before{content:""}span.ilw-icon-podcast:before{content:""}span.ilw-icon-podcast-line:before{content:""}span.ilw-icon-play:before{content:""}span.ilw-icon-play-line:before{content:""}span.ilw-icon-plan:before{content:""}span.ilw-icon-plan-line:before{content:""}span.ilw-icon-pinterest:before{content:""}span.ilw-icon-pinterest-line:before{content:""}span.ilw-icon-phone:before{content:""}span.ilw-icon-phone-line:before{content:""}span.ilw-icon-pdf:before{content:""}span.ilw-icon-pdf-line:before{content:""}span.ilw-icon-pay:before{content:""}span.ilw-icon-pay-line:before{content:""}span.ilw-icon-pause:before{content:""}span.ilw-icon-pause-line:before{content:""}span.ilw-icon-partners:before{content:""}span.ilw-icon-partners-line:before{content:""}span.ilw-icon-parent:before{content:""}span.ilw-icon-parent-line:before{content:""}span.ilw-icon-notification:before{content:""}span.ilw-icon-notification-line:before{content:""}span.ilw-icon-next:before{content:""}span.ilw-icon-next-line:before{content:""}span.ilw-icon-news:before{content:""}span.ilw-icon-news-line:before{content:""}span.ilw-icon-more:before{content:""}span.ilw-icon-more-line:before{content:""}span.ilw-icon-menu:before{content:""}span.ilw-icon-menu-line:before{content:""}span.ilw-icon-mastodon:before{content:""}span.ilw-icon-mastodon-line:before{content:""}span.ilw-icon-manual:before{content:""}span.ilw-icon-manual-line:before{content:""}span.ilw-icon-location:before{content:""}span.ilw-icon-location-line:before{content:""}span.ilw-icon-list:before{content:""}span.ilw-icon-list-line:before{content:""}span.ilw-icon-linkedin:before{content:""}span.ilw-icon-linkedin-line:before{content:""}span.ilw-icon-link:before{content:""}span.ilw-icon-link-line:before{content:""}span.ilw-icon-less:before{content:""}span.ilw-icon-less-line:before{content:""}span.ilw-icon-laptop:before{content:""}span.ilw-icon-laptop-line:before{content:""}span.ilw-icon-job:before{content:""}span.ilw-icon-job-line:before{content:""}span.ilw-icon-intranet:before{content:""}span.ilw-icon-intranet-line:before{content:""}span.ilw-icon-instagram:before{content:""}span.ilw-icon-instagram-line:before{content:""}span.ilw-icon-info:before{content:""}span.ilw-icon-info-line:before{content:""}span.ilw-icon-inclusive:before{content:""}span.ilw-icon-inclusive-line:before{content:""}span.ilw-icon-image:before{content:""}span.ilw-icon-image-line:before{content:""}span.ilw-icon-hr:before{content:""}span.ilw-icon-hr-line:before{content:""}span.ilw-icon-hours:before{content:""}span.ilw-icon-hours-line:before{content:""}span.ilw-icon-home:before{content:""}span.ilw-icon-home-line:before{content:""}span.ilw-icon-handbook:before{content:""}span.ilw-icon-handbook-line:before{content:""}span.ilw-icon-grid:before{content:""}span.ilw-icon-grid-line:before{content:""}span.ilw-icon-google-plus:before{content:""}span.ilw-icon-google-plus-line:before{content:""}span.ilw-icon-give:before{content:""}span.ilw-icon-give-line:before{content:""}span.ilw-icon-github:before{content:""}span.ilw-icon-github-line:before{content:""}span.ilw-icon-gift:before{content:""}span.ilw-icon-gift-line:before{content:""}span.ilw-icon-flickr:before{content:""}span.ilw-icon-flickr-line:before{content:""}span.ilw-icon-filter:before{content:""}span.ilw-icon-filter-line:before{content:""}span.ilw-icon-favorite:before{content:""}span.ilw-icon-favorite-line:before{content:""}span.ilw-icon-faq:before{content:""}span.ilw-icon-faq-line:before{content:""}span.ilw-icon-family:before{content:""}span.ilw-icon-family-line:before{content:""}span.ilw-icon-faculty:before{content:""}span.ilw-icon-faculty-line:before{content:""}span.ilw-icon-facebook:before{content:""}span.ilw-icon-facebook-line:before{content:""}span.ilw-icon-exit:before{content:""}span.ilw-icon-exit-line:before{content:""}span.ilw-icon-event:before{content:""}span.ilw-icon-event-line:before{content:""}span.ilw-icon-employment:before{content:""}span.ilw-icon-employment-line:before{content:""}span.ilw-icon-email:before{content:""}span.ilw-icon-email-line:before{content:""}span.ilw-icon-download:before{content:""}span.ilw-icon-download-line:before{content:""}span.ilw-icon-donor:before{content:""}span.ilw-icon-donor-line:before{content:""}span.ilw-icon-document:before{content:""}span.ilw-icon-document-line:before{content:""}span.ilw-icon-directory:before{content:""}span.ilw-icon-directory-line:before{content:""}span.ilw-icon-cost:before{content:""}span.ilw-icon-cost-line:before{content:""}span.ilw-icon-completion-time:before{content:""}span.ilw-icon-completion-time-line:before{content:""}span.ilw-icon-comment:before{content:""}span.ilw-icon-comment-line:before{content:""}span.ilw-icon-clock:before{content:""}span.ilw-icon-clock-line:before{content:""}span.ilw-icon-chevron-up:before{content:""}span.ilw-icon-chevron-up-line:before{content:""}span.ilw-icon-chevron-right:before{content:""}span.ilw-icon-chevron-right-line:before{content:""}span.ilw-icon-chevron-left:before{content:""}span.ilw-icon-chevron-left-line:before{content:""}span.ilw-icon-chevron-down:before{content:""}span.ilw-icon-chevron-down-line:before{content:""}span.ilw-icon-check:before{content:""}span.ilw-icon-check-line:before{content:""}span.ilw-icon-cancel:before{content:""}span.ilw-icon-cancel-line:before{content:""}span.ilw-icon-call:before{content:""}span.ilw-icon-call-line:before{content:""}span.ilw-icon-calendar:before{content:""}span.ilw-icon-calendar-line:before{content:""}span.ilw-icon-bluesky:before{content:""}span.ilw-icon-bluesky-line:before{content:""}span.ilw-icon-bill:before{content:""}span.ilw-icon-bill-line:before{content:""}span.ilw-icon-back:before{content:""}span.ilw-icon-back-line:before{content:""}span.ilw-icon-audio:before{content:""}span.ilw-icon-audio-transcript:before{content:""}span.ilw-icon-audio-transcript-line:before{content:""}span.ilw-icon-audio-line:before{content:""}span.ilw-icon-arrow-up:before{content:""}span.ilw-icon-arrow-up-line:before{content:""}span.ilw-icon-arrow-right:before{content:""}span.ilw-icon-arrow-right-line:before{content:""}span.ilw-icon-arrow-left:before{content:""}span.ilw-icon-arrow-left-line:before{content:""}span.ilw-icon-arrow-down:before{content:""}span.ilw-icon-arrow-down-line:before{content:""}span.ilw-icon-apply-now:before{content:""}span.ilw-icon-apply-now-line:before{content:""}span.ilw-icon-alumni:before{content:""}span.ilw-icon-alumni-line:before{content:""}span.ilw-icon-admissions:before{content:""}span.ilw-icon-admissions-line:before{content:""}';var Vo=Object.defineProperty,Ko=Object.getOwnPropertyDescriptor,at=(n,e,t,o)=>{for(var i=o>1?void 0:o?Ko(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Vo(e,t,i),i};let Fe=class extends y{constructor(){super(),this.icon="",this.type="solid",this.size="",this.alt=""}static get styles(){return _(Ho)}render(){if(!this.icon)return h``;let e={"ilw-icon":!0};this.type==="line"?e[`ilw-icon-${this.icon}-line`]=!0:e[`ilw-icon-${this.icon}`]=!0;let t={};return this.size&&(t["font-size"]=this.size),h`<span
                class=${j(e)}
                style=${De(t)}
                aria-hidden=${this.alt?S:"true"}
                aria-label=${this.alt?this.alt:S}
                role=${this.alt?"img":S}
        ></span>`}};at([s()],Fe.prototype,"icon",2);at([s()],Fe.prototype,"type",2);at([s()],Fe.prototype,"size",2);at([s()],Fe.prototype,"alt",2);Fe=at([x("ilw-icon")],Fe);const Go='@layer base{:host{--ilw-carousel--font: var(--il-font-sans);--ilw-carousel--height: 500px;--ilw-carousel--background: #fff;--ilw-carousel--control--height: 80px;--ilw-carousel--control--compact--height: 46px;--ilw-carousel--control--background: var(--il-storm-95);--ilw-carousel--progress--width: 300px;--ilw-carousel--progress--compact--width: 160px;--ilw-carousel--progress--height: 10px;--ilw-carousel--tabs--column-gap: 10px;--ilw-carousel--tabs--compact--column-gap: 2px;--ilw-carousel--tabs--margin-top: 10px;--ilw-carousel--play--height: 40px;--ilw-carousel--tabs--height: 32px;--ilw-carousel--tabs--width: 32px;--ilw-carousel--tabs--font: 700 20px/20px var(--il-font-sans);--ilw-carousel--button--border-width: 2px;--ilw-carousel--button--compact--border-width: 5px;--ilw-carousel--prevnext--height: 160px;--ilw-carousel--prevnext--width: 46px;--ilw-carousel--prevnext--border-width: 2px;--ilw-carousel--prevnext--line-height: 1;--ilw-carousel--prevnext--font-size: 1rem}}:host([theme="blue"]){--ilw-carousel--control--background: var(--ilw-color--background)}:host{display:block;container-type:inline-size;contain:layout;font-family:var(--ilw-carousel--font)}.carousel-inner,.carousel-inner-single{position:relative;container-type:inline-size;overflow:hidden;background:var(--ilw-carousel--background)}:is(.carousel-inner,.carousel-inner-single).fixed{left:50%;margin-left:-50vw;margin-right:-50vw;padding-left:0;padding-right:0;right:50%;width:100vw;display:block}.slide{visibility:hidden;width:100%;height:100%;box-sizing:border-box;inset:0;z-index:-2;flex:0 0 100%;order:2}.slide.active{visibility:visible;z-index:0;order:1}#carousel-items{width:100%;display:flex;align-items:stretch}.control-position{position:absolute;top:calc(var(--ilw-carousel--height));padding-top:10px;height:var(--ilw-carousel--control--height);left:0;right:0;z-index:1;background:var(--ilw-carousel--control--background)}.control{display:flex;flex-direction:column;align-items:center}#progress-wrap{width:var(--ilw-carousel--progress--width);height:var(--ilw-carousel--progress--height);background:var(--ilw-color--control-text)}#progress{height:var(--ilw-carousel--progress--height);background:var(--ilw-color--control-accent)}.control-inner{display:flex;align-items:center;column-gap:var(--ilw-carousel--tabs--column-gap);margin-top:var(--ilw-carousel--tabs--margin-top)}.compact .control-position{position:absolute;display:flex;justify-content:center;top:calc(var(--ilw-carousel--height));background:none;height:var(--ilw-carousel--control--compact--height);padding:0;left:0;right:0;z-index:1}.compact .control{display:flex;flex-direction:row-reverse;flex-wrap:wrap;align-items:center;justify-content:center;margin:0 auto;padding:0 10px;gap:10px;background:var(--ilw-color--background);border-bottom-left-radius:4px;border-bottom-right-radius:4px}.compact #progress-wrap{width:var(--ilw-carousel--progress--compact--width)}.compact .control-inner{column-gap:var(--ilw-carousel--tabs--compact--column-gap);margin:0}.previous-button,.next-button,.play-pause,.tabs>button{background-color:var(--ilw-color--control);border:var(--ilw-carousel--button--border-width) solid var(--ilw-color--control-text);color:var(--ilw-color--control-text);cursor:pointer;display:inline-block;text-align:center;text-decoration:none}:is(.previous-button,.next-button,.play-pause,.tabs>button):hover,:is(.previous-button,.next-button,.play-pause,.tabs>button):is([data-simulate-hover] *){background-color:var(--ilw-color--control-text);border-color:var(--ilw-color--control-text);color:var(--ilw-color--control);text-decoration:underline}:is(.previous-button,.next-button,.play-pause,.tabs>button):focus-visible,:is(.previous-button,.next-button,.play-pause,.tabs>button):is([data-simulate-focus] *){background-color:var(--ilw-link--focus-background-color);border-color:var(--ilw-link--focus-color);color:var(--ilw-link--focus-color)}:is(.previous-button,.next-button,.play-pause,.tabs>button):active{background-color:var(--ilw-color--control-accent);border-color:var(--ilw-color--control-text);color:var(--ilw-color--control-text)}.compact .play-pause{border-color:var(--ilw-color--control);margin-right:8px}.compact .play-pause:hover,.compact .play-pause:is([data-simulate-hover] *){background-color:var(--ilw-color--text);border-color:var(--ilw-color--text);color:var(--ilw-color--background);text-decoration:none}.compact .play-pause:focus,.compact .play-pause:is([data-simulate-focus] *){background-color:var(--ilw-link--focus-background-color);border-color:var(--ilw-link--focus-color);color:var(--ilw-link--focus-color);outline:var(--ilw-link--focus-outline)}.previous-wrap,.next-wrap{position:absolute;top:calc(var(--ilw-carousel--height)/2 - var(--ilw-carousel--prevnext--height)/2);z-index:1}.previous-wrap{left:0}.next-wrap{right:0}button.previous-button,button.next-button{width:var(--ilw-carousel--prevnext--width);height:var(--ilw-carousel--prevnext--height);background-color:var(--ilw-color--background);border:var(--ilw-carousel--prevnext--border-width) solid var(--ilw-color--background);color:var(--ilw-color--control-text);line-height:var(--ilw-carousel--prevnext--line-height);font-size:var(--ilw-carousel--prevnext--font-size)}:is(button.previous-button,button.next-button):hover,:is(button.previous-button,button.next-button):is([data-simulate-hover] *){text-decoration:none}button.play-pause{height:var(--ilw-carousel--play--height);flex:0 0 var(--ilw-carousel--play--height);overflow:hidden;box-sizing:border-box;display:flex;align-items:center;justify-content:center}button.play-pause svg{width:80%;height:80%}button.play-pause:hover{text-decoration:none}.tabs{display:flex;column-gap:var(--ilw-carousel--tabs--column-gap)}.tabs>button{width:var(--ilw-carousel--tabs--height);height:var(--ilw-carousel--tabs--width);font:var(--ilw-carousel--tabs--font);display:flex;align-items:center;justify-content:center}.tabs>button>span{display:block}.tabs>button:hover,.tabs>button:is([data-simulate-hover] *){background-color:var(--ilw-color--text);border-color:var(--ilw-color--text);color:var(--ilw-color--background);text-decoration:underline}.tabs>button:focus,.tabs>button:is([data-simulate-focus] *){background-color:var(--ilw-color--focus--background);border-color:var(--ilw-color--focus--outline);color:var(--ilw-color--focus--text);outline-color:var(--ilw-color--focus--outline)}.tabs>button:active{background-color:var(--ilw-color--control-accent);border-color:var(--ilw-color--control-text);color:var(--ilw-color--control-text)}.tabs>button.selected{background-color:var(--ilw-color--control-accent);border-color:var(--ilw-color--control-text);color:var(--ilw-color--control-text)}.tabs>button.selected:focus,.tabs>button.selected:is([data-simulate-focus] *){background-color:var(--ilw-link--focus-background-color);border-color:var(--ilw-link--focus-background-color);color:var(--ilw-link--focus-color);outline:var(--ilw-link--focus-outline)}';let Jo=class{constructor(e){this.host=e,this.host.addController(this),this.observer=new MutationObserver(()=>{this.host.requestUpdate()})}_refreshInternal(){var t;let e=Array.from(this.host.children);if((t=this.host)!=null&&t.shadowRoot){let o=Array.from(this.host.shadowRoot.querySelectorAll("slot"));for(let i of o)if(e.length>0){let r=e.shift();r&&i.assign(r)}}}hostUpdated(){this._refreshInternal()}hostConnected(){this.observer.observe(this.host,{childList:!0})}disconnect(){this.observer.disconnect()}};const oi={fromAttribute:n=>!!(n&&n!=="false"),toAttribute:n=>n?"true":"false"};var Yo=Object.defineProperty,Zo=Object.getOwnPropertyDescriptor,R=(n,e,t,o)=>{for(var i=o>1?void 0:o?Zo(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Yo(e,t,i),i};const Qo=h`<svg xmlns="http://www.w3.org/2000/svg" viewBox="5 5 14 14" fill="currentColor"><path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/></svg>`,Xo=h`<svg xmlns="http://www.w3.org/2000/svg" viewBox="5 5 14 14" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>`;let L=class extends y{constructor(){super(),this.label="Highlighted content",this.playing=!0,this.time=10,this.activeslide=1,this.width="",this.controls="",this.height="500px",this.overlay=!1,this._simulatedHover=!1,this._simulatedFocus=!1,this.hasHover=!1,this.userStarted=!1,this.hasControlFocus=!1,this.hasTabFocus=!1,this.hasPlayFocus=!1,this.timer=0,this.updateTime=0,this.animationRequest=0,this.manual=new Jo(this),this.onControlFocus=()=>{this.hasControlFocus=!0},this.offControlFocus=()=>{this.hasControlFocus=!1},this.animationRequestCallback=()=>{if(this.playing){const e=Date.now();if(!this.hasHover&&!this.hasControlFocus&&!this.hasTabFocus){const t=this.time*1e3;this.timer+=e-this.updateTime,this.timer>=t&&(this.next(),this.timer=0),this.updateTime=e,this.progress&&(this.progress.style.width=this.progressWrapper.clientWidth*this.timer/t+"px")}else this.updateTime=e;requestAnimationFrame(this.animationRequestCallback)}}}static get styles(){return _(Go)}togglePlay(){this.playing=!this.playing,this.playing&&(this.userStarted=!0)}next(){this.activeslide=this.activeslide===this.children.length?1:this.activeslide+1}previous(){this.activeslide=this.activeslide===1?this.children.length:this.activeslide-1}activateSlide(e){if(e<1||e>this.children.length)throw new Error("ilw-carousel: attempted to set invalid slide: "+e);this.activeslide=e,this.playing=!1}nextClick(){this.playing=!1,this.next()}previousClick(){this.playing=!1,this.previous()}mouseOver(e){e.target instanceof Node&&this.playPause.contains(e.target)||(this.hasHover=!0)}mouseOut(){this.hasHover=!1}onTabFocus(){this.hasTabFocus=!0}offTabFocus(){this.hasTabFocus=!1}onPlayFocus(){this.hasPlayFocus=!0}offPlayFocus(){this.hasPlayFocus=!1}tabsKeyDown(e){let t=!1;switch(e.key){case"ArrowRight":this.next(),t=!0;break;case"ArrowLeft":this.previous(),t=!0;break;case"Home":this.activateSlide(1),t=!0;break;case"End":this.activateSlide(this.children.length),t=!0;break}t&&(this.tabs[this.activeslide-1].focus(),e.stopPropagation(),e.preventDefault())}hasFocus(){return this.hasControlFocus||this.hasTabFocus||this.hasPlayFocus}connectedCallback(){super.connectedCallback(),window.matchMedia("(prefers-reduced-motion: reduce)").matches&&(this.playing=!1),this.playing&&(this.animationRequest=requestAnimationFrame(this.animationRequestCallback))}update(e){super.update(e),e.has("playing")&&this.playing&&(this.animationRequest&&cancelAnimationFrame(this.animationRequest),this.updateTime=Date.now(),this.animationRequest=requestAnimationFrame(this.animationRequestCallback))}updated(e){super.updated(e);for(let t of Array.from(this.querySelectorAll("ilw-slide a")))t.addEventListener("focus",this.onControlFocus),t.addEventListener("focusout",this.offControlFocus)}render(){let e=!!this.getAttribute("data-simulated-hover"),t=!!this.getAttribute("data-simulated-focus"),o=this.children.length;const i=[],r=[],l=this.activeslide,{prev:a,next:c}=this.determinePrevNext(o,l);let d="",p="";for(let f=1;f<=o;f++){const k=this.children.item(f-1);k.setAttribute("overlay",this.overlay?"true":"false"),k.setAttribute("controls",this.controls),f===l?k.setAttribute("aria-hidden","false"):k.setAttribute("aria-hidden","true"),k.removeAttribute("single");let C=()=>this.activateSlide(f),z=k.querySelector("h2, h3, h4, h5, h6"),O=z?z.textContent:"";a===f?d=O:c===f&&(p=O);let N=`Slide ${f} of ${o}`;O&&(N+=`: ${O}`),i.push(h` <button
                    id="tab-${f}"
                    type="button"
                    role="tab"
                    aria-label=${N}
                    aria-controls="slide-${f}"
                    aria-selected=${f===l}
                    class=${f===l?"selected":S}
                    tabindex=${f===l?S:"-1"}
                    @click=${C}
                    @focusin=${this.onTabFocus}
                    @focusout=${this.offTabFocus}
                    @keydown=${this.tabsKeyDown}
                >
                    <span>${f}</span>
                </button>`);let B={slide:!0,active:f===l,prev:f===a,next:f===c};r.push(h` <div
                    id="slide-${f}"
                    class=${j(B)}
                    role="tabpanel"
                    aria-roledescription="slide"
                    aria-label=${`${f} of ${o}`}
                >
                    <slot></slot>
                </div>`)}if(r.length<2)return this.renderOne(r);const u={"carousel-inner":!0,fixed:this.width==="full",compact:this.controls==="compact"},b={"--ilw-carousel--height":this.height};return h`
            <section
                style=${De(b)}
                class=${j(u)}
                aria-roledescription="carousel"
                aria-label=${this.label}
                @mouseover=${this.mouseOver}
                @mouseout=${this.mouseOut}
                data-simulate-hover=${e?"true":S}
                data-simulate-focus=${t?"true":S}
            >
                <div class="control-position">
                    <div class="control">
                        <div class="control-inner">
                            <button
                                type="button"
                                class="play-pause"
                                aria-label=${this.playing?"Stop slides":"Start slides"}
                                @click=${this.togglePlay}
                                @focusin=${this.onPlayFocus}
                                @focusout=${this.offPlayFocus}
                            >
                                ${this.playing?Xo:Qo}
                            </button>
                            <div class="tabs" role="tablist" aria-label="Slide Selector">${i}</div>
                        </div>
                    </div>
                </div>
                <div class="previous-wrap">
                    <button
                        type="button"
                        class="previous-button"
                        aria-label="Previous Slide ${d}"
                        aria-controls="carousel-items"
                        @click=${this.previousClick}
                        @focusin=${this.onControlFocus}
                        @focusout=${this.offControlFocus}
                    >
                        <ilw-icon icon="back" size="32px"></ilw-icon>
                    </button>
                </div>
                <div class="next-wrap">
                    <button
                        type="button"
                        class="next-button"
                        aria-label="Next Slide ${p}"
                        aria-controls="carousel-items"
                        @click=${this.nextClick}
                        @focusin=${this.onControlFocus}
                        @focusout=${this.offControlFocus}
                    >
                        <ilw-icon icon="next" size="32px"></ilw-icon>
                    </button>
                </div>
                <div id="carousel-items">${r}</div>
            </section>
        `}renderOne(e){for(let i of this.children)i.setAttribute("single","true");const t={"carousel-inner-single":!0,fixed:this.width==="full"},o={"--ilw-carousel--height":this.height};return h`
            <div class=${j(t)} style=${De(o)}>
                <div id="carousel-items">
                    <slot></slot>
                </div>
            </div>
        `}determinePrevNext(e,t){return e<2?{prev:0,next:0}:e===2?{prev:3-t,next:3-t}:{prev:t===1?e:t-1,next:t===e?1:t+1}}};L.shadowRootOptions={...y.shadowRootOptions,slotAssignment:"manual"};R([s()],L.prototype,"label",2);R([s({reflect:!0,type:Boolean,converter:oi})],L.prototype,"playing",2);R([s({type:Number})],L.prototype,"time",2);R([s({type:Number,reflect:!0})],L.prototype,"activeslide",2);R([s()],L.prototype,"width",2);R([s()],L.prototype,"controls",2);R([s()],L.prototype,"height",2);R([s({type:Boolean})],L.prototype,"overlay",2);R([he("#progress")],L.prototype,"progress",2);R([he("#progress-wrap")],L.prototype,"progressWrapper",2);R([he(".play-pause")],L.prototype,"playPause",2);R([Ii("[role=tab]")],L.prototype,"tabs",2);R([he("#carousel-items")],L.prototype,"carouselItems",2);L=R([x("ilw-carousel")],L);const en="@layer base{:host{--ilw-slide--font: 700 2rem/1.3 var(--il-font-sans);--ilw-slide--paragraph-font: 500 1.125rem/1.5 var(--il-font-sans);--ilw-slide--text-color: #000;--ilw-slide--overlay--text-color: #fff;--ilw-slide--content-width: 500px;--ilw-slide--content-extra-padding: 1.125rem;--ilw-slide--compact--content-extra-padding: 1rem;--ilw-slide--overlay--padding: 1.5rem;--ilw-slide--overlay--left: 8vw;--ilw-slide--overlay--font: 700 2.25rem/1 var(--il-font-sans);--ilw-slide--overlay--background: radial-gradient(rgba(0, 0, 0, .94), rgba(0, 0, 0, .35));--ilw-slide--shadow-color: rgba(0, 0, 0, 1);--ilw-slide--overlay--paragraph-font: 500 1.25rem/1.5 var(--il-font-sans)}}:host{display:block;width:100%}.image{border-bottom:1px solid var(--ilw-color--background)}.image ::slotted(img){width:100%;height:var(--ilw-carousel--height);object-fit:cover;display:block}.slide-inner{display:flex;flex-direction:column-reverse;background:var(--ilw-carousel--background, #fff);position:relative}.content-wrap{display:flex;justify-content:center;flex-wrap:wrap;padding:calc(var(--ilw-carousel--control--height) + var(--ilw-slide--content-extra-padding)) 1rem 1rem}.compact .content-wrap{padding:calc(var(--ilw-carousel--control--compact--height) + var(--ilw-slide--compact--content-extra-padding)) 1rem 1rem}.single .content-wrap{padding-top:1rem}.content{flex:0 1 var(--ilw-slide--content-width);max-width:var(--ilw-slide--content-width)}@media screen and (min-width: 768px){.overlay{padding-bottom:calc(var(--ilw-carousel--control--height) + 10px)}.overlay .content-wrap{padding:0;position:absolute;display:block;left:var(--ilw-slide--overlay--left);top:calc(var(--ilw-carousel--height) / 6)}.single.overlay{padding-bottom:0}.overlay .content{background:var(--ilw-slide--overlay--background);padding:var(--ilw-slide--overlay--padding)}}";var tn=Object.defineProperty,on=Object.getOwnPropertyDescriptor,ct=(n,e,t,o)=>{for(var i=o>1?void 0:o?on(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&tn(e,t,i),i};let Be=class extends y{constructor(){super(),this.theme="",this.overlay=!1,this.single=!1,this.controls=""}static get styles(){return _(en)}render(){const e={"slide-inner":!0,overlay:this.overlay,single:this.single,compact:this.controls==="compact"};return h`
            <div class=${j(e)}>
                <div class="content-wrap">
                    <div class="content">
                        <slot></slot>
                    </div>
                    <div class="overlay-buttons">
                        <slot name="buttons"></slot>
                    </div>
                </div>
                <div class="image">
                    <slot name="image"></slot>
                </div>
            </div>
        `}};ct([s()],Be.prototype,"theme",2);ct([s({type:Boolean,converter:oi})],Be.prototype,"overlay",2);ct([s({type:Boolean,converter:oi})],Be.prototype,"single",2);ct([s()],Be.prototype,"controls",2);Be=ct([x("ilw-slide")],Be);const nn=J`
  div.columns {
    display: flex;
    column-gap: var(--ilw-columns--gap, 0);
  }

  div.columns.fixed {
    margin: 0 var(--ilw-margin--side, 0);
  }

  div.columns > div {
    flex: 1 0 0;
  }

  div.columns.sidebar-left > div:first-child, div.columns.sidebar-right > div:last-child {
    flex: 0 0 var(--ilw-columns--width--sidebar, 280px);
  }

  div.columns.first2 > div:first-child, div.columns.last2 > div:last-child {
    flex: 2 0 0;
  }

  div.columns.first3 > div:first-child, div.columns.last3 > div:last-child {
    flex: 3 0 0;
  }

  div.columns.middle2 > div {
    flex: 2 0 0;
  }

  div.columns.middle2 > div:first-child, div.columns.middle2 > div:last-child  {
    flex: 1 0 0;
  }

  div.columns.reverse {
      flex-direction: row-reverse;
  }

  @media (max-width: 700px) {
    div.columns.reverse {
      flex-direction: column;
    }
  }

  @media (max-width: 700px) {
    div.columns {
      flex-direction: column;
      row-gap: var(--ilw-columns--gap, 0);
    }
  }
  
  @media (max-width: 700px) {
    div.columns.sidebar-left > div:first-child, div.columns.sidebar-right > div:last-child {
      flex: 1 0 0;
    }
  }

  @container (max-width: 700px) {
    div.columns {
      flex-direction: column;
      row-gap: var(--ilw-columns--gap, 0);
    }
  }

  .columns-outer.fixed {
        left:50%;
        margin-left:-50vw;
        margin-right:-50vw;
        padding-left:0;
        padding-right:0;
        position:relative;
        right:50%;
        width:100vw;
        container-type: inline-size;
        contain: layout;
    }
  
  .columns-outer.blue {
        background-color: var(--ilw-color--background);
        color: var(--ilw-color--text);
  }

  .columns-outer.orange {
      background-color: var(--ilw-color--background);
      color: var(--ilw-color--text);
  }

  .columns-outer.blue-gradient {
      background: var(--ilw-color--background);
      color: var(--ilw-color--text);
  }
  .columns-outer.orange-gradient {
      background: var(--ilw-color--background);
      color: var(--ilw-color--text);
  }
  
  .columns-outer.gray {
      background-color: var(--ilw-color--background);
      color: var(--ilw-color--text);
  }

  ::slotted(*) {
    height: 100%;
    box-sizing: border-box;
  }
`;let rn=class{constructor(e){this._host=e,this._observer=new MutationObserver(()=>{this._host.requestUpdate()}),e.addController(this)}_refreshInternal(){const e=Array.from(this._host.children),t=Array.from(this._host.shadowRoot.querySelectorAll("slot"));for(const o of t)e.length>0&&o.assign(e.shift())}hostUpdated(){this._refreshInternal()}hostConnected(){this._observer.observe(this._host,{childList:!0})}hostDisconnected(){this._observer.disconnect()}};var ln=Object.defineProperty,sn=Object.getOwnPropertyDescriptor,Ee=(n,e,t,o)=>{for(var i=o>1?void 0:o?sn(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&ln(e,t,i),i};let V=class extends y{constructor(){super(...arguments),this.theme="",this.mode="",this.width="",this.gap="",this.padding="0 0 40px 0",this.reverse=!1,this._observer=new rn(this)}get _items(){return Array.from(this.children)}get reverseClass(){return this.reverse?"reverse":""}get columnsClass(){return this.mode==="2x1"?"first2":this.mode==="3x1"?"first3":this.mode==="1x2"?"last2":this.mode==="1x3"?"last3":this.mode==="1x2x1"?"middle2":this.mode==="sidebar-left"?"sidebar-left":this.mode==="sidebar-right"?"sidebar-right":""}get paddingStyle(){return this.padding===""?"":`padding: ${this.padding};`}get gapStyle(){return this.gap===""?this.mode==="sidebar-left"||this.mode==="sidebar-right"?"30px":"0":this.gap}get outerWidth(){return this.width==="full"||this.width==="auto"?"fixed":""}get innerWidth(){return this.width==="auto"||this.width==="page"?"fixed":""}render(){return h`
            <style>
                :host {
                    --ilw-columns--gap: ${this.gapStyle};
                }
            </style>
            <div class="columns-outer ${this.theme} ${this.outerWidth}">
                <div class="columns ${this.innerWidth} ${this.columnsClass} ${this.reverseClass}" style="${this.paddingStyle}">
                    ${ei(Array.from(this.children),()=>h`<div><slot></slot></div>`)}
                </div>
            </div>
        `}};V.shadowRootOptions={...y.shadowRootOptions,slotAssignment:"manual"};V.styles=nn;Ee([s({type:String})],V.prototype,"theme",2);Ee([s({type:String})],V.prototype,"mode",2);Ee([s({type:String})],V.prototype,"width",2);Ee([s({type:String})],V.prototype,"gap",2);Ee([s({type:String})],V.prototype,"padding",2);Ee([s({type:Boolean})],V.prototype,"reverse",2);V=Ee([x("ilw-columns")],V);const an=J`

.content {
    background: var(--ilw-color--background, white);
}

    .content.fixed {
        left:50%;
        margin-left:-50vw;
        margin-right:-50vw;
        padding-left:0;
        padding-right:0;
        position:relative;
        right:50%;
        width:100vw;
        max-width: 100%;
    }

    .content.page {
        margin: var(--ilw-content--main-margin, 0);
    }

    .content.transparent {
        --ilw-color--background: transparent;
    }

.content-inner.fixed {
    margin: var(--ilw-content--main-margin, 0);
}

.content-inner.center {
    text-align: center;
}

.content-inner.right {
    text-align: right;
}

.content.introduction .content-inner, .content.lede .content-inner {
    margin: auto;
    max-width: var(--ilw-content--narrow-max-width);
}

.content.introduction .content-padding, .content.lede .content-padding {
    padding: var(--ilw-content--narrow-padding);
}

.content.inset .content-padding {
    padding: var(--ilw-content--inset-padding);
}

.content.lede .content-padding.decoration {
    border-left: 6px solid var(--ilw-color--control-accent);
    border-right: none;
    border-bottom: none;
}

.content.lede .content-inner.right .content-padding.decoration {
    border-left: none;
    border-right: 6px solid var(--ilw-color--control-accent);
    border-bottom: none;
}

.content.lede .content-inner.center .content-padding.decoration {
    border-left: none;
    border-right: none;
}

.content.lede .content-inner.center .content-padding.decoration .bottom-line {
    display: block;
    margin: 0 auto;
    width: 150px;
    padding-top: 10px;
    border-bottom: 6px solid var(--ilw-color--control-accent);
}

.bottom-line { display: none; }
`;var cn=Object.defineProperty,dn=Object.getOwnPropertyDescriptor,pe=(n,e,t,o)=>{for(var i=o>1?void 0:o?dn(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&cn(e,t,i),i};let Z=class extends y{constructor(){super(),this.theme="white",this.transparent=!1,this.mode="",this.align="",this.width="",this.decoration=!1,this.padding="",this.theme="white",this.mode="",this.align="",this.width="",this.padding="",this.decoration=!1}static get styles(){return _(an)}get paddingStyle(){return this.padding==""?"":"padding: "+this.padding+";"}get outerWidth(){return this.width=="full"||this.width=="auto"?"fixed":this.width=="page"?"page":""}get innerWidth(){return this.width=="auto"?"fixed":""}render(){return h`
      <div class="content ${this.mode} ${this.theme} ${this.outerWidth} ${this.transparent?"transparent":""}">
      <div style="${this.paddingStyle}" class="content-inner ${this.innerWidth} ${this.align}">
      <div class="content-padding ${this.decoration?"decoration":""}">
          <slot></slot>
          <div class="bottom-line" role="presentation"></div>
      </div>
      </div>
      </div>
      `}};pe([s({type:String})],Z.prototype,"theme",2);pe([s({type:Boolean})],Z.prototype,"transparent",2);pe([s({type:String})],Z.prototype,"mode",2);pe([s({type:String})],Z.prototype,"align",2);pe([s({type:String})],Z.prototype,"width",2);pe([s({type:Boolean})],Z.prototype,"decoration",2);pe([s({type:String})],Z.prototype,"padding",2);Z=pe([x("ilw-content")],Z);/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Bi=class extends Event{constructor(e,t,o,i){super("context-request",{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t,this.callback=o,this.subscribe=i??!1}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 *//**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Si=class{constructor(e,t,o,i){if(this.subscribe=!1,this.provided=!1,this.value=void 0,this.t=(r,l)=>{this.unsubscribe&&(this.unsubscribe!==l&&(this.provided=!1,this.unsubscribe()),this.subscribe||this.unsubscribe()),this.value=r,this.host.requestUpdate(),this.provided&&!this.subscribe||(this.provided=!0,this.callback&&this.callback(r,l)),this.unsubscribe=l},this.host=e,t.context!==void 0){const r=t;this.context=r.context,this.callback=r.callback,this.subscribe=r.subscribe??!1}else this.context=t,this.callback=o,this.subscribe=i??!1;this.host.addController(this)}hostConnected(){this.dispatchRequest()}hostDisconnected(){this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=void 0)}dispatchRequest(){this.host.dispatchEvent(new Bi(this.context,this.host,this.t,this.subscribe))}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let hn=class{get value(){return this.o}set value(e){this.setValue(e)}setValue(e,t=!1){const o=t||!Object.is(e,this.o);this.o=e,o&&this.updateObservers()}constructor(e){this.subscriptions=new Map,this.updateObservers=()=>{for(const[t,{disposer:o}]of this.subscriptions)t(this.o,o)},e!==void 0&&(this.value=e)}addCallback(e,t,o){if(!o)return void e(this.value);this.subscriptions.has(e)||this.subscriptions.set(e,{disposer:()=>{this.subscriptions.delete(e)},consumerHost:t});const{disposer:i}=this.subscriptions.get(e);e(this.value,i)}clearCallbacks(){this.subscriptions.clear()}};/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let pn=class extends Event{constructor(e,t){super("context-provider",{bubbles:!0,composed:!0}),this.context=e,this.contextTarget=t}},_i=class extends hn{constructor(e,t,o){var i,r;super(t.context!==void 0?t.initialValue:o),this.onContextRequest=l=>{if(l.context!==this.context)return;const a=l.contextTarget??l.composedPath()[0];a!==this.host&&(l.stopPropagation(),this.addCallback(l.callback,a,l.subscribe))},this.onProviderRequest=l=>{if(l.context!==this.context||(l.contextTarget??l.composedPath()[0])===this.host)return;const a=new Set;for(const[c,{consumerHost:d}]of this.subscriptions)a.has(c)||(a.add(c),d.dispatchEvent(new Bi(this.context,d,c,!0)));l.stopPropagation()},this.host=e,t.context!==void 0?this.context=t.context:this.context=t,this.attachListeners(),(r=(i=this.host).addController)==null||r.call(i,this)}attachListeners(){this.host.addEventListener("context-request",this.onContextRequest),this.host.addEventListener("context-provider",this.onProviderRequest)}hostConnected(){this.host.dispatchEvent(new pn(this.context,this.host))}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function un({context:n}){return(e,t)=>{const o=new WeakMap;if(typeof t=="object")return{get(){return e.get.call(this)},set(i){return o.get(this).setValue(i),e.set.call(this,i)},init(i){return o.set(this,new _i(this,{context:n,initialValue:i})),i}};{e.constructor.addInitializer(l=>{o.set(l,new _i(l,{context:n}))});const i=Object.getOwnPropertyDescriptor(e,t);let r;if(i===void 0){const l=new WeakMap;r={get(){return l.get(this)},set(a){o.get(this).setValue(a),l.set(this,a)},configurable:!0,enumerable:!0}}else{const l=i.set;r={...i,set(a){o.get(this).setValue(a),l==null||l.call(this,a)}}}return void Object.defineProperty(e,t,r)}}}/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function gn({context:n,subscribe:e}){return(t,o)=>{typeof o=="object"?o.addInitializer(function(){new Si(this,{context:n,callback:i=>{t.set.call(this,i)},subscribe:e})}):t.constructor.addInitializer(i=>{new Si(i,{context:n,callback:r=>{i[o]=r},subscribe:e})})}}const mn="@layer base{:host{--ilw-filter--width: 350px}}div.parent{display:flex;flex-direction:column;gap:1.5rem;background:var(--il-storm-lighter-4);padding:1.875rem 1.25rem;width:var(--ilw-filter--width)}div.parent #ilw-search-heading ::slotted(*){font-family:var(--il-font-sans);color:var(--il-blue);font-size:1.8125rem;font-style:normal;font-weight:700;line-height:2.1875rem;margin:0;padding-bottom:1.25rem}div.line{width:100%;height:1px;padding-bottom:20px;margin-bottom:10px;border-bottom:1px solid var(--il-storm)}.slider button.slider-button{position:relative;display:inline-flex;align-items:center;background:none;margin:0;padding:4px 2px;border:none;text-decoration:none}.slider button.slider-button:focus{outline:none}.slider button.slider-button:focus-visible{background-color:var(--ilw-color--focus--background);outline:2px solid var(--ilw-color--focus--outline)}.slider button.slider-button .slider-box{display:flex;cursor:pointer;box-sizing:border-box;width:50px;height:25px;padding-top:4px;padding-left:4px;background-color:var(--il-storm-lighter-1);transition:background-color .4s;border-radius:13px}.slider button.slider-button:focus .slider-box{outline:2px solid var(--ilw-color--focus--outline)}.slider button.slider-button .slider-toggle{display:block;border-radius:50%;width:17px;height:17px;background-color:#fff;transition:.4s}.slider button.slider-button .text{color:var(--il-blue);font:normal 400 1.25rem / 1.5rem var(--il-font-sans);margin-left:11px}.slider button.slider-button.expanded .slider-box{background-color:var(--il-altgeld)}.slider button.slider-button.expanded .slider-toggle{transform:translate(25px)}button{background:var(--ilw-color--control);color:var(--ilw-color--control-text);border:2px solid var(--ilw-color--control-text);font:700 1.188rem / 1.25rem var(--il-font-sans);display:inline-block;margin:6px 0;padding:12px 20px;text-align:center;text-decoration:none;border-radius:.25em;letter-spacing:.01em;transition:background-color .3s;cursor:pointer;width:fit-content}button:visited{outline:0;background:var(--ilw-color--control);color:var(--ilw-color--control-text);border:2px solid var(--ilw-color--control-text)}button:hover{outline:0;background:var(--ilw-color--control-text);color:var(--ilw-color--control);border:2px solid var(--ilw-color--control-text);text-decoration:underline}button:focus{background-color:var(--ilw-color--focus--background);color:var(--ilw-color--focus--text);border-color:var(--ilw-color--focus--text);text-decoration:underline;outline:var(--ilw-color--focus--outline)}@media screen and (prefers-reduced-motion: reduce){.slider span,.slider span:before{transition:none}}";class vn extends EventTarget{constructor(){super(),this.items=new Map,this.values=new Map,this.debugLog=!1,this.submit=yt(()=>{this.debug("FilterContext submit",this.getValues()),this.dispatchEvent(new CustomEvent("submit",{detail:{values:this.getValues()}}))},100),this.triggerLayoutUpdate=()=>{this.dispatchEvent(new CustomEvent("layout-update"))},this.dispatchItemUpdate=yt(()=>{this.dispatchEvent(new CustomEvent("item-update",{detail:{values:Object.fromEntries(this.values)}}))},10),this.dispatchAutosubmit=yt(()=>{this.dispatchEvent(new CustomEvent("autosubmit",{detail:{values:this.getValues()}}))},100)}debug(...e){this.debugLog&&console.log("ilw-filter",...e)}getValues(){return Object.fromEntries(Array.from(this.values.entries()).filter(([,e])=>e!==void 0))}get(e){return this.values.get(e)}register(e){if(this.items.has(e.name)){console.warn(`ilw-filter: Item with name ${e.name} already registered, ignoring.`);return}this.items.set(e.name,e),e.value!==void 0&&this.values.get(e.name)===void 0&&this.values.set(e.name,e.value),this.dispatchItemUpdate()}unregister(e){this.items.delete(e.name),this.values.delete(e.name),this.dispatchItemUpdate()}itemUpdated(e,t,o){this.values.get(e)!==t&&(this.debug("FilterContext itemUpdated",e,t),this.values.set(e,t),this.dispatchItemUpdate(),o&&(this.debug("FilterContext autosubmit",e,t),this.dispatchAutosubmit()))}valueUpdated(e){this.debug("FilterContext valueUpdated",e);for(const[i,r]of Object.entries(e)){this.values.set(i,r);const l=this.items.get(i);l&&l.setValue(r)}const t=new URLSearchParams(window.location.search);for(const i of this.values.keys())if(!e.hasOwnProperty(i)){this.values.delete(i);const r=this.items.get(i);r&&(r.value=void 0,r.query&&t.delete(i))}const o=`${window.location.pathname}?${t.toString()}`;window.history.replaceState({},"",o)}}const qi=Symbol("ilw-filter");function yt(n,e){let t=null;return function(...o){const i=()=>{t=null,n(o)};t&&clearTimeout(t),t=setTimeout(i,e)}}var fn=Object.defineProperty,dt=(n,e,t,o)=>{for(var i=void 0,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=l(e,t,i)||i);return i&&fn(e,t,i),i};let Y=class extends y{constructor(){super(),this.name="",this.label="",this.query=!1,this.compact=!1,this.appliedContext=void 0}get id(){return`filter-${this.name}`}setValue(e,t=!0){this.value=e,this.appliedContext?(this.appliedContext.itemUpdated(this.name,e,t),this.query&&t&&setTimeout(()=>{const o=new URLSearchParams(window.location.search),i=this.getAttribute("value");i?o.set(this.name,i):o.delete(this.name);const r=`${window.location.pathname}?${o.toString()}`;window.history.replaceState({},"",r)},1)):console.warn("FilterItem: No context connected, cannot update value.",this.name)}submit(){this.appliedContext?this.appliedContext.submit():console.warn("FilterItem: No context connected, cannot submit values.",this.name)}connect(e){this.appliedContext=e,e.register(this);let t=e.get(this.name);if(e.debug("FilterItem connected",this.tagName,"-",this.name,":",t),t||t===0)this.value=t;else if(this.query){const o=new URLSearchParams(window.location.search).get(this.name);o&&(this.setAttribute("value",o),e.itemUpdated(this.name,this.value,!1))}}disconnect(e){e.unregister(this),this.appliedContext=void 0}connectedCallback(){super.connectedCallback();const e=this.context;e&&this.connect(e)}disconnectedCallback(){const e=this.context;e&&this.disconnect(e),super.disconnectedCallback()}};dt([s()],Y.prototype,"name");dt([s()],Y.prototype,"label");dt([s({type:Boolean})],Y.prototype,"query");dt([s({type:Boolean})],Y.prototype,"compact");dt([gn({context:qi})],Y.prototype,"context");var bn=Object.defineProperty,wn=Object.getOwnPropertyDescriptor,Ce=(n,e,t,o)=>{for(var i=o>1?void 0:o?wn(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&bn(e,t,i),i};let le=class extends y{constructor(){super(),this.context=new vn,this.filters="{}",this.register=[],this.toggle=!1,this.allExpanded=!1,this.itemUpdateListener=()=>{this.dispatchValues("filters")},this.autosubmitListener=()=>{this.dispatchValues("autosubmit")},this.submitListener=()=>{this.dispatchValues("submit"),this.dispatchValues("autosubmit")},this.layoutUpdateListener=yt(()=>{setTimeout(()=>{const e=this.querySelectorAll("ilw-filter-checkboxessimple"),t=e!=null&&e.length?Array.from(e).map(o=>!o.compact||!o.isCollapsed()):[!1];!this.allExpanded&&t.every(o=>o)?this.allExpanded=!0:this.allExpanded&&t.every(o=>!o)&&(this.allExpanded=!1)})},50),this.toggleListener=e=>{var o;const t=((o=e.target.closest("button"))==null?void 0:o.getAttribute("aria-expanded"))!=="true";this.allExpanded=t,this.querySelectorAll("ilw-filter-checkboxessimple").forEach(i=>{t?i.expand():i.collapse()})}}static get styles(){return _(mn)}dispatchValues(e){const t=this.context.getValues(),o=JSON.stringify(t);this.filters!==o&&(this.context.debug("Filter "+e,this.filters,o),this.filters=o),this.dispatchEvent(new CustomEvent(e,{detail:{values:t}}))}connectedCallback(){var e;if(super.connectedCallback(),this.context.addEventListener("item-update",this.itemUpdateListener),this.context.addEventListener("autosubmit",this.autosubmitListener),this.context.addEventListener("submit",this.submitListener),this.context.addEventListener("layout-update",this.layoutUpdateListener),this.filters&&this.filters!=="{}"){this.context.debug("Filter connected filters",this.filters);let t=null;try{t=JSON.parse(this.filters)}catch(o){console.error("Invalid JSON given to ilw-filter when connected",o)}t&&this.context.valueUpdated(t)}this.allExpanded=!!((e=this.toggleElement)!=null&&e.checked)}disconnectedCallback(){this.context.removeEventListener("item-update",this.itemUpdateListener),this.context.removeEventListener("autosubmit",this.autosubmitListener),this.context.removeEventListener("submit",this.submitListener),this.context.addEventListener("layout-update",this.layoutUpdateListener),super.disconnectedCallback()}updated(e){if(super.updated(e),e.has("filters")&&e.get("filters")){this.context.debug("Filter value updated",this.filters);let t=null;try{t=JSON.parse(this.filters)}catch(o){console.error("Invalid JSON given to ilw-filter",o)}t&&this.context.valueUpdated(t)}if(e.has("register")){this.context.debug("Filter register updated",this.register);for(const t of this.register){const o=document.getElementById(t);o instanceof Y?o.connect(this.context):this.context.debug("Filter register item not found",t)}}}toggleResetAll(){window.location.href=window.location.origin+window.location.pathname}renderToggle(){return h`<div class="slider">
            <button
                type="button"
                class="slider-button ${this.allExpanded?"expanded":"collapsed"}"
                aria-expanded=${this.allExpanded?"true":"false"}
                @click=${this.toggleListener}
            >
                <span class="slider-box" aria-hidden="true">
                    <span class="slider-toggle"></span>
                </span>
                <span class="text">
                    ${this.allExpanded?"Collapse All":"Expand All"}
                </span>
            </button>
        </div>`}render(){return h`
            <div class="parent">
                <form
                    id="ilw-filter-form"
                    role="search"
                    aria-labelledby="ilw-search-heading"
                >
                    <div id="ilw-search-heading">
                        <slot name="heading"></slot>
                    </div>
                    ${this.toggle?this.renderToggle():""}
                    <div role="presentation" class="line"></div>
                    <slot></slot>
                </form>
                <button @click=${this.toggleResetAll}>Reset All</button>
            </div>
        `}};Ce([un({context:qi})],le.prototype,"context",2);Ce([s({reflect:!0})],le.prototype,"filters",2);Ce([s({converter:{fromAttribute:n=>{try{return JSON.parse(n)}catch(e){return console.error("Invalid JSON list for register given to ilw-filter",e),[]}},toAttribute(n){return JSON.stringify(n)}}})],le.prototype,"register",2);Ce([s({type:Boolean})],le.prototype,"toggle",2);Ce([he(".slider-button")],le.prototype,"toggleElement",2);Ce([U()],le.prototype,"allExpanded",2);le=Ce([x("ilw-filter")],le);const yn="@layer base{:host{--ilw-filter--width: 350px}}div{width:var(--ilw-filter--width)}input{font:1rem/1.125rem var(--il-font-sans);padding:10px;border:1px solid var(--il-storm);background:url(//cdn.brand.illinois.edu/icons/solid/orange/search.png) no-repeat scroll calc(100% - 10px) 9px;width:var(--ilw-filter--width);background-clip:padding-box;background-size:21px;background-color:#fff}input::placeholder{font-style:italic;color:var(--il-storm)}input:focus{outline:var(--ilw-link--focus-outline)}label.hidden{position:absolute!important;margin:-1px!important;padding:0!important;height:1px!important;width:1px!important;clip:rect(1px,1px,1px,1px)!important;clip-path:inset(50%)!important;overflow:hidden!important}";var xn=Object.defineProperty,kn=Object.getOwnPropertyDescriptor,Pt=(n,e,t,o)=>{for(var i=o>1?void 0:o?kn(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&xn(e,t,i),i};let rt=class extends Y{constructor(){super(),this.placeholder="",this.hideLabel=!1,this.value=void 0,this.inputListener=e=>{const t=e.target;this.setValue(t.value,!1)},this.keydownListener=e=>{e.key=="Enter"&&this.submit()}}static get styles(){return _(yn)}render(){return h`
            <div>
                <label class="${this.hideLabel?"hidden":""}" for=${this.id}>${this.label}</label>
                <input
                    id=${this.id}
                    type="search"
                    placeholder=${this.placeholder}
                    name=${this.name}
                    value=${this.value??""}
                    @input=${this.inputListener}
                    @keydown=${this.keydownListener}
                />
            </div>
        `}};Pt([s()],rt.prototype,"placeholder",2);Pt([s()],rt.prototype,"hideLabel",2);Pt([s({reflect:!0,useDefault:!0})],rt.prototype,"value",2);rt=Pt([x("ilw-filter-search")],rt);var $n=Object.defineProperty,Sn=Object.getOwnPropertyDescriptor,Wi=(n,e,t,o)=>{for(var i=o>1?void 0:o?Sn(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&$n(e,t,i),i};let Wt=class extends Y{constructor(){super(),this.value=void 0,this.valueUpdateListener=e=>{const t=e.target;this.setValue(t.value)}}render(){return h`
            <input
                type="hidden"
                name=${this.name}
                value=${this.value}
                @change=${this.valueUpdateListener}
            />
        `}};Wi([s({reflect:!0,useDefault:!0})],Wt.prototype,"value",2);Wt=Wi([x("ilw-filter-hidden")],Wt);const _n='@layer base;details{padding:.625rem 0}summary{display:flex;margin:0 0 .25rem;padding:0 2px;align-items:center;align-self:stretch;gap:.375rem;font:normal 700 1.125rem / 1.875rem var(--il-font-sans)}summary:hover{cursor:pointer;color:var(--ilw-link--focused-color);text-decoration:underline}summary:hover svg{fill:var(--ilw-link--focused-color)}summary:focus-visible{background:var(--ilw-link--focus-background-color);color:var(--ilw-link--focus-color)}summary svg{width:16px;height:16px;padding:0 20px}summary span{flex-grow:1}details[open] summary svg{transform:rotate(180deg)}div.checkbox{display:flex;column-gap:.375rem;align-items:start;position:relative}div.toggle{display:flex;column-gap:.375rem;align-items:start;position:relative;margin-bottom:10px;padding:2px 0 0 2px}div.toggle.togglefocus{background-color:var(--ilw-link--focus-background-color);box-shadow:0 0 0 3px var(--ilw-link--focus-background-color);outline:2px solid var(--ilw-color--focus--outline)}.group{padding-left:2px}input[type=checkbox]{margin:5px 0 0;padding:0;width:18px;height:18px;box-sizing:border-box;flex:22px 0 0;accent-color:var(--il-blue)}input[type=checkbox]:focus-visible{background-color:var(--ilw-link--focus-background-color);outline-color:var(--il-blue);outline-offset:4px;box-shadow:0 0 0 3px var(--ilw-link--focus-background-color)}label{font:normal 400 1.125rem / 1.875rem var(--il-font-sans);margin:0;cursor:pointer}label.toggle-slider-label{padding-left:5px}.toggle-slider{position:relative;display:inline-block;width:60px;height:28px}.toggle-slider input[type=checkbox]{z-index:10;position:relative;color:transparent;width:60px;height:28px;background:transparent;border:transparent;opacity:0;cursor:pointer}.toggle-slider>input[role=switch]{margin-top:0}.toggle-slider>span .toggle-container{position:absolute;cursor:pointer;background-color:var(--il-storm-lighter-1);transition:.2s;border-radius:28px;inset:0}.toggle-slider>span .toggle-container:before{position:absolute;content:"";height:20px;width:20px;left:4px;bottom:4px;background-color:#fff;transition:.2s;border-radius:50%}.toggle-slider input:checked+span .toggle-container:before{transform:translate(32px)}.toggle-slider input:focus+span span{outline:3px solid var(--il-blue)}.toggle-slider input:checked+span .toggle-container{background-color:var(--il-altgeld)}@media screen and (prefers-reduced-motion: reduce){.toggle-slider span,.toggle-slider span:before{transition:none}}';function Hi(n){return function(e){if(!e)return[];try{if(e.startsWith("[")&&!e.startsWith("[-]")){const t=JSON.parse(e);return Array.isArray(t)&&t.every(o=>typeof o=="string")?t:(console.warn(`${n}: JSON for allValues was not a list of strings. Using empty list.`),[])}if(e.startsWith("{")){const t=JSON.parse(e);return typeof t=="object"&&t!==null?Object.entries(t).map(([o,i])=>typeof i=="string"?[o,i]:(console.warn(`${n}: Value for key ${o} is not a string, skipping.`),null)).filter(o=>!!o):(console.warn(`${n}: JSON for allValues was not an object. Using empty list.`),[])}return e.split("[-]")}catch(t){return console.warn(`${n}: Failed to parse value ${e}, using empty list.`,t),[]}}}var En=Object.defineProperty,Cn=Object.getOwnPropertyDescriptor,Je=(n,e,t,o)=>{for(var i=o>1?void 0:o?Cn(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&En(e,t,i),i};let $e=class extends Y{constructor(){super(),this.value=void 0,this.allValues=void 0,this.toggles=!1,this.valueUpdateListener=()=>{let e=[];Array.from(this.inputs.values()).forEach(t=>{t.checked&&e.push(t.value)}),this.setValue(e.join("[-]"))},this.toggleListener=()=>{var e;(e=this.context)==null||e.triggerLayoutUpdate()}}static get styles(){return _(_n)}isCollapsed(){return!this.details||!this.details.hasAttribute("open")}collapse(){this.details&&this.details.removeAttribute("open")}expand(){this.details&&this.details.setAttribute("open","open")}renderCheckbox(e,t){var l;const o=typeof e=="string"?e:e[0],i=typeof e=="string"?e:e[1];let r=!!((l=this.value)!=null&&l.includes(o));return this.toggles?h`
                <div class="toggle">
                    <div class="toggle-slider">
                        <input
                            type="checkbox"
                            id="${this.id+t}"
                            value="${o}"
                            @input=${this.valueUpdateListener}
                            @focus=${this.focusToggle}
                            @blur=${this.blurToggle}
                            .checked=${r}
                            role="switch"
                        />
                        <span>
                            <span class="toggle-container"></span>
                        </span>
                    </div>
                    <label class="toggle-slider-label" for="${this.id+t}">${i}</label>
                </div>
            `:h`
                <div class="checkbox">
                    <input
                        type="checkbox"
                        id="${this.id+t}"
                        value="${o}"
                        @input=${this.valueUpdateListener}
                        .checked=${r}
                    />
                    <label for="${this.id+t}">${i}</label>
                </div>
            `}renderChevron(){return h`<svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
        >
            <path
                d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
            />
        </svg>`}focusToggle(e){var t,o,i;(i=(o=(t=e.target)==null?void 0:t.parentElement)==null?void 0:o.parentElement)==null||i.classList.add("togglefocus")}blurToggle(e){var t,o,i;(i=(o=(t=e.target)==null?void 0:t.parentElement)==null?void 0:o.parentElement)==null||i.classList.remove("togglefocus")}firstUpdated(){var e;(e=this.renderRoot.querySelector("details"))==null||e.addEventListener("toggle",this.toggleListener)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this.renderRoot.querySelector("details"))==null||e.removeEventListener("toggle",this.toggleListener)}render(){var e,t;return this.compact?h`
                <details>
                    <summary>
                        <span id="${this.id+"-legend"}">${this.label} </span>${this.renderChevron()}
                    </summary>
                    <div class="group" role="group" aria-labelledby="${this.id+"-legend"}">
                        ${(e=this.allValues)==null?void 0:e.map((o,i)=>this.renderCheckbox(o,i))}
                    </div>
                </details>
            `:h`
            <div>
                <div class="legend">
                    <span id="${this.id+"-legend"}">${this.label} </span>${this.renderChevron()}
                </div>
                <div role="group" aria-labelledby="${this.id+"-legend"}">
                    ${(t=this.allValues)==null?void 0:t.map((o,i)=>this.renderCheckbox(o,i))}
                </div>
            </div>
        `}};Je([s({reflect:!0,useDefault:!0})],$e.prototype,"value",2);Je([s({useDefault:!0,converter:{fromAttribute:Hi("ilw-filter-checkboxessimple")}})],$e.prototype,"allValues",2);Je([s({useDefault:!0})],$e.prototype,"toggles",2);Je([Ii("input")],$e.prototype,"inputs",2);Je([he("details")],$e.prototype,"details",2);$e=Je([x("ilw-filter-checkboxessimple")],$e);const An=`@layer base;div.dropdown{display:flex;align-items:center;padding:0;margin:0;flex-direction:column}select{margin:0;border-radius:5px;padding:10px;font:1rem / 1.125rem var(--il-font-sans);background-color:#fff;border:thin var(--il-blue) solid;width:100%;box-sizing:border-box;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-image:url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512' width='18' height='18' ><path fill='%23ff5f05' d='M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z'></path></svg>");background-repeat:no-repeat;background-position-x:calc(100% - 18px);background-position-y:10px}select:focus{background-color:var(--il-storm-lighter-4);outline:3px solid var(--il-altgeld)}label{padding:0 0 .25rem;align-items:center;align-self:stretch;gap:.375rem;font:normal 700 1.125rem / 1.875rem var(--il-font-sans);cursor:pointer}label.hidden{position:absolute!important;margin:-1px!important;padding:0!important;height:1px!important;width:1px!important;clip:rect(1px,1px,1px,1px)!important;clip-path:inset(50%)!important;overflow:hidden!important}`;var zn=Object.defineProperty,On=Object.getOwnPropertyDescriptor,ht=(n,e,t,o)=>{for(var i=o>1?void 0:o?On(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&zn(e,t,i),i};let qe=class extends Y{constructor(){super(),this.placeholder="",this.hideLabel=!1,this.value=void 0,this.allValues=void 0,this.valueUpdateListener=e=>{const t=e.target;this.setValue(t.value)}}static get styles(){return _(An)}renderPlaceholder(e){return e===void 0||e===""?h``:h`<option value="">${e}</option>`}render(){var e;return h`
            <div class="dropdown">
                <label class="${this.hideLabel?"hidden":""}" for=${this.id}>${this.label}</label>
                <select
                    id=${this.id}
                    name=${this.name}
                    @input=${this.valueUpdateListener}
                    value=${ji(this.value)}>
                    ${this.renderPlaceholder(this.placeholder)}
                    ${(e=this.allValues)==null?void 0:e.map(t=>{const o=typeof t=="string"?t:t[0],i=typeof t=="string"?t:t[1];return h`<option ?selected="${this.value===o}" value="${o}">${i}</option>`})}
                </select>
            </div>
        `}};ht([s()],qe.prototype,"placeholder",2);ht([s()],qe.prototype,"hideLabel",2);ht([s({reflect:!0,useDefault:!0})],qe.prototype,"value",2);ht([s({useDefault:!0,converter:{fromAttribute:Hi("ilw-filter-dropdownsimple")}})],qe.prototype,"allValues",2);qe=ht([x("ilw-filter-dropdownsimple")],qe);var Tn='@layer base;:host{display:block}.footer{display:block;container-type:inline-size}.section-container{padding-top:1.875rem;padding-bottom:1.875rem;padding-left:var(--ilw-footer-padding-left);padding-right:var(--ilw-footer-padding-right)}.site.section-container{background-color:var(--il-storm-lighter-4);color:var(--il-blue);border-top:.5rem solid var(--il-blue);padding-bottom:2.125rem}.site.section,.campus.section,.legal.section{margin:0 var(--ilw-margin--side,0)}.section-grid{grid-gap:27px;grid-template-columns:auto;grid-template-areas:"site-name""contact""actions""content";grid-auto-rows:auto auto auto auto;display:grid}.section-grid--no-action{grid-template-areas:"site-name""contact""content";grid-auto-rows:auto auto auto}.section-grid .contact{grid-area:contact}.section-grid .site-name{grid-area:site-name}.section-grid .actions{grid-area:actions;justify-self:start}.section-grid .content{grid-area:content}.campus.section-container{background-color:var(--il-blue);color:#fff;border-top:.5rem solid var(--il-orange)}.campus .logo{margin:0;padding:.75rem .25rem 3.75rem;position:relative}.campus .logo a{width:9.4375rem;height:1.5625rem;display:block;position:relative}.campus .logo a:hover{outline:2px dotted}.campus .logo a:focus svg .illinois,.campus .logo a:focus svg .outline{fill:var(--il-blue)}.campus .logo svg{width:100%;height:100%;display:block;position:relative}.campus svg .illinois{fill:#fff}.campus svg .block-i .fill{fill:var(--il-orange)}.campus svg .block-i .outline{fill:#fff}.campus .sections{grid-gap:2rem 1.25rem;grid-template-columns:1fr;display:grid}@container (width>=650px){.campus .sections{grid-template-columns:1fr 1fr}}@container (width>=1200px){.campus .sections{grid-template-columns:1fr 1fr 1fr}}.campus h3{font:600 1.5rem/1.5 var(--il-font-sans);margin:0 0 .5rem;padding:0}.campus ul{margin:0;padding:0;list-style:none}.campus li{margin:0;padding:.5rem 0;list-style:none}.campus a{color:#fff;font:400 1.125rem/1.5rem var(--il-font-sans);text-decoration:none}.campus a:hover,.campus a:focus{text-decoration:underline}.campus a:hover{color:var(--il-orange)}.campus a:focus{fill:var(--ilw-link--focus-color);background-color:var(--ilw-link--focus-background-color);outline:var(--ilw-link--focus-outline);color:var(--il-blue)}.legal.section-container{background-color:var(--il-blue);color:#fff;border-top:.5rem solid var(--il-industrial-darker-2)}.legal a{color:#fff;font:400 1rem/1 var(--il-font-sans);padding:.3125rem;text-decoration:underline;display:block}.legal a:hover{outline:2px dotted}.legal a:focus{fill:var(--ilw-link--focus-color);background-color:var(--ilw-link--focus-background-color);outline:var(--ilw-link--focus-outline);color:var(--il-blue)}.cookies-button-and-links{flex-direction:column;justify-content:flex-start;align-items:center;gap:1.875rem;display:flex}@container (width>=600px){.cookies-button-and-links{flex-direction:row}}@container (width>=960px){.section-grid{grid-template-columns:1fr 2fr;grid-template-areas:"site-name actions""contact content";grid-auto-rows:auto auto}.section-grid--no-action .content{grid-area:1/2/4/2}.section-grid .actions{justify-self:end}button[slot=cookies-button],a[slot=cookies-button],.ot-sdk-show-settings{background-color:var(--il-industrial-darker-2);color:#fff;font:700 1.188rem / 1.25rem var(--il-font-sans);text-align:center;letter-spacing:.01em;cursor:pointer;border:2px solid #fff;border-radius:.25em;margin:6px 0;padding:12px 20px;text-decoration:none;transition:background-color .3s;display:inline-block}:is(button[slot=cookies-button],a[slot=cookies-button],.ot-sdk-show-settings):visited{background-color:var(--ilw-button--background-color);color:var(--ilw-button--foreground-color);border:2px solid var(--ilw-button--border-color);outline:0}:is(button[slot=cookies-button],a[slot=cookies-button],.ot-sdk-show-settings):hover{color:var(--il-blue);background-color:#fff;outline:0;text-decoration:underline}:is(button[slot=cookies-button],a[slot=cookies-button],.ot-sdk-show-settings):focus{background-color:var(--ilw-link--focus-background-color);color:var(--ilw-link--focus-color);border-color:var(--ilw-link--focus-color);outline:var(--ilw-link--focus-outline);text-decoration:underline}:is(button[slot=cookies-button],a[slot=cookies-button],.ot-sdk-show-settings):active{background-color:var(--ilw-button--active-background-color);color:var(--ilw-button--active-color);border-color:var(--ilw-button--active-border-color);outline:solid var(--ilw-button--active-border-color) 2px}}',Pn=h`<svg role="img" viewBox="0 0 151 26" xmlns="http://www.w3.org/2000/svg">
    <title>Illinois</title>
    <g class="block-i">
      <path class="outline" d="M17.89,6.96V0H0v6.96h3.98v11.93H0v6.96h17.89v-6.96h-3.98V6.96H17.89z M13.91,19.88h2.98v4.97H0.99v-4.97
h2.98c0.55,0,0.99-0.45,0.99-0.99V6.96c0-0.55-0.45-0.99-0.99-0.99H0.99V0.99h15.9v4.97h-2.98c-0.55,0-0.99,0.44-0.99,0.99
v11.93C12.92,19.43,13.36,19.88,13.91,19.88"/>
      <path class="fill" d="M13.91,5.96h2.98V0.99H0.99v4.97h2.98c0.55,0,0.99,0.44,0.99,0.99v11.93c0,0.55-0.45,0.99-0.99,0.99H0.99
v4.97h15.9v-4.97h-2.98c-0.55,0-0.99-0.45-0.99-0.99V6.96C12.92,6.41,13.36,5.96,13.91,5.96"/>
    </g>
    <g class="illinois">
      <path d="M31.89,22.43V3.52h4.16v18.91H31.89z"/>
      <path d="M40.99,22.43V3.52h4.16v15.13h9.43v3.78H40.99z"/>
      <path d="M57.62,22.43V3.52h4.16v15.13h9.43v3.78H57.62z"/>
      <path d="M74.35,22.43V3.52h4.16v18.91H74.35z"/>
      <path d="M96.71,22.43l-9.16-12.02v12.02h-4.11V3.52h3.84l8.86,11.64V3.52h4.11v18.91H96.71z"/>
      <path d="M114.21,22.76c-5.83,0-10.02-4.35-10.02-9.72v-0.05c0-5.38,4.24-9.78,10.08-9.78
c5.83,0,10.02,4.35,10.02,9.72v0.05C124.28,18.35,120.04,22.76,114.21,22.76z M119.93,12.98c0-3.24-2.38-5.94-5.73-5.94
c-3.35,0-5.67,2.65-5.67,5.89v0.05c0,3.24,2.38,5.94,5.73,5.94c3.35,0,5.67-2.65,5.67-5.89V12.98z"/>
      <path d="M128.31,22.43V3.52h4.16v18.91H128.31z"/>
      <path d="M144.06,22.7c-2.86,0-5.75-1-8.02-3.03l2.46-2.94c1.7,1.4,3.48,2.3,5.65,2.3c1.7,0,2.73-0.68,2.73-1.78
v-0.05c0-1.05-0.65-1.59-3.81-2.4c-3.81-0.97-6.27-2.03-6.27-5.78V8.95c0-3.43,2.76-5.7,6.62-5.7c2.76,0,5.11,0.86,7.02,2.4
l-2.16,3.13c-1.67-1.16-3.32-1.86-4.92-1.86c-1.59,0-2.43,0.73-2.43,1.65v0.05c0,1.24,0.81,1.65,4.08,2.49
c3.84,1,6,2.38,6,5.67v0.05C151,20.59,148.14,22.7,144.06,22.7z"/>
    </g>
  </svg>`;function be(n,e,t,o){var i=arguments.length,r=i<3?e:o,l;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(n,e,t,o);else for(var a=n.length-1;a>=0;a--)(l=n[a])&&(r=(i<3?l(r):i>3?l(e,t,r):l(e,t))||r);return i>3&&r&&Object.defineProperty(e,t,r),r}var ie=class extends y{static get styles(){return _(Tn)}constructor(){super(),this.TagName="ilw-footer",this._defaultSource="Illinois_App",this._sectionClasses={"section-grid--no-action":!1},this.source=this._defaultSource,this._data=void 0}connectedCallback(){super.connectedCallback(),this.loadData(),this._utm=this.generateUtm()}async loadData(){let e=await fetch("https://api.brand.illinois.edu/footer");this._data=await e.json()}renderCampusSections(){if(this._data!==void 0)return h`<div class="sections">${this._data.illinois.sections.map(e=>h`<div class="section">
          <h3>${e.label}</h3>
          ${this.renderCampusLinks(e.links)}
        </div>`)}</div>`}renderCampusLinks(e){return h`<ul>${e.map(t=>h`<li><a href="${t.href}?${this._utm}">${t.label}</a></li>`)}</ul>`}renderCampusFooter(){return h`
        <div class="campus section-container">
          <div class="campus section">
            <h2 class="logo">
              <a href="https://illinois.edu/?${this._utm}" aria-label="University of Illinois at Urbana-Champaign">${Pn}</a>
            </h2>
            ${this.renderCampusSections()}
          </div>
        </div>`}renderLegalFooter(){if(this._data!==void 0)return h`
        <div class="legal section-container">
          <div class="legal section">
            <div class="cookies-button-and-links">
              <slot name="cookies-button"></slot>
              <a href="${this._data.illinois.privacy.href}?${this._utm}">${this._data.illinois.privacy.label}</a>
              <a href="${this._data.illinois.copyright.href}?${this._utm}">${this._data.illinois.copyright.label}</a>
              <slot name="legal-link"></slot>
              <a href="${this._data.illinois.accessibility.href}?${this._utm}">${this._data.illinois.accessibility.label}</a>
            </div>
          </div>
        </div>`}renderSiteFooter(){return h`
        <div class="site section-container">
          <div class="site section section-grid ${j(this._sectionClasses)}">
            <div class="site-name">
              <slot name="site-name"></slot>
            </div>
            
            <div class="contact">
              <div class="social">
                <slot name="social"></slot>
              </div>
              <div class="address">
                <slot name="address"></slot>
              </div>
              <div class="primary-unit">
                <slot name="primary-unit"></slot>
              </div>
            </div>
            <div class="actions">
              <slot name="actions"></slot>
            </div>
            <div class="content">
              <slot></slot>
            </div>
          </div>
        </div>`}render(){return h`
        <footer class="footer">
          ${this.renderSiteFooter()}
          ${this.renderCampusFooter()}
          ${this.renderLegalFooter()}
        </footer>
      `}firstUpdated(e){(this._actions===void 0||this._actions.length<=0)&&(this._sectionClasses["section-grid--no-action"]=!0),(this._cookiesButton===void 0||this._cookiesButton.length===0)&&(console.warn("No cookie banner found. Assigning standard Illinois cookie banner."),this.generateCookieBanner()),this.checkSocialDataService(this._social)}checkSocialDataService(e){e===void 0||e.length===0||e.some(t=>t.innerHTML.includes("data-service"))&&console.warn(`ilw-footer: Use of the 'data-service' attribute in social media icons is deprecated.
See https://github.com/web-illinois/ilw-footer/blob/main/README.md for update instructions.`)}generateCookieBanner(){let e=document.createElement("button");e.id="ot-sdk-btn",e.classList.add("ot-sdk-show-settings","ilw-button"),e.setAttribute("slot","cookies-button"),e.innerText="About Cookies";let t=document.getElementsByTagName(this.TagName);if(!t){console.error("footer component not found");return}t[0].appendChild(e);let o=document.createElement("script");o.innerText="function OptanonWrapper() {}",document.head.appendChild(o);let i=document.createElement("script");i.src="https://onetrust.techservices.illinois.edu/scripttemplates/otSDKStub.js",i.id="cookie-js",i.setAttribute("data-domain-script","uiuc"),document.head.appendChild(i)}generateUtm(){return`utm_source=${this.source}&utm_medium=web&utm_campaign=Footer`}};be([s({attribute:!0,reflect:!0})],ie.prototype,"source",void 0),be([s({attribute:!1})],ie.prototype,"_data",void 0),be([s({attribute:!1})],ie.prototype,"_utm",void 0),be([wt({slot:"actions"})],ie.prototype,"_actions",void 0),be([wt({slot:"cookies-button"})],ie.prototype,"_cookiesButton",void 0),be([wt({slot:"social"})],ie.prototype,"_social",void 0),be([s({attribute:!1})],ie.prototype,"_sectionClasses",void 0),customElements.get("ilw-footer")||customElements.define("ilw-footer",ie);const Ln=J`
  ul.grid {
    display: grid;
    list-style: none;
    grid-gap: var(--ilw-grid--gap, 10px);
    margin: 0;
    padding: 0;
  }

  ul.grid li {
    list-style: none;
    display: flex;
    width: 100%;
  }

  ul.grid li > div {
    flex-grow: 1;
  }

  ul.grid.fixed {
    margin: 0 var(--ilw-margin--side, 0);
  }

  .grid-outer {
      background-color: var(--ilw-color--background);
  }

  .grid-outer.fixed {
        left: 50%;
        margin-left: calc(-50vw + 10px);
        margin-right: calc(-50vw + 10px);
        padding-left: 0;
        padding-right: 0;
        position: relative;
        right: 50%;
        width: calc(100vw - 20px);
    }


  ::slotted(*) {
    height: 100%;
    box-sizing: border-box;
  }
`;let Mn=class{constructor(e){this.host=e,this.host.addController(this),this.observer=new MutationObserver(()=>{this.host.requestUpdate()})}_refreshInternal(){var t;let e=Array.from(this.host.children);if((t=this.host)!=null&&t.shadowRoot){let o=Array.from(this.host.shadowRoot.querySelectorAll("slot"));for(let i of o)if(e.length>0){let r=e.shift();r&&i.assign(r)}}}hostUpdated(){this._refreshInternal()}hostConnected(){this.observer.observe(this.host,{childList:!0})}disconnect(){this.observer.disconnect()}};var In=Object.defineProperty,jn=Object.getOwnPropertyDescriptor,Ye=(n,e,t,o)=>{for(var i=o>1?void 0:o?jn(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&In(e,t,i),i};let se=class extends y{constructor(){super(),this.theme="",this.innerwidth="",this.width="",this.gap="",this.padding="",this.manual=new Mn(this),this.theme="",this.innerwidth="250px",this.width="",this.gap="",this.padding="0 0 40px 0"}static get styles(){return Ln}get paddingStyle(){return this.padding==""?"":"padding: "+this.padding+";"}get gapStyle(){return this.gap==""?"10px":this.gap}get templateColumnStyle(){return`grid-template-columns: repeat(auto-fit, minmax(${this.innerwidth}, 1fr));`}get outerWidth(){return this.width=="full"||this.width=="auto"?"fixed":""}get gridWidth(){return this.width=="auto"||this.width=="page"?"fixed":""}render(){return h`
      <style>:host { --ilw-grid--gap: ${this.gapStyle}; } </style>
      <div class="grid-outer ${this.theme} ${this.outerWidth}">
          <ul class="grid ${this.gridWidth}" style="${this.templateColumnStyle} ${this.paddingStyle}">
            ${ei(Array.from(this.children),()=>h`<li><div><slot></slot></div></li>`)}
          </ul>
      </div>
      `}};se.shadowRootOptions={...y.shadowRootOptions,slotAssignment:"manual"};Ye([s()],se.prototype,"theme",2);Ye([s()],se.prototype,"innerwidth",2);Ye([s()],se.prototype,"width",2);Ye([s()],se.prototype,"gap",2);Ye([s()],se.prototype,"padding",2);se=Ye([x("ilw-grid")],se);const Rn='@layer base;:host{display:block}.main{display:grid;margin:0 calc(var(--ilw-margin--side, 0) - 8px)}.full.header .main{grid-template-columns:0px 435px auto auto 355px 0px;grid-template-rows:63px auto auto auto;grid-template-areas:". illinois links links links ." ". identity identity identity search ." "nav nav nav nav nav nav"}.compact.header .main{grid-template-columns:0px auto 60px 0px;grid-template-rows:63px auto;grid-template-areas:". illinois illinois ." ". identity toggle ."}.illinois{grid-area:illinois}.illinois a{all:initial;position:relative;top:-8px;display:block;width:44px;height:51px;overflow:hidden;cursor:pointer}.illinois .block-i{display:block;width:44px;height:51px;position:absolute;top:0;left:0;background:var(--ilw-header--text)}.illinois .block-i svg{display:block;position:absolute;width:22px;height:31px;left:10px;top:10px}.illinois .block-i .outline{fill:#fff}.illinois .block-i .fill{fill:var(--ilw-header--accent)}.illinois .wordmark{display:block;width:379px;height:11px;position:absolute;top:21px;left:55px;z-index:10}.illinois .wordmark svg{display:block;position:relative;width:100%;height:100%;fill:var(--ilw-header--text)}.illinois a:hover .wordmark svg{fill:var(--ilw-header--link-hover)}.illinois a:hover .wordmark:after{content:"";display:block;width:100%;height:1px;background-color:var(--ilw-header--link-hover);position:absolute;bottom:-2px;left:0}header.compact.header .illinois a:focus .block-i svg,header.full.header .illinois a:focus .block-i svg{outline:solid 12px var(--ilw-header--accent);background-color:var(--ilw-header--accent)}.illinois a:focus .wordmark svg{fill:var(--ilw-link--focus-color);background-color:var(--ilw-link--focus-background-color);outline:var(--ilw-link--focus-outline)}.links{grid-area:links}.identity{grid-area:identity;padding-bottom:20px;padding-left:9px}.search{grid-area:search}.nav{grid-area:nav}.menu-toggle{grid-area:toggle;justify-self:end;align-self:center;padding-bottom:20px}.menu-toggle button{all:initial;display:inline-block;cursor:pointer}.menu-toggle .button{all:initial;display:inline-block;position:relative;width:2.25rem;height:2.25rem;background:var(--ilw-header--text);color:#fff;text-transform:uppercase;border-radius:.25rem;cursor:pointer;border:1px solid var(--ilw-header--text)}.menu-toggle button:hover .button{background:#fff;color:var(--ilw-header--text);border:1px solid var(--ilw-header--text)}.menu-toggle button:focus .button{color:var(--ilw-link--focus-color);background-color:var(--ilw-link--focus-background-color);outline:var(--ilw-link--focus-outline)}.menu-toggle .icon{position:absolute;left:.25rem;top:.25rem;display:block;width:1.75rem;height:1.75rem}.menu-toggle .icon svg{position:absolute;left:0;top:0;width:100%;height:100%;fill:currentColor}.menu-toggle .label{position:absolute;top:0;left:0;display:block;width:1px;height:1px;overflow:hidden;text-indent:300%;white-space:nowrap}.menu{display:none;background:#e8e9eb}.expanded.header .menu{display:block}.hide{display:none}@media(min-width:600px){.compact.header .main{grid-template-columns:0px auto 120px 0px;grid-template-rows:63px auto;grid-template-areas:". illinois illinois ." ". identity toggle ."}.illinois a{width:445px}.menu-toggle .button{width:auto}.menu-toggle .label{position:relative;width:auto;height:auto;overflow:visible;text-indent:0;padding:0 .75rem 0 2.25rem;font:600 1.25rem/2.25rem var(--il-font-sans)}}@media(min-width:990px){.search{width:290px;margin-left:auto}}@media(min-width:1200px){.main{margin:0 var(--ilw-margin--side, 0)}.full.header .main{grid-template-columns:0 435px 135px 215px 1fr 0;grid-template-areas:". illinois links links links ." ". identity identity identity search ." "nav nav nav nav nav nav"}}';var Nn=Object.defineProperty,Un=Object.getOwnPropertyDescriptor,ue=(n,e,t,o)=>{for(var i=o>1?void 0:o?Un(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Nn(e,t,i),i};let D=class extends y{constructor(){super(),this.darkModeVisible=!1,this.source="Illinois_App",this.compact=!1,this.expanded=!1,this.menu="",this._menuVisible="",this._hasMenu="",this.handleWindowClick=this.handleWindowClick.bind(this),this.handleWindowKeydown=this.handleWindowKeydown.bind(this),this.handleWindowResize=this.handleWindowResize.bind(this)}static get styles(){return _(Rn)}connectedCallback(){super.connectedCallback(),this.setAttribute("data-initialized","1"),window.addEventListener("click",this.handleWindowClick),window.addEventListener("keydown",this.handleWindowKeydown),window.addEventListener("resize",this.handleWindowResize),this.setCompactModeBasedOnWidth()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this.handleWindowClick),window.removeEventListener("keydown",this.handleWindowKeydown),window.removeEventListener("resize",this.handleWindowResize)}handleWindowClick(e){this.compact&&this.expanded&&!this.contains(e.target)&&(this.expanded=!1)}handleWindowKeydown(e){this.compact&&(e.key==="Escape"&&this.expanded&&(this.expanded=!1),e.key==="Tab"&&this.expanded&&this.handleMobileMenuTabLoop(e))}handleMobileMenuTabLoop(e){const t=this.getMobileMenuFocusables(),o=t[0],i=t[t.length-1],r=this.getDeepActiveElement();this.querySelector("ilw-header-megamenu")!=null||!o||!i||!r||(!e.shiftKey&&r===i&&(e.preventDefault(),o.focus()),e.shiftKey&&r===o&&(e.preventDefault(),i.focus()))}getMobileMenuFocusables(){var i,r;const e=(i=this.shadowRoot)==null?void 0:i.querySelector(".menu-toggle button"),t=["links","search","navigation"],o=e?[e]:[];for(const l of t){const a=(r=this.shadowRoot)==null?void 0:r.querySelector(`slot[name="${l}"]`);if(a)for(const c of a.assignedElements({flatten:!0}))o.push(...this.getFocusableElementsFromNode(c))}return Array.from(new Set(o))}getFocusableElementsFromNode(e){const t=[];e instanceof HTMLElement&&this.isFocusable(e)&&t.push(e);const o=Array.from(e.querySelectorAll(D.FOCUSABLE_SELECTOR));t.push(...o.filter(r=>this.isFocusable(r)));const i=e;if(i.shadowRoot){const r=Array.from(i.shadowRoot.querySelectorAll(D.FOCUSABLE_SELECTOR));t.push(...r.filter(l=>this.isFocusable(l)))}return t}isFocusable(e){return e.disabled||e.hasAttribute("disabled")||e.getAttribute("aria-hidden")==="true"||e.tabIndex<0?!1:e.getClientRects().length>0}getDeepActiveElement(){var t;let e=document.activeElement;for(;(t=e==null?void 0:e.shadowRoot)!=null&&t.activeElement;)e=e.shadowRoot.activeElement;return e}handleWindowResize(){this.setCompactModeBasedOnWidth()}handleToggleClick(){this.expanded=!this.expanded}hasMenuContents(){return this.menu!="none"}getUtmSource(){return this.source||"Illinois_App"}setCompactModeBasedOnWidth(){this.offsetWidth<990?this.compact||(this.compact=!0):this.compact&&(this.compact=!1)}handleDarkModeChange(e){const t=e.target.checked;this.setDarkModeCookie(t),window.dispatchEvent(new CustomEvent("ilw-dark-mode-changed",{detail:{enabled:t}}))}applyTheme(e){document.documentElement.dataset.theme=e?"dark":"light"}setDarkModeCookie(e){document.cookie=`ilw-dark-mode=${e}; path=/;`}getDarkModeCookie(){var e;return((e=document.cookie.split("; ").find(t=>t.startsWith("ilw-dark-mode=")))==null?void 0:e.split("=")[1])==="true"}renderBlockI(){return h`
      <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 34.67">
        <title>Block I</title>
        <path class="outline"
              d="M24 9.33V0H0v9.33h5.33v16H0v9.33h24v-9.33h-5.33v-16H24zm-5.33 17.34h4v6.67H1.33v-6.67h4c.74 0 1.33-.6 1.33-1.33v-16C6.67 8.6 6.07 8 5.33 8h-4V1.33h21.33V8h-4c-.74 0-1.33.6-1.33 1.33v16c0 .74.6 1.34 1.34 1.34z"
        />
        <path class="fill"
              d="M18.67 8h4V1.33H1.33V8h4c.74 0 1.33.6 1.33 1.33v16c0 .74-.6 1.33-1.33 1.33h-4v6.67h21.33v-6.67h-4c-.74 0-1.33-.6-1.33-1.33v-16c0-.73.6-1.33 1.34-1.33z"
        />
      </svg>`}renderWordmark(){return h`<svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 378.6 10.1">
      <title>University of Illinois Urbana-Champaign</title>
      <path d="M376.4.2v5.9L371.5.2h-1.9V10h2.3V4l4.8 6h1.9V.2zM361.1 2.3c.5-.3 1-.4 1.7-.4 1 0 1.8.4 2.5 1.1l1.5-1.3c-.5-.6-1.1-1-1.8-1.3-.7-.3-1.5-.4-2.3-.4-1 0-2 .2-2.8.7-.8.4-1.5 1-1.9 1.8-.5.8-.7 1.6-.7 2.6s.2 1.8.7 2.6c.5.8 1.1 1.4 1.9 1.8.8.4 1.7.6 2.7.6.7 0 1.4-.1 2.1-.3.7-.2 1.3-.5 1.8-.9v-4h-2.1v2.9c-.5.3-1.1.4-1.8.4-.6 0-1.2-.1-1.7-.4-.5-.3-.8-.6-1.1-1.1-.3-.5-.4-1-.4-1.6 0-.6.1-1.2.4-1.6.5-.5.8-.9 1.3-1.2zM352.4.2h2.3V10h-2.3zM343.8.2l-4.4 9.8h2.3l.9-2.1h4.5l.9 2.1h2.4L346 .2h-2.2zm-.4 5.9 1.6-3.8 1.6 3.8h-3.2zM336.7.6c-.6-.3-1.4-.4-2.3-.4h-4.2V10h2.3V7.3h2c.9 0 1.6-.1 2.3-.4.6-.3 1.1-.7 1.5-1.2.3-.5.5-1.2.5-1.9s-.2-1.4-.5-1.9c-.4-.6-.9-1-1.6-1.3zm-.8 4.4c-.4.3-.9.4-1.6.4h-1.8V2h1.8c.7 0 1.2.1 1.6.4.4.3.5.7.5 1.3 0 .6-.1 1-.5 1.3zM325.1.2l-3.6 6.1-3.7-6.1H316V10h2.1V4.2l2.8 4.7h1.1l2.9-4.8V10h2.1V.2zM307.4.2 303 10h2.3l.9-2.1h4.6l.9 2.1h2.4L309.7.2h-2.3zm-.4 5.9 1.6-3.8 1.6 3.8H307zM298.8 4h-4.4V.2h-2.3V10h2.3V6h4.4v4h2.3V.2h-2.3zM284.1 2.3c.5-.3 1-.4 1.6-.4 1 0 1.8.4 2.5 1.1l1.5-1.3c-.5-.6-1-1-1.7-1.3-.7-.3-1.4-.4-2.3-.4-1 0-1.9.2-2.7.7-.8.4-1.4 1-1.9 1.8s-.7 1.6-.7 2.6.2 1.8.7 2.6c.5.8 1.1 1.4 1.9 1.8.8.4 1.7.6 2.7.6.8 0 1.6-.1 2.3-.4.7-.3 1.3-.7 1.7-1.3L288.2 7c-.7.8-1.5 1.2-2.5 1.2-.6 0-1.1-.1-1.6-.4-.5-.3-.9-.6-1.1-1.1-.3-.5-.4-1-.4-1.6 0-.6.1-1.1.4-1.6.3-.5.6-.9 1.1-1.2zM274.1 5.2h4V7h-4zM266.3.2 262 10h2.3l.9-2.1h4.6l.9 2.1h2.4L268.7.2h-2.4zm-.4 5.9 1.6-3.8 1.6 3.8h-3.2zM257.8 6.1 252.9.2H251V10h2.3V4l4.9 6h1.8V.2h-2.2zM242.5.2l-4.4 9.8h2.3l.9-2.1h4.5l.9 2.1h2.4L244.7.2h-2.2zm-.5 5.9 1.6-3.8 1.6 3.8H242zM235 4.9c.4-.2.7-.5 1-.9.2-.4.4-.8.4-1.3 0-.8-.3-1.4-1-1.9-.6-.5-1.5-.7-2.7-.7h-4.8V10h5.1c1.3 0 2.2-.2 2.9-.7.7-.5 1-1.1 1-2 0-.6-.2-1.1-.5-1.5-.4-.5-.8-.8-1.4-.9zm-4.9-3h2.3c.6 0 1 .1 1.3.3.3.2.4.5.4.9s-.1.7-.4.9-.7.3-1.3.3h-2.3V1.9zM234 8c-.3.2-.7.3-1.3.3h-2.6V5.8h2.6c1.2 0 1.8.4 1.8 1.2 0 .5-.1.8-.5 1zM224.6 5.6c.4-.5.5-1.2.5-1.9s-.2-1.4-.5-1.9-.8-.9-1.5-1.2c-.6-.3-1.4-.4-2.3-.4h-4.2V10h2.3V7.2h2.1l1.9 2.7h2.4l-2.2-3.1c.6-.3 1.1-.7 1.5-1.2zm-2.3-.6c-.4.3-.9.4-1.6.4h-1.8V2h1.8c.7 0 1.2.1 1.6.4.4.3.5.7.5 1.3 0 .6-.2 1-.5 1.3zM211.2 5.6c0 .9-.2 1.6-.6 2-.4.4-.9.6-1.6.6-1.5 0-2.2-.9-2.2-2.6V.2h-2.3v5.5c0 1.4.4 2.5 1.2 3.3.8.8 1.9 1.2 3.3 1.2s2.5-.4 3.3-1.2c.8-.8 1.2-1.9 1.2-3.3V.2h-2.2v5.4zM195.6 4.7c-.5-.2-1.1-.4-1.8-.5-.7-.2-1.3-.3-1.6-.5-.3-.2-.5-.4-.5-.8s.1-.6.4-.8c.3-.2.8-.3 1.4-.3.9 0 1.8.3 2.7.8l.7-1.7c-.4-.3-1-.5-1.6-.6-.6-.1-1.2-.2-1.8-.2-.9 0-1.7.1-2.3.4-.6.3-1.1.6-1.4 1.1-.3.5-.5 1-.5 1.5 0 .7.2 1.2.5 1.6.3.4.8.7 1.2.9.5.2 1.1.4 1.8.5.5.1.9.2 1.1.3.3.1.5.2.7.4.2.1.3.3.3.6s-.2.6-.5.8c-.3.2-.8.3-1.4.3-.6 0-1.2-.1-1.7-.3s-1.1-.4-1.5-.7l-.6 1.5c.4.3 1 .6 1.7.8.7.2 1.5.3 2.3.3.9 0 1.7-.1 2.3-.4s1.1-.6 1.4-1.1c.3-.5.5-1 .5-1.5 0-.7-.2-1.2-.5-1.6-.4-.3-.8-.6-1.3-.8zM184.4.2h2.3V10h-2.3zM179.2.7c-.8-.4-1.7-.7-2.7-.7-1 0-1.9.2-2.8.7-.8.4-1.5 1-1.9 1.8-.5.8-.7 1.6-.7 2.6s.2 1.8.7 2.6c.5.8 1.1 1.4 1.9 1.8.8.4 1.7.7 2.8.7 1 0 1.9-.2 2.7-.7.8-.4 1.5-1 1.9-1.8.5-.8.7-1.6.7-2.6s-.2-1.8-.7-2.6c-.4-.8-1.1-1.4-1.9-1.8zm-.1 6c-.3.5-.6.8-1.1 1.1-.5.3-1 .4-1.6.4-.6 0-1.1-.1-1.6-.4-.5-.3-.8-.6-1.1-1.1-.3-.5-.4-1-.4-1.6 0-.6.1-1.1.4-1.6.3-.5.6-.8 1.1-1.1.5-.3 1-.4 1.6-.4.6 0 1.1.1 1.6.4.5.3.8.6 1.1 1.1.3.5.4 1 .4 1.6 0 .6-.1 1.1-.4 1.6zM166.2 6.1 161.4.2h-1.9V10h2.2V4l4.9 6h1.9V.2h-2.3zM154 .2h2.3V10H154zM146.9.2h-2.3V10h7.2V8.1h-4.9zM137.5.2h-2.2V10h7.2V8.1h-5zM129.8.2h2.3V10h-2.3zM115 10h2.3V6.4h4.6V4.6h-4.6V2h5.2V.2H115zM109.8.7c-.8-.5-1.7-.7-2.7-.7-1 0-1.9.2-2.8.7-.8.4-1.5 1-1.9 1.8-.5.8-.7 1.6-.7 2.6s.2 1.8.7 2.6c.5.8 1.1 1.4 1.9 1.8.8.4 1.7.7 2.8.7 1 0 1.9-.2 2.7-.7.8-.4 1.5-1 1.9-1.8.5-.8.7-1.6.7-2.6s-.2-1.8-.7-2.6c-.4-.8-1.1-1.4-1.9-1.8zm-.1 6c-.3.5-.6.8-1.1 1.1-.5.3-1 .4-1.6.4s-1.1-.1-1.6-.4c-.5-.3-.8-.6-1.1-1.1-.3-.5-.4-1-.4-1.6 0-.6.1-1.1.4-1.6.3-.5.6-.8 1.1-1.1.5-.3 1-.4 1.6-.4s1.1.1 1.6.4c.5.3.8.6 1.1 1.1.3.5.4 1 .4 1.6 0 .6-.1 1.1-.4 1.6zM90.7 4.5 88.1.2h-2.4l3.8 6.3V10h2.3V6.5L95.6.2h-2.2zM76.6 2h3.1v8H82V2h3.1V.2h-8.5zM72.2.2h2.3V10h-2.3zM68 4.7c-.5-.2-1.1-.4-1.8-.5-.7-.2-1.3-.3-1.6-.5-.4-.2-.6-.4-.6-.8s.1-.6.4-.8c.3-.2.8-.3 1.4-.3.9 0 1.8.3 2.7.8l.7-1.7c-.4-.3-1-.5-1.6-.6-.5-.2-1.1-.3-1.7-.3-.9 0-1.7.1-2.3.4-.6.3-1.1.6-1.4 1.1-.3.5-.5 1-.5 1.5 0 .7.2 1.2.5 1.6.4.4.8.7 1.3.9.5.2 1.1.3 1.8.5.5.1.9.2 1.1.3.3.1.5.2.7.4.2.1.3.3.3.6s-.2.6-.5.8c-.3.2-.8.3-1.4.3-.6 0-1.2-.1-1.7-.3-.6-.2-1.1-.4-1.5-.7L61.6 9c.4.3 1 .6 1.7.8.7.2 1.5.3 2.3.3.9 0 1.7-.1 2.3-.4.6-.3 1.1-.6 1.4-1.1.3-.5.5-1 .5-1.5 0-.7-.2-1.2-.5-1.6-.4-.3-.8-.6-1.3-.8zM59.1 5.6c.4-.5.5-1.2.5-1.9s-.2-1.4-.5-1.9-.8-.9-1.5-1.2C57 .3 56.2.2 55.3.2h-4.2V10h2.3V7.2h2.1l1.9 2.7h2.4l-2.2-3.1c.7-.3 1.2-.7 1.5-1.2zM56.8 5c-.4.3-.9.4-1.6.4h-1.8V2h1.8c.7 0 1.2.1 1.6.4.4.3.5.7.5 1.3 0 .6-.1 1-.5 1.3zM43.1 5.9h4.5V4.1h-4.5V2h5.1V.2h-7.4V10h7.6V8.1h-5.3zM33.8 7.2l-2.9-7h-2.5l4.2 9.8h2.3L39.1.2h-2.2zM24.2.2h2.3V10h-2.3zM18.8 6.1 13.9.2H12V10h2.3V4l4.9 6H21V.2h-2.2zM6.6 5.6c0 .9-.2 1.6-.6 2-.3.4-.8.6-1.5.6-1.5 0-2.2-.9-2.2-2.6V.2H0v5.5C0 7.1.4 8.2 1.2 9c.8.8 1.9 1.2 3.3 1.2S7 9.8 7.8 9C8.6 8.2 9 7.1 9 5.7V.2H6.6v5.4z"/>
    </svg>`}renderBranding(){return h`
      <a href="https://illinois.edu?utm_source=${this.getUtmSource()}&utm_medium=web&utm_campaign=Header" aria-label="University of Illinois Urbana-Champaign">
        <div class="block-i">${this.renderBlockI()}</div>
        <div class="wordmark">${this.renderWordmark()}</div>
      </a>`}renderMenuIcon(){return this.expanded?this.renderMenuCloseIcon():this.renderMenuOpenIcon()}renderMenuCloseIcon(){return h`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.26 51.26">
      <path d="m37.84 32.94-7.63-7.63 7.63-7.63a3.24 3.24 0 0 0-4.58-4.58l-7.63 7.63L18 13.1a3.24 3.24 0 0 0-4.58 4.58L21 25.31l-7.62 7.63A3.24 3.24 0 1 0 18 37.52l7.63-7.63 7.63 7.63a3.24 3.24 0 0 0 4.58-4.58Z"/>
    </svg>`}renderMenuOpenIcon(){return h`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.26 51.26">
      <path d="M11.6 16.52h28.06a3.24 3.24 0 1 0 0-6.48H11.6a3.24 3.24 0 0 0 0 6.48ZM39.66 22.07H11.6a3.24 3.24 0 0 0 0 6.48h28.06a3.24 3.24 0 1 0 0-6.48ZM39.66 34.1H11.6a3.24 3.24 0 0 0 0 6.48h28.06a3.24 3.24 0 1 0 0-6.48Z"/>
    </svg>`}renderMenuButton(){return h`<span class="button">
      <span class="icon" role="presentation" aria-hidden="true">${this.renderMenuIcon()}</span>
      <span class="label">Menu</span>
    </span>`}renderMenuToggle(){return h`
      <div class="menu-toggle">
        <button aria-controls="menu" aria-expanded=${this.expanded?"true":"false"} @click=${this.handleToggleClick.bind(this)}>
          ${this.renderMenuButton()}
        </button>
      </div>`}renderMenu(){return h`
      <div id="menu" class="menu ${this.hasMenuContents()?"":"hide"}">
        <div class="links">
          <slot name="links"></slot>
        </div>
        <div class="search">
          <slot name="search"></slot>
        </div>
        <div class="nav">
          <slot name="navigation"></slot>
        </div>
      </div>`}renderCompact(){return h`
      <header class="compact header ${this.expanded?"expanded":"collapsed"}">
        <div class="main">
          <div class="illinois">
            ${this.renderBranding()}
          </div>
          <div class="identity">
            <div>
              <slot name="primary-unit"></slot>
            </div>
            <div>
              <slot name="site-name"></slot>
            </div>
          </div>
          ${this.hasMenuContents()?this.renderMenuToggle():""}
        </div>
        ${this.renderMenu()}
      </header>`}renderFull(){return h`
      <header class="full header" dark-mode-visible>
        <div class="main">
          <div class="illinois">
            ${this.renderBranding()}
          </div>
          <div class="links ${this.hasMenuContents()?"":"hide"}">
            <slot name="links"></slot>
          </div>
          <div class="identity">
            <div>
              <slot name="primary-unit"></slot>
            </div>
            <div>
              <slot name="site-name"></slot>
            </div>
          </div>
          <div class="search ${this.hasMenuContents()?"":"hide"}">
            <slot name="search"></slot>
          </div>
        </div>
        <div class="dark-mode-control">
          ${this.renderDarkModeControl()}
        </div>
        <div class="nav ${this.hasMenuContents()?"":"hide"}" >
            <slot name="navigation"></slot>
        </div>
      </header>`}renderDarkModeControl(){if(this.darkModeVisible){const e=this.getDarkModeCookie();return h`
        <div class="theme-switch">
          <input
            type="checkbox"
            id="themeToggle"
            .checked=${e}
            @change=${this.handleDarkModeChange}
          />
          <label for="themeToggle">
            Dark Mode
          </label>
        </div>`}}render(){return this.compact?this.renderCompact():this.renderFull()}};D.FOCUSABLE_SELECTOR=["a[href]","button:not([disabled])",'input:not([disabled]):not([type="hidden"])',"select:not([disabled])","textarea:not([disabled])",'[tabindex]:not([tabindex="-1"])'].join(", ");ue([s({attribute:!0})],D.prototype,"source",2);ue([s({attribute:!0,reflect:!0,type:Boolean})],D.prototype,"compact",2);ue([s({attribute:!0,reflect:!1,type:Boolean})],D.prototype,"expanded",2);ue([s({attribute:!0,reflect:!0})],D.prototype,"menu",2);ue([s({attribute:!1,state:!0})],D.prototype,"_menuVisible",2);ue([s({attribute:!1,state:!0})],D.prototype,"_hasMenu",2);ue([s({type:Boolean,attribute:"dark-mode-visible"})],D.prototype,"darkModeVisible",2);D=ue([x("ilw-header")],D);const Dn="@layer base{:host{--ilw-header-megamenu--link-color: var(--il-blue);--ilw-header-megamenu--link-color--hover: var(--il-altgeld);--ilw-header-megamenu--link-background: transparent;--ilw-header-megamenu--link-background--hover: white;--ilw-header-megamenu--link-background--focus: var(--ilw-color--focus--background);--ilw-header-megamenu--link-background--sub--focus: var(--ilw-color--focus--background);--ilw-header-megamenu--link-color--focus: var(--il-blue);--ilw-header-megamenu--link-border-bottom-highlight: 4px solid transparent;--ilw-header-megamenu--link-border-bottom-highlight--hover: 4px solid var(--il-orange);--ilw-header-megamenu--link-border-bottom-highlight--focus: 4px solid var(--il-blue);--ilw-header-megamenu--link-border-left-highlight: none;--ilw-header-megamenu--link-border-left-highlight--focus: none;--ilw-header-megamenu--background: #E8E9EB;--ilw-header-megamenu--flex-direction: row;--ilw-header-megamenu--items--position: absolute;--ilw-header-megamenu--items--border: 1px solid rgb(0, 0, 0, .01);--ilw-header-megamenu--items--box-shadow: 0 0 4px #00000040;--ilw-header-megamenu--items--width: 1270px;--ilw-header-megamenu--items--top: initial;--ilw-header-megamenu--items--left: calc(var(--ilw-margin--side) - 39px);--ilw-header-megamenu--font: 700 16px/22px var(--il-font-sans);--ilw-header-megamenu--grid-template-columns: auto auto;--ilw-header-megamenu-section--grid-template-columns--header: auto 24px;--ilw-header-megamenu-section--anchor--padding: 6px 20px;--ilw-header-megamenu-section--anchor--border: none;--ilw-header-megamenu-section--anchor--text-indent: 0;--ilw-header-megamenu-section--transform: none;--ilw-header-megamenu-section--transform--selected: rotate(180deg)}}div.parent.full{padding-top:6px;margin:0 calc(var(--ilw-margin--side) - 9px)}";var Fn=Object.defineProperty,Bn=Object.getOwnPropertyDescriptor,ni=(n,e,t,o)=>{for(var i=o>1?void 0:o?Bn(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Fn(e,t,i),i};let St=class extends y{constructor(){super(),this.compact=!1,this.width=990,this.addEventListener("keydown",this.handleWindowKeydown.bind(this)),this.handleWindowResize=this.handleWindowResize.bind(this),this.handleWindowClick=this.handleWindowClick.bind(this)}static get styles(){return _(Dn)}connectedCallback(){super.connectedCallback(),window.addEventListener("click",this.handleWindowClick.bind(this)),window.addEventListener("resize",this.handleWindowResize),this.handleWindowResize()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this.handleWindowClick.bind(this)),window.removeEventListener("resize",this.handleWindowResize)}handleWindowClick(e){this.contains(e.target)||this.closeAllExceptOneSections(null)}handleWindowKeydown(e){e.key==="Escape"&&this.closeAllExceptOneSections(null),e.key==="ArrowRight"&&(e.preventDefault(),this.closeAllExceptOneSections(null),this.gotoNextSection()),e.key==="ArrowLeft"&&(e.preventDefault(),this.closeAllExceptOneSections(null),this.gotoPreviousSection())}handleNavigationSectionToggleClick(e){this.closeAllExceptOneSections(e.target)}gotoPreviousSection(){var r;const e=document.activeElement;if(!e)return;const t=e.closest("ilw-header-megamenu-section")||e.closest("li a");if(!t)return;const o=(r=t.parentElement)==null?void 0:r.previousElementSibling;if(!o)return;const i=o.querySelector("ilw-header-megamenu-section")||o.querySelector("a");i&&("setFocus"in i?i.setFocus():i.focus())}gotoNextSection(){var r;const e=document.activeElement;if(!e)return;const t=e.closest("ilw-header-megamenu-section")||e.closest("li a");if(!t)return;const o=(r=t.parentElement)==null?void 0:r.nextElementSibling;if(!o)return;const i=o.querySelector("ilw-header-megamenu-section")||o.querySelector("a");i&&("setFocus"in i?i.setFocus():i.focus())}handleWindowResize(){(this.offsetWidth==0?window.innerWidth:this.offsetWidth)<this.width?this.compact||this.setCompactTrue():this.compact&&this.setCompactFalse()}setCompactTrue(){this.compact=!0,this.querySelectorAll("ilw-header-megamenu-section").forEach(e=>{e.compact=!0})}setCompactFalse(){this.compact=!1,this.querySelectorAll("ilw-header-megamenu-section").forEach(e=>{e.compact=!1})}getSections(){return this.querySelectorAll("ilw-header-megamenu-section")}closeAllExceptOneSections(e){this.getSections().forEach(t=>{(e==null||e!=t)&&(t.expanded=!1)})}render(){return h`
            <nav aria-label="Header Menu Navigation" @ilw-header-megamenu-section-expanded=${this.handleNavigationSectionToggleClick}>
                <div class="parent ${this.compact?"compact":"full"}">
                        <slot></slot>
                </div>
            </nav>
        `}};ni([s({type:Boolean,reflect:!0})],St.prototype,"compact",2);ni([s({type:Number})],St.prototype,"width",2);St=ni([x("ilw-header-megamenu")],St);const qn='#items{display:none}#items.expanded{all:initial;box-sizing:border-box;flex-direction:column;border:var(--ilw-header-megamenu--items--border);box-shadow:var(--ilw-header-megamenu--items--box-shadow);width:var(--ilw-header-megamenu--items--width);max-width:100vw + 39px;position:var(--ilw-header-megamenu--items--position);display:grid;left:var(--ilw-header-megamenu--items--left);top:var(--ilw-header-megamenu--items--top);z-index:100;background:#fff}.parent{height:100%}button,.link{all:initial;box-sizing:border-box;display:block;position:relative;padding:var(--ilw-header-megamenu-section--anchor--padding);font:var(--ilw-header-megamenu--font);background:var(--ilw-header-megamenu--link-background);color:var(--ilw-header-megamenu--link-color);fill:var(--ilw-header-megamenu--link-color);border-width:0 0 3px 0;border-style:solid;border-color:transparent;outline:0;cursor:pointer;height:100%;width:100%;border-bottom:var(--ilw-header-megamenu--link-border-bottom-highlight);border-left:var(--ilw-header-megamenu--link-border-left-highlight)}:is(button,.link) svg{padding:2px;transform:var(--ilw-header-megamenu-section--transform)}:is(button,.link).current{border-color:var(--il-blue)}:is(button,.link):hover{background:var(--ilw-header-megamenu--link-background--hover);border-bottom:var(--ilw-header-megamenu--link-border-bottom-highlight--hover);color:var(--ilw-header-megamenu--link-color--hover);fill:var(--ilw-header-megamenu--link-color--hover);text-decoration:underline}:is(button,.link):hover svg{outline:2px dotted var(--il-altgeld)}:is(button,.link):focus{background:var(--ilw-header-megamenu--link-background--focus);border-bottom:var(--ilw-header-megamenu--link-border-bottom-highlight--focus);border-left:var(--ilw-header-megamenu--link-border-left-highlight--focus);color:var(--ilw-header-megamenu--link-color--focus);fill:var(--ilw-header-megamenu--link-color--focus);outline:0}:is(button,.link):focus:hover svg{outline:2px dotted var(--il-blue)}button[aria-expanded=true]{text-decoration:underline;color:var(--ilw-header-megamenu--link-color--hover);background:var(--ilw-header-megamenu--link-background--hover)}button[aria-expanded=true]:focus{background:var(--ilw-header-megamenu--link-background--hover);border-bottom:var(--ilw-header-megamenu--link-border-bottom-highlight--hover)}button[aria-expanded=true] svg{fill:var(--ilw-header-megamenu--link-color--hover);transform:var(--ilw-header-megamenu-section--transform--selected);background:var(--ilw-header-megamenu--link-background--hover)}button[aria-expanded=true] svg:focus{background:var(--ilw-header-megamenu--link-background--hover);color:var(--il-blue)}.header{position:relative;display:grid;grid-template-columns:var(--ilw-header-megamenu-section--grid-template-columns--header);grid-template-areas:"label icon";grid-gap:4px}.header-link.current button{border-color:var(--il-blue)}.header-link{position:relative;display:grid;grid-template-columns:var(--ilw-header-megamenu--grid-template-columns);grid-template-areas:"label icon";align-items:center;height:100%}.header-link.highlighted{background:var(--ilw-header-megamenu--link-background--hover)}.header-link .link{padding:6px 0 6px 20px}.header-link button{padding:6px 20px 6px 6px}.label,.link{box-sizing:border-box;display:block;position:relative;grid-area:label}.icon,.header-link button{align-self:center;align-items:center;justify-content:center;grid-area:icon}.icon{display:flex}.arrow{display:block;height:14px;width:14px}.submenu.parent button:hover .label ::slotted(span[slot="label"]),.submenu.parent button:focus .label ::slotted(span[slot="label"]){text-decoration:underline}.menu.parent .header-link.highlighted button,.menu.parent .header-link.highlighted ::slotted(a[slot="link"]){border-bottom:var(--ilw-header-megamenu--link-border-bottom-highlight--focus)!important}.submenu.parent button.arrow-only:hover,.submenu.parent button.arrow-only:focus{border-left:4px solid transparent!important;color:var(--il-blue)}.menu.parent .compact button.arrow-only:hover,.menu.parent .compact button.arrow-only:focus{border-left:4px solid var(--il-blue)!important;color:var(--il-blue)}:host(.solo-list) ::slotted(ul){display:grid;grid-template-columns:repeat(4,minmax(0,320px));grid-template-rows:repeat(5,34px);grid-auto-flow:column;max-width:100vw}div.list-wrapper{display:grid;grid-template-columns:repeat(4,minmax(0,320px));max-width:100vw;overflow:hidden}:host-context(ilw-header-megamenu[compact]) .list-wrapper{all:unset}::slotted(ul:last-of-type){border:none!important}::slotted([slot="action-right"]){grid-column:4}::slotted([slot="action-right"].span-2){grid-column:3 / span 2;justify-self:auto}::slotted([slot="action-right"].span-3){grid-column:2 / span 3;justify-self:auto}::slotted([slot="action-left"]){grid-column:1}::slotted([slot="action-left"].span-2){grid-column:1 / span 2}::slotted([slot="action-left"].span-3){grid-column:1 / span 3}.hidden{display:none}';var Wn=Object.defineProperty,Hn=Object.getOwnPropertyDescriptor,pt=(n,e,t,o)=>{for(var i=o>1?void 0:o?Hn(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Wn(e,t,i),i};let We=class extends y{constructor(){super(...arguments),this.current=!1,this.compact=!1,this.expanded=!1,this.mouseover=!1}static get styles(){return _(qn)}handleToggleClick(e){this.expanded=!this.expanded,this.dispatchEvent(new CustomEvent("ilw-header-megamenu-section-expanded",{detail:!this.expanded,bubbles:!0,composed:!0}))}handleWindowKeydown(e){e.key==="ArrowDown"?(e.stopPropagation(),e.preventDefault(),this.moveToNextItem(),this.closeAllExceptOneSections(e.target)):e.key==="ArrowUp"?(e.stopPropagation(),e.preventDefault(),this.moveToPreviousItem(),this.closeAllExceptOneSections(e.target)):e.key==="Escape"&&this.expanded&&(e.stopPropagation(),this.setFocus(),this.expanded=!1)}setFocus(){var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector("button, a");e&&e.focus()}moveToNextItem(){this.expanded||(this.expanded=!0);const e=document.activeElement;if(!e)return;const t=e.closest("ILW-HEADER-MEGAMENU-SECTION");if(!t)return;const o=Array.from(t.querySelectorAll("a, button")),i=o.indexOf(e);let r=i+1;i===-1&&(r=0),r>=0&&r<o.length&&o[r].focus()}moveToPreviousItem(){const e=document.activeElement;if(!e)return;const t=e.closest("ILW-HEADER-MEGAMENU-SECTION");if(!t)return;const o=Array.from(t.querySelectorAll("a, button")),i=o.indexOf(e);let r=i-1;i===-1&&(r=o.length-1),r>=0&&r<o.length&&o[r].focus()}renderArrow(){return h`<svg class="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.4 23.82" aria-hidden="true">
          <path id="chevron" d="m39.34,1.06c-1.41-1.41-3.7-1.41-5.12,0l-14.02,14.02L6.18,1.06C4.76-.35,2.47-.35,1.06,1.06s-1.41,3.7,0,5.12l16.58,16.58c1.41,1.41,3.7,1.41,5.12,0L39.34,6.18c1.41-1.41,1.41-3.7,0-5.12Z"/>
        </svg>`}toggleMouseOver(){this.mouseover=!this.mouseover}handleNavigationSectionToggleClick(e){e.stopPropagation(),this.closeAllExceptOneSections(e.target)}getSections(){return this.querySelectorAll("ilw-header-megamenu-section")}closeAllExceptOneSections(e){this.getSections().forEach(t=>{(e==null||e!=t)&&(t.expanded=!1)})}hasSlotContent(e){const t=this.shadowRoot.querySelector(`slot[name="${e}"]`);return t?t.assignedNodes({flatten:!0}).length>0:!1}render(){var r,l;const e=this.querySelector('span[slot="action-left"], span[slot="action-right"]');let t=null;if(e){const a=((l=(r=e.querySelector("p"))==null?void 0:r.textContent)==null?void 0:l.trim())||"";let c=e.querySelector("a, button");a&&(t=`action-${a.replace(/\s+/g,"-")}`,e.id=t),c&&t&&c.setAttribute("aria-describedby",t)}document.querySelectorAll("ilw-header-megamenu-section").forEach(a=>{const c=a.querySelectorAll("ilw-header-megamenu-section.solo-list > ul > li"),d=c.length;if(d===5){c.forEach((u,b)=>{u.style.borderRight="none"});return}let p=Math.floor(d/5)*5;p=Math.min(p,15),c.forEach((u,b)=>{b+1<=p?u.style.borderRight="solid 2px var(--il-storm-85, #d5d3d3)":u.style.borderRight="none"})});let o=this.parentElement!=null&&this.parentElement.closest("ilw-header-megamenu-section")!=null;this.current=this.current||this.getAttribute("aria-current")!=null&&(this.getAttribute("aria-current")==="page"||this.getAttribute("aria-current")==="true");const i=!this.classList.contains("solo-list");return h`
            <div class="${o?"submenu":"menu"} parent" @ilw-header-megamenu-section-expanded=${this.handleNavigationSectionToggleClick} @keydown=${this.handleWindowKeydown}>
                <button class="${this.current?"current":""}" @click=${this.handleToggleClick.bind(this)} aria-expanded=${this.expanded?"true":"false"} aria-controls="items">
                    <div class="header">
                        <div class="label"><slot name="label"></slot> </div>
                        <div class="icon">${this.renderArrow()}</div>
                    </div>
                </button>
                <div id="items" class="${this.expanded?"expanded":""}">
                    ${i?h`
                            <div class="list-wrapper">
                                <slot name="action-left"></slot>
                                <slot id="list-slot"></slot>
                                <slot name="action-right"></slot>
                            </div>
                            `:h`<slot id="list-slot"></slot>`}
                </div>
            </div>
        `}};pt([s({type:Boolean})],We.prototype,"current",2);pt([s({type:Boolean})],We.prototype,"compact",2);pt([s({type:Boolean})],We.prototype,"expanded",2);pt([s({type:Boolean})],We.prototype,"mouseover",2);We=pt([x("ilw-header-megamenu-section")],We);const Vn="@layer base{:host{--ilw-header-menu--link-color: var(--il-blue);--ilw-header-menu--link-color--hover: var(--il-altgeld);--ilw-header-menu--link-background: transparent;--ilw-header-menu--link-background--hover: white;--ilw-header-menu--link-background--focus: var(--ilw-color--focus--background);--ilw-header-menu--link-background--sub--focus: var(--ilw-color--focus--background);--ilw-header-menu--link-border-bottom-highlight: 4px solid transparent;--ilw-header-menu--link-border-bottom-highlight--hover: 4px solid var(--il-orange);--ilw-header-menu--link-border-bottom-highlight--focus: 4px solid var(--il-blue);--ilw-header-menu--link-border-left-highlight: none;--ilw-header-menu--link-border-left-highlight--focus: none;--ilw-header-menu--background: #E8E9EB;--ilw-header-menu--background-menu-expanded: #FFFFFF;--ilw-header-menu--flex-direction: row;--ilw-header-menu--items--position: absolute;--ilw-header-menu--items--border: 1px solid rgb(0, 0, 0, .01);--ilw-header-menu--items--box-shadow: 0 0 4px #00000040;--ilw-header-menu--items--width: 250px;--ilw-header-menu--items--top: initial;--ilw-header-menu--items--left: 0;--ilw-header-menu--font: 700 16px/22px var(--il-font-sans);--ilw-header-menu--grid-template-columns: auto auto;--ilw-header-menu-section--grid-template-columns--header: auto 24px;--ilw-header-menu-section--anchor--padding: 6px 20px;--ilw-header-menu-section--anchor--border: none;--ilw-header-menu-section--anchor--text-indent: 0;--ilw-header-menu-section--transform: none;--ilw-header-menu-section--transform--selected: rotate(180deg)}}div.parent.full{padding-top:6px;margin:0 calc(var(--ilw-margin--side) - 9px)}";var Kn=Object.defineProperty,Gn=Object.getOwnPropertyDescriptor,ri=(n,e,t,o)=>{for(var i=o>1?void 0:o?Gn(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Kn(e,t,i),i};let _t=class extends y{constructor(){super(),this.compact=!1,this.width=990,this.addEventListener("keydown",this.handleWindowKeydown.bind(this)),this.handleWindowResize=this.handleWindowResize.bind(this),this.handleWindowClick=this.handleWindowClick.bind(this)}static get styles(){return _(Vn)}connectedCallback(){super.connectedCallback(),window.addEventListener("click",this.handleWindowClick.bind(this)),window.addEventListener("resize",this.handleWindowResize),this.handleWindowResize()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this.handleWindowClick.bind(this)),window.removeEventListener("resize",this.handleWindowResize)}handleWindowClick(e){this.contains(e.target)||this.closeAllExceptOneSections(null)}handleWindowKeydown(e){e.key==="Escape"&&this.closeAllExceptOneSections(null),e.key==="ArrowRight"&&(e.preventDefault(),this.closeAllExceptOneSections(null),this.gotoNextSection()),e.key==="ArrowLeft"&&(e.preventDefault(),this.closeAllExceptOneSections(null),this.gotoPreviousSection())}handleNavigationSectionToggleClick(e){this.closeAllExceptOneSections(e.target)}gotoPreviousSection(){let e=null,t=document.activeElement;if(t!=null){if(t.closest("li")&&t.closest("li").previousElementSibling){const o=t.closest("li").previousElementSibling;o&&o.children.length>0&&(e=o.children[0])}e&&e.tagName==="ILW-HEADER-MENU-SECTION"?e.setFocus(!0):e.focus()}}gotoNextSection(){let e=null,t=document.activeElement;if(t!=null){if(t.closest("li")&&t.closest("li").nextElementSibling){const o=t.closest("li").nextElementSibling;o&&o.children.length>0&&(e=o.children[0])}e&&e.tagName==="ILW-HEADER-MENU-SECTION"?e.setFocus():e.focus()}}handleWindowResize(){(this.offsetWidth==0?window.innerWidth:this.offsetWidth)<this.width?this.compact||this.setCompactTrue():this.compact&&this.setCompactFalse()}setCompactTrue(){this.compact=!0,this.querySelectorAll("ilw-header-menu-section").forEach(e=>{e.compact=!0})}setCompactFalse(){this.compact=!1,this.querySelectorAll("ilw-header-menu-section").forEach(e=>{e.compact=!1})}getSections(){return this.querySelectorAll("ilw-header-menu-section")}closeAllExceptOneSections(e){this.getSections().forEach(t=>{(e==null||e!=t)&&(t.expanded=!1)})}render(){return h`
            <nav aria-label="Header Menu Navigation" @ilw-header-menu-section-expanded=${this.handleNavigationSectionToggleClick}>
                <div class="parent ${this.compact?"compact":"full"}"><slot></slot></div>
            </nav>
        `}};ri([s({type:Boolean,reflect:!0})],_t.prototype,"compact",2);ri([s({type:Number})],_t.prototype,"width",2);_t=ri([x("ilw-header-menu")],_t);const Jn='#items{display:none}#items.expanded{all:initial;box-sizing:border-box;flex-direction:column;border:var(--ilw-header-menu--items--border);box-shadow:var(--ilw-header-menu--items--box-shadow);width:var(--ilw-header-menu--items--width);position:var(--ilw-header-menu--items--position);display:flex;left:var(--ilw-header-menu--items--left);top:var(--ilw-header-menu--items--top);z-index:100;background:var(--ilw-header-menu--background-menu-expanded)}#items.expanded.right{right:var(--ilw-header-menu--items--left);left:initial}.parent{height:100%;position:relative}button,.link{all:initial;box-sizing:border-box;display:block;position:relative;padding:var(--ilw-header-menu-section--anchor--padding);font:var(--ilw-header-menu--font);background:var(--ilw-header-menu--link-background);color:var(--ilw-header-menu--link-color);fill:var(--ilw-header-menu--link-color);border-width:0 0 3px 0;border-style:solid;border-color:transparent;outline:0;cursor:pointer;height:100%;width:100%;border-left:var(--ilw-header-menu--link-border-left-highlight);border-bottom:var(--ilw-header-menu--link-border-bottom-highlight)}:is(button,.link) svg{padding:2px;transform:var(--ilw-header-menu-section--transform)}:is(button,.link).current{border-color:var(--il-blue)}:is(button,.link):hover{background:var(--ilw-header-menu--link-background--hover);border-bottom:var(--ilw-header-menu--link-border-bottom-highlight--hover);border-left:var(--ilw-header-menu--link-border-left-highlight--hover);color:var(--ilw-header-menu--link-color--hover);fill:var(--ilw-header-menu--link-color--hover);text-decoration:underline}:is(button,.link):hover svg{outline:2px dotted var(--il-altgeld)}:is(button,.link):focus{background:var(--ilw-header-menu--link-background--focus);border-bottom:var(--ilw-header-menu--link-border-bottom-highlight--focus);border-left:var(--ilw-header-menu--link-border-left-highlight--focus)}:is(button,.link):focus:hover{color:var(--il-blue);fill:var(--il-blue)}button[aria-expanded=true]{text-decoration:underline;color:var(--ilw-header-menu--link-color--hover);background:var(--ilw-header-menu--link-background--hover)}button[aria-expanded=true]:focus{background:var(--ilw-header-menu--link-background--hover);border-bottom:var(--ilw-header-menu--link-border-bottom-highlight--hover)}button[aria-expanded=true] svg{fill:var(--ilw-header-menu--link-color--hover);transform:var(--ilw-header-menu-section--transform--selected);background:var(--ilw-header-menu--link-background--hover)}button[aria-expanded=true] svg:focus{background:var(--ilw-header-menu--link-background--hover)}.header{position:relative;display:grid;grid-template-columns:var(--ilw-header-menu-section--grid-template-columns--header);grid-template-areas:"label icon";grid-gap:4px}.header-link.current button{border-color:var(--il-blue)}.header-link{position:relative;display:grid;grid-template-columns:var(--ilw-header-menu--grid-template-columns);grid-template-areas:"label icon";align-items:center;height:100%}.header-link.highlighted{background:var(--ilw-header-menu--link-background--hover)}.header-link .link{padding:6px 0 6px 20px}.header-link button{padding:6px 20px 6px 8px}.label,.link{box-sizing:border-box;display:block;position:relative;grid-area:label}.icon,.header-link button{align-self:center;align-items:center;justify-content:center;grid-area:icon}.icon{display:flex}.arrow{display:block;height:14px;width:14px}.submenu.parent button:hover .label ::slotted(span[slot="label"]),.submenu.parent button:focus .label ::slotted(span[slot="label"]){text-decoration:underline}.menu.parent .header-link.highlighted button,.menu.parent .header-link.highlighted ::slotted(a[slot="link"]){border-bottom:var(--ilw-header-menu--link-border-bottom-highlight--focus)!important}.submenu.parent button.arrow-only:hover,.submenu.parent button.arrow-only:focus{border-left:4px solid transparent!important}.menu.parent .compact button.arrow-only:hover,.menu.parent .compact button.arrow-only:focus{border-left:4px solid transparent!important}';var Yn=Object.defineProperty,Zn=Object.getOwnPropertyDescriptor,Ae=(n,e,t,o)=>{for(var i=o>1?void 0:o?Zn(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Yn(e,t,i),i};let ae=class extends y{constructor(){super(),this.current=!1,this.compact=!1,this.right=!1,this.expanded=!1,this.mouseover=!1,this.linked=!1,this.addEventListener("keydown",this.handleWindowKeydown.bind(this))}static get styles(){return _(Jn)}connectedCallback(){super.connectedCallback()}handleToggleClick(e){this.expanded=!this.expanded,this.dispatchEvent(new CustomEvent("ilw-header-menu-section-expanded",{detail:!this.expanded,bubbles:!0,composed:!0}))}handleWindowKeydown(e){e.key==="ArrowDown"?(e.stopPropagation(),e.preventDefault(),this.moveToNextItem(),this.closeAllExceptOneSections(e.target)):e.key==="ArrowRight"||e.key==="ArrowLeft"?this.isOnAnchorInLinked()&&e.key==="ArrowRight"?(e.stopPropagation(),e.preventDefault(),this.expanded=!1,this.setFocus(!0)):this.isOnButtonInLinked()&&e.key==="ArrowLeft"?(e.stopPropagation(),e.preventDefault(),this.expanded=!1,this.setFocus()):this.isOnButtonInLinked()&&e.key==="ArrowRight"?this.expanded=!1:this.isOnAnchorInLinked()&&e.key==="ArrowLeft"?this.expanded=!1:(this.expanded=!1,this.setFocus()):e.key==="ArrowUp"?(e.stopPropagation(),e.preventDefault(),this.moveToPreviousItem(),this.closeAllExceptOneSections(e.target)):e.key==="Escape"&&this.expanded&&(e.stopPropagation(),this.setFocus(),this.expanded=!1)}isEmbedded(){return this.parentElement&&this.parentElement.closest("ilw-header-menu-section")!=null}isOnAnchorInLinked(){return this.linked&&document.activeElement&&document.activeElement.tagName==="A"}isOnButtonInLinked(){return this.linked&&document.activeElement&&document.activeElement.tagName==="ILW-HEADER-MENU-SECTION"}setFocus(e=!1){let t=null;this.linked&&!e?t=this.querySelector("a"):this.shadowRoot&&(t=this.shadowRoot.querySelector("a"),t==null&&(t=this.shadowRoot.querySelector("button"))),t==null||t.focus()}moveToNextItem(){let e=null;!this.expanded&&!this.isEmbedded()&&(this.expanded=!0);let t=document.activeElement;t!=null&&(t.tagName==="ILW-HEADER-MENU-SECTION"&&(!this.isEmbedded()||this.expanded)?(e=t.querySelector("li"),e!=null&&(e=e.children[0])):(e=t.closest("li"),e!=null&&(e=e.nextElementSibling),e!=null&&(e=e.children[0])),e!=null&&(e.tagName==="ILW-HEADER-MENU-SECTION"?e.setFocus():e.focus()))}moveToPreviousItem(){let e=null,t=document.activeElement;t!=null&&(t.tagName==="ILW-HEADER-MENU-SECTION"&&(!this.isEmbedded()||this.expanded)?(e=t.querySelector("li"),e!=null&&(e=e.children[0])):(e=t.closest("li"),e!=null&&(e=e.previousElementSibling),e!=null&&(e=e.children[0])),e!=null&&(e.tagName==="ILW-HEADER-MENU-SECTION"?e.setFocus():e.focus()))}renderArrow(){return h`<svg class="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.4 23.82" aria-hidden="true">
          <path id="chevron" d="m39.34,1.06c-1.41-1.41-3.7-1.41-5.12,0l-14.02,14.02L6.18,1.06C4.76-.35,2.47-.35,1.06,1.06s-1.41,3.7,0,5.12l16.58,16.58c1.41,1.41,3.7,1.41,5.12,0L39.34,6.18c1.41-1.41,1.41-3.7,0-5.12Z"/>
        </svg>`}toggleMouseOver(){this.mouseover=!this.mouseover}handleNavigationSectionToggleClick(e){e.stopPropagation(),this.closeAllExceptOneSections(e.target)}getSections(){return this.querySelectorAll("ilw-header-menu-section")}closeAllExceptOneSections(e){this.getSections().forEach(t=>{(e==null||e!=t)&&(t.expanded=!1)})}handleFocusout(e){var r;const t=e.target,o=e.relatedTarget;var i=(r=this.renderRoot.querySelector("slot:not([name])"))==null?void 0:r.assignedElements({flatten:!0});(t==null?void 0:t.tagName)=="A"&&!Array.from(i[0].children).includes(o.parentElement)&&(this.expanded=!1),e.stopPropagation()}render(){var i;let e=this.parentElement!=null&&this.parentElement.closest("ilw-header-menu-section")!=null;this.current=this.current||this.getAttribute("aria-current")!=null&&(this.getAttribute("aria-current")==="page"||this.getAttribute("aria-current")==="true");var t=h`
            <div class="header-link ${this.mouseover?"highlighted":""} ${this.compact?"compact":""} ${this.current?"current":""}" @mouseover="${this.toggleMouseOver.bind(this)}"  @mouseout="${this.toggleMouseOver.bind(this)}">
                <slot name="link"></slot>
                <button class="arrow-only" @click=${this.handleToggleClick.bind(this)} aria-expanded=${this.expanded?"true":"false"} aria-label=${((i=this.querySelector('a[slot="link"]'))==null?void 0:i.textContent)+" submenu"} aria-controls="items">
                    ${this.renderArrow()}
                </button>
            </div>
        `,o=h`
            <button class="${this.current?"current":""}" @click=${this.handleToggleClick.bind(this)} aria-expanded=${this.expanded?"true":"false"} aria-controls="items">
                <div class="header">
                    <div class="label"><slot name="label"></slot> </div>
                    <div class="icon">${this.renderArrow()}</div>
                </div>
            </button>
        `;return h`
            <div @focusout="${this.handleFocusout}" class="${e?"submenu":"menu"} parent" @ilw-header-menu-section-expanded=${this.handleNavigationSectionToggleClick}>
                ${this.linked?t:o}
                <div id="items" class="${this.expanded?"expanded":""} ${this.right?"right":""}">
                    <slot></slot>
                </div>
            </div>
        `}};Ae([s({type:Boolean})],ae.prototype,"current",2);Ae([s({type:Boolean})],ae.prototype,"compact",2);Ae([s({type:Boolean})],ae.prototype,"right",2);Ae([s({type:Boolean})],ae.prototype,"expanded",2);Ae([s({type:Boolean})],ae.prototype,"mouseover",2);Ae([s({reflect:!0,type:Boolean})],ae.prototype,"linked",2);ae=Ae([x("ilw-header-menu-section")],ae);const Qn=J`

.hero {
  position: relative;
}

.hero.fixed {
  left:50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding-left: 0;
  padding-right: 0;
  right: 50%;
  width: 100vw;
  display: block;
  container-type: inline-size;
  contain: layout;
}

.background {
  position: relative;
  width: 100%;
  height: var(--ilw-hero--height, 223px);
  background-color: var(--ilw-hero--background);
}

.always-over .background {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}

.background.collapse {
  display: none;
}

img {
  display: block; 
  position: relative;
  object-fit: cover;
  object-position: center;
}

.content-outer {
  background: var(--ilw-hero--background);
  position: relative;
  z-index: 100;
  padding: 0 20px;
}

.always-over .content-outer {
    background: transparent;
    height: var(--ilw-hero--height, 223px);
    display: flex;
}

.always-over .content-outer .content-inner {
    display: flex;
    flex-direction: column;
    max-width: 1200px;
}

.content-inner {
  padding: 18px 0 36px 0;
}

@media (min-width: 576px) {
    .content-inner {
        padding: 36px 0px 72px;
    }
}

@media (min-width: 767px) {
  .background {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .background img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 101;
  }
  .background.collapse {
    display: block;
  }


  .content-outer {
    background: transparent;
    height: var(--ilw-hero--height, 223px);
    display: flex;
  }

  .content-inner {
    width: 60%;
    margin: auto;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    max-width: 1200px;
  }

  .content-inner.left {
    text-align: left;
    align-items: flex-start;
    margin-left: 100px;
  }

  .content-inner.right {
    text-align: right;
    align-items: flex-end;
    margin-right: 100px;
  }

  .content-inner.top {
    margin-top: 0;
  }

  .content-inner.bottom {
    margin-bottom: 0;
  }
  .content-inner.top-left {
    text-align: left;
    align-items: flex-start;
    margin: 0 auto auto 100px;
  }

  .content-inner.top-right {
    text-align: left;
    align-items: flex-start;
    margin: 0 100px auto auto;
  }

  .content-inner.bottom-left {
    text-align: right;
    align-items: flex-end;
    margin: auto auto 0 100px;
  }

  .content-inner.bottom-right {
    text-align: right;
    align-items: flex-end;
    margin: auto 100px 0 auto;
  }
}

@media (min-width: 992px) {
  .content-inner {
    width: var(--ilw-hero--text-width);
  }
}
@media (max-width: 767px) {
    .always-over .content-outer {
      background-color: var(--ilw-hero--background);
    }
}
`;var Xn=Object.defineProperty,er=Object.getOwnPropertyDescriptor,ge=(n,e,t,o)=>{for(var i=o>1?void 0:o?er(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Xn(e,t,i),i};let K=class extends y{constructor(){super(...arguments),this.theme="",this.focusType="",this.shadow=!1,this.collapse=!1,this.alwayson=!1,this.align="",this.width=""}get outerWidth(){return this.width==="full"||this.width==="auto"?"fixed":""}render(){return h`
      <div class="hero ${this.outerWidth} ${this.alwayson?"always-over":""}">
        <div role="presentation" class="background ${this.collapse?"collapse":""}">
          <slot name="background"></slot>
        </div>
        <div class="content-outer">
          <div class="content-inner ${this.align.replace("-"," ")}">
            <slot></slot>
          </div>
        </div>
      </div>
    `}};K.styles=Qn;ge([s({type:String})],K.prototype,"theme",2);ge([s({type:String,attribute:"focus"})],K.prototype,"focusType",2);ge([s({type:Boolean})],K.prototype,"shadow",2);ge([s({type:Boolean})],K.prototype,"collapse",2);ge([s({type:Boolean})],K.prototype,"alwayson",2);ge([s({type:String})],K.prototype,"align",2);ge([s({type:String})],K.prototype,"width",2);K=ge([x("ilw-hero")],K);const tr="@layer base{:host{--ilw-icon-panel--padding: 1.125rem 2.25rem 1.375rem 1.375rem;--ilw-icon-panel--icon-size: 80px;--ilw-icon-panel--margin: 1.6rem 0;--ilw-icon-panel--border-width: 8px;--ilw-icon-panel--column-gap: 1.375rem;--ilw-icon-panel--font-size: 1.125rem;--ilw-icon-panel--line-height: 1.667;--ilw-icon-panel--icon-vertical-space: .75rem;--ilw-icon-panel--mobile--padding: 1.125rem 1.8rem 1.375rem .5rem;--ilw-icon-panel--mobile--icon-size: 3.7rem;--ilw-icon-panel--mobile--column-gap: .8rem;--ilw-icon-panel--font-family: var(--il-font-sans);--ilw-icon-panel--link-font-size: 1.25rem;--ilw-icon-panel--link-font-weight: 700;--ilw-icon-panel--link-line-height: 1.2;--ilw-icon-panel--heading-font-size: 1.875rem;--ilw-icon-panel--heading-font-weight: 600;--ilw-icon-panel--heading-line-height: 1.2}}:host{display:block;container-type:inline-size}.ilw-icon-panel{display:block;box-sizing:border-box;padding:var(--ilw-icon-panel--padding);margin:var(--ilw-icon-panel--margin);border-left:var(--ilw-icon-panel--border-width) solid var(--ilw-color--control-text);font-family:var(--ilw-icon-panel--font-family);background:var(--ilw-color--background);color:var(--ilw-color--text);font-size:var(--ilw-icon-panel--font-size);line-height:var(--ilw-icon-panel--line-height)}@container (width < 600px){.ilw-icon-panel{--ilw-icon-panel--padding: var(--ilw-icon-panel--mobile--padding);--ilw-icon-panel--icon-size: var(--ilw-icon-panel--mobile--icon-size);--ilw-icon-panel--column-gap: var(--ilw-icon-panel--mobile--column-gap)}}:host ::slotted(p:first-of-type){margin-top:0}:host ::slotted(p:last-of-type){margin-bottom:0}.link-wrapper{display:none}.link-wrapper.has-link{display:block}.ilw-icon-panel{display:flex;column-gap:var(--ilw-icon-panel--column-gap)}.ilw-icon-panel--orange{border-left-color:var(--ilw-color--control-accent)}.icon-wrapper{margin-top:var(--ilw-icon-panel--icon-vertical-space);flex-shrink:0;width:var(--ilw-icon-panel--icon-size);height:var(--ilw-icon-panel--icon-size);display:flex;align-items:center;justify-content:center}";var ir=Object.defineProperty,or=Object.getOwnPropertyDescriptor,li=(n,e,t,o)=>{for(var i=o>1?void 0:o?or(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&ir(e,t,i),i};let Et=class extends y{constructor(){super(),this.accent="blue",this._hasLink=!1}static get styles(){return _(tr)}_slotsChanged(){const e=this.shadowRoot;if(!e)return;const t=e.querySelector("slot[name=link]");this._hasLink=(t==null?void 0:t.assignedElements().length)>0}render(){let e={"ilw-icon-panel":!0,"ilw-icon-panel--blue":this.accent==="blue","ilw-icon-panel--orange":this.accent==="orange"};return h`
            <div class=${j(e)}>
                <div class="icon-wrapper">
                    <slot name="icon"></slot>
                </div>
                <div class="content">
                    <div
                        class="link-wrapper ${this._hasLink?"has-link":""}"
                    >
                        <slot
                            name="link"
                            @slotchange=${this._slotsChanged}
                        ></slot>
                    </div>
                    <slot></slot>
                </div>
            </div>
        `}};li([s()],Et.prototype,"accent",2);li([U()],Et.prototype,"_hasLink",2);Et=li([x("ilw-icon-panel")],Et);/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nr={},rr=(n,e=nr)=>n._$AH=e;/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const lr=ti(class extends ii{constructor(){super(...arguments),this.key=S}render(n,e){return this.key=n,e}update(n,[e,t]){return e!==this.key&&(rr(n),this.key=e),t}}),sr="@layer base{:host{--ilw-image-gallery--button-background: var(--ilw-color--control-accent, var(--il-blue, #13294b));--ilw-image-gallery--button-color: var(--ilw-color--control-accent-text, #fff);--ilw-image-gallery--button-disabled-background: #d7d7d7;--ilw-image-gallery--button-disabled-color: #333;--ilw-image-gallery--image-background: var(--ilw-color--background, #fff);--ilw-image-gallery--modal-width: 900px;--ilw-image-gallery--padding-top: 40px;--ilw-image-gallery--padding-right: 0;--ilw-image-gallery--padding-bottom: 40px;--ilw-image-gallery--padding-left: 0}}:host{display:block;box-sizing:border-box;background-color:var(--ilw-color--background, #fff);padding:var(--ilw-image-gallery--padding-top) var(--ilw-image-gallery--padding-right) var(--ilw-image-gallery--padding-bottom) var(--ilw-image-gallery--padding-left)}.gallery-modal{--ilw-color--background: var(--ilw-color--white--background, #fff);--ilw-color--text: var(--ilw-color--white--text, #252525);--ilw-color--heading: var(--ilw-color--white--heading, var(--il-blue, #13294b));--ilw-color--control: var(--ilw-color--white--control, #fff);--ilw-color--control-text: var(--ilw-color--white--control-text, var(--il-blue, #13294b));--ilw-color--control-accent: var(--ilw-color--white--control-accent, var(--il-orange, #ff5f05));--ilw-color--control-accent-text: var(--ilw-color--white--control-accent-text, #fff);--ilw-image-gallery--image-background: var(--ilw-color--white--background, #fff);--ilw-modal--image-height: auto;--ilw-modal--large: var(--ilw-image-gallery--modal-width);--ilw-modal--background: var(--ilw-color--background, #fff);--ilw-modal--text-color: var(--ilw-color--text, #1a1a1a);--ilw-modal--heading-color: var(--ilw-color--heading, var(--il-blue, #13294b));--ilw-modal--border-top: 0;--ilw-modal--border-bottom: 8px solid var(--ilw-color--control-accent, var(--il-orange, #ff5f05))}.gallery-figure{width:100%;height:auto!important;margin:0;background:var(--ilw-image-gallery--image-background)}.gallery-image-stage{display:grid;place-items:center;width:100%;height:clamp(300px,65vh,600px);overflow:hidden;background:var(--ilw-image-gallery--image-background);border-bottom:var(--ilw-modal--border-bottom)}.gallery-image{display:block;width:100%;height:100%!important;object-fit:contain!important;background:var(--ilw-image-gallery--image-background)}.gallery-image:not([data-loaded]){visibility:hidden}.gallery-figure figcaption{padding:1rem 1.5rem .5rem;color:var(--ilw-color--text, #1a1a1a);background:var(--ilw-modal--background, #fff);font:400 1.125rem/1.667rem var(--il-font-sans)}.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.gallery-controls{display:grid;grid-template-columns:minmax(7rem,auto) 1fr minmax(7rem,auto);align-items:center;gap:1rem;padding-top:.5rem}button.ilw-button{display:inline-block;margin:6px 0;padding:12px 20px;color:var(--ilw-color--control-text, var(--ilw-image-gallery--button-color));background:var(--ilw-color--control, var(--ilw-image-gallery--button-background));border:2px solid var(--ilw-color--control-text, var(--ilw-image-gallery--button-color));border-radius:.25em;font:700 1.188rem/1.25rem var(--il-font-sans, Arial, sans-serif);letter-spacing:.01em;text-align:center;text-decoration:none;cursor:pointer;transition:background-color .3s}button.ilw-button:hover:not(:disabled){color:var(--ilw-color--control, var(--ilw-image-gallery--button-background));background:var(--ilw-color--control-text, var(--ilw-image-gallery--button-color));border-color:var(--ilw-color--control-text, var(--ilw-image-gallery--button-color));text-decoration:underline}button.ilw-button:focus{color:var(--ilw-color--focus--text, var(--il-blue, #13294b));background:var(--ilw-color--focus--background, var(--il-orange, #ff5f05));text-decoration:underline}button.ilw-button:disabled,button.ilw-button:disabled:hover{color:var(--il-storm-lighter-1, var(--ilw-image-gallery--button-disabled-color));background:#fff;border:2px solid var(--il-storm-lighter-1, var(--ilw-image-gallery--button-disabled-background));outline:none;text-decoration:none;cursor:initial}.gallery-position{margin:0;text-align:center;font:400 1.125rem/1.667rem var(--il-font-sans)}@media(max-width:600px){.gallery-image-stage{height:auto;aspect-ratio:4 / 3}.gallery-controls{grid-template-columns:1fr 1fr}.gallery-position{grid-column:1 / -1;grid-row:1}}";var ar=Object.defineProperty,cr=Object.getOwnPropertyDescriptor,ut=(n,e,t,o)=>{for(var i=o>1?void 0:o?cr(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&ar(e,t,i),i};let dr=0,He=class extends y{constructor(){super(...arguments),this.theme="",this.label="Image gallery",this.currentIndex=-1,this.loadedImageSrc="",this.modalId=`ilw-image-gallery-modal-${++dr}`,this.handleKeydown=e=>{var o;if(!((o=this.modal)!=null&&o.open)||e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey)return;const t=e.target;t instanceof Element&&t.matches("input, textarea, select, [contenteditable]")||(e.key==="Tab"?this.moveFocus(e):e.key==="ArrowLeft"?(e.preventDefault(),this.previous()):e.key==="ArrowRight"&&(e.preventDefault(),this.next()))}}static get styles(){return _(sr)}connectedCallback(){super.connectedCallback(),document.addEventListener("keydown",this.handleKeydown,!0)}disconnectedCallback(){document.removeEventListener("keydown",this.handleKeydown,!0),super.disconnectedCallback()}get items(){return Array.from(this.querySelectorAll("a[data-gallery-item]"))}get modal(){var e;return((e=this.shadowRoot)==null?void 0:e.querySelector("ilw-modal"))??null}imageAt(e){var r,l,a,c;const t=this.items[e];if(!t)return null;const o=t.querySelector("img"),i=((r=t.dataset.galleryCaption)==null?void 0:r.trim())||((a=(l=t.querySelector("ilw-card"))==null?void 0:l.textContent)==null?void 0:a.trim())||"";return{src:t.href,alt:((c=t.dataset.galleryAlt)==null?void 0:c.trim())||(o==null?void 0:o.alt.trim())||i,caption:i}}itemFromEvent(e){return e.composedPath().find(t=>t instanceof HTMLAnchorElement&&t.matches("[data-gallery-item]"))??null}handleClick(e){const t=this.itemFromEvent(e);if(!t||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const o=this.items.indexOf(t);o!==-1&&(e.preventDefault(),o!==this.currentIndex&&(this.loadedImageSrc=""),this.currentIndex=o,t.dataset.modalTarget=this.modalId)}moveFocus(e){var c,d,p,u;const t=Array.from(((c=this.shadowRoot)==null?void 0:c.querySelectorAll(".gallery-controls button"))??[]).filter(b=>!b.disabled),o=(p=(d=this.modal)==null?void 0:d.shadowRoot)==null?void 0:p.querySelector(".close-btn"),i=o?[...t,o]:t;if(!i.length)return;e.preventDefault(),e.stopImmediatePropagation();let r=document.activeElement;for(;(u=r==null?void 0:r.shadowRoot)!=null&&u.activeElement;)r=r.shadowRoot.activeElement;const l=i.indexOf(r),a=e.shiftKey?l<=0?i.length-1:l-1:(l+1)%i.length;i[a].focus()}previous(){this.move(-1)}next(){this.move(1)}move(e){const t=this.items.length;if(!t||this.currentIndex<0)return;const o=this.currentIndex+e;o<0||o>=t||(this.loadedImageSrc="",this.currentIndex=o)}handleImageLoad(e){const t=e.currentTarget,o=this.imageAt(this.currentIndex);o&&t.src===o.src&&(this.loadedImageSrc=o.src)}render(){const e=this.items.length,t=this.imageAt(this.currentIndex),o=(t==null?void 0:t.src)===this.loadedImageSrc,i=this.currentIndex<=0,r=this.currentIndex>=e-1;return h`
            <div class="gallery" role="region" aria-label=${this.label} @click=${this.handleClick}>
                <slot></slot>
            </div>

            <ilw-modal id=${this.modalId} size="large" class="gallery-modal">
                ${t?h`
                    <figure class="gallery-figure" slot="image">
                        <div class="gallery-image-stage">
                            ${lr(t.src,h`
                                <img class="gallery-image" src=${t.src} alt=${t.alt}
                                    ?data-loaded=${o} @load=${this.handleImageLoad} />
                            `)}
                        </div>
                        ${t.caption?h`<figcaption>${t.caption}</figcaption>`:null}
                    </figure>
                    <h2 class="visually-hidden" slot="title">${this.label}</h2>
                `:null}

                <div class="gallery-controls">
                    <button type="button" class="ilw-button" @click=${this.previous}
                        ?disabled=${i} aria-label="Previous image">
                        Previous
                    </button>
                    <p class="gallery-position" aria-live="polite" aria-atomic="true">
                        ${this.currentIndex>=0?`Image ${this.currentIndex+1} of ${e}`:""}
                    </p>
                    <button type="button" class="ilw-button" @click=${this.next}
                        ?disabled=${r} aria-label="Next image">
                        Next
                    </button>
                </div>
            </ilw-modal>
        `}};ut([s({type:String})],He.prototype,"theme",2);ut([s({type:String})],He.prototype,"label",2);ut([U()],He.prototype,"currentIndex",2);ut([U()],He.prototype,"loadedImageSrc",2);He=ut([x("ilw-image-gallery")],He);function hr(n=document){n.querySelectorAll("*:required[id]").forEach(e=>{const t=n.querySelector(`label[for="${CSS.escape(e.id)}"]`);t&&t.classList.add("ilw-label-required")})}function pr(n=document){n.querySelectorAll("button[aria-pressed]").forEach(e=>{if(e.childNodes.length!==0)return;const t=e.getAttribute("data-ilw-input-on")??"",o=e.getAttribute("data-ilw-input-off")??"",i=e.getAttribute("aria-pressed")==="true",r=document.createElement("span");r.textContent=i?t:o;const l=document.createElement("ilw-icon");l.setAttribute("size","18px"),l.setAttribute("style","padding-left: 5px; vertical-align: middle;"),l.setAttribute("icon",i?"more":"cancel"),e.append(r,l),e.addEventListener("click",()=>{const a=e.getAttribute("aria-pressed")==="true";e.setAttribute("aria-pressed",a?"false":"true"),r.textContent=a?e.getAttribute("data-ilw-input-off")??"":e.getAttribute("data-ilw-input-on")??"",l.setAttribute("icon",a?"cancel":"more")})})}typeof document<"u"&&(hr(document),pr(document));const ur="@layer base{:host{--ilw-modal--small: 35%;--ilw-modal--medium: 50%;--ilw-modal--large: 1200px;--ilw-modal--image-height: 350px;--ilw-modal--text-color: var(--ilw-color--text);--ilw-modal--heading-color: var(---ilw-color--heading);--ilw-modal--heading--font: var(--il-font-montserrat);--ilw-modal--heading--font-size: 2.25rem;--ilw-modal--heading--line-height: 1.2;--ilw-modal--heading--margin: 2rem 0 1.3125rem 0;--ilw-modal--border-top: 8px solid var(--ilw-color--control-accent);--ilw-modal--background: var(--ilw-color--background);--ilw-modal--close-btn--color: var(--ilw-color--control-text);--ilw-modal--close-btn--background-color: rgba(255, 255, 255, .7);--ilw-modal--close-btn--hover-color: var(--ilw-color--control-accent)}}:host{display:block}.backdrop{position:fixed;top:0;left:0;width:100%;height:100%;background:#00000080;display:flex;align-items:flex-start;padding-top:5vh;justify-content:center;visibility:hidden;opacity:0;transition:opacity .3s ease-in-out;overflow-y:auto;-webkit-overflow-scrolling:touch}:host([open]) .backdrop{visibility:visible;opacity:1;z-index:9999}.modal{background:var(--ilw-modal--background);box-shadow:0 4px 6px #0000001a;max-width:var(--ilw-modal--medium);width:100%;position:relative;border-top:var(--ilw-modal--border-top);display:flex;flex-direction:column;max-height:80vh;overflow-y:auto;-webkit-overflow-scrolling:touch}.modal.small{max-width:var(--ilw-modal--small)}.modal.small .modal-image ::slotted(*){height:200px}.modal.medium{max-width:var(--ilw-modal--medium)}.modal.medium .modal-image ::slotted(*){height:300px}.modal.large{max-width:var(--ilw-modal--large)}.modal.large .modal-image ::slotted(*){height:400px}@media (max-width: 600px){.backdrop{padding-top:0}.modal.small,.modal.medium,.modal.large{max-width:100%;margin:.5rem}}.modal[aria-hidden=true]{display:none}.modal-image{position:relative;order:1;width:100%;height:auto}.modal-image ::slotted(*){width:100%;height:var(--ilw-modal--image-height);object-fit:cover;display:block}.modal-header{display:flex;order:2;justify-content:space-between;align-items:center;padding:0 1.5rem}.modal-header.with-image{margin-top:0;justify-content:flex-start}.modal-header h2{margin:0;padding:0;font:1.5rem var(--ilw-modal--heading--font);color:var(--ilw-color--heading)}.modal.center .modal-header{justify-content:center;text-align:center}.modal.center .modal-body{text-align:center}.modal-body{margin-bottom:2rem;font:1.125rem var(--il-font-sans);color:var(--ilw-modal--text-color);padding:0 1.5rem;order:3}.hidden{display:none}.close-btn{color:var(--ilw-modal--close-btn--color);background-color:var(--ilw-modal--close-btn--background-color);border:none;border-radius:50%;padding:0;width:2rem;height:2rem;display:flex;align-items:center;justify-content:center;cursor:pointer;position:absolute;top:.5rem;right:.5rem;z-index:10}.close-btn svg{width:100%;height:100%;pointer-events:none}.close-btn:hover{color:var(--ilw-modal--close-btn--hover-color)}.close-btn:focus{color:var(--ilw-color--focus--text);background-color:var(--ilw-color--focus--background);outline:solid var(--ilw-color--focus--outline) 1px}";var gr=Object.defineProperty,mr=Object.getOwnPropertyDescriptor,ze=(n,e,t,o)=>{for(var i=o>1?void 0:o?mr(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&gr(e,t,i),i};let I=class extends y{constructor(){super(),this.theme="",this.open=!1,this.size="medium",this.align="",this.id="modal",this._hasGraphic=!1,this._focusableElements=[],this._firstFocusable=null,this._lastFocusable=null,this._activeTrigger=null,this._prevHtmlOverflow=null,this._prevBodyOverflow=null,this._prevBodyPaddingRight=null,this.handleExternalTrigger=e=>{var o;const t=(o=e.target)==null?void 0:o.closest("[data-modal-target]");t&&t.getAttribute("data-modal-target")===this.id&&(this._activeTrigger=t,this.open=!0,requestAnimationFrame(()=>this._setInitialFocus()))},this._slotsChanged=()=>{var t;const e=(t=this.shadowRoot)==null?void 0:t.querySelector("slot[name=image]");if(e){const o=e.assignedElements().length>0;o!==this._hasGraphic&&(this._hasGraphic=o)}},this._handleKeydown=e=>{var o;if(!this.open||this._focusableElements.length===0)return;const t=((o=this.shadowRoot)==null?void 0:o.activeElement)||document.activeElement;switch(e.key){case"Escape":this.closeModal();break;case"Tab":e.preventDefault();const i=this._focusableElements.indexOf(t);if(i===-1){this._firstFocusable instanceof HTMLElement&&this._firstFocusable.focus();return}if(e.shiftKey){const r=(i-1+this._focusableElements.length)%this._focusableElements.length,l=this._focusableElements[r];l instanceof HTMLElement&&l.focus()}else{const r=(i+1)%this._focusableElements.length,l=this._focusableElements[r];l instanceof HTMLElement&&l.focus()}break}}}_lockPageScroll(){if(I._scrollLockCount===0){const e=document.documentElement,t=document.body;this._prevHtmlOverflow=e.style.overflow,this._prevBodyOverflow=t.style.overflow,this._prevBodyPaddingRight=t.style.paddingRight;const o=window.innerWidth-document.documentElement.clientWidth;o>0&&(t.style.paddingRight=`${o}px`),e.style.overflow="hidden",t.style.overflow="hidden"}I._scrollLockCount++}_unlockPageScroll(){if(I._scrollLockCount=Math.max(0,I._scrollLockCount-1),I._scrollLockCount===0){const e=document.documentElement,t=document.body;e.style.overflow=this._prevHtmlOverflow??"",t.style.overflow=this._prevBodyOverflow??"",t.style.paddingRight=this._prevBodyPaddingRight??"",this._prevHtmlOverflow=null,this._prevBodyOverflow=null,this._prevBodyPaddingRight=null}}static get styles(){return _(ur)}firstUpdated(e){super.firstUpdated(e),this.updateComplete.then(()=>this._slotsChanged())}updated(e){super.updated(e),e.has("open")&&(this.open?(this._lockPageScroll(),this._setInitialFocus(),document.addEventListener("keydown",this._handleKeydown)):(this._unlockPageScroll(),document.removeEventListener("keydown",this._handleKeydown),this._activeTrigger&&this._activeTrigger instanceof HTMLElement&&(this._activeTrigger.focus(),this._activeTrigger=null)))}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this.handleExternalTrigger)}disconnectedCallback(){super.disconnectedCallback(),this.open&&this._unlockPageScroll(),document.removeEventListener("click",this.handleExternalTrigger),document.removeEventListener("keydown",this._handleKeydown)}closeModal(){this.open=!1}_setInitialFocus(){var a,c,d;const e=(a=this.shadowRoot)==null?void 0:a.querySelector(".modal");e&&(e.setAttribute("tabindex","-1"),e.focus({preventScroll:!0}));const t=Array.from(((c=this.shadowRoot)==null?void 0:c.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))||[]),o=((d=this.shadowRoot)==null?void 0:d.querySelectorAll("slot"))||[];let i=[];o.forEach(p=>{(p.assignedElements({flatten:!0})||[]).forEach(u=>{if(u.hasAttribute("autofocus")&&u instanceof HTMLElement){u.focus();return}u.matches('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')&&i.push(u),i.push(...Array.from(u.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')))})});const r=[...i,...t],l=r.filter(p=>p.classList.contains("close-btn"));this._focusableElements=r.filter(p=>!p.classList.contains("close-btn")).concat(l),this._firstFocusable=this._focusableElements[0]||null,this._lastFocusable=this._focusableElements[this._focusableElements.length-1]||null}render(){return h`
            <div class="backdrop" @click=${this.closeModal} aria-hidden=${!this.open}>
                <div class="modal ${this.size} ${this.align}" role="dialog" aria-labelledby="modal-title" aria-describedby="modal-description" tabindex="-1" aria-modal="true" @click=${e=>e.stopPropagation()}>

                    <!-- Title -->
                    <div class="modal-header" id="modal-title">
                        <slot name="title"></slot>
                    </div>

                    <!-- Image -->
                    <div class="modal-image ${this._hasGraphic?"":"hidden"}">
                        <slot name="image" @slotchange=${this._slotsChanged}></slot>
                    </div>

                    <!-- Main body content -->
                    <div class="modal-body" id="modal-description">
                        <slot></slot>
                    </div>

                    <!-- Close button -->
                    <button class="close-btn" @click=${this.closeModal} aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 51.26 51.26">
                            <path fill="currentColor" d="m37.84 32.94-7.63-7.63 7.63-7.63a3.24 3.24 0 0 0-4.58-4.58l-7.63 7.63L18 13.1a3.24 3.24 0 0 0-4.58 4.58L21 25.31l-7.62 7.63A3.24 3.24 0 1 0 18 37.52l7.63-7.63 7.63 7.63a3.24 3.24 0 0 0 4.58-4.58Z"/>
                        </svg>
                    </button>

                </div>
            </div>
        `}};I._scrollLockCount=0;ze([s({type:String,attribute:!0})],I.prototype,"theme",2);ze([s({type:Boolean,reflect:!0})],I.prototype,"open",2);ze([s({type:String,attribute:!0})],I.prototype,"size",2);ze([s({type:String,attribute:!0})],I.prototype,"align",2);ze([s({type:String,attribute:!0})],I.prototype,"id",2);ze([U()],I.prototype,"_hasGraphic",2);I=ze([x("ilw-modal")],I);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vr=Symbol();let fr=class{get taskComplete(){return this.t||(this.i===1?this.t=new Promise((e,t)=>{this.o=e,this.h=t}):this.i===3?this.t=Promise.reject(this.l):this.t=Promise.resolve(this.u)),this.t}constructor(e,t,o){var r;this.p=0,this.i=0,(this._=e).addController(this);const i=typeof t=="object"?t:{task:t,args:o};this.v=i.task,this.j=i.args,this.m=i.argsEqual??br,this.k=i.onComplete,this.A=i.onError,this.autoRun=i.autoRun??!0,"initialValue"in i&&(this.u=i.initialValue,this.i=2,this.O=(r=this.T)==null?void 0:r.call(this))}hostUpdate(){this.autoRun===!0&&this.S()}hostUpdated(){this.autoRun==="afterUpdate"&&this.S()}T(){if(this.j===void 0)return;const e=this.j();if(!Array.isArray(e))throw Error("The args function must return an array");return e}async S(){const e=this.T(),t=this.O;this.O=e,e===t||e===void 0||t!==void 0&&this.m(t,e)||await this.run(e)}async run(e){var l,a,c,d,p;let t,o;e??(e=this.T()),this.O=e,this.i===1?(l=this.q)==null||l.abort():(this.t=void 0,this.o=void 0,this.h=void 0),this.i=1,this.autoRun==="afterUpdate"?queueMicrotask(()=>this._.requestUpdate()):this._.requestUpdate();const i=++this.p;this.q=new AbortController;let r=!1;try{t=await this.v(e,{signal:this.q.signal})}catch(u){r=!0,o=u}if(this.p===i){if(t===vr)this.i=0;else{if(r===!1){try{(a=this.k)==null||a.call(this,t)}catch{}this.i=2,(c=this.o)==null||c.call(this,t)}else{try{(d=this.A)==null||d.call(this,o)}catch{}this.i=3,(p=this.h)==null||p.call(this,o)}this.u=t,this.l=o}this._.requestUpdate()}}abort(e){var t;this.i===1&&((t=this.q)==null||t.abort(e))}get value(){return this.u}get error(){return this.l}get status(){return this.i}render(e){var t,o,i,r;switch(this.i){case 0:return(t=e.initial)==null?void 0:t.call(e);case 1:return(o=e.pending)==null?void 0:o.call(e);case 2:return(i=e.complete)==null?void 0:i.call(e,this.value);case 3:return(r=e.error)==null?void 0:r.call(e,this.error);default:throw Error("Unexpected status: "+this.i)}}};const br=(n,e)=>n===e||n.length===e.length&&n.every((t,o)=>!At(t,e[o]));class Ht{constructor(e,t){this.rightSkipLine=!1,this.leftSkipLine=!1,this.emptySpaces=[],this.level=e,this.orgs=t}}class wr extends Map{constructor(){super(...arguments),this.root=null,this.primaryOrientation="horizontal",this.orgLookup=new Map}orderedEntries(){return Array.from(this.entries()).sort((e,t)=>e[0]-t[0])}findParent(e){var t;return((t=this.orgLookup.get(e))==null?void 0:t.parent)||null}findNextSibling(e){const t=this.orgLookup.get(e);if(!t||!t.parent)return null;const o=t.parent.children;if(!o)return null;const i=o.findIndex(r=>r.id===e);return i>=0&&i<o.length-1?o[i+1]:null}findPreviousSibling(e){const t=this.orgLookup.get(e);if(!t||!t.parent)return null;const o=t.parent.children;if(!o)return null;const i=o.findIndex(r=>r.id===e);return i>0?o[i-1]:null}findFirstChild(e){const t=this.orgLookup.get(e);return!t||!t.children||t.children.length===0?null:t.children[0]}}let yr=1;function xr(n){const e=new wr;function t(o,i,r,l=0){const a=r+(o.weight??0),c={...o,id:yr++,parent:i,level:a,originalIndex:l};if(e.has(a)||e.set(a,new Ht(a,[])),e.get(a).orgs.push(c),e.orgLookup.set(c.id,c),o.children){const d=[];for(let p=0;p<o.children.length;p++){const u=o.children[p],b=t(u,c,a+1,p);d.push(b),b.level>a+1&&(c.lineSkipsLevels=b.level-(a+1))}c.children=d}return c}if(e.root=t(n,null,0),e.get(0)&&e.get(0).orgs.length>3){let o=e.get(0);const i=o.orgs.slice(0,3),r=o.orgs.slice(3);o.orgs=i,e.has(1)||e.set(1,new Ht(1,[]));const l=e.get(1);for(const a of r)a.level=1,l.orgs.push(a)}return e}function kr(n,e){var l;for(const[a,c]of n.entries()){const d=(c.orgs.length||1)*e.minColWidth;e.minColWidth<=0||e.maxColWidth<=0?c.orientation="vertical":d<=e.availableSpace?c.orientation="horizontal":c.orientation="vertical"}const t=new Set;function o(a){if(t.has(a))return;t.add(a);const c=n.get(a);if(c){c.orientation="vertical",c.leftSkipLine=!1,c.rightSkipLine=!1;for(const d of c.orgs)if(d.lineSkipsLevels=void 0,d.children&&d.children.length>0)for(const p of d.children)p.level!==void 0&&o(p.level)}}for(const[a,c]of n.entries())c.orientation==="vertical"&&o(a);const i=[];for(const[a,c]of n.entries())if(c.orientation==="vertical")for(const d of c.orgs){let p=a;d.parent&&typeof d.parent.level=="number"&&(p=d.parent.level+1),d.level!==p&&((l=n.get(p))==null?void 0:l.orientation)==="vertical"&&(i.push({org:d,fromLevel:a,toLevel:p}),d.level=p)}for(const{org:a,fromLevel:c,toLevel:d}of i){const p=n.get(c);p&&(p.orgs=p.orgs.filter(u=>u.id!==a.id)),n.has(d)||n.set(d,new Ht(d,[])),n.get(d).orgs.push(a)}for(const[,a]of n.entries())if(a.orgs.sort((c,d)=>c.originalIndex===void 0&&d.originalIndex===void 0?0:c.originalIndex===void 0?1:d.originalIndex===void 0?-1:c.originalIndex-d.originalIndex),a.orientation==="horizontal"){let c=a.orgs.filter(d=>d.lineSkipsLevels&&d.lineSkipsLevels>0);if(c.length>0){let d=c[0],p=c[c.length-1];if(a.level>0)c=c.slice(0,2),p=c[0],a.orgs=a.orgs.filter(u=>!c.includes(u)),a.orgs.push(p),c.length>1?(d=c[1],a.orgs.unshift(d)):d=null;else{const u=n.get(0).orgs.length*(e.maxColWidth+e.horizontalSpacing),b=d===n.root&&e.availableSpace>u,f=p===n.root&&e.availableSpace>u;(d!==n.root||b)&&(d=null),(p!==n.root||f)&&(p=null)}if(p)for(let u=1;u<=p.lineSkipsLevels;u++)n.get(a.level+u).rightSkipLine=!0;if(d)for(let u=1;u<=d.lineSkipsLevels;u++)n.get(a.level+u).leftSkipLine=!0}}let r=!0;for(const[a,c]of n.entries())if(a!==0&&c.orientation!=="vertical"){r=!1;break}r&&(n.primaryOrientation="vertical")}function $r(n,e,t){performance.now();const o=document.createElement("div"),i=-9999;o.style.position="absolute",o.style.background="#111",o.style.visibility="hidden",o.style.pointerEvents="none",o.style.left="-9999px",o.style.top=i+"px",document.body.appendChild(o);const r=o.getBoundingClientRect().top,l=new Map;function a(p,u,b=0){const f=document.createElement("div");f.className=e+" "+e+"-vertical-org",p.large&&(f.className+=" "+e+"-large"),f.style.marginLeft=b+"px",f.style.boxSizing="border-box",f.style.width="calc(100% - "+b+"px)";const k=document.createElement("div");if(k.className=e+"-title",k.textContent=p.title,f.appendChild(k),p.subtitle){const z=document.createElement("div");z.className=e+"-subtitle",z.textContent=p.subtitle||"",f.appendChild(z)}if(u.appendChild(f),p.children&&p.children.length>0)for(const z of p.children)a(z,u,b+t.verticalChildOffset);const C=f.getBoundingClientRect();return l.set(p.id,{width:C.width,height:C.height,top:C.top-r}),f}let c=Math.max(...Array.from(n.keys())),d=null;for(let p=0;p<=c;p++){const u=n.get(p);if(u){if(u.orientation==="horizontal"){let b=t.availableSpace;u.rightSkipLine&&(b-=t.skipLineExtraSpacing),u.leftSkipLine&&(b-=t.skipLineExtraSpacing),d=null;const f=document.createElement("div");f.className=e+"-level "+e+"-horizontal",f.style.columnGap=t.horizontalSpacing+"px",f.style.marginBottom=t.verticalSpacing+"px";const k=u.orgs.filter(g=>g.large),C=u.orgs.filter(g=>!g.large),z=k.length*t.largeOrgSizeMultiplier+C.length,O=(b-(z-1)*t.horizontalSpacing)/z,N=Math.min(Math.max(O*t.largeOrgSizeMultiplier,t.minColWidth*t.largeOrgSizeMultiplier),t.maxColWidth*t.largeOrgSizeMultiplier);let B=Math.min(Math.max(O*1,t.minColWidth),t.maxColWidth);f.style.width=b+"px",o.appendChild(f);const te=new Map;for(const g of u.orgs){const v=document.createElement("div");v.className=e,g.large&&(v.className+=" "+e+"-large"),v.style.width=g.large?N+"px":B+"px";const m=document.createElement("div");if(m.className=e+"-title",m.textContent=g.title,v.appendChild(m),g.subtitle){const $=document.createElement("div");$.className=e+"-subtitle",$.textContent=g.subtitle||"",v.appendChild($)}f.appendChild(v),te.set(g.id,v)}let w=0;for(const[g,v]of te){const m=v.getBoundingClientRect();l.set(g,{width:m.width,height:m.height,top:m.top-r}),w=Math.max(w,m.height)}if(C.length===0||k.length===0)for(const g of u.orgs){const v=l.get(g.id);if(v){const m=w-v.height;v.height=w,v.top-=m/2}}}else if(d===null&&u.orientation==="vertical"){d=p;const b=document.createElement("div");b.className=e+"-level "+e+"-vertical",b.style.width=t.availableSpace+"px",o.appendChild(b);const f=new Set;for(const k of u.orgs)k.parent&&f.add(k.parent);for(const k of f){const C=document.createElement("div");C.className=e+"-vertical-subtree";const z=l.get(k.id).width;C.style.width=z-t.verticalChildOffset+"px",C.style.gap=t.verticalSubtreeSpacing+"px",b.appendChild(C);for(const O of k.children||[])O.level&&O.level>=p&&a(O,C,t.verticalChildOffset)}}}}return Sr(n,l,t),document.body.removeChild(o),performance.now(),l}function Sr(n,e,t){var te;function o(w,g){const v=e.get(w);return v?Math.max(0,(g-v.width)/2):0}function i(w,g){for(const v of w){const m=e.get(v.id);m&&(m.left=g),v.children&&v.children.length>0&&i(v.children,g+t.verticalChildOffset)}}function r(w,g){if(w)for(const v of w){const m=e.get(v.id);m&&m.left!==void 0&&(m.left+=g)}}if(!n.root)return;const l=n.root.level??0,a=n.get(l);if(!a)return;const c=a.orgs;if(c.length===0)return;const d=c[0],p=e.get(d.id);if(!p)return;let u=o(d.id,t.availableSpace),b=[];if(b[0]=u,c.length>1&&e.get(c[1].id)&&(b[1]=u+p.width+t.horizontalSpacing),c.length>2){const w=e.get(c[2].id);w&&(b[2]=u-(w.width+t.horizontalSpacing))}let f=Math.min(...b.filter(w=>w!==void 0)),k=Math.max(...c.map((w,g)=>{const v=e.get(w.id);return v&&b[g]!==void 0?b[g]+v.width:0})),C=0;if(f<0?C=-f:k>t.availableSpace&&(C=t.availableSpace-k),p.left=b[0]+C,c.length>1){const w=e.get(c[1].id);w&&b[1]!==void 0&&(w.left=b[1]+C)}if(c.length>2){const w=e.get(c[2].id);w&&b[2]!==void 0&&(w.left=b[2]+C)}const z=c.map((w,g)=>{const v=e.get(w.id);return v&&v.left!==void 0?{left:v.left,right:v.left+v.width}:null}).filter(Boolean);z.sort((w,g)=>w.left-g.left);const O=[];let N=0;for(const w of z)w.left>N+1&&O.push({start:N,end:w.left}),N=w.right;N<t.availableSpace&&O.push({start:N,end:t.availableSpace}),a.emptySpaces=O;let B=!1;for(const[w,g]of n.orderedEntries())if(w!==l){if(B)if(g.orientation==="horizontal")B=!1;else continue;if(g.orientation==="horizontal"){const v=new Map;let m=t.availableSpace;g.rightSkipLine&&(m-=t.skipLineExtraSpacing),g.leftSkipLine&&(m-=t.skipLineExtraSpacing);for(const E of g.orgs)if(E.parent){const A=E.parent.id;v.has(A)||v.set(A,[]),v.get(A).push(E)}const $=[];for(const[E,A]of v.entries()){let P=0;for(const jt of A){const Me=e.get(jt.id);Me&&(P+=Me.width)}P+=t.horizontalSpacing*(A.length-1);const Le=e.get(E);let ve=Le&&Le.left!==void 0?Le.left+(Le.width-P)/2:o(A[0].id,m);ve<0&&(ve=0),ve+P>m&&(ve=m-P);let hi=ve;for(const jt of A){const Me=e.get(jt.id);Me&&(Me.left=hi,hi+=Me.width+t.horizontalSpacing)}$.push({pid:E,left:ve,right:ve+P})}$.sort((E,A)=>E.left-A.left);let T=0;for(let E=1;E<$.length;E++){const A=$[E-1],P=$[E];if(A.right+t.horizontalSpacing>P.left){const Le=A.right+t.horizontalSpacing-P.left;T+=Le}}if(T>0){const E=$[0],A=$[$.length-1];let P=T/2;E.left-=P,E.right-=P,A.left+=P,A.right+=P,r(v.get(E.pid),-P),r(v.get(A.pid),P)}let q=Math.min(...$.map(E=>E.left)),ai=Math.max(...$.map(E=>E.right)),Mt=g.leftSkipLine?t.skipLineExtraSpacing:0,ci=m+Mt,ft=0;if(q<Mt?ft=Mt-q:ai>ci&&(ft=ci-ai),ft!==0)for(const E of v.values())r(E,ft);const di=g.orgs.map(E=>{const A=e.get(E.id);return A&&A.left!==void 0?{left:A.left,right:A.left+A.width}:null}).filter(Boolean);di.sort((E,A)=>E.left-A.left);const It=[];let Qe=0;for(const E of di)E.left>Qe+1&&It.push({start:Qe,end:E.left}),Qe=E.right;Qe<m&&It.push({start:Qe,end:m}),g.emptySpaces=It}else if(g.orientation==="vertical"&&!B){const v=new Map;for(const m of g.orgs)if(m.parent){const $=m.parent.id;v.has($)||v.set($,[]),v.get($).push(m)}for(const m of g.orgs)if(v.size>1){const $=e.get(m.parent.id);i([m],$.left+t.verticalChildOffset)}else i([m],t.availableSpace/2-(((te=e.get(m.id))==null?void 0:te.width)||0)/2);g.emptySpaces=[{start:0,end:t.availableSpace}],B=!0}}return e}function _r(n,e,t){if(!n.root)return[];const o=[];function i(r){const l=Er(n,r,e,t);if(o.push(...l),r.children&&r.children.length>0)for(const a of r.children)i(a)}return i(n.root),o}function Er(n,e,t,o){var l,a,c;const i=[],r=t.get(e.id);if(!r)return i;if(e.children&&e.children.length>0){const d=n.get(e.level??0);d==null||d.orientation;const p=(d==null?void 0:d.orgs[0])===e,u=(d==null?void 0:d.orgs[d.orgs.length-1])===e,b=new Set;for(const w of(d==null?void 0:d.orgs)??[])w.parent&&b.add(w.parent.id);const f=b.size<=1,k=(r.left||0)+r.width/2,C=r.left||0,z=C+r.width,O=(w,g)=>{let v=null,m=1/0;for(const $ of w){const T=($.start+$.end)/2,q=Math.abs(T-g);q<m&&(m=q,v=T)}return v},N=(w,g)=>{const v=[];for(const m of w)for(const $ of g){const T=Math.max(m.start,$.start),q=Math.min(m.end,$.end);q>T&&v.push({start:T,end:q})}return v},B=w=>{let g=[{start:0,end:o.availableSpace}];for(let v=e.level+1;v<w;v++){const m=n.get(v);if(!(!m||!m.emptySpaces||m.emptySpaces.length===0)&&(g=N(g,m.emptySpaces),g.length===0))break}if(f&&g.length>0){const v=N(g,[{start:C,end:z}]),m=O(v,k),$=O(g,k);return m??$??k}return u?(r.left||0)+r.width-o.skipLineExtraSpacing/2:p?(r.left||0)+o.skipLineExtraSpacing/2:k};let te=null;if(e.lineSkipsLevels&&e.lineSkipsLevels>0){const w=e.children.map(g=>({child:g,childPlacement:t.get(g.id)})).filter(g=>!!g.childPlacement&&g.child.level>e.level);w.length>0&&(w.sort((g,v)=>v.child.level-e.level-(g.child.level-e.level)),te=B(w[0].child.level))}for(const w of e.children){const g=t.get(w.id),v=((l=n.get(w.level??0))==null?void 0:l.orientation)==="vertical";if(g){const m={points:[]};if(w.level===e.level)m.points.push({x:(r.left||0)+r.width/2,y:r.top+r.height/2}),m.points.push({x:(g.left||0)+g.width/2,y:g.top+g.height/2});else if(e.lineSkipsLevels&&e.lineSkipsLevels>0){const $=te??B(w.level);m.points.push({x:$,y:r.top+r.height/2});const T=((a=n.get(w.level??0))==null?void 0:a.orientation)==="vertical"?o.verticalSubtreeSpacing/2:o.verticalSpacing/2,q=g.top-T;m.points.push({x:$,y:q}),m.points.push({x:(g.left||0)+g.width/2,y:q}),m.points.push({x:(g.left||0)+g.width/2,y:g.top})}else if(v){const $=(r.left||0)+o.verticalChildOffset/2,T=g.top+g.height/2;m.points.push({x:$,y:r.top+r.height}),m.points.push({x:$,y:T}),m.points.push({x:(g.left||0)+g.width/2,y:T})}else{m.points.push({x:(r.left||0)+r.width/2,y:r.top+r.height});const $=((c=n.get(w.level??0))==null?void 0:c.orientation)==="vertical"?o.verticalSubtreeSpacing/2:o.verticalSpacing/2,T=g.top-$;m.points.push({x:(r.left||0)+r.width/2,y:T}),m.points.push({x:(g.left||0)+g.width/2,y:T}),m.points.push({x:(g.left||0)+g.width/2,y:g.top})}i.push(m)}}}return i}var Cr=Object.defineProperty,Ar=Object.getOwnPropertyDescriptor,ee=(n,e,t,o)=>{for(var i=o>1?void 0:o?Ar(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Cr(e,t,i),i};let M=class extends y{constructor(){super(...arguments),this.theme="",this.org=null,this.width=null,this.responsive=!1,this.hidelines=!1,this.label="",this.responsiveWidth=this.clientWidth,this.resizeObserver=null,this._selectedId=-1,this._treeTask=new fr(this,{args:()=>[this.org,this.responsive,this.width,this.responsiveWidth],task:async([n,e,t,o])=>{if(!n)return null;let i=t||1200;e&&(i=o),i<M.config.minColWidth&&(i=M.config.minColWidth+2*M.config.horizontalSpacing);const r={...M.config,availableSpace:i},l=xr(n);kr(l,r);const a=$r(l,"ilw-org-chart",r),c=_r(l,a,r);return{tree:l,measured:a,lines:c,width:i}}}),this.updateResponsiveWidth=()=>{this.responsive&&(this.responsiveWidth=this.clientWidth)},this.syncResponsiveObserver=()=>{this.responsive?this.resizeObserver||(this.responsiveWidth=this.clientWidth,this.resizeObserver=new ResizeObserver(this.updateResponsiveWidth),this.resizeObserver.observe(this)):this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null,this.responsiveWidth=1200,this.refreshTask())}}get selectedId(){return this._selectedId}set selectedId(n){const e=this._selectedId;this._selectedId=n;const t=this.querySelector(`#org-${e}`),o=this.querySelector(`#org-${n}`);t&&o&&(t.setAttribute("aria-selected","false"),t.setAttribute("tabindex","-1"),t.classList.remove("ilw-org-chart-selected"),o.setAttribute("aria-selected","true"),o.setAttribute("tabindex","0"),o.classList.add("ilw-org-chart-selected"),o.focus())}connectedCallback(){super.connectedCallback(),this.syncResponsiveObserver()}disconnectedCallback(){var n;(n=this.resizeObserver)==null||n.disconnect(),this.resizeObserver=null,super.disconnectedCallback()}createRenderRoot(){return this}refreshTask(){this._treeTask.run()}clickHandler(n,e){this.selectedId=e}setFocusToPreviousSibling(n){var t;const e=(t=this._treeTask.value)==null?void 0:t.tree.findPreviousSibling(n);e&&(this.selectedId=e.id)}setFocusToNextSibling(n){var t;const e=(t=this._treeTask.value)==null?void 0:t.tree.findNextSibling(n);e&&(this.selectedId=e.id)}setFocusToParent(n){var t;const e=(t=this._treeTask.value)==null?void 0:t.tree.findParent(n);e&&(this.selectedId=e.id)}setFocusToChild(n){var t;const e=(t=this._treeTask.value)==null?void 0:t.tree.findFirstChild(n);e&&(this.selectedId=e.id)}keydownHandler(n,e){var r,l,a;n.currentTarget;let t=!1,o=n.key;if(n.altKey||n.ctrlKey||n.metaKey||!((r=this._treeTask.value)!=null&&r.tree.root))return;if(!this._treeTask.value.tree.orgLookup.get(e)){console.warn(`Org with ID ${e} not found in keydownHandler.`);return}const i=this._treeTask.value.tree.primaryOrientation==="horizontal";switch(o){case"Up":case"ArrowUp":i?this.setFocusToParent(e):this.setFocusToPreviousSibling(e),t=!0;break;case"Down":case"ArrowDown":i?this.setFocusToChild(e):this.setFocusToNextSibling(e),t=!0;break;case"Right":case"ArrowRight":i?this.setFocusToNextSibling(e):this.setFocusToChild(e),t=!0;break;case"Left":case"ArrowLeft":i?this.setFocusToPreviousSibling(e):this.setFocusToParent(e),t=!0;break;case"Home":this.selectedId=(a=(l=this._treeTask.value)==null?void 0:l.tree.root)==null?void 0:a.id,t=!0;break;case"End":const c=this._treeTask.value.tree.orderedEntries();for(let d=c.length-1;d>=0;d--){const p=c[d][1];if(p.orgs.length>0){this.selectedId=p.orgs[p.orgs.length-1].id;break}}t=!0;break}t&&(n.stopPropagation(),n.preventDefault())}renderChildren(n,e,t){return h`<ul id=${n} class="org-children" role="group">
            ${e.map(o=>this.renderOrg(o,t))}
        </ul>`}renderOrg(n,e){let t=e.get(n.id);const o={"ilw-org-chart":!0,"ilw-org-chart-large":!!n.large},i={top:`${t==null?void 0:t.top}px`,left:`${t==null?void 0:t.left}px`,width:`${t==null?void 0:t.width}px`,height:`${t==null?void 0:t.height}px`},r=n.children&&n.children.length>0,l=this.selectedId===n.id;return l&&(o["ilw-org-chart-selected"]=!0),h` <li class="org-container" role="none">
            <a
                id="org-${n.id}"
                role="treeitem"
                aria-expanded=${r?"true":S}
                aria-selected=${l?"true":"false"}
                tabindex=${l?"0":"-1"}
                @click=${a=>this.clickHandler(a,n.id)}
                @keydown=${a=>this.keydownHandler(a,n.id)}
                class=${j(o)}
                style=${De(i)}
                aria-owns=${r?`org-children-${n.id}`:S}
                href="#org-${n.id}"
            >
                <span class="org-title">${n.title}</span>
                <span class="org-subtitle">${n.subtitle}</span>
            </a>
            ${n.children&&n.children.length>0?this.renderChildren(`org-children-${n.id}`,n.children,e):""}
        </li>`}render(){var n,e;if((e=(n=this._treeTask.value)==null?void 0:n.tree)!=null&&e.root){this.selectedId===-1&&(this.selectedId=this._treeTask.value.tree.root.id);let t=this._treeTask.value.width,o=0;for(const r of this._treeTask.value.measured.values())o=Math.max(o,r.top+r.height);let i=this._treeTask.value.tree.primaryOrientation;return h`<div
                class="ilw-org-chart-container"
                style="width: ${t}px; height: ${o+20}px;"
            >
                ${this.hidelines?S:h`<canvas
                          class="ilw-org-chart-canvas"
                          width=${t}
                          height=${o+20}
                      ></canvas>`}
                <ul
                    class="ilw-org-chart-top ${this.theme}"
                    aria-label=${this.label}
                    role="tree"
                    aria-orientation="${i}"
                >
                    ${this._treeTask.value?this.renderOrg(this._treeTask.value.tree.root,this._treeTask.value.measured):""}
                </ul>
            </div>`}else return h`<div>No organization data provided.</div>`}updated(n){var t,o;super.updated(n),n.has("responsive")&&this.syncResponsiveObserver();const e=(t=this.canvas)==null?void 0:t.getContext("2d");if(e&&(e.clearRect(0,0,this.canvas.width,this.canvas.height),e.strokeStyle=this.theme==""||this.theme=="white"||this.theme=="gray"?"#000000":"#ffffff",e.lineWidth=4,(o=this._treeTask.value)==null?void 0:o.lines))for(const i of this._treeTask.value.lines){e.beginPath();let r=i.points[0];e.moveTo(r.x,r.y);for(let l=1;l<i.points.length;l++){const a=i.points[l];e.lineTo(a.x,a.y)}e.lineJoin="round",e.stroke()}}};M.config={horizontalSpacing:40,availableSpace:1200,largeOrgSizeMultiplier:1.2,verticalChildOffset:20,verticalSpacing:30,verticalSubtreeSpacing:20,maxColWidth:300,minColWidth:150,skipLineExtraSpacing:80};ee([s()],M.prototype,"theme",2);ee([s()],M.prototype,"org",2);ee([s({type:Number})],M.prototype,"width",2);ee([s({type:Boolean})],M.prototype,"responsive",2);ee([s({type:Boolean})],M.prototype,"hidelines",2);ee([s()],M.prototype,"label",2);ee([he(".ilw-org-chart-canvas")],M.prototype,"canvas",2);ee([U()],M.prototype,"responsiveWidth",2);M=ee([x("ilw-org-chart")],M);const zr='.page{display:grid;width:100%;grid-template-areas:"head" "main" "foot";grid-template-rows:auto 1fr auto;grid-template-columns:1fr}.header{grid-area:head;position:relative;z-index:300}.footer{grid-area:foot}.main{grid-area:main;margin-left:var(--ilw-page--margin, 0);margin-right:var(--ilw-page--margin, 0)}.main.add-margin{margin-top:var(--ilw-page--main-margin-top, 0);margin-bottom:var(--ilw-page--main-margin-bottom, 0)}';var Or=Object.defineProperty,Tr=Object.getOwnPropertyDescriptor,Vi=(n,e,t,o)=>{for(var i=o>1?void 0:o?Tr(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Or(e,t,i),i};let Vt=class extends y{constructor(){super(),this.expanded=!0,this.expanded=!1}static get styles(){return _(zr)}renderPiece(e){return h`<div class="${e}">
    <slot name="${e}"></slot>
    </div>`}render(){return h`
      <div class="page">
      ${this.renderPiece("header")}
      <div class="main ${this.expanded?"add-margin":""}">
          <slot></slot>
      </div>
      ${this.renderPiece("footer")}
      </div>
      `}};Vi([s({type:Boolean})],Vt.prototype,"expanded",2);Vt=Vi([x("ilw-page")],Vt);const Pr=J`
  :host {
    display: block;
    container-type: inline-size;
    contain: layout;
  }
  .page-title {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    overflow: hidden;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: var(--ilw-page--padding-left);
    padding-right: var(--ilw-page--padding-right);
  }
  .page-title.fixed, .page-title.full {
    left:50%;
    margin-left:-50vw;
    margin-right:-50vw;
    padding-left:0;
    padding-right:0;
    position:relative;
    right:50%;
    width:100vw;
    display: block;
    container-type: inline-size;
    contain: layout;
  }
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  .inner {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    min-height: 12.5rem;
    margin: 0 auto;
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
  }
  .text {
    box-sizing: border-box;
    position: relative;
    z-index: 100;
    color: var(--ilw-page-title--text-color);
    text-align: left;
    font: 700 2.5em var(--il-font-sans);
    padding: 16px 14px 20px;
    margin: 0;
  }
  .page-title.fixed .text {
    margin: var(--ilw-page-title--main-margin);
  }
  @media (max-width: 1200px) {
    .text {
      margin: var(--ilw-page-title--main-margin);
    }
  }
  @media (max-width: 800px) {
    .text {
      font-size: 2em;
      margin: var(--ilw-page-title--main-margin);
    }
  }
  @media (max-width: 600px) {
    .text {
      font-size: 1.5em;
      margin: var(--ilw-page-title--main-margin);
    }
  }
  .text::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: var(--ilw-page-title--background-color);
    opacity: .85;
  }
  :host([fade]) .text::after {
    opacity: 1;
  }
`;var Lr=Object.defineProperty,Mr=Object.getOwnPropertyDescriptor,Lt=(n,e,t,o)=>{for(var i=o>1?void 0:o?Mr(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Lr(e,t,i),i};let lt=class extends y{constructor(){super(...arguments),this.theme="",this.width="",this.fade=!1}static get styles(){return Pr}get outerWidth(){return this.width==="page"||this.width==="auto"?"fixed":this.width==="full"?"full":""}render(){return h`
      <div class="page-title ${this.outerWidth}">
        <div class="background">
          <slot name="background"></slot>
        </div>
        <div class="inner">
          <div class="text">
            <slot></slot>
          </div>
        </div>
      </div>
    `}};Lt([s({type:String,reflect:!0})],lt.prototype,"theme",2);Lt([s({type:String,reflect:!0})],lt.prototype,"width",2);Lt([s({type:Boolean,reflect:!0})],lt.prototype,"fade",2);lt=Lt([x("ilw-page-title")],lt);const Ir=J`
nav {
  background: var(--ilw-color--background);
  padding: 1px 0;
}
nav.page ul {
  margin: 4px var(--ilw-margin--side, max(1.875rem, calc(50cqw - 37.5rem))) 4px;
}
ul {
  padding: 0;
  margin: 4px 0;
  list-style: none;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
li {
  padding: 0;
  list-style: none;
}
li.current, li.ellipsis, li.previous span, li.first span, li.next span, li.last span, li.pagecount span, a {
  display: flex;
  min-width: 24px;
  justify-content: center;
  padding: 12px 18px;
  font-family: var(--il-font-sans);
  font-size: 1.1875rem;
  background: var(--ilw-color--background);
  color: var(--ilw-color--control-text);
  border-color: var(--ilw-color--control-text);
  outline: solid thin var(--ilw-color--control-text);
}
li.current {
  background-color: var(--ilw-color--control-text);
  color: var(--ilw-color--control);
}
li.ellipsis, li.previous span, li.first span, li.next span, li.last span, li.pagecount span {
  outline: none;
}
li.ellipsis {
  color: var(--ilw-color--control-text);
  background: none;
}
li.pagecount span {
  margin-left: 20px;
}
a {
  font-weight: 500;
  text-decoration: none;
  color: var(--ilw-color--control-text);
  background: var(--ilw-color--control);
}
a:hover {
  color: var(--ilw-color--control);
  background: var(--ilw-color--control-text);
  text-decoration: underline;
}
a:focus {
  background: var(--ilw-color--focus--background);
  color: var(--ilw-color--focus--text);
  border-color: var(--ilw-color--focus--outline);
  text-decoration: underline;
}
`;var jr=Object.defineProperty,Rr=Object.getOwnPropertyDescriptor,W=(n,e,t,o)=>{for(var i=o>1?void 0:o?Rr(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&jr(e,t,i),i};let F=class extends y{constructor(){super(),this.page=1,this.pages=1,this.parameter="page",this.label="Page List",this.hidepagecount=!1,this.zerostart=!1,this.url="",this.width="",this.padding="",this.offset=0,this.page=1,this.pages=1,this.parameter="page",this.label="Page List",this.zerostart=!1,this.hidepagecount=!1,this.width="",this.padding="",this.url=location.href,this.offset=0}static get styles(){return _(Ir)}get paddingStyle(){return this.padding==""?"":"padding: "+this.padding+";"}get outerWidth(){return this.width=="full"||this.width=="auto"?"fixed":this.width=="page"?"page":""}get innerWidth(){return this.width=="auto"?"fixed":""}getPageUrl(e){const t=new URL(this.url);return this.parameter!=="page"&&t.searchParams.set("page",e.toString()),t.searchParams.set(this.parameter,e.toString()),t.href}getStartPage(){return this.pages<=6||this.page<3?1+this.offset:this.page>this.pages-3?this.pages-4:this.page-2}getEndPage(){return this.pages<=6||this.page>this.pages-3?this.pages:this.page<3?5+this.offset:this.page+2}render(){this.offset=this.zerostart?-1:0;let e=1+this.offset,t=[];this.page>e?(t.push(h`<li class="first"><a href="${this.getPageUrl(e)}" aria-label="First page">First</a></li>`),t.push(h`<li class="previous"><a href="${this.getPageUrl(this.page-1)}" aria-label="Previous page">Previous</a></li>`)):(t.push(h`<li class="first"><span>First</span></li>`),t.push(h`<li class="previous"><span>Previous</span></li>`)),this.getStartPage()>e&&t.push(h`<li class="ellipsis"><span>&hellip;</span></li>`);for(let o=this.getStartPage();o<=this.getEndPage();o++)o===this.page?t.push(h`<li class="current" aria-current="page"><span>${o-this.offset}</span></li>`):t.push(h`<li><a href="${this.getPageUrl(o)}" aria-label="Page ${o-this.offset}">${o-this.offset}</a></li>`);return this.getEndPage()<this.pages&&t.push(h`<li class="ellipsis"><span>&hellip;</span></li>`),this.page<this.pages?(t.push(h`<li class="next"><a href="${this.getPageUrl(this.page+1)}" aria-label="Next page">Next</a></li>`),t.push(h`<li class="last"><a href="${this.getPageUrl(this.pages)}" aria-label="Last page">Last</a></li>`)):(t.push(h`<li class="next"><span>Next</span></li>`),t.push(h`<li class="last"><span>Last</span></li>`)),this.hidepagecount||t.push(h`<li class="pagecount"><span>Page ${this.page-this.offset} of ${this.pages-this.offset}</span></li>`),h`
        <nav aria-label="${this.label}" class="${this.outerWidth}" style="${this.paddingStyle}">
            <ul class="${this.innerWidth}">
                ${t}
            </ul>
        </nav>
        `}};W([s({type:Number})],F.prototype,"page",2);W([s({type:Number})],F.prototype,"pages",2);W([s({type:String})],F.prototype,"parameter",2);W([s({type:String})],F.prototype,"label",2);W([s({type:Boolean})],F.prototype,"hidepagecount",2);W([s({type:Boolean})],F.prototype,"zerostart",2);W([s({type:String})],F.prototype,"url",2);W([s({type:String})],F.prototype,"width",2);W([s({type:String})],F.prototype,"padding",2);W([s({type:Number})],F.prototype,"offset",2);F=W([x("ilw-pagination")],F);const Nr=J`
.profile { 
    display: grid;
    grid-template-columns: 350px auto;
    grid-template-rows: auto auto auto;
    column-gap: 30px;
}
.profile-outer.fixed {
        left:50%;
        margin-left:-50vw;
        margin-right:-50vw;
        padding-left:0;
        padding-right:0;
        position:relative;
        right:50%;
        width:100vw;
    }

    .profile.page, .profile.fixed {
        margin: 0 var(--ilw-margin--side, 0);
    }

.profile .left-image {
    grid-area: 1 / 1 / span 2 / auto;
}

.profile .right-name {
    grid-area: 1 / 2 / auto / auto;
}

.profile .left-contact {
    grid-area: 3 / 1 / auto / auto;
}

.profile .right-main {
    grid-area: 2 / 2 / span 3 / auto;
}

.profile.spaced .left-image {
    grid-area: 1 / 1 / span 3 / auto;
}

.profile.spaced .right-name {
    grid-area: 1 / 2 / auto / auto;
}

.profile.spaced .left-contact {
    grid-area: 2 / 2 / auto / auto;
}

.profile.spaced .right-main {
    grid-area: 3 / 2 / auto / auto;
}

.profile .image ::slotted(img) {
    width: 350px;
}
.profile .image.round ::slotted(img) {
    border-radius: 50%;
}

@media (max-width: 700px) {
    .profile {
        display: block;
      }
}

.contact-title {
    font-family: var(--il-font-sans);
    font-weight: bold;
}

.title slot::slotted(*) {
    font-style: italic;
`;var Ur=Object.defineProperty,Dr=Object.getOwnPropertyDescriptor,Oe=(n,e,t,o)=>{for(var i=o>1?void 0:o?Dr(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Ur(e,t,i),i};let ce=class extends y{constructor(){super(),this.theme="white",this.right=!1,this.circle=!1,this.width="",this.padding="",this.right_private=!1,this.circle=!1,this.right=!1,this.width="",this.padding="",this.right_private=!1}static get styles(){return Nr}get paddingStyle(){return this.padding==""?"":"padding: "+this.padding+";"}get outerWidth(){return this.width=="full"||this.width=="auto"?"fixed":this.width=="page"?"page":""}get innerWidth(){return this.width=="auto"||this.width=="page"?"fixed":""}handleSlotchange(e){this.right_private=e.target.assignedElements({flatten:!0}).length==0}render(){return h`
        <div class="profile-outer ${this.theme} ${this.outerWidth}">
            <div style="${this.paddingStyle}" class="profile ${this.right||this.right_private?"spaced":""} ${this.innerWidth}">
                <div class="left-image">
                    <div class="image ${this.circle?"round":""}"><slot name="image"></slot></div>
                </div>
                <div class="right-name">
                    <div class="name"><slot name="name"></slot></div>
                    <div class="title"><slot name="title"></slot></div>
                </div>
                <div class="left-contact">
                    <p class="contact-title">Contact</p>
                    <div class="contact"><slot name="contact"></slot></div>
                    <div class="left"><slot name="left"></slot></div>
                </div>
                <div class="right-main">
                    <div class="main"><slot @slotchange=${this.handleSlotchange}></slot></div>
                    <div class="bottom"><slot name="bottom"></slot></div>
                </div>
            </div>
        </div>`}};Oe([s({type:String})],ce.prototype,"theme",2);Oe([s({type:Boolean})],ce.prototype,"right",2);Oe([s({type:Boolean})],ce.prototype,"circle",2);Oe([s({type:String})],ce.prototype,"width",2);Oe([s({type:String})],ce.prototype,"padding",2);Oe([s({type:Boolean})],ce.prototype,"right_private",2);ce=Oe([x("ilw-profile")],ce);const Fr="@layer base{:host{--ilw-profile-card--font: var(--il-font-sans);--ilw-profile-card--font-size: 1rem;--ilw-profile-card--heading-color: var(--ilw-color--heading);--ilw-profile-card--text-color: var(--ilw-color--text);--ilw-profile-card--heading--font-size: 1.5em;--ilw-profile-card--title--font-size: 1.1em;--ilw-profile-card--border-bottom: 4px solid var(--il-blue);--ilw-profile-card--round-image-padding: 20px 50px 10px}:host ilw-card{--ilw-card--content-padding-top: 1rem;--ilw-card--font-size: var(--ilw-profile-card--font-size)}}:host{display:block;font-family:var(--ilw-profile-card--font);font-size:var(--ilw-profile-card--font-size)}ilw-card{border-bottom:var(--ilw-profile-card--border-bottom);height:100%}.profile-image{width:100%}.profile-image ::slotted(*){width:100%}.profile-image.aspect{height:100%}.profile-image.aspect ::slotted(*){height:100%;object-fit:cover}.profile-image.round{padding:var(--ilw-profile-card--round-image-padding);box-sizing:border-box}.profile-image.round ::slotted(*){border-radius:50%;clip-path:border-box;aspect-ratio:1/1;display:block;object-fit:cover}.content{display:flex;flex-direction:column;gap:1em;color:var(--ilw-profile-card--text-color)}.content ::slotted([slot=title]){margin:0 0 .3em;font-size:var(--ilw-profile-card--title--font-size)}.icon{display:flex;align-items:center;gap:1em}.icon ::slotted(*){margin:0}.icon ::slotted([slot=address]){display:flex;flex-direction:column}.icon.hidden{display:none}.icon .icon-wrap{width:2.5em;height:1.66em;display:flex;justify-content:center;align-items:center;align-self:flex-start;margin-left:-5px;margin-top:2px;margin-bottom:-2px}";var Br=Object.defineProperty,qr=Object.getOwnPropertyDescriptor,gt=(n,e,t,o)=>{for(var i=o>1?void 0:o?qr(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Br(e,t,i),i};let Ve=class extends y{constructor(){super(),this.round=!1,this.aspectratio="",this.theme="white",this._hasSlots={}}static get styles(){return _(Fr)}_slotsChanged(){let n=this.shadowRoot.querySelectorAll("slot"),e={};for(let t of n)t.name&&t.assignedElements().length>0&&(e[t.name]=!0);this._hasSlots=e}render(){let n={"profile-image":!0,round:this.round,aspect:!!this.aspectratio};return h`
            <ilw-card
                aspectRatio=${this.aspectratio?this.aspectratio:S}
                theme=${this.theme==="gray"?"gray":S}
            >
                <div class=${j(n)} slot="image">
                    <slot name="image"></slot>
                </div>
                <div class="content">
                    <slot name="name"></slot>
                    <slot name="title"></slot>
                    <div
                        class="icon address ${this._hasSlots.address?"":"hidden"}"
                    >
                        <div class="icon-wrap">
                            <ilw-icon
                                icon="location"
                                alt="address"
                                size="1.7em"
                            ></ilw-icon>
                        </div>
                        <slot
                            name="address"
                            @slotchange=${this._slotsChanged}
                        ></slot>
                    </div>
                    <div
                        class="icon phone ${this._hasSlots.phone?"":"hidden"}"
                    >
                        <div class="icon-wrap">
                            <ilw-icon
                                icon="phone"
                                alt="phone"
                                size="1.7em"
                            ></ilw-icon>
                        </div>
                        <slot
                            name="phone"
                            @slotchange=${this._slotsChanged}
                        ></slot>
                    </div>
                    <div
                        class="icon email ${this._hasSlots.email?"":"hidden"}"
                    >
                        <div class="icon-wrap">
                            <ilw-icon
                                icon="email"
                                alt="email"
                                size="2em"
                            ></ilw-icon>
                        </div>
                        <slot
                            name="email"
                            @slotchange=${this._slotsChanged}
                        ></slot>
                    </div>
                    <div
                        class="icon hours ${this._hasSlots.hours?"":"hidden"}"
                    >
                        <div class="icon-wrap">
                            <ilw-icon
                                icon="hours"
                                alt="hours"
                                size="1.7em"
                            ></ilw-icon>
                        </div>
                        <slot
                            name="hours"
                            @slotchange=${this._slotsChanged}
                        ></slot>
                    </div>
                    <div
                        class="icon linkedin ${this._hasSlots.linkedin?"":"hidden"}"
                    >
                        <div class="icon-wrap">
                            <ilw-icon
                                icon="linkedin"
                                type="line"
                                size="2.5em"
                            ></ilw-icon>
                        </div>
                        <slot
                            name="linkedin"
                            @slotchange=${this._slotsChanged}
                        ></slot>
                    </div>
                    <div class="icon x ${this._hasSlots.x?"":"hidden"}">
                        <div class="icon-wrap">
                            <ilw-icon
                                icon="x"
                                type="line"
                                size="2.5em"
                            ></ilw-icon>
                        </div>
                        <slot name="x" @slotchange=${this._slotsChanged}></slot>
                    </div>
                    <div
                        class="icon facebook ${this._hasSlots.facebook?"":"hidden"}"
                    >
                        <div class="icon-wrap">
                            <ilw-icon
                                icon="facebook"
                                type="line"
                                size="2.3em"
                            ></ilw-icon>
                        </div>
                        <slot
                            name="facebook"
                            @slotchange=${this._slotsChanged}
                        ></slot>
                    </div>
                    <div
                        class="icon news ${this._hasSlots.news?"":"hidden"}"
                    >
                        <div class="icon-wrap">
                            <ilw-icon icon="news" size="1.7em"></ilw-icon>
                        </div>
                        <slot
                            name="news"
                            @slotchange=${this._slotsChanged}
                        ></slot>
                    </div>
                    <div
                        class="icon manager ${this._hasSlots.hr?"":"hidden"}"
                    >
                        <div class="icon-wrap">
                            <ilw-icon
                                icon="hr"
                                alt="HR"
                                size="1.7em"
                            ></ilw-icon>
                        </div>
                        <slot
                            name="hr"
                            @slotchange=${this._slotsChanged}
                        ></slot>
                    </div>
                    <slot></slot>
                </div>
            </ilw-card>
        `}};gt([s({type:Boolean})],Ve.prototype,"round",2);gt([s()],Ve.prototype,"aspectratio",2);gt([s()],Ve.prototype,"theme",2);gt([U()],Ve.prototype,"_hasSlots",2);Ve=gt([x("ilw-profile-card")],Ve);const Wr="@layer base;.container{display:grid;grid-template-rows:1fr auto auto auto 1fr;grid-template-columns:var(--ilw-profile-list--image-width) 1fr;column-gap:2rem;height:var(--ilw-profile-list--height)}.image{grid-row:1 / span 5;grid-column:1}.name{grid-row:2;grid-column:2}.subtitle{grid-row:3;grid-column:2;padding-top:3px}.main{grid-row:4;grid-column:2}::slotted(*){font:400 1rem/1.5rem var(--il-font-sans);color:var(--ilw-profile-list--text-color)}.name ::slotted(*){font:600 1.3125rem/1.75rem var(--il-font-sans);color:var(--ilw-profile-list--link-color)}::slotted(*) a{font:600 1.3125rem/1.75rem var(--il-font-sans);color:var(--ilw-link--color)}";var Hr=Object.defineProperty,Vr=Object.getOwnPropertyDescriptor,si=(n,e,t,o)=>{for(var i=o>1?void 0:o?Vr(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Hr(e,t,i),i};let Ct=class extends y{constructor(){super(),this.padding="",this.circle=!1,this.circle=!1,this.padding=""}static get styles(){return _(Wr)}get paddingStyle(){return this.padding==""?{}:{padding:this.padding}}render(){return h`
            <div class="container" style="${De(this.paddingStyle)}">
                <div class="name"><slot name="name"></slot></div>
                <div class="image"><slot name="image"></slot></div>
                <div class="subtitle"><slot name="subtitle"></slot></div>
                <div class="main"><slot></slot></div>
            </div>
        `}};si([s({type:String})],Ct.prototype,"padding",2);si([s({type:Boolean})],Ct.prototype,"circle",2);Ct=si([x("ilw-profile-list")],Ct);const Kr=":host{display:block;background:var(--ilw-color--background)}#quote{margin:0 auto;max-width:var(--ilw-quote--max-width)}#content{color:var(--ilw-color--heading);position:relative}#content:before{content:var(--ilw-quote--mark-content-before);position:relative;font-style:normal;color:var(--ilw-color--control-accent);font:var(--ilw-quote--mark-font);line-height:1;height:var(--ilw-quote--mark-height);top:var(--ilw-quote--mark-top);display:block}";var Gr=Object.defineProperty,Jr=Object.getOwnPropertyDescriptor,Ze=(n,e,t,o)=>{for(var i=o>1?void 0:o?Jr(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Gr(e,t,i),i};let Se=class extends y{constructor(){super(),this.theme="",this.align="center",this.size="small",this.font="serif",this.padding=""}static get styles(){return _(Kr)}get paddingStyle(){return this.padding==""?"padding: 1rem 0;":"padding: "+this.padding+";"}render(){return h`
            <blockquote id="quote" style="${this.paddingStyle}">
                <div id="content"><slot name="content"></slot></div>
                <div id="source"><slot name="author"></slot><slot name="source"></slot></div>
            </blockquote>
    `}};Ze([s()],Se.prototype,"theme",2);Ze([s()],Se.prototype,"align",2);Ze([s()],Se.prototype,"size",2);Ze([s()],Se.prototype,"font",2);Ze([s()],Se.prototype,"padding",2);Se=Ze([x("ilw-quote")],Se);const Yr='@layer base{:host{--ilw-section-nav--margin-top: 1.5em;--ilw-section-nav--collapsed--margin-bottom: 1.5em;--ilw-section-nav--collapsed--border: 2px solid var(--ilw-color--control-text);--ilw-section-nav--font: var(--il-font-sans);--ilw-section-nav--line-height: 1.2rem;--ilw-section-nav--level-padding: .9375rem;--ilw-section-nav--level2-padding: 1.5625rem;--ilw-section-nav--level0-font-size: 1.125rem;--ilw-section-nav--level1-font-size: 1rem;--ilw-section-nav--font-weight: 600;--ilw-section-nav--item--height: 2.75rem;--ilw-section-nav--item--padding-top: .7rem;--ilw-section-nav--item--padding-right: .625rem;--ilw-section-nav--item--padding-bottom: .7rem;--ilw-section-nav--item--padding-left: 1.25rem;--ilw-section-nav--level1-border: 1px solid var(--ilw-color--border-light);--ilw-section-nav--root--font-size: 1.25rem;--ilw-section-nav--root--background: var(--il-storm-95);--ilw-section-nav--root--font-weight: 700;--ilw-section-nav--toggle--font-size: 1rem;--ilw-section-nav--toggle--background: #E8E9EB;--ilw-section-nav--toggle--font: var(--il-font-sans);--ilw-section-nav--toggle--font-weight: 400;--ilw-section-nav--toggle--border: 1px solid var(--ilw-color--border-light);--ilw-section-nav--current--symbol: "▸ ";--ilw-section-nav--current--size: .35rem;--ilw-section-nav--current--left: -.6875rem}}:host{display:block;container-type:inline-size;font-family:var(--ilw-section-nav--font)}:host ::slotted(a){color:var(--ilw-color--heading);display:block;padding-top:var(--ilw-section-nav--item--padding-top);padding-right:var(--ilw-section-nav--item--padding-right);padding-bottom:var(--ilw-section-nav--item--padding-bottom);align-content:center;position:relative}:host ::slotted(a[aria-current="page"]){color:var(--ilw-color--link-hover)}:host ::slotted(a:is(:hover,[data-simulated-hover] *)){text-decoration:underline;color:var(--ilw-color--link-hover)}:host ::slotted(a:is(:focus,[data-simulated-focus] *)){color:var(--ilw-color--focus--text);background-color:var(--ilw-color--focus--background);outline-color:var(--ilw-color--focus--outline)}.section-nav-top{margin-top:var(--ilw-section-nav--margin-top)}.section-nav-list{list-style:none;margin:0;padding:0;line-height:var(--ilw-section-nav--line-height);font-weight:var(--ilw-section-nav--font-weight);--ilw-section-nav--padding-multiplier: 1;--ilw-section-nav--level-border: none}.section-nav-list ::slotted(a){padding-left:calc(var(--ilw-section-nav--item--padding-left) + var(--ilw-section-nav--level-padding) * var(--ilw-section-nav--padding-multiplier) + var(--ilw-section-nav--level2-padding));border-top:var(--ilw-section-nav--level-border)}.section-nav-list--level-0{font-size:var(--ilw-section-nav--level0-font-size);--ilw-section-nav--level-border: var(--ilw-section-nav--level1-border)}.section-nav-list--level-0 ::slotted(a){padding-left:var(--ilw-section-nav--item--padding-left)}.section-nav-list--level-0 ::slotted(a.ilw-section-nav--root){font-size:var(--ilw-section-nav--root--font-size);background:var(--ilw-section-nav--root--background);font-weight:var(--ilw-section-nav--root--font-weight);border-top:none}.section-nav-list--level-0 ::slotted(a.ilw-section-nav--root:focus){color:var(--ilw-color--focus--text);background-color:var(--ilw-color--focus--background);outline-color:var(--ilw-color--focus--outline)}.section-nav-list--level-1{font-size:var(--ilw-section-nav--level1-font-size);--ilw-section-nav--level-border: none}.section-nav-list--level-1 ::slotted(a){padding-left:calc(var(--ilw-section-nav--item--padding-left) + var(--ilw-section-nav--level-padding))}.section-nav-list--level-2{--ilw-section-nav--padding-multiplier: 1}.section-nav-list--level-3{--ilw-section-nav--padding-multiplier: 2}.section-nav-list--level-4{--ilw-section-nav--padding-multiplier: 3}.section-nav-list--level-5{--ilw-section-nav--padding-multiplier: 4}.section-nav-list--level-6{--ilw-section-nav--padding-multiplier: 5}.section-nav-list--level-7{--ilw-section-nav--padding-multiplier: 6}#section-nav-toggle{border-top:none;border-bottom:var(--ilw-section-nav--toggle--border);border-left:none;border-right:none;box-sizing:border-box;width:100%;font-family:var(--ilw-section-nav--toggle--font);min-height:var(--ilw-section-nav--item--height);font-weight:var(--ilw-section-nav--toggle--font-weight);font-size:var(--ilw-section-nav--toggle--font-size);text-align:left;padding-left:var(--ilw-section-nav--item--padding-left);padding-right:var(--ilw-margin--side);background:var(--ilw-section-nav--toggle--background);display:none;position:relative}#section-nav-toggle:active{color:var(--ilw-color--focus--text);background:var(--ilw-color--focus--background)}#section-nav-toggle:is(:focus,[data-simulated-focus] *){color:var(--ilw-color--focus--text);background-color:var(--ilw-color--focus--background);outline-color:var(--ilw-color--focus--outline);outline-offset:-1px}#section-nav-toggle .chevron{height:.5rem;position:absolute;right:var(--ilw-margin--side);top:calc(50% - .25rem)}.open #section-nav-toggle .chevron{transform:scale(-1)}@media screen and (max-width: 700px){.auto-collapse.section-nav-top{margin-top:0;margin-bottom:var(--ilw-section-nav--collapsed--margin-bottom);border-bottom:var(--ilw-section-nav--collapsed--border)}.auto-collapse #section-nav-toggle{display:block}.auto-collapse .section-nav-list--level-0{display:none}.auto-collapse.open .section-nav-list--level-0{display:block}.section-nav-full-width{left:50%;margin-left:-50vw;margin-right:-50vw;position:relative;right:50%;width:100vw;box-sizing:border-box}}.force-collapse.section-nav-top{margin-top:0;margin-bottom:var(--ilw-section-nav--collapsed--margin-bottom);border-bottom:var(--ilw-section-nav--collapsed--border)}.force-collapse #section-nav-toggle{display:block}.force-collapse .section-nav-list--level-0{display:none}.force-collapse.open .section-nav-list--level-0{display:block}';let Zr=class{constructor(e){this._host=e,this._observer=new MutationObserver(t=>{this._host.requestUpdate()}),e.addController(this)}_refreshInternal(){var i,r;let e=Array.from(this._host.children),t=(r=(i=this._host)==null?void 0:i.shadowRoot)==null?void 0:r.querySelectorAll("slot");if(!t)return;let o=Array.from(t);for(let l of o){let a=e.shift();a&&l.assign(a)}}hostUpdated(){this._refreshInternal()}hostConnected(){this._observer.observe(this._host,{childList:!0})}disconnect(){this._observer.disconnect()}};var Qr=Object.defineProperty,Xr=Object.getOwnPropertyDescriptor,Te=(n,e,t,o)=>{for(var i=o>1?void 0:o?Xr(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&Qr(e,t,i),i};const Ei=h` <svg
    aria-hidden="true"
    class="chevron"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40.4 23.82"
>
    <path
        fill="currentColor"
        d="m39.34,1.06c-1.41-1.41-3.7-1.41-5.12,0l-14.02,14.02L6.18,1.06C4.76-.35,2.47-.35,1.06,1.06s-1.41,3.7,0,5.12l16.58,16.58c1.41,1.41,3.7,1.41,5.12,0L39.34,6.18c1.41-1.41,1.41-3.7,0-5.12Z"
    ></path>
</svg>`;let Q=class extends y{constructor(){super(),this.mode="",this.collapse="",this.open="false",this.label="Pages In This Section",this.isRoot=!0,this._level=0,this._observer=new Zr(this)}static get styles(){return _(Yr)}connectedCallback(){var e;super.connectedCallback();let n=(e=this.parentElement)==null?void 0:e.closest("ilw-section-nav");n?(this.isRoot=!1,this._level=n._level+1):this.isRoot=!0}toggle(){this.open==="true"?this.open="false":this.open="true"}render(){return this.mode==="manual"?this._renderManual():this._renderAutomatic()}_renderAutomatic(){let n=[],e=!!this.getAttribute("data-simulated-hover"),t=!!this.getAttribute("data-simulated-focus");for(let i=0;i<this.children.length;i++){const r={"section-nav-item":!0,"section-nav-item--root":i===0&&this.isRoot},l=this.children.item(i+1),a=l&&l.tagName==="ILW-SECTION-NAV";let c;a?(c=h` <slot></slot>
                    <slot></slot>`,++i):c=h` <slot></slot>`,n.push(h` <li class=${j(r)}>${c}</li>`)}const o=h`
            <ul
                class="section-nav-list section-nav-list--level-${this._level}"
                id="section-nav--level-${this._level}"
                data-simulate-hover=${e?"true":S}
                data-simulate-focus=${t?"true":S}
            >
                ${n}
            </ul>
        `;if(this.isRoot){const i={"section-nav-top":!0,"auto-collapse":!this.collapse,"force-collapse":this.collapse==="true","prevent-collapse":this.collapse==="false","section-nav-full-width":!this.collapse,open:this.open==="true"};return h` <div class=${j(i)}>
                <nav aria-labelledby="section-nav-toggle">
                    <button
                        id="section-nav-toggle"
                        type="button"
                        @click="${this.toggle}"
                        aria-expanded=${this.open}
                        aria-controls="section-nav--level-${this._level}"
                    >
                        ${this.label} ${Ei}
                    </button>
                    ${o}
                </nav>
            </div>`}return o}_renderManual(){let n=!!this.getAttribute("data-simulated-hover"),e=!!this.getAttribute("data-simulated-focus");const t={"section-nav-top":!0,"section-nav-manual":!0,"auto-collapse":!this.collapse,"force-collapse":this.collapse==="true","prevent-collapse":this.collapse==="false","section-nav-full-width":!this.collapse,open:this.open==="true"};return h` <div class=${j(t)}>
            <nav
                aria-labelledby="section-nav-toggle"
                data-simulate-hover=${n?"true":S}
                data-simulate-focus=${e?"true":S}
            >
                <button
                    id="section-nav-toggle"
                    type="button"
                    @click="${this.toggle}"
                    aria-expanded=${this.open}
                    aria-controls="section-nav--level-${this._level}"
                >
                    ${this.label} ${Ei}
                </button>
                <div id="section-nav--level-${this._level}">
                    <slot></slot>
                </div>
            </nav>
        </div>`}};Q.shadowRootOptions={...y.shadowRootOptions,slotAssignment:"manual"};Te([s()],Q.prototype,"mode",2);Te([s()],Q.prototype,"collapse",2);Te([s({reflect:!0})],Q.prototype,"open",2);Te([s()],Q.prototype,"label",2);Te([s({reflect:!0})],Q.prototype,"isRoot",2);Te([U()],Q.prototype,"_level",2);Q=Te([x("ilw-section-nav")],Q);var el=Object.defineProperty,tl=Object.getOwnPropertyDescriptor,Ki=(n,e,t,o)=>{for(var i=o>1?void 0:o?tl(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&el(e,t,i),i};let Kt=class extends y{constructor(){super(),this.height="20px",this.height="20px"}render(){return h`
        <div role="presentation" style="box-sizing: border-box; display: block; padding: 0 0 ${this.height} 0; margin: 0; background-color: transparent; visibility: hidden;"></div>
    `}};Ki([s()],Kt.prototype,"height",2);Kt=Ki([x("ilw-spacer")],Kt);const il=".stat{color:var(--ilw-statistic--stat-color)}.source{font-style:italic}";var ol=Object.defineProperty,nl=Object.getOwnPropertyDescriptor,mt=(n,e,t,o)=>{for(var i=o>1?void 0:o?nl(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&ol(e,t,i),i};let Ke=class extends y{constructor(){super(),this.theme="white",this.accent="blue",this.size="medium",this.padding="",this.theme="white",this.accent="blue",this.size="medium",this.padding=""}static get styles(){return _(il)}get paddingStyle(){return this.padding==""?"":"padding: "+this.padding+";"}render(){return h`
        <div class="main" style="${this.paddingStyle}">
            <span class="top"></span><slot name="top"></slot></span><br>
            <span class="stat"> <slot name="stat"></slot></span><br>
            <span class="text"> <slot></slot></span><br>
            <span class="source"> <slot name="source"></slot></span>
        </div>
      `}};mt([s({type:String})],Ke.prototype,"theme",2);mt([s({type:String})],Ke.prototype,"accent",2);mt([s({type:String})],Ke.prototype,"size",2);mt([s({type:String})],Ke.prototype,"padding",2);Ke=mt([x("ilw-statistic")],Ke);const rl=J`
    #container {
        display: var(--ilw-tabs--display);
        background: var(--ilw-color--background);
        column-gap: 60px;
        margin: 0 auto;
        max-width: var(--ilw-tabs--max-width);
        padding: var(--ilw-tabs--padding, 60px 30px 75px);
    }

    #outer.full, #outer.auto {
        left:50%;
        margin-left:-50vw;
        margin-right:-50vw;
        padding-left:0;
        padding-right:0;
        position:relative;
        right:50%;
        width:100vw;
    }

    #outer.page {
        background: var(--ilw-color--background);
    }

    #container.auto, #container.page {
        --ilw-tabs--padding: 60px var(--ilw-margin--side, 0) 75px;
        --ilw-tabs--max-width: 1200px;
    }

    .horizontal #tablist {
        border-bottom: var(--ilw-tabs--button-border);
        margin-bottom: 20px;
    }

    #tabpanels {
        width: 100%;
    }

    @container (max-width: 800px) {
        #container, #container.auto, #container.page {
            --ilw-tabs--display: block;
            --ilw-tabs--tablist-display: flex;
            --ilw-tabs--tablist-width: auto;
        }

        #tablist {
            margin-bottom: 20px;
        }

        .horizontal #tablist {
            border-bottom: none;
        }
     }
    
    #container.compact, #container.compact.auto, #container.compact.page {
        --ilw-tabs--display: block;
        --ilw-tabs--tablist-display: flex;
        --ilw-tabs--tablist-width: auto;
        --ilw-tabs--padding: 60px 20px 75px;
    }

    #container.compact #tablist {
        margin-bottom: 20px;
    }

    #container.compact .horizontal #tablist {
        border-bottom: none;
    }
`;var ll=Object.defineProperty,sl=Object.getOwnPropertyDescriptor,Pe=(n,e,t,o)=>{for(var i=o>1?void 0:o?sl(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&ll(e,t,i),i};let de=class extends y{constructor(){super(),this.theme="white",this.width="",this.default="",this.horizontal=!1,this.rounded=!1,this.compact=!0,this.theme="white",this.width="",this.default="",this.horizontal=!1,this.handleMutation=this.handleMutation.bind(this),this.handleResize=this.handleResize.bind(this),this.handleTabClick=this.handleTabClick.bind(this),this.handleKeyPress=this.handleKeyPress.bind(this)}static get styles(){return rl}connectedCallback(){super.connectedCallback(),this.hasContainerSupport()||this.addResizeListeners(),this.addMutationObserver(),this.handleDocumentLoaded()}disconnectedCallback(){this.hasContainerSupport()||this.removeResizeListeners(),super.disconnectedCallback()}handleDocumentLoaded(){this.initializeTabs(),this.default==""?this.setActiveTab(this.querySelector('*[role="tab"]')):this.setActiveTab(this.querySelector(`*[role="tab"][aria-controls="${this.default}"`))}handleMutation(){this.initializeTabs()}handleResize(){this.classList[this.isCompact()?"add":"remove"]("ilw-compact")}handleTabClick(n){this.setActiveTab(n.currentTarget)}handleKeyPress(n){if(n.code=="Enter"||n.code=="Space")this.setActiveTab(n.currentTarget);else if(n.code=="ArrowUp"||n.code=="ArrowLeft"){let e=n.currentTarget.previousElementSibling;e instanceof HTMLElement&&(this.setActiveTab(e),e.focus())}else if(n.code=="ArrowDown"||n.code=="ArrowRight"){let e=n.currentTarget.nextElementSibling;e instanceof HTMLElement&&(this.setActiveTab(e),e.focus())}}addMutationObserver(){new MutationObserver(this.handleMutation).observe(this,{attributes:!1,childList:!0,subtree:!0})}addResizeListeners(){window.addEventListener("load",this.handleResize.bind(this)),window.addEventListener("resize",this.handleResize.bind(this))}getAllTabs(){return this.querySelectorAll('*[role="tab"]')}getTabPanel(n){const e=n==null?void 0:n.getAttribute("aria-controls");return e?document.getElementById(e):null}hasContainerSupport(){return CSS.supports("container-type","inline-size")}initializeTab(n){!this.tabIsInitialized(n)&&n instanceof HTMLElement&&(n.setAttribute("tabindex","-1"),n.setAttribute("data-ilw-initialized","1"),n.addEventListener("click",this.handleTabClick),n.addEventListener("keydown",this.handleKeyPress))}initializeTabs(){this.getAllTabs().forEach(n=>this.initializeTab(n))}isCompact(){return this.offsetWidth<800}removeResizeListeners(){window.removeEventListener("load",this.handleResize.bind(this)),window.removeEventListener("resize",this.handleResize.bind(this))}setActiveTab(n){this.getAllTabs().forEach(e=>{e===n?this.setTabAsActive(e):this.setTabAsInactive(e)})}setTabAsActive(n){const e=this.getTabPanel(n);e?(n.setAttribute("aria-selected","true"),n.setAttribute("tabindex","0"),e.setAttribute("data-ilw-tab-visible","1")):console.warn("Tab panel not found for tab:",n)}setTabAsInactive(n){const e=this.getTabPanel(n);e?(n.setAttribute("aria-selected","false"),n.setAttribute("tabindex","-1"),e.setAttribute("data-ilw-tab-visible","0")):console.warn("Tab panel not found for tab:",n)}tabIsInitialized(n){return n.hasAttribute("data-ilw-initialized")}render(){return h`
        <div id="outer" class="${this.theme} ${this.width} ${this.horizontal?"horizontal":""}">
            <div id="container" class="${this.theme} ${this.width}">
                <div id="tablist">
                    <slot name="tabs"></slot>
                </div>
                <div id="tabpanels">
                    <slot></slot>
                </div>
            </div>
        </div>`}};Pe([s({type:String})],de.prototype,"theme",2);Pe([s()],de.prototype,"width",2);Pe([s()],de.prototype,"default",2);Pe([s({type:Boolean})],de.prototype,"horizontal",2);Pe([s({type:Boolean})],de.prototype,"rounded",2);Pe([s({type:Boolean,reflect:!0})],de.prototype,"compact",2);de=Pe([x("ilw-tabs")],de);const al='@layer base{:host{--ilw-tooltip--text-color: var(--ilw-color--text);--ilw-tooltip--background: var(--ilw-color--background);--ilw-tooltip--width: 200px;--ilw-tooltip--font: 400 1rem/1.375rem var(--il-font-sans);--ilw-tooltip--heading-font: 700 1rem/1.375rem var(--il-font-sans)}}:host{display:inline-block;position:relative}.tooltip{position:absolute;background:var(--ilw-tooltip--background);color:var(--ilw-tooltip--text-color);font:var(--ilw-tooltip--font);border-radius:.5rem;box-shadow:2px 0 4px 4px #0000001a;padding:8px 12px;z-index:1000;opacity:0;pointer-events:none;transition:opacity .2s;inline-size:max-content;max-inline-size:var(--ilw-tooltip--width);min-inline-size:min-content;white-space:normal;max-width:min(var(--ilw-tooltip--width),calc(100vw - 16px));box-sizing:border-box;overflow-wrap:break-word;word-break:break-word}:host([visible]) .tooltip{opacity:1;pointer-events:auto}.tooltip:after{content:"";position:absolute;width:0;height:0;filter:drop-shadow(2px 2px 4px rgba(0,0,0,.1))}::slotted(a){font:var(--ilw-tooltip--font);color:inherit}:host([arrow="top-center"]) .tooltip:after{left:50%;bottom:-6px;transform:translate(-50%);border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid var(--ilw-tooltip--background)}:host([arrow="top-left"]) .tooltip:after{left:12px;bottom:-6px;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid var(--ilw-tooltip--background)}:host([arrow="top-right"]) .tooltip{right:0}:host([arrow="top-right"]) .tooltip:after{right:12px;bottom:-6px;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid var(--ilw-tooltip--background)}:host([arrow="left"]) .tooltip:after{top:50%;right:-6px;transform:translateY(-50%);border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:6px solid var(--ilw-tooltip--background)}:host([arrow="right"]) .tooltip:after{top:50%;left:-6px;transform:translateY(-50%);border-top:6px solid transparent;border-bottom:6px solid transparent;border-right:6px solid var(--ilw-tooltip--background)}:host([arrow="bottom-center"]) .tooltip:after{top:-6px;left:50%;transform:translate(-50%);border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid var(--ilw-tooltip--background)}:host([arrow="bottom-left"]) .tooltip:after{top:-6px;left:12px;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid var(--ilw-tooltip--background)}:host([arrow="bottom-right"]) .tooltip:after{top:-6px;right:12px;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid var(--ilw-tooltip--background)}';var cl=Object.defineProperty,dl=Object.getOwnPropertyDescriptor,vt=(n,e,t,o)=>{for(var i=o>1?void 0:o?dl(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&cl(e,t,i),i};let _e=class extends y{constructor(){super(),this.theme="",this.arrow="top-center",this.visible=!1,this._longPressTimer=null,this._touchMoved=!1,this._ignoreNextPointerDown=!1,this._tooltipId="tooltip-"+Math.random().toString(36).substring(2,10)}firstUpdated(){const n=this.querySelector('[slot="trigger"]'),e=this.querySelector('[slot="content"]');n&&e&&(e.id||(e.id=this._tooltipId),n.hasAttribute("aria-describedby")||n.setAttribute("aria-describedby",e.id),n.setAttribute("tabindex",n.getAttribute("tabindex")||"0"),n.addEventListener("mouseenter",this._showTooltip.bind(this)),n.addEventListener("mouseleave",this._maybeHideTooltip.bind(this)),n.addEventListener("focus",this._showTooltip.bind(this)),n.addEventListener("blur",this._maybeHideTooltip.bind(this)),n.addEventListener("touchstart",this._onTouchStart.bind(this),{passive:!1}),n.addEventListener("touchmove",this._onTouchMove.bind(this),{passive:!1}),n.addEventListener("touchend",this._onTouchEnd.bind(this),{passive:!1}),n.addEventListener("touchcancel",this._onTouchCancel.bind(this),{passive:!1})),document.addEventListener("keydown",this._onEscape.bind(this)),document.addEventListener("pointerdown",this._onDocumentClick.bind(this))}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onEscape.bind(this)),document.removeEventListener("pointerdown",this._onDocumentClick.bind(this))}_onDocumentClick(n){const e=this.querySelector('[slot="trigger"]'),t=this.tooltipElement;if(this._ignoreNextPointerDown){this._ignoreNextPointerDown=!1;return}const o=e&&e.contains(n.target),i=t&&t.contains(n.target);!o&&!i&&(this._hideTooltip(),document.activeElement===e&&e.blur())}async _showTooltip(){this.visible=!0,this._ignoreNextPointerDown=!0,await this.updateComplete,this._positionTooltip()}_hideTooltip(){this.visible&&(this.visible=!1,this._ignoreNextPointerDown=!1)}_onEscape(n){n.key==="Escape"&&this._hideTooltip()}_onTouchStart(n){this._touchMoved=!1,this._longPressTimer&&(clearTimeout(this._longPressTimer),this._longPressTimer=null),this._longPressTimer=setTimeout(()=>{this._showTooltip(),n.preventDefault(),n.stopPropagation()},500)}_onTouchMove(n){this._touchMoved=!0,this._longPressTimer&&(clearTimeout(this._longPressTimer),this._longPressTimer=null)}_onTouchEnd(n){this._longPressTimer&&(clearTimeout(this._longPressTimer),this._longPressTimer=null)}_onTouchCancel(n){this._longPressTimer&&(clearTimeout(this._longPressTimer),this._longPressTimer=null)}_maybeHideTooltip(){requestAnimationFrame(()=>{const n=this.querySelector('[slot="trigger"]'),e=n==null?void 0:n.matches(":hover"),t=document.activeElement===n;!e&&!t&&this._hideTooltip()})}_positionTooltip(){const n=this.querySelector('[slot="trigger"]'),e=this.tooltipElement;if(!n||!e)return;const t=12,o=this.getAttribute("arrow");let i=0,r=0;const{offsetTop:l,offsetLeft:a,offsetWidth:c,offsetHeight:d}=n;e.style.left="0px",e.style.right="auto";const p=e.getBoundingClientRect();switch(o){case"top-left":i=l-p.height-t,r=a;break;case"top-right":i=l-p.height-t,r=a+c-p.width;break;case"top-center":i=l-p.height-t,r=a+(c-p.width)/2;break;case"bottom-left":i=l+d+t,r=a;break;case"bottom-right":i=l+d+t,r=a+c-p.width;break;case"bottom-center":i=l+d+t,r=a+(c-p.width)/2;break;case"left":i=l+(d-p.height)/2,r=a-p.width-t;break;case"right":i=l+(d-p.height)/2,r=a+c+t;break}e.style.top=`${i}px`,e.style.left=`${r}px`,e.style.right="auto";const u=8,b=document.documentElement.clientWidth,f=e.getBoundingClientRect();let k=0;if(f.left<u&&(k+=u-f.left),f.right>b-u&&(k-=f.right-(b-u)),k!==0){const C=Number.parseFloat(e.style.left||"0")||0;e.style.left=`${C+k}px`,e.style.right="auto"}}render(){return h`
      <slot name="trigger"></slot>
      <div class="tooltip" role="tooltip" aria-hidden=${!this.visible}>
        <slot name="content"></slot>
      </div>
    `}};_e.styles=_(al);vt([s({type:String,attribute:!0})],_e.prototype,"theme",2);vt([s({type:String,reflect:!0})],_e.prototype,"arrow",2);vt([s({type:Boolean,reflect:!0})],_e.prototype,"visible",2);vt([he(".tooltip")],_e.prototype,"tooltipElement",2);_e=vt([x("ilw-tooltip")],_e);const hl='.aspectratio{position:relative;aspect-ratio:var(--ilw-video--aspect-ratio)}.aspectratio:before{display:top;padding-top:calc(var(--ilw-video--aspect-ratio, .5625) * 100%);content:""}.aspectratio>::slotted(iframe),.aspectratio>::slotted(embed),.aspectratio>::slotted(object){position:absolute;top:0;left:0;width:100%;height:100%}';let pl=class{};class ul extends pl{constructor(e,t){super(),this._videoId=e.split("/").pop(),this._videoCode="26883701",this._videoType="",this._videoUrl="";let o=e.toLowerCase();if(o=="")this._videoType="blank";else if(o.includes("youtube")||o.includes("youtu.be")){const i=e.split("v=");i.length>1&&(this._videoId=i[1]),this._videoType="youtube",this._videoUrl=`https://www.youtube.com/embed/${this._videoId}`}else if(o.includes("mediaspace")){if(t=="vertical"&&(this._videoCode="44666331"),this._videoType="mediaspace",o.includes("embed/secure")){this._videoCode=this._videoId;let i=e.split("/");this._videoId=i[i.length-3]}this._videoUrl=`https://mediaspace.illinois.edu/embed/secure/iframe/entryId/${this._videoId}/uiConfId/${this._videoCode}`}else o.includes("vimeo")&&(this._videoType="vimeo",this._videoUrl=`https://player.vimeo.com/video/${this._videoId}`)}get videoType(){return this._videoType}get videoId(){return this._videoId}get videoCode(){return this._videoCode}get videoUrl(){return this._videoUrl}}const gl={UrlItem:ul};class ml{}class et extends ml{static convertAspectRatio(e){switch(e){case"tv":return console.warn('Legacy aspect ratio "tv" is deprecated. Converting to 16/9.'),"16/9";case"vertical":return console.warn('Legacy aspect ratio "vertical" is deprecated. Converting to 9/16.'),"9/16";default:return e}}static pixelate(e){return isNaN(e)?e:e+"px"}}var vl=Object.defineProperty,fl=Object.getOwnPropertyDescriptor,me=(n,e,t,o)=>{for(var i=o>1?void 0:o?fl(e,t):e,r=n.length-1,l;r>=0;r--)(l=n[r])&&(i=(o?l(e,t,i):l(i))||i);return o&&i&&vl(e,t,i),i};let G=class extends y{static get styles(){return _(hl)}constructor(){super(),this.aspectratio="",this.title="",this.height="",this.width=""}render(){const n=this.aspectratio?`--ilw-video--aspect-ratio: ${et.convertAspectRatio(this.aspectratio)}`:"";if(this.src!==void 0){const e=this.getIframeDimensions(null);this.height=this.height?this.height:e.height,this.width=this.width?this.width:e.width;const t=this.generateIframe(this.src??"",this.title,this.view??"");return h`
                <div class="video">
                    <div class="aspectratio" style="${n} max-height: ${et.pixelate(this.height)}; max-width: ${et.pixelate(this.width)};">
                        ${t}
                    </div>
                </div>
                `}return h`
            <div class="video">
                <div class="aspectratio" style="${n} max-height: ${et.pixelate(this.height)}; max-width: ${et.pixelate(this.width)};">
                    <slot @slotchange=${this.handleSlotChange}></slot>
                </div>
            </div>
            `}generateIframe(n,e,t){console.warn(`Generating iframe for ${e}`);let o=new gl.UrlItem(n,t);return o.videoType=="youtube"?h`<iframe title='${e} (video)' style='position: absolute; top: 0; left: 0; width: 100%; height: 100%;' src='${o.videoUrl}' frameborder='0' allowfullscreen></iframe>`:o.videoType=="mediaspace"?h`<iframe title='${e} (video)' id='kaltura_player_${o.videoId}' class='kmsembed' style='position: absolute; top: 0; left: 0; width: 100%; height: 100%;' src='${o.videoUrl}' style='float: left; margin: 10px 10px 10px 0;' allowfullscreen webkitallowfullscreen mozAllowFullScreen allow='autoplay *; fullscreen *; encrypted-media *' frameborder='0'></iframe>`:o.videoType=="vimeo"?h`<iframe title='${e} (video)' style='position: absolute; top: 0; left: 0; width: 100%; height: 100%;' src='${o.videoUrl}' frameborder='0' allowfullscreen></iframe>`:o.videoType=="blank"?h`<div style='position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: black; color: white; display: flex; justify-content: center; align-items: center; font-weight: bold;'>${e}</div>`:h``}getIframeDimensions(n){const e=(n==null?void 0:n.getAttribute("height"))??"100%",t=(n==null?void 0:n.getAttribute("width"))??"100%";return{height:e,width:t}}handleSlotChange(n){if(this.embed===void 0||this.embed.length<=0)return;const e=this.embed[0],t=this.getIframeDimensions(e);this.height=this.height?this.height:t.height,this.width=this.width?this.width:t.width}};me([wt()],G.prototype,"embed",2);me([s({attribute:!0})],G.prototype,"aspectratio",2);me([s({attribute:!0,reflect:!0})],G.prototype,"height",2);me([s({attribute:!0})],G.prototype,"src",2);me([s({attribute:!0})],G.prototype,"title",2);me([s({attribute:!0})],G.prototype,"view",2);me([s({attribute:!0,reflect:!0})],G.prototype,"width",2);G=me([x("ilw-video")],G);customElements.get("ilw-video")||customElements.define("ilw-video",G);
