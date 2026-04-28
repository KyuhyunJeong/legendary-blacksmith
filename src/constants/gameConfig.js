// ─── Weapon name & description table (index = enhancement level) ────────────
export const WEAPON_NAMES = [
  '미사용 / Unused',                            //  0 (legacy only)
  '날카로운 돌조각 / Sharp Stone Shard',       //  1
  '뼈 단검 / Bone Dagger',                     //  2
  '나무 창 / Wooden Spear',                    //  3
  '돌망치 / Stone Hammer',                     //  4
  '사냥꾼 활 / Hunter Bow',                    //  5
  '흑요석 단검 / Obsidian Dagger',             //  6
  '부족 전투 도끼 / Tribal Battle Axe',       //  7
  '가죽 방패 창 / Hide Shield Spear',          //  8
  '청동 단검 / Bronze Dagger',                 //  9
  '청동 전사의 검 / Bronze Warrior Sword',     // 10
  '철제 단검 / Iron Dagger',                   // 11
  '군단병 단검 / Legionnaire Gladius',         // 12
  '장창병의 창 / Pikeman Spear',               // 13
  '기병 전투 도끼 / Cavalry Battle Axe',       // 14
  '장궁 / Longbow',                            // 15
  '철퇴 / Iron Mace',                          // 16
  '기사의 랜스 / Knight Lance',                // 17
  '공성 석궁 / Siege Crossbow',                // 18
  '처형인의 대검 / Executioner Greatsword',    // 19
  '왕실 기사검 / Royal Knight Sword',          // 20
  '도깨비 방망이 / Goblin Club',               // 21
  '귀등 검 / Ghost Lantern Blade',             // 22
  '구미호 송곳니 단검 / Kumiho Fang Dagger',  // 23
  '오니 토벌 도끼 / Oni Crusher',              // 24
  '늑대인간 발톱 검 / Werewolf Claw Blade',   // 25
  '흡혈귀 송곳니 검 / Vampire Fang Rapier',   // 26
  '목 없는 기사 도끼 / Dullahan Axe',         // 27
  '반시의 낫 / Banshee Sickle',               // 28
  '크라켄 작살 / Kraken Harpoon',             // 29
  '고룡 뼈 검 / Dragon Bone Blade',           // 30
  '로빈 후드의 장궁 / Robin Hood Longbow',    // 31
  '잔다르크의 성창 / Joan\'s Holy Spear',     // 32
  '무사시의 쌍검 / Musashi Twin Blades',       // 33
  '레오니다스의 창 / Leonidas Spear',         // 34
  '아서왕의 검 / King Arthur\'s Blade',       // 35
  '징기스칸의 곡도 / Khan\'s Saber',          // 36
  '윌리엄 월리스 대검 / Wallace Greatsword',  // 37
  '관우의 언월도 / Guan Yu\'s Crescent Blade', // 38
  '알렉산더의 창 / Alexander\'s Spear',       // 39
  '충무공의 검 / Admiral Yi\'s Blade',        // 40
  '궁니르의 천둥창 / Gungnir Thunder Spear',   // 41
  '포세이돈의 삼지창 / Poseidon\'s Trident',   // 42
  '라의 태양검 / Blade of Ra',                // 43
  '아르테미스의 월궁 / Artemis Moonbow',      // 44
  '하데스의 저승낫 / Hades\' Underworld Scythe', // 45
  '미카엘의 심판검 / Michael\'s Judgement Blade', // 46
  '묠니르의 파쇄망치 / Mjolnir Breaker Hammer', // 47
  '세계수의 가지검 / Yggdrasil Branchblade',  // 48
  '우주룡의 송곳니 / Cosmic Dragon Fang',      // 49
  '태초의 불꽃 / The Primordial Flame',       // 50
];

export const WEAPON_DESCRIPTIONS = [
  // ── 기초 (legacy) ────────────────────────────────────────────────────────
  '기록에서 제외된 시작 단계입니다. 이제 여정은 +1 무기부터 시작됩니다.',                                //  0
  // ── Tier 1 : 고대의 여명 (Pre-Iron Age, Lv 1–10) ───────────────────────
  '강가에서 주운 깨진 돌조각. 가장 원초적인 생존 도구이자, 최초의 무기.',                                 //  1
  '거대한 짐승의 뼈를 깎아 만든 칼날. 사냥꾼들은 이 무기로 생존을 배웠다.',                                //  2
  '끝을 불에 그을려 단단하게 만든 원시 창. 인류 최초의 집단 사냥을 가능하게 했다.',                         //  3
  '묵직한 암석을 나무 자루에 묶었다. 단순하지만 강력한 파괴력을 자랑한다.',                                  //  4
  '동물 힘줄과 유연한 나무로 만든 활. 멀리서 생명을 거두는 법을 가르쳤다.',                                 //  5
  '화산 유리로 만들어진 날카로운 칼날. 청동 이전 가장 예리했던 무기 중 하나.',                               //  6
  '부족 간 전쟁에서 사용된 거친 도끼. 자루에는 오래된 피의 흔적이 남아 있다.',                               //  7
  '짐승 가죽 방패와 함께 사용된 긴 창. 초기 전투 대형의 시작을 알렸다.',                                    //  8
  '불과 광물이 만나 탄생한 첫 금속 무기. 문명은 이 순간부터 더 잔혹해졌다.',                                //  9
  '왕과 전사들이 사용하던 초기 청동 검. 문명의 새벽을 지배한 무기.',                                         // 10
  // ── Tier 2 : 철의 제국 (Lv 11–20) ──────────────────────────────────────
  '청동을 밀어낸 검은 금속. 더 싸게, 더 강하게, 더 많이 만들어졌다.',                                          // 11
  '제국 병사들의 표준 무기. 규율과 대형 전투가 야만을 압도하던 시대의 상징.',                                    // 12
  '긴 사정거리로 기병을 막기 위해 만들어졌다. 밀집 대형 속에서 진가를 발휘한다.',                                // 13
  '말을 탄 전사들이 휘두르던 무거운 도끼. 돌격의 충격을 더욱 잔혹하게 만든다.',                                  // 14
  '숙련된 궁수만이 다룰 수 있는 무기. 먼 거리에서 전장의 흐름을 바꿨다.',                                         // 15
  '갑옷이 강해질수록 칼은 한계를 드러냈다. 뼈와 갑옷을 함께 부수는 무기.',                                        // 16
  '전속력 돌격을 위해 설계된 기병 창. 한 번의 돌격으로 전열을 무너뜨린다.',                                       // 17
  '강력한 장력으로 철갑을 꿰뚫는다. 성벽 위에서도 두려움의 대상이었다.',                                           // 18
  '거대한 양손 검. 전장에서든 처형대에서든 압도적인 존재감을 보였다.',                                            // 19
  '명예와 충성을 상징하는 검. 철의 시대를 넘어 기사도의 정점에 선 무기.',                                          // 20
  // ── Zone 3 : 룬 파편 (요괴/몬스터 Lv 21–30) ─────────────────────────────
  '도깨비 방망이엔 소원을 이루는 힘이 있다고 전해진다. 그러나 이 방망이를 손에 쥔 자는 소원이 아닌 파괴 충동을 느끼게 된다.', // 21
  '혼이 깃든 도깨비불이 날에 새겨져 있다. 어둠 속에서도 스스로 빛을 발하며, 주인의 감정에 따라 빛의 색이 변한다.',             // 22
  '구미호는 천 년을 살아야 사람이 된다. 이 단검에는 그 천 년의 간교함과 아름다움이 담겨 있다. 보는 이를 매혹시키는 아홉 꼬리의 저주.', // 23
  '일본 전설의 오니는 사람을 집어삼키는 공포의 존재. 이 둔기는 그 오니를 처치한 전사에게서 비롯됐다. 귀신조차 두 동강 내는 무게감.', // 24
  '보름달 아래서 이 검은 푸른빛으로 빛난다. 은과 야수의 발톱을 합쳐 만든 무기. 인간과 짐승 사이의 경계를 찢어버리는 칼날.',         // 25
  '흘린 피를 빨아들이며 스스로 더 강해지는 검. 수백 년을 살아온 흡혈귀의 송곳니를 녹여 넣었다. 밤이 깊을수록 칼날이 빛난다.',      // 26
  '목 없는 기사가 자신의 목을 들고 전장을 달린다. 죽음이 공포를 먹고산다면, 이 도끼는 공포 그 자체다. 기사의 저주가 날에 새겨져 있다.', // 27
  '아일랜드 전설에서 반시의 울음소리는 죽음의 예언이다. 이 낫이 울음소리를 내는 밤, 전장의 승자는 이미 정해진다.',                     // 28
  '심해의 괴물 크라켄은 배를 통째로 집어삼킨다. 이 작살은 크라켄의 촉수를 단번에 꿰뚫은 전설의 뱃사람에게서 비롯됐다. 심해의 어둠이 깃들어 있다.', // 29
  '억만 년을 살아온 고룡의 뼈로 만든 검. 용의 마지막 불꽃이 뼈 안에서 아직도 타오르고 있다. 이 검에 베인 상처는 결코 아물지 않는다.', // 30
  // ── Tier 4 : 영웅의 시대 (역사적 영웅 Lv 31–40) ─────────────────────────
  '중세 잉글랜드 전승 속 의적의 활. 귀족의 세금을 빼앗아 가난한 자들에게 나눠줬다고 전해진다. 숲속에서 왕의 병사들을 농락한 전설이 남아 있다.', // 31
  '17세 농민 소녀였던 그녀는 Siege of Orleans에서 프랑스군의 사기를 되살리며 단 9일 만에 포위를 돌파했다. 무너지던 프랑스를 되살린 창.',          // 32
  '일본 검술 역사상 가장 유명한 검객. 기록상 60회 이상의 결투에서 패배하지 않았으며, 마지막 결투에서는 나무 검으로 상대를 쓰러뜨렸다.',               // 33
  'Battle of Thermopylae에서 단 300명의 스파르타 전사와 함께 수십만 페르시아군의 진격을 며칠간 막아냈다. 불가능한 저항의 상징.',                  // 34
  '혼란에 빠진 브리튼을 통합한 전설의 왕. 돌에 박힌 검을 뽑아 왕이 되었다는 이야기가 전해진다. 왕의 자격을 증명하는 검.',                                 // 35
  '부족으로 흩어진 몽골을 통일한 뒤 세계 역사상 가장 거대한 연속 육상 제국을 세웠다. 그의 기병은 하루 수백 km를 이동하며 제국을 확장했다.',          // 36
  'Battle of Stirling Bridge에서 지형을 이용해 훨씬 큰 잉글랜드 군대를 무너뜨렸다. 패배 후에도 자유의 상징으로 남았다.',                                // 37
  'Three Kingdoms period의 혼란 속에서 적장 안량을 단기 돌격으로 베어버린 일화로 유명하다. 이후 신격화되어 지금도 관제묘에서 숭배된다.',                // 38
  '20대에 그리스를 통일하고 페르시아 제국을 무너뜨린 뒤 인도까지 진군했다. 역사상 가장 빠른 정복 전쟁 중 하나.',                                        // 39
  'Battle of Myeongnyang에서 단 13척의 배로 최소 133척 이상의 일본 함대를 격파했다. 기록상 단 한 번도 패배하지 않은 인간의 마지막 전설.',               // 40
  // ── Tier 5 : 신화의 영역 (Realm of Myth, Lv 41–50) ───────────────────
  '북유럽 신화에서 오딘이 지녔다고 전해지는 창. 한 번 던져지면 결코 빗나가지 않는다고 한다. 대장장이는 이 창을 벼리며 처음으로 깨달았다. 신들의 무기는 강해서 두려운 것이 아니라, 세계의 규칙을 거스르지 않기 때문에 두려운 것임을.', // 41
  '바다와 지진, 폭풍을 다스리는 신의 삼지창. 한 번 내리치면 땅이 갈라지고, 바다가 길을 연다고 전해진다. 이것은 적을 찌르는 무기가 아니라 세계의 경계를 움직이는 권능에 가까웠다. 대장간의 불조차 이 푸른 금속 앞에서는 파도처럼 흔들렸다.', // 42
  '태양신 라의 빛에서 태어난 검. 어둠을 베는 것이 아니라, 어둠이 존재할 자리를 없애버린다. 밤의 괴물과 혼돈을 몰아내고 매일 새벽을 다시 세상에 되돌려주는 불꽃의 검. 대장장이는 이 검을 벼리며 처음으로 태양의 무게를 느꼈다.', // 43
  '달빛으로 휘어진 활. 사냥의 여신 아르테미스가 어둠 속에서도 표적을 놓치지 않았다는 전승에서 비롯되었다. 이 활의 화살은 살을 꿰뚫기보다 운명 속에 숨어 있는 가장 약한 틈을 찾아낸다. 태양검이 세상을 밝힌다면, 이 활은 침묵 속에서 진실을 겨눈다.', // 44
  '산 자와 죽은 자의 경계를 지키는 낫. 하데스의 권능은 파괴가 아니라 질서에 가까웠다. 한 번 이 낫에 이름이 새겨진 영혼은 다시는 인간의 길로 돌아오지 못한다고 전해진다. 대장장이는 이 무기를 만들며 깨달았다. 어떤 문은 열기 위해 존재하지 않는다는 것을.', // 45
  '하늘의 군세를 이끄는 대천사의 검. 단순한 빛이 아니라, 선과 악을 가르는 심판의 칼날이다. 이 검은 가장 단단한 갑옷보다 흔들리는 마음을 먼저 꿰뚫는다. 불꽃은 희게 타올랐고, 대장간의 그림자는 모두 뒤로 물러났다.', // 46
  '천둥의 신 토르가 휘둘렀다고 전해지는 망치. 산을 무너뜨리고 거인을 쓰러뜨리는 힘의 상징이다. 하지만 진정한 힘은 파괴가 아니라 다시 손으로 돌아오는 불굴의 귀환에 있었다. 대장장이는 이 망치를 벼리며 무너지는 세계 속에서도 돌아올 수 있는 힘을 배웠다.', // 47
  '아홉 세계를 지탱한다는 세계수의 가지로 만들어진 검. 나무이면서 금속이고, 살아 있으면서도 이미 영원에 닿아 있다. 칼날에는 생명과 죽음, 시작과 끝의 결이 함께 흐른다. 이 무기는 적을 베기 위해 존재하지 않는다. 끊어진 세계를 다시 이어 붙이기 위해 존재한다.', // 48
  '별을 삼키는 고대 용의 송곳니. 동양에서는 하늘과 비를 다스리는 용이 있었고, 북유럽에는 세계수의 뿌리를 갉아먹는 용이 있었다. 이 송곳니는 그 모든 용의 전승이 한곳에 응축된 잔재다. 대장장이는 이빨 하나를 벼리며 세계를 지키는 힘과 세계를 갉아먹는 힘이 본래 같은 뿌리에서 나왔음을 보았다.', // 49
  '이것은 검도, 창도, 망치도 아니다. 대장장이가 처음 동굴에서 보았던 작은 불씨가 모든 시대와 모든 신화를 지나 다시 돌아온 모습이다. 성경에는 불이 붙었으나 타서 사라지지 않는 떨기나무가 등장한다. 그 불꽃은 태우지만 소멸시키지 않고, 빛나지만 스스로를 잃지 않는다. 태초의 불꽃은 어떤 힘으로도 부술 수 없다. 신들의 무기조차 녹이고, 용의 송곳니조차 재로 만들며, 세계수의 뿌리마저 말라붙는 순간에도 이 불꽃만은 꺼지지 않는다. 대장장이는 마지막에 깨닫는다. 자신이 평생 만든 것은 무기가 아니었다. 불꽃을 담을 그릇이었다. 그가 죽더라도 불꽃은 사라지지 않는다. 왕국이 무너지고, 신화가 잊히고, 별들이 식어도 어딘가의 어둠 속에서 작은 빛으로 남아 다음 대장장이를 기다릴 것이다. 모든 전설의 시작. 모든 창조의 끝. 그리고 다시 시작될 첫 번째 불씨.', // 50
];

// ─── English weapon lore (index = enhancement level) ────────────────────────
export const WEAPON_DESCRIPTIONS_EN = [
  // 0 – Legacy
  'A starting stage excluded from the records. The journey begins from +1.',
  // Tier 1 – Ancient Dawn (Lv 1–10)
  'A cracked stone fragment from the riverside. The most primal survival tool — humanity\'s first weapon.',
  'A blade carved from a great beast\'s bone. Hunters learned survival with this in hand.',
  'A primitive spear with a fire-hardened tip. Enabled humanity\'s first coordinated hunts.',
  'A heavy stone lashed to a wooden shaft. Simple, yet devastating.',
  'A bow of sinew and flexible wood. Taught humanity to take life from a distance.',
  'A razor-sharp blade of volcanic glass. Among the sharpest weapons before the bronze age.',
  'A rough axe from inter-tribal warfare. Old bloodstains still mark the shaft.',
  'A long spear paired with a hide shield. Marked the dawn of organized combat formations.',
  'The first metal weapon born of fire and ore. From this moment, civilization grew more ruthless.',
  'An early bronze sword wielded by kings and warriors. The weapon that ruled the dawn of civilization.',
  // Tier 2 – Iron Empire (Lv 11–20)
  'The dark metal that dethroned bronze. Made cheaper, stronger, and in far greater numbers.',
  'The standard weapon of the imperial legions. Discipline and formation overpowered brute strength.',
  'Built to repel cavalry from a distance. Its true power lay within tight battle formations.',
  'A heavy axe wielded by mounted warriors. Made cavalry charges all the more devastating.',
  'Only the trained archer could wield this. Capable of turning the tide of battle from afar.',
  'As armor grew stronger, swords met their limit. This weapon crushed bone and plate alike.',
  'Designed for full-speed cavalry charges. A single charge could shatter an entire battle line.',
  'Its bolts pierced iron plate from range. Even those behind castle walls lived in fear.',
  'A massive two-handed sword that commanded awe on the battlefield and the execution block alike.',
  'A sword that symbolized honor and loyalty. The pinnacle of the iron age — and of chivalry itself.',
  // Tier 3 – Rune Fragments: Folklore (Lv 21–30)
  'The dokkaebi\'s club is said to grant wishes. Yet those who wield it feel not desire — but the urge to destroy.',
  'A spirit flame is etched into the blade. It glows in darkness, shifting color with the wielder\'s emotions.',
  'A fox must live a thousand years to become human. This dagger holds that millennium of cunning and beauty — and the curse of nine tails.',
  'The oni of legend devours the living. This mace was born from the warrior who slew one. Heavy enough to split a ghost.',
  'Under the full moon this blade shines blue. Forged from silver and beast\'s claw — it tears the line between man and monster.',
  'A blade that grows stronger as it drinks blood. Crafted from a centuries-old vampire\'s fang. Sharpest at midnight.',
  'The headless knight rides carrying his own head. If death feeds on fear, this axe is fear itself. The knight\'s curse is inscribed on the edge.',
  'In Irish legend, a banshee\'s wail foretells death. On the night this sickle cries, the victor of battle is already decided.',
  'The kraken swallows ships whole. This harpoon was forged by the legendary sailor who speared straight through its tentacle.',
  'A sword forged from the bones of an ancient dragon. The dragon\'s last flame still burns within. Wounds from this blade never heal.',
  // Tier 4 – Age of Heroes (Lv 31–40)
  'The legendary outlaw of medieval England. Robbed the rich and gave to the poor, leaving Sherwood full of songs.',
  'A seventeen-year-old peasant girl who rallied France at Orléans and broke the siege in just nine days.',
  'Japan\'s most celebrated swordsman. Over 60 recorded duels, never defeated. His last fight was won with a wooden sword.',
  'At Thermopylae, 300 Spartans held back hundreds of thousands for days. The enduring symbol of impossible resistance.',
  'The legendary king who united a fractured Britain. Drew the sword from the stone and proved his right to rule.',
  'United the scattered Mongol tribes and built the largest contiguous land empire in history. His cavalry covered hundreds of miles a day.',
  'At Stirling Bridge, used terrain to destroy a far larger English army. Remained a symbol of freedom even in defeat.',
  'In the chaos of the Three Kingdoms, he charged alone and cut down the enemy general. Now worshipped as a god of war.',
  'Unified Greece in his twenties, toppled the Persian Empire, and marched to India. One of history\'s fastest conquests.',
  'At Myeongnyang, 13 ships defeated over 133 enemy warships. Never once defeated in battle — the last legend of a mortal man.',
  // Tier 5 – Realm of Myth (Lv 41–50)
  'Odin\'s spear that never misses. The blacksmith learned: a god\'s weapon is not fearsome for its strength — but for never breaking the rules of the world.',
  'Poseidon\'s trident — one strike splits the earth, and the sea opens a path. Not a weapon, but the power to move the boundaries of the world itself.',
  'Born from the light of Ra. It does not cut darkness — it removes the space where darkness can exist. Each dawn, this blade drives chaos back once more.',
  'The huntress\'s bow bent from moonlight. Its arrows seek not flesh, but the faintest weakness hidden in fate. Where the sunblade shines, this bow aims into silence.',
  'Hades\' scythe guards the line between the living and the dead. Not destruction — order. No soul whose name is carved here ever returns.',
  'The archangel\'s sword that divides good from evil. Not mere light — a judgment. It pierces a wavering heart before the hardest armor.',
  'Thor\'s hammer that always returns to his hand. Mountains crumble, giants fall. But its true power was the unbreakable return — even as the world collapsed.',
  'A sword forged from a branch of Yggdrasil, the world-tree. Wood and metal, alive yet eternal. Its edge holds the grain of life and death, beginning and end.',
  'The fang of an ancient dragon that devoured stars. All draconic legend — Eastern and Norse alike — condensed into a single relic.',
  'Not a sword, a spear, or a hammer. The small flame the blacksmith first found in a cave, returned through every age and every myth. It cannot be shattered. When the gods\' weapons melt and the world-tree withers, this flame endures — waiting in some distant dark for the next blacksmith to begin.',
];

// ─── Enhancement table (index 0 = +1→+2 attempt, index 49 = +50 sell only) ─
// successRate + repairableFailRate + destroyRate = 100
export const ENHANCEMENT_TABLE = [
  // lv, successRate(s), repairableFailRate(r), destroyRate(d), enhanceCost, firstRepairCost, sellPrice
  { lv:  1, s: 81.0, r: 19.0, d:  0.0, cost:      10, repair:      5, sell:             0 },
  { lv:  2, s: 79.8, r: 20.2, d:  0.0, cost:      15, repair:     10, sell:            25 },
  { lv:  3, s: 78.6, r: 21.2, d:  0.2, cost:      15, repair:     10, sell:            60 },
  { lv:  4, s: 77.3, r: 22.4, d:  0.3, cost:      25, repair:     15, sell:            90 },
  { lv:  5, s: 76.1, r: 23.4, d:  0.5, cost:      30, repair:     20, sell:           160 },
  { lv:  6, s: 74.9, r: 24.5, d:  0.6, cost:      40, repair:     25, sell:           250 },
  { lv:  7, s: 73.7, r: 25.6, d:  0.7, cost:      50, repair:     30, sell:           360 },
  { lv:  8, s: 72.4, r: 26.8, d:  0.8, cost:      60, repair:     35, sell:           530 },
  { lv:  9, s: 71.2, r: 27.8, d:  1.0, cost:      80, repair:     50, sell:           760 },
  { lv: 10, s: 70.0, r: 28.5, d:  1.5, cost:     100, repair:     60, sell:         1_050 },
  { lv: 11, s: 67.0, r: 29.8, d:  3.2, cost:     120, repair:     70, sell:         1_350 },
  { lv: 12, s: 64.0, r: 32.5, d:  3.5, cost:     140, repair:    110, sell:         1_500 },
  { lv: 13, s: 63.5, r: 32.9, d:  3.6, cost:     170, repair:    140, sell:         2_900 },
  { lv: 14, s: 63.0, r: 33.4, d:  3.6, cost:     200, repair:    160, sell:         4_300 },
  { lv: 15, s: 62.5, r: 33.8, d:  3.7, cost:     240, repair:    190, sell:         5_800 },
  { lv: 16, s: 62.0, r: 34.3, d:  3.8, cost:     290, repair:    230, sell:         7_700 },
  { lv: 17, s: 61.5, r: 34.7, d:  3.8, cost:     350, repair:    280, sell:        10_100 },
  { lv: 18, s: 61.0, r: 35.1, d:  3.9, cost:     420, repair:    340, sell:        13_400 },
  { lv: 19, s: 60.5, r: 35.6, d:  3.9, cost:     500, repair:    400, sell:        18_000 },
  { lv: 20, s: 60.0, r: 36.0, d:  4.0, cost:     600, repair:    480, sell:        24_500 },
  { lv: 21, s: 59.0, r: 36.9, d:  4.1, cost:     700, repair:    560, sell:        31_000 },
  { lv: 22, s: 58.0, r: 37.8, d:  4.2, cost:     810, repair:    650, sell:        34_000 },
  { lv: 23, s: 57.0, r: 38.6, d:  4.4, cost:     950, repair:    760, sell:        38_000 },
  { lv: 24, s: 56.0, r: 39.5, d:  4.5, cost:   1_100, repair:  1_100, sell:        43_500 },
  { lv: 25, s: 54.7, r: 40.8, d:  4.5, cost:   1_300, repair:  1_300, sell:        55_000 },
  { lv: 26, s: 53.3, r: 42.1, d:  4.6, cost:   1_500, repair:  1_500, sell:        67_500 },
  { lv: 27, s: 52.0, r: 43.4, d:  4.6, cost:   1_800, repair:  1_800, sell:        83_000 },
  { lv: 28, s: 50.7, r: 44.6, d:  4.7, cost:   2_100, repair:  2_100, sell:       104_000 },
  { lv: 29, s: 49.3, r: 45.9, d:  4.8, cost:   2_500, repair:  2_500, sell:       138_000 },
  { lv: 30, s: 48.0, r: 47.2, d:  4.8, cost:   3_000, repair:  3_000, sell:       190_000 },
  { lv: 31, s: 46.3, r: 48.8, d:  4.8, cost:   3_500, repair:  3_500, sell:       270_000 },
  { lv: 32, s: 44.7, r: 50.5, d:  4.8, cost:   4_200, repair:  4_200, sell:       350_000 },
  { lv: 33, s: 43.0, r: 52.1, d:  4.9, cost:   4_900, repair:  4_900, sell:       460_000 },
  { lv: 34, s: 41.3, r: 53.7, d:  5.0, cost:   5_800, repair:  5_800, sell:       610_000 },
  { lv: 35, s: 39.7, r: 55.4, d:  5.0, cost:   6_800, repair:  6_800, sell:       825_000 },
  { lv: 36, s: 38.0, r: 57.0, d:  5.0, cost:   8_000, repair:  8_000, sell:       900_000 },
  { lv: 37, s: 37.0, r: 57.8, d:  5.2, cost:   9_800, repair:  9_800, sell:     1_100_000 },
  { lv: 38, s: 36.0, r: 58.5, d:  5.5, cost:  12_000, repair: 12_000, sell:     1_350_000 },
  { lv: 39, s: 35.0, r: 59.3, d:  5.7, cost:  15_000, repair: 15_000, sell:     1_700_000 },
  { lv: 40, s: 34.0, r: 60.0, d:  6.0, cost:  18_000, repair: 18_000, sell:     2_250_000 },
  { lv: 41, s: 31.0, r: 62.8, d:  6.2, cost:  22_000, repair: 26_000, sell:     3_100_000 },
  { lv: 42, s: 29.0, r: 64.6, d:  6.4, cost:  27_000, repair: 32_000, sell:     4_350_000 },
  { lv: 43, s: 27.0, r: 66.4, d:  6.6, cost:  33_000, repair: 40_000, sell:     6_000_000 },
  { lv: 44, s: 25.0, r: 68.2, d:  6.8, cost:  41_000, repair: 49_000, sell:     8_400_000 },
  { lv: 45, s: 23.0, r: 70.0, d:  7.0, cost:  50_000, repair: 60_000, sell:    12_500_000 },
  { lv: 46, s: 18.0, r: 74.5, d:  7.5, cost:  66_000, repair: 92_000, sell:    19_500_000 },
  { lv: 47, s: 15.0, r: 77.0, d:  8.0, cost:  87_000, repair: 120_000, sell:   36_000_000 },
  { lv: 48, s: 12.0, r: 79.0, d:  9.0, cost: 110_000, repair: 150_000, sell:   75_000_000 },
  { lv: 49, s:  6.0, r: 79.0, d: 15.0, cost: 150_000, repair: 210_000, sell:  190_000_000 },
  { lv: 50, s:  0,   r:  0,   d:  0,   cost:       0, repair:       0, sell: 1_000_000_000 },
];

// ─── Repair unlock milestones ──────────────────────────────────────────────
// Key = level that was JUST successfully enhanced TO (unlocks new cap)
export const REPAIR_UNLOCK_MILESTONES = {
  11: 4,   // cleared +10→+11
  21: 7,   // cleared +20→+21
  31: 10,  // cleared +30→+31
  41: 11,  // cleared +40→+41
  42: 12,
  43: 13,
  44: 14,
  45: 15,
  46: 16,
  47: 17,
  48: 18,
  49: 20,
};
export const BASE_MAX_REPAIR = 2;

export const STORY_PHASES = {
  phase0: {
    key: 'phase0',
    title: '불꽃의 선택',
    subtitle: 'Chosen by Flame',
    caption: '게임 첫 실행 직후',
    captionEn: 'At the very start of the game',
    illustrations: ['동굴', '맹수', '혹독한 자연', '불 없는 밤'],
    monologue: [
      '어린 소년은 맹수와 추위 속에서 동굴로 숨어든다.',
      '그곳에서 그는 평범하지 않은 불꽃을 발견한다.',
      '그 불꽃은 나무를 태우지 않고, 돌을 녹이지도 않는다.',
      '마치 누군가를 기다렸던 것처럼 소년 앞에서 조용히 타오른다.',
      '소년이 손을 뻗자, 불꽃은 그를 태우지 않는다.',
    ],
    monologueEn: [
      'A young boy takes refuge in a cave, fleeing beasts and bitter cold.',
      'There he discovers a flame unlike any other.',
      'It does not burn wood. It does not melt stone.',
      'It burns quietly before him, as if it had been waiting.',
      'When he reaches out, the flame does not consume him.',
    ],
    world: '처음 발견된 불꽃은 도구가 아니라 선택이었다. 대장장이는 불을 발견한 것이 아니라, 불이 대장장이를 선택했다.',
    worldEn: 'The first flame was not a tool — it was a choice. The blacksmith did not find the fire; the fire chose the blacksmith.',
    core: '대장장이가 불을 발견한 것이 아니라 불이 대장장이를 선택함',
    after: '첫 불 발견 → 게임 시작',
  },
  phase1: {
    key: 'phase1',
    title: '고대의 여명',
    subtitle: 'Dawn of Civilization',
    caption: '1번 무기 해금 직전',
    captionEn: 'Just before the first weapon is forged',
    illustrations: ['최초의 불', '석기', '청동'],
    monologue: [
      '소년은 불꽃의 힘으로 인류 최초의 무기를 만들기 시작한다.',
      '돌, 뼈, 나무, 청동.',
      '사람들은 그를 두려워하면서도 의지한다.',
      '문명이 시작된다.',
    ],
    monologueEn: [
      'With the power of the flame, the boy begins forging humanity\'s first weapons.',
      'Stone, bone, wood, bronze.',
      'People fear him — and yet they depend on him.',
      'Civilization begins.',
    ],
    world: '생존을 위한 도구는 공동체를 지키는 무기가 되었고, 무기는 문명의 시작을 알렸다.',
    worldEn: 'Tools born for survival became weapons to protect the tribe. Weapons heralded the dawn of civilization.',
    core: '생존 → 문명',
    playRange: 'Weapon 1~10',
  },
  phase2: {
    key: 'phase2',
    title: '철의 제국',
    subtitle: 'Iron Dominion',
    caption: '10번 무기 완성 → 11번 해금 직전',
    captionEn: 'After the 10th weapon — before the 11th is unlocked',
    illustrations: ['대규모 제국 대장간', '군단병', '기사'],
    monologue: [
      '왕국들은 더 강한 무기를 원한다.',
      '그의 대장간은 커지고 왕과 군대가 그를 찾아온다.',
      '그가 만든 무기로 제국이 세워지고, 동시에 수많은 전쟁도 시작된다.',
      '그는 처음으로 자신의 불꽃을 의심한다.',
    ],
    monologueEn: [
      'Kingdoms hunger for stronger weapons.',
      'His forge grows; kings and armies come to him.',
      'Empires are built with his blades — and countless wars begin with them.',
      'For the first time, he doubts his own flame.',
    ],
    world: '생성의 불꽃은 번영과 파괴를 함께 낳았다. 대장장이의 망치 소리는 영광과 비명 사이에서 울렸다.',
    worldEn: 'The flame of creation gave birth to both prosperity and destruction. The blacksmith\'s hammer rang between glory and agony.',
    core: '창조 → 파괴',
    playRange: 'Weapon 11~20',
  },
  phase3: {
    key: 'phase3',
    title: '이계의 속삭임',
    subtitle: 'Whispers Beyond the Forge',
    caption: '20번 무기 완성 → 21번 해금 직전',
    captionEn: 'After the 20th weapon — before the 21st is unlocked',
    illustrations: ['기괴한 재료', '괴물 잔해', '민담 속 존재'],
    monologue: [
      '인간의 금속으로는 설명할 수 없는 재료들이 나타난다.',
      '도깨비 뿔, 흡혈귀 송곳니, 크라켄 뼈, 저주받은 유물.',
      '전설은 허구가 아니었다.',
      '불꽃은 점점 더 강하게 타오른다.',
    ],
    monologueEn: [
      'Materials appear that no human metal can explain.',
      'Demon horns, vampire fangs, kraken bone, cursed relics.',
      'Legends were not fiction.',
      'The flame burns ever stronger.',
    ],
    world: '현실의 경계가 무너지고 민담이 재료가 되었다. 대장간은 인간 세계와 이계를 잇는 문턱이 된다.',
    worldEn: 'The boundary of reality crumbled and folklore became raw material. The forge became the threshold between the human world and the beyond.',
    core: '현실 → 초현실',
    playRange: 'Weapon 21~30',
  },
  phase4: {
    key: 'phase4',
    title: '영웅의 시대',
    subtitle: 'Age of Heroes',
    caption: '30번 무기 완성 → 31번 해금 직전',
    captionEn: 'After the 30th weapon — before the 31st is unlocked',
    illustrations: ['왕', '영웅', '용사'],
    monologue: [
      '역사를 바꾼 영웅들이 찾아온다.',
      '왕, 장군, 전설적 검객.',
      '그는 인간이 어디까지 올라갈 수 있는지 목격한다.',
      '그러나 그 누군도 불꽃의 진실을 알지 못한다.',
    ],
    monologueEn: [
      'Heroes who changed history come to him.',
      'Kings, generals, legendary swordsmen.',
      'He witnesses how high humanity can climb.',
      'Yet none of them know the true secret of the flame.',
    ],
    world: '인간은 신화에 닿을 듯한 높이까지 올라섰다. 그러나 불꽃의 기원은 여전히 침묵 속에 남아 있었다.',
    worldEn: 'Humanity rose to heights that nearly touched myth. Yet the origin of the flame remained silent still.',
    core: '인간의 정점',
    playRange: 'Weapon 31~40',
  },
  phase5: {
    key: 'phase5',
    title: '신화의 영역',
    subtitle: 'Realm of Myth',
    caption: '40번 무기 완성 → 41번 해금 직전',
    captionEn: 'After the 40th weapon — before the 41st is unlocked',
    illustrations: ['천상 대장간', '신', '용', '별의 금속'],
    monologue: [
      '신들과 고대 존재들이 그를 부른다.',
      '그는 별을 녹이고, 신들의 무기를 벼린다.',
      '마침내 그는 깨닫는다.',
      '이 불꽃은 인간의 것이 아니었다.',
    ],
    monologueEn: [
      'Gods and ancient beings call out to him.',
      'He melts stars and forges weapons for the divine.',
      'At last, he understands.',
      'This flame was never meant for human hands.',
    ],
    world: '불꽃은 인간의 손에 있었지만 인간의 것이 아니었다. 대장장이는 신화의 중심에서 스스로의 경계를 넘는다.',
    worldEn: 'The flame was in human hands, but it was never human. At the heart of myth, the blacksmith crosses his own boundaries.',
    core: '인간 초월',
    playRange: 'Weapon 41~50',
  },
  phaseOmega: {
    key: 'phaseOmega',
    title: '마지막 불꽃',
    subtitle: 'The Last Flame',
    caption: '50번 무기 완성 직후',
    captionEn: 'After the final weapon is completed',
    illustrations: ['붕괴하는 우주 대장간', '완성된 궁극 무기', '늙은 대장장이'],
    monologue: [
      '대장장이는 늙었다.',
      '신도 사라지고, 영웅도 죽고, 제국도 무너졌다.',
      '마지막 순간, 태초의 불꽃은 여전히 타오른다.',
      '이번에는 대장장이가 손을 뻗는다.',
      '하지만 불꽃은 그의 손을 떠난다.',
      '그리고 말없이 어둠 속으로 사라진다.',
      '어딘가에서, 다음 대장장이를 찾기 위해.',
    ],
    monologueEn: [
      'The blacksmith is old.',
      'The gods are gone, the heroes dead, the empires fallen.',
      'In the final moment, the primordial flame still burns.',
      'This time, the blacksmith reaches out.',
      'But the flame leaves his hand.',
      'And without a word, it fades into the dark.',
      'Somewhere, searching for the next blacksmith.',
    ],
    world: '모든 시대는 사라져도 불꽃은 사라지지 않는다. 전설의 끝은 다음 전설의 시작점이 된다.',
    worldEn: 'Every age passes, but the flame does not. The end of one legend is the beginning of the next.',
    core: '모든 전설은 끝난다. 하지만 불꽃은 언제나 다음 이야기를 기다린다.',
  },
  phaseHiddenA: {
    key: 'phaseHiddenA',
    title: '불꽃에게 인정받은 자',
    subtitle: 'Chosen by the Flame',
    caption: '부스트 미사용 & 스킵 사용 엔딩',
    captionEn: 'Ending: no boost, used skip',
    monologue: [
      '대장장이는 불꽃에게 인정받는다.',
      '불꽃은 검이 아니라 대장장이의 심장에 깃든다.',
      '늙음과 상처는 남지만, 더 이상 그를 무너뜨릴 수 없다.',
      '그는 불멸에 가까운 사명을 얻은 불꽃의 대장장이가 된다.',
    ],
    monologueEn: [
      'The blacksmith is recognized by the flame.',
      'The flame rests not in the sword — but in the blacksmith\'s heart.',
      'Age and wounds remain, but they can no longer break him.',
      'He becomes the Blacksmith of the Flame — bearing an undying purpose.',
    ],
    world: '불꽃의 선택은 처음부터 검이 아닌 사람이었다.',
    worldEn: 'The flame\'s choice was never the sword — it was always the smith.',
    core: '인정',
  },
  phaseHiddenB: {
    key: 'phaseHiddenB',
    title: '태초의 화신',
    subtitle: 'The Primordial Incarnate',
    caption: '부스트 미사용 & 스킵 미사용 엔딩',
    captionEn: 'Ending: no boost, no skip',
    monologue: [
      '대장장이는 사실 불꽃을 찾는 인간이 아니라 태초의 불꽃의 화신이었다.',
      '비록 육신의 몸을 입고 태어났지만 그는 태초부터 존재했다.',
      '그가 이를 깨닫는 순간, 자신과 불꽃의 경계는 의미가 없어진다.',
    ],
    monologueEn: [
      'The blacksmith was never a man seeking the flame — he was the primordial flame incarnate.',
      'Though born in flesh, he had existed since the very beginning.',
      'The moment he understands, the boundary between himself and the flame ceases to exist.',
    ],
    world: '태초부터 하나였다. 단지 기억하지 못했을 뿐이다.',
    worldEn: 'They were one from the very beginning. He had simply forgotten.',
    core: '각성',
  },
};

// ─── Zone / Fragment metadata ──────────────────────────────────────────────
export const ZONE_NAMES = ['worn', 'steel', 'rune', 'ancient', 'legend'];

export const FRAGMENT_LABELS = {
  worn:    '사원의 불씨 파편',
  steel:   '제국의 주괴 파편',
  rune:    '민담의 주술 파편',
  ancient: '영웅의 맹세 파편',
  legend:  '신화의 잔광 파편',
};

export const FRAGMENT_LABELS_EN = {
  worn:    'Ember Shard',
  steel:   'Imperial Ingot Shard',
  rune:    'Folk Rune Shard',
  ancient: "Hero's Oath Shard",
  legend:  'Mythic Gleam Shard',
};

export const ZONE_MULTIPLIERS = [0, 0.3, 0.5, 0.8, 1.2]; // index 0 = zone 1 (no req)

// ─── Fragment drop weights on destroy (by sub-zone) ───────────────────────
// key = zone id, value = [{ count, weight }]
export const FRAGMENT_DROP_TABLE = {
  // +1~+10  →  worn
  worn: [
    { count: 0, weight: 10 },
    { count: 1, weight: 25 },
    { count: 2, weight: 35 },
    { count: 3, weight: 22 },
    { count: 4, weight:  6 },
    { count: 5, weight:  2 },
  ],
  // +11~+20  →  steel
  steel: [
    { count: 0, weight: 15 },
    { count: 1, weight: 30 },
    { count: 2, weight: 34 },
    { count: 3, weight: 16 },
    { count: 4, weight:  4 },
    { count: 5, weight:  1 },
  ],
  // +21~+30  →  rune
  rune: [
    { count: 0, weight: 20 },
    { count: 1, weight: 35 },
    { count: 2, weight: 30 },
    { count: 3, weight: 12 },
    { count: 4, weight:  2.5 },
    { count: 5, weight:  0.5 },
  ],
  // +31~+40  →  ancient
  ancient: [
    { count: 0, weight: 28 },
    { count: 1, weight: 36 },
    { count: 2, weight: 25 },
    { count: 3, weight:  9 },
    { count: 4, weight:  1.5 },
    { count: 5, weight:  0.5 },
  ],
  // +41~+45  →  legend (lower sub-zone, EV ≈ 0.40)
  legend_lo: [
    { count: 0, weight: 65 },
    { count: 1, weight: 30 },
    { count: 2, weight:  5 },
  ],
  // +46~+49  →  legend (upper sub-zone, EV ≈ 0.83)
  legend_hi: [
    { count: 0, weight: 35 },
    { count: 1, weight: 50 },
    { count: 2, weight: 12 },
    { count: 3, weight:  3 },
  ],
};

// ─── Sword sacrifice / storage-requirement table ─────────────────────────
// key = target level (the level being enhanced TO)
// value = { consume: [...], require: [...] }
// consume: swords removed from storage on attempt
// require: swords that must be in storage but are NOT consumed (+50 uses +49)
export const SWORD_SACRIFICE = {
  46: { consume: [10], require: [] },
  47: { consume: [20], require: [] },
  48: { consume: [30], require: [] },
  49: { consume: [40], require: [] },
  50: { consume: [],   require: [49] },
};

// ─── Skip ticket / challenge package ─────────────────────────────────────
export const SKIP_TICKETS = [
  { key: 'skip12', label: '+12 스킵권', labelEn: '+12 Skip Ticket', price:     4_000, value: 12, unlockLevel: 12 },
  { key: 'skip24', label: '+24 스킵권', labelEn: '+24 Skip Ticket', price:    60_000, value: 24, unlockLevel: 24 },
  { key: 'skip36', label: '+36 스킵권', labelEn: '+36 Skip Ticket', price: 1_000_000, value: 36, unlockLevel: 36 },
];
export const CHALLENGE_PACKAGE = {
  key: 'challenge36',
  label: '+36 챌린지 패키지', labelEn: '+36 Challenge Package',
  price: 4_000_000,
  value: 36,
  boostPct: 5,
  unlockLevel: 46,
};

// ─── Fragment exchange rates (lower → upper, ratio = how many lower = 1 upper) ──
export const FRAGMENT_EXCHANGE_RATES = [
  { from: 'worn',    to: 'steel',   ratio: 5 },
  { from: 'steel',   to: 'rune',    ratio: 5 },
  { from: 'rune',    to: 'ancient', ratio: 5 },
  { from: 'ancient', to: 'legend',  ratio: 8 },
];

// ─── Storage tiers (fixed steps) ──────────────────────────────────────────
// Each entry: the TOTAL slots after purchasing, and the price to reach it
export const STORAGE_TIERS = [
  { slots: 10, price:         0 }, // default, cannot purchase
  { slots: 15, price:    30_000 },
  { slots: 20, price:    80_000 },
  { slots: 25, price:   180_000 },
  { slots: 30, price:   400_000 },
  { slots: 35, price:   800_000 },
  { slots: 40, price: 1_500_000 },
  { slots: 45, price: 2_500_000 },
  { slots: 50, price: 4_000_000 },
];

// ─── Starting game state ──────────────────────────────────────────────────
export const STARTING_GOLD = 500;
export const BASE_STORAGE_CAPACITY = 10;
export const MAX_SAVE_SLOTS = 3;

export const STARTING_STATE = {
  gold: STARTING_GOLD,
  activeSword: { id: 1, name: '날카로운 돌조각', level: 1 },
  storage: [],
  fragments: { worn: 0, steel: 0, rune: 0, ancient: 0, legend: 0 },
  // Repair system
  repairUsed: 0,
  maxRepairCount: BASE_MAX_REPAIR,
  // Boost tracking
  challengeBoostWeaponId: null,
  usedBoostThisGame: false,
  usedSkipThisGame: false,
  // Storage
  storageSlots: BASE_STORAGE_CAPACITY,
  nextSwordId: 2,
  maxSuccessLevel: 0,
  seenStoryPhases: [],
  storyPopupsEnabled: true,
  enhanceWarningsEnabled: true,
  goldWarningEnabled: true,
  autoBreakWarningEnabled: true,
  cheatUnlocked: false,
  cheatForceOutcome: 'none',
  cheatIgnoreRequirements: false,
};
