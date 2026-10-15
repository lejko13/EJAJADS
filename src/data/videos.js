// Všetky videá z portfolio.leofudaly.com
// views / likes / ... sú zatiaľ len ukážkové čísla do návrhu

export const owner = {
  handle: 'ejajads',
  name: 'ejajads',
  avatar: '/logo-ejajads.png',
  bio: 'AI video reklamy, reels a TikToky pre značky 🎬\nOd nápadu po hotové video za pár dní.',
  link: 'portfolio.leofudaly.com',
  linkUrl: 'https://portfolio.leofudaly.com/',
  email: 'leo.fudaly@gmail.com',
  instagram: 'https://www.instagram.com/leofudaly/',
  following: 7,
  followers: '1 026',
  likes: '22.8K',
}

export const accounts = {
  lomnica: {
    handle: 'hotellomnica',
    name: 'Hotel Lomnica *****',
    avatar: '/videos/lomnica/walkthrough.jpg',
    url: 'https://www.hotellomnica.sk',
    category: 'Video / Reels',
    desc: 'Vertikálne videá pre 5* Hotel Lomnica v Tatrách – promo video a krátke videá izieb pre Instagram Reels a TikTok. Všetky zábery sú vygenerované cez AI z fotografií.',
    tech: ['AI video (image-to-video)', 'Premiere Pro', 'CapCut'],
  },
  ladomer: {
    handle: 'autoumyvaren_ladomer',
    name: 'Autoumyváreň Ladomerská',
    avatar: '/videos/ladomer/mercedes.jpg',
    url: 'https://www.autoumyvarenladomerzh.sk',
    category: 'Video / Reels',
    desc: 'Vertikálne Reels videá pre ručnú autoumyváreň Ladomerská – detailing Mercedes-AMG EQS a ručné umývanie BMW X7 pre Instagram a TikTok.',
    tech: ['Premiere Pro', 'AI video', 'CapCut'],
  },
  hrajko: {
    handle: 'hrajko.sk',
    name: 'Hrajko – Svet plný zábavy',
    avatar: '/videos/hrajko/reklama-basketbal.jpg',
    url: 'https://www.hrajko.sk',
    category: 'Video / Reklamy',
    desc: 'Video reklamy na Instagram a Facebook pre e-shop Hrajko – hravé motion videá s výrazným hookom, v dlhej aj krátkej verzii pre testovanie v Meta Ads.',
    tech: ['Premiere Pro', 'After Effects', 'AI video'],
  },
  swappie: {
    handle: 'swappie',
    name: 'Swappie (ukážka)',
    avatar: '/videos/swappie/reklama.jpg',
    url: 'https://swappie.com/sk/',
    category: 'Video / Reklamy (ukážka, nie zákazka)',
    desc: 'Ukážková reklama pre Swappie, ktorá ukazuje, čo dnes zvládne AI a 3D. Vo videu nie je ani jeden reálny záber – vo vertikálnej aj širokouhlej verzii.',
    tech: ['AI video', '3D modely', 'After Effects', 'Premiere Pro'],
  },
  subway: {
    handle: 'subway',
    name: 'Subway (ukážka)',
    avatar: '/videos/subway/reklama.jpg',
    url: 'https://www.subway.com/sk-SK',
    category: 'Video / Reklamy (ukážka, nie zákazka)',
    desc: 'Ukážková reklama pre Subway, ktorá ukazuje celú objednávku krok za krokom – od výberu subu až po najbližšiu prevádzku.',
    tech: ['AI video', 'After Effects', 'Premiere Pro'],
  },
  belanske: {
    handle: 'belanskestavebniny',
    name: 'Belanské stavebniny',
    avatar: '/videos/belanske/reklama-1.jpg',
    url: 'https://www.belanskestavebniny.sk',
    category: 'Video / Reklamy',
    desc: 'Video reklamy na Instagram a Facebook pre Belanské stavebniny v Spišskej Belej – štyri oddelenia, jedna adresa, servis pre firmy aj domácich majstrov.',
    tech: ['Premiere Pro', 'After Effects', 'Motion grafika'],
  },
  leofudaly: {
    handle: 'leofudaly',
    name: 'Leo Fudaly',
    avatar: '/videos/leofudaly/reel-1.jpg',
    url: 'https://www.instagram.com/leofudaly/',
    category: 'Video / Reels',
    desc: 'Reels pre značku ručne šitého oblečenia – „Draw my outfit“, šitie čiapky krok za krokom a videá o streetwear móde.',
    tech: ['CapCut', 'Premiere Pro', 'Telefón'],
  },
}

const v = (id, account, file, caption, tags, stats, extra = {}) => ({
  id,
  account,
  src: `/videos/${account}/${file}.mp4`,
  poster: `/videos/${account}/${file}.jpg`,
  caption,
  tags,
  ...stats,
  ...extra,
})

// poradie = poradie vo feede "Pre teba"
export const videos = [
  v('lomnica-promo', 'lomnica', 'lomnica-hotel-v3', 'Za úrovňou Michelinu nemusíš vycestovať do zahraničia ✨ Celé video vzniklo cez AI z fotiek hotela.', ['aivideo', 'hotel', 'tatry', 'reels'], { views: 4820, likes: 612, comments: 38, saves: 91, shares: 44 }, { type: 'reels' }),
  v('swappie-916', 'swappie', 'reklama', 'Nový iPhone? Ani jeden reálny záber – len AI a 3D modely 📱', ['aiads', 'swappie', '3d', 'reklama'], { views: 9310, likes: 1204, comments: 87, saves: 240, shares: 131 }, { type: 'reklamy', concept: true }),
  v('ladomer-mercedes', 'ladomer', 'mercedes', 'Mercedes-AMG EQS po detailingu 🤍 Ručné umývanie, ktoré vidno.', ['detailing', 'mercedes', 'amg', 'carwash'], { views: 3150, likes: 402, comments: 21, saves: 33, shares: 18 }, { type: 'reels' }),
  v('hrajko-dlha', 'hrajko', 'reklama-dlha', 'Zase ťa niekto vytočil? Tak mu daj jednu 🥊 Stolný boxovací vak.', ['metaads', 'reklama', 'hook', 'motiongraphics'], { views: 6040, likes: 733, comments: 52, saves: 98, shares: 77 }, { type: 'reklamy' }),
  v('subway', 'subway', 'reklama', 'Dobrý deň. Na čo máš chuť? 🥪 Celá objednávka krok za krokom.', ['aiads', 'subway', 'food', 'reklama'], { views: 7480, likes: 951, comments: 64, saves: 150, shares: 92 }, { type: 'reklamy', concept: true }),
  v('belanske-1', 'belanske', 'reklama-1', 'Štyri oddelenia. Jedna adresa. 🏗️ Spišská Belá.', ['stavebniny', 'metaads', 'reklama', 'spisskabela'], { views: 2210, likes: 188, comments: 12, saves: 20, shares: 9 }, { type: 'reklamy' }),
  v('leofudaly-reel-3', 'leofudaly', 'reel-3', 'Ako to vlastne je so Supreme? 🤔 Talking-head o streetwear móde.', ['streetwear', 'supreme', 'fashion', 'reels'], { views: 4020, likes: 520, comments: 47, saves: 61, shares: 25 }, { type: 'reels' }),
  v('lomnica-walkthrough', 'lomnica', 'walkthrough', 'Prechádzka okolo hotela – plynulý pohyb kamery z jednej fotky 🏰', ['aivideo', 'imagetovideo', 'hotel', 'tatry'], { views: 3390, likes: 377, comments: 19, saves: 54, shares: 21 }, { type: 'reels' }),
  v('ladomer-promo', 'ladomer', 'promo', 'Každé auto umyté ručne. 🚗💦', ['carwash', 'detailing', 'promo', 'reels'], { views: 2560, likes: 241, comments: 15, saves: 22, shares: 13 }, { type: 'reels' }),
  v('hrajko-basketbal', 'hrajko', 'reklama-basketbal', 'Basketbal… v obývačke? 🏀 Zavesíš na dvere a hráš.', ['metaads', 'reklama', 'hrajko', 'motiongraphics'], { views: 5120, likes: 604, comments: 33, saves: 71, shares: 40 }, { type: 'reklamy' }),
  v('belanske-2', 'belanske', 'reklama-2', 'Staviate? Prerábate? Všetko na jednom mieste.', ['stavebniny', 'metaads', 'reklama'], { views: 1980, likes: 160, comments: 9, saves: 14, shares: 6 }, { type: 'reklamy' }),
  v('leofudaly-reel-1', 'leofudaly', 'reel-1', 'Draw my outfit ✏️ Nakreslíš – ušijem.', ['drawmyoutfit', 'handmade', 'fashion', 'reels'], { views: 2550, likes: 340, comments: 29, saves: 30, shares: 17 }, { type: 'reels' }),
  v('swappie-169', 'swappie', 'reklama-16x9', 'Tá istá reklama v 16:9 pre YouTube a web 🖥️', ['aiads', 'swappie', 'youtube', '16x9'], { views: 1840, likes: 205, comments: 11, saves: 40, shares: 15 }, { type: 'reklamy', concept: true, landscape: true }),
  v('lomnica-izba-1', 'lomnica', 'izba-1-zvuk', 'Izba, svetlo, atmosféra – za 7 sekúnd 🛏️', ['aivideo', 'hotel', 'izba', 'reels'], { views: 1530, likes: 142, comments: 6, saves: 18, shares: 5 }, { type: 'reels' }),
  v('ladomer-bmw', 'ladomer', 'bmw', 'BMW X7 a ručné umývanie 🫧', ['bmw', 'carwash', 'detailing'], { views: 1720, likes: 166, comments: 8, saves: 12, shares: 7 }, { type: 'reels' }),
  v('hrajko-kratka', 'hrajko', 'reklama-kratka', 'Krátka verzia na A/B test v Meta Ads ⚡', ['metaads', 'abtest', 'reklama'], { views: 2890, likes: 270, comments: 14, saves: 26, shares: 12 }, { type: 'reklamy' }),
  v('belanske-3', 'belanske', 'reklama-3', 'Prečo nakupovať u nás? Servis pre firmy aj domácich majstrov.', ['stavebniny', 'reklama'], { views: 1210, likes: 98, comments: 4, saves: 8, shares: 3 }, { type: 'reklamy' }),
  v('leofudaly-reel-2', 'leofudaly', 'reel-2', 'Šitie čiapky od látky po hotový kúsok 🧵', ['handmade', 'sewing', 'fashion', 'process'], { views: 815, likes: 102, comments: 7, saves: 9, shares: 2 }, { type: 'reels' }),
  v('lomnica-izba-2', 'lomnica', 'izba-2-zvuk', 'Druhá izba, rovnaký pocit 5* ✨', ['aivideo', 'hotel', 'reels'], { views: 1410, likes: 131, comments: 5, saves: 15, shares: 4 }, { type: 'reels' }),
  v('hrajko-short', 'hrajko', 'reklama-short', 'Zavesíš na dvere. 🏀 Short verzia.', ['metaads', 'shorts', 'reklama'], { views: 2260, likes: 214, comments: 10, saves: 19, shares: 8 }, { type: 'reklamy' }),
  v('leofudaly-reel-4', 'leofudaly', 'reel-4', 'New Era fit check 🧢', ['newera', 'streetwear', 'reels'], { views: 990, likes: 87, comments: 3, saves: 6, shares: 2 }, { type: 'reels' }),
]

export const getAccount = (key) => accounts[key]

export const formatCount = (n) => {
  if (typeof n === 'string') return n
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 10_000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n)
}
