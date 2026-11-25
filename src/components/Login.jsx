import { useState } from 'react'
import { checkPassword } from '../lib/auth.js'

const ROLES = [
  ['usuario', 'Sou usuário', 'Quero organizar minhas tarefas'],
  ['responsavel', 'Sou responsável', 'Acompanho outra pessoa'],
]
const SOCIAL = [['Google', 'G'], ['Facebook', 'f'], ['Apple', 'A']]

export function StrengthMeter({ result }) {
  return (
    <div className="strength" aria-live="polite">
      <div className="strength-bar" data-level={result.level}>
        {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= result.score ? 'on' : ''} />)}
      </div>
      <p className="strength-label" data-level={result.level}>Senha: {result.label}</p>
      <ul className="strength-list">
        {result.checks.map((c) => <li key={c.id} className={c.ok ? 'ok' : ''}>{c.ok ? '✓' : '○'} {c.label}</li>)}
      </ul>
    </div>
  )
}

export default function Login({ onAuth }) {
  const [role, setRole] = useState('usuario')
  const [mode, setMode] = useState('entrar') // entrar | criar
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const creating = mode === 'criar'
  const strength = checkPassword(pass, username)
  const roleLabel = role === 'usuario' ? 'usuário' : 'responsável'

  const submit = (e) => {
    e.preventDefault()
    setError('')
    const res = onAuth({ mode, role, username, email, pass })
    if (res?.error) setError(res.error)
  }
  const social = (provider) => {
    setError('')
    const res = onAuth({ mode: 'social', role, provider, username })
    if (res?.error) setError(res.error)
  }
  const switchMode = (m) => { setMode(m); setError('') }

  return (
    <div className="login-wrap">
      <main className="login-box" id="conteudo">
        <div className="brand login-brand">
          <span className="logo" aria-hidden="true">✦</span> Focus<span className="plus">+</span>
        </div>
        <section className="card login-card" aria-labelledby="login-title">
          <p className="eyebrow">Um passo de cada vez</p>
          <h1 id="login-title">{creating ? 'Criar sua conta' : 'Bem-vindo(a) de volta'}</h1>
          <p className="intro">Escolha como você vai entrar.</p>

          <div className="role-switch" role="radiogroup" aria-label="Tipo de acesso">
            {ROLES.map(([id, label, desc]) => (
              <button key={id} type="button" role="radio" aria-checked={role === id} className="role-opt" onClick={() => setRole(id)}>
                <strong>{label}</strong><span>{desc}</span>
              </button>
            ))}
          </div>

          <div className="mode-tabs" role="tablist" aria-label="Entrar ou criar conta">
            <button type="button" role="tab" aria-selected={!creating} onClick={() => switchMode('entrar')}>Entrar</button>
            <button type="button" role="tab" aria-selected={creating} onClick={() => switchMode('criar')}>Criar conta</button>
          </div>

          <form onSubmit={submit} noValidate>
            {creating ? (
              <>
                <div className="field">
                  <label htmlFor="login-user">Nome de usuário</label>
                  <input id="login-user" autoComplete="username" placeholder="Como podemos te chamar?" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="login-email">E-mail</label>
                  <input id="login-email" type="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </>
            ) : (
              <div className="field">
                <label htmlFor="login-id">Nome de usuário ou e-mail</label>
                <input id="login-id" autoComplete="username" placeholder="Seu usuário ou e-mail" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            )}
            <div className="field">
              <label htmlFor="login-pass">Senha</label>
              <div className="pass-wrap">
                <input id="login-pass" type={show ? 'text' : 'password'} autoComplete={creating ? 'new-password' : 'current-password'} placeholder={creating ? 'Crie uma senha forte' : 'Sua senha'} value={pass} onChange={(e) => setPass(e.target.value)} />
                <button type="button" className="btn small ghost" onClick={() => setShow(!show)} aria-pressed={show}>{show ? 'Ocultar' : 'Mostrar'}</button>
              </div>
            </div>
            {creating && pass && <StrengthMeter result={strength} />}
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="btn primary" type="submit">{creating ? `Criar conta de ${roleLabel}` : `Entrar como ${roleLabel}`}</button>
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
        <p className="hint login-note">Protótipo acadêmico: os dados ficam só neste navegador e nada é enviado a servidores. Login social é simulado.</p>
      </main>
    </div>
  )
}
