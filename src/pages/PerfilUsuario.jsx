import { useState } from 'react'
import PhotoField from '../components/PhotoField.jsx'
import { Avatar } from '../components/Avatar.jsx'
import { BADGES, DEMO_PLAYERS, levelInfo, currentStreak } from '../lib/game.js'
import { isEmail } from '../lib/auth.js'

const TABS = [['dados', 'Meus dados'], ['conquistas', 'Conquistas'], ['ranking', 'Ranking'], ['recompensas', 'Recompensas']]
const fmt = (t) => new Date(t).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })

function Dados({ me, guardians, updateMe, notify }) {
  const [f, setF] = useState({ username: me.username, email: me.email, fullName: me.profile.fullName, birth: me.profile.birth, bio: me.profile.bio })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const copy = async () => {
    try { await navigator.clipboard.writeText(me.linkCode); notify('Código copiado.') } catch { notify('Selecione e copie o código manualmente.') }
  }
  const submit = (e) => {
    e.preventDefault()
    if (!f.username.trim()) return notify('O nome de usuário não pode ficar vazio.')
    if (f.email && !isEmail(f.email)) return notify('Digite um e-mail válido.')
    updateMe((a) => ({ ...a, username: f.username.trim(), email: f.email.trim(), profile: { ...a.profile, fullName: f.fullName.trim(), birth: f.birth, bio: f.bio.trim() } }))
    notify('Dados salvos.')
  }
  return (
    <div className="layout">
      <form className="card" onSubmit={submit}>
        <h2>Seus dados</h2>
        <PhotoField acc={me} notify={notify} onChange={(photo) => updateMe((a) => ({ ...a, profile: { ...a.profile, photo } }))} />
        <div className="form-grid" style={{ marginTop: 20 }}>
          <div className="field"><label htmlFor="p-user">Nome de usuário</label><input id="p-user" value={f.username} onChange={set('username')} /></div>
          <div className="field"><label htmlFor="p-name">Nome completo</label><input id="p-name" value={f.fullName} onChange={set('fullName')} /></div>
          <div className="field"><label htmlFor="p-email">E-mail</label><input id="p-email" type="email" value={f.email} onChange={set('email')} /></div>
          <div className="field"><label htmlFor="p-birth">Data de nascimento</label><input id="p-birth" type="date" value={f.birth} onChange={set('birth')} /></div>
          <div className="field span2"><label htmlFor="p-bio">Sobre mim</label><textarea id="p-bio" rows={3} maxLength={200} value={f.bio} onChange={set('bio')} placeholder="Do que você gosta? O que ajuda você a focar?" /></div>
        </div>
        <div className="actions" style={{ marginTop: 18, justifyContent: 'flex-end' }}><button className="btn primary" type="submit">Salvar dados</button></div>
      </form>
      <div className="stack">
        <article className="card code-card" data-tour="perfil-codigo">
          <div className="kicker">Seu código de vínculo</div>
          <div className="code-box" aria-label={`Código ${me.linkCode}`}>{me.linkCode}</div>
          <p className="hint">Passe este código ao seu responsável. Ele digita no painel dele e vocês ficam vinculados.</p>
          <button className="btn small" onClick={copy}>Copiar código</button>
        </article>
        <article className="card">
          <h2>Responsável vinculado</h2>
          {guardians.length
            ? guardians.map((g) => <div key={g.key} className="task"><Avatar acc={g} size={34} /><div className="taskbody"><h3>{g.profile.fullName || g.username}</h3><small>Acompanha seu progresso</small></div></div>)
            : <p className="empty" style={{ padding: 0 }}>Ninguém vinculado ainda.</p>}
        </article>
      </div>
    </div>
  )
}

function Conquistas({ me }) {
  const lv = levelInfo(me.game.xp)
  const streak = currentStreak(me.game)
  const have = new Set(me.game.badges.map((b) => b.id))
  return (
    <div className="stack">
      <article className="card level-card" data-tour="perfil-conquistas">
        <div className="level-top">
          <div className="level-orb" aria-hidden="true">{lv.level}</div>
          <div>
            <div className="kicker" style={{ marginBottom: 2 }}>Nível {lv.level}</div>
            <h2 style={{ margin: 0 }}>{lv.title}</h2>
          </div>
        </div>
        <div className="bar big"><span style={{ width: `${lv.into}%` }} /></div>
        <p className="hint">{lv.into}/100 pontos de experiência · faltam {100 - lv.into} para o nível {lv.level + 1}</p>
        <div className="statgrid">
          <div className="stat"><strong>⭐ {me.game.points}</strong><span>Pontos para gastar</span></div>
          <div className="stat"><strong>🔥 {streak}</strong><span>{streak === 1 ? 'Dia seguido' : 'Dias seguidos'}</span></div>
          <div className="stat"><strong>{have.size}/{BADGES.length}</strong><span>Emblemas</span></div>
        </div>
      </article>
      <article className="card">
        <h2>Emblemas</h2>
        <div className="badge-grid">
          {BADGES.map((b) => (
            <div key={b.id} className={`badge ${have.has(b.id) ? 'on' : ''}`}>
              <span className="badge-icon" aria-hidden="true">{have.has(b.id) ? b.icon : '🔒'}</span>
              <strong>{b.name}</strong>
              <small>{b.desc}</small>
            </div>
          ))}
        </div>
      </article>
      <article className="card">
        <h2>Últimas conquistas</h2>
        {me.game.log.slice(0, 6).map((l, i) => (
          <div key={i} className="task"><div className="taskbody"><h3>{l.text}</h3><small>{fmt(l.t)}</small></div><span className="tag gold">+{l.pts} pts</span></div>
        ))}
        {!me.game.log.length && <p className="empty">Conclua uma tarefa para ver seus pontos aqui.</p>}
      </article>
    </div>
  )
}

function Ranking({ me, db, onPref }) {
  if (me.prefs.showRanking === false) {
    return <div className="card"><h2>Ranking escondido</h2><p className="hint">Você escolheu não ver o ranking. Seus pontos continuam valendo.</p><button className="btn" onClick={() => onPref('showRanking', true)}>Mostrar ranking</button></div>
  }
  const real = Object.values(db.accounts).filter((a) => a.role === 'usuario').map((a) => ({ id: a.key, name: a.profile.fullName || a.username, xp: a.game.xp, you: a.key === me.key, acc: a }))
  const demo = DEMO_PLAYERS.map((p) => ({ id: 'demo' + p.name, name: p.name, xp: p.xp, demo: true }))
  const list = [...real, ...demo].sort((a, b) => b.xp - a.xp)
  const pos = list.findIndex((p) => p.you) + 1
  const medal = ['🥇', '🥈', '🥉']
  return (
    <div className="card">
      <h2>Ranking de pontos</h2>
      <p className="hint" style={{ marginTop: 0 }}>Você está em <strong>{pos}º lugar</strong>. O que importa é o seu avanço. Participantes “demo” são só para ilustrar.</p>
      {list.map((p, i) => (
        <div key={p.id} className={`task rank ${p.you ? 'you' : ''}`}>
          <span className="rank-pos" aria-label={`${i + 1}º lugar`}>{medal[i] || i + 1}</span>
          <div className="taskbody"><h3>{p.name}{p.you ? ' (você)' : ''}</h3>{p.demo && <small>demo</small>}</div>
          <span className="tag gold">{p.xp} pts</span>
        </div>
      ))}
    </div>
  )
}

function Recompensas({ me, guardians, updateMe, notify }) {
  const catalog = guardians.flatMap((g) => g.rewards.map((r) => ({ ...r, guardian: g.key, by: g.profile.fullName || g.username })))
  const redeem = (r) => {
    if (me.game.points < r.cost) return notify('Pontos insuficientes ainda. Continue assim!')
    updateMe((a) => ({
      ...a,
      game: {
        ...a.game, points: a.game.points - r.cost,
        redeemed: [{ id: 'r' + Date.now(), rewardId: r.id, title: r.title, cost: r.cost, guardian: r.guardian, status: 'pedido', date: Date.now() }, ...a.game.redeemed],
        log: [{ t: Date.now(), text: `Resgatou: ${r.title}`, pts: -r.cost }, ...a.game.log].slice(0, 40),
      },
    }))
    notify('Pedido enviado ao responsável! 🎁')
  }
  return (
    <div className="layout">
      <div className="card">
        <h2>Loja de recompensas</h2>
        <p className="hint" style={{ marginTop: 0 }}>Você tem <strong>⭐ {me.game.points} pontos</strong> para gastar.</p>
        {catalog.map((r) => (
          <div key={r.guardian + r.id} className="task">
            <div className="taskbody"><h3>{r.title}</h3><small>Oferecido por {r.by}</small></div>
            <button className="btn small primary" disabled={me.game.points < r.cost} onClick={() => redeem(r)}>⭐ {r.cost} · Resgatar</button>
          </div>
        ))}
        {!catalog.length && <p className="empty">Vincule um responsável para liberar as recompensas. Passe seu código em “Meus dados”.</p>}
      </div>
      <div className="card">
        <h2>Meus pedidos</h2>
        {me.game.redeemed.map((r) => (
          <div key={r.id} className="task"><div className="taskbody"><h3>{r.title}</h3><small>{fmt(r.date)} · ⭐ {r.cost}</small></div><span className={`tag ${r.status === 'entregue' ? 'ok' : ''}`}>{r.status === 'entregue' ? 'Entregue ✓' : 'Aguardando'}</span></div>
        ))}
        {!me.game.redeemed.length && <p className="empty">Nenhum pedido ainda.</p>}
      </div>
    </div>
  )
}

export default function PerfilUsuario({ active, me, db, tab, setTab, updateMe, notify, onPref }) {
  const guardians = me.guardians.map((k) => db.accounts[k]).filter(Boolean)
  return (
    <section id="perfil" className={`screen ${active ? 'active' : ''}`} aria-labelledby="titulo-perfil">
      <p className="eyebrow">Sua conta e sua jornada</p>
      <h1 id="titulo-perfil" className="title">Perfil</h1>
      <div className="tabs" role="tablist" aria-label="Seções do perfil">
        {TABS.map(([id, label]) => <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>{label}</button>)}
      </div>
      {tab === 'dados' && <Dados me={me} guardians={guardians} updateMe={updateMe} notify={notify} />}
      {tab === 'conquistas' && <Conquistas me={me} />}
      {tab === 'ranking' && <Ranking me={me} db={db} onPref={onPref} />}
      {tab === 'recompensas' && <Recompensas me={me} guardians={guardians} updateMe={updateMe} notify={notify} />}
    </section>
  )
}
