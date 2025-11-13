(function(){
  // Reveal on scroll
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Toast helper
  window.toast = function(msg){
    let t = document.querySelector('.toast');
    if(!t){
      t = document.createElement('div');
      t.className='toast';
      t.style.position='fixed'; t.style.right='18px'; t.style.bottom='18px';
      t.style.zIndex='999'; t.style.background='var(--card)'; t.style.color='var(--text)';
      t.style.padding='12px 14px'; t.style.borderRadius='12px';
      t.style.border='1px solid'; t.style.borderColor='color-mix(in oklch, var(--text) 10%, transparent)';
      t.style.boxShadow='var(--shadow-2)'; t.style.opacity='0'; t.style.transform='translateY(6px)';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.transition='opacity .3s ease, transform .3s ease';
    requestAnimationFrame(()=>{ t.style.opacity='1'; t.style.transform='translateY(0)'; });
    setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateY(6px)'; }, 1600);
  };
})();
