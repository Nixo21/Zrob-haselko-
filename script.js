const input = document.getElementById('passwordInput');
const rulesUI = document.getElementById('rulesList');
const status = document.getElementById('statusMessage');

// Faza księżyca
function getMoonEmoji(){
  const t = new Date();
  const lp = 2551443, nm = new Date(1970,0,7,20,35);
  const phase = ((t - nm)/1000)%lp;
  return ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'][Math.floor(phase/(lp/8))];
}
const moon = getMoonEmoji();
const weekday = ['niedz.','pon.','wt.','śr.','czw.','pt.','sob.'][new Date().getDay()];
const wordleWords = ['kotek','mleko','domki','psion','rzeka'];
const wordle = wordleWords[new Date().getDate()%wordleWords.length];

let map = L.map('map').setView([52.2,19.2],5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let chosenCountry = null;
fetch('https://restcountries.com/v3.1/all').then(r=>r.json()).then(data=>{
  data.forEach(c=>{
    L.geoJSON(c.latlng&&{type:'Point',coordinates:c.latlng.reverse()},{
      pointToLayer:(f,latlng)=>L.marker(latlng).on('click',()=>chosenCountry=c.name.common)
    }).addTo(map);
  });
});

let board = Chessboard('board', {position:'start'});
const chess = new Chess();
const engine = new Worker('stockfish.js');
let bestMove = null;
engine.onmessage = e=>{
  if(e.data.startsWith('bestmove')){
    bestMove = e.data.split(' ')[1];
  }
};
engine.postMessage('position fen '+chess.fen());
engine.postMessage('go depth 12');

const rules = [
  {desc:'1. min 8 znaków', test:p=>p.length>=8},
  {desc:'2. wielka litera', test:p=>/[A-ZĄĆĘŁŃÓŚŹŻ]/.test(p)},
  {desc:'3. cyfra', test:p=>/\d/.test(p)},
  {desc:`4. faza księżyca ${moon}`, test:p=>p.includes(moon)},
  {desc:`5. dzień tygodnia ${weekday}`, test:p=>p.includes(weekday)},
  {desc:'6. Wordle słowo', test:p=>p.includes(wordle)},
  {desc:'7. Geo: kliknij kraj', test:p=>chosenCountry && p.toLowerCase().includes(chosenCountry.toLowerCase())},
  {desc:`8. Szachy: ruch ${bestMove}`, test:p=>bestMove&&p.includes(bestMove)}
];

function update(){
  const p = input.value;
  let idx=-1;
  rules.forEach((r,i)=>{ if(!r.test(p)&&idx<0) idx=i });
  rulesUI.innerHTML='';
  rules.forEach((r,i)=>{
    let li = document.createElement('li');
    li.textContent = r.desc;
    li.className = i<idx? 'valid': i===idx? 'invalid':'';
    rulesUI.appendChild(li);
  });
  status.textContent = idx<0?'✅ OK':'❌';
}
input.oninput=update;