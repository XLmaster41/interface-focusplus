import { useState } from 'react'
import { Avatar } from '../components/Avatar.jsx'
import PhotoField from '../components/PhotoField.jsx'
import { BADGES, levelInfo, currentStreak } from '../lib/game.js'

const fmt = (t) => new Date(t).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
const nameOf = (a) => a.profile.fullName || a.username

export function LinkCard({ linked, onLink }) {
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState({ type: '', text: '' })
  const submit = (e) => {
    e.preventDefault()
    const r = onLink(code)
    if (r.error) setMsg({ type: 'error', text: r.error })
    else { setMsg({ type: 'ok', text: `Vinculado(a) a ${r.name}!` }); setCode('') }
  }
  return (
    <article className="card hero" data-tour="vincular">
      <div className="kicker">{linked ? 'Vincular outro usuário' : 'Primeiro passo'}</div>
      <h2>{linked ? 'Acompanhar mais alguém' : 'Digite o código do usuário'}</h2>
      <p>O código aparece no perfil do usuário (formato <strong>FP-XXXXX</strong>). Ao digitar, o vínculo é imediato.</p>
      <form className="link-form" onSubmit={submit}>
        <label htmlFor="link-code" className="sr-only">Código do usuário</label>
        <input id="link-code" className="code-input" placeholder="FP-XXXXX" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" />
        <button className="btn primary" type="submit">Vincular</button>
      </form>
      {msg.text && <p className={msg.type === 'error' ? 'form-error' : 'form-ok'} role={msg.type === 'error' ? 'alert' : 'status'} style={{ margin: '12px 0 0' }}>{msg.text}</p>}
    </article>
  )
}

export function UserPicker({ users, value, onChange }) {
  if (users.length < 2) return null
  return (
    <div className="pills" role="tablist" aria-label="Usuário acompanhado">
      {users.map((u) => <button key={u.key} role="tab" aria-selected={u.key === value} onClick={() => onChange(u.key)}><Avatar acc={u} size={24} /> {nameOf(u)}</button>)}
    </div>
  )
}

export function Painel({ active, me, users, current, onPick, onLink }) {
  const u = current
  const lv = u && levelInfo(u.game.xp)
  const done = u ? u.tasks.filter((t) => t.done).length : 0
  const have = u ? new Set(u.game.badges.map((b) => b.id)) : new Set()
  return (
    <section id="painel" className={`screen ${active ? 'active' : ''}`} aria-labelledby="titulo-painel">
      <p className="eyebrow">Acompanhamento</p>
      <h1 id="titulo-painel" className="title">Olá, {(me.profile.fullName || me.username).split(' ')[0]}!</h1>
      <p className="intro">Veja como está o progresso de quem você acompanha, sem pressão e sem comparações.</p>
      {!u && <LinkCard linked={false} onLink={onLink} />}
      {u && (
        <>
          <UserPicker users={users} value={u.key} onChange={onPick} />
          <div className="layout" data-tour="acompanhar">
            <div className="stack">
              <article className="card">
                <div className="person">
                  <Avatar acc={u} size={56} />
                  <div><h2 style={{ margin: 0 }}>{nameOf(u)}</h2><p className="hint" style={{ margin: 0 }}>Nível {lv.level} · {lv.title}</p></div>
                </div>
                <div className="bar big" style={{ marginTop: 14 }}><span style={{ width: `${lv.into}%` }} /></div>
                <p className="hint">{lv.into}/100 pontos para o próximo nível</p>
                <div className="statgrid">
                  <div className="stat"><strong>{done}</strong><span>Concluídas</span></div>
                  <div className="stat"><strong>{u.tasks.length - done}</strong><span>Pendentes</span></div>
                  <div className="stat"><strong>{Math.floor(u.focusSeconds / 60)}</strong><span>Min. de foco</span></div>
                </div>
                <div className="chipline" style={{ marginTop: 14 }}>
                  <span className="tag gold">⭐ {u.game.xp} pts no total</span>
                  <span className="tag">🔥 {currentStreak(u.game)} {currentStreak(u.game) === 1 ? 'dia seguido' : 'dias seguidos'}</span>
                  <span className="tag">🏅 {have.size}/{BADGES.length} emblemas</span>
                </div>
              </article>
              <article className="card">
                <h2>Tarefas</h2>
                {u.tasks.map((t) => (
                  <div key={t.id} className={`task ${t.done ? 'done' : ''}`}>
                    <span className="tag" aria-hidden="true">{t.done ? '✓' : '○'}</span>
                    <div className="taskbody"><h3>{t.title}</h3><small>{t.steps.filter((s) => s.done).length}/{t.steps.length} etapas{t.by ? ' · enviada por você' : ''}</small></div>
                    <span className="tag gold">+{t.points ?? 10}</span>
                  </div>
                ))}
                {!u.tasks.length && <p className="empty">Sem tarefas.</p>}
              </article>
            </div>
            <div className="stack">
              <article className="card">
                <h2>Atividade recente</h2>
                {u.game.log.slice(0, 8).map((l, i) => <div key={i} className="task"><div className="taskbody"><h3>{l.text}</h3><small>{fmt(l.t)}</small></div><span className={`tag ${l.pts < 0 ? '' : 'gold'}`}>{l.pts > 0 ? '+' : ''}{l.pts}</span></div>)}
                {!u.game.log.length && <p className="empty">Ainda sem atividade.</p>}
              </article>
              <article className="card">
                <h2>Emblemas</h2>
                <div className="chipline">{BADGES.filter((b) => have.has(b.id)).map((b) => <span key={b.id} className="tag" title={b.desc}>{b.icon} {b.name}</span>)}</div>
                {!have.size && <p className="empty" style={{ padding: 0 }}>Nenhum emblema ainda.</p>}
              </article>
              <LinkCard linked onLink={onLink} />
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export function Atividades({ active, users, current, onPick, onNew, onDelete }) {
  const mine = current ? current.tasks.filter((t) => t.by) : []
  return (
    <section id="atividades" className={`screen ${active ? 'active' : ''}`} aria-labelledby="titulo-atividades">
      <p className="eyebrow">Atividades</p>
      <h1 id="titulo-atividades" className="title">Enviar atividades</h1>
      <p className="intro">Crie tarefas pequenas e claras. Elas aparecem na lista do usuário com os pontos que você definir.</p>
      {!current && <div className="card"><p className="empty" style={{ padding: 0 }}>Vincule um usuário no Painel para enviar atividades.</p></div>}
      {current && (
        <>
          <UserPicker users={users} value={current.key} onChange={onPick} />
          <div className="card">
            <div className="section-head">
              <h2>Atividades para {nameOf(current)}</h2>
              <button className="btn primary" onClick={onNew} data-tour="nova-atividade">+ Nova atividade</button>
            </div>
            {mine.map((t) => (
              <div key={t.id} className={`task ${t.done ? 'done' : ''}`}>
                <span className="tag" aria-hidden="true">{t.done ? '✓' : '○'}</span>
                <div className="taskbody"><h3>{t.title}</h3><small>{t.done ? 'Concluída' : 'Pendente'} · Prioridade {t.priority}{t.due ? ` · Prazo ${t.due}` : ''} · {t.steps.length} etapa(s)</small></div>
                <span className="tag gold">+{t.points}</span>
                {!t.done && <button className="btn small danger" onClick={() => onDelete(t.id)}>Excluir</button>}
              </div>
            ))}
            {!mine.length && <p className="empty">Você ainda não enviou atividades para {nameOf(current)}.</p>}
          </div>
        </>
      )}
    </section>
  )
}

export function Recompensas({ active, me, users, onAdd, onRemove, onDeliver, onGift }) {
  const [title, setTitle] = useState('')
  const [cost, setCost] = useState(50)
  const [gift, setGift] = useState({ user: '', pts: 20, msg: '' })
  const orders = users.flatMap((u) => u.game.redeemed.filter((r) => r.guardian === me.key).map((r) => ({ ...r, u })))
  const pending = orders.filter((r) => r.status === 'pedido')
  const delivered = orders.filter((r) => r.status === 'entregue').slice(0, 5)
  const add = (e) => { e.preventDefault(); if (!title.trim()) return; onAdd(title.trim(), Number(cost) || 50); setTitle('') }
  const send = (e) => {
    e.preventDefault()
    const target = gift.user || users[0]?.key
    if (!target) return
    onGift(target, Number(gift.pts), gift.msg.trim()); setGift({ ...gift, msg: '' })
  }
  return (
    <section id="recompensas" className={`screen ${active ? 'active' : ''}`} aria-labelledby="titulo-recompensas">
      <p className="eyebrow">Motivação</p>
      <h1 id="titulo-recompensas" className="title">Recompensas</h1>
      <p className="intro">Monte a loja de prêmios, entregue os pedidos e surpreenda com mimos.</p>
      <div className="layout">
        <div className="stack">
          <article className="card" data-tour="recompensas-lista">
            <h2>Pedidos para entregar</h2>
            {pending.map((r) => (
              <div key={r.id} className="task">
                <Avatar acc={r.u} size={34} />
                <div className="taskbody"><h3>{r.title}</h3><small>{nameOf(r.u)} · {fmt(r.date)} · ⭐ {r.cost}</small></div>
                <button className="btn small primary" onClick={() => onDeliver(r.u.key, r.id)}>Marcar como entregue</button>
              </div>
            ))}
            {!pending.length && <p className="empty">Nenhum pedido aguardando.</p>}
            {delivered.length > 0 && <><h2 style={{ marginTop: 22 }}>Entregues recentemente</h2>{delivered.map((r) => <div key={r.id} className="task"><div className="taskbody"><h3>{r.title}</h3><small>{nameOf(r.u)}</small></div><span className="tag ok">Entregue ✓</span></div>)}</>}
          </article>
          <article className="card">
            <h2>Loja de recompensas</h2>
            {me.rewards.map((r) => (
              <div key={r.id} className="task"><div className="taskbody"><h3>{r.title}</h3></div><span className="tag gold">⭐ {r.cost}</span><button className="btn small danger" onClick={() => onRemove(r.id)}>Remover</button></div>
            ))}
            {!me.rewards.length && <p className="empty">Nenhuma recompensa cadastrada.</p>}
            <form onSubmit={add} className="form-grid" style={{ marginTop: 16 }}>
              <div className="field"><label htmlFor="rw-title">Nova recompensa</label><input id="rw-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Passeio no parque" maxLength={60} /></div>
              <div className="field"><label htmlFor="rw-cost">Custo (pontos)</label><input id="rw-cost" type="number" min="10" step="10" value={cost} onChange={(e) => setCost(e.target.value)} /></div>
              <div className="field span2"><button className="btn primary" type="submit">Adicionar à loja</button></div>
            </form>
          </article>
        </div>
        <article className="card">
          <h2>Enviar um mimo 💛</h2>
          <p className="hint" style={{ marginTop: 0 }}>Pontos extras com uma mensagem carinhosa, quando você quiser reconhecer o esforço.</p>
          {!users.length && <p className="empty" style={{ padding: 0 }}>Vincule um usuário para enviar mimos.</p>}
          {users.length > 0 && (
            <form onSubmit={send} className="form-grid">
              <div className="field span2"><label htmlFor="g-user">Para</label><select id="g-user" value={gift.user || users[0].key} onChange={(e) => setGift({ ...gift, user: e.target.value })}>{users.map((u) => <option key={u.key} value={u.key}>{nameOf(u)}</option>)}</select></div>
              <div className="field"><label htmlFor="g-pts">Pontos</label><select id="g-pts" value={gift.pts} onChange={(e) => setGift({ ...gift, pts: e.target.value })}>{[10, 20, 30, 50, 100].map((n) => <option key={n}>{n}</option>)}</select></div>
              <div className="field span2"><label htmlFor="g-msg">Mensagem</label><input id="g-msg" value={gift.msg} onChange={(e) => setGift({ ...gift, msg: e.target.value })} placeholder="Parabéns pelo esforço de hoje!" maxLength={80} /></div>
              <div className="field span2"><button className="btn primary" type="submit">Enviar mimo</button></div>
            </form>
          )}
        </article>
      </div>
    </section>
  )
}

export function PerfilResponsavel({ active, me, users, updateMe, onUnlink, notify }) {
  const [f, setF] = useState({ username: me.username, email: me.email, fullName: me.profile.fullName, phone: me.profile.phone })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    if (!f.username.trim()) return notify('O nome de usuário não pode ficar vazio.')
    updateMe((a) => ({ ...a, username: f.username.trim(), email: f.email.trim(), profile: { ...a.profile, fullName: f.fullName.trim(), phone: f.phone.trim() } }))
    notify('Dados salvos.')
  }
  return (
    <section id="perfil" className={`screen ${active ? 'active' : ''}`} aria-labelledby="titulo-perfil">
      <p className="eyebrow">Sua conta</p>
      <h1 id="titulo-perfil" className="title">Perfil do responsável</h1>
      <div className="layout">
        <form className="card" onSubmit={submit}>
          <h2>Seus dados</h2>
          <PhotoField acc={me} notify={notify} onChange={(photo) => updateMe((a) => ({ ...a, profile: { ...a.profile, photo } }))} />
          <div className="form-grid" style={{ marginTop: 20 }}>
            <div className="field"><label htmlFor="g-username">Nome de usuário</label><input id="g-username" value={f.username} onChange={set('username')} /></div>
            <div className="field"><label htmlFor="g-fullname">Nome completo</label><input id="g-fullname" value={f.fullName} onChange={set('fullName')} /></div>
            <div className="field"><label htmlFor="g-email">E-mail</label><input id="g-email" type="email" value={f.email} onChange={set('email')} /></div>
            <div className="field"><label htmlFor="g-phone">Telefone</label><input id="g-phone" value={f.phone} onChange={set('phone')} placeholder="(65) 90000-0000" /></div>
          </div>
          <div className="actions" style={{ marginTop: 18, justifyContent: 'flex-end' }}><button className="btn primary" type="submit">Salvar dados</button></div>
        </form>
        <article className="card">
          <h2>Usuários vinculados</h2>
          {users.map((u) => (
            <div key={u.key} className="task"><Avatar acc={u} size={34} /><div className="taskbody"><h3>{nameOf(u)}</h3><small>Código {u.linkCode}</small></div><button className="btn small danger" onClick={() => onUnlink(u.key)}>Desvincular</button></div>
          ))}
          {!users.length && <p className="empty" style={{ padding: 0 }}>Nenhum usuário vinculado. Use o Painel para digitar um código.</p>}
        </article>
      </div>
    </section>
  )
}
