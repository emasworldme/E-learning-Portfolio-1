(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const progress = document.getElementById('progress-bar');
  const trackerFill = document.getElementById('tracker-fill');
  const percent = document.getElementById('scroll-percent');
  const cursor = document.getElementById('cursor-orbit');
  document.getElementById('year').textContent = new Date().getFullYear();
  let scrollQueued = false;
  function updateScroll() {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const value = Math.min(1, Math.max(0, scrollY / max));
    progress.style.transform = `scaleX(${value})`;
    trackerFill.style.transform = `scaleY(${value})`;
    percent.textContent = String(Math.round(value * 100)).padStart(2, '0');
    scrollQueued = false;
  }
  addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }, {passive:true});
  addEventListener('resize', updateScroll, {passive:true}); updateScroll();

  const trackerItems = [...document.querySelectorAll('.tracker-item')];
  const targets = ['top','work','lab','about','cv','management-evidence','capabilities','contact']
    .map(id => document.getElementById(id)).filter(Boolean);
  function updateActiveSection(){
    const marker = Math.min(innerHeight * .38, 360);
    let active = targets[0];
    for(const target of targets){
      if(target.getBoundingClientRect().top <= marker) active = target;
      else break;
    }
    trackerItems.forEach(item => {
      const on = item.dataset.track === active.id;
      item.classList.toggle('active', on);
      if(on) item.setAttribute('aria-current','location');
      else item.removeAttribute('aria-current');
    });
  }
  let sectionQueued=false;
  function queueActiveSection(){
    if(sectionQueued)return;
    sectionQueued=true;
    requestAnimationFrame(()=>{updateActiveSection();sectionQueued=false});
  }
  addEventListener('scroll',queueActiveSection,{passive:true});
  addEventListener('resize',queueActiveSection,{passive:true});
  updateActiveSection();

  const revealObserver = new IntersectionObserver(entries => {for(const e of entries) if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}}, {threshold:.08,rootMargin:'0px 0px -45px 0px'});
  document.querySelectorAll('.reveal').forEach(el => reduce ? el.classList.add('visible') : revealObserver.observe(el));

  const menuButton=document.getElementById('menu-button'), mobileNav=document.getElementById('mobile-nav');
  menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Open menu':'Close menu');mobileNav.hidden=open});
  mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu')}));

  if (!coarse && !reduce) {
    let cx=-100,cy=-100,tx=-100,ty=-100;
    addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;cursor.style.opacity='1'}, {passive:true});
    document.querySelectorAll('a,button,[data-tilt],#network').forEach(el=>{el.addEventListener('pointerenter',()=>cursor.classList.add('hover'));el.addEventListener('pointerleave',()=>cursor.classList.remove('hover'))});
    function cursorFrame(){cx+=(tx-cx)*.24;cy+=(ty-cy)*.24;cursor.style.left=cx+'px';cursor.style.top=cy+'px';requestAnimationFrame(cursorFrame)}requestAnimationFrame(cursorFrame);
    document.querySelectorAll('[data-tilt]').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1000px) rotateY(${x*2.6}deg) rotateX(${-y*2.6}deg)`},{passive:true});card.addEventListener('pointerleave',()=>card.style.transform='')});
  }


  // CV perspectives and the in-page PDF viewer.
  const cvTabs=[...document.querySelectorAll('.cv-tab')];
  function selectCvTab(tab, focus=false){
    for(const item of cvTabs){
      const active=item===tab;
      item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;
      document.getElementById(item.getAttribute('aria-controls')).hidden=!active;
    }
    if(focus)tab.focus();
  }
  cvTabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>selectCvTab(tab));
    tab.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      e.preventDefault();
      const next=e.key==='Home'?0:e.key==='End'?cvTabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+cvTabs.length)%cvTabs.length;
      selectCvTab(cvTabs[next],true);
    });
  });
  const cvDialog=document.getElementById('cv-dialog');
  const cvFrame=cvDialog.querySelector('iframe');
  const cvOpen=document.getElementById('cv-dialog-open');
  const cvDownload=document.getElementById('cv-dialog-download');
  let cvReturnFocus=null;
  document.querySelectorAll('.cv-preview-trigger').forEach(button=>button.addEventListener('click',()=>{
    const file=button.dataset.pdf;cvReturnFocus=button;
    document.getElementById('cv-dialog-title').textContent=button.dataset.label;
    cvFrame.title=button.dataset.label+' PDF preview';cvFrame.src=file;
    cvOpen.href=file;cvDownload.href=file;
    if(typeof cvDialog.showModal==='function')cvDialog.showModal();else window.open(file,'_blank','noopener');
  }));
  cvDialog.querySelector('.cv-dialog-close').addEventListener('click',()=>cvDialog.close());
  cvDialog.addEventListener('click',e=>{if(e.target===cvDialog)cvDialog.close()});
  cvDialog.addEventListener('close',()=>{cvFrame.removeAttribute('src');cvReturnFocus?.focus()});

  const canvas=document.getElementById('network'), stage=canvas.parentElement, tooltip=document.getElementById('stage-tooltip');
  const ctx=canvas.getContext('2d',{alpha:true}); if(!ctx)return;
  const nodes=[
    {label:'RISE 360',id:'project-rise',color:'#b9f67c',p:[-1.05,.36,-.08]},
    {label:'RISE COURSE 02',id:'project-rise-new',color:'#f5b985',p:[.18,1.08,-.40]},
    {label:'STORYLINE TUTORIAL',id:'project-storyline',color:'#8ee9e1',p:[-1.02,-.12,.56]},
    {label:'COURSE AGENT',id:'project-agent',color:'#72dce1',p:[.82,.72,.52]},
    {label:'FEMALEPRENEURSHIP',id:'project-game',color:'#d0a9f6',p:[-.55,-.78,.76]},
    {label:'MR PILOT',id:'project-mr',color:'#e7df9a',p:[1.00,-.52,-.26]},
    {label:'NOTION / SERVICE',id:'project-notion',color:'#b9f67c',p:[.14,-1.05,-.50]},
    {label:'CAPABILITIES',id:'capabilities',color:'#f5b985',p:[1.00,.04,-.60]}
  ];
  const dots=[];for(let i=0;i<110;i++){const a=i*2.39996323,y=1-(i/(109))*2,r=Math.sqrt(Math.max(0,1-y*y));dots.push([Math.cos(a)*r*1.4,y*1.4,Math.sin(a)*r*1.4])}
  const edges=[];for(let i=0;i<dots.length;i++)for(let j=i+1;j<dots.length;j++){const a=dots[i],b=dots[j],d=(a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2;if(d<.35&&edges.length<300)edges.push([i,j])}
  let w=0,h=0,dpr=1,rx=-.19,ry=.35,targetRX=rx,targetRY=ry,drag=false,moved=false,lastX=0,lastY=0,hover=-1,screenNodes=[],pointerX=-999,pointerY=-999,pointerInside=false;
  function resize(){const r=canvas.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
  new ResizeObserver(resize).observe(canvas);resize();
  function project(p){let [x,y,z]=p;let c=Math.cos(ry),s=Math.sin(ry);[x,z]=[x*c+z*s,-x*s+z*c];c=Math.cos(rx);s=Math.sin(rx);[y,z]=[y*c-z*s,y*s+z*c];const scale=Math.min(w,h)*.22;const perspective=3.8/(3.8-z);return{x:w/2+x*scale*perspective,y:h/2+y*scale*perspective,z,depth:perspective}}
  function frame(){ctx.clearRect(0,0,w,h);if(!reduce){if(!drag)targetRY+=.0015;rx+=(targetRX-rx)*.06;ry+=(targetRY-ry)*.06}const ps=dots.map(project);
    ctx.lineWidth=1;for(const [i,j] of edges){const a=ps[i],b=ps[j],alpha=Math.max(.045,Math.min(.15,(a.z+b.z+4)*.028));ctx.strokeStyle=`rgba(112,216,221,${alpha})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
    const sorted=ps.map((p,i)=>({...p,i})).sort((a,b)=>a.z-b.z);for(const p of sorted){ctx.fillStyle=`rgba(142,221,216,${Math.max(.15,Math.min(.52,(p.z+2)*.16))})`;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(.7,p.depth*1.3),0,Math.PI*2);ctx.fill()}
    screenNodes=nodes.map((n,i)=>({...project(n.p),i}));if(pointerInside&&!drag){hover=-1;let best=Infinity;screenNodes.forEach(n=>{const d=Math.hypot(n.x-pointerX,n.y-pointerY);if(d<24*n.depth&&d<best){best=d;hover=n.i}});canvas.style.cursor=hover>=0?'pointer':'grab';if(hover>=0){tooltip.textContent=nodes[hover].label+' ↗';tooltip.style.left=Math.min(w-155,pointerX+14)+'px';tooltip.style.top=Math.max(55,pointerY-34)+'px';tooltip.hidden=false}else tooltip.hidden=true}const order=[...screenNodes].sort((a,b)=>a.z-b.z);for(const p of order){const n=nodes[p.i],active=p.i===hover,r=active?10:7;ctx.shadowBlur=active?28:15;ctx.shadowColor=n.color;ctx.fillStyle=n.color;ctx.beginPath();ctx.arc(p.x,p.y,r*p.depth,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=n.color;ctx.globalAlpha=active?.65:.3;ctx.beginPath();ctx.arc(p.x,p.y,(r+9)*p.depth,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;ctx.fillStyle='#d9eeee';ctx.font='600 10px Space Grotesk, sans-serif';ctx.textAlign='center';ctx.fillText(n.label,p.x,p.y-23*p.depth)}
    if(!reduce)requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame);
  const coords=e=>{const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
  canvas.addEventListener('pointerdown',e=>{drag=true;moved=false;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener('pointermove',e=>{const p=coords(e);pointerX=p.x;pointerY=p.y;pointerInside=true;if(drag){let dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;targetRY+=dx*.008;targetRX=Math.max(-1.2,Math.min(1.2,targetRX+dy*.008));lastX=e.clientX;lastY=e.clientY;hover=-1;tooltip.hidden=true;}},{passive:true});
  canvas.addEventListener('pointerup',e=>{drag=false;if(!moved&&hover>=0)document.getElementById(nodes[hover].id)?.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});try{canvas.releasePointerCapture(e.pointerId)}catch{}});
  canvas.addEventListener('pointerenter',e=>{const p=coords(e);pointerX=p.x;pointerY=p.y;pointerInside=true});
  canvas.addEventListener('pointerleave',()=>{pointerInside=false;if(!drag){hover=-1;tooltip.hidden=true}});
})();

// Contents, Find and voice assistant
(()=>{
  const panel=document.getElementById('contents-panel'), trigger=document.getElementById('contents-trigger'), close=document.getElementById('contents-close'), backdrop=document.getElementById('contents-backdrop');
  const input=document.getElementById('portfolio-search'), results=document.getElementById('search-results'), mic=document.getElementById('voice-button'), status=document.getElementById('voice-status'), tip=document.getElementById('contents-tip');
  if(!panel||!trigger)return;
  const items=[
    ['Introduction','Profile, roles, qualifications and interactive project map','top','intro profile learning design qualifications project map'],
    ['Emotion, cognition & adult learning','Rise 360 interactive adult education course','project-rise','rise adult learning emotion cognition articulate course'],
    ['Action learning & PBL','31-lesson Rise course and SCORM case study','project-rise-new','action learning pbl project based learning scorm'],
    ['Multilingual language tutorial','Storyline 360 English–German audio tutorial','project-storyline','storyline language english german audio tutorial'],
    ['Course Agent','AI-supported course agent prototype','project-agent','course agent ai artificial intelligence'],
    ['AI Agent — Kursassistent','Source-grounded adult education AI agent generated by Merve','project-kursassistent','ai agent kursassistent adult education source grounded generated'],
    ['Femalepreneurship Game','Serious game and doctoral research project','project-game','femalepreneurship serious game research entrepreneurship'],
    ['Mixed Reality Pilot','MR learning prototype and evaluation','project-mr','mixed reality mr pilot prototype'],
    ['Service Education, Project Planning & Management','Notion workspace for service education, project planning, management and documentation','project-notion','notion service education project planning project management service management workflow knowledge management documentation stakeholder coordination'],
    ['MR Learning Readiness — Case Design','Notion case covering learning readiness, expert review and learning evidence','project-notion','mr learning readiness case design completion competency expert review learning evidence'],
    ['AquaTrace — Independent Water-Tech Case','Independent fictional service-education case covering onboarding, version management and support routing','project-notion','aquatrace water technology customer onboarding document version management support routing targeted training'],
    ['Working Guide & Evidence Register','Working guide, evidence register, quality review and documentation','project-notion','working guide evidence register source review quality assurance documentation'],
    ['Delivery Backlog','Kanban, backlog, priorities and acceptance criteria','project-notion','delivery backlog kanban agile planning prioritisation acceptance criteria'],
    ['Decision Log','Decision records, governance and change rationale','project-notion','decision log governance change rules working records'],
    ['Global Service Education Integration','Multilingual service education integration in English, German and Turkish','project-notion','global service education integration english german turkish en de tr'],
    ['Project & Service Operations','Leadership, operating models, process design, governance and continuous improvement','management-evidence','project leadership team coordination business alignment customer journey operating model process design governance agile quality assurance workforce analytics customer success continuous improvement'],
    ['Capabilities & Credentials','E-learning, Unity, C#, Python, AI, UX, research, project and service capabilities','capabilities','capabilities credentials skills articulate storyline rise scorm moodle frontline unity c# visual studio python c sql ai ux research project service'],
    ['Selected Certificates','Harvard, UBC, HP/edX, HEC Montréal, EFIE, TÜBİTAK, Rotary and METU credentials','capabilities','certificates harvard cs50 cs50x ubc hp edx hec montreal efie tubitak rotary metu credentials'],
    ['Learning Lab','Experimental learning design and prototypes','lab','learning lab experiment prototype'],
    ['About','Research, practice, tools, languages and Google Scholar','about','about research tools languages scholar publications'],
    ['CVs','Learning Design CV and Academic CV','cv','cv resume curriculum vitae academic professional'],
    ['Contact','LinkedIn, Google Scholar and collaboration links','contact','contact linkedin google scholar collaboration']
  ];
  function openPanel(){panel.hidden=false;backdrop.hidden=false;trigger.setAttribute('aria-expanded','true');setTimeout(()=>input.focus(),40)}
  function closePanel(){panel.hidden=true;backdrop.hidden=true;trigger.setAttribute('aria-expanded','false')}
  trigger.addEventListener('click',openPanel);close.addEventListener('click',closePanel);backdrop.addEventListener('click',closePanel);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)closePanel()});
  document.querySelectorAll('.contents-list a').forEach(a=>{a.addEventListener('mouseenter',()=>tip.textContent=a.dataset.tip);a.addEventListener('focus',()=>tip.textContent=a.dataset.tip);a.addEventListener('click',closePanel)});
  function search(q,auto=false){q=q.trim().toLowerCase().replace(/show me|find|search for|go to|open|take me to|please/g,' ').replace(/\s+/g,' ').trim();results.innerHTML='';if(!q){status.textContent='Type a topic or use the microphone to ask the portfolio assistant.';return}const words=q.split(' ').filter(Boolean);const found=items.map(x=>[x,words.reduce((n,w)=>n+(x.join(' ').toLowerCase().includes(w)?1:0),0)]).filter(x=>x[1]).sort((a,b)=>b[1]-a[1]).slice(0,5);if(!found.length){status.textContent=`No close match for “${q}”. Try Notion, project management, AquaTrace, MR, capabilities, certificates, AI agent, Storyline, Rise, CV or research.`;return}status.textContent=`Found ${found.length} match${found.length>1?'es':''} for “${q}”.`;found.forEach(([x])=>{const a=document.createElement('a');a.className='search-result';a.href='#'+x[2];a.innerHTML=`${x[0]}<small>${x[1]}</small>`;a.addEventListener('click',()=>{closePanel();setTimeout(()=>{const el=document.getElementById(x[2]);el?.classList.add('search-highlight');setTimeout(()=>el?.classList.remove('search-highlight'),1900)},450)});results.appendChild(a)});if(auto&&found[0])setTimeout(()=>results.querySelector('a')?.click(),550)}
  input.addEventListener('input',()=>search(input.value));input.addEventListener('keydown',e=>{if(e.key==='Enter')search(input.value,true)});
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){mic.addEventListener('click',()=>{status.textContent='Voice search is not supported in this browser. Please use the Find field.'});return}
  const rec=new SR();rec.lang='en-US';rec.interimResults=false;rec.maxAlternatives=1;
  mic.addEventListener('click',()=>{try{rec.start();mic.classList.add('listening');status.textContent='Listening… Ask for a project, Notion case, capability, certificate, CV, research, or contact.'}catch(e){}});
  rec.onresult=e=>{const phrase=e.results[0][0].transcript;input.value=phrase;status.textContent=`I heard: “${phrase}”`;search(phrase,true)};rec.onend=()=>mic.classList.remove('listening');rec.onerror=()=>{mic.classList.remove('listening');status.textContent='I could not hear that clearly. Try again or type your search.'};
})();
