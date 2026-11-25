export function TaskRow({ task, onToggle }) {
  return (
    <div className={`task ${task.done ? 'done' : ''}`}>
      <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} aria-label={`Concluir ${task.title}`} />
      <div className="taskbody">
        <h3>{task.title}</h3>
        <small>{task.steps.length} etapa(s)</small>
      </div>
      <span className="tag">{task.priority}</span>
    </div>
  )
}

export function TaskFull({ task, onToggle, onToggleStep, onEdit, onFocus, onDelete }) {
  return (
    <div className={`task ${task.done ? 'done' : ''}`}>
      <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} aria-label={`Marcar tarefa ${task.title}`} />
      <div className="taskbody">
        <h3>{task.title}</h3>
        <small>Prioridade {task.priority}{task.due ? ` · Prazo ${task.due}` : ''}</small>
        {task.steps.length > 0 && (
          <ul className="substeps">
            {task.steps.map((s, i) => (
              <li key={i}>
                <label>
                  <input type="checkbox" checked={s.done} onChange={(e) => onToggleStep(task.id, i, e.target.checked)} /> {s.title}
                </label>
              </li>
            ))}
          </ul>
        )}
        <div className="actions" style={{ marginTop: 9 }}>
          <button className="btn small" onClick={() => onEdit(task)}>Editar</button>
          <button className="btn small" onClick={() => onFocus(task.id)}>Focar</button>
          <button className="btn small danger" onClick={() => onDelete(task.id)}>Excluir</button>
        </div>
      </div>
    </div>
  )
}
