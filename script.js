// ==========================================
// محرك تحليل الكاليستوينكس الذكي (AI Calisthenics Engine)
// تحديد المهارة وبناء الخطة تلقائياً 100%
// ==========================================

let editingPlanId = null;

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
  const statusEl = document.getElementById('connectionStatus');
  if (!statusEl) return;
  statusEl.className = 'status-online';
  statusEl.innerText = '🤖 محرك التحليل الذكي جاهز ومحلي بالكامل';
}

let isMusicPlaying = false;
function toggleBackgroundMusic() {
  const audio = document.getElementById('bgMusic');
  const text = document.getElementById('musicText');
  if (!audio) return;

  if (isMusicPlaying) {
    audio.pause();
    if (text) text.innerText = 'تشغيل الموسيقى';
  } else {
    audio.play().catch(e => console.log('التشغيل الصوتي يتطلب تفاعل المستخدم:', e));
    if (text) text.innerText = 'إيقاف الموسيقى';
  }
  isMusicPlaying = !isMusicPlaying;
}

document.addEventListener('DOMContentLoaded', () => {
  updateOnlineStatus();
  renderSavedPlansList();
});

// ==========================================
// محرك تحليل البيانات وتوليد الخطة
// ==========================================
function generateAndSavePlan() {
  const nameInput = document.getElementById('clientName');
  if (!nameInput || !nameInput.value.trim()) {
    alert('يرجى إدخال اسم المتدرب أولاً!');
    return;
  }

  const name = nameInput.value.trim();
  const age = parseFloat(document.getElementById('clientAge')?.value) || 20;
  const weight = parseFloat(document.getElementById('clientWeight')?.value) || 70;
  const height = parseFloat(document.getElementById('clientHeight')?.value) || 170;

  // اختبارات القوة
  const pullups = parseFloat(document.getElementById('pullups')?.value) || 0;
  const dips = parseFloat(document.getElementById('dips')?.value) || 0;
  const pushups = parseFloat(document.getElementById('pushups')?.value) || 0;
  const squats = parseFloat(document.getElementById('squats')?.value) || 0;
  const plank = parseFloat(document.getElementById('plank')?.value) || 0;
  const hollow = parseFloat(document.getElementById('hollow')?.value) || 0;
  const superman = parseFloat(document.getElementById('superman')?.value) || 0;
  const hang = parseFloat(document.getElementById('hang')?.value) || 0;

  // 1. حساب مؤشر كتلة الجسم (BMI) ومعامل الشدة الذكي
  const bmi = weight / ((height / 100) * (height / 100));
  let intensity = 1.0;
  if (bmi > 25) intensity -= 0.1;
  if (age > 35) intensity -= 0.1;

  // 2. خوارزمية الذكاء الاصطناعي لتحديد المهارة والمسار المناسب تلقائياً
  let detectedSkill = "";
  let aiReasoning = "";
  let skillExercises = [];

  if (pullups < 3 || dips < 4 || hang < 20) {
    // المستوى 1: تأسيس وتجهيز
    detectedSkill = "تأسيس التعلق وسحب الكتف (Scapular Prep)";
    aiReasoning = "بناءً على أرقام القوة الأساسية، يحتاج المتدرب لبناء قاعدة استقرار للأوتار والأكتاف قبل البدء بالمهارات المركبة.";
    skillExercises = [
      `1. تعلق نشط وسحب لوحي الكتف: 3 × 10 ثوانٍ`,
      `2. سحب أسترالي بزاوية مائلة: 3 × 8-10 عدات`,
      `3. بلانك على السواعد: 3 × ${plank > 0 ? plank : '20'} ثانية`
    ];
  } else if (pullups >= 12 && dips >= 15 && plank >= 45 && hollow >= 30) {
    // المستوى 4: مهارات متقدمة
    detectedSkill = "التطوير المتقدم (Tuck Planche / Front Lever)";
    aiReasoning = "تمتلك مستويات قوة ممتازة في الدفع والسحب والجذع، مؤهلة لبدء مهارات الثبات المتقدمة.";
    skillExercises = [
      `1. محاولات Tuck Planche / Tuck Front Lever: 4 × 5-8 ثوانٍ`,
      `2. ضغط بايك متقدم (Pike Pushups): 3 × 8 عدات`,
      `3. ثبات هولو بودي مشدود: 3 × ${hollow} ثانية`
    ];
  } else if (dips >= 8 && pushups >= 15 && plank >= 30) {
    // المستوى 2/3: ثبات المتوازي والدفع
    detectedSkill = "مهارة ثبات المتوازي (L-Sit)";
    aiReasoning = "بناءً على التوازن الممتاز في عضلات الدفع والجذع، المهارة المثالية للتطور هي L-Sit.";
    skillExercises = [
      `1. رفع الركبتين على المتوازي مع ثبات علوي: 4 × 8-10 ثوانٍ`,
      `2. ضغط بايك للكتف: 3 × 8 عدات`,
      `3. ثبات L-Sit بمساعدة الأرجل: 3 × 10 ثوانٍ`
    ];
  } else {
    // المستوى الافتراضي: توازن الهاندستاند
    detectedSkill = "مهارة الاتزان الوقوف على اليدين (Handstand)";
    aiReasoning = "المستوى البدني متوازن ويسمح ببدء مهارات التوازن والتحكم العالي للكتف واليدين.";
    skillExercises = [
      `1. هاندستاند على الحائط (بطن للجدار): 3 × ${Math.max(12, Math.round(20 * intensity))} ثانية`,
      `2. نقل الوزن بين اليدين (Handstand Taps): 3 × 15 ثانية`,
      `3. محاولات الدخول الصريح للهاندستاند: 4 محاولات`
    ];
  }

  // 3. بناء قسم القوة والبناء
  let strengthExercises = [];
  if (pullups < 5) {
    strengthExercises.push(`1. عقلة سلبية (نزول بطيء 5 ثوانٍ): 3 × 3`);
    strengthExercises.push(`2. سحب أسترالي: 3 × 10 عدات`);
  } else {
    strengthExercises.push(`1. العقلة الأساسية: 4 × ${Math.max(3, Math.round(pullups * 0.7))} عدات`);
    strengthExercises.push(`2. سحب أسترالي: 3 × 12 عادة`);
  }

  if (dips < 8) {
    strengthExercises.push(`3. المتوازي (Dips): 3 × 6 عدات`);
    strengthExercises.push(`4. الضغط (Push-ups): 3 × 10 عدات`);
  } else {
    strengthExercises.push(`3. المتوازي: 4 × ${Math.max(4, Math.round(dips * 0.75))} عدات`);
    strengthExercises.push(`4. ضغط بايك: 3 × 8 عدات`);
  }

  strengthExercises.push(`5. سكوات قفز: 3 × ${squats > 0 ? Math.min(squats, 20) : '15'} عادة`);
  strengthExercises.push(`6. هولو بودي: 3 × ${hollow > 0 ? hollow : '20'} ثانية`);
  strengthExercises.push(`7. بلانك: 2 × ${plank > 0 ? Math.min(plank, 60) : '45'} ثانية`);
  if (superman > 0) strengthExercises.push(`8. سوبرمان: 2 × ${superman} ثانية`);

  // كائن الخطة الشامل
  const planData = {
    id: editingPlanId ? editingPlanId : 'plan_' + Date.now(),
    clientName: name,
    age: age,
    weight: weight,
    height: height,
    pullups: pullups,
    dips: dips,
    pushups: pushups,
    squats: squats,
    plank: plank,
    hollow: hollow,
    superman: superman,
    hang: hang,
    detectedSkill: detectedSkill,
    aiReasoning: aiReasoning,
    bmi: bmi.toFixed(1),
    date: new Date().toLocaleDateString('ar-EG'),
    skillSection: skillExercises,
    strengthSection: strengthExercises
  };

  savePlanLocally(planData);
  displayGeneratedPlan(planData);
  renderSavedPlansList();

  if (editingPlanId) {
    alert(`✅ تم تحديث الخطة وتحليلها مجدداً للمتدرب "${name}"!`);
    editingPlanId = null;
  }
}

function savePlanLocally(plan) {
  let plans = JSON.parse(localStorage.getItem('calisthenics_saved_plans') || '[]');
  const existingIndex = plans.findIndex(p => p.id === plan.id);
  if (existingIndex !== -1) {
    plans[existingIndex] = plan;
  } else {
    plans.unshift(plan);
  }
  localStorage.setItem('calisthenics_saved_plans', JSON.stringify(plans));
}

// ==========================================
// عرض الخطة المحللة
// ==========================================
function displayGeneratedPlan(plan) {
  const outputDiv = document.getElementById('planOutput');
  if (!outputDiv) return;
  
  outputDiv.classList.remove('hidden');

  outputDiv.innerHTML = `
    <div style="display: flex; gap: 10px; margin-bottom: 20px; justify-content: flex-end;">
      <button onclick="printPlan()" style="background: #3b82f6; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: bold;">
        🖨️ طباعة الخطة
      </button>
      <button onclick="copyPlan()" style="background: #10b981; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: bold;">
        📋 نسخ الخطة
      </button>
    </div>

    <div id="printablePlanContent">
      <h2>📋 الخطة التدريبية المخصصة عبر الذكاء الاصطناعي</h2>
      <p><strong>المتدرب:</strong> ${plan.clientName} | <strong>العمر:</strong> ${plan.age} سنة | <strong>الوزن:</strong> ${plan.weight} كغم | <strong>BMI:</strong> ${plan.bmi}</p>
      <p><strong>التاريخ:</strong> ${plan.date}</p>
      
      <div style="background: rgba(0, 210, 255, 0.1); border-right: 4px solid #00d2ff; padding: 12px; margin: 15px 0; border-radius: 6px;">
        <p style="margin: 0; font-weight: bold; color: #00d2ff;">🤖 مخرجات تحليل الذكاء الاصطناعي:</p>
        <p style="margin: 5px 0 0 0; font-size: 0.95rem;"><strong>المهارة المحددة تلقائياً:</strong> ${plan.detectedSkill}</p>
        <p style="margin: 5px 0 0 0; font-size: 0.85rem; color: #94a3b8;"><em>💡 السبب: ${plan.aiReasoning}</em></p>
      </div>

      <div class="plan-section" style="margin-bottom: 15px;">
        <h3 style="color: #00d2ff;">🎯 قسم المهارة (Skill Section)</h3>
        <ul style="line-height: 1.8;">
          ${plan.skillSection.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <div class="plan-section strength">
        <h3 style="color: #ff5300;">💪 قسم القوة والبناء (Strength & Conditioning)</h3>
        <ul style="line-height: 1.8;">
          ${plan.strengthSection.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  outputDiv.scrollIntoView({ behavior: 'smooth' });
}

function printPlan() {
  const printContents = document.getElementById('printablePlanContent').innerHTML;
  const originalContents = document.body.innerHTML;

  document.body.innerHTML = `
    <div style="direction: rtl; font-family: 'Tajawal', sans-serif; padding: 20px; color: #000; background: #fff;">
      ${printContents}
    </div>
  `;
  window.print();
  document.body.innerHTML = originalContents;
  window.location.reload();
}

function copyPlan() {
  const content = document.getElementById('printablePlanContent');
  if (!content) return;

  const textToCopy = content.innerText;
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert('✅ تم نسخ تفاصيل الخطة بنجاح!');
  }).catch(err => {
    console.error('فشل النسخ:', err);
  });
}

// ==========================================
// الأرشيف والتعديل
// ==========================================
function renderSavedPlansList() {
  const listDiv = document.getElementById('plansList');
  if (!listDiv) return;

  const plans = JSON.parse(localStorage.getItem('calisthenics_saved_plans') || '[]');

  if (plans.length === 0) {
    listDiv.innerHTML = '<p class="empty-msg">لا توجد خطط محفوظة حالياً.</p>';
    return;
  }

  let html = '';
  plans.forEach((data) => {
    html += `
      <div class="plan-item" style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="margin: 0 0 5px 0; color: #00d2ff;">${data.clientName} <span style="font-size: 0.8rem; color: #10b981;">(${data.detectedSkill})</span></h4>
          <p style="margin: 0; font-size: 0.85rem; color: #94a3b8;">التاريخ: ${data.date} | الوزن: ${data.weight} كغم</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="viewOrEditPlan('${data.id}')" style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">عرض / تعديل</button>
          <button onclick="deletePlan('${data.id}')" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">حذف</button>
        </div>
      </div>
    `;
  });
  listDiv.innerHTML = html;
}

function viewOrEditPlan(id) {
  const plans = JSON.parse(localStorage.getItem('calisthenics_saved_plans') || '[]');
  const plan = plans.find(p => p.id === id);
  if (!plan) return;

  editingPlanId = plan.id;

  setInputValue('clientName', plan.clientName);
  setInputValue('clientAge', plan.age);
  setInputValue('clientWeight', plan.weight);
  setInputValue('clientHeight', plan.height);

  setInputValue('pullups', plan.pullups || 0);
  setInputValue('dips', plan.dips || 0);
  setInputValue('pushups', plan.pushups || 0);
  setInputValue('squats', plan.squats || 0);
  setInputValue('plank', plan.plank || 0);
  setInputValue('hollow', plan.hollow || 0);
  setInputValue('superman', plan.superman || 0);
  setInputValue('hang', plan.hang || 0);

  displayGeneratedPlan(plan);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setInputValue(id, val) {
  const el = document.getElementById(id);
  if (el) {
    el.value = (val !== undefined && val !== null) ? val : '';
  }
}

function deletePlan(id) {
  if (confirm("هل أنت متأكد من حذف هذه الخطة من الأرشيف؟")) {
    let plans = JSON.parse(localStorage.getItem('calisthenics_saved_plans') || '[]');
    plans = plans.filter(p => p.id !== id);
    localStorage.setItem('calisthenics_saved_plans', JSON.stringify(plans));

    if (editingPlanId === id) {
      editingPlanId = null;
    }

    renderSavedPlansList();
  }
}