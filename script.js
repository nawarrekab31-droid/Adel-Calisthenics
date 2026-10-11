// ==========================================
// النظام الآمن الشامل (Local-First Architecture)
// ==========================================

// إدارة حالة الاتصال في الواجهة
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
  const statusEl = document.getElementById('connectionStatus');
  if (!statusEl) return;

  if (navigator.onLine) {
    statusEl.className = 'status-online';
    statusEl.innerText = '🟢 متصل بالنظام المحلي السريع';
  } else {
    statusEl.className = 'status-offline';
    statusEl.innerText = '🟠 وضع التشغيل المحلي (أوفلاين)';
  }
}

// التحكم بالموسيقى
let isMusicPlaying = false;
function toggleBackgroundMusic() {
  const audio = document.getElementById('bgMusic');
  const text = document.getElementById('musicText');
  if (!audio) return;

  if (isMusicPlaying) {
    audio.pause();
    if (text) text.innerText = 'تشغيل الموسيقى';
  } else {
    audio.play().catch(e => console.log('التشغيل الصوتي يتطلب تفاعلاً:', e));
    if (text) text.innerText = 'إيقاف الموسيقى';
  }
  isMusicPlaying = !isMusicPlaying;
}

document.addEventListener('DOMContentLoaded', () => {
  updateOnlineStatus();
  listenToPlans();
});

// ==========================================
// توليد وحفظ الخطة التدريبية اليومية محلياً
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

  // احتساب مؤشر كتلة الجسم والشدة
  const bmi = weight / ((height / 100) * (height / 100));
  let intensity = 1.0;
  if (bmi > 25) intensity -= 0.1;
  if (age > 35) intensity -= 0.1;

  // --- أ. بناء قسم المهارة (Skill Section) ---
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

  // --- ب. بناء قسم القوة والبناء (Strength Section) ---
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

  const planData = {
    id: 'plan_' + Date.now(),
    clientName: name,
    age: age,
    weight: weight,
    height: height,
    bmi: bmi.toFixed(1),
    date: new Date().toLocaleDateString('ar-EG'),
    skillSection: skillExercises,
    strengthSection: strengthExercises
  };

  savePlanLocally(planData);
  displayGeneratedPlan(planData);
  listenToPlans();
}

function savePlanLocally(plan) {
  let plans = JSON.parse(localStorage.getItem('calisthenics_saved_plans') || '[]');
  plans.unshift(plan);
  localStorage.setItem('calisthenics_saved_plans', JSON.stringify(plans));
}

// ==========================================
// عرض الخطة الناتجة مع أزرار الطباعة والنسخ
// ==========================================
function displayGeneratedPlan(plan) {
  const outputDiv = document.getElementById('planOutput');
  if (!outputDiv) return;
  
  outputDiv.classList.remove('hidden');

  outputDiv.innerHTML = `
    <div style="display: flex; gap: 10px; margin-bottom: 20px; justify-content: flex-end;">
      <button onclick="printPlan()" class="btn-action" style="background: #3b82f6; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: bold; display: flex; align-items: center; gap: 5px;">
        🖨️ طباعة الخطة
      </button>
      <button onclick="copyPlan()" class="btn-action" style="background: #10b981; color: white; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: bold; display: flex; align-items: center; gap: 5px;">
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

// دوال الطباعة والنسخ
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
    alert('✅ تم نسخ تفاصيل الخطة بنجاح، يمكنك لصقها الآن في أي مكان (مثل واتساب)!');
  }).catch(err => {
    console.error('فشل النسخ:', err);
    alert('تعذر النسخ تلقائياً، يرجى تحديد النص يدوياً.');
  });
}

// ==========================================
// إدارة الأرشيف المحلي
// ==========================================
function listenToPlans() {
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
      <div class="plan-item">
        <h4>${data.clientName || 'متدرب'}</h4>
        <p>التاريخ: ${data.date || 'اليوم'}</p>
        <div class="item-actions">
          <button onclick="deletePlan('${data.id}')" class="btn-sm btn-danger">حذف</button>
        </div>
      </div>
    `;
  });
  listDiv.innerHTML = html;
}

function deletePlan(id) {
  if (confirm("هل أنت متأكد من حذف هذه الخطة؟")) {
    let plans = JSON.parse(localStorage.getItem('calisthenics_saved_plans') || '[]');
    plans = plans.filter(p => p.id !== id);
    localStorage.setItem('calisthenics_saved_plans', JSON.stringify(plans));
    listenToPlans();
  }
}