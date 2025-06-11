const input   = document.getElementById('passwordInput');
const rulesUI = document.getElementById('rulesList');
const status  = document.getElementById('statusMessage');
const flagDiv = document.getElementById('flagContainer');

// Moon phase calculation
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
const weekday = ['niedziela','poniedziałek','wtorek','środa','czwartek','piątek','sobota'][today.getDay()];
const wordleList = ['kotek','mleko','domki','psion','rzeka'];
const wordleWord = wordleList[today.getDate() % wordleList.length];
const geoCountry = 'Polska';
const chessBest  = 'e4';
const targetSum  = 25;
const romanNum   = 'XIV';
const sqrtNum    = 144;
const sqrtAns    = String(Math.sqrt(sqrtNum));
const youtubers  = ['GPlay','Graf','Rezi'];

const flagURL = "https://flagcdn.com/w320/pl.png";
const geoAnswer = "Polska";
flagDiv.innerHTML = `<img src="${flagURL}" width="100" alt="Flaga kraju" /><br><small>Jakiego to kraju flaga?</small>`;

const rules = [
  { desc: 'Hasło min. 8 znaków',                        test: p => p.length >= 8 },
  { desc: 'Min. jedna wielka litera',                   test: p => /[A-ZĄĆĘŁŃÓŚŹŻ]/.test(p) },
  { desc: 'Min. jedna cyfra',                           test: p => /\\d/.test(p) },
  { desc: 'Min. znak specjalny (!@#$%^&*)',             test: p => /[!@#$%^&*]/.test(p) },
  { desc: 'Brak spacji',                                test: p => !/\\s/.test(p) },
  { desc: `Zawiera emotkę fazy księżyca ${moonEmoji}`,  test: p => p.includes(moonEmoji) },
  { desc: `Suma cyfr = ${targetSum}`,                   test: p => (p.match(/\\d/g)||[]).map(Number).reduce((a,b)=>a+b,0) === targetSum },
  { desc: `Geo: wpisz kraj z flagi`,                    test: p => p.toLowerCase().includes(geoAnswer.toLowerCase()) },
  { desc: `Szachy: ruch "${chessBest}"`,                test: p => p.includes(chessBest) },
  { desc: `Zawiera liczbę rzymską "${romanNum}"`,       test: p => p.includes(romanNum) },
  { desc: `Pierwiastek z ${sqrtNum} = ${sqrtAns}`,      test: p => p.includes(sqrtAns) },
  { desc: `YouTuber: ${youtubers.join(', ')}`,          test: p => youtubers.some(n=>p.includes(n)) },
  { desc: 'Zawiera %',                                  test: p => p.includes('%') },
  { desc: 'Brak dwóch identycznych znaków obok siebie', test: p => !(/(.)\\1/.test(p)) },
  { desc: 'Zaczyna się literą',                         test: p => /^[A-Za-zĄĆĘŁŃÓŚŹŻ]/.test(p) },
  { desc: 'Kończy się cyfrą',                           test: p => /\\d$/.test(p) }
];

input.addEventListener("input", () => {
  const pass = input.value;
  const firstInvalid = rules.find(rule => !rule.test(pass));
  rulesUI.innerHTML = '';
  if (firstInvalid) {
    const li = document.createElement('li');
    li.className = 'invalid';
    li.textContent = firstInvalid.desc;
    rulesUI.appendChild(li);
    status.textContent = '❌ Hasło jeszcze nie spełnia wszystkich wymagań';
  } else {
    status.textContent = '✅ Hasło spełnia wszystkie wymagania!';
  }
});