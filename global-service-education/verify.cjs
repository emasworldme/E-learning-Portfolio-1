const fs=require('fs'),vm=require('vm'),assert=require('assert');
const content=fs.readFileSync(__dirname+'/content.js','utf8');let app=fs.readFileSync(__dirname+'/app.js','utf8');app=app.slice(0,app.indexOf(" document.getElementById('language').addEventListener"));
const elements={};const get=id=>elements[id]||(elements[id]={textContent:'',innerHTML:'',value:'',addEventListener(){}});
const context={URLSearchParams,location:{search:'',hash:''},document:{documentElement:{lang:''},getElementById:get,querySelectorAll:()=>[],querySelector:()=>null},Intl,console};vm.createContext(context);vm.runInContext(content+'\n'+app,context);
vm.runInContext(`
function check(ok,msg){if(!ok)throw new Error(msg)}
check(release([true,true,true,true]),'all gates');check(!release([true,true,false,true]),'missing gate');
check(metrics([40,34,25,20,12,8,5])[1]===80,'observed denominator');check(metrics([0,0,0,0,0,0,0]).every(x=>x===null),'zero denominators');
check(model({learners:100,hours:1.5,hourly:40,build:12000,support:2000})[1]===-8000,'net value');check(model({learners:0,hours:0,hourly:0,build:0,support:0})[2]===null,'undefined ROI');
check(JSON.stringify(clampCohort([10,30,50,40,20,30,40]))==='[10,10,10,10,10,10,10]','bounded counts');
function translations(x,path='root'){if(!x||typeof x!=='object')return;if('en'in x){check('de'in x&&'tr'in x,path+' missing translation');for(const k of ['en','de','tr'])check(x[k]!==undefined&&x[k]!==null,path+' empty');}else for(const [k,v]of Object.entries(x))translations(v,path+'.'+k)}translations(content);translations(ui);
for(const language of ['en','de','tr']){lang=language;for(const r of routes){route=r;render();check(document.getElementById('view').innerHTML.length>300,language+'/'+r);check(!document.getElementById('view').innerHTML.includes('undefined'),language+'/'+r+' undefined');}}
for(const r of content.raci)check(r.slice(1).filter(x=>x==='A').length===1,'RACI accountability');
console.log('PASS: 24 localised views, language-key coverage, RACI accountability, release gating, KPI denominators, zero values, cost model, bounded cohorts. UI interactions not tested by this script.');
`,context);
new Function(content);new Function(fs.readFileSync(__dirname+'/app.js','utf8'));
