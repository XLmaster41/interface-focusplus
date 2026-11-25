import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// Cada passo aponta para um elemento marcado com data-tour="..." no app.
export const STEPS = [
  { page: 'inicio', target: 'menu', title: 'Menu principal', text: 'Aqui você troca de tela: tarefas, modo foco, progresso e configurações.' },
  { page: 'inicio', target: 'proximo', title: 'Próximo passo', text: 'Mostra a tarefa sugerida. Um clique e o modo foco começa.' },
  { page: 'inicio', target: 'resumo', title: 'Resumo rápido', text: 'Quantas tarefas você concluiu, quantas faltam e quantos minutos já focou.' },
  { page: 'tarefas', target: 'nova-tarefa', title: 'Nova tarefa', text: 'Crie uma tarefa com nome simples e, se quiser, divida em etapas pequenas.' },
  { page: 'foco', target: 'foco-opcoes', title: 'Escolha e ajuste', text: 'Selecione a tarefa e a duração da sessão. Uma atividade por vez.' },
  { page: 'foco', target: 'foco-timer', title: 'Cronômetro', text: 'Inicie, pause ou reinicie quando quiser. Nada é apagado nem penalizado.' },
  { page: 'progresso', target: 'progresso-resumo', title: 'Seu ritmo', text: 'Números só para você se acompanhar, sem notas ou comparações.' },
  { page: 'config', target: 'config-card', title: 'Do seu jeito', text: 'Tema escuro, texto maior, tempo padrão de foco e som. Você também pode rever este tutorial aqui.' },
]

const PAD = 6
const GAP = 12

export default function Tutorial({ onNavigate, onClose }) {
  const [i, setI] = useState(0)
  const [rect, setRect] = useState(null)
  const [pos, setPos] = useState({ left: 12, top: 12 })
  const cardRef = useRef(null)
  const step = STEPS[i]
  const last = i === STEPS.length - 1

  const measure = () => {
    const el = document.querySelector(`[data-tour="${step.target}"]`)
    if (!el) return setRect(null)
    const r = el.getBoundingClientRect()
    setRect({ left: r.left - PAD, top: r.top - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 })
  }

  // Ao mudar de passo: troca de tela, rola até o alvo e mede.
  useEffect(() => {
    onNavigate(step.page)
    const t = setTimeout(() => {
      const el = document.querySelector(`[data-tour="${step.target}"]`)
      if (el) {
        const small = window.innerWidth <= 550
        el.scrollIntoView({ block: small ? 'start' : 'center', behavior: 'instant' })
        if (small) window.scrollBy(0, -((document.querySelector('header')?.offsetHeight || 96) + 12))
      }
      measure()
    }, 60)
    return () => clearTimeout(t)
  }, [i])

  useEffect(() => {
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    const key = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') setI((v) => Math.max(0, v - 1))
    }
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
      window.removeEventListener('keydown', key)
    }
  })

  // Posiciona o quadradinho perto do alvo, sem sair da tela.
  useLayoutEffect(() => {
    const card = cardRef.current
    if (!card) return
    const w = card.offsetWidth, h = card.offsetHeight
    const vw = window.innerWidth, vh = window.innerHeight
    if (!rect) return setPos({ left: (vw - w) / 2, top: (vh - h) / 2 })
    const clampX = (x) => Math.min(Math.max(12, x), vw - w - 12)
    const below = rect.top + rect.height + GAP
    const above = rect.top - h - GAP
    let top
    if (below + h <= vh - 12) top = below
    else if (above >= 12) top = above
    else top = Math.max(12, vh - h - 12) // alvo muito grande: fica na base
    setPos({ left: clampX(rect.left), top })
  }, [rect, i])

  function next() {
    if (last) onClose()
    else setI((v) => v + 1)
  }

  return (
    <>
      <div className="tour-blocker" onClick={(e) => e.stopPropagation()} />
      {rect && <div className="tour-spot" style={rect} />}
      <div ref={cardRef} className="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-title" style={pos}>
        <p className="tour-step">Passo {i + 1} de {STEPS.length}</p>
        <h2 id="tour-title">{step.title}</h2>
        <p className="tour-text">{step.text}</p>
        <div className="tour-dots" aria-hidden="true">
          {STEPS.map((_, n) => <i key={n} className={n === i ? 'on' : ''} />)}
        </div>
        <div className="tour-foot">
          <button className="btn small ghost" onClick={onClose}>Pular tutorial</button>
          <div className="actions">
            {i > 0 && <button className="btn small" onClick={() => setI(i - 1)}>Voltar</button>}
            <button className="btn small primary" onClick={next} autoFocus>{last ? 'Concluir' : 'Próximo'}</button>
          </div>
        </div>
      </div>
    </>
  )
}
