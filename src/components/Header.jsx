<<<<<<< HEAD
import { AvatarMenu } from './Avatar.jsx'
import { levelInfo } from '../lib/game.js'

export default function Header({ nav, page, onNavigate, me, onLogout }) {
  const isUser = me.role === 'usuario'
=======
export const PAGES = [
  ['inicio', 'Início'],
  ['tarefas', 'Minhas tarefas'],
  ['foco', 'Modo foco'],
  ['progresso', 'Meu progresso'],
  ['config', 'Configurações'],
]

export default function Header({ page, onNavigate, user, onLogout }) {
>>>>>>> c954fcfc3220f4d4909fad464105bf939b37891c
  return (
    <header>
      <div className="top">
        <div className="brand">
          <span className="logo" aria-hidden="true">✦</span> Focus<span className="plus">+</span>
        </div>
        <nav aria-label="Navegação principal" className="nav" data-tour="menu">
<<<<<<< HEAD
          {nav.map(([id, label]) => (
            <button key={id} aria-current={page === id ? 'page' : undefined} onClick={() => onNavigate(id)}>{label}</button>
          ))}
        </nav>
        <div className="top-right">
          {isUser
            ? <button className="capsule pts" onClick={() => onNavigate('perfil', 'conquistas')} data-tour="pontos" aria-label="Ver conquistas">⭐ {me.game.points} pts · Nível {levelInfo(me.game.xp).level}</button>
            : <span className="capsule">Painel do responsável</span>}
          <AvatarMenu me={me} onNavigate={onNavigate} onLogout={onLogout} />
=======
          {PAGES.map(([id, label]) => (
            <button key={id} aria-current={page === id ? 'page' : undefined} onClick={() => onNavigate(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="top-right">
          <span className="capsule">{user.role === 'responsavel' ? 'Responsável' : 'Usuário'} · {user.name}</span>
          <button className="btn small ghost" onClick={onLogout} aria-label={`Sair da conta de ${user.name}`}>Sair</button>
>>>>>>> c954fcfc3220f4d4909fad464105bf939b37891c
        </div>
      </div>
    </header>
  )
}
