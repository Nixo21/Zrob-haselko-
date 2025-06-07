
const passwordInput = document.getElementById("passwordInput");
const rulesList = document.getElementById("rulesList");
const statusMessage = document.getElementById("statusMessage");

// Pomocnicze dane
const targetSum = 25;
const currentMoonPhase = "🌕"; // Placeholder, powinien być dynamiczny
const correctCountry = "Polska"; // Placeholder dla geo-zgadywanki
const chessMove = "Sf3"; // Placeholder
const romanTarget = "XIV";
const sqrtTarget = 121;
const sqrtAnswer = "11";
const youtuber = "Graf";

const rules = [
  { id: 1, description: "Hasło musi mieć co najmniej 8 znaków.", validate: p => p.length >= 8 },
  { id: 2, description: "Hasło musi zawierać wielką literę.", validate: p => /[A-ZĄĆĘŁŃÓŚŹŻ]/.test(p) },
  { id: 3, description: "Hasło musi zawierać cyfrę.", validate: p => /\d/.test(p) },
  { id: 4, description: "Hasło musi zawierać znak specjalny (!@#$%^&*).", validate: p => /[!@#$%^&*]/.test(p) },
  { id: 5, description: "Hasło nie może zawierać spacji.", validate: p => !/\s/.test(p) },
  { id: 6, description: "Hasło musi zawierać emotkę aktualnej fazy księżyca (" + currentMoonPhase + ").", validate: p => p.includes(currentMoonPhase) },
  { id: 7, description: "Suma wszystkich cyfr w haśle musi wynosić " + targetSum + ".", validate: p => (p.match(/\d/g) || []).map(Number).reduce((a,b)=>a+b,0) === targetSum },
  { id: 8, description: "Podaj poprawny kraj na podstawie obrazka (np. " + correctCountry + ").", validate: p => p.toLowerCase().includes(correctCountry.toLowerCase()) },
  { id: 9, description: "Zapisz ruch szachowy (np. " + chessMove + ").", validate: p => p.includes(chessMove) },
  { id: 10, description: "Zawiera rzymską liczbę " + romanTarget + ".", validate: p => p.includes(romanTarget) },
  { id: 11, description: "Zawiera pierwiastek z " + sqrtTarget + " (czyli " + sqrtAnswer + ").", validate: p => p.includes(sqrtAnswer) },
  { id: 12, description: "Hasło musi zawierać nazwę polskiego YouTubera: " + youtuber + ".", validate: p => p.toLowerCase().includes(youtuber.toLowerCase()) },
  { id: 13, description: "Hasło musi zawierać znak procenta (%).", validate: p => p.includes("%") },
  { id: 14, description: "Hasło nie może mieć dwóch takich samych znaków obok siebie.", validate: p => !/(.)\1/.test(p) },
  { id: 15, description: "Hasło musi zaczynać się literą.", validate: p => /^[A-Za-zĄĆĘŁŃÓŚŹŻ]/.test(p) },
  { id: 16, description: "Hasło musi kończyć się cyfrą.", validate: p => /\d$/.test(p) },
  { id: 17, description: "Hasło musi zawierać nazwę koloru po polsku (np. czerwony).", validate: p => /(czerwony|zielony|niebieski|żółty|czarny|biały)/i.test(p) },
  { id: 18, description: "Hasło musi zawierać dzień tygodnia po polsku.", validate: p => /(poniedziałek|wtorek|środa|czwartek|piątek|sobota|niedziela)/i.test(p) },
  { id: 19, description: "Hasło musi zawierać liczbę pierwszą (np. 7, 11, 13).", validate: p => /(\b7\b|\b11\b|\b13\b)/.test(p) },
  { id: 20, description: "Hasło musi zawierać słowo z 5 liter.", validate: p => /\b\w{5}\b/.test(p) },
  { id: 21, description: "Hasło musi zawierać nazwę zwierzęcia (np. pies, kot).", validate: p => /(pies|kot|koń|ptak)/i.test(p) },
  { id: 22, description: "Hasło musi zawierać nazwę jedzenia (np. pizza, chleb).", validate: p => /(pizza|chleb|ser|makaron)/i.test(p) },
  { id: 23, description: "Hasło musi zawierać liczbę rzymską do 20.", validate: p => /(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX)/.test(p) },
  { id: 24, description: "Hasło nie może zawierać żadnych samogłosek.", validate: p => !/[aeiouyąę]/i.test(p) }, // hard
  { id: 25, description: "Hasło musi zawierać dokładnie 3 cyfry.", validate: p => (p.match(/\d/g)||[]).length === 3 }
];

function updateRules() {
  const password = passwordInput.value;
  rulesList.innerHTML = "";
  let allValid = true;

  rules.forEach(rule => {
    const isValid = rule.validate(password);
    const li = document.createElement("li");
    li.textContent = rule.description;
    li.className = isValid ? "valid" : "invalid";
    rulesList.appendChild(li);
    if (!isValid) allValid = false;
  });

  statusMessage.textContent = allValid ? "Hasło spełnia wszystkie zasady!" : "";
}

passwordInput.addEventListener("input", updateRules);
