/* ============================================================
   AI TEACHER HUB — script.js
   قادة مدارس الجمهورية × CSU × YLF
   ============================================================ */

// ── PARTICLES ──────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  function random(min, max) { return Math.random() * (max - min) + min; }
  function createParticle() {
    return { x: random(0,W), y: random(0,H), r: random(1,2.5), dx: random(-0.3,0.3), dy: random(-0.5,-0.1),
      opacity: random(0.1,0.5), color: Math.random()>0.6?'#3b71ff':Math.random()>0.5?'#38d9f5':'#f0c040' };
  }
  function draw() {
    ctx.clearRect(0,0,W,H);
    particles.forEach((p,i) => {
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity; ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.y < -5) { particles[i] = createParticle(); particles[i].y = H+5; }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  resize(); window.addEventListener('resize', resize);
  for (let i=0; i<80; i++) particles.push(createParticle());
  draw();
})();

// ── 1. LESSON DATABASE ─────────────────────────────────────────
const LESSONS_DB = [
  { id:1, grade:"7",  subject:"math",      lesson:"الجبر – المعادلات من الدرجة الأولى",   content:"المعادلة من الدرجة الأولى هي معادلة يكون فيها المجهول مرفوعاً للأس الأول. مثال: 2x + 3 = 7. لحلّها نعزل المجهول بطرح الثوابت من طرفَي المعادلة ثم القسمة على معامل المجهول." },
  { id:2, grade:"9",  subject:"science",   lesson:"قانون نيوتن الثاني – الحركة",          content:"قانون نيوتن الثاني: القوة = الكتلة × التسارع (F = m × a). كلما زادت القوة المؤثرة على جسم زاد تسارعه، وكلما زادت كتلته قلّ تسارعه بنفس القوة." },
  { id:3, grade:"10", subject:"physics",   lesson:"الكهرباء الساكنة – قانون كولوم",       content:"قانون كولوم يصف قوة التجاذب أو التنافر بين شحنتين كهربائيتين. القوة تتناسب طردياً مع حاصل ضرب الشحنتين، وعكسياً مع مربع المسافة بينهما. F = k × q1 × q2 / r²" },
  { id:4, grade:"11", subject:"chemistry", lesson:"الجدول الدوري والروابط الكيميائية",    content:"الجدول الدوري ينظّم العناصر الكيميائية حسب عددها الذري وخصائصها. الرابطة الأيونية تنشأ بين معدن وغير معدن بنقل إلكترون، أما الرابطة التساهمية فتنشأ بين غير معدنين بالمشاركة في إلكترونات." },
  { id:5, grade:"6",  subject:"arabic",    lesson:"الجملة الاسمية والفعلية",              content:"الجملة الاسمية: تبدأ باسم وتتكوّن من مبتدأ وخبر. مثال: العِلمُ نورٌ. الجملة الفعلية: تبدأ بفعل وتتكوّن من فعل وفاعل وقد يكون لها مفعول به. مثال: يدرسُ الطالبُ الدرسَ." },
  { id:6, grade:"8",  subject:"history",   lesson:"الحضارة المصرية القديمة",              content:"نشأت الحضارة المصرية القديمة على ضفاف نهر النيل منذ أكثر من 5000 سنة. تميّزت ببناء الأهرامات والمعابد وابتكار الكتابة الهيروغليفية والتقويم الشمسي ومهارات التحنيط." },
  { id:7, grade:"5",  subject:"science",   lesson:"دورة الماء في الطبيعة",               content:"تمر المياه بدورة مستمرة في الطبيعة: التبخّر من البحار والأنهار بفعل الشمس، التكاثف في الغلاف الجوي لتكوّن السحب، ثم التساقط كمطر أو ثلج، ثم التجمّع في الأنهار والبحيرات من جديد." },
  { id:8, grade:"12", subject:"math",      lesson:"التفاضل والتكامل – المشتقات",          content:"المشتقة هي معدل تغيّر دالة ما بالنسبة لمتغيّرها. مشتقة xⁿ = n·xⁿ⁻¹. تُستخدم في إيجاد أقصى قيمة وأدنى قيمة للدوال، وحساب السرعة اللحظية في الفيزياء." },
  { id:9, grade:"3",  subject:"math",      lesson:"الضرب والقسمة",                        content:"الضرب هو جمع متكرر لعدد محدد من المرات. مثال: 4 × 3 = 12. القسمة هي العملية العكسية للضرب: 12 ÷ 3 = 4. يمكن استخدام جدول الضرب لحفظ نتائج الضرب بسهولة." },
  { id:10,grade:"10", subject:"biology",   lesson:"الخلية وأجزاؤها",                      content:"الخلية هي أصغر وحدة حيّة في الكائنات الحية. تتكوّن من: غشاء خلوي يحيط بها، سيتوبلازم يملأها، نواة تحتوي على المادة الوراثية DNA، وعضيات مختلفة كالميتوكوندريا لإنتاج الطاقة." }
];

const SUBJECT_NAMES = { math:"رياضيات",science:"علوم",arabic:"لغة عربية",english:"إنجليزية",history:"تاريخ",geography:"جغرافيا",physics:"فيزياء",chemistry:"كيمياء",biology:"أحياء" };
const MODE_LABELS   = { explain:"شرح", summarize:"ملخّص", questions:"أسئلة اختبار" };

// ── 2. ELEMENTS ────────────────────────────────────────────────
const gradeSelect     = document.getElementById('gradeSelect');
const subjectSelect   = document.getElementById('subjectSelect');
const lessonSelect    = document.getElementById('lessonSelect');
const lessonPreview   = document.getElementById('lessonPreview');
const questionInput   = document.getElementById('questionInput');
const charCount       = document.getElementById('charCount');
const voiceBtn        = document.getElementById('voiceBtn');
const explainBtn      = document.getElementById('explainBtn');
const summarizeBtn    = document.getElementById('summarizeBtn');
const questionsBtn    = document.getElementById('questionsBtn');
const loadingState    = document.getElementById('loadingState');
const loadingText     = document.getElementById('loadingText');
const emptyState      = document.getElementById('emptyState');
const responseContent = document.getElementById('responseContent');
const responseBody    = document.getElementById('responseBody');
const responseBadge   = document.getElementById('responseBadge');
const errorState      = document.getElementById('errorState');
const errorMsg        = document.getElementById('errorMsg');
const retryBtn        = document.getElementById('retryBtn');
const ttsBtn          = document.getElementById('ttsBtn');
const copyBtn         = document.getElementById('copyBtn');
const toast           = document.getElementById('toast');
const simpleToggle    = document.getElementById('simpleToggle');
const simpleOverlay   = document.getElementById('simpleOverlay');
const simpleClose     = document.getElementById('simpleClose');
const simpleContent   = document.getElementById('simpleContent');
const simpleTtsBtn    = document.getElementById('simpleTtsBtn');
const lessonsGrid     = document.getElementById('lessonsGrid');
const navPills        = document.querySelectorAll('.nav-pill');

let lastResponse='', lastMode='explain', retryPayload=null, isSpeaking=false, recognition=null, isSimpleMode=false;

// ── 3. TABS ────────────────────────────────────────────────────
navPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const tab = pill.dataset.tab; if (!tab) return;
    navPills.forEach(p => p.classList.remove('active')); pill.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    if (tab === 'lessons') renderLessonsGrid();
  });
});

// ── 4. LESSON SELECTORS ────────────────────────────────────────
function populateLessons() {
  const grade=gradeSelect.value, subject=subjectSelect.value;
  lessonSelect.innerHTML = '<option value="">اختر الدرس</option>';
  lessonPreview.classList.add('hidden');
  if (!grade && !subject) return;
  LESSONS_DB.filter(l=>(!grade||l.grade===grade)&&(!subject||l.subject===subject)).forEach(l=>{
    const opt=document.createElement('option'); opt.value=l.id; opt.textContent=l.lesson; lessonSelect.appendChild(opt);
  });
}

gradeSelect.addEventListener('change', populateLessons);
subjectSelect.addEventListener('change', populateLessons);
lessonSelect.addEventListener('change', () => {
  const id=parseInt(lessonSelect.value); if(!id){lessonPreview.classList.add('hidden');return;}
  const lesson=LESSONS_DB.find(l=>l.id===id);
  if(lesson){lessonPreview.innerHTML=`<strong>📖 ${lesson.lesson}</strong>${lesson.content}`;lessonPreview.classList.remove('hidden');}
});

// ── 5. CHAR COUNT ──────────────────────────────────────────────
questionInput.addEventListener('input', () => {
  const len=questionInput.value.length;
  charCount.textContent=`${len} / 500 حرف`;
  charCount.classList.toggle('warn', len>450);
});

// ── 6. VOICE INPUT ─────────────────────────────────────────────
function initVoice() {
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){voiceBtn.style.opacity='0.4';voiceBtn.style.cursor='not-allowed';return;}
  recognition=new SR(); recognition.lang='ar-EG'; recognition.continuous=false; recognition.interimResults=false;
  recognition.onresult=e=>{questionInput.value=e.results[0][0].transcript;questionInput.dispatchEvent(new Event('input'));showToast('✅ تم التعرف على صوتك','success');};
  recognition.onerror=()=>{voiceBtn.classList.remove('recording');showToast('❌ لم يتم التعرف على الصوت','error');};
  recognition.onend=()=>voiceBtn.classList.remove('recording');
  voiceBtn.addEventListener('click',()=>{
    if(voiceBtn.classList.contains('recording')){recognition.stop();voiceBtn.classList.remove('recording');}
    else{recognition.start();voiceBtn.classList.add('recording');showToast('🎤 استمر في الكلام…','');}
  });
}
initVoice();

// ── 7. TTS ─────────────────────────────────────────────────────
function speak(text, btn) {
  if(!('speechSynthesis' in window)){showToast('المتصفح لا يدعم القراءة الصوتية','error');return;}
  if(isSpeaking){window.speechSynthesis.cancel();isSpeaking=false;if(btn)btn.classList.remove('active');return;}
  const clean=text.replace(/#+\s/g,'').replace(/\*\*/g,'').replace(/\*/g,'').replace(/[-•]/g,'').trim();
  const u=new SpeechSynthesisUtterance(clean); u.lang='ar-EG'; u.rate=0.9; u.pitch=1;
  const voices=window.speechSynthesis.getVoices();
  const arVoice=voices.find(v=>v.lang.startsWith('ar')); if(arVoice) u.voice=arVoice;
  u.onstart=()=>{isSpeaking=true;if(btn)btn.classList.add('active');};
  u.onend=()=>{isSpeaking=false;if(btn)btn.classList.remove('active');};
  u.onerror=()=>{isSpeaking=false;if(btn)btn.classList.remove('active');};
  window.speechSynthesis.speak(u);
}

ttsBtn.addEventListener('click', ()=>speak(lastResponse,ttsBtn));

// ── 8. COPY ────────────────────────────────────────────────────
copyBtn.addEventListener('click', async ()=>{
  if(!lastResponse) return;
  try{await navigator.clipboard.writeText(lastResponse);showToast('📋 تم النسخ','success');}
  catch{showToast('تعذّر النسخ','error');}
});

// ── 9. API CALL ────────────────────────────────────────────────
async function askAI(mode) {
  const question=questionInput.value.trim();
  if(!question){showToast('⚠️ أدخل سؤالاً أولاً','error');questionInput.focus();return;}
  if(question.length>500){showToast('السؤال طويل جداً','error');return;}

  document.querySelectorAll('.action-btn').forEach(b=>b.classList.remove('active-btn'));
  const activeBtn=document.querySelector(`[data-mode="${mode}"]`);
  if(activeBtn) activeBtn.classList.add('active-btn');

  const lessonId=parseInt(lessonSelect.value);
  const lesson=lessonId?LESSONS_DB.find(l=>l.id===lessonId):null;
  const payload={question,mode,lesson:lesson||null};
  retryPayload={mode,payload}; lastMode=mode;

  setUIState('loading');
  loadingText.textContent={explain:'المعلم الذكي يُعدّ الشرح…',summarize:'جاري التلخيص…',questions:'يُنشئ أسئلة الاختبار…'}[mode]||'جارٍ المعالجة…';

  try {
const res = await fetch('https://ai-teacher-su-leaders-production.up.railway.app/ask-ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||`خطأ من الخادم (${res.status})`);
    lastResponse=data.answer||'';
    renderResponse(lastResponse,mode);
    setUIState('response');
    if(isSimpleMode) openSimpleMode(lastResponse);
  } catch(err) {
    errorMsg.textContent=err.message||'حدث خطأ في الاتصال بالخادم.';
    setUIState('error');
  }
}

// ── 10. RENDER RESPONSE ────────────────────────────────────────
function renderResponse(text,mode) {
  responseBadge.textContent=MODE_LABELS[mode]||mode;
  responseBadge.className='response-badge';
  if(mode==='summarize') responseBadge.classList.add('badge-summarize');
  if(mode==='questions') responseBadge.classList.add('badge-questions');

  let html=text
    .replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h3>$1</h3>').replace(/^# (.+)$/gm,'<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/^[-•*]\s(.+)$/gm,'<li>$1</li>').replace(/^\d+\.\s(.+)$/gm,'<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/gs,m=>`<ul>${m}</ul>`)
    .replace(/^(📌|مثال[:]?)\s(.+)$/gm,'<div class="example-block"><strong>$1</strong> $2</div>')
    .split(/\n{2,}/).map(b=>(b.startsWith('<h3>')||b.startsWith('<ul>')||b.startsWith('<div'))?b:`<p>${b.replace(/\n/g,'<br/>')}</p>`).join('');
  responseBody.innerHTML=html;
}

// ── 11. UI STATES ──────────────────────────────────────────────
function setUIState(state) {
  [loadingState,emptyState,responseContent,errorState].forEach(el=>el.classList.add('hidden'));
  if(state==='loading')  loadingState.classList.remove('hidden');
  if(state==='empty')    emptyState.classList.remove('hidden');
  if(state==='response') responseContent.classList.remove('hidden');
  if(state==='error')    errorState.classList.remove('hidden');
}

// ── 12. BUTTONS ────────────────────────────────────────────────
explainBtn.addEventListener('click',   ()=>askAI('explain'));
summarizeBtn.addEventListener('click', ()=>askAI('summarize'));
questionsBtn.addEventListener('click', ()=>askAI('questions'));
retryBtn.addEventListener('click', ()=>{ if(retryPayload) askAI(retryPayload.mode); });

// ── 13. SIMPLE MODE ────────────────────────────────────────────
simpleToggle.addEventListener('click', ()=>{
  isSimpleMode=!isSimpleMode; simpleToggle.classList.toggle('active',isSimpleMode);
  showToast(isSimpleMode?'🧩 الوضع المبسّط مفعّل':'الوضع المبسّط مُعطَّل','success');
  if(isSimpleMode && lastResponse) openSimpleMode(lastResponse);
});

simpleClose.addEventListener('click', ()=>{ simpleOverlay.classList.add('hidden'); window.speechSynthesis&&window.speechSynthesis.cancel(); isSpeaking=false; });
simpleTtsBtn.addEventListener('click', ()=>speak(lastResponse,simpleTtsBtn));

function openSimpleMode(text) {
  const plain=text.replace(/#+\s/g,'').replace(/\*\*/g,'').replace(/\*/g,'').replace(/^[-•*]\s/gm,'• ').trim();
  simpleContent.textContent=plain; simpleOverlay.classList.remove('hidden');
}

// ── 14. LESSONS GRID ───────────────────────────────────────────
function renderLessonsGrid() {
  lessonsGrid.innerHTML='';
  LESSONS_DB.forEach(lesson=>{
    const card=document.createElement('div'); card.className='lesson-grid-card';
    card.innerHTML=`
      <div class="lgc-subject">${SUBJECT_NAMES[lesson.subject]||lesson.subject}</div>
      <div class="lgc-title">${lesson.lesson}</div>
      <div class="lgc-grade">الصف ${getGradeLabel(lesson.grade)}</div>
      <div class="lgc-snippet">${lesson.content}</div>
      <button class="lgc-use-btn">استخدم هذا الدرس →</button>
    `;
    card.querySelector('.lgc-use-btn').addEventListener('click',()=>useLesson(lesson));
    lessonsGrid.appendChild(card);
  });
}

function useLesson(lesson) {
  document.querySelector('[data-tab="ask"]').click();
  gradeSelect.value=lesson.grade; subjectSelect.value=lesson.subject; populateLessons();
  setTimeout(()=>{ lessonSelect.value=lesson.id; lessonSelect.dispatchEvent(new Event('change')); showToast('✅ تم تحميل الدرس','success'); document.querySelector('.question-card').scrollIntoView({behavior:'smooth'}); },50);
}

function getGradeLabel(grade) {
  const L={"1":"الأول الابتدائي","2":"الثاني الابتدائي","3":"الثالث الابتدائي","4":"الرابع الابتدائي","5":"الخامس الابتدائي","6":"السادس الابتدائي","7":"الأول الإعدادي","8":"الثاني الإعدادي","9":"الثالث الإعدادي","10":"الأول الثانوي","11":"الثاني الثانوي","12":"الثالث الثانوي"};
  return L[grade]||grade;
}

// ── 15. TOAST ─────────────────────────────────────────────────
let toastTimeout;
function showToast(msg,type='') {
  clearTimeout(toastTimeout); toast.textContent=msg; toast.className=`toast show ${type}`;
  toastTimeout=setTimeout(()=>toast.classList.remove('show'),3000);
}

// ── 16. KEYBOARD ──────────────────────────────────────────────
document.addEventListener('keydown', e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();askAI('explain');}
  if(e.key==='Escape'){simpleOverlay.classList.add('hidden');window.speechSynthesis&&window.speechSynthesis.cancel();}
});

// ── 17. INIT ──────────────────────────────────────────────────
setUIState('empty');
if('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged=()=>window.speechSynthesis.getVoices();
console.log('%c 🎓 AI Teacher Hub – قادة مدارس الجمهورية ','background:#2552be;color:#fff;font-size:14px;padding:8px 16px;border-radius:8px;');
