import { useEffect, useRef, useState } from 'react'
import { KEYS, load, save } from './storage.js'
<<<<<<< HEAD
import { hashPass, checkPassword, isEmail, normCode } from './lib/auth.js'
import { createUser, createGuardian } from './lib/accounts.js'
import Login from './components/Login.jsx'
import UserApp from './UserApp.jsx'
import GuardianApp from './GuardianApp.jsx'

export default function App() {
  const [db, setDb] = useState(() => load(KEYS.db, { accounts: {} }))
  const [sessionKey, setSessionKey] = useState(() => load(KEYS.session, null))
  const [toast, setToast] = useState('')
  const toastTimer = useRef()

  const me = db.accounts[sessionKey] || null

  useEffect(() => { save(KEYS.db, db) }, [db])
  useEffect(() => { save(KEYS.session, me ? sessionKey : null) }, [sessionKey, me])
  useEffect(() => {
    document.body.classList.toggle('dark', me?.prefs.theme === 'dark')
    document.body.classList.toggle('large-text', me?.prefs.font === 'large')
  }, [me?.prefs.theme, me?.prefs.font])
=======
import { useTimer } from './hooks/useTimer.js'
import Header from './components/Header.jsx'
import Login from './components/Login.jsx'
import Tutorial from './components/Tutorial.jsx'
import TaskDialog from './components/TaskDialog.jsx'
import Inicio from './pages/Inicio.jsx'
import Tarefas from './pages/Tarefas.jsx'
import Foco from './pages/Foco.jsx'
import Progresso from './pages/Progresso.jsx'
import Config from './pages/Config.jsx'

const DEMO = [
  { id: 'd1', title: 'Revisar os conceitos de IHC', priority: 'Alta', due: '', done: false, steps: [{ title: 'Ler o resumo da aula', done: true }, { title: 'Responder três questões', done: false }] },
  { id: 'd2', title: 'Organizar o roteiro do trabalho', priority: 'Normal', due: '', done: false, steps: [{ title: 'Separar as referências', done: false }, { title: 'Definir o próximo passo', done: false }] },
  { id: 'd3', title: 'Separar os materiais para estudar', priority: 'Baixa', due: '', done: true, steps: [] },
]
const DEFAULT_DATA = { tasks: DEMO, focusSeconds: 0, prefs: { theme: 'light', font: 'normal', minutes: 25, sound: 'off' } }

const seenList = () => load(KEYS.tutorialSeen, [])
const hasSeen = (name) => seenList().includes(name.toLowerCase())
const markSeen = (name) => save(KEYS.tutorialSeen, [...new Set([...seenList(), name.toLowerCase()])])

// Sessão antiga era só o nome (texto); converte para objeto.
function readSession() {
  const s = load(KEYS.session, null)
  if (!s) return null
  return typeof s === 'string' ? { name: s, email: '', role: 'usuario' } : s
}

function beep() {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)()
    const o = ac.createOscillator(), g = ac.createGain()
    o.connect(g); g.connect(ac.destination); g.gain.value = 0.035; o.frequency.value = 660
    o.start(); o.stop(ac.currentTime + 0.2)
  } catch { /* som é opcional */ }
}

export default function App() {
  const [data, setData] = useState(() => {
    const d = load(KEYS.data, null)
    return d && Array.isArray(d.tasks) ? d : DEFAULT_DATA
  })
  const [user, setUser] = useState(readSession)
  const [page, setPage] = useState('inicio')
  const [focusId, setFocusId] = useState(null)
  const [sessionMinutes, setSessionMinutes] = useState(data.prefs.minutes)
  const [dialog, setDialog] = useState({ open: false, task: null })
  const [tour, setTour] = useState(() => { const u = readSession(); return !!u && !hasSeen(u.name) })
  const [toast, setToast] = useState('')
  const toastTimer = useRef()

  const { tasks, prefs } = data
  const update = (fn) => setData((d) => fn(d))
>>>>>>> c954fcfc3220f4d4909fad464105bf939b37891c

  const notify = (msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
<<<<<<< HEAD
    toastTimer.current = setTimeout(() => setToast(''), 2800)
  }
  const updateAcc = (key, fn) => setDb((d) => (d.accounts[key] ? { ...d, accounts: { ...d.accounts, [key]: fn(d.accounts[key]) } } : d))
  const updateMe = (fn) => updateAcc(sessionKey, fn)

  // ---- autenticação (protótipo: tudo local) ----
  const authenticate = ({ mode, role, username = '', email = '', pass = '', provider }) => {
    const all = Object.values(db.accounts).filter((a) => a.role === role)
    const codes = Object.values(db.accounts).map((a) => a.linkCode).filter(Boolean)
    const make = (extra) => (role === 'usuario' ? createUser({ ...extra, existingCodes: codes }) : createGuardian(extra))
    const enter = (acc) => {
      if (!db.accounts[acc.key]) setDb((d) => ({ ...d, accounts: { ...d.accounts, [acc.key]: acc } }))
      setSessionKey(acc.key)
    }

    if (mode === 'social') {
      const name = username.trim() || `Visitante ${provider}`
      const found = all.find((a) => a.provider === provider && a.username.toLowerCase() === name.toLowerCase())
      enter(found || make({ username: name, provider }))
      return { ok: true }
    }

    if (mode === 'entrar') {
      const id = username.trim().toLowerCase()
      if (!id) return { error: 'Digite seu nome de usuário ou e-mail.' }
      if (!pass) return { error: 'Digite sua senha.' }
      const acc = all.find((a) => a.username.toLowerCase() === id || (a.email && a.email.toLowerCase() === id))
      if (!acc) return { error: 'Não encontramos essa conta. Clique em “Criar conta” para começar.' }
      if (!acc.passHash || acc.passHash !== hashPass(pass)) return { error: 'Senha incorreta. Tente de novo.' }
      enter(acc)
      return { ok: true }
    }

    // criar conta
    const name = username.trim()
    if (name.length < 2) return { error: 'Escolha um nome de usuário com pelo menos 2 letras.' }
    if (!isEmail(email.trim())) return { error: 'Digite um e-mail válido, por exemplo voce@exemplo.com.' }
    const strength = checkPassword(pass, name)
    if (!strength.ok) return { error: strength.obvious ? 'Essa senha é óbvia demais. Evite sequências comuns e seu próprio nome.' : 'Sua senha ainda não é forte. Complete todos os itens da lista.' }
    if (all.some((a) => a.username.toLowerCase() === name.toLowerCase())) return { error: 'Esse nome de usuário já está em uso.' }
    if (all.some((a) => a.email && a.email.toLowerCase() === email.trim().toLowerCase())) return { error: 'Já existe uma conta com esse e-mail. Use “Entrar”.' }
    enter(make({ username: name, email: email.trim(), passHash: hashPass(pass) }))
    return { ok: true }
  }

  const logout = () => setSessionKey(null)

  // ---- vínculo responsável ↔ usuário por código ----
  const linkByCode = (guardianKey, raw) => {
    const code = normCode(raw)
    if (!code) return { error: 'Digite o código do usuário.' }
    const u = Object.values(db.accounts).find((a) => a.role === 'usuario' && normCode(a.linkCode) === code)
    if (!u) return { error: 'Código não encontrado. Confira com o usuário (formato FP-XXXXX).' }
    const g = db.accounts[guardianKey]
    if (g.linked.includes(u.key)) return { error: 'Você já está vinculado(a) a este usuário.' }
    setDb((d) => ({
      ...d,
      accounts: {
        ...d.accounts,
        [u.key]: { ...d.accounts[u.key], guardians: [...d.accounts[u.key].guardians, guardianKey] },
        [guardianKey]: { ...d.accounts[guardianKey], linked: [...d.accounts[guardianKey].linked, u.key] },
      },
    }))
    return { ok: true, name: u.profile.fullName || u.username }
  }
  const unlink = (guardianKey, userKey) => {
    if (!confirm('Desvincular este usuário? Você deixará de acompanhar o progresso dele.')) return
    setDb((d) => ({
      ...d,
      accounts: {
        ...d.accounts,
        [userKey]: { ...d.accounts[userKey], guardians: d.accounts[userKey].guardians.filter((k) => k !== guardianKey) },
        [guardianKey]: { ...d.accounts[guardianKey], linked: d.accounts[guardianKey].linked.filter((k) => k !== userKey) },
      },
    }))
    notify('Usuário desvinculado.')
  }

  const api = { updateMe, updateAcc, notify, logout, linkByCode, unlink }
  return (
    <>
      {!me && <Login onAuth={authenticate} />}
      {me && me.role === 'usuario' && <UserApp key={me.key} me={me} db={db} api={api} />}
      {me && me.role === 'responsavel' && <GuardianApp key={me.key} me={me} db={db} api={api} />}
      <div id="announce" role="status" aria-live="polite" style={{ display: toast ? 'block' : 'none' }}>{toast}</div>
=======
    toastTimer.current = setTimeout(() => setToast(''), 2700)
  }

  useEffect(() => { save(KEYS.data, data) }, [data])
  useEffect(() => {
    document.body.classList.toggle('dark', prefs.theme === 'dark')
    document.body.classList.toggle('large-text', prefs.font === 'large')
  }, [prefs.theme, prefs.font])

  const timer = useTimer(prefs.minutes, {
    onElapsed: (s) => update((d) => ({ ...d, focusSeconds: d.focusSeconds + s })),
    onFinish: () => { notify('Sessão de foco concluída.'); if (prefs.sound === 'on') beep() },
  })
  useEffect(() => {
    document.title = `${timer.running ? timer.clock + ' • ' : ''}Focus+ | Organize seu próximo passo`
  }, [timer.running, timer.clock])

  const open = tasks.filter((t) => !t.done)
  const activeId = open.some((t) => t.id === focusId) ? focusId : open[0]?.id || null
  const done = tasks.length - open.length
  const stats = { done, open: open.length, percentage: tasks.length ? Math.round((done / tasks.length) * 100) : 0 }
  const minutes = Math.floor(data.focusSeconds / 60)

  // ---- navegação ----
  const navigate = (p, id) => {
    if (p !== 'foco') timer.pause()
    if (id) setFocusId(id)
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  // ---- login / tutorial ----
  const login = (u) => {
    save(KEYS.session, u)
    setUser(u)
    setPage('inicio')
    if (!hasSeen(u.name)) { markSeen(u.name); setTour(true) }
  }
  const logout = () => {
    timer.reset()
    save(KEYS.session, null)
    setUser(null)
    setTour(false)
    setPage('inicio')
  }
  const closeTour = () => { markSeen(user.name); setTour(false); navigate('inicio') }

  // ---- tarefas ----
  const toggle = (id) => {
    const t = tasks.find((x) => x.id === id)
    update((d) => ({ ...d, tasks: d.tasks.map((x) => (x.id === id ? { ...x, done: !x.done } : x)) }))
    notify(t.done ? 'Tarefa reaberta.' : 'Tarefa concluída.')
  }
  const toggleStep = (id, i, checked) => {
    update((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, steps: t.steps.map((s, n) => (n === i ? { ...s, done: checked } : s)) } : t)) }))
    notify('Etapa atualizada.')
  }
  const remove = (id) => {
    if (!confirm('Excluir esta tarefa? Esta ação não poderá ser desfeita.')) return
    update((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }))
    notify('Tarefa excluída.')
  }
  const saveTask = ({ id, title, priority, due, stepTitles }) => {
    update((d) => {
      const old = d.tasks.find((t) => t.id === id)
      const steps = stepTitles.map((v) => ({ title: v, done: old?.steps.find((s) => s.title === v)?.done || false }))
      if (old) return { ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, title, priority, due, steps } : t)) }
      return { ...d, tasks: [{ id: 't' + Date.now(), title, priority, due, steps, done: false }, ...d.tasks] }
    })
    setDialog({ open: false, task: null })
    notify('Tarefa salva com sucesso.')
  }

  // ---- preferências / foco ----
  const setPref = (key, value) => {
    update((d) => ({ ...d, prefs: { ...d.prefs, [key]: value } }))
    if (key === 'minutes') { setSessionMinutes(value); timer.setMinutes(value, 'Pronto para começar') }
    notify('Preferência salva.')
  }
  const changeMinutes = (m) => { setSessionMinutes(m); timer.setMinutes(m) }
  const selectTask = (id) => { timer.pause(); setFocusId(id) }

  if (!user) return <><Login onLogin={login} /><div id="announce" role="status" aria-live="polite" style={{ display: 'none' }} /></>

  return (
    <>
      <a className="skip" href="#conteudo">Ir para o conteúdo principal</a>
      <Header page={page} onNavigate={navigate} user={user} onLogout={logout} />
      <main id="conteudo">
        <Inicio active={page === 'inicio'} userName={user.name} tasks={tasks} stats={stats} minutes={minutes} onToggle={toggle} onNavigate={navigate} />
        <Tarefas active={page === 'tarefas'} tasks={tasks} onNew={() => setDialog({ open: true, task: null })}
          onToggle={toggle} onToggleStep={toggleStep} onEdit={(t) => setDialog({ open: true, task: t })} onFocus={(id) => navigate('foco', id)} onDelete={remove} />
        <Foco active={page === 'foco'} tasks={tasks} activeId={activeId} onSelect={selectTask} timer={timer} minutes={sessionMinutes} onMinutes={changeMinutes} />
        <Progresso active={page === 'progresso'} stats={stats} minutes={minutes} />
        <Config active={page === 'config'} prefs={prefs} onPref={setPref} onReplayTutorial={() => setTour(true)} onLogout={logout} />
        <p className="footer">Focus+ • Protótipo acadêmico de interface • Nenhuma funcionalidade clínica ou diagnóstica</p>
      </main>
      <TaskDialog open={dialog.open} task={dialog.task} onClose={() => setDialog({ open: false, task: null })} onSave={saveTask} />
      <div id="announce" role="status" aria-live="polite" style={{ display: toast ? 'block' : 'none' }}>{toast}</div>
      {tour && <Tutorial onNavigate={navigate} onClose={closeTour} />}
>>>>>>> c954fcfc3220f4d4909fad464105bf939b37891c
    </>
  )
}
