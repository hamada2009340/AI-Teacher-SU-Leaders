/* ============================================================
   AI TEACHER HUB — server.js (OPENROUTER VERSION)
   Node.js + Express backend
   - Hides API key from frontend
   - /ask-ai endpoint
   - Lesson context injection
   - Rate limiting & validation
   ============================================================ */

// ── Load env variables from .env file ──
require('dotenv').config();

const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const rateLimit = require('express-rate-limit');

const app  = express();
const PORT = process.env.PORT || 3000;

// ──────────────────────────────────────────────────────────────
// CONFIGURATION
// ──────────────────────────────────────────────────────────────

// OpenRouter API Key
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Model (OpenRouter supports many models)
const AI_MODEL = 'openai/gpt-4o-mini';
const AI_MAX_TOKENS = 1500;

// ──────────────────────────────────────────────────────────────
// MIDDLEWARE
// ──────────────────────────────────────────────────────────────

app.use(express.json({ limit: '10kb' }));

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.ALLOWED_ORIGIN || '*'
    : '*'
}));

app.use(express.static(path.join(__dirname)));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: 'تجاوزت الحد المسموح من الطلبات. انتظر دقيقة.' }
});

app.use('/ask-ai', limiter);

// ──────────────────────────────────────────────────────────────
// LESSON DATABASE
// ──────────────────────────────────────────────────────────────

const LESSONS_DB = [
  { id: 1, grade: "7", subject: "math", lesson: "الجبر", content: "حل المعادلات..." },
  { id: 2, grade: "9", subject: "science", lesson: "نيوتن", content: "F = m × a" },
  { id: 3, grade: "10", subject: "physics", lesson: "كولوم", content: "F = k q1 q2 / r²" },
  { id: 4, grade: "11", subject: "chemistry", lesson: "الروابط", content: "أيونية وتساهمية" },
  { id: 5, grade: "6", subject: "arabic", lesson: "الجملة", content: "اسمية وفعلية" },
  { id: 6, grade: "8", subject: "history", lesson: "مصر القديمة", content: "حضارة النيل" },
  { id: 7, grade: "5", subject: "science", lesson: "الماء", content: "دورة الماء" },
  { id: 8, grade: "12", subject: "math", lesson: "التفاضل", content: "المشتقات" },
  { id: 9, grade: "3", subject: "math", lesson: "الضرب", content: "4 × 3 = 12" },
  { id: 10, grade: "10", subject: "biology", lesson: "الخلية", content: "DNA + نواة" }
];

// ──────────────────────────────────────────────────────────────
// SYSTEM PROMPT BUILDER
// ──────────────────────────────────────────────────────────────

function buildSystemPrompt(mode, lesson) {
  let lessonContext = '';

  if (lesson) {
    lessonContext = `
## سياق الدرس
- المادة: ${lesson.subject}
- الصف: ${lesson.grade}
- الدرس: ${lesson.lesson}
- المحتوى: ${lesson.content}
`;
  }

  const modeInstructions = {
    explain: `
## المطلوب
اشرح المفهوم خطوة خطوة مع مثال مصري.`,

    summarize: `
## المطلوب
تلخيص في نقاط قصيرة.`,

    questions: `
## المطلوب
إنشاء أسئلة اختبار مع إجابات.`
  };

  return `
أنت مدرس خبير.

${lessonContext}
${modeInstructions[mode] || modeInstructions.explain}

استخدم أسلوب بسيط وواضح.
`;
}

// ──────────────────────────────────────────────────────────────
// MAIN ENDPOINT
// ──────────────────────────────────────────────────────────────

app.post('/ask-ai', async (req, res) => {

  const { question, mode, lesson } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'أدخل سؤال' });
  }

  const cleanQuestion = question.trim().slice(0, 500);
  const validModes = ['explain', 'summarize', 'questions'];
  const cleanMode = validModes.includes(mode) ? mode : 'explain';

  if (OPENROUTER_API_KEY === 'PUT_YOUR_API_KEY_HERE') {
    return res.status(503).json({ error: 'ضع API Key في .env' });
  }

  const systemPrompt = buildSystemPrompt(cleanMode, lesson);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: cleanQuestion }
        ],
        max_tokens: AI_MAX_TOKENS
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(502).json({
        error: data?.error?.message || 'AI Error'
      });
    }

    const answer = data?.choices?.[0]?.message?.content;

    return res.json({
      answer,
      mode: cleanMode,
      model: AI_MODEL
    });

  } catch (err) {
    return res.status(500).json({
      error: 'Server Error'
    });
  }
});

// ──────────────────────────────────────────────────────────────
// EXTRA ROUTES
// ──────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/lessons', (req, res) => {
  res.json(LESSONS_DB);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ──────────────────────────────────────────────────────────────
// START SERVER
// ──────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});