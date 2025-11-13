function requireUtils(){
  if(!window || !window.Utils){
    alert('Gagal memuat utilitas. Pastikan <script defer src="js/utils.js"> ada di <head>.');
    throw new Error('Utils missing');
  }
  return window.Utils;
}

document.addEventListener('DOMContentLoaded',()=>{
  const U = requireUtils();
  const steps = document.getElementById('steps');
  let state = { n:null, phi:null, e:null, d:null };

  function add(s){ U.addStep(steps,s); }
  function prog(p){ const el=document.getElementById('prog'); if(el) el.style.width=p; }

  function compute(){
    steps.innerHTML=''; prog('0%');
    const p = parseInt(document.getElementById('p').value);
    const q = parseInt(document.getElementById('q').value);
    if(!Number.isInteger(p)||!Number.isInteger(q)){ alert('p dan q harus bilangan bulat.'); return; }
    if(!U.isPrime(p)||!U.isPrime(q)){ alert('p dan q harus bilangan prima.'); return; }
    if(p===q){ alert('p dan q tidak boleh sama.'); return; }

    add(`Pilih dua bilangan prima p=${p}, q=${q}`); prog('20%');
    const n = p*q; add(`Hitung n = p × q = ${p} × ${q} = ${n}`); prog('40%');
    if(n<=25){ alert('n harus > 25 agar huruf A..Z bisa dienkripsi. Pilih p dan q lebih besar.'); return; }
    const phi = (p-1)*(q-1); add(`Hitung φ(n) = (p−1)(q−1) = ${p-1} × ${q-1} = ${phi}`); prog('60%');
    let e = 3; while(e<phi){ if(U.gcd(e,phi)===1) break; e+=2; }
    if(e>=phi){ alert('Tidak menemukan e relatif prima. Ganti p & q.'); return; }
    add(`Pilih e relatif prima. e = ${e}`); prog('75%');
    const d = U.modInverse(e,phi);
    if(d===null){ alert('Gagal mencari invers modular. Coba p & q lain.'); return; }
    add(`Hitung d = e⁻¹ mod φ(n) = ${d}`); prog('100%');
    state = { n, phi, e, d };
    document.getElementById('nVal').textContent = n;
    document.getElementById('phiVal').textContent = phi;
    document.getElementById('eVal').textContent = e;
    document.getElementById('dVal').textContent = d;
  }

  document.getElementById('gen').addEventListener('click', compute);

  document.getElementById('exportPub').addEventListener('click', ()=>{
    if(!state.n) compute();
    if(!state.n) return;
    Utils.download('public_key.json', { algorithm:'RSA', n: state.n, e: state.e, generatedAt: new Date().toISOString() });
    window.toast && toast('public_key.json diunduh');
  });

  document.getElementById('exportPriv').addEventListener('click', ()=>{
    if(!state.n) compute();
    if(!state.n) return;
    Utils.download('private_key.json', { algorithm:'RSA', n: state.n, d: state.d, generatedAt: new Date().toISOString() });
    window.toast && toast('private_key.json diunduh');
  });
});
