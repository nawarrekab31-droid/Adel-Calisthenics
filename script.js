// 1. تهيئة Firebase بالمفاتيح الخاصة بك
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

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// تمكين المزامنة أثناء انقطاع الإنترنت (Offline Persistence)
db.enablePersistence().catch(err => {
    console.log("Offline persistence error: ", err.code);
});

// مراقبة حالة الاتصال بالإنترنت
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus() {
    const statusEl = document.getElementById('connectionStatus');
    if (!statusEl) return;

    if (navigator.onLine) {
        statusEl.className = 'status-online';
        statusEl.innerText = '🌐 متصل بالسحابة (مزامنة مباشرة)';
    } else {
        statusEl.className = 'status-offline';
        statusEl.innerText = '📴 غير متصل (يعمل محلياً وسيتم الرفع فور الاتصال)';
    }
}

// الاستماع المباشر للتغييرات المزامنة بين تطبيق الموبايل والموقع
document.addEventListener('DOMContentLoaded', () => {
    updateOnlineStatus();
    listenToPlans();
});

let globalPlans = [];

function listenToPlans() {
    db.collection("calisthenics_plans").orderBy("updatedAt", "desc")
      .onSnapshot(snapshot => {
          globalPlans = [];
          snapshot.forEach(doc => {
              globalPlans.push({ id: doc.id, ...doc.data() });
          });
          renderSavedPlansList(globalPlans);
      });
}

function generateAndSaveProgram() {
    const clientName = document.getElementById('clientName').value.trim();
    if (!clientName) {
        alert('يرجى إدخال اسم المتدرب أولاً');
        return;
    }

    const inputs = {
        clientName,
        pullups: parseInt(document.getElementById('pullups').value) || 0,
        hangTime: parseInt(document.getElementById('hangTime').value) || 0,
        pushups: parseInt(document.getElementById('pushups').value) || 0,
        dips: parseInt(document.getElementById('dips').value) || 0,
        dipsType: document.getElementById('dipsType').value,
        squatJumps: parseInt(document.getElementById('squatJumps').value) || 0,
        plank: parseInt(document.getElementById('plank').value) || 0,
        hollowBody: parseInt(document.getElementById('hollowBody').value) || 0,
        superman: parseInt(document.getElementById('superman').value) || 0,
        dipSkill: document.getElementById('dipSkill').value,
        pushSkill: document.getElementById('pushSkill').value
    };

    const editingId = document.getElementById('editingPlanId').value;
    const planData = {
        inputs: inputs,
        date: new Date().toLocaleDateString('ar-EG'),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (editingId) {
        db.collection("calisthenics_plans").doc(editingId).set(planData, { merge: true });
    } else {
        db.collection("calisthenics_plans").add(planData);
    }

    displayProgram(inputs);

    // إعادة ضبط النموذج
    document.getElementById('editingPlanId').value = '';
    document.getElementById('formTitle').innerText = '📝 أدخل نتائج اختبارات المتدرب';
}

function renderSavedPlansList(plans) {
    const container = document.getElementById('savedPlansList');

    if (plans.length === 0) {
        container.innerHTML = '<p class="empty-msg">لا توجد خطط محفوظة حالياً.</p>';
        return;
    }

    container.innerHTML = '';
    plans.forEach(plan => {
        container.innerHTML += `
            <div class="plan-item">
                <div>
                    <h4>${plan.inputs.clientName}</h4>
                    <p>التاريخ: ${plan.date || ''}</p>
                </div>
                <div class="plan-actions">
                    <button class="btn-sm btn-edit" onclick="editPlan('${plan.id}')">✏️ تعديل</button>
                    <button class="btn-sm btn-delete" onclick="deletePlan('${plan.id}')">🗑️ حذف</button>
                </div>
            </div>
        `;
    });
}

function editPlan(id) {
    const plan = globalPlans.find(p => p.id === id);
    if (!plan) return;

    const inp = plan.inputs;
    document.getElementById('editingPlanId').value = plan.id;
    document.getElementById('clientName').value = inp.clientName;
    document.getElementById('pullups').value = inp.pullups;
    document.getElementById('hangTime').value = inp.hangTime;
    document.getElementById('pushups').value = inp.pushups;
    document.getElementById('dips').value = inp.dips;
    document.getElementById('dipsType').value = inp.dipsType;
    document.getElementById('squatJumps').value = inp.squatJumps;
    document.getElementById('plank').value = inp.plank;
    document.getElementById('hollowBody').value = inp.hollowBody;
    document.getElementById('superman').value = inp.superman;
    document.getElementById('dipSkill').value = inp.dipSkill;
    document.getElementById('pushSkill').value = inp.pushSkill;

    document.getElementById('formTitle').innerText = '✏️ تعديل خطة: ' + inp.clientName;
    displayProgram(inp);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function deletePlan(id) {
    if (!confirm('هل أنت متأكد من حذف هذه الخطة كلياً من السحابة؟')) return;
    db.collection("calisthenics_plans").doc(id).delete();
}

function displayProgram(inp) {
    document.getElementById('displayClientName').innerText = inp.clientName;

    const daysData = [
        {
            title: 'اليوم الأول: سحب (Pull)',
            exercises: [
                { name: 'إحماء وإطالة', details: '10 دقائق' },
                { name: 'عقلة / سحب', details: getPullProgram(inp.pullups) },
                { name: 'سحب أفقي (أسترالي)', details: '3 - 4 جولات' },
                { name: 'التعليق', details: getHangProgram(inp.hangTime) },
                { name: 'هولو بودي', details: getHollowProgram(inp.hollowBody) },
                { name: 'سوبرمان', details: getSupermanProgram(inp.superman) }
            ]
        },
        {
            title: 'اليوم الثاني: دفع (Push)',
            exercises: [
                { name: 'إحماء وإطالة', details: '10 دقائق' },
                { name: 'ضغط (Push-ups)', details: getPushProgram(inp.pushups) },
                { name: 'المتوازي (Dips)', details: getDipsProgram(inp.dips, inp.dipsType) },
                { name: 'تمارين ساعد', details: '3 جولات' },
                { name: 'بلانك', details: Math.round(inp.plank * 0.7) + ' ثانية (3-4 جولات)' },
                { name: 'هولو بودي', details: getHollowProgram(inp.hollowBody) }
            ]
        },
        {
            title: 'اليوم الثالث: أرجل وجذع (Legs & Core)',
            exercises: [
                { name: 'إحماء وإطالة', details: '10 دقائق' },
                { name: 'قفز السكوات', details: getSquatsProgram(inp.squatJumps) },
                { name: 'لونجز', details: '3 جولات' },
                { name: 'بلانك', details: Math.round(inp.plank * 0.7) + ' ثانية (3-4 جولات)' },
                { name: 'هولو بودي', details: getHollowProgram(inp.hollowBody) },
                { name: 'سوبرمان', details: getSupermanProgram(inp.superman) }
            ]
        }
    ];

    renderTables(daysData);
    document.getElementById('resultsSection').classList.remove('style-hidden');
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

function getPullProgram(reps) {
    if (reps < 1) return 'سلبية + سحب أفقي (5 × 2-3 عُدّات)';
    if (reps <= 3) return '5 × 2-3 عُدّات (50-70%)';
    if (reps <= 6) return '5 × 3-4 عُدّات (50-70%)';
    if (reps <= 9) return '5 × 5-7 عُدّات (50-70%)';
    if (reps <= 12) return '5 × 7-9 عُدّات (50-70%)';
    if (reps <= 15) return '5 × 9-11 عُدّات (50-70%)';
    return '5 × 10+ عُدّات أو زيادة وزن';
}

function getPushProgram(reps) {
    if (reps < 10) return '5 × 4-5 عُدّات (ركب أو مائل)';
    if (reps <= 15) return '5 × 8-10 عُدّات';
    if (reps <= 20) return '5 × 10 عُدّات';
    if (reps <= 30) return '5 × 15 عُدّات';
    if (reps <= 40) return '5 × 20 عُدّات';
    return '5 × 20+ عُدّات أشكال أصعب';
}

function getDipsProgram(reps, type) {
    if (type === 'negative') {
        if (reps <= 3) return '5 × 2 نزول فقط';
        if (reps <= 6) return '5 × 3-4 نزول فقط';
        if (reps <= 10) return '5 × 4-6 نزول فقط';
        return '5 × 7-10 نزول فقط';
    }
    if (reps <= 3) return '5 × 2 عدات متوازي';
    if (reps <= 6) return '5 × 3-4 عدات';
    if (reps <= 10) return '5 × 6-7 عدات';
    if (reps <= 15) return '5 × 8-10 عدات';
    return '5 × 10-12 عدات';
}

function getSquatsProgram(reps) {
    if (reps < 15) return '5 × 8 عدات';
    if (reps <= 25) return '5 × 12 عدات';
    if (reps <= 35) return '5 × 18 عدات';
    return '5 × 22 عدات';
}

function getHangProgram(sec) {
    if (sec < 20) return '4 × 15-20 ثانية';
    if (sec <= 40) return '4 × 25-30 ثانية';
    if (sec <= 60) return '4 × 35-40 ثانية';
    return '4 × 40-45 ثانية';
}

function getHollowProgram(sec) {
    if (sec <= 20) return '2 × 10 ثواني';
    if (sec <= 45) return '2 × 30 ثانية';
    return '3 × 40 ثانية';
}

function getSupermanProgram(sec) {
    return `2-4 جولات × ${Math.round(sec * 0.7)} ثانية`;
}

function renderTables(days) {
    const container = document.getElementById('programTables');
    container.innerHTML = '';

    days.forEach(day => {
        let html = `
            <div class="day-box">
                <h3>${day.title}</h3>
                <table class="exercise-table">
                    <thead>
                        <tr><th>التمرين</th><th>تفاصيل الخطة</th></tr>
                    </thead>
                    <tbody>
        `;
        day.exercises.forEach(ex => {
            html += `
                <tr>
                    <td><input type="text" value="${ex.name}"></td>
                    <td><input type="text" value="${ex.details}"></td>
                </tr>
            `;
        });
        html += `</tbody></table></div>`;
        container.innerHTML += html;
    });
}

function copyWhatsAppFormat() {
    const clientName = document.getElementById('displayClientName').innerText;
    let text = `🏋️‍♂️ *البرنامج التدريبي المخصص لـ: ${clientName}*\n\n`;

    const dayBoxes = document.querySelectorAll('.day-box');
    dayBoxes.forEach(box => {
        text += `📌 *${box.querySelector('h3').innerText}*\n`;
        box.querySelectorAll('tbody tr').forEach(row => {
            const inputs = row.querySelectorAll('input');
            text += `• ${inputs[0].value}: ${inputs[1].value}\n`;
        });
        text += `\n`;
    });

    navigator.clipboard.writeText(text).then(() => alert('تم النسخ للواتساب!'));
}