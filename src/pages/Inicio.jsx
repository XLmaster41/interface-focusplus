import { TaskRow } from '../components/TaskItem.jsx'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'
}

export default function Inicio({ active, userName, tasks, stats, minutes, onToggle, onNavigate }) {
  const next = tasks.find((t) => !t.done)
  const first = userName.split(' ')[0]
  return (
    <section id="inicio" className={`screen ${active ? 'active' : ''}`} aria-labelledby="titulo-inicio">
      <p className="eyebrow">Seu espaço de organização</p>
      <h1 id="titulo-inicio" className="title">{greeting()}, {first}! Vamos começar com calma.</h1>
      <p className="intro">Você não precisa fazer tudo agora. Escolha uma atividade e avance no seu ritmo.</p>
      <div className="layout">
        <div className="stack">
          <article className="card hero" data-tour="proximo">
            <div className="kicker">Próximo passo</div>
            <h2>{next?.title || 'Você está em dia!'}</h2>

            <p>{tasks.some((t) => !t.done) ? 'Você pode começar por esta atividade ou escolher outra.' : 'Nenhuma tarefa pendente no momento.'}</p>
            <button className="btn primary" onClick={() => onNavigate('foco', next?.id)}>▶ Iniciar modo foco</button>
          </article>
          <article className="card">
            <div className="section-head">
              <h2>Tarefas do dia</h2>
              <button className="btn small" onClick={() => onNavigate('tarefas')}>Ver todas →</button>
            </div>
            {tasks.slice(0, 4).map((t) => <TaskRow key={t.id} task={t} onToggle={onToggle} />)}
            {!tasks.length && <p className="empty">Nenhuma tarefa cadastrada.</p>}
          </article>
        </div>
        <div className="stack">

          <div className="statgrid" data-tour="resumo">
            <div className="stat"><strong>{stats.done}</strong><span>Concluídas</span></div>
            <div className="stat"><strong>{stats.open}</strong><span>Pendentes</span></div>
            <div className="stat"><strong>{minutes}</strong><span>Min. de foco</span></div>
          </div>
          <article className="card">
            <h2>Dica para hoje</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 0 }}>Se uma tarefa parecer grande, divida-a em pequenas etapas. Você pode pausar e retomar a qualquer momento.</p>
          </article>
          <article className="card">
            <h2>Seu progresso</h2>
            <p className="hint">Atividades concluídas</p>
            <div className="bar"><span style={{ width: `${stats.percentage}%` }} /></div>
            <p className="hint">{stats.percentage}% concluído</p>
          </article>
        </div>
      </div>
    </section>
  )
}
