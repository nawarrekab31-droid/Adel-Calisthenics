// ==========================================
// النظام المحلي المتكامل (Local-First Pure JS)
// مع ميزة التعديل والاستبدال المباشر للخطط
// ==========================================

// متغير عالمي لتتبع الخطة الجاري تعديلها حالياً
let editingPlanId = null;

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
  const statusEl = document.getElementById('connectionStatus');
  if (!statusEl) return;
  statusEl.className = 'status-online';
  statusEl.innerText = '⚡ نظام محلي عالي السرعة (أوفلاين بالكامل)';
}

// التحكم بالموسيقى والصوت
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
// توليد / تحديث وحفظ الخطة التدريبية محلياً
// ==========================================
function generateAndSavePlan() {
  const nameInput = document.getElementById('clientName');
  if (!nameInput || !nameInput.value.trim()) {
    alert('يرجى إدخال اسم المتدرب أولاً!');
    return;
  }

  // قراءة كافة الحقول
  const name = nameInput.value.trim();
  const age = parseFloat(document.getElementById('clientAge')?.value) || 20;
  const weight = parseFloat(document.getElementById('clientWeight')?.value) || 70;
  const height = parseFloat(document.getElementById('clientHeight')?.value) || 170;

  // المهارات
  const targetSkill = document.getElementById('targetSkill')?.value || 'handstand';
  const skillHold = parseFloat(document.getElementById('skillHoldTime')?.value) || 0;
  const skillReps = parseFloat(document.getElementById('skillReps')?.value) || 0;

  // اختبارات القوة
  const pullups = parseFloat(document.getElementById('pullups')?.value) || 0;
  const dips = parseFloat(document.getElementById('dips')?.value) || 0;
  const pushups = parseFloat(document.getElementById('pushups')?.value) || 0;
  const squats = parseFloat(document.getElementById('squats')?.value) || 0;
  const plank = parseFloat(document.getElementById('plank')?.value) || 0;
  const hollow = parseFloat(document.getElementById('hollow')?.value) || 0;
  const superman = parseFloat(document.getElementById('superman')?.value) || 0;
  const hang = parseFloat(document.getElementById('hang')?.value) || 0;

  // احتساب مؤشر كتلة الجسم (BMI) والشدة
  const bmi = weight / ((height / 100) * (height / 100));
  let intensity = 1.0;
  if (bmi > 25) intensity -= 0.1;
  if (age > 35) intensity -= 0.1;

  // --- أ. قسم المهارة (Skill Section) ---
  let skillExercises = [];
  if (targetSkill === 'handstand') {
    if (skillHold < 10) {
      skillExercises = [
        `1. هاندستاند على الحائط (البطن للجدار): 2 × ${Math.max(10, Math.round(20 * intensity))} ثانية`,
        `2. هاندستاند على الحائط رأس ومحاولات: 4 × 20 ثانية`,
        `3. نقل الوزن بين اليدين (هاندستاند ساند): 2 × 20 ثانية`,
        `4. محاولات هاندستاند دخول + خروج سليم: 4 محاولات`
      ];
    } else {
      skillExercises = [
        `1. نقل الوزن بين اليدين هاندستاند حر: 3 × 20-25 ثانية`,
        `2. محاولات هاندستاند حر (بدون جدار): ${Math.max(5, skillReps || 8)} محاولات مركزة`,
        `3. الثبات والاتزان العالي: 3 × ${skillHold} ثانية`
      ];
    }
  } else if (targetSkill === 'parallel_hold') {
    skillExercises = [
      `1. تثبيت التطور على الثابت: 4 × ${skillHold > 0 ? skillHold : '8-12'} ثانية`,
      `2. رفع الركبتين باتجاه الصدر مع تحكم: 3 × 6-8 عدات`,
      `3. محاولات عقلة بمساعدة استك: 5 × 3 عدات`
    ];
  } else {
    skillExercises = [
      `1. ثبات التعلق المباشر: 3 × ${hang > 0 ? hang : '15-20'} ثانية`,
      `2. سحب لوحي الكتف مع تثبيت: 3 × 8 عدات`,
      `3. محاولات تثبيت المهارة: 4 × 10 ثوانٍ`
    ];
  }

  // --- ب. قسم القوة والبناء (Strength Section) ---
  let strengthExercises = [];

  if (pullups < 5) {
    strengthExercises.push(`1. ثابت سلبي: 3 × 2 (نزول بطيء 5 ثوانٍ)`);
    strengthExercises.push(`2. سحب أسترالي: 3 × 10-12 عدات`);
    strengthExercises.push(`3. سحب لوحي الكتف: 3 × 8-10 عدات`);
  } else {
    strengthExercises.push(`1. العقلة الأساسية: 4 × ${Math.max(3, Math.round(pullups * 0.7))} عدات`);
    strengthExercises.push(`2. سحب أسترالي: 3 × 12 عادة`);
  }

  if (dips < 8) {
    strengthExercises.push(`4. المتوازي (Dips): 3 × 6-8 عدات`);
    strengthExercises.push(`5. الضغط (Push-ups): 3 × 10-12 عدات`);
  } else {
    strengthExercises.push(`3. المتوازي: 4 × ${Math.max(4, Math.round(dips * 0.75))} عدات`);
    strengthExercises.push(`4. ضغط بايك (Pike Pushups): 3 × 6-8 عدات`);
  }

  strengthExercises.push(`6. سكوات قفز: 3 × ${squats > 0 ? Math.min(squats, 20) : '15'} عادة`);
  strengthExercises.push(`7. هولو بودي: 3 × ${hollow > 0 ? hollow : '20-25'} ثانية`);
  strengthExercises.push(`8. بلانك: 2 × ${plank > 0 ? Math.min(plank, 60) : '45-60'} ثانية`);
  if (superman > 0) {
    strengthExercises.push(`9. سوبرمان: 2 × ${superman} ثانية`);
  }

  // تجهيز كائن الخطة الشامل
  const planData = {
    id: editingPlanId ? editingPlanId : 'plan_' + Date.now(),
    clientName: name,
    age: age,
    weight: weight,
    height: height,
    targetSkill: targetSkill,
    skillHoldTime: skillHold,
    skillReps: skillReps,
    pullups: pullups,
    dips: dips,
    pushups: pushups,
    squats: squats,
    plank: plank,
    hollow: hollow,
    superman: superman,
    hang: hang,
    bmi: bmi.toFixed(1),
    date: new Date().toLocaleDateString('ar-EG'),
    skillSection: skillExercises,
    strengthSection: strengthExercises
  };

  // حفظ الخطة (تحديث إذا كنا نعدل أو إضافة جديدة)
  savePlanLocally(planData);
  displayGeneratedPlan(planData);
  renderSavedPlansList();

  // إرسال تنبيه وتظهير زر الحفظ للوضع الطبيعي
  if (editingPlanId) {
    alert(`✅ تم تحديث خطة المتدرب "${name}" واستبدالها في الأرشيف بنجاح!`);
    editingPlanId = null; // إعادة تعيين المعرف للوضع الطبيعي
  }
}

function savePlanLocally(plan) {
  let plans = JSON.parse(localStorage.getItem('calisthenics_saved_plans') || '[]');
  
  // البحث عن الخطة إن كانت موجودة مسبقاً لاستبدالها
  const existingIndex = plans.findIndex(p => p.id === plan.id);
  if (existingIndex !== -1) {
    plans[existingIndex] = plan; // استبدال الخطة القديمة بالجديدة
  } else {
    plans.unshift(plan); // إضافة خطة جديدة
  }

  localStorage.setItem('calisthenics_saved_plans', JSON.stringify(plans));
}

// ==========================================
// عرض الخطة مع أزرار الطباعة والنسخ
// ==========================================
function displayGeneratedPlan(plan) {
  const outputDiv = document.getElementById('planOutput');
  if (!outputDiv) return;
  
  outputDiv.classList.remove('hidden');

  outputDiv.innerHTML = `
    <div style="display: flex; gap: 10px; margin-bottom: 20px; justify-content: flex-end;">
      <button onclick="printPlan()" style="background: #3b82f6; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: bold; display: flex; align-items: center; gap: 5px;">
        🖨️ طباعة الخطة
      </button>
      <button onclick="copyPlan()" style="background: #10b981; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: bold; display: flex; align-items: center; gap: 5px;">
        📋 نسخ الخطة
      </button>
    </div>

    <div id="printablePlanContent">
      <h2>📋 الخطة التدريبية اليومية المتكاملة</h2>
      <p><strong>المتدرب:</strong> ${plan.clientName} | <strong>العمر:</strong> ${plan.age} سنة | <strong>الوزن:</strong> ${plan.weight} كغم | <strong>الطول:</strong> ${plan.height} سم (BMI: ${plan.bmi})</p>
      <p><strong>التاريخ:</strong> ${plan.date}</p>
      <hr style="border-color: rgba(255,255,255,0.1);">
      
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

// دالة الطباعة
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

// دالة النسخ
function copyPlan() {
  const content = document.getElementById('printablePlanContent');
  if (!content) return;

  const textToCopy = content.innerText;
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert('✅ تم نسخ تفاصيل الخطة بنجاح، يمكنك لصقها الآن في أي مكان (واتساب، تيليجرام...)!');
  }).catch(err => {
    console.error('فشل النسخ:', err);
    alert('تعذر النسخ تلقائياً.');
  });
}

// ==========================================
// إدارة الأرشيف المحلي (تعبئة جميع الخانات والتعديل)
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
          <h4 style="margin: 0 0 5px 0; color: #00d2ff;">${data.clientName}</h4>
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

  // 1. تحديد معرف الخطة التي جاري تعديلها
  editingPlanId = plan.id;

  // 2. ملء جميع الخانات والبيانات بالقيم المخزنة
  setInputValue('clientName', plan.clientName);
  setInputValue('clientAge', plan.age);
  setInputValue('clientWeight', plan.weight);
  setInputValue('clientHeight', plan.height);

  setInputValue('targetSkill', plan.targetSkill || 'handstand');
  setInputValue('skillHoldTime', plan.skillHoldTime || 0);
  setInputValue('skillReps', plan.skillReps || 0);

  setInputValue('pullups', plan.pullups || 0);
  setInputValue('dips', plan.dips || 0);
  setInputValue('pushups', plan.pushups || 0);
  setInputValue('squats', plan.squats || 0);
  setInputValue('plank', plan.plank || 0);
  setInputValue('hollow', plan.hollow || 0);
  setInputValue('superman', plan.superman || 0);
  setInputValue('hang', plan.hang || 0);

  // 3. عرض الخطة الحالية في الأسفل
  displayGeneratedPlan(plan);

  // 4. التمرير إلى الأعلى لإجراء التعديلات
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// دالة مساعدة لتعبئة قيم الخانات بأمان
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