import { AvatarMenu } from './Avatar.jsx'
import { levelInfo } from '../lib/game.js'

export default function Header({ nav, page, onNavigate, me, onLogout }) {
  const isUser = me.role === 'usuario'
  return (
    <header>
      <div className="top">
        <div className="brand">
          <span className="logo" aria-hidden="true">✦</span> Focus<span className="plus">+</span>
        </div>
        <nav aria-label="Navegação principal" className="nav" data-tour="menu">
          {nav.map(([id, label]) => (
            <button key={id} aria-current={page === id ? 'page' : undefined} onClick={() => onNavigate(id)}>{label}</button>
          ))}
        </nav>
        <div className="top-right">
          {isUser
            ? <button className="capsule pts" onClick={() => onNavigate('perfil', 'conquistas')} data-tour="pontos" aria-label="Ver conquistas">⭐ {me.game.points} pts · Nível {levelInfo(me.game.xp).level}</button>
            : <span className="capsule">Painel do responsável</span>}
          <AvatarMenu me={me} onNavigate={onNavigate} onLogout={onLogout} />
        </div>
      </div>
    </header>
  )
}
