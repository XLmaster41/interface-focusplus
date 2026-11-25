
export const PAGES = [
  ['inicio', 'Início'],
  ['tarefas', 'Minhas tarefas'],
  ['foco', 'Modo foco'],
  ['progresso', 'Meu progresso'],
  ['config', 'Configurações'],
]

export default function Header({ page, onNavigate, user, onLogout }) {
  return (
    <header>
      <div className="top">
        <div className="brand">
          <span className="logo" aria-hidden="true">✦</span> Focus<span className="plus">+</span>
        </div>
        <nav aria-label="Navegação principal" className="nav" data-tour="menu">
          {PAGES.map(([id, label]) => (
            <button key={id} aria-current={page === id ? 'page' : undefined} onClick={() => onNavigate(id)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="top-right">
          <span className="capsule">{user.role === 'responsavel' ? 'Responsável' : 'Usuário'} · {user.name}</span>
          <button className="btn small ghost" onClick={onLogout} aria-label={`Sair da conta de ${user.name}`}>Sair</button>
        </div>
      </div>
    </header>
  )
}
