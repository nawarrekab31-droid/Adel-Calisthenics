const firebaseConfig = {
  apiKey: "AIzaSyAPSpTam0RuNuW4AhednhKVLyt8J9vubk4",
  authDomain: "adel-calisthenics.firebaseapp.com",
  databaseURL: "https://adel-calisthenics-default-rtdb.firebaseio.com",
  projectId: "adel-calisthenics",
  storageBucket: "adel-calisthenics.firebasestorage.app",
  messagingSenderId: "51697754269",
  appId: "1:51697754269:web:1ef5a4a63a8d94e2d83474",
  measurementId: "G-QM3VRNNQCG"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// تفعيل التخزين المؤقت بطريقة آمنة لا تسبب أخطاء
db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('ملاحظة: المتصفح يفتح أكثر من تبويب للتطبيق، يعمل النمط المحلي بشكل مستقل.');
  } else if (err.code === 'unimplemented') {
    console.warn('المتصفح لا يدعم ميزة التخزين المؤقت الكاملة.');
  }
});

// مراقبة حالة الاتصال بالإنترنت
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
  const statusEl = document.getElementById('connectionStatus');
  if (!statusEl) return;

  if (navigator.onLine) {
    statusEl.className = 'status-online';
    statusEl.innerText = '🟢 متصل بالسحابة (مزامنة مباشرة)';
  } else {
    statusEl.className = 'status-offline';
    statusEl.innerText = '🟠 غير متصل (يعمل محلياً وسيتم الرفع فور الاتصال)';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateOnlineStatus();
  listenToPlans();
});

// توليد الخطة وحفظها
function generateAndSavePlan() {
  const nameInput = document.getElementById('clientName');
  if (!nameInput || !nameInput.value.trim()) {
    alert('يرجى أدخل اسم المتدرب أولاً!');
    return;
  }

  const name = nameInput.value.trim();
  const age = parseFloat(document.getElementById('clientAge')?.value) || 20;
  const weight = parseFloat(document.getElementById('clientWeight')?.value) || 70;
  const height = parseFloat(document.getElementById('clientHeight')?.value) || 170;

  const targetSkill = document.getElementById('targetSkill')?.value || 'handstand';
  const skillHold = parseFloat(document.getElementById('skillHoldTime')?.value) || 0;
  const skillReps = parseFloat(document.getElementById('skillReps')?.value) || 0;

  const pullups = parseFloat(document.getElementById('pullups')?.value) || 0;
  const dips = parseFloat(document.getElementById('dips')?.value) || 0;
  const pushups = parseFloat(document.getElementById('pushups')?.value) || 0;
  const squats = parseFloat(document.getElementById('squats')?.value) || 0;
  const plank = parseFloat(document.getElementById('plank')?.value) || 0;
  const hollow = parseFloat(document.getElementById('hollow')?.value) || 0;
  const superman = parseFloat(document.getElementById('superman')?.value) || 0;
  const hang = parseFloat(document.getElementById('hang')?.value) || 0;

  const bmi = weight / ((height / 100) * (height / 100));
  let intensity = 1.0;
  if (bmi > 25) intensity -= 0.1;
  if (age > 35) intensity -= 0.1;

  // قسم المهارة
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

  // قسم القوة
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
    clientName: name,
    age: age,
    weight: weight,
    height: height,
    bmi: bmi.toFixed(1),
    date: new Date().toLocaleDateString('ar-EG'),
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    skillSection: skillExercises,
    strengthSection: strengthExercises
  };

  db.collection('calisthenics_plans').add(planData)
    .then(() => {
      displayGeneratedPlan(planData);
    })
    .catch((error) => {
      console.error("خطأ في الحفظ السحابي: ", error);
      displayGeneratedPlan(planData);
    });
}

function displayGeneratedPlan(plan) {
  const outputDiv = document.getElementById('planOutput');
  if (!outputDiv) return;
  outputDiv.classList.remove('hidden');

  outputDiv.innerHTML = `
    <h2>📋 الخطة التدريبية اليومية المتكاملة</h2>
    <p><strong>المتدرب:</strong> ${plan.clientName} | <strong>العمر:</strong> ${plan.age} سنة | <strong>الوزن:</strong> ${plan.weight} كغم | <strong>الطول:</strong> ${plan.height} سم (BMI: ${plan.bmi})</p>
    <p><strong>التاريخ:</strong> ${plan.date}</p>
    <hr>
    
    <div class="plan-section">
      <h3>🎯 قسم المهارة (Skill Section)</h3>
      <ul>
        ${plan.skillSection.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>

    <div class="plan-section">
      <h3>💪 قسم القوة والبناء (Strength & Conditioning)</h3>
      <ul>
        ${plan.strengthSection.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </div>
  `;
}

function listenToPlans() {
  db.collection('calisthenics_plans').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
    const listDiv = document.getElementById('plansList');
    if (!listDiv) return;

    if (snapshot.empty) {
      listDiv.innerHTML = '<p class="empty-msg">لا توجد خطط محفوظة حالياً.</p>';
      return;
    }

    let html = '';
    snapshot.forEach((doc) => {
      const data = doc.data();
      html += `
        <div class="plan-item">
          <h4>${data.clientName}</h4>
          <p>التاريخ: ${data.date || 'اليوم'}</p>
          <div class="item-actions">
            <button onclick="deletePlan('${doc.id}')" class="btn-sm btn-danger">حذف</button>
          </div>
        </div>
      `;
    });
    listDiv.innerHTML = html;
  });
}

function deletePlan(id) {
  if (confirm("هل أنت تأكد من حذف هذه الخطة؟")) {
    db.collection('calisthenics_plans').doc(id).delete();
  }
}

// التحكم في تشغيل وإيقاف الخلفية الموسيقية
function toggleMusic() {
  const music = document.getElementById('bgMusic');
  const btnText = document.getElementById('musicText');
  const btnIcon = document.getElementById('musicBtn');

  if (music.paused) {
    music.play();
    btnText.innerText = "الموسيقى: تعمل";
    btnText.style.color = "#38bdf8";
    btnIcon.innerText = "🔊";
  } else {
    music.pause();
    btnText.innerText = "الموسيقى: إيقاف";
    btnText.style.color = "#94a3b8";
    btnIcon.innerText = "🎵";
  }
}

if ('serviceWorker' in navigator) {
  caches.keys().then((names) => {
    for (let name of names) {
      if (name !== 'calisthenics-v1.1') {
        caches.delete(name);
      }
    }
  });
}