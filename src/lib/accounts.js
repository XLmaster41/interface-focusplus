import { emptyGame } from './game.js'
import { makeCode, newKey } from './auth.js'

const DEMO_TASKS = () => [
  { id: 'd1', title: 'Revisar os conceitos de IHC', priority: 'Alta', due: '', done: false, points: 10, steps: [{ title: 'Ler o resumo da aula', done: true, rewarded: true }, { title: 'Responder três questões', done: false }] },
  { id: 'd2', title: 'Organizar o roteiro do trabalho', priority: 'Normal', due: '', done: false, points: 10, steps: [{ title: 'Separar as referências', done: false }, { title: 'Definir o próximo passo', done: false }] },
  { id: 'd3', title: 'Separar os materiais para estudar', priority: 'Baixa', due: '', done: true, rewarded: true, points: 10, steps: [] },
]

export function createUser({ username, email = '', passHash = '', provider = '', existingCodes }) {
  return {
    key: newKey('usuario'), role: 'usuario', username, email, passHash, provider,
    profile: { photo: '', fullName: '', birth: '', bio: '' },
    linkCode: makeCode(existingCodes), guardians: [],
    tasks: DEMO_TASKS(), focusSeconds: 0,
    prefs: { theme: 'light', font: 'normal', minutes: 25, sound: 'off', showRanking: true },
    game: emptyGame(), tourSeen: false,
  }
}

export function createGuardian({ username, email = '', passHash = '', provider = '' }) {
  return {
    key: newKey('responsavel'), role: 'responsavel', username, email, passHash, provider,
    profile: { photo: '', fullName: '', phone: '', bio: '' },
    linked: [],
    rewards: [
      { id: 'w1', title: 'Escolher o filme da noite', cost: 60 },
      { id: 'w2', title: '30 minutos de jogo livre', cost: 80 },
      { id: 'w3', title: 'Sobremesa favorita', cost: 100 },
    ],
    prefs: { theme: 'light', font: 'normal' }, tourSeen: false,
  }
}
