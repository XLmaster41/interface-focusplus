import { useState } from 'react'
import Shell from './components/Shell.jsx'
import TaskDialog from './components/TaskDialog.jsx'
import { GUARDIAN_STEPS } from './components/Tutorial.jsx'
import Config from './pages/Config.jsx'
import Suporte from './pages/Suporte.jsx'
import { Painel, Atividades, Recompensas, PerfilResponsavel } from './pages/guardian.jsx'
import { addXp, POINTS } from './lib/game.js'

const NAV = [['painel', 'Painel'], ['atividades', 'Atividades'], ['recompensas', 'Recompensas']]

export default function GuardianApp({ me, db, api }) {
  const { updateMe, updateAcc, notify, logout, linkByCode, unlink } = api
  const [page, setPage] = useState('painel')
  const [pick, setPick] = useState(null)
  const [dialog, setDialog] = useState(false)
  const [tour, setTour] = useState(!me.tourSeen)

  const users = me.linked.map((k) => db.accounts[k]).filter(Boolean)
  const current = users.find((u) => u.key === pick) || users[0] || null

  const navigate = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'instant' }) }
  const closeTour = () => { updateMe((a) => ({ ...a, tourSeen: true })); setTour(false); navigate('painel') }

  const addTask = ({ title, priority, due, stepTitles, points }) => {
    updateAcc(current.key, (u) => ({
      ...u,
      tasks: [{ id: 'g' + Date.now(), title, priority, due, steps: stepTitles.map((t) => ({ title: t, done: false })), done: false, points: points || POINTS.guardianTask, by: me.key, byName: me.profile.fullName || me.username }, ...u.tasks],
    }))
    setDialog(false)
    notify('Atividade enviada!')
  }
  const delTask = (id) => {
    if (!confirm('Excluir esta atividade enviada?')) return
    updateAcc(current.key, (u) => ({ ...u, tasks: u.tasks.filter((t) => t.id !== id) }))
    notify('Atividade excluída.')
  }
  const addReward = (title, cost) => { updateMe((a) => ({ ...a, rewards: [...a.rewards, { id: 'w' + Date.now(), title, cost }] })); notify('Recompensa adicionada.') }
  const rmReward = (id) => { updateMe((a) => ({ ...a, rewards: a.rewards.filter((r) => r.id !== id) })); notify('Recompensa removida.') }
  const deliver = (userKey, orderId) => {
    updateAcc(userKey, (u) => ({ ...u, game: { ...u.game, redeemed: u.game.redeemed.map((r) => (r.id === orderId ? { ...r, status: 'entregue' } : r)) } }))
    notify('Marcado como entregue ✓')
  }
  const gift = (userKey, pts, msg) => {
    updateAcc(userKey, (u) => addXp(u, pts, `Mimo de ${me.profile.fullName || me.username}${msg ? `: ${msg}` : ''}`))
    notify(`Mimo de +${pts} pts enviado! 💛`)
  }
  const setPref = (key, value) => { updateMe((a) => ({ ...a, prefs: { ...a.prefs, [key]: value } })); notify('Preferência salva.') }

  return (
    <Shell nav={NAV} page={page} onNavigate={navigate} me={me} onLogout={logout} steps={GUARDIAN_STEPS} tour={tour} onTourClose={closeTour}>
      <Painel active={page === 'painel'} me={me} users={users} current={current} onPick={setPick} onLink={(c) => linkByCode(me.key, c)} />
      <Atividades active={page === 'atividades'} users={users} current={current} onPick={setPick} onNew={() => setDialog(true)} onDelete={delTask} />
      <Recompensas active={page === 'recompensas'} me={me} users={users} onAdd={addReward} onRemove={rmReward} onDeliver={deliver} onGift={gift} />
      <PerfilResponsavel active={page === 'perfil'} me={me} users={users} updateMe={updateMe} onUnlink={(k) => unlink(me.key, k)} notify={notify} />
      <Config active={page === 'config'} me={me} onPref={setPref} onReplayTutorial={() => setTour(true)} />
      <Suporte active={page === 'suporte'} me={me} onReplayTutorial={() => setTour(true)} notify={notify} />
      <TaskDialog open={dialog} task={null} withPoints heading={`Nova atividade para ${current ? (current.profile.fullName || current.username) : ''}`} onClose={() => setDialog(false)} onSave={addTask} />
    </Shell>
  )
}
