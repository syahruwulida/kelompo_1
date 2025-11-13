// utils.js — global helpers (pure JS, no <script> tag)
window.Utils = (()=>{
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function isPrime(n){
    n = Number(n);
    if(n<=1 || !Number.isInteger(n)) return false;
    if(n<=3) return true;
    if(n%2===0 || n%3===0) return false;
    for(let i=5; i*i<=n; i+=6){
      if(n%i===0 || n%(i+2)===0) return false;
    }
    return true;
  }

  function gcd(a,b){ a=Math.abs(Number(a)); b=Math.abs(Number(b)); while(b!==0){ const t=a%b; a=b; b=t; } return a; }

  function modPow(base,exp,mod){
    try{
      let b = BigInt(base), e = BigInt(exp), m = BigInt(mod), r = 1n;
      if (m===0n) return 0n;
      b %= m;
      while(e>0n){ if(e & 1n) r = (r*b) % m; e >>= 1n; b = (b*b) % m; }
      return r;
    }catch(err){
      console.error("modPow error:", {base,exp,mod}, err);
      throw err;
    }
  }

  function egcd(a,b){
    a = Number(a); b = Number(b);
    if(b===0) return [1,0,a];
    const [x1,y1,g] = egcd(b, a%b);
    return [y1, x1 - Math.floor(a/b)*y1, g];
  }

  function modInverse(e,phi){
    const [x, , g] = egcd(e,phi);
    if(g!==1) return null;
    let inv = x % phi;
    if(inv<0) inv += phi;
    return inv;
  }

  function onlyAZ(s){ return s.toUpperCase().replace(/[^A-Z]/g,''); }
  function textToNumbers(text){ return onlyAZ(text).split('').map(ch=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(ch)); }
  function numbersToText(nums){ return nums.map(x=> "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[x] ?? '?').join(''); }

  function caesarShift(text,shift){
    const s=((shift%26)+26)%26;
    return text.split('').map(ch=>{
      if(/[A-Z]/.test(ch)) return String.fromCharCode((ch.charCodeAt(0)-65+s)%26+65);
      if(/[a-z]/.test(ch)) return String.fromCharCode((ch.charCodeAt(0)-97+s)%26+97);
      return ch;
    }).join('');
  }

  function download(filename, dataObj){
    const blob = new Blob([JSON.stringify(dataObj,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url), 1000);
  }

  async function readJSON(file){ const text = await file.text(); return JSON.parse(text); }

  function addStep(container, text){
    const wrap = document.createElement('div'); wrap.className='step';
    const num = document.createElement('div'); num.className='num'; num.textContent = (container.childElementCount+1);
    const desc = document.createElement('div'); desc.className='desc'; desc.textContent = text;
    wrap.appendChild(num); wrap.appendChild(desc); container.appendChild(wrap);
    if (container.parentElement) container.parentElement.scrollTop = container.parentElement.scrollHeight;
  }

  return { isPrime, gcd, modPow, egcd, modInverse, onlyAZ, textToNumbers, numbersToText, caesarShift, download, readJSON, addStep };
})();
