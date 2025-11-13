function requireUtils(){ if(!window||!window.Utils){ alert('Utils belum siap.'); throw new Error('Utils missing'); } return window.Utils; }
document.addEventListener('DOMContentLoaded',()=>{
  const U = requireUtils();
  const steps = document.getElementById('steps');
  let priv=null;

  function add(s){ U.addStep(steps,s); }
  function prog(p){ const el=document.getElementById('prog'); if(el) el.style.width=p; }

  document.getElementById('privFile').addEventListener('change', async (e)=>{
    const file = e.target.files[0]; if(!file) return;
    try{
      const data = JSON.parse(await file.text());
      if(!('d' in data) || !('n' in data)) throw new Error();
      priv = { d:Number(data.d), n:Number(data.n) };
      if(!(priv.n>0)) throw new Error('n invalid');
      document.getElementById('privInfo').textContent = `Private key terpasang: d=${priv.d}, n=${priv.n}`;
    }catch{
      priv=null; alert('private_key.json tidak valid (wajib berisi d dan n).');
    }
  });

  document.getElementById('decrypt').addEventListener('click', ()=>{
    steps.innerHTML=''; prog('0%');
    if(!priv){ alert('Impor private_key.json dulu.'); return; }
    const raw = document.getElementById('cipher').value.trim();
    if(!raw){ alert('Masukkan ciphertext.'); return; }

    add('Pisahkan ciphertext berdasarkan spasi menjadi list angka.'); prog('25%');
    const tokens = raw.split(/\s+/).filter(Boolean); prog('40%');
    add('Gunakan rumus M = c^d mod n untuk tiap blok.'); prog('50%');

    const plains = [];
    tokens.forEach((tok,i)=>{
      if(!/^-?\d+$/.test(tok)){ add(`Lewati token tidak valid: "${tok}"`); return; }
      const c = tok; // string angka, BigInt bisa dari string
      const m = Utils.modPow(c, priv.d, priv.n); // BigInt
      add(`M${i+1} = ${c}^${priv.d} mod ${priv.n} = ${m.toString()}`);
      plains.push(Number(m)); // aman karena m < n dan n kecil
      prog((50 + Math.round((i+1)/Math.max(tokens.length,1)*35))+'%');
    });

    const text = Utils.numbersToText(plains);
    add(`Konversi angka ke huruf (0=A,...,25=Z) ⇒ "${text}"`); prog('100%');
    document.getElementById('plain').value = text;
    window.toast && toast('Dekripsi selesai');
  });

  document.getElementById('copyPlain').addEventListener('click', async ()=>{
    const t=document.getElementById('plain').value; if(!t) return alert('Belum ada plainteks.');
    try{ await navigator.clipboard.writeText(t); window.toast && toast('Plainteks disalin'); }catch{ alert('Gagal menyalin.'); }
  });
});
