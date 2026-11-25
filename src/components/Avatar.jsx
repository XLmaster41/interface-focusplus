import { useEffect, useRef, useState } from 'react'

export function Avatar({ acc, size = 38 }) {
  const name = acc.profile.fullName || acc.username || '?'
  const initials = name.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.4 }} aria-hidden="true">
      {acc.profile.photo ? <img src={acc.profile.photo} alt="" /> : initials}
    </span>
  )
}

export function AvatarMenu({ me, onNavigate, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const away = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc) }
  }, [open])

  const go = (p) => { setOpen(false); onNavigate(p) }
  const items = [['perfil', 'Perfil'], ['config', 'Configurações'], ['suporte', 'Suporte']]

  return (
    <div className="menu-wrap" ref={ref}>
      <button className="avatar-btn" data-tour="avatar" aria-haspopup="menu" aria-expanded={open} aria-label="Abrir menu do perfil" onClick={() => setOpen(!open)}>
        <Avatar acc={me} />
      </button>
      {open && (
        <div className="menu" role="menu">
          <div className="menu-head">
            <strong>{me.profile.fullName || me.username}</strong>
            <span>{me.role === 'responsavel' ? 'Responsável' : 'Usuário'}</span>
          </div>
          {items.map(([id, label]) => <button key={id} role="menuitem" onClick={() => go(id)}>{label}</button>)}
          <hr />
          <button role="menuitem" className="danger" onClick={() => { setOpen(false); onLogout() }}>Sair da conta</button>
        </div>
      )}
    </div>
  )
}
