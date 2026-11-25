export default function Foco({ active, tasks, activeId, onSelect, timer, minutes, onMinutes }) {
  const open = tasks.filter((t) => !t.done)
  const current = tasks.find((t) => t.id === activeId)
  return (
    <section id="foco" className={`screen ${active ? 'active' : ''}`} aria-labelledby="titulo-foco">
      <p className="eyebrow">Atenção ao que importa</p>
      <h1 id="titulo-foco" className="title">Modo foco</h1>
      <p className="intro">Uma atividade por vez. O tempo pode ser adaptado às suas preferências.</p>
      <div className="card focusbox">
        <div className="kicker">Atividade atual</div>
        <div className="activity">{current?.title || 'Cadastre uma tarefa para começar'}</div>
        <div className="session-options" data-tour="foco-opcoes">
          <label htmlFor="focus-select">Tarefa</label>
          <select id="focus-select" value={activeId || ''} onChange={(e) => onSelect(e.target.value)}>
            {open.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            {!open.length && <option value="">Sem tarefas pendentes</option>}
          </select>
          <label htmlFor="minutes">Duração</label>
          <select id="minutes" value={minutes} onChange={(e) => onMinutes(Number(e.target.value))}>
            {[5, 15, 25, 40, 50].map((m) => <option key={m} value={m}>{m} min</option>)}
          </select>
        </div>
        <div data-tour="foco-timer">
          <div className="time" aria-label="Tempo restante">{timer.clock}</div>
          <p className="timer-label" aria-live="polite">{timer.status}</p>
          <div className="actions" style={{ justifyContent: 'center' }}>
            <button className="btn primary" onClick={timer.start} disabled={!activeId || timer.running}>▶ Iniciar</button>
            <button className="btn" onClick={timer.pause} disabled={!timer.running}>⏸ Pausar</button>
            <button className="btn" onClick={timer.reset}>↺ Reiniciar</button>
          </div>
        </div>
        <p className="focus-notice">O cronômetro não apaga tarefas nem penaliza interrupções.</p>
      </div>
    </section>
  )
}
