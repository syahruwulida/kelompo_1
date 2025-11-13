function requireUtils(){ if(!window||!window.Utils){ alert('Utils belum siap.'); throw new Error('Utils missing'); } return window.Utils; }

document.addEventListener('DOMContentLoaded',()=>{
  const U = requireUtils();
  const steps = document.getElementById('steps');
  const prog = document.getElementById('prog');
  const inputShift = document.getElementById('shift');
  const inputPlain = document.getElementById('plain');
  const out = document.getElementById('out');

  // safety: pastikan elemen ada
  if(!steps || !prog || !inputShift || !inputPlain || !out){
    alert('Halaman Caesar Encrypt tidak lengkap: periksa id elemen.');
    return;
  }

  document.getElementById('encrypt').onclick = async ()=>{
    steps.innerHTML=''; prog.style.width='0%';
    const txt = inputPlain.value ?? '';
    const s = Number(inputShift.value);
    if(!txt.trim()) return alert('Masukkan teks.');
    if(!Number.isFinite(s)) return alert('Shift tidak valid.');

    U.addStep(steps, `Terapkan pergeseran sebanyak ${s} pada tiap huruf.`); prog.style.width='20%';
    let res='';
    for(let i=0;i<txt.length;i++){
      const before = txt[i], after = U.caesarShift(before, s);
      U.addStep(steps, `${i+1}. '${before}' → '${after}'`);
      res += after;
      prog.style.width = (20 + Math.round((i+1)/Math.max(txt.length,1)*75)) + '%';
      await new Promise(r=>setTimeout(r,25));
    }
    prog.style.width='100%';
    out.value = res;
    window.toast && toast('Enkripsi selesai');
  };

  document.getElementById('copy').onclick = async ()=>{
    const t=out.value; if(!t) return;
    try{ await navigator.clipboard.writeText(t); window.toast && toast('Disalin'); }catch{ alert('Gagal menyalin.'); }
  };
});
