import { useState } from 'react'

const COMMON = [
  ['Esqueci minha senha. E agora?', 'Neste protótipo os dados ficam só no seu navegador, então não há recuperação por e-mail. Crie uma nova conta ou limpe os dados do site.'],
  ['Meus dados vão para algum servidor?', 'Não. Tudo é guardado no localStorage deste navegador e nada é enviado pela internet.'],
]
const USER_FAQ = [
  ['Como ganho pontos?', 'Concluindo tarefas (+10), etapas (+2), sessões de foco completas (+25) e atividades enviadas pelo responsável (valor definido por ele).'],
  ['Como meu responsável me acompanha?', 'Passe o código que aparece em Perfil → Meus dados. Quando ele digitar o código, vocês ficam vinculados.'],
  ['Como resgato recompensas?', 'Em Perfil → Recompensas, escolha um prêmio e gaste seus pontos. O responsável marca como entregue.'],
]
const GUARDIAN_FAQ = [
  ['Como me vinculo a um usuário?', 'Peça o código do perfil dele (formato FP-XXXXX) e digite no Painel, em "Vincular usuário".'],
  ['Como crio recompensas?', 'Na aba Recompensas, adicione o prêmio e o custo em pontos. Quando o usuário resgatar, o pedido aparece para você entregar.'],
  ['O que são mimos?', 'Pontos extras com uma mensagem carinhosa que você pode enviar a qualquer momento.'],
]

export default function Suporte({ active, me, onReplayTutorial, notify }) {
  const [subject, setSubject] = useState('')
  const [msg, setMsg] = useState('')
  const faq = [...(me.role === 'usuario' ? USER_FAQ : GUARDIAN_FAQ), ...COMMON]
  const send = (e) => {
    e.preventDefault()
    if (!msg.trim()) return notify('Escreva sua mensagem antes de enviar.')
    setSubject(''); setMsg('')
    notify('Mensagem registrada. (Protótipo: nada foi enviado.)')
  }
  return (
    <section id="suporte" className={`screen ${active ? 'active' : ''}`} aria-labelledby="titulo-suporte">
      <p className="eyebrow">Estamos aqui</p>
      <h1 id="titulo-suporte" className="title">Suporte</h1>
      <p className="intro">Respostas rápidas e um canal para falar com a gente.</p>
      <div className="layout">
        <div className="card">
          <h2>Perguntas frequentes</h2>
          {faq.map(([q, a]) => (
            <details key={q} className="faq"><summary>{q}</summary><p>{a}</p></details>
          ))}
        </div>
        <div className="stack">
          <form className="card" onSubmit={send}>
            <h2>Fale com a gente</h2>
            <div className="form-grid">
              <div className="field span2"><label htmlFor="sup-subject">Assunto</label><input id="sup-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex.: dúvida sobre pontos" /></div>
              <div className="field span2"><label htmlFor="sup-msg">Mensagem</label><textarea id="sup-msg" rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Conte o que aconteceu" /></div>
            </div>
            <div className="actions" style={{ marginTop: 16 }}><button className="btn primary" type="submit">Enviar mensagem</button></div>
          </form>
          <div className="card">
            <h2>Precisa de um guia?</h2>
            <p className="hint" style={{ marginTop: 0 }}>Reveja o tutorial com os quadradinhos explicativos.</p>
            <button className="btn" onClick={onReplayTutorial}>Rever tutorial</button>
          </div>
        </div>
      </div>
    </section>
  )
}
