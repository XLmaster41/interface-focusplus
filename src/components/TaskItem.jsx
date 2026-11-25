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
<<<<<<< HEAD
        <div className="chipline" style={{ margin: '6px 0 0' }}>
          <span className="tag gold">⭐ +{task.points ?? 10} pts</span>
          {task.by && <span className="tag">Do responsável{task.byName ? ` · ${task.byName}` : ''}</span>}
        </div>
=======
>>>>>>> c954fcfc3220f4d4909fad464105bf939b37891c
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
<<<<<<< HEAD
          {!task.by && <button className="btn small" onClick={() => onEdit(task)}>Editar</button>}
          <button className="btn small" onClick={() => onFocus(task.id)}>Focar</button>
          {!task.by && <button className="btn small danger" onClick={() => onDelete(task.id)}>Excluir</button>}
=======
          <button className="btn small" onClick={() => onEdit(task)}>Editar</button>
          <button className="btn small" onClick={() => onFocus(task.id)}>Focar</button>
          <button className="btn small danger" onClick={() => onDelete(task.id)}>Excluir</button>
>>>>>>> c954fcfc3220f4d4909fad464105bf939b37891c
        </div>
      </div>
    </div>
  )
}
