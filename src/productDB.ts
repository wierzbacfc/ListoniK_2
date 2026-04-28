import { GoogleGenAI } from '@google/genai';

export type ProductMeta = {
  category: string;
  icon: string;
};

export const defaultProductDB: Record<string, ProductMeta> = {
  // ── Nabiał ──────────────────────────────────────────────
  'mleko': { category: 'Nabiał', icon: '🥛' },
  'mleko 2%': { category: 'Nabiał', icon: '🥛' },
  'mleko 3,2%': { category: 'Nabiał', icon: '🥛' },
  'mleko kokosowe': { category: 'Nabiał', icon: '🥛' },
  'ser': { category: 'Nabiał', icon: '🧀' },
  'ser żółty': { category: 'Nabiał', icon: '🧀' },
  'ser biały': { category: 'Nabiał', icon: '🧀' },
  'ser gouda': { category: 'Nabiał', icon: '🧀' },
  'ser mozzarella': { category: 'Nabiał', icon: '🧀' },
  'ser feta': { category: 'Nabiał', icon: '🧀' },
  'ser parmezan': { category: 'Nabiał', icon: '🧀' },
  'jogurt': { category: 'Nabiał', icon: '🥣' },
  'jogurt naturalny': { category: 'Nabiał', icon: '🥣' },
  'jogurt grecki': { category: 'Nabiał', icon: '🥣' },
  'masło': { category: 'Nabiał', icon: '🧈' },
  'masło orzechowe': { category: 'Nabiał', icon: '🧈' },
  'kefir': { category: 'Nabiał', icon: '🥛' },
  'twaróg': { category: 'Nabiał', icon: '🧀' },
  'śmietana': { category: 'Nabiał', icon: '🥛' },
  'śmietanka': { category: 'Nabiał', icon: '🥛' },
  'jajka': { category: 'Nabiał', icon: '🥚' },
  'jaja': { category: 'Nabiał', icon: '🥚' },
  'maślanka': { category: 'Nabiał', icon: '🥛' },
  'ricotta': { category: 'Nabiał', icon: '🧀' },
  'serek wiejski': { category: 'Nabiał', icon: '🥣' },
  'serek': { category: 'Nabiał', icon: '🥣' },
  'serki': { category: 'Nabiał', icon: '🥣' },
  'homogenizowany': { category: 'Nabiał', icon: '🥣' },

  // ── Pieczywo ────────────────────────────────────────────
  'chleb': { category: 'Pieczywo', icon: '🍞' },
  'chleb razowy': { category: 'Pieczywo', icon: '🍞' },
  'chleb tostowy': { category: 'Pieczywo', icon: '🍞' },
  'bułka': { category: 'Pieczywo', icon: '🥖' },
  'bułki': { category: 'Pieczywo', icon: '🥖' },
  'rogal': { category: 'Pieczywo', icon: '🥐' },
  'rogale': { category: 'Pieczywo', icon: '🥐' },
  'bagietka': { category: 'Pieczywo', icon: '🥖' },
  'tosty': { category: 'Pieczywo', icon: '🍞' },
  'ciabatta': { category: 'Pieczywo', icon: '🥖' },
  'pita': { category: 'Pieczywo', icon: '🫓' },
  'tortilla': { category: 'Pieczywo', icon: '🫓' },
  'graham': { category: 'Pieczywo', icon: '🍞' },
  'pumpernikiel': { category: 'Pieczywo', icon: '🍞' },

  // ── Warzywa & Owoce ─────────────────────────────────────
  'jabłko': { category: 'Warzywa & Owoce', icon: '🍎' },
  'jabłka': { category: 'Warzywa & Owoce', icon: '🍎' },
  'banan': { category: 'Warzywa & Owoce', icon: '🍌' },
  'banany': { category: 'Warzywa & Owoce', icon: '🍌' },
  'pomidor': { category: 'Warzywa & Owoce', icon: '🍅' },
  'pomidory': { category: 'Warzywa & Owoce', icon: '🍅' },
  'ziemniak': { category: 'Warzywa & Owoce', icon: '🥔' },
  'ziemniaki': { category: 'Warzywa & Owoce', icon: '🥔' },
  'ogórek': { category: 'Warzywa & Owoce', icon: '🥒' },
  'ogórki': { category: 'Warzywa & Owoce', icon: '🥒' },
  'marchew': { category: 'Warzywa & Owoce', icon: '🥕' },
  'marchewka': { category: 'Warzywa & Owoce', icon: '🥕' },
  'cebula': { category: 'Warzywa & Owoce', icon: '🧅' },
  'czosnek': { category: 'Warzywa & Owoce', icon: '🧄' },
  'papryka': { category: 'Warzywa & Owoce', icon: '🫑' },
  'brokuł': { category: 'Warzywa & Owoce', icon: '🥦' },
  'brokuły': { category: 'Warzywa & Owoce', icon: '🥦' },
  'cytryna': { category: 'Warzywa & Owoce', icon: '🍋' },
  'cytryny': { category: 'Warzywa & Owoce', icon: '🍋' },
  'truskawki': { category: 'Warzywa & Owoce', icon: '🍓' },
  'winogrona': { category: 'Warzywa & Owoce', icon: '🍇' },
  'winogrono': { category: 'Warzywa & Owoce', icon: '🍇' },
  'sałata': { category: 'Warzywa & Owoce', icon: '🥬' },
  'szpinak': { category: 'Warzywa & Owoce', icon: '🥬' },
  'kalafior': { category: 'Warzywa & Owoce', icon: '🥦' },
  'kapusta': { category: 'Warzywa & Owoce', icon: '🥬' },
  'por': { category: 'Warzywa & Owoce', icon: '🧅' },
  'rzodkiewka': { category: 'Warzywa & Owoce', icon: '🌱' },
  'awokado': { category: 'Warzywa & Owoce', icon: '🥑' },
  'mango': { category: 'Warzywa & Owoce', icon: '🥭' },
  'pomarańcza': { category: 'Warzywa & Owoce', icon: '🍊' },
  'pomarańcze': { category: 'Warzywa & Owoce', icon: '🍊' },
  'gruszka': { category: 'Warzywa & Owoce', icon: '🍐' },
  'gruszki': { category: 'Warzywa & Owoce', icon: '🍐' },
  'śliwki': { category: 'Warzywa & Owoce', icon: '🫐' },
  'maliny': { category: 'Warzywa & Owoce', icon: '🍓' },
  'borówki': { category: 'Warzywa & Owoce', icon: '🫐' },
  'kiwi': { category: 'Warzywa & Owoce', icon: '🥝' },
  'ananas': { category: 'Warzywa & Owoce', icon: '🍍' },
  'arbuz': { category: 'Warzywa & Owoce', icon: '🍉' },
  'kukurydza': { category: 'Warzywa & Owoce', icon: '🌽' },
  'pieczarki': { category: 'Warzywa & Owoce', icon: '🍄' },
  'grzyby': { category: 'Warzywa & Owoce', icon: '🍄' },

  // ── Mięso & Wędliny ─────────────────────────────────────
  'mięso': { category: 'Mięso & Wędliny', icon: '🥩' },
  'kurczak': { category: 'Mięso & Wędliny', icon: '🍗' },
  'pierś z kurczaka': { category: 'Mięso & Wędliny', icon: '🍗' },
  'udka z kurczaka': { category: 'Mięso & Wędliny', icon: '🍗' },
  'parówki': { category: 'Mięso & Wędliny', icon: '🌭' },
  'szynka': { category: 'Mięso & Wędliny', icon: '🥓' },
  'wołowina': { category: 'Mięso & Wędliny', icon: '🥩' },
  'wieprzowina': { category: 'Mięso & Wędliny', icon: '🥩' },
  'kabanosy': { category: 'Mięso & Wędliny', icon: '🥓' },
  'boczek': { category: 'Mięso & Wędliny', icon: '🥓' },
  'kiełbasa': { category: 'Mięso & Wędliny', icon: '🌭' },
  'salami': { category: 'Mięso & Wędliny', icon: '🍕' },
  'polędwica': { category: 'Mięso & Wędliny', icon: '🥓' },
  'mielone': { category: 'Mięso & Wędliny', icon: '🥩' },
  'indyk': { category: 'Mięso & Wędliny', icon: '🦃' },
  'mortadela': { category: 'Mięso & Wędliny', icon: '🥓' },

  // ── Ryby & Owoce Morza ──────────────────────────────────
  'łosoś': { category: 'Ryby & Owoce Morza', icon: '🐟' },
  'tuńczyk': { category: 'Ryby & Owoce Morza', icon: '🐟' },
  'ryba': { category: 'Ryby & Owoce Morza', icon: '🐟' },
  'filet rybny': { category: 'Ryby & Owoce Morza', icon: '🐟' },
  'śledź': { category: 'Ryby & Owoce Morza', icon: '🐟' },
  'makrela': { category: 'Ryby & Owoce Morza', icon: '🐟' },
  'krewetki': { category: 'Ryby & Owoce Morza', icon: '🦐' },
  'kalmary': { category: 'Ryby & Owoce Morza', icon: '🦑' },
  'pstrąg': { category: 'Ryby & Owoce Morza', icon: '🐟' },
  'dorsz': { category: 'Ryby & Owoce Morza', icon: '🐟' },

  // ── Mrożonki ────────────────────────────────────────────
  'mrożone warzywa': { category: 'Mrożonki', icon: '🧊' },
  'mrożony szpinak': { category: 'Mrożonki', icon: '🧊' },
  'mrożony groszek': { category: 'Mrożonki', icon: '🧊' },
  'mrożona pizza': { category: 'Mrożonki', icon: '🍕' },
  'mrożone pierogi': { category: 'Mrożonki', icon: '🥟' },
  'mrożone owoce': { category: 'Mrożonki', icon: '🧊' },
  'mrożone frytki': { category: 'Mrożonki', icon: '🍟' },
  'lody': { category: 'Mrożonki', icon: '🍦' },

  // ── Napoje ──────────────────────────────────────────────
  'woda': { category: 'Napoje', icon: '💧' },
  'woda gazowana': { category: 'Napoje', icon: '💧' },
  'woda niegazowana': { category: 'Napoje', icon: '💧' },
  'sok': { category: 'Napoje', icon: '🧃' },
  'sok pomarańczowy': { category: 'Napoje', icon: '🧃' },
  'sok jabłkowy': { category: 'Napoje', icon: '🧃' },
  'cola': { category: 'Napoje', icon: '🥤' },
  'coca-cola': { category: 'Napoje', icon: '🥤' },
  'pepsi': { category: 'Napoje', icon: '🥤' },
  'sprite': { category: 'Napoje', icon: '🥤' },
  'fanta': { category: 'Napoje', icon: '🥤' },
  'piwo': { category: 'Napoje', icon: '🍺' },
  'wino': { category: 'Napoje', icon: '🍷' },
  'herbata': { category: 'Napoje', icon: '🍵' },
  'herbatki': { category: 'Napoje', icon: '🍵' },
  'kawa': { category: 'Napoje', icon: '☕' },
  'kawa mielona': { category: 'Napoje', icon: '☕' },
  'kawa ziarnista': { category: 'Napoje', icon: '☕' },
  'cappuccino': { category: 'Napoje', icon: '☕' },
  'energy drink': { category: 'Napoje', icon: '⚡' },
  'kompot': { category: 'Napoje', icon: '🧃' },
  'napój': { category: 'Napoje', icon: '🥤' },

  // ── Słodycze & Przekąski ─────────────────────────────────
  'czekolada': { category: 'Słodycze & Przekąski', icon: '🍫' },
  'czekolada mleczna': { category: 'Słodycze & Przekąski', icon: '🍫' },
  'czekolada gorzka': { category: 'Słodycze & Przekąski', icon: '🍫' },
  'ciastka': { category: 'Słodycze & Przekąski', icon: '🍪' },
  'baton': { category: 'Słodycze & Przekąski', icon: '🍫' },
  'batony': { category: 'Słodycze & Przekąski', icon: '🍫' },
  'cukierki': { category: 'Słodycze & Przekąski', icon: '🍬' },
  'żelki': { category: 'Słodycze & Przekąski', icon: '🍬' },
  'chipsy': { category: 'Słodycze & Przekąski', icon: '🥔' },
  'chrupki': { category: 'Słodycze & Przekąski', icon: '🍿' },
  'popcorn': { category: 'Słodycze & Przekąski', icon: '🍿' },
  'orzechy': { category: 'Słodycze & Przekąski', icon: '🥜' },
  'orzeszki': { category: 'Słodycze & Przekąski', icon: '🥜' },
  'migdały': { category: 'Słodycze & Przekąski', icon: '🥜' },
  'pistacje': { category: 'Słodycze & Przekąski', icon: '🥜' },
  'batonik': { category: 'Słodycze & Przekąski', icon: '🍫' },
  'wafelki': { category: 'Słodycze & Przekąski', icon: '🍪' },
  'krakersy': { category: 'Słodycze & Przekąski', icon: '🍘' },
  'paluszki': { category: 'Słodycze & Przekąski', icon: '🍘' },
  'guma do żucia': { category: 'Słodycze & Przekąski', icon: '🍬' },
  'miód': { category: 'Słodycze & Przekąski', icon: '🍯' },
  'dżem': { category: 'Słodycze & Przekąski', icon: '🍓' },

  // ── Sypkie & Przetwory ──────────────────────────────────
  'mąka': { category: 'Sypkie & Przetwory', icon: '🌾' },
  'mąka pszenna': { category: 'Sypkie & Przetwory', icon: '🌾' },
  'mąka razowa': { category: 'Sypkie & Przetwory', icon: '🌾' },
  'cukier': { category: 'Sypkie & Przetwory', icon: '🧂' },
  'cukier puder': { category: 'Sypkie & Przetwory', icon: '🧂' },
  'sól': { category: 'Sypkie & Przetwory', icon: '🧂' },
  'olej': { category: 'Sypkie & Przetwory', icon: '🛢️' },
  'olej rzepakowy': { category: 'Sypkie & Przetwory', icon: '🛢️' },
  'oliwa': { category: 'Sypkie & Przetwory', icon: '🫒' },
  'oliwa z oliwek': { category: 'Sypkie & Przetwory', icon: '🫒' },
  'ryż': { category: 'Sypkie & Przetwory', icon: '🍚' },
  'ryż brązowy': { category: 'Sypkie & Przetwory', icon: '🍚' },
  'makaron': { category: 'Sypkie & Przetwory', icon: '🍝' },
  'makaron spaghetti': { category: 'Sypkie & Przetwory', icon: '🍝' },
  'makaron penne': { category: 'Sypkie & Przetwory', icon: '🍝' },
  'kasza': { category: 'Sypkie & Przetwory', icon: '🌾' },
  'kasza gryczana': { category: 'Sypkie & Przetwory', icon: '🌾' },
  'kasza manna': { category: 'Sypkie & Przetwory', icon: '🌾' },
  'płatki owsiane': { category: 'Sypkie & Przetwory', icon: '🥣' },
  'płatki kukurydziane': { category: 'Sypkie & Przetwory', icon: '🥣' },
  'granola': { category: 'Sypkie & Przetwory', icon: '🥣' },
  'soczewica': { category: 'Sypkie & Przetwory', icon: '🫘' },
  'fasola': { category: 'Sypkie & Przetwory', icon: '🫘' },
  'groszek': { category: 'Sypkie & Przetwory', icon: '🫘' },
  'ciecierzyca': { category: 'Sypkie & Przetwory', icon: '🫘' },
  'bułka tarta': { category: 'Sypkie & Przetwory', icon: '🌾' },
  'proszek do pieczenia': { category: 'Sypkie & Przetwory', icon: '🌾' },

  // ── Przyprawy & Sosy ────────────────────────────────────
  'pieprz': { category: 'Przyprawy & Sosy', icon: '🌶️' },
  'papryka mielona': { category: 'Przyprawy & Sosy', icon: '🌶️' },
  'curry': { category: 'Przyprawy & Sosy', icon: '🟡' },
  'oregano': { category: 'Przyprawy & Sosy', icon: '🌿' },
  'bazylia': { category: 'Przyprawy & Sosy', icon: '🌿' },
  'tymianek': { category: 'Przyprawy & Sosy', icon: '🌿' },
  'ketchup': { category: 'Przyprawy & Sosy', icon: '🍅' },
  'musztarda': { category: 'Przyprawy & Sosy', icon: '🫙' },
  'majonez': { category: 'Przyprawy & Sosy', icon: '🫙' },
  'sos sojowy': { category: 'Przyprawy & Sosy', icon: '🫙' },
  'ocet': { category: 'Przyprawy & Sosy', icon: '🫙' },
  'concentrat pomidorowy': { category: 'Przyprawy & Sosy', icon: '🍅' },
  'sos do makaronu': { category: 'Przyprawy & Sosy', icon: '🍝' },
  'tabasco': { category: 'Przyprawy & Sosy', icon: '🌶️' },
  'hummus': { category: 'Przyprawy & Sosy', icon: '🫙' },

  // ── Chemia & Higiena ─────────────────────────────────────
  'szampon': { category: 'Chemia & Higiena', icon: '🧴' },
  'odżywka': { category: 'Chemia & Higiena', icon: '🧴' },
  'mydło': { category: 'Chemia & Higiena', icon: '🧼' },
  'mydło w płynie': { category: 'Chemia & Higiena', icon: '🧼' },
  'pasta do zębów': { category: 'Chemia & Higiena', icon: '🪥' },
  'pasta': { category: 'Chemia & Higiena', icon: '🪥' },
  'żel pod prysznic': { category: 'Chemia & Higiena', icon: '🧴' },
  'żel': { category: 'Chemia & Higiena', icon: '🧴' },
  'proszek do prania': { category: 'Chemia & Higiena', icon: '🫧' },
  'proszek': { category: 'Chemia & Higiena', icon: '🫧' },
  'papier toaletowy': { category: 'Chemia & Higiena', icon: '🧻' },
  'papier': { category: 'Chemia & Higiena', icon: '🧻' },
  'ręczniki papierowe': { category: 'Chemia & Higiena', icon: '🧻' },
  'płyn do naczyń': { category: 'Chemia & Higiena', icon: '🫧' },
  'płyn': { category: 'Chemia & Higiena', icon: '🫧' },
  'płyn do płukania': { category: 'Chemia & Higiena', icon: '🫧' },
  'dezodorant': { category: 'Chemia & Higiena', icon: '🧴' },
  'krem': { category: 'Chemia & Higiena', icon: '🧴' },
  'chusteczki': { category: 'Chemia & Higiena', icon: '🤧' },
  'worki na śmieci': { category: 'Chemia & Higiena', icon: '🗑️' },
  'gąbka': { category: 'Chemia & Higiena', icon: '🧽' },
  'tabletki do zmywarki': { category: 'Chemia & Higiena', icon: '🫧' },
  'płyn wybielający': { category: 'Chemia & Higiena', icon: '🫧' },

  // ── Dla Zwierząt ─────────────────────────────────────────
  'karma dla kota': { category: 'Dla Zwierząt', icon: '🐈' },
  'karma dla psa': { category: 'Dla Zwierząt', icon: '🐕' },
  'żwirek': { category: 'Dla Zwierząt', icon: '🐈' },
  'przysmaki dla psa': { category: 'Dla Zwierząt', icon: '🐕' },

  // ── Dla Dzieci & Niemowląt ───────────────────────────────
  'mleko modyfikowane': { category: 'Dla Dzieci & Niemowląt', icon: '🍼' },
  'mleko dla niemowląt': { category: 'Dla Dzieci & Niemowląt', icon: '🍼' },
  'mleko następne': { category: 'Dla Dzieci & Niemowląt', icon: '🍼' },
  'mleko junior': { category: 'Dla Dzieci & Niemowląt', icon: '🍼' },
  'kaszka': { category: 'Dla Dzieci & Niemowląt', icon: '🥣' },
  'kaszka ryżowa': { category: 'Dla Dzieci & Niemowląt', icon: '🥣' },
  'kaszka kukurydziana': { category: 'Dla Dzieci & Niemowląt', icon: '🥣' },
  'kaszka mleczna': { category: 'Dla Dzieci & Niemowląt', icon: '🥣' },
  'zupka dla niemowląt': { category: 'Dla Dzieci & Niemowląt', icon: '🍲' },
  'obiadek dla niemowląt': { category: 'Dla Dzieci & Niemowląt', icon: '🍲' },
  'przecier dla niemowląt': { category: 'Dla Dzieci & Niemowląt', icon: '🥕' },
  'słoiczek': { category: 'Dla Dzieci & Niemowląt', icon: '🫙' },
  'słoiczki': { category: 'Dla Dzieci & Niemowląt', icon: '🫙' },
  'musy dla dzieci': { category: 'Dla Dzieci & Niemowląt', icon: '🥣' },
  'kleik': { category: 'Dla Dzieci & Niemowląt', icon: '🥣' },
  'herbatka dla niemowląt': { category: 'Dla Dzieci & Niemowląt', icon: '🍵' },
  'herbatka rumiankowa': { category: 'Dla Dzieci & Niemowląt', icon: '🍵' },
  'sok dla niemowląt': { category: 'Dla Dzieci & Niemowląt', icon: '🧃' },
  'woda dla niemowląt': { category: 'Dla Dzieci & Niemowląt', icon: '💧' },
  'pieluszki': { category: 'Dla Dzieci & Niemowląt', icon: '👶' },
  'pampersy': { category: 'Dla Dzieci & Niemowląt', icon: '👶' },
  'pieluchy': { category: 'Dla Dzieci & Niemowląt', icon: '👶' },
  'pieluszki jednorazowe': { category: 'Dla Dzieci & Niemowląt', icon: '👶' },
  'pieluszki wielorazowe': { category: 'Dla Dzieci & Niemowląt', icon: '👶' },
  'chusteczki nawilżane': { category: 'Dla Dzieci & Niemowląt', icon: '🤲' },
  'chusteczki dla niemowląt': { category: 'Dla Dzieci & Niemowląt', icon: '🤲' },
  'krem dla niemowląt': { category: 'Dla Dzieci & Niemowląt', icon: '🧴' },
  'krem pod pieluchę': { category: 'Dla Dzieci & Niemowląt', icon: '🧴' },
  'balsam dla dzieci': { category: 'Dla Dzieci & Niemowląt', icon: '🧴' },
  'szampon dla dzieci': { category: 'Dla Dzieci & Niemowląt', icon: '🧴' },
  'płyn do kąpieli dla dzieci': { category: 'Dla Dzieci & Niemowląt', icon: '🛁' },
  'oliwka dla niemowląt': { category: 'Dla Dzieci & Niemowląt', icon: '🧴' },
  'smoczek': { category: 'Dla Dzieci & Niemowląt', icon: '🍼' },
  'smoczki': { category: 'Dla Dzieci & Niemowląt', icon: '🍼' },
  'butelka dla niemowląt': { category: 'Dla Dzieci & Niemowląt', icon: '🍼' },
  'sterylizator': { category: 'Dla Dzieci & Niemowląt', icon: '🍼' },
  'gryzak': { category: 'Dla Dzieci & Niemowląt', icon: '🧸' },
  'serwetki bawełniane': { category: 'Dla Dzieci & Niemowląt', icon: '🤲' },
  'podkłady higieniczne': { category: 'Dla Dzieci & Niemowląt', icon: '👶' },
  'sypki puder': { category: 'Dla Dzieci & Niemowląt', icon: '🧴' },
};

export const getSavedDB = (): Record<string, ProductMeta> => {
  const saved = localStorage.getItem('custom-product-db');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Usuwamy stare tymczasowe przypisania AI, by mogły zostać przetworzone przez prawdziwe AI
      for (const key in parsed) {
        if (parsed[key].category === 'Inne (AI)') {
          delete parsed[key];
        }
      }
      return { ...defaultProductDB, ...parsed };
    } catch {
      return defaultProductDB;
    }
  }
  return defaultProductDB;
};

export const saveToDB = (newItems: Record<string, ProductMeta>) => {
  const existing = getSavedDB();
  const updated = { ...existing, ...newItems };
  localStorage.setItem('custom-product-db', JSON.stringify(updated));
  return updated;
};

// Prawdziwe AI - korzystamy z Gemini do kategoryzacji produktów!
export const simulateAI = async (productName: string): Promise<ProductMeta> => {
  try {
    const apiKey = localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Missing Gemini API Key. Please add it in settings.");
      return { category: 'Inne', icon: '✨' };
    }

    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Skategoryzuj produkt sklepowy/zakupowy o nazwie "${productName}". 
Dozwolone kategorie to: Nabiał, Pieczywo, Warzywa & Owoce, Mięso & Wędliny, Ryby & Owoce Morza, Mrożonki, Napoje, Słodycze & Przekąski, Sypkie & Przetwory, Przyprawy & Sosy, Chemia & Higiena, Dla Zwierząt, Dla Dzieci & Niemowląt.
Jeśli żaden nie pasuje, użyj kategorii "Inne".
Dopasuj do produktu JEDNO emoji jako ikonę.
Zwróć TYLKO czysty obiekt JSON, bez absolutnie żadnych formatowań kodu (bez znaków \`\`\` itp.).
Przykład odpowiedzi: {"category": "Warzywa & Owoce", "icon": "🍎"}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text || '';
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);

    return { 
      category: parsed.category || 'Inne', 
      icon: parsed.icon || '✨' 
    };
  } catch (error) {
    console.error("AI Categorization failed:", error);
    // Zwróć fallback gdyby coś poszło nie tak
    return { category: 'Inne', icon: '✨'};
  }
};
