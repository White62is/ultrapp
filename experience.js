(() => {
  'use strict';
  const devices = [{"name":"Smart TV","file":"assets/devices-0.jpg"},{"name":"TV Box","file":"assets/devices-1.jpeg"},{"name":"Fire Stick","file":"assets/devices-2.jpeg"},{"name":"Mi Stick","file":"assets/devices-3.jpeg"},{"name":"Notebook","file":"assets/devices-4.jpeg"},{"name":"Celular","file":"assets/devices-5.jpeg"}];
  const descriptions = [
    'Sua sala pode ser o melhor lugar para dar play. Informe o modelo da sua Smart TV e receba as orientações para configurar o aplicativo.',
    'Conecte sua TV Box à internet e leve a experiência UltraPlay para a televisão. Nossa equipe orienta a configuração para o seu modelo.',
    'Use seu Fire TV Stick para explorar a UltraPlay na TV. Fale com a equipe para receber as orientações de instalação e acesso.',
    'Seu Mi Stick também pode fazer parte da experiência. Informe o modelo no WhatsApp para receber as instruções do aplicativo.',
    'Aproveite o conteúdo na tela do seu notebook. Peça à equipe as orientações de acesso para o seu computador.',
    'Leve seu próximo play com você. Informe se seu celular é Android ou iPhone para receber as orientações de acesso.'
  ];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const safeRead = key => {try{return sessionStorage.getItem(key);}catch{return null;}};
  const safeWrite = (key,value) => {try{sessionStorage.setItem(key,value);}catch{}};
  const dialog = document.querySelector('#trial-dialog');
  let returnFocus = null;
  let offerTimer;
  function openTrial(trigger) {
    if (dialog.open) return;
    clearTimeout(offerTimer);
    returnFocus = trigger || document.activeElement;
    dialog.showModal();
    document.body.classList.add('modal-open');
    safeWrite('ultraplay-trial-offer-v2','seen');
  }
  document.querySelectorAll('[data-open-trial]').forEach(button=>button.addEventListener('click',()=>openTrial(button)));
  document.querySelectorAll('.dialog-close,.dialog-later').forEach(button=>button.addEventListener('click',()=>dialog.close()));
  dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(returnFocus instanceof HTMLElement&&returnFocus!==document.body)returnFocus.focus({preventScroll:true});});
  dialog.querySelector('a').addEventListener('click',()=>dialog.close());
  let offerReady = false;
  const tryAutoOffer = () => {if(offerReady&&!safeRead('ultraplay-trial-offer-v2')&&document.visibilityState==='visible')openTrial();};
  if (!safeRead('ultraplay-trial-offer-v2')) offerTimer=setTimeout(()=>{offerReady=true;tryAutoOffer();},5500);
  document.addEventListener('visibilitychange',tryAutoOffer);
  const savedMotion = safeRead('ultraplay-motion-paused-v3');
  let paused = savedMotion === 'true';
  const motionButtons = [...document.querySelectorAll('[data-motion-control]')];
  function updateMotion(){document.body.classList.toggle('motion-paused',paused);document.body.classList.toggle('motion-enabled',!paused);motionButtons.forEach(button=>{button.setAttribute('aria-pressed',String(paused));button.innerHTML=paused?'<span aria-hidden="true">▶</span> Ativar animações':'<span aria-hidden="true">Ⅱ</span> Pausar animações';});}
  updateMotion();
  motionButtons.forEach(button=>button.addEventListener('click',()=>{paused=!paused;safeWrite('ultraplay-motion-paused-v3',String(paused));updateMotion();}));
  if ('IntersectionObserver' in window) {
    document.body.classList.add('js-motion');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px 30px 0px'});
    document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
    const count=document.querySelector('[data-count]');
    const counter=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting))return;counter.disconnect();const target=Number(count.dataset.count);const started=performance.now();function tick(time){const progress=Math.min((time-started)/1300,1);count.textContent=String(Math.round(target*(1-Math.pow(1-progress,3))));if(progress<1&&!paused)requestAnimationFrame(tick);else count.textContent=String(target);}requestAnimationFrame(tick);},{threshold:.5});
    counter.observe(count);
  }
  const tabs=[...document.querySelectorAll('[data-device]')];
  const panel=document.querySelector('#device-panel');
  let currentDevice=0;
  let deviceAuto=true;
  function selectDevice(index,focus=false){
    currentDevice=index;
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
    const device=devices[index];
    const photo=document.querySelector('#device-image');
    photo.src=device.file;photo.alt=device.name;
    document.querySelector('#device-name').textContent=device.name;
    document.querySelector('#device-description').textContent=descriptions[index];
    panel.setAttribute('aria-labelledby',tabs[index].id);
    panel.classList.remove('changed');
    requestAnimationFrame(()=>requestAnimationFrame(()=>panel.classList.add('changed')));
    if(focus)tabs[index].focus();
  }
  tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>{deviceAuto=false;panel.parentElement.classList.add('manual-device');selectDevice(index);});tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();deviceAuto=false;panel.parentElement.classList.add('manual-device');selectDevice(next,true);});});
  const isOnScreen=element=>{const r=element.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight;};
  setInterval(()=>{if(!paused&&deviceAuto&&!dialog.open&&document.visibilityState==='visible'&&isOnScreen(panel)&&!panel.parentElement.matches(':hover')&&!panel.parentElement.contains(document.activeElement))selectDevice((currentDevice+1)%devices.length);},6500);
  const categoryWords=['FILMES','SÉRIES','ESPORTES','ANIMES','TV AO VIVO'];
  const categoryText=document.querySelector('#hero-category');
  let categoryIndex=0;
  setInterval(()=>{if(paused||document.visibilityState!=='visible')return;categoryIndex=(categoryIndex+1)%categoryWords.length;categoryText.classList.remove('word-enter');categoryText.textContent=categoryWords[categoryIndex];requestAnimationFrame(()=>categoryText.classList.add('word-enter'));},3200);
  const categoryCards=[...document.querySelectorAll('.category-card')];
  let featuredCategory=0;
  categoryCards[0]?.classList.add('category-active');
  setInterval(()=>{if(paused||document.visibilityState!=='visible'||!isOnScreen(categoryCards[0].parentElement))return;categoryCards[featuredCategory].classList.remove('category-active');featuredCategory=(featuredCategory+1)%categoryCards.length;categoryCards[featuredCategory].classList.add('category-active');},2200);
  let scrollScheduled=false;
  const progress=document.querySelector('#reading-progress');
  const updateScroll=()=>{const range=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(range>0?scrollY/range:0)+')';document.querySelector('.site-header').classList.toggle('header-scrolled',scrollY>60);scrollScheduled=false;};
  addEventListener('scroll',()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(updateScroll);}},{passive:true});
  updateScroll();
})();