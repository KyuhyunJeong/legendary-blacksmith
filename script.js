// roundNice
function roundNice(v) {
  if (v < 1000)   return Math.round(v / 10)    * 10;
  if (v < 10000)  return Math.round(v / 100)   * 100;
  if (v < 100000) return Math.round(v / 1000)  * 1000;
  return           Math.round(v / 10000) * 10000;
}

const SUCCESS_RATES = [
  98,97,96,95,94,93,92,91,90,89,
  90,89,88,87,86,85,84,83,82,81,
  88,85,82,79,76,73,70,67,64,61,
  72,70,68,66,64,62,60,58,56,54,
  65,62,59,56,53,50,47,44,41,38,
];

const FRAGMENT_REQUIREMENTS = {
  11:{worn:1},12:{worn:1},13:{worn:1},14:{worn:2},15:{worn:2},16:{worn:2},17:{worn:3},18:{worn:3},19:{worn:4},20:{worn:5},
  21:{steel:1},22:{steel:1},23:{steel:2},24:{steel:2},25:{steel:3},26:{steel:3},27:{steel:4},28:{steel:4},29:{steel:5},30:{steel:6},
  31:{rune:2},32:{rune:2},33:{rune:3},34:{rune:3},35:{rune:4},36:{rune:5},37:{rune:6},38:{rune:7},39:{rune:8},40:{rune:10},
  41:{ancient:4},42:{ancient:5},43:{ancient:6},44:{ancient:7},45:{ancient:9},46:{ancient:12},47:{ancient:12},48:{ancient:16},49:{ancient:22},50:{ancient:35},
};

const SWORD_SACRIFICE = {20:[10],30:[20],40:[30],47:[10],48:[20],49:[30],50:[10,20,30,40]};

const FRAGMENT_LABELS = {
  worn:'사원의 불씨 파편',steel:'제국의 주괴 파편',rune:'민담의 주술 파편',ancient:'영웅의 맹세 파편',legend:'신화의 잔광 파편'
};

function enhanceCost(level) { return roundNice(100 * Math.pow(1.18, level - 1)); }

function cumulativeEnhanceCost(level) {
  let total = 0;
  for (let i = 1; i <= level; i++) total += roundNice(100 * Math.pow(1.18, i - 1));
  return total;
}
function getSellMultiplier(level) { return Math.min(1.15 + level * 0.035, 2.6); }
function sellPrice(level) {
  if (level === 0) return 0;
  return roundNice(cumulativeEnhanceCost(level) * getSellMultiplier(level));
}

function fragReqStr(level) {
  const req = FRAGMENT_REQUIREMENTS[level] ?? {};
  const parts = Object.entries(req).map(([k,v]) => `${FRAGMENT_LABELS[k]} ×${v}`);
  const sac = SWORD_SACRIFICE[level];
  if (sac) parts.push(`보관된 무기 (${sac.map(l=>'+'+l).join(', ')})`);
  return parts.join(' + ') || '—';
}

const WEAPON_NAMES = ['미사용','날카로운 돌조각','뼈 단검','나무 창','돌망치','사냥꾼 활','흑요석 단검','부족 전투 도끼','가죽 방패 창','청동 단검','청동 전사의 검','철제 단검','군단병 단검','장창병의 창','기병 전투 도끼','장궁','철퇴','기사의 랜스','공성 석궁','처형인의 대검','왕실 기사검','도깨비 방망이','귀등 검','구미호 송곳니 단검','오니 토벌 도끼','늑대인간 발톱 검','흡혈귀 송곳니 검','목 없는 기사 도끼','반시의 낫','크라켄 작살','고룡 뼈 검','로빈 후드의 장궁','잔다르크의 성창','무사시의 쌍검','레오니다스의 창','아서왕의 검','징기스칸의 곡도','윌리엄 월리스 대검','관우의 언월도','알렉산더의 창','충무공의 검','궁니르의 천둥창','포세이돈의 삼지창','라의 태양검','아르테미스의 월궁','하데스의 저승낫','미카엘의 심판검','묠니르의 파쇄망치','세계수의 가지검','우주룡의 송곳니','태초의 불꽃'];

console.log('LEVEL|WEAPON|SUCCESS%|ENHANCE_COST|SELL_PRICE|MATERIALS');
for (let lv = 1; lv <= 50; lv++) {
  const name = WEAPON_NAMES[lv] || '?';
  const rate = SUCCESS_RATES[lv-1];
  const cost = enhanceCost(lv);
  const sell = sellPrice(lv);
  const mats = fragReqStr(lv);
  console.log(`${lv}|${name}|${rate}|${cost}|${sell}|${mats}`);
}

// Protection ticket prices (first 10 purchases)
console.log('\n--- 방지권 가격 (누적 구매 횟수별) ---');
for (let i = 0; i < 15; i++) {
  const price = roundNice(800 * Math.pow(1.07, i));
  console.log(`구매 ${i+1}번째: ${price.toLocaleString()} G`);
}

// Storage upgrade cost
console.log('\n--- 보관함 확장 비용 ---');
for (let i = 0; i < 8; i++) {
  const price = roundNice(50000 * Math.pow(1.8, i));
  console.log(`${i+1}번째 확장 (+10칸): ${price.toLocaleString()} G`);
}
