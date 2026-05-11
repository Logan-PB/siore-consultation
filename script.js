/* ============================================================
   SIORE DERMA — 피부 상담 로직 v4.0
   제품 데이터 / 추천 알고리즘 / AI 챗봇
============================================================ */

// ────────────────────────────────────────────────────────────
// ★ API 키 설정
// Anthropic Console(https://console.anthropic.com)에서 발급 후
// 아래 "YOUR_API_KEY_HERE" 자리에 붙여넣으세요.
// ────────────────────────────────────────────────────────────
const API_KEY = "YOUR_API_KEY_HERE";

// ────────────────────────────────────────────────────────────
// 제품 데이터
// routineOrder: 1클렌징 → 2토너 → 3앰플 → 4세럼 → 5크림
// ────────────────────────────────────────────────────────────
const PRODUCTS = {
  cleansing: {
    name: 'NMN 하이드로 캡슐 클렌징 밀크',
    short: '클렌징 밀크',
    price: 33000,
    capacity: '150ml',
    tag: '당김없는 촉촉 클렌징',
    concerns: ['건조', '민감', '트러블'],
    skins: ['건성', '민감성', '트러블성'],
    clinical: ['노폐물 99.48% 세정', '메이크업 91.59% 세정'],
    cert: ['논코메도제닉', '독일 더마테스트 EXCELLENT'],
    image: 'https://raw.githubusercontent.com/Logan-PB/-images-products-/main/cleanse.png',
    emoji: '🧴',
    routine: '클렌징',
    routineOrder: 1
  },
  bubbleToner: {
    name: 'NMN 프레쉬 버블 토너',
    short: '버블 토너',
    price: 30000,
    capacity: '145ml',
    tag: '각질정돈 + 광채 + 즉각수분',
    concerns: ['각질', '광채톤업', '건조'],
    skins: ['건성', '지성', '복합성'],
    clinical: ['피부광채 403.37% 개선', '피부수분 148.70% 증가', '피부결 10.43% 개선'],
    cert: ['독일 더마테스트 EXCELLENT'],
    image: 'https://raw.githubusercontent.com/Logan-PB/-images-products-/main/bubble-tone.png',
    emoji: '💧',
    routine: '토너 (각질정돈)',
    routineOrder: 2
  },
  essenceToner: {
    name: '데일리 릴리프 에센스 토너',
    short: '에센스 토너',
    price: 33000,
    capacity: '150ml',
    tag: '수분 136% · 자극지수 0.00 무자극',
    concerns: ['민감', '열감홍조', '건조'],
    skins: ['민감성', '건성', '복합성'],
    clinical: ['수분 136.58% 개선', '피부결 11.84% 개선', '자극지수 0.00'],
    cert: ['독일 더마테스트 EXCELLENT'],
    image: 'https://raw.githubusercontent.com/Logan-PB/-images-products-/main/essence-toner.png',
    emoji: '💧',
    routine: '토너 (진정수분)',
    routineOrder: 2
  },
  repairAmpoule: {
    name: '데일리 릴리프 리페어 앰플',
    short: '리페어 앰플',
    price: 30000,
    capacity: '30ml',
    tag: '광채 475% · 장벽회복 SOS',
    concerns: ['장벽회복', '민감', '트러블'],
    skins: ['민감성', '트러블성', '건성', '지성'],
    clinical: ['피부광채 475.98% 개선', '피부장벽 47.08% 개선', '진정 14.54% 개선'],
    cert: ['논코메도제닉', '독일 더마테스트 EXCELLENT'],
    image: 'https://raw.githubusercontent.com/Logan-PB/-images-products-/main/ampoule.png',
    emoji: '💎',
    routine: '앰플',
    routineOrder: 3
  },
  serum: {
    name: 'NMN 인텐시브 세럼',
    short: '인텐시브 세럼',
    price: 35000,
    capacity: '50ml',
    tag: '광채 564% · 주름·탄력·톤 동시케어',
    concerns: ['안티에이징', '광채톤업'],
    skins: ['건성', '지성', '복합성', '민감성'],
    clinical: ['광채 564.64% 개선', '눈가주름 9.12% 감소', '입가주름 13.6% 감소'],
    cert: ['독일 더마테스트 EXCELLENT'],
    image: 'https://raw.githubusercontent.com/Logan-PB/-images-products-/main/serum.png',
    emoji: '✨',
    routine: '세럼',
    routineOrder: 4
  },
  soothingCream: {
    name: 'NMN 하이드레이팅 수딩 크림',
    short: '수딩 크림',
    price: 27000,
    capacity: '50ml',
    tag: '즉각보습 148% · 24시간 수분지속',
    concerns: ['건조', '민감', '열감홍조'],
    skins: ['건성', '민감성', '복합성'],
    clinical: ['즉각보습 148.87% 개선', '보습지속력 56.65% 개선'],
    cert: ['독일 더마테스트 EXCELLENT'],
    image: 'https://raw.githubusercontent.com/Logan-PB/-images-products-/main/soothing-cream.png',
    emoji: '🌸',
    routine: '크림 (수분)',
    routineOrder: 5
  },
  richCream: {
    name: 'NMN 딥 글로우 리치 크림',
    short: '리치 크림',
    price: 35000,
    capacity: '50ml',
    tag: '안면리프팅 입증 · 영양+탄력+윤광',
    concerns: ['안티에이징', '건조', '광채톤업'],
    skins: ['건성'],
    clinical: ['피부보습 45.11% 증가', '리프팅 4.47% 개선', '치밀도 17.15% 증가'],
    cert: ['독일 더마테스트 EXCELLENT'],
    image: 'https://raw.githubusercontent.com/Logan-PB/-images-products-/main/rich-cream.png',
    emoji: '🌿',
    routine: '크림 (영양)',
    routineOrder: 5
  },
  soothingGel: {
    name: '데일리 릴리프 카밍 수딩 젤',
    short: '카밍 수딩 젤',
    price: 30000,
    capacity: '80ml',
    tag: '1회 보습 76% · 쿨링 진정',
    concerns: ['열감홍조', '피지', '트러블'],
    skins: ['지성', '복합성', '트러블성'],
    clinical: ['보습 76.04% 즉각개선', '피부각질 42.18% 개선'],
    cert: ['독일 더마테스트 EXCELLENT'],
    image: 'https://raw.githubusercontent.com/Logan-PB/-images-products-/main/soothing-gel.png',
    emoji: '🫧',
    routine: '젤 크림 (지성)',
    routineOrder: 5
  },
  comfortCream: {
    name: '데일리 릴리프 컴포트 크림',
    short: '컴포트 크림',
    price: 33000,
    capacity: '50ml',
    tag: '1회 보습 110% · 논코메도제닉',
    concerns: ['장벽회복', '민감', '건조', '트러블'],
    skins: ['건성', '민감성', '트러블성'],
    clinical: ['즉각보습 110.79% 증가', '피부각질 64.28% 개선', '기미색소 9.81% 개선'],
    cert: ['논코메도제닉', '독일 더마테스트 EXCELLENT'],
    image: 'https://raw.githubusercontent.com/Logan-PB/-images-products-/main/comfort-cream.png',
    emoji: '🛡️',
    routine: '크림 (장벽케어)',
    routineOrder: 5
  }
};

// ────────────────────────────────────────────────────────────
// 상태 변수
// ────────────────────────────────────────────────────────────
let selectedConcerns = [];
let selectedSkinType  = null;
let chatHistory       = [];   // Claude API 대화 히스토리

// ════════════════════════════════════════════════════════════
//  AI 챗봇 기능
// ════════════════════════════════════════════════════════════

// ── 챗봇 초기화 ──────────────────────────────────────────────
function initChat() {
  chatHistory = [];
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  msgs.innerHTML = '';
  addAiMessage('안녕하세요! 😊 시오레 제품 관련 궁금한 점을 편하게 질문해주세요.');
}

// ── 메시지 렌더링 ────────────────────────────────────────────
function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function addUserMessage(text) {
  const msgs = document.getElementById('chat-messages');
  const el   = document.createElement('div');
  el.className = 'chat-msg chat-msg-user';
  el.innerHTML = `<div class="chat-bubble chat-bubble-user">${esc(text).replace(/\n/g, '<br>')}</div>`;
  msgs.appendChild(el);
  scrollChat();
}

function addAiMessage(text) {
  const msgs = document.getElementById('chat-messages');
  const el   = document.createElement('div');
  el.className = 'chat-msg chat-msg-ai';
  el.innerHTML = `
    <div class="chat-sender-name">SIORÉ 상담사</div>
    <div class="chat-bubble chat-bubble-ai">${esc(text).replace(/\n/g, '<br>')}</div>
  `;
  msgs.appendChild(el);
  scrollChat();
}

function showLoading() {
  const msgs = document.getElementById('chat-messages');
  const el   = document.createElement('div');
  el.className = 'chat-msg chat-msg-ai';
  el.id = 'chat-loading';
  el.innerHTML = `
    <div class="chat-sender-name">SIORÉ 상담사</div>
    <div class="chat-bubble chat-bubble-ai">
      <div class="chat-loading-dots"><span></span><span></span><span></span></div>
    </div>
  `;
  msgs.appendChild(el);
  scrollChat();
}

function removeLoading() {
  const el = document.getElementById('chat-loading');
  if (el) el.remove();
}

function scrollChat() {
  const msgs = document.getElementById('chat-messages');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

// ── Claude API 호출 ──────────────────────────────────────────
async function sendChat(userMessage) {
  chatHistory.push({ role: 'user', content: userMessage });

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `당신은 시오레(SIORE) 더마 화장품 전문 약국 상담사입니다.
반드시 시오레 제품 관련 질문에만 답변하세요.
시오레와 무관한 질문은 "시오레 제품 관련 질문만 답변드릴 수 있어요 😊"라고 안내하세요.

=== 시오레 제품 정보 ===
1. NMN 하이드로 캡슐 클렌징 밀크 150ml / 33,000원
   - 논코메도제닉 인증, 독일 더마테스트 EXCELLENT
   - 노폐물 99.48% 세정, 메이크업 91.59% 세정
   - 추천: 건성·민감성·트러블 피부, 당김 심한 피부
   - 판테놀 수분 캡슐로 세안 후 당김 없이 촉촉

2. NMN 프레쉬 버블 토너 145ml / 30,000원
   - 독일 더마테스트 EXCELLENT, 자극지수 0.00
   - 피부광채 403.37% 개선, 수분 148.70% 증가, 피부결 10.43% 개선
   - 추천: 건성·지성·복합성, 각질 고민
   - 벌집구조 버블로 각질정돈 + 즉각 수분

3. NMN 인텐시브 세럼 50ml / 35,000원
   - 독일 더마테스트 EXCELLENT
   - 광채 564.64% 개선, 눈가주름 9.12% 감소, 입가주름 13.6% 감소
   - 추천: 탄력저하·잔주름·속건조·푸석한 피부
   - NMN 1% 함유, 탄력·주름·톤 동시케어

4. NMN 하이드레이팅 수딩 크림 50ml / 27,000원
   - 독일 더마테스트 EXCELLENT
   - 즉각보습 148.87% 개선, 보습지속력 56.65% 개선
   - 추천: 민감성·수분부족·열감 자주 오르는 피부
   - 세라마이드·병풀·알파리포산 함유

5. NMN 딥 글로우 리치 크림 50ml / 35,000원
   - 독일 더마테스트 EXCELLENT, 안면 전체 리프팅 입증
   - 피부보습 45.11%, 리프팅 4.47%, 치밀도 17.15% 증가
   - 추천: 건성·탄력저하·영양부족 피부
   - 나이트케어·수면팩으로도 활용 가능

6. 데일리 릴리프 에센스 토너 150ml / 33,000원
   - 독일 더마테스트 EXCELLENT, 자극지수 0.00
   - 수분 136.58% 개선, 피부결 11.84% 개선
   - 추천: 민감성·속건조·겉당김
   - 제주 감나무잎수 85%, 20가지 주의성분 무함유

7. 데일리 릴리프 리페어 앰플 30ml / 30,000원
   - 논코메도제닉 인증, 독일 더마테스트 EXCELLENT
   - 피부광채 475.98%, 피부장벽 47.08%, 진정 14.54% 개선
   - 추천: 장벽손상·예민기·피부컨디션 저하
   - 3無(무향·무색소·무알코올) 저자극

8. 데일리 릴리프 카밍 수딩 젤 80ml / 30,000원
   - 독일 더마테스트 EXCELLENT, 자극지수 0.00
   - 보습 76.04% 즉각개선, 피부각질 42.18% 개선
   - 추천: 지성·복합성·트러블·열감·홍조
   - 냉장보관 시 쿨링효과 극대화

9. 데일리 릴리프 컴포트 크림 50ml / 33,000원
   - 논코메도제닉 인증, 독일 더마테스트 EXCELLENT
   - 즉각보습 110.79%, 피부각질 64.28%, 기미색소 9.81% 개선
   - 추천: 건성·민감성·트러블·장벽케어
   - 가벼운 사용감, 속건조 해결

=== 답변 규칙 ===
- 친절하고 전문적인 약국 상담사 말투로 답변
- 피부 고민에 맞는 제품 1~3개 구체적으로 추천
- 임상 수치를 활용해서 신뢰감 있게 설명
- 사용 순서와 방법도 함께 안내
- 답변은 간결하게 5문장 이내
- 한국어로만 답변`,
      messages: chatHistory
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  const data     = await response.json();
  const aiText   = data.content[0].text;
  chatHistory.push({ role: 'assistant', content: aiText });
  return aiText;
}

// ── 메시지 전송 (버튼 클릭 / Enter 키) ──────────────────────
async function sendMessage() {
  const input   = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const text    = input.value.trim();
  if (!text) return;

  // API 키 미설정 안내
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    addAiMessage('🔑 API 키를 설정해주세요.\nscript.js 상단 const API_KEY = "YOUR_API_KEY_HERE" 부분에\n발급받은 Anthropic API 키를 입력하면 바로 사용 가능합니다.');
    return;
  }

  // 입력 초기화 + 비활성화
  input.value = '';
  input.style.height = 'auto';
  input.disabled  = true;
  sendBtn.disabled = true;

  addUserMessage(text);
  showLoading();

  try {
    const reply = await sendChat(text);
    removeLoading();
    addAiMessage(reply);
  } catch (err) {
    removeLoading();
    addAiMessage(`죄송합니다, 일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요. 🙏\n(${err.message})`);
  } finally {
    input.disabled  = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

// ════════════════════════════════════════════════════════════
//  상담 플로우 — 단계 이동
// ════════════════════════════════════════════════════════════
function goToStep(num) {
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('step' + num).classList.add('active');

  for (let i = 1; i <= 3; i++) {
    const navEl = document.getElementById('nav-' + i);
    const numEl = navEl.querySelector('.step-num');
    navEl.classList.remove('active', 'done');
    if (i < num) {
      navEl.classList.add('done');
      numEl.textContent = '✓';
    } else {
      numEl.textContent = String(i);
      if (i === num) navEl.classList.add('active');
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ════════════════════════════════════════════════════════════
//  추천 로직 — 고민 매칭 +2점 / 피부타입 매칭 +1점
// ════════════════════════════════════════════════════════════
function getRecommendations() {
  return Object.entries(PRODUCTS)
    .map(([key, p]) => {
      let score = 0;
      selectedConcerns.forEach(c => { if (p.concerns.includes(c)) score += 2; });
      if (p.skins.includes(selectedSkinType)) score += 1;
      return { key, ...p, score };
    })
    .sort((a, b) => b.score - a.score || b.price - a.price);
}

// ════════════════════════════════════════════════════════════
//  결과 화면 진입
// ════════════════════════════════════════════════════════════
function showResults() {
  const ranked  = getRecommendations();
  const mini    = ranked.slice(0, 2);
  const custom  = ranked.slice(0, 3);
  const premium = ranked.slice(0, 5);

  renderSummary();
  renderClinicalHighlights(custom);
  renderSets(mini, custom, premium);
  renderRoutine(premium);
  renderCerts(premium);
  goToStep(3);
  initChat();   // 결과 화면 진입 시 챗봇 초기화
}

// ── 요약 배너 ─────────────────────────────────────────────────
function renderSummary() {
  const chips = selectedConcerns
    .map(c => `<span class="summary-chip">${c}</span>`)
    .join('');
  document.getElementById('result-summary').innerHTML = `
    <div>
      <div class="summary-label">선택하신 피부 고민</div>
      <div class="summary-concerns">${chips}</div>
    </div>
    <div style="text-align:right;">
      <div class="summary-label">피부 타입</div>
      <div class="summary-type-text">${selectedSkinType} 피부</div>
    </div>
  `;
}

// ── 임상 하이라이트 ───────────────────────────────────────────
function parseClinical(str) {
  const match = str.match(/([\d.,]+%)/);
  return { num: match ? match[1] : '-', label: str.replace(match ? match[1] : '', '').trim() };
}

function renderClinicalHighlights(products) {
  const stats = products.map(p => {
    const { num, label } = parseClinical(p.clinical[0]);
    return `
      <div class="clinical-stat">
        <div class="stat-num">${num}</div>
        <div class="stat-label">${label}</div>
        <div class="stat-product">${p.short}</div>
      </div>`;
  }).join('');
  document.getElementById('clinical-highlights').innerHTML = `
    <div class="section-heading-bar"><span>임상 데이터 하이라이트</span></div>
    <div class="clinical-grid">${stats}</div>
  `;
}

// ── 세트 카드 ─────────────────────────────────────────────────
function won(n) { return n.toLocaleString('ko-KR') + '원'; }

function productItemHTML(p) {
  return `
    <li class="product-row">
      <div class="product-thumb-wrap">
        <img
          class="product-thumb"
          src="${p.image}"
          alt="${p.short}"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div class="product-thumb-fallback">${p.emoji}</div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.short}</div>
        <div class="product-meta">${p.capacity}</div>
        <div class="product-price">${won(p.price)}</div>
      </div>
    </li>`;
}

function setCardHTML(title, subtitle, products, featured, tierClass) {
  const sorted = [...products].sort((a, b) => a.routineOrder - b.routineOrder);
  const total  = sorted.reduce((s, p) => s + p.price, 0);
  const items  = sorted.map(p => productItemHTML(p)).join('');
  return `
    <div class="set-card ${tierClass}${featured ? ' featured' : ''}">
      <div class="set-card-head">
        <div class="set-head-top">
          <div class="set-title">${title}</div>
          ${featured ? '<span class="badge-rec">★ 추천</span>' : ''}
        </div>
        <div class="set-subtitle">${subtitle}</div>
      </div>
      <div class="set-card-body">
        <ul class="product-list">${items}</ul>
        <div class="set-total">
          <div>
            <div class="total-label">단품 합계</div>
            <div class="total-sub">약국 판매가 기준</div>
          </div>
          <div class="total-price">${won(total)}</div>
        </div>
      </div>
    </div>`;
}

function renderSets(mini, custom, premium) {
  document.getElementById('sets-row').innerHTML =
    setCardHTML('미니멈 케어 세트',     '기본 케어 · 2종', mini,    false, 'tier-basic')      +
    setCardHTML('맞춤 케어 세트',       '핵심 케어 · 3종', custom,  true,  'tier-recommended') +
    setCardHTML('프리미엄 풀케어 세트', '완벽 케어 · 5종', premium, false, 'tier-premium');
}

// ── 루틴 ──────────────────────────────────────────────────────
function renderRoutine(products) {
  const sorted = [...products].sort((a, b) => a.routineOrder - b.routineOrder);
  const steps  = sorted.map((p, i) => `
    <div class="routine-step">
      <div class="routine-img-wrap">
        <img
          class="routine-img"
          src="${p.image}"
          alt="${p.short}"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        />
        <div class="routine-img-fallback">${p.emoji}</div>
      </div>
      <div class="routine-step-no">STEP ${i + 1}</div>
      <div class="routine-step-role">${p.routine}</div>
      <div class="routine-step-short">${p.short}</div>
    </div>
    ${i < sorted.length - 1 ? '<div class="routine-arrow">→</div>' : ''}
  `).join('');
  document.getElementById('routine-section').innerHTML = `
    <div class="section-heading-bar"><span>권장 사용 루틴 (프리미엄 세트 기준)</span></div>
    <div class="routine-row">${steps}</div>
  `;
}

// ── 인증 뱃지 ────────────────────────────────────────────────
function renderCerts(products) {
  // 인증 로고 이미지만 표시 (텍스트 이름박스 없음)
  document.getElementById('cert-section').innerHTML = `
    <div class="cert-badges">
      <div class="cert-badge-img-wrap">
        <img class="cert-logo-img" src="https://raw.githubusercontent.com/Logan-PB/-images-products-/main/badge-dermatest.png"
          onerror="this.parentElement.style.display='none'"
          alt="독일 더마테스트 EXCELLENT" />
      </div>
      <div class="cert-badge-img-wrap">
        <img class="cert-logo-img" src="https://raw.githubusercontent.com/Logan-PB/-images-products-/main/badge-noncomedogenic.png"
          onerror="this.parentElement.style.display='none'"
          alt="논코메도제닉" />
      </div>
      <div class="cert-badge-img-wrap">
        <img class="cert-logo-img" src="https://raw.githubusercontent.com/Logan-PB/-images-products-/main/badge-kids.png"
          onerror="this.parentElement.style.display='none'"
          alt="KIDS 인증" />
      </div>
    </div>
  `;
}

// ── 처음으로 돌아가기 ────────────────────────────────────────
function resetAll() {
  selectedConcerns = [];
  selectedSkinType = null;
  chatHistory      = [];

  document.querySelectorAll('.concern-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('btn-to-step2').disabled = true;
  document.getElementById('btn-to-step3').disabled = true;

  goToStep(1);
}

// ════════════════════════════════════════════════════════════
//  이벤트 등록
// ════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  // ── 고민 카드 (복수 선택) ──
  document.querySelectorAll('.concern-card').forEach(card => {
    card.addEventListener('click', () => {
      const c = card.dataset.concern;
      if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        selectedConcerns = selectedConcerns.filter(x => x !== c);
      } else {
        card.classList.add('selected');
        selectedConcerns.push(c);
      }
      document.getElementById('btn-to-step2').disabled = (selectedConcerns.length === 0);
    });
  });

  // ── 피부 타입 카드 (단일 선택) ──
  document.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedSkinType = card.dataset.type;
      document.getElementById('btn-to-step3').disabled = false;
    });
  });

  // ── 단계 버튼 ──
  document.getElementById('btn-to-step2').addEventListener('click', () => goToStep(2));
  document.getElementById('btn-to-step3').addEventListener('click', showResults);

  // ── 챗봇 전송 버튼 ──
  document.getElementById('chat-send-btn').addEventListener('click', sendMessage);

  // ── 챗봇 Enter 전송 / Shift+Enter 줄바꿈 ──
  const chatInput = document.getElementById('chat-input');
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // ── textarea 자동 높이 조절 ──
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
  });
});
