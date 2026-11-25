import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// Cada passo aponta para um elemento marcado com data-tour="..." no app.
export const USER_STEPS = [
  { page: 'inicio', target: 'menu', title: 'Menu principal', text: 'Aqui você troca de tela: início, tarefas, modo foco e progresso.' },
  { page: 'inicio', target: 'proximo', title: 'Próximo passo', text: 'Mostra a tarefa sugerida. Um clique e o modo foco começa.' },
  { page: 'inicio', target: 'jornada', title: 'Sua jornada', text: 'Cada tarefa concluída e cada sessão de foco rendem pontos. Junte pontos para subir de nível!' },
  { page: 'tarefas', target: 'nova-tarefa', title: 'Nova tarefa', text: 'Crie uma tarefa com nome simples e, se quiser, divida em etapas pequenas. Seu responsável também pode enviar tarefas.' },
  { page: 'foco', target: 'foco-timer', title: 'Cronômetro', text: 'Inicie, pause ou reinicie quando quiser. Nada é apagado nem penalizado.' },
  { page: 'progresso', target: 'progresso-resumo', title: 'Seu ritmo', text: 'Números só para você se acompanhar, sem notas ou comparações.' },
  { page: 'inicio', target: 'avatar', title: 'Seu perfil', text: 'Clique na sua foto para abrir Perfil, Configurações, Suporte ou sair da conta.' },
  { page: 'perfil', tab: 'dados', target: 'perfil-codigo', title: 'Seu código', text: 'Passe este código ao seu responsável para ele se vincular a você e acompanhar seu progresso.' },
  { page: 'perfil', tab: 'conquistas', target: 'perfil-conquistas', title: 'Conquistas', text: 'Veja seu nível, sequência de dias e emblemas. Há também ranking e recompensas nas outras abas.' },
]

export const GUARDIAN_STEPS = [
  { page: 'painel', target: 'menu', title: 'Menu do responsável', text: 'Painel para acompanhar, atividades para enviar tarefas e recompensas para premiar.' },
  { page: 'painel', target: 'vincular', title: 'Vincular um usuário', text: 'Digite aqui o código que aparece no perfil do usuário. O vínculo é imediato.' },
  { page: 'painel', target: 'acompanhar', title: 'Acompanhar o progresso', text: 'Veja tarefas concluídas, minutos de foco, pontos, sequência e emblemas de quem você acompanha.' },
  { page: 'atividades', target: 'nova-atividade', title: 'Enviar atividades', text: 'Crie tarefas para o usuário e defina quantos pontos elas valem.' },
  { page: 'recompensas', target: 'recompensas-lista', title: 'Recompensas', text: 'Monte a lista de prêmios, entregue os pedidos e envie mimos surpresa.' },
  { page: 'painel', target: 'avatar', title: 'Seu perfil', text: 'Na sua foto ficam Perfil, Configurações, Suporte e Sair.' },
]

const PAD = 6
const GAP = 12

export default function Tutorial({ steps: STEPS, onNavigate, onClose }) {
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
    onNavigate(step.page, step.tab)
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
