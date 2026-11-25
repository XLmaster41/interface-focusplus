// Regras de pontos, níveis, sequência e emblemas.
export const XP_PER_LEVEL = 100
export const POINTS = { task: 10, step: 2, session: 25, guardianTask: 20 }
const TITLES = ['Iniciante', 'Explorador(a)', 'Persistente', 'Focado(a)', 'Mestre do Foco', 'Lenda do Foco']

export const levelInfo = (xp) => {
  const idx = Math.floor(xp / XP_PER_LEVEL)
  return { level: idx + 1, into: xp % XP_PER_LEVEL, title: TITLES[Math.min(idx, TITLES.length - 1)] }
}

const pad = (n) => String(n).padStart(2, '0')
const dayStr = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// Sequência atual: só vale se a última atividade foi hoje ou ontem.
export function currentStreak(g) {
  const y = dayStr(new Date(Date.now() - 864e5))
  return g.lastActive === dayStr() || g.lastActive === y ? g.streak : 0
}

export const emptyGame = () => ({
  xp: 0, points: 0, streak: 0, bestStreak: 0, lastActive: '',
  tasksDone: 0, sessionsDone: 0, badges: [], log: [], redeemed: [],
})

// Soma pontos ao jogador, atualiza sequência e registra no histórico.
export function addXp(acc, pts, text, bump = {}) {
  const g = acc.game
  const t = dayStr()
  const y = dayStr(new Date(Date.now() - 864e5))
  const streak = g.lastActive === t ? g.streak : g.lastActive === y ? g.streak + 1 : 1
  const counters = {}
  for (const k in bump) counters[k] = (g[k] || 0) + bump[k]
  return {
    ...acc,
    game: {
      ...g, ...counters, streak, bestStreak: Math.max(g.bestStreak || 0, streak), lastActive: t,
      xp: g.xp + pts, points: g.points + pts,
      log: [{ t: Date.now(), text, pts }, ...g.log].slice(0, 40),
    },
  }
}

export const BADGES = [
  { id: 'primeiro', icon: '🌱', name: 'Primeiro passo', desc: 'Conclua 1 tarefa', test: (a) => a.game.tasksDone >= 1 },
  { id: 'cinco', icon: '⭐', name: 'Em ritmo', desc: 'Conclua 5 tarefas', test: (a) => a.game.tasksDone >= 5 },
  { id: 'dez', icon: '🏆', name: 'Imparável', desc: 'Conclua 10 tarefas', test: (a) => a.game.tasksDone >= 10 },
  { id: 'foco1', icon: '🎯', name: 'Foco total', desc: 'Termine 1 sessão de foco', test: (a) => a.game.sessionsDone >= 1 },
  { id: 'maratona', icon: '⏱️', name: 'Maratonista', desc: '60 minutos de foco no total', test: (a) => a.focusSeconds >= 3600 },
  { id: 'streak3', icon: '🔥', name: 'Três dias seguidos', desc: 'Sequência de 3 dias', test: (a) => (a.game.bestStreak || 0) >= 3 },
  { id: 'nivel3', icon: '🚀', name: 'Nível 3', desc: 'Chegue a 200 pontos de experiência', test: (a) => a.game.xp >= 200 },
  { id: 'perfil', icon: '📸', name: 'Perfil completo', desc: 'Adicione foto e nome completo', test: (a) => !!a.profile.photo && !!a.profile.fullName },
  { id: 'dupla', icon: '🤝', name: 'Em dupla', desc: 'Vincule um responsável', test: (a) => a.guardians.length >= 1 },
  { id: 'premio', icon: '🎁', name: 'Recompensado(a)', desc: 'Resgate sua 1ª recompensa', test: (a) => a.game.redeemed.length >= 1 },
]

export const newBadges = (acc) => BADGES.filter((b) => !acc.game.badges.some((x) => x.id === b.id) && b.test(acc))

// Participantes de demonstração para o ranking (apenas visuais).
export const DEMO_PLAYERS = [
  { name: 'Luna', xp: 340 }, { name: 'Theo', xp: 215 }, { name: 'Bia', xp: 150 }, { name: 'Caio', xp: 70 },
]
