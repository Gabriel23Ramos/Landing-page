// cursor glow
const glow = document.getElementById('cursorGlow');
if (glow) {
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

// nav mobile 
function toggleNav() {
  document.getElementById('navDrawer').classList.toggle('open');
}

document.addEventListener('click', e => {
  const drawer = document.getElementById('navDrawer');
  const ham    = document.getElementById('navHam');
  if (drawer && ham && !drawer.contains(e.target) && !ham.contains(e.target)) {
    drawer.classList.remove('open');
  }
});

// scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

// QUIZ
const questions = [
  {
    q: "Você está em um café em Nova York. O atendente pergunta: 'What can I get for you?' Como você responde?",
    opts: [
      { t: "Não consigo responder nada", p: 0 },
      { t: "One coffee, please.", p: 1 },
      { t: "I'd like a large coffee with milk, please.", p: 2 },
      { t: "Could I get a large oat milk latte? And do you have any pastries?", p: 3 },
    ]
  },
  {
    q: "Qual dessas frases está correta em inglês?",
    opts: [
      { t: "She don't like vegetables.", p: 0 },
      { t: "She doesn't likes vegetables.", p: 0 },
      { t: "She doesn't like vegetables.", p: 3 },
      { t: "She not like vegetables.", p: 0 },
    ]
  },
  {
    q: "Você precisa pedir informações na rua. O que você diz?",
    opts: [
      { t: "Não consigo pedir informação em inglês", p: 0 },
      { t: "Where is... the hotel?", p: 1 },
      { t: "Excuse me, could you tell me how to get to the nearest hotel?", p: 3 },
      { t: "Sorry, where hotel is?", p: 0 },
    ]
  },
  {
    q: "Complete com o tempo correto: 'By the time she arrived, we _____ dinner.'",
    opts: [
      { t: "Não sei qual usar", p: 0 },
      { t: "already eaten", p: 0 },
      { t: "had already eaten", p: 3 },
      { t: "have already eaten", p: 1 },
    ]
  },
  {
    q: "Seu chefe internacional manda um e-mail urgente em inglês. O que você faz?",
    opts: [
      { t: "Não entendo e-mails em inglês ainda", p: 0 },
      { t: "Entendo partes, mas preciso de ajuda", p: 1 },
      { t: "Entendo tudo e respondo sem dificuldade", p: 2 },
      { t: "Entendo tudo e respondo com vocabulário profissional", p: 3 },
    ]
  },
  {
    q: "Qual a diferença entre 'I've been working' e 'I've worked'?",
    opts: [
      { t: "São iguais, não há diferença", p: 0 },
      { t: "Não sei a diferença", p: 0 },
      { t: "'Been working' = ação contínua/recente; 'worked' = ação concluída", p: 3 },
      { t: "'Been working' é mais formal", p: 1 },
    ]
  },
  {
    q: "Você está numa reunião e precisa discordar educadamente. O que você diz?",
    opts: [
      { t: "Não consigo me expressar em reuniões em inglês", p: 0 },
      { t: "I don't agree.", p: 1 },
      { t: "I see your point, but I think we should consider...", p: 2 },
      { t: "That's a valid perspective, however I'd like to suggest an alternative approach...", p: 3 },
    ]
  },
  {
    q: "Qual das opções usa 'unless' corretamente?",
    opts: [
      { t: "Unless you won't come, I'll wait.", p: 0 },
      { t: "Unless you don't come, I'll wait.", p: 0 },
      { t: "Unless you come, I won't wait.", p: 3 },
      { t: "Unless if you come, I'll wait.", p: 0 },
    ]
  },
];

const levels = [
  {
    emoji: '🌱', label: 'Beginner', min: 0, max: 7,
    desc: 'Você está no início da jornada — e isso é incrível! Todo especialista já foi iniciante. Com o plano 1x por semana vamos construir sua base do zero, com calma e eficiência.',
    msg: 'Olá%20Gabriel!%20Fiz%20o%20quiz%20e%20sou%20Beginner.%20Quero%20agendar%20minha%20aula%20gratuita!',
    plan: '1x por semana',
  },
  {
    emoji: '🚀', label: 'Intermediate', min: 8, max: 16,
    desc: 'Você já tem uma boa base e consegue se comunicar! Agora é hora de quebrar a barreira da fluência. O plano 2x por semana vai te fazer dar um salto enorme.',
    msg: 'Olá%20Gabriel!%20Fiz%20o%20quiz%20e%20sou%20Intermediate.%20Quero%20agendar%20minha%20aula%20gratuita!',
    plan: '2x por semana',
  },
  {
    emoji: '🏆', label: 'Advanced', min: 17, max: 24,
    desc: 'Impressionante! Seu inglês é sólido. Vamos refinar os detalhes que separam um bom falante de um falante sofisticado — nuances, expressões idiomáticas e pronúncia.',
    msg: 'Olá%20Gabriel!%20Fiz%20o%20quiz%20e%20sou%20Advanced.%20Quero%20agendar%20minha%20aula%20gratuita!',
    plan: '3x por semana',
  },
];

let cur = 0, pts = 0;
const letters = ['A', 'B', 'C', 'D'];

function renderQuiz() {
  const box = document.getElementById('quizBox');
  if (!box) return;
  const q = questions[cur];

  const dots = questions.map((_, i) => {
    let c = 'q-dot';
    if (i < cur)   c += ' done';
    if (i === cur) c += ' active';
    return `<div class="${c}"></div>`;
  }).join('');

  box.innerHTML = `
    <div class="q-prog">${dots}</div>
    <div class="q-meta">
      <span class="q-counter">Pergunta ${cur + 1} / ${questions.length}</span>
      <span class="q-score-badge">Score: ${pts} pts</span>
    </div>
    <p class="q-question">${q.q}</p>
    <div class="q-opts">
      ${q.opts.map((o, i) => `
        <button class="q-opt" onclick="answer(${o.p}, this)">
          <span class="q-opt-letter">${letters[i]}</span>
          ${o.t}
        </button>
      `).join('')}
    </div>
  `;
}

function answer(points, btn) {
  document.querySelectorAll('.q-opt').forEach(b => {
    b.onclick = null;
    b.style.opacity = '0.45';
  });
  btn.style.opacity = '1';
  btn.classList.add('selected');
  btn.querySelector('.q-opt-letter').style.background = 'var(--v2)';
  btn.querySelector('.q-opt-letter').style.color = '#fff';
  pts += points;

  setTimeout(() => {
    cur++;
    if (cur < questions.length) {
      renderQuiz();
    } else {
      showResult();
    }
  }, 420);
}

function showResult() {
  document.getElementById('quizBox').style.display = 'none';
  const level  = levels.find(l => pts >= l.min && pts <= l.max) || levels[0];
  const pct    = Math.round((pts / 24) * 100);
  const result = document.getElementById('quizResult');

  result.style.display = 'block';
  result.innerHTML = `
    <span class="qr-emoji">${level.emoji}</span>
    <p class="qr-tag">Seu nível de inglês é</p>
    <div class="qr-level">${level.label}</div>
    <div class="qr-bar-wrap"><div class="qr-bar" id="qrBar" style="width:0%"></div></div>
    <p style="font-size:12px;color:var(--txt2);margin-bottom:24px;">${pts} de 24 pontos · ${pct}%</p>
    <p class="qr-desc">${level.desc}</p>
    <a href="https://wa.me/5583988234853?text=${level.msg}" target="_blank" class="qr-cta">
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.108.549 4.089 1.508 5.814L0 24l6.335-1.482A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.795 9.795 0 01-5.012-1.374l-.36-.214-3.762.879.916-3.667-.235-.376A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
      Agendar aula grátis — ${level.plan}
    </a>
    <span class="qr-restart" onclick="restartQuiz()">↺ Refazer o quiz</span>
  `;

  result.scrollIntoView({ behavior: 'smooth', block: 'center' });

  setTimeout(() => {
    const bar = document.getElementById('qrBar');
    if (bar) bar.style.width = pct + '%';
  }, 200);
}

function restartQuiz() {
  cur = 0; pts = 0;
  document.getElementById('quizResult').style.display = 'none';
  const box = document.getElementById('quizBox');
  box.style.display = 'block';
  renderQuiz();
}

document.addEventListener('DOMContentLoaded', renderQuiz);