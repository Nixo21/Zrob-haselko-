const input   = document.getElementById('passwordInput');
const rulesUI = document.getElementById('rulesList');
const status  = document.getElementById('statusMessage');
const flagDiv = document.getElementById('flagContainer');

function getMoonEmoji() {
  const today = new Date();
  const lp = 2551443;
  const new_moon = new Date(1970, 0, 7, 20, 35, 0);
  const phase = ((today.getTime() - new_moon.getTime()) / 1000) % lp;
  const index = Math.floor((phase / (lp / 8))) % 8;
  return ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'][index];
}

const moonEmoji = getMoonEmoji();
const today = new Date();
const wordleList = ['kotek','mleko','domki','psion','rzeka'];
const wordleWord = wordleList[today.getDate() % wordleList.length];
const geoAnswer = "Polska";
const chessBest = 'e4';
const targetSum = 25;
const romanNum = 'XIV';
const sqrtNum = 144;
const sqrtAns = String(Math.sqrt(sqrtNum));
const youtubers = ['GPlay','Graf','Rezi'];

const flagURL = "https://flagcdn.com/w320/pl.png";
flagDiv.innerHTML = `<img src="${flagURL}" width="100" alt="Flaga kraju" /><br><small>Jakiego to kraju flaga?</small>`;

const rules = [
  { desc: '1. Hasło min. 8 znaków',                        test: p => p.length >= 8 },
  { desc: '2. Min. jedna wielka litera',                   test: p => /[A-ZĄĆĘŁŃÓŚŹŻ]/.test(p) },
  { desc: '3. Min. jedna cyfra',                           test: p => /\d/.test(p) },
  { desc: '4. Min. znak specjalny (!@#$%^&*)',             test: p => /[!@#$%^&*]/.test(p) },
  { desc: '5. Brak spacji',                                test: p => !/\s/.test(p) },
  { desc: `6. Zawiera emotkę fazy księżyca ${moonEmoji}`, test: p => p.includes(moonEmoji) },
  { desc: `7. Suma cyfr = ${targetSum}`,                  test: p => (p.match(/\d/g)||[]).map(Number).reduce((a,b)=>a+b,0) === targetSum },
  { desc: `8. Geo: wpisz kraj z flagi`,                    test: p => p.toLowerCase().includes(geoAnswer.toLowerCase()) },
  { desc: `9. Szachy: ruch "${chessBest}"`,               test: p => p.includes(chessBest) },
  { desc: `10. Liczba rzymska "${romanNum}"`,             test: p => p.includes(romanNum) },
  { desc: `11. Pierwiastek z ${sqrtNum} = ${sqrtAns}`,   test: p => p.includes(sqrtAns) },
  { desc: `12. YouTuber: ${youtubers.join(', ')}`,        test: p => youtubers.some(n=>p.includes(n)) },
  { desc: `13. Hasło zawiera słowo Wordle "${wordleWord}"`, test: p => p.toLowerCase().includes(wordleWord) },
];

let ruleStates = new Array(rules.length).fill(false);

function updateRules() {
  const pass = input.value;
  let firstInvalidIndex = -1;

  ruleStates = rules.map((r, i) => {
    const isValid = r.test(pass);
    if (!isValid && firstInvalidIndex === -1) firstInvalidIndex = i;
    return isValid;
  });

  rulesUI.innerHTML = '';
  rules.forEach((r, i) => {
    const li = document.createElement('li');
    li.textContent = r.desc;
    li.className = ruleStates[i] ? 'valid' : (i === firstInvalidIndex ? 'invalid' : '');
    rulesUI.appendChild(li);
  });

  status.textContent = ruleStates.every(Boolean)
    ? '✅ Hasło spełnia wszystkie wymagania!'
    : '❌ Hasło jeszcze nie spełnia wszystkich wymagań';
}

input.addEventListener("input", updateRules);
updateRules();