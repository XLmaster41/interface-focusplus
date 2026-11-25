import { useState } from 'react'
import { TaskFull } from '../components/TaskItem.jsx'

const FILTERS = [['todas', 'Todas'], ['pendentes', 'Pendentes'], ['concluidas', 'Concluídas']]

export default function Tarefas({ active, tasks, onNew, ...handlers }) {
  const [filter, setFilter] = useState('todas')
  const list = tasks.filter((t) => filter === 'todas' || (filter === 'pendentes' ? !t.done : t.done))
  return (
    <section id="tarefas" className={`screen ${active ? 'active' : ''}`} aria-labelledby="titulo-tarefas">
      <p className="eyebrow">Organização sem excesso</p>
      <h1 id="titulo-tarefas" className="title">Minhas tarefas</h1>
      <p className="intro">Dê um nome simples à tarefa e separe em etapas quando precisar.</p>
      <div className="card">
        <div className="section-head">
          <h2>Lista de atividades</h2>
          <button className="btn primary" onClick={onNew} data-tour="nova-tarefa">+ Nova tarefa</button>
        </div>
        <div className="filters" aria-label="Filtrar tarefas">
          {FILTERS.map(([id, label]) => (
            <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>
          ))}
        </div>
        {list.map((t) => <TaskFull key={t.id} task={t} {...handlers} />)}
        {!list.length && <p className="empty">Nenhuma tarefa neste filtro.</p>}
      </div>
    </section>
  )
}
