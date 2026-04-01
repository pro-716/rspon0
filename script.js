// --- الثوابت ---
const MENU_ITEMS = [
  { id:'tea',   name:'شاي',            icon:'🍵', price:250  },
  { id:'h1',    name:'نارجيله خشب ١',  icon:'💨', price:3000 },
  { id:'h2',    name:'نارجيله خشب ٢',  icon:'💨', price:3000 },
  { id:'h3',    name:'نارجيله خشب ٣',  icon:'💨', price:3000 },
  { id:'cap',   name:'كبجسنو',          icon:'☕', price:1000 },
  { id:'tiger', name:'تايكر',           icon:'🥤', price:1250 },
  { id:'indo',  name:'إندومي',          icon:'🍜', price:1000 },
];

const ZONES_CONFIG = [
  {
    id: 'pool', label: '🎱 المنضدة', color: 'var(--c)', dotColor: '#00f5ff',
    tables: [{ id:'M1', label:'منضدة ١' }, { id:'M2', label:'منضدة ٢' }],
    types: [
      { v:'hour', sec:3600, price:4000, l:'ساعة' },
      { v:'half', sec:1800, price:2000, l:'نصف ساعة' },
      { v:'open-s', sec:-1, price:4000, l:'مفتوح مفرد' }
    ]
  },
  {
    id: 'ps', label: '🎮 بلي ستيشن', color: 'var(--p)', dotColor: '#bf00ff',
    tables: Array.from({length:7}, (_,i) => ({ id:`PS${i+1}`, label:`بلي ${i+1}` })),
    types: [{ v:'game', sec:-2, price:500, l:'كيم' }]
  },
  {
    id: 'pc', label: '💻 حاسبات', color: 'var(--g)', dotColor: '#39ff14',
    tables: Array.from({length:8}, (_,i) => ({ id:`PC${i+1}`, label:`حاسبة ${i+1}` })),
    types: [{ v:'game', sec:-2, price:1000, l:'كيم' }]
  },
  {
    id: 'food', label: '🍜 ميوز طعام', color: 'var(--am)', dotColor: '#ffaa00',
    tables: Array.from({length:5}, (_,i) => ({ id:`F${i+1}`, label:`طاولة طعام ${i+1}` })),
    types: []
  }
];

// --- الحالة العامة ---
const TS = {};
let profits = { total:0, game:0, food:0, count:0 };
let logEntries = [];
let modalTableId = null;
let pendingOrderQty = {};

// --- التشغيل الأول ---
function init() {
  ZONES_CONFIG.forEach(zone => {
    zone.tables.forEach(t => {
      TS[t.id] = { zone: zone.id, status: 'free', seconds: 0, orders: [], interval: null };
    });
  });
  buildZones();
  buildMenuPage();
  buildMenuPrices();
  updateSummary();
}

function buildZones() {
  const container = document.getElementById('zones-container');
  ZONES_CONFIG.forEach(zone => {
    const section = document.createElement('div');
    section.innerHTML = `<div class="zone-title" style="color:${zone.color}">${zone.label}</div><div class="tgrid" id="zone-${zone.id}"></div>`;
    container.appendChild(section);
    const grid = section.querySelector('.tgrid');
    zone.tables.forEach(t => {
        const card = document.createElement('div');
        card.className = 'tc';
        card.id = `tc-${t.id}`;
        card.innerHTML = `
            <div class="tc-num">${t.id}</div>
            <div class="tc-disp" id="tcd-${t.id}">--:--</div>
            <button class="tb" onclick="tcStart('${t.id}')">▶ ابدأ</button>
            <button class="tb amb" onclick="openOrderModal('${t.id}')">🍜 طلب</button>
            <button class="tb red" onclick="tcFinish('${t.id}')">⏹ إنهاء</button>
            <div id="tcord-${t.id}"></div>`;
        grid.appendChild(card);
    });
  });
}

// --- التنقل ---
function showSec(id, btn) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('visible'));
  document.getElementById(id).classList.add('visible');
  document.querySelectorAll('.nb').forEach(b => b.classList.remove('active'));
  if(btn) btn.classList.add('active');
}

function gotoTables() { showSec('tables', document.querySelectorAll('.nb')[1]); }

// --- المنطق البرمجي (المختصر) ---
function tcStart(tid) {
    const s = TS[tid];
    if(s.interval) return;
    s.status = 'busy';
    document.getElementById(`tc-${tid}`).classList.add('busy');
    s.interval = setInterval(() => {
        s.seconds++;
        document.getElementById(`tcd-${tid}`).textContent = new Date(s.seconds * 1000).toISOString().substr(11, 8);
    }, 1000);
}

function tcFinish(tid) {
    const s = TS[tid];
    clearInterval(s.interval);
    s.interval = null;
    alert(`تم إنهاء الجلسة للطاولة ${tid}`);
    // هنا يمكن إضافة منطق حساب الأرباح كما في الكود الأصلي
}

// استدعاء البداية
init();
