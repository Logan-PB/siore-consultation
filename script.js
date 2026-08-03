/* ============================================================
   SIORE pharmacy consultation flow
   Evidence-first recommendation logic, no chatbot.
============================================================ */

let products = {};
let selectedAge = "none";
let selectedGender = "none";
let selectedConcerns = [];
let selectedSkinTypes = [];
let selectedTexture = "balanced";
let selectedSensitivity = "medium";
let languageMode = "ko";

const UI = {
  concerns: {
    "건조": { en: "Dryness", zh: "干燥", ja: "乾燥" },
    "민감": { en: "Sensitivity", zh: "敏感", ja: "敏感" },
    "열감홍조": { en: "Heat / redness", zh: "热感 / 泛红", ja: "ほてり / 赤み" },
    "안티에이징": { en: "Firmness / aging signs", zh: "弹力 / 熟龄护理", ja: "ハリ / エイジングケア" },
    "광채톤업": { en: "Radiance / tone", zh: "光泽 / 肤色", ja: "ツヤ / トーン" },
    "트러블": { en: "Blemishes", zh: "痘痘困扰", ja: "肌荒れ" },
    "피지": { en: "Sebum", zh: "油脂", ja: "皮脂" },
    "장벽회복": { en: "Barrier care", zh: "屏障修护", ja: "バリアケア" },
    "각질": { en: "Texture / dead skin", zh: "角质 / 肤理", ja: "角質 / キメ" }
  },
  skinTypes: {
    "건성": { en: "Dry", zh: "干性", ja: "乾燥肌" },
    "지성": { en: "Oily", zh: "油性", ja: "脂性肌" },
    "복합성": { en: "Combination", zh: "混合性", ja: "混合肌" },
    "민감성": { en: "Sensitive", zh: "敏感性", ja: "敏感肌" },
    "트러블성": { en: "Blemish-prone", zh: "痘痘肌", ja: "トラブル肌" }
  },
  ages: {
    none: { ko: "나이 미선택", en: "Age not selected", zh: "未选择年龄", ja: "年齢未選択" },
    "20대": { en: "20s", zh: "20多岁", ja: "20代" },
    "30대": { en: "30s", zh: "30多岁", ja: "30代" },
    "40대": { en: "40s", zh: "40多岁", ja: "40代" },
    "50대": { en: "50s", zh: "50多岁", ja: "50代" },
    "60대": { en: "60s", zh: "60多岁", ja: "60代" },
    "70대 이상": { en: "70+", zh: "70岁以上", ja: "70代以上" }
  },
  genders: {
    female: { ko: "여성", en: "Female", zh: "女性", ja: "女性" },
    male: { ko: "남성", en: "Male", zh: "男性", ja: "男性" },
    none: { ko: "선택 안 함", en: "Not selected", zh: "未选择", ja: "未選択" }
  },
  labels: {
    selectedProfile: { ko: "상담 프로필", en: "Consultation profile", zh: "咨询资料", ja: "相談プロフィール" },
    selectedConcerns: { ko: "선택 고민", en: "Selected concerns", zh: "选择的困扰", ja: "選択した悩み" },
    recommendation: { ko: "추천 루틴", en: "Recommended routine", zh: "推荐护理", ja: "おすすめルーティン" },
    analyzerTitle: { ko: "피부 분석", en: "Skin analysis", zh: "皮肤分析", ja: "肌分析" },
    analyzerCopy: {
      ko: "선택 조건을 바탕으로 수분, 장벽, 열감, 피부결, 탄력 축을 상담용으로 요약했습니다. 진단이 아닌 제품 상담 보조 지표입니다.",
      en: "The selected profile is summarized across hydration, barrier, redness, texture, and firmness. This is a consultation aid, not a diagnosis.",
      zh: "根据选择条件，将水分、屏障、泛红、肤理和弹力整理为咨询参考。这不是诊断。",
      ja: "選択条件をもとに、うるおい、バリア、赤み、キメ、ハリを相談用に整理しています。診断ではありません。"
    },
    boardTitle: { ko: "맞춤 SKU 추천표", en: "Matched SKU board", zh: "定制SKU推荐表", ja: "マッチSKU表" },
    clinicalTitle: { ko: "핵심 임상 근거", en: "Key clinical evidence", zh: "核心临床依据", ja: "主な臨床根拠" },
    evidenceTitle: { ko: "SKU별 근거 상담 카드", en: "SKU evidence cards", zh: "SKU依据咨询卡", ja: "SKU別根拠カード" },
    scriptTitle: { ko: "피부 고민과의 연결점", en: "How It Relates to Your Skin Concern", zh: "与肌肤问题的关联", ja: "肌悩みとのつながり" },
    rationaleTitle: { ko: "구성 근거 요약", en: "Set rationale", zh: "组合依据摘要", ja: "構成根拠の要約" },
    source: { ko: "출처", en: "Source", zh: "来源", ja: "出典" },
    routineTitle: { ko: "권장 사용 순서", en: "Recommended order", zh: "推荐使用顺序", ja: "推奨使用順" },
    noteTitle: { ko: "약사 상담 메모", en: "Pharmacist memo", zh: "药师咨询记录", ja: "薬剤師メモ" },
    noteCopy: {
      ko: "필수 1종에서 코어 3종, 프리미엄 4-5종으로 상담 폭을 넓히며 고객의 구매 포인트를 빠르게 잡아주세요.",
      en: "Move from Essential 1 to Core 3 and Premium 4-5 to quickly frame the client's purchase point.",
      zh: "从必选1件到核心3件、尊享4-5件，快速抓住顾客的购买理由。",
      ja: "必須1品からコア3品、プレミアム4-5品へ広げ、購入ポイントを素早く整理してください。"
    },
    specLabel: { ko: "제품 스펙", en: "Product spec", zh: "产品规格", ja: "製品スペック" },
    uspLabel: { ko: "제품의 핵심 특징", en: "Key Product Feature", zh: "产品核心特点", ja: "製品の主な特長" },
    consultTip: { ko: "이 제품을 추천하는 이유", en: "Why We Recommend This Product", zh: "推荐这款产品的理由", ja: "この製品をおすすめする理由" },
    profileAssist: {
      ko: "나이와 성별은 선택 시 추천 우선순위를 보정합니다. 미선택 시에는 피부 고민과 피부 타입을 기준으로 분석했습니다.",
      en: "Age and gender refine priority when selected. If skipped, the recommendation is based on concerns and skin type.",
      zh: "年龄和性别在选择时用于微调推荐优先级。未选择时，以肌肤困扰和肤质为主。",
      ja: "年齢と性別は選択時に優先順位を補正します。未選択の場合は悩みと肌タイプを中心に分析します。"
    },
    beforeAfter: { ko: "전후 예시", en: "Before / after", zh: "前后示例", ja: "前後例" },
    imageNote: { ko: "공식 전후 이미지 연결 예정", en: "Official before/after image slot", zh: "官方前后图待连接", ja: "公式前後画像を接続予定" }
  }
};

const PAGE_I18N = {
  brandSlogan: {
    ko: "피부에 바르는 영양제, 약국 상담을 위한 더마 루틴",
    en: "Topical nutrition for skin · pharmacy consultation routine",
    zh: "肌肤外用营养 · 药房咨询护理方案",
    ja: "肌に塗る栄養 · 薬局カウンセリングルーティン"
  },
  navBasic: { ko: "기본 정보", en: "Profile", zh: "基本信息", ja: "基本情報" },
  navSkin: { ko: "피부 상태", en: "Skin profile", zh: "肌肤状态", ja: "肌状態" },
  navResult: { ko: "추천 결과", en: "Results", zh: "推荐结果", ja: "おすすめ結果" },
  step1Title: { ko: "내담자 기본 정보와 주요 고민을 선택해주세요", en: "Select the client's profile and main skin concerns", zh: "请选择顾客的基本信息与主要肌肤困扰", ja: "お客様の基本情報と主な肌悩みを選択してください" },
  step1Desc: { ko: "나이대와 성별은 추천을 더 섬세하게 보정하는 선택 조건입니다. 선택하지 않아도 피부 고민만으로 상담을 진행할 수 있습니다.", en: "Age and gender fine-tune priority. You can continue using skin concerns alone.", zh: "年龄和性别用于微调推荐优先级。未选择时也可根据肌肤困扰继续咨询。", ja: "年齢と性別はおすすめ順位の微調整に使います。未選択でも肌悩みだけで進められます。" },
  ageTitle: { ko: "나이대", en: "Age range", zh: "年龄段", ja: "年齢層" },
  genderTitle: { ko: "성별", en: "Gender", zh: "性别", ja: "性別" },
  optionalRefine: { ko: "Optional · 선택 시 보정", en: "Optional · refines results", zh: "可选 · 用于微调", ja: "任意 · 選択時に補正" },
  notSelected: { ko: "선택 안 함", en: "Not selected", zh: "不选择", ja: "選択しない" },
  female: { ko: "여성", en: "Female", zh: "女性", ja: "女性" },
  male: { ko: "남성", en: "Male", zh: "男性", ja: "男性" },
  concernTitle: { ko: "주요 피부 고민", en: "Main skin concerns", zh: "主要肌肤困扰", ja: "主な肌悩み" },
  multiSelect: { ko: "복수 선택 가능", en: "Multiple selections", zh: "可多选", ja: "複数選択可" },
  concernDry: { ko: "수분 부족", en: "Dryness", zh: "缺水干燥", ja: "乾燥・水分不足" },
  concernSensitive: { ko: "민감", en: "Sensitivity", zh: "敏感", ja: "敏感" },
  concernRedness: { ko: "열감·홍조", en: "Heat · redness", zh: "热感·泛红", ja: "ほてり・赤み" },
  concernFirmness: { ko: "탄력 저하", en: "Firmness loss", zh: "弹力下降", ja: "ハリ低下" },
  concernRadiance: { ko: "광채·톤", en: "Radiance · tone", zh: "光泽·肤色", ja: "ツヤ・トーン" },
  concernBlemish: { ko: "트러블", en: "Blemishes", zh: "痘痘困扰", ja: "肌荒れ" },
  concernSebum: { ko: "피지", en: "Sebum", zh: "油脂", ja: "皮脂" },
  concernBarrier: { ko: "장벽 회복", en: "Barrier care", zh: "屏障修护", ja: "バリアケア" },
  concernTexture: { ko: "각질·피부결", en: "Texture · dead skin", zh: "角质·肤理", ja: "角質・キメ" },
  nextStep: { ko: "다음 단계", en: "Next", zh: "下一步", ja: "次へ" },
  step2Title: { ko: "피부 타입과 사용감을 선택해주세요", en: "Select skin type and preferred texture", zh: "请选择肤质与偏好质地", ja: "肌タイプと使用感を選択してください" },
  step2Desc: { ko: "제형 선호와 민감도는 같은 효능군 안에서 더 상담하기 쉬운 SKU를 고르는 데 사용합니다.", en: "Texture preference and sensitivity help select the easiest SKU to recommend within the same benefit group.", zh: "质地偏好与敏感度用于在同一功效组中选择更合适的产品。", ja: "使用感と敏感度は、同じ効能群の中から提案しやすいSKUを選ぶために使います。" },
  skinTypeTitle: { ko: "피부 타입", en: "Skin type", zh: "肤质", ja: "肌タイプ" },
  maxTwo: { ko: "최대 2개 선택 가능", en: "Select up to 2", zh: "最多选择2项", ja: "最大2つまで" },
  skinDry: { ko: "건성", en: "Dry", zh: "干性", ja: "乾燥肌" },
  skinDrySub: { ko: "당김과 건조감", en: "Tight and dry", zh: "紧绷与干燥", ja: "つっぱり・乾燥" },
  skinOily: { ko: "지성", en: "Oily", zh: "油性", ja: "脂性肌" },
  skinOilySub: { ko: "피지와 번들거림", en: "Sebum and shine", zh: "油脂与泛光", ja: "皮脂・テカリ" },
  skinCombo: { ko: "복합성", en: "Combination", zh: "混合性", ja: "混合肌" },
  skinComboSub: { ko: "T존 피지·볼 건조", en: "Oily T-zone · dry cheeks", zh: "T区油·两颊干", ja: "Tゾーン皮脂・頬乾燥" },
  skinSensitive: { ko: "민감성", en: "Sensitive", zh: "敏感性", ja: "敏感肌" },
  skinSensitiveSub: { ko: "자극과 예민함", en: "Reactive and delicate", zh: "易受刺激", ja: "刺激・ゆらぎ" },
  skinBlemish: { ko: "트러블성", en: "Blemish-prone", zh: "痘痘肌", ja: "トラブル肌" },
  skinBlemishSub: { ko: "여드름·잡티 고민", en: "Breakouts and spots", zh: "痘痘·瑕疵", ja: "ニキビ・肌荒れ" },
  textureTitle: { ko: "선호 제형", en: "Preferred texture", zh: "偏好质地", ja: "好みの使用感" },
  textureLight: { ko: "가벼운 제형", en: "Light", zh: "轻盈", ja: "軽い" },
  textureBalanced: { ko: "균형 제형", en: "Balanced", zh: "均衡", ja: "バランス" },
  textureRich: { ko: "보습감 높은 제형", en: "Rich moisture", zh: "滋润保湿", ja: "しっとり" },
  sensitivityTitle: { ko: "민감도", en: "Sensitivity", zh: "敏感度", ja: "敏感度" },
  levelLow: { ko: "낮음", en: "Low", zh: "低", ja: "低い" },
  levelMedium: { ko: "보통", en: "Medium", zh: "中", ja: "普通" },
  levelHigh: { ko: "높음", en: "High", zh: "高", ja: "高い" },
  previous: { ko: "이전", en: "Back", zh: "返回", ja: "戻る" },
  viewResults: { ko: "추천 결과 보기", en: "View recommendations", zh: "查看推荐结果", ja: "おすすめ結果を見る" },
  restart: { ko: "처음으로 돌아가기", en: "Start over", zh: "重新开始", ja: "最初からやり直す" },
  footerNotice: { ko: "본 추천은 취급약국 상담을 위한 참고 자료입니다. 제품별 수치와 인증 문구는 최신 근거 자료 확인 후 사용해주세요.", en: "This recommendation is a consultation aid for partner pharmacies. Verify current product data and claims before use.", zh: "本推荐仅供合作药房咨询参考。使用前请确认最新产品数据与认证说明。", ja: "本おすすめは取扱薬局での相談用参考資料です。使用前に最新の製品データと表示をご確認ください。" }
};

function applyPageLanguage() {
  document.documentElement.lang = languageMode === "zh" ? "zh-CN" : languageMode;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const copy = PAGE_I18N[element.dataset.i18n];
    if (!copy?.[languageMode]) return;
    if (languageMode === "ko") {
      element.textContent = copy.ko;
      return;
    }
    element.innerHTML = `<span class="i18n-main">${copy[languageMode]}</span><span class="i18n-ko">${copy.ko}</span>`;
  });
}

async function loadProducts() {
  if (window.SIORE_PRODUCTS) {
    products = window.SIORE_PRODUCTS;
    return;
  }
  const response = await fetch("data/products.json?v=20260723-clinical", { cache: "no-store" });
  if (!response.ok) throw new Error("제품 데이터를 불러오지 못했습니다.");
  products = await response.json();
}

function langText(mapOrKo) {
  if (typeof mapOrKo === "string") return mapOrKo;
  if (languageMode === "ko") return mapOrKo.ko || "";
  const translated = mapOrKo[languageMode] || "";
  return `<span class="i18n-main">${translated}</span><span class="i18n-ko">${mapOrKo.ko || ""}</span>`;
}

function translatedValue(group, value) {
  const translated = UI[group][value]?.[languageMode];
  if (languageMode === "ko" || !translated) return value;
  return `<span class="i18n-main">${translated}</span><span class="i18n-ko">${value}</span>`;
}

function translatedGender(value) {
  return langText(UI.genders[value] || UI.genders.none);
}

function selectedAgeText() {
  if (!selectedAge || selectedAge === "none") return langText(UI.ages.none);
  return translatedValue("ages", selectedAge);
}

function productName(product) {
  const translated = product.i18n?.[languageMode]?.name;
  if (languageMode === "ko" || !translated) return product.short;
  return `<span class="i18n-main">${translated}</span><span class="i18n-ko">${product.short}</span>`;
}

function productBenefit(product) {
  const translated = product.i18n?.[languageMode]?.benefit;
  if (languageMode === "ko" || !translated) return product.benefit;
  return `<span class="i18n-main">${translated}</span><span class="i18n-ko">${product.benefit}</span>`;
}

function productClinical(product) {
  const translated = product.i18n?.[languageMode]?.clinical;
  if (languageMode === "ko" || !Array.isArray(translated) || !translated.length) return product.clinical || [];
  return translated;
}

function productSpecText(product) {
  return `${product.capacity} · ${product.routine} · ${product.tag}`;
}

function consumerTip(product) {
  const clinical = productClinical(product)[0] || product.usp;
  const benefit = product.i18n?.[languageMode]?.benefit || product.benefit;
  return langText({
    ko: `현재 피부 고민에는 “${product.usp}”에 초점을 둔 관리가 도움이 될 수 있습니다. ${clinical}로 확인된 제품 특성을 바탕으로, 일상적인 피부 관리에 적합한 제품으로 추천드립니다.`,
    en: `This product was selected for its fit with your current skin concern. ${benefit} Its key features make it a considered choice for a comfortable, consistent daily routine.`,
    zh: `这款产品根据您当前的肌肤问题而推荐。${benefit} 其核心特点适合融入舒适且持续的日常护理。`,
    ja: `現在の肌悩みとの相性を考えて選定した製品です。${benefit} 毎日の心地よいお手入れに取り入れやすい製品としておすすめします。`
  });
}

function goToStep(num) {
  document.querySelectorAll(".step-panel").forEach((panel) => panel.classList.remove("active"));
  document.getElementById("step" + num).classList.add("active");

  for (let i = 1; i <= 3; i += 1) {
    const navEl = document.getElementById("nav-" + i);
    const numEl = navEl.querySelector(".step-num");
    navEl.classList.remove("active", "done");
    if (i < num) {
      navEl.classList.add("done");
      numEl.textContent = "✓";
    } else {
      numEl.textContent = String(i);
      if (i === num) navEl.classList.add("active");
    }
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function productMatches(product, concerns) {
  return concerns.some((concern) => product.concerns.includes(concern));
}

function ageScore(product) {
  const concerns = product.concerns || [];
  let score = 0;
  if (selectedAge === "20대") {
    if (productMatches(product, ["피지", "트러블", "열감홍조"])) score += 0.7;
    if (product.routineGroup === "moisturizer" && product.key === "richCream") score -= 0.4;
  }
  if (selectedAge === "30대") {
    if (productMatches(product, ["건조", "광채톤업", "안티에이징"])) score += 0.45;
  }
  if (selectedAge === "40대") {
    if (productMatches(product, ["안티에이징", "장벽회복", "광채톤업"])) score += 0.75;
  }
  if (selectedAge === "50대" || selectedAge === "60대" || selectedAge === "70대 이상") {
    if (productMatches(product, ["건조", "장벽회복", "안티에이징"])) score += 0.9;
    if (product.routineGroup === "moisturizer") score += 0.25;
  }
  if (selectedAge === "70대 이상" && concerns.includes("민감")) score += 0.25;
  return score;
}

function genderScore(product) {
  if (selectedGender === "male") {
    if (productMatches(product, ["피지", "열감홍조", "트러블"])) return 0.35;
    if (product.routineGroup === "cleanser") return 0.2;
  }
  if (selectedGender === "female") {
    if (productMatches(product, ["광채톤업", "안티에이징", "건조"])) return 0.25;
  }
  return 0;
}

function textureScore(product) {
  if (selectedTexture === "light") {
    if (["gel", "serum", "ampoule", "toner"].includes(product.role)) return 0.35;
    if (product.key === "richCream") return -0.5;
  }
  if (selectedTexture === "rich") {
    if (product.routineGroup === "moisturizer") return 0.35;
    if (product.key === "soothingGel") return -0.25;
  }
  return 0;
}

function sensitivityScore(product) {
  if (selectedSensitivity !== "high") return 0;
  const dailyRelief = product.name.includes("데일리 릴리프");
  if (dailyRelief || product.concerns.includes("민감") || product.concerns.includes("장벽회복")) return 0.55;
  return 0;
}

function getRecommendations() {
  return Object.entries(products)
    .filter(([, product]) => product.active !== false)
    .map(([key, product]) => {
      let score = 0;
      selectedConcerns.forEach((concern) => {
        if (product.concerns.includes(concern)) score += 2;
      });
      selectedSkinTypes.forEach((type) => {
        if (product.skins.includes(type)) score += 1.15;
      });
      if (product.routineGroup === "toner" && selectedConcerns.includes("각질") && key === "bubbleToner") score += 0.5;
      score += ageScore({ key, ...product });
      score += genderScore({ key, ...product });
      score += textureScore({ key, ...product });
      score += sensitivityScore({ key, ...product });
      return { key, ...product, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.routineOrder - b.routineOrder || b.price - a.price;
    });
}

function selectBalanced(ranked, size, maxByGroup) {
  const selected = [];
  const counts = {};
  ranked.forEach((product) => {
    const group = product.routineGroup || product.role;
    const limit = maxByGroup[group] ?? 1;
    if (selected.length < size && (counts[group] || 0) < limit) {
      selected.push(product);
      counts[group] = (counts[group] || 0) + 1;
    }
  });
  ranked.forEach((product) => {
    if (selected.length < size && !selected.some((item) => item.key === product.key)) selected.push(product);
  });
  return selected.slice(0, size);
}

function buildSets(ranked) {
  return {
    essential1: ranked.slice(0, 1),
    core3: selectBalanced(ranked, 3, { cleanser: 1, toner: 1, treatment: 1, moisturizer: 1 }),
    premium4: selectBalanced(ranked, 4, { cleanser: 1, toner: 1, treatment: 1, moisturizer: 1 }),
    premium5: selectBalanced(ranked, 5, { cleanser: 1, toner: 1, treatment: 2, moisturizer: 1 })
  };
}

function needsPremium5() {
  const highCareConcerns = ["안티에이징", "장벽회복", "트러블", "광채톤업"];
  const highCareSkinTypes = ["건성", "민감성", "트러블성"];
  const matureAges = ["40대", "50대", "60대", "70대 이상"];

  return (
    selectedConcerns.length >= 3 ||
    selectedConcerns.some((concern) => highCareConcerns.includes(concern)) ||
    selectedSkinTypes.some((type) => highCareSkinTypes.includes(type)) ||
    matureAges.includes(selectedAge)
  );
}

function selectedPremiumSet(sets) {
  return needsPremium5()
    ? { title: "프리미엄 5종", subtitle: "타입 맞춤 집중 풀 루틴", items: sets.premium5, tier: "premium5" }
    : { title: "프리미엄 4종", subtitle: "체감 포인트를 넓힌 업셀링 구성", items: sets.premium4, tier: "premium4" };
}

function showResults() {
  const ranked = getRecommendations();
  const sets = buildSets(ranked);
  const premium = selectedPremiumSet(sets);
  renderSummary();
  renderAnalyzer(sets.core3);
  renderRecommendationBoard(sets.core3);
  renderClinicalHighlights(sets.core3);
  renderSets(sets, premium);
  renderEvidence(sets.core3);
  renderConsultationScripts(sets, premium);
  renderRoutine(premium.items);
  renderCerts();
  goToStep(3);
}

function renderSummary() {
  const chips = selectedConcerns
    .map((c) => `<span class="summary-chip">${translatedValue("concerns", c)}</span>`)
    .join("");
  document.getElementById("result-summary").innerHTML = `
    <div>
      <div class="summary-label">${langText(UI.labels.selectedProfile)}</div>
      <div class="summary-profile">
        <span>${selectedAgeText()}</span>
        <span>${translatedGender(selectedGender)}</span>
        ${selectedSkinTypes.map((type) => `<span>${translatedValue("skinTypes", type)}</span>`).join("")}
      </div>
      <p class="summary-assist">${langText(UI.labels.profileAssist)}</p>
    </div>
    <div>
      <div class="summary-label">${langText(UI.labels.selectedConcerns)}</div>
      <div class="summary-concerns">${chips}</div>
    </div>
  `;
}

function metricValue(metric) {
  let value = 52;
  if (metric === "수분" && selectedConcerns.includes("건조")) value -= 18;
  if (metric === "장벽" && selectedConcerns.includes("장벽회복")) value -= 16;
  if (metric === "열감" && selectedConcerns.includes("열감홍조")) value += 22;
  if (metric === "피부결" && selectedConcerns.includes("각질")) value -= 14;
  if (metric === "탄력" && selectedConcerns.includes("안티에이징")) value -= 17;
  if (selectedAge === "50대" || selectedAge === "60대" || selectedAge === "70대 이상") {
    if (["수분", "장벽", "탄력"].includes(metric)) value -= 7;
  }
  if (selectedSkinTypes.includes("민감성") && metric === "장벽") value -= 8;
  if (selectedSkinTypes.includes("지성") && metric === "열감") value += 5;
  return Math.max(22, Math.min(86, value));
}

function renderAnalyzer(items) {
  const markers = selectedConcerns.map((concern) => `<span>${translatedValue("concerns", concern)}</span>`).join("");
  const metricIcons = { "수분": "💧", "장벽": "🛡️", "열감": "🌡️", "피부결": "✨", "탄력": "🫧" };
  const metricRows = ["수분", "장벽", "열감", "피부결", "탄력"].map((metric) => {
    const value = metricValue(metric);
    return `
      <div class="metric-row">
        <span class="metric-label"><span class="metric-icon" aria-hidden="true">${metricIcons[metric]}</span><span>${metric}</span></span>
        <div class="metric-track"><i style="width:${value}%"></i></div>
        <b>${value}%</b>
      </div>`;
  }).join("");
  document.getElementById("analysis-section").innerHTML = `
    <div class="analysis-visual">
      <img src="images/skin-analysis-model.png" alt="Skin analysis model">
      <div class="face-pin pin-forehead">수분</div>
      <div class="face-pin pin-cheek">장벽</div>
      <div class="face-pin pin-jaw">탄력</div>
    </div>
    <div class="analysis-copy">
      <div class="section-heading-bar"><span>${langText(UI.labels.analyzerTitle)}</span></div>
      <p>${langText(UI.labels.analyzerCopy)}</p>
      <div class="analysis-markers">${markers}</div>
      <div class="metric-card">${metricRows}</div>
    </div>
  `;
}

function renderRecommendationBoard(items) {
  const [topProduct, ...secondary] = items;
  const secondaryCards = secondary.map((product, index) => `
    <article class="best-secondary-card">
      <div class="best-rank">BEST ${index + 2}</div>
      <div class="best-secondary-image">
        <img src="${product.image}" alt="${product.short}" onerror="this.style.display='none'">
      </div>
      <div class="best-product-copy">
        <strong>${productName(product)}</strong>
        <span>${product.capacity} · ${product.routine}</span>
        <p>${productBenefit(product)}</p>
        <em>${productClinical(product)[0] || product.usp}</em>
      </div>
    </article>
  `).join("");
  document.getElementById("recommendation-board").innerHTML = `
    <div class="best-board-head">
      <div class="section-heading-bar"><span>${langText({ ko: "피부 고민 맞춤 BEST 3", en: "Top 3 for Your Skin Concern", zh: "肌肤问题定制 BEST 3", ja: "肌悩み別 BEST 3" })}</span></div>
      <p>${langText({ ko: "선택하신 고민과의 제품 적합도 순위입니다. 사용 순서가 아닙니다.", en: "Ranked by fit for your selected concern, not by application order.", zh: "按与所选肌肤问题的匹配度排序，并非使用顺序。", ja: "選択した肌悩みとの適合度順で、使用順ではありません。" })}</p>
    </div>
    ${topProduct ? `
      <article class="best-hero-card">
        <div class="best-hero-image">
          <img src="${topProduct.image}" alt="${topProduct.short}" onerror="this.style.display='none'">
        </div>
        <div class="best-product-copy">
          <div class="best-rank one-pick">BEST 1 · ONE PICK</div>
          <strong>${productName(topProduct)}</strong>
          <span>${topProduct.capacity} · ${topProduct.routine}</span>
          <p>${productBenefit(topProduct)}</p>
          <em>${productClinical(topProduct)[0] || topProduct.usp}</em>
        </div>
      </article>
    ` : ""}
    <div class="best-secondary-grid">${secondaryCards}</div>
  `;
}

function parseClinical(str) {
  const match = str.match(/[\d.,]+(?:%|℃)/);
  return { num: match ? match[0] : "근거", label: str.replace(match ? match[0] : "", "").trim() };
}

function renderClinicalHighlights(items) {
  const stats = items.map((product) => {
    const { num, label } = parseClinical(productClinical(product)[0] || product.usp);
    return `
      <div class="clinical-stat">
        <div class="stat-num">${num}</div>
        <div class="stat-label">${label || product.usp}</div>
        <div class="stat-product">${product.short}</div>
      </div>`;
  }).join("");
  document.getElementById("clinical-highlights").innerHTML = `
    <div class="section-heading-bar"><span>${langText(UI.labels.clinicalTitle)}</span></div>
    <div class="clinical-grid">${stats}</div>
  `;
}

function won(n) {
  return n.toLocaleString("ko-KR") + "원";
}

function mallPrice(product) {
  return product.mallPrice || product.price;
}

function discountAmount(product) {
  return Math.max(0, mallPrice(product) - product.price);
}

function priceCompareHTML(product, mode = "default") {
  const compact = mode === "compact";
  return `
    <div class="price-compare ${compact ? "compact" : ""}">
      <div class="price-line consumer"><span>소비자가</span><strong>${won(mallPrice(product))}</strong></div>
    </div>
  `;
}

function productItemHTML(product) {
  return `
    <li class="product-row">
      <div class="product-thumb-wrap">
        <img class="product-thumb" src="${product.image}" alt="${product.short}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="product-thumb-fallback">${product.emoji}</div>
      </div>
      <div class="product-info">
        <div class="product-name">${productName(product)}</div>
        <div class="product-meta">${product.capacity} · ${product.routine}</div>
        <div class="product-usp">${product.usp}</div>
      </div>
    </li>`;
}

function productReason(product) {
  const evidence = productClinical(product)[0] || product.usp;
  return `${product.short}: ${product.routine} 단계 핵심 · ${evidence}`;
}

function setReason(items, tier = "core3") {
  const topEvidence = items.map((product) => productClinical(product)[0]).filter(Boolean).slice(0, 2).join(" / ");
  const names = items.map((product) => product.short).join(", ");
  const map = {
    essential1: {
      ko: `필수 1종은 ${names} 중심으로 고객의 가장 큰 고민을 먼저 잡는 입문 구매 포인트입니다. ${topEvidence}`,
      en: `Essential 1 starts with ${names}, the simplest entry point for the client's top concern. ${topEvidence}`,
      zh: `必选1件以 ${names} 为核心，先抓住顾客最主要的购买理由。${topEvidence}`,
      ja: `必須1品は ${names} を中心に、最初の購入ポイントを明確にします。${topEvidence}`
    },
    core3: {
      ko: `코어 3종은 세안·흡수·마무리 루틴이 연결되어 단품보다 체감 포인트가 넓어집니다. ${topEvidence}`,
      en: `Core 3 connects cleansing, absorption, and finishing care, creating more visible value than a single SKU. ${topEvidence}`,
      zh: `核心3件连接清洁、吸收和收尾护理，比单品更容易体现购买价值。${topEvidence}`,
      ja: `コア3品は洗顔・吸収・仕上げをつなげ、単品より体感ポイントを広げます。${topEvidence}`
    },
    premium4: {
      ko: `4종은 기본 루틴보다 수분·장벽·피부결 체감 포인트가 넓어져 업셀링하기 좋습니다. ${topEvidence}`,
      en: `The 4-piece set broadens hydration, barrier, and texture care, making the upgrade easier to explain. ${topEvidence}`,
      zh: `4件套可扩大水分、屏障和肤理护理点，更适合升级推荐。${topEvidence}`,
      ja: `4点セットはうるおい・バリア・キメの体感ポイントが広がり、アップセルしやすい構成です。${topEvidence}`
    },
    premium5: {
      ko: `5종은 아침·저녁 루틴 완성도가 높아 “제대로 관리해보고 싶은 고객”에게 구매 설득력이 큽니다. ${topEvidence}`,
      en: `The 5-piece set completes the full routine and works well for clients ready for serious daily care. ${topEvidence}`,
      zh: `5件套可完整覆盖早晚护理，更适合想认真管理肌肤的顾客。${topEvidence}`,
      ja: `5点セットは朝夜のルーティン完成度が高く、本格ケアしたい方に提案しやすい構成です。${topEvidence}`
    }
  };
  return langText(map[tier] || map.core3);
}

function setCardHTML(title, subtitle, items, featured, tierClass, tier = "core3") {
  const sorted = [...items].sort((a, b) => a.routineOrder - b.routineOrder);
  const rows = sorted.map((product) => productItemHTML(product)).join("");
  return `
    <div class="set-card ${tierClass}${featured ? " featured" : ""}">
      <div class="set-card-head">
        <div class="set-head-top">
          <div class="set-title">${title}</div>
          ${featured ? '<span class="badge-rec">추천</span>' : ""}
        </div>
        <div class="set-subtitle">${subtitle}</div>
      </div>
      <div class="set-card-body">
        <ul class="product-list">${rows}</ul>
        <div class="set-rationale">
          <strong>${langText(UI.labels.rationaleTitle)}</strong>
          <span>${setReason(sorted, tier)}</span>
        </div>
      </div>
    </div>`;
}

function renderSets(sets, premium) {
  document.getElementById("sets-row").innerHTML =
    setCardHTML("필수 1종", "가장 큰 고민을 먼저 잡는 입문 선택", sets.essential1, false, "tier-essential", "essential1") +
    setCardHTML("코어 3종", "상담 전환이 쉬운 기본 루틴 구성", sets.core3, true, "tier-recommended", "core3") +
    setCardHTML(premium.title, premium.subtitle, premium.items, false, "tier-premium", premium.tier);
}

function renderEvidence(items) {
  const evidenceItems = items.filter((product) => product.clinical?.length);
  const cards = evidenceItems.map((product) => `
    <article class="evidence-card">
      ${product.clinicalImage ? `<div class="evidence-media">
        <img class="clinical-proof-img" src="${product.clinicalImage}" alt="${product.short} 주요 임상 이미지">
      </div>` : ""}
      <div class="evidence-body">
        <div class="evidence-role">${product.routine}</div>
        <h3>${productName(product)}</h3>
        <div class="evidence-specs">
          <span>${product.capacity} · ${product.routine}</span>
          <span>${product.tag}</span>
        </div>
        <p class="evidence-benefit">${productBenefit(product)}</p>
        <div class="evidence-usp">
          <strong>${langText(UI.labels.uspLabel)}</strong>
          <span>${product.usp}</span>
        </div>
        <ul>
          ${productClinical(product).slice(0, 9).map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <div class="consumer-tip">
          <strong>${langText(UI.labels.consultTip)}</strong>
          <span>${consumerTip(product)}</span>
        </div>
        ${product.clinicalImage ? `<p class="image-note">주요 임상 이미지 · 상세페이지/임상자료 기반</p>` : ""}
        <p class="source-note">${langText(UI.labels.source)}: ${product.source}</p>
      </div>
    </article>
  `).join("");

  document.getElementById("evidence-section").innerHTML = `
    <div class="section-heading-bar"><span>${langText(UI.labels.evidenceTitle)}</span></div>
    <div class="evidence-grid">${cards}</div>
  `;
}

function renderConsultationScripts(sets, premium) {
  const cards = [
    { title: "필수 1종", items: sets.essential1, tier: "essential1" },
    { title: "코어 3종", items: sets.core3, tier: "core3" },
    { title: premium.title, items: premium.items, tier: premium.tier }
  ];

  document.getElementById("consultation-script-section").innerHTML = `
    <div class="section-heading-bar"><span>${langText(UI.labels.scriptTitle)}</span></div>
    <div class="script-grid">
      ${cards.map((item) => `
        <article class="script-card">
          <div class="script-card-head">
            <h3>${item.title}</h3>
            <p>${setReason(item.items, item.tier)}</p>
          </div>
          <ul>
            ${item.items.slice(0, 4).map((product) => `
              <li>
                <strong>${product.short}</strong>
                <span>${productReason(product)}</span>
                <em>${consumerTip(product)}</em>
              </li>
            `).join("")}
          </ul>
        </article>
      `).join("")}
    </div>
  `;
}

function renderRoutine(items) {
  const sorted = [...items].sort((a, b) => a.routineOrder - b.routineOrder);
  const steps = sorted.map((product, index) => `
    <div class="routine-step">
      <div class="routine-img-wrap">
        <img class="routine-img" src="${product.image}" alt="${product.short}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="routine-img-fallback">${product.emoji}</div>
      </div>
      <div class="routine-step-no">STEP ${index + 1}</div>
      <div class="routine-step-role">${product.routine}</div>
      <div class="routine-step-short">${productName(product)}</div>
    </div>
    ${index < sorted.length - 1 ? '<div class="routine-arrow">›</div>' : ""}
  `).join("");
  document.getElementById("routine-section").innerHTML = `
    <div class="section-heading-bar"><span>${langText(UI.labels.routineTitle)}</span></div>
    <div class="routine-row">${steps}</div>
  `;
}

function renderCerts() {
  document.getElementById("cert-section").innerHTML = `
    <div class="cert-copy">
      <strong>${langText(UI.labels.noteTitle)}</strong>
      <span>${langText(UI.labels.noteCopy)}</span>
    </div>
    <div class="cert-badges">
      <div class="memo-chip">필수·코어·프리미엄 선택</div>
      <div class="memo-chip">나이·성별 보조 반영</div>
      <div class="memo-chip">근거 수치 확인</div>
    </div>
  `;
}

function resetAll() {
  selectedAge = "none";
  selectedGender = "none";
  selectedConcerns = [];
  selectedSkinTypes = [];
  selectedTexture = "balanced";
  selectedSensitivity = "medium";

  document.querySelectorAll(".concern-card, .type-card, #age-options button").forEach((card) => card.classList.remove("selected"));
  selectSegment("#age-options", "age", "none");
  selectSegment("#gender-options", "gender", "none");
  selectSegment("#texture-options", "texture", "balanced");
  selectSegment("#sensitivity-options", "sensitivity", "medium");
  document.getElementById("btn-to-step2").disabled = true;
  document.getElementById("btn-to-step3").disabled = true;
  goToStep(1);
}

function selectSegment(parentSelector, dataKey, value) {
  const buttons = document.querySelectorAll(`${parentSelector} button`);
  buttons.forEach((button) => button.classList.toggle("selected", button.dataset[dataKey] === value));
}

function bindSegment(parentSelector, dataKey, callback) {
  document.querySelectorAll(`${parentSelector} button`).forEach((button) => {
    button.addEventListener("click", () => {
      callback(button.dataset[dataKey]);
      selectSegment(parentSelector, dataKey, button.dataset[dataKey]);
    });
  });
}

function updateStep1Ready() {
  document.getElementById("btn-to-step2").disabled = selectedConcerns.length === 0;
}

function syncLanguageButtons() {
  document.querySelectorAll(".language-option").forEach((item) => {
    item.classList.toggle("active", item.dataset.lang === languageMode);
  });
}

function bindEvents() {
  document.querySelectorAll(".language-option").forEach((button) => {
    button.addEventListener("click", () => {
      languageMode = button.dataset.lang;
      syncLanguageButtons();
      applyPageLanguage();
      if (document.getElementById("step3").classList.contains("active")) showResults();
    });
  });

  bindSegment("#age-options", "age", (value) => {
    selectedAge = value;
    updateStep1Ready();
  });
  bindSegment("#gender-options", "gender", (value) => {
    selectedGender = value;
  });
  bindSegment("#texture-options", "texture", (value) => {
    selectedTexture = value;
  });
  bindSegment("#sensitivity-options", "sensitivity", (value) => {
    selectedSensitivity = value;
  });

  document.querySelectorAll(".concern-card").forEach((card) => {
    card.addEventListener("click", () => {
      const concern = card.dataset.concern;
      if (card.classList.contains("selected")) {
        card.classList.remove("selected");
        selectedConcerns = selectedConcerns.filter((item) => item !== concern);
      } else {
        card.classList.add("selected");
        selectedConcerns.push(concern);
      }
      updateStep1Ready();
    });
  });

  document.querySelectorAll(".type-card").forEach((card) => {
    card.addEventListener("click", () => {
      const type = card.dataset.type;
      if (card.classList.contains("selected")) {
        card.classList.remove("selected");
        selectedSkinTypes = selectedSkinTypes.filter((item) => item !== type);
      } else {
        if (selectedSkinTypes.length >= 2) {
          const removed = selectedSkinTypes.shift();
          document.querySelector(`.type-card[data-type="${removed}"]`)?.classList.remove("selected");
        }
        card.classList.add("selected");
        selectedSkinTypes.push(type);
      }
      document.getElementById("btn-to-step3").disabled = selectedSkinTypes.length === 0;
    });
  });

  document.getElementById("btn-to-step2").addEventListener("click", () => goToStep(2));
  document.getElementById("btn-to-step3").addEventListener("click", showResults);
}

function syncStickyHeaderOffset() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  document.documentElement.style.setProperty("--sticky-header-height", `${Math.ceil(header.getBoundingClientRect().height)}px`);
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await loadProducts();
    bindEvents();
    applyPageLanguage();
    syncStickyHeaderOffset();
    window.addEventListener("resize", syncStickyHeaderOffset, { passive: true });
    new ResizeObserver(syncStickyHeaderOffset).observe(document.querySelector(".site-header"));
  } catch (error) {
    document.querySelector(".wrapper").innerHTML = `
      <section class="step-panel active">
        <div class="panel-header">
          <h2>제품 데이터를 불러오지 못했습니다</h2>
          <p>${error.message}</p>
        </div>
      </section>
    `;
  }
});
