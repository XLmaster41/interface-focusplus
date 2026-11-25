import { useEffect, useRef, useState } from 'react'
import { useTimer } from './hooks/useTimer.js'
import Shell from './components/Shell.jsx'
import TaskDialog from './components/TaskDialog.jsx'
import { USER_STEPS } from './components/Tutorial.jsx'
import Inicio from './pages/Inicio.jsx'
import Tarefas from './pages/Tarefas.jsx'
import Foco from './pages/Foco.jsx'
import Progresso from './pages/Progresso.jsx'
import Config from './pages/Config.jsx'
import Suporte from './pages/Suporte.jsx'
import PerfilUsuario from './pages/PerfilUsuario.jsx'
import { addXp, levelInfo, newBadges, POINTS } from './lib/game.js'

const NAV = [['inicio', 'Início'], ['tarefas', 'Minhas tarefas'], ['foco', 'Modo foco'], ['progresso', 'Meu progresso']]

function beep() {
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)()
    const o = ac.createOscillator(), g = ac.createGain()
    o.connect(g); g.connect(ac.destination); g.gain.value = 0.035; o.frequency.value = 660
    o.start(); o.stop(ac.currentTime + 0.2)
  } catch { /* som é opcional */ }
}

export default function UserApp({ me, db, api }) {
  const { updateMe, notify, logout } = api
  const [page, setPage] = useState('inicio')
  const [tab, setTab] = useState('dados')
  const [focusId, setFocusId] = useState(null)
  const [sessionMinutes, setSessionMinutes] = useState(me.prefs.minutes)
  const [dialog, setDialog] = useState({ open: false, task: null })
  const [tour, setTour] = useState(!me.tourSeen)
  const { tasks, prefs } = me

  const timer = useTimer(prefs.minutes, {
    onElapsed: (s) => updateMe((a) => ({ ...a, focusSeconds: a.focusSeconds + s })),
    onFinish: () => {
      updateMe((a) => addXp(a, POINTS.session, 'Sessão de foco concluída', { sessionsDone: 1 }))
      notify(`Sessão de foco concluída! +${POINTS.session} pts 🎯`)
      if (prefs.sound === 'on') beep()
    },
  })
  useEffect(() => {
    document.title = `${timer.running ? timer.clock + ' • ' : ''}Focus+ | Organize seu próximo passo`
  }, [timer.running, timer.clock])

  // Sobe de nível / ganha emblemas
  const prevLevel = useRef(levelInfo(me.game.xp).level)
  useEffect(() => {
    const lvl = levelInfo(me.game.xp).level
    const levelUp = lvl > prevLevel.current
    prevLevel.current = lvl
    const fresh = newBadges(me)
    if (fresh.length) updateMe((a) => ({ ...a, game: { ...a.game, badges: [...a.game.badges, ...fresh.map((b) => ({ id: b.id, date: Date.now() }))] } }))
    if (fresh.length) notify(`Novo emblema: ${fresh[0].icon} ${fresh[0].name}`)
    else if (levelUp) notify(`Você subiu para o nível ${lvl}! 🎉`)
  }, [me])

  const open = tasks.filter((t) => !t.done)
  const activeId = open.some((t) => t.id === focusId) ? focusId : open[0]?.id || null
  const done = tasks.length - open.length
  const stats = { done, open: open.length, percentage: tasks.length ? Math.round((done / tasks.length) * 100) : 0 }
  const minutes = Math.floor(me.focusSeconds / 60)

  const navigate = (p, t) => {
    if (p !== 'foco') timer.pause()
    if (p === 'perfil') setTab(typeof t === 'string' ? t : 'dados')
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const startFocus = (id) => { if (id) setFocusId(id); navigate('foco') }
  const closeTour = () => { updateMe((a) => ({ ...a, tourSeen: true })); setTour(false); navigate('inicio') }

  const toggle = (id) => {
    const t = tasks.find((x) => x.id === id)
    const gain = !t.done && !t.rewarded
    const pts = t.points ?? POINTS.task
    updateMe((a) => {
      const list = a.tasks.map((x) => (x.id === id ? { ...x, done: !x.done, rewarded: x.rewarded || !x.done } : x))
      const next = { ...a, tasks: list }
      return gain ? addXp(next, pts, `Concluiu: ${t.title}`, { tasksDone: 1 }) : next
    })
    notify(t.done ? 'Tarefa reaberta.' : gain ? `Tarefa concluída! +${pts} pts ⭐` : 'Tarefa concluída.')
  }
  const toggleStep = (id, i, checked) => {
    const t = tasks.find((x) => x.id === id)
    const gain = checked && !t.steps[i].rewarded
    updateMe((a) => {
      const list = a.tasks.map((x) => (x.id === id ? { ...x, steps: x.steps.map((s, n) => (n === i ? { ...s, done: checked, rewarded: s.rewarded || checked } : s)) } : x))
      const next = { ...a, tasks: list }
      return gain ? addXp(next, POINTS.step, `Etapa: ${t.steps[i].title}`) : next
    })
    notify(gain ? `Etapa concluída! +${POINTS.step} pts` : 'Etapa atualizada.')
  }
  const remove = (id) => {
    if (!confirm('Excluir esta tarefa? Esta ação não poderá ser desfeita.')) return
    updateMe((a) => ({ ...a, tasks: a.tasks.filter((t) => t.id !== id) }))
    notify('Tarefa excluída.')
  }
  const saveTask = ({ id, title, priority, due, stepTitles }) => {
    updateMe((a) => {
      const old = a.tasks.find((t) => t.id === id)
      const steps = stepTitles.map((v) => { const o = old?.steps.find((s) => s.title === v); return { title: v, done: o?.done || false, rewarded: o?.rewarded || false } })
      if (old) return { ...a, tasks: a.tasks.map((t) => (t.id === id ? { ...t, title, priority, due, steps } : t)) }
      return { ...a, tasks: [{ id: 't' + Date.now(), title, priority, due, steps, done: false, points: POINTS.task }, ...a.tasks] }
    })
    setDialog({ open: false, task: null })
    notify('Tarefa salva com sucesso.')
  }

  const setPref = (key, value) => {
    updateMe((a) => ({ ...a, prefs: { ...a.prefs, [key]: value } }))
    if (key === 'minutes') { setSessionMinutes(value); timer.setMinutes(value, 'Pronto para começar') }
    notify('Preferência salva.')
  }

  return (
    <Shell nav={NAV} page={page} onNavigate={navigate} me={me} onLogout={logout} steps={USER_STEPS} tour={tour} onTourClose={closeTour}>
      <Inicio active={page === 'inicio'} userName={me.profile.fullName || me.username} tasks={tasks} stats={stats} minutes={minutes} game={me.game} onToggle={toggle} onStartFocus={startFocus} onNavigate={navigate} />
      <Tarefas active={page === 'tarefas'} tasks={tasks} onNew={() => setDialog({ open: true, task: null })}
        onToggle={toggle} onToggleStep={toggleStep} onEdit={(t) => setDialog({ open: true, task: t })} onFocus={startFocus} onDelete={remove} />
      <Foco active={page === 'foco'} tasks={tasks} activeId={activeId} onSelect={(id) => { timer.pause(); setFocusId(id) }} timer={timer} minutes={sessionMinutes} onMinutes={(m) => { setSessionMinutes(m); timer.setMinutes(m) }} />
      <Progresso active={page === 'progresso'} stats={stats} minutes={minutes} />
      <PerfilUsuario active={page === 'perfil'} me={me} db={db} tab={tab} setTab={setTab} updateMe={updateMe} notify={notify} onPref={setPref} />
      <Config active={page === 'config'} me={me} onPref={setPref} onReplayTutorial={() => setTour(true)} />
      <Suporte active={page === 'suporte'} me={me} onReplayTutorial={() => setTour(true)} notify={notify} />
      <TaskDialog open={dialog.open} task={dialog.task} onClose={() => setDialog({ open: false, task: null })} onSave={saveTask} />
    </Shell>
  )
}
