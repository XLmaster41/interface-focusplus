export default function Progresso({ active, stats, minutes }) {
  return (
    <section id="progresso" className={`screen ${active ? 'active' : ''}`} aria-labelledby="titulo-progresso">
      <p className="eyebrow">Cada etapa conta</p>
      <h1 id="titulo-progresso" className="title">Meu progresso</h1>
      <p className="intro">Um resumo para compreender seu próprio ritmo, sem comparações ou punições.</p>
      <div data-tour="progresso-resumo">
        <div className="statgrid" style={{ marginBottom: 22 }}>
          <div className="stat"><strong>{stats.done}</strong><span>Tarefas concluídas</span></div>
          <div className="stat"><strong>{stats.percentage}%</strong><span>Concluídas no total</span></div>
          <div className="stat"><strong>{minutes}</strong><span>Minutos registrados</span></div>
        </div>
      </div>
      <div className="card">
        <h2>Visão das atividades</h2>
        <div className="progress-bars">
          <div>
            <div className="bar-label"><span>Concluídas</span><span>{stats.done}</span></div>
            <div className="bar"><span style={{ width: `${stats.percentage}%` }} /></div>
          </div>
          <div>
            <div className="bar-label"><span>Pendentes</span><span>{stats.open}</span></div>
            <div className="bar"><span style={{ width: `${100 - stats.percentage}%`, background: 'var(--gold)' }} /></div>
          </div>
        </div>
        <p className="hint">Indicadores apenas informativos. O Focus+ não atribui notas ao usuário.</p>
      </div>
    </section>
  )
}
