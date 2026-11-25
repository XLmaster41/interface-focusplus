import { useState } from 'react'

const ROLES = [
  ['usuario', 'Sou usuário', 'Quero organizar minhas tarefas'],
  ['responsavel', 'Sou responsável', 'Acompanho outra pessoa'],
]
const SOCIAL = [
  ['Google', 'G'],
  ['Facebook', 'f'],
  ['Apple', 'A'],
]

export default function Login({ onLogin }) {
  const [role, setRole] = useState('usuario')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!username.trim() || !email.trim() || !pass) return
    onLogin({ name: username.trim(), email: email.trim(), role })
  }
  // Protótipo: login social é simulado (não há conexão real com os serviços).
  const social = (provider) => onLogin({ name: username.trim() || `Visitante ${provider}`, email: '', role, provider })

  return (
    <div className="login-wrap">
      <main className="login-box" id="conteudo">
        <div className="brand login-brand">
          <span className="logo" aria-hidden="true">✦</span> Focus<span className="plus">+</span>
        </div>
        <section className="card login-card" aria-labelledby="login-title">
          <p className="eyebrow">Um passo de cada vez</p>

          <h1 id="login-title">Bem-vindo(a) de volta</h1>
          <p className="intro">Escolha como você vai entrar.</p>

          <div className="role-switch" role="radiogroup" aria-label="Tipo de acesso">
            {ROLES.map(([id, label, desc]) => (
              <button key={id} type="button" role="radio" aria-checked={role === id} className="role-opt" onClick={() => setRole(id)}>

                <strong>{label}</strong>
                <span>{desc}</span>
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            <div className="field">
              <label htmlFor="login-user">Nome de usuário</label>
              <input id="login-user" autoComplete="username" placeholder="Como podemos te chamar?" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="login-email">E-mail</label>
              <input id="login-email" type="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="login-pass">Senha</label>
              <input id="login-pass" type="password" autoComplete="current-password" placeholder="Digite qualquer senha" value={pass} onChange={(e) => setPass(e.target.value)} required />
            </div>
            <button className="btn primary" type="submit">Entrar como {role === 'usuario' ? 'usuário' : 'responsável'}</button>
          </form>

          <div className="login-divider"><span>ou continue com</span></div>
          <div className="social-grid">
            {SOCIAL.map(([name, mark]) => (
              <button key={name} type="button" className="btn social" onClick={() => social(name)} aria-label={`Continuar com ${name}`}>
                <span className="social-mark" aria-hidden="true">{mark}</span> {name}
              </button>
            ))}
          </div>
        </section>

        <p className="hint login-note">Protótipo acadêmico: digite qualquer coisa para entrar. Nenhum dado é enviado a servidores.</p>
      </main>
    </div>
  )
}
