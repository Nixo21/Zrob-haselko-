const input = document.getElementById('passwordInput');
const rulesUI = document.getElementById('rulesList');
const status = document.getElementById('statusMessage');

function getMoonEmoji(){
  const t=new Date(),lp=2551443,nm=new Date(1970,0,7,20,35);
  let phase=((t-nm)/1000)%lp;
  return ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'][Math.floor(phase/(lp/8))];
}
const moon = getMoonEmoji();
const weekday = ['niedziela','poniedziałek','wtorek','środa','czwartek','piątek','sobota'][new Date().getDay()];
const wordleList=['kotek','mleko','domki','psion','rzeka'];
const wordle = wordleList[new Date().getDate()%wordleList.length];
let geoAnswer = '';
let bestMove = '';

// Inicjalizacja mapy GeoGuessr
let map = L.map('map').setView([52.2,19.2],5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
fetch('https://restcountries.com/v3.1/all').then(r=>r.json()).then(data=>{
  const choice = data[Math.floor(Math.random()*data.length)];
  geoAnswer = choice.name.common.toLowerCase();
  L.geoJSON({type:'Point',coordinates:choice.latlng.reverse()}, {
    pointToLayer:(f,latlng)=>L.marker(latlng).addTo(map)
  });
});

// Inicjalizacja szachów i Stockfish
const board = Chessboard('board',{position:'start'});
const chess = new Chess();
const engine = new Worker('stockfish.js');
engine.onmessage = e=>{
  if(e.data.startsWith('bestmove ')) bestMove = e.data.split(' ')[1];
};
engine.postMessage('position fen '+chess.fen());
engine.postMessage('go depth 10');

const rules = [
  {desc:'1. Hasło min. 8 znaków', test:p=>p.length>=8},
  {desc:'2. Min. jedna wielka litera', test:p=>/[A-ZĄĆĘŁŃÓŚŹŻ]/.test(p)},
  {desc:'3. Min. jedna cyfra', test:p=>/\d/.test(p)},
  {desc:`4. Faza księżyca (${moon})`, test:p=>p.includes(moon)},
  {desc:`5. Dzień tygodnia (${weekday})`, test:p=>p.includes(weekday)},
  {desc:`6. Wordle słowo (${wordle})`, test:p=>p.toLowerCase().includes(wordle)},
  {desc:'7. GeoGuessr: wpisz nazwę kraju', test:p=>geoAnswer && p.toLowerCase().includes(geoAnswer)},
  {desc:`8. Szachy: ruch ${bestMove}`, test:p=>bestMove && p.includes(bestMove)}
];

function update(){
  const p=input.value;
  // znajdź pierwszą niespełnioną
  let idx=rules.findIndex(r=>!r.test(p));
  if(idx<0) idx=rules.length;
  // przenieś wszystkie wcześniejsze spełnione do dołu
  const done = rules.slice(0,idx), next = rules.slice(idx);
  const order = next.concat(done);
  rulesUI.innerHTML='';
  order.forEach((r,i)=>{
    const li=document.createElement('li');
    li.textContent = r.desc;
    if(i===0 && !r.test(p)) li.className='invalid';
    else if(!r.test(p)) li.className='';
    else li.className='valid';
    rulesUI.appendChild(li);
  });
  status.textContent = (idx>=rules.length ? '✅ Hasło spełnia wszystkie wymagania!' : '❌ Krok '+(idx+1)+' niezaliczony');
}

input.addEventListener('input',update);