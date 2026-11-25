import { useEffect, useRef } from 'react'


export default function TaskDialog({ open, task, onClose, onSave }) {
  const ref = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    const d = ref.current
    if (open && !d.open) {
      formRef.current.reset()
      d.showModal()
      d.querySelector('#task-title').focus()
    }
    if (!open && d.open) d.close()
  }, [open])

  const submit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const title = String(f.get('title')).trim()
    if (!title) return
    onSave({
      id: task?.id,

      title,
      priority: f.get('priority'),
      due: f.get('due'),
      stepTitles: String(f.get('steps')).split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 20),
    })
  }

  return (
    <dialog ref={ref} aria-labelledby="dialog-title" onClose={onClose}>
      <div className="modal-head">

        <h2 id="dialog-title">{task ? 'Editar tarefa' : 'Nova tarefa'}</h2>
        <button className="btn small" onClick={onClose} aria-label="Fechar formulário">✕</button>
      </div>
      {/* key força o formulário a recarregar os valores a cada abertura */}
      <form ref={formRef} key={task?.id || 'nova'} onSubmit={submit}>
        <div className="form-grid">
          <div className="field span2">
            <label htmlFor="task-title">Nome da tarefa *</label>
            <input id="task-title" name="title" maxLength={100} required placeholder="Ex.: Estudar para a prova" defaultValue={task?.title || ''} />
          </div>
          <div className="field">
            <label htmlFor="task-priority">Prioridade</label>
            <select id="task-priority" name="priority" defaultValue={task?.priority || 'Normal'}>
              <option>Normal</option><option>Alta</option><option>Baixa</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="task-due">Prazo (opcional)</label>
            <input id="task-due" name="due" type="date" defaultValue={task?.due || ''} />
          </div>
          <div className="field span2">
            <label htmlFor="task-steps">Etapas (opcional)</label>
            <textarea id="task-steps" name="steps" rows={4} placeholder="Uma etapa por linha" defaultValue={task?.steps.map((s) => s.title).join('\n') || ''} />
            <div className="hint">Separe cada etapa em uma linha. Evite instruções longas.</div>
          </div>
        </div>
        <div className="actions" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
          <button type="button" className="btn" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn primary">Salvar tarefa</button>
        </div>
      </form>
    </dialog>
  )
}
