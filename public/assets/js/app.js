async function loadIncludes() {
  const slots = document.querySelectorAll('[data-include]');
  await Promise.all([...slots].map(async el => {
    const url = el.getAttribute('data-include');
    const html = await fetch(url).then(r => r.text());
    el.outerHTML = html;
  }));
}

function initNavToggle(){
  const btn = document.querySelector('.nav__toggle');
  const menu = document.getElementById('menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    if (!expanded) menu.setAttribute('data-open','');
    else menu.removeAttribute('data-open');
  });
  menu.addEventListener('click', (e) => {
    if(e.target.tagName === 'A'){
      btn.setAttribute('aria-expanded','false');
      menu.removeAttribute('data-open');
    }
  });
}

function initScrollShadow(){
  const header = document.querySelector(".nav");
  if(!header) return;
  const toggle = ()=>{
    if (window.scrollY > 4) header.classList.add("nav--scrolled");
    else header.classList.remove("nav--scrolled");
  };
  toggle();
  window.addEventListener("scroll", toggle, { passive:true });
}

function initContactForm(){
  const form = document.querySelector('#contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value || 'Traveler';
    alert(`Thanks, ${name}! Your inquiry has been received. We’ll email you shortly.`);
    form.reset();
  });
}

function initScrollTop(){
  const btn=document.getElementById("scrollTopBtn");
  if(!btn) return;
  window.addEventListener("scroll",()=>{ (window.scrollY>400)?btn.classList.add("show"):btn.classList.remove("show"); });
  btn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
}

function initLightbox(){
  const lb=document.getElementById("lightbox");
  const galleryRoot=document.querySelector(".gallery");
  if(!lb || !galleryRoot) return;

  const items=[...galleryRoot.querySelectorAll("a")];
  if(!items.length) return;

  const img=lb.querySelector(".lightbox__img");
  const cap=lb.querySelector(".lightbox__caption");
  const close=lb.querySelector(".lightbox__close");

  // Create Prev/Next buttons if not present
  let prev=lb.querySelector(".lightbox__prev");
  let next=lb.querySelector(".lightbox__next");
  if(!prev){
    prev=document.createElement("button");
    prev.className="lightbox__btn lightbox__prev";
    prev.setAttribute("aria-label","Previous image");
    prev.textContent="‹";
    lb.querySelector(".lightbox__panel").appendChild(prev);
  }
  if(!next){
    next=document.createElement("button");
    next.className="lightbox__btn lightbox__next";
    next.setAttribute("aria-label","Next image");
    next.textContent="›";
    lb.querySelector(".lightbox__panel").appendChild(next);
  }

  let idx=0;
  const open=()=>{ lb.classList.add("is-open"); lb.setAttribute("aria-hidden","false"); };
  const hide=()=>{ lb.classList.remove("is-open"); lb.setAttribute("aria-hidden","true"); img.src=""; };

  function show(i){
    idx=(i+items.length)%items.length;
    const a=items[idx];
    img.src=a.getAttribute("href") || a.querySelector("img")?.src || "";
    img.alt=a.querySelector("img")?.alt || "";
    cap.textContent=a.dataset.caption || a.querySelector("img")?.alt || "";
    open();
  }

  galleryRoot.addEventListener("click",(e)=>{
    const a=e.target.closest("a"); if(!a) return;
    const i=items.indexOf(a);
    if(i>-1){ e.preventDefault(); show(i); }
  });

  prev.addEventListener("click",()=>show(idx-1));
  next.addEventListener("click",()=>show(idx+1));

  close.addEventListener("click", hide);
  lb.addEventListener("click",(e)=>{ if(e.target===lb) hide(); });

  window.addEventListener("keydown",(e)=>{
    if(!lb.classList.contains("is-open")) return;
    if(e.key==="Escape") hide();
    else if(e.key==="ArrowRight") show(idx+1);
    else if(e.key==="ArrowLeft") show(idx-1);
  });
}

(async function(){
  await loadIncludes();
  initNavToggle();
  initScrollShadow();
  initContactForm();
  initScrollTop();
  initLightbox();
})();
