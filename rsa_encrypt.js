function requireUtils(){ if(!window||!window.Utils){ alert('Utils belum siap.'); throw new Error('Utils missing'); } return window.Utils; }
document.addEventListener('DOMContentLoaded',()=>{
  const U = requireUtils();
  const steps = document.getElementById('steps');
  let pub=null;

  function add(s){ U.addStep(steps,s); }
  function prog(p){ const el=document.getElementById('prog'); if(el) el.style.width=p; }

  document.getElementById('pubFile').addEventListener('change', async (e)=>{
    const file = e.target.files[0]; if(!file) return;
    try{
      const data = JSON.parse(await file.text());
      if(!('e' in data) || !('n' in data)) throw new Error();
      pub = { e:Number(data.e), n:Number(data.n) };
      if(!(pub.n>25)) throw new Error('n too small');
      document.getElementById('pubInfo').textContent = `Public key terpasang: e=${pub.e}, n=${pub.n}`;
    }catch{
      pub=null; alert('public_key.json tidak valid (wajib berisi e dan n, dan n>25).');
    }
  });

  document.getElementById('encrypt').addEventListener('click', ()=>{
    steps.innerHTML=''; prog('0%');
    if(!pub){ alert('Impor public_key.json dulu.'); return; }
    const raw = document.getElementById('plain').value;
    const plain = U.onlyAZ(raw);
    if(!plain){ alert('Masukkan plainteks (A-Z).'); return; }

    add('Konversi karakter ke angka (A=0,...,Z=25).'); prog('20%');
    const nums = U.textToNumbers(plain);
    add(`Hasil konversi: [${nums.join(', ')}]`); prog('35%');
    add('Gunakan rumus C = m^e mod n untuk tiap angka.'); prog('45%');

    const cipher = [];
    nums.forEach((m,i)=>{
      const c = Utils.modPow(m, pub.e, pub.n);  // BigInt result
      add(`C${i+1} = ${m}^${pub.e} mod ${pub.n} = ${c.toString()}`);
      cipher.push(c.toString());
      prog((45 + Math.round((i+1)/Math.max(nums.length,1)*45))+'%');
    });

    const out = cipher.join(' ');
    document.getElementById('cipher').value = out;
    add(`Gabungkan ciphertext sebagai angka dipisah spasi: "${out}".`); prog('100%');
    window.toast && toast('Enkripsi selesai');
  });

  document.getElementById('copyCipher').addEventListener('click', async ()=>{
    const t=document.getElementById('cipher').value; if(!t) return alert('Belum ada ciphertext.');
    try{ await navigator.clipboard.writeText(t); window.toast && toast('Ciphertext disalin'); }catch{ alert('Gagal menyalin.'); }
  });
});
