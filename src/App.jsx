import { useEffect, useRef, useState } from 'react'
import { KEYS, load, save } from './storage.js'
import { hashPass, checkPassword, isEmail, normCode } from './lib/auth.js'
import { createUser, createGuardian } from './lib/accounts.js'
import Login from './components/Login.jsx'
import UserApp from './UserApp.jsx'
import GuardianApp from './GuardianApp.jsx'

export default function App() {
  const [db, setDb] = useState(() => load(KEYS.db, { accounts: {} }))
  const [sessionKey, setSessionKey] = useState(() => load(KEYS.session, null))
  const [toast, setToast] = useState('')
  const toastTimer = useRef()

  const me = db.accounts[sessionKey] || null

  useEffect(() => { save(KEYS.db, db) }, [db])
  useEffect(() => { save(KEYS.session, me ? sessionKey : null) }, [sessionKey, me])
  useEffect(() => {
    document.body.classList.toggle('dark', me?.prefs.theme === 'dark')
    document.body.classList.toggle('large-text', me?.prefs.font === 'large')
  }, [me?.prefs.theme, me?.prefs.font])

  const notify = (msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2800)
  }
  const updateAcc = (key, fn) => setDb((d) => (d.accounts[key] ? { ...d, accounts: { ...d.accounts, [key]: fn(d.accounts[key]) } } : d))
  const updateMe = (fn) => updateAcc(sessionKey, fn)

  // ---- autenticação (protótipo: tudo local) ----
  const authenticate = ({ mode, role, username = '', email = '', pass = '', provider }) => {
    const all = Object.values(db.accounts).filter((a) => a.role === role)
    const codes = Object.values(db.accounts).map((a) => a.linkCode).filter(Boolean)
    const make = (extra) => (role === 'usuario' ? createUser({ ...extra, existingCodes: codes }) : createGuardian(extra))
    const enter = (acc) => {
      if (!db.accounts[acc.key]) setDb((d) => ({ ...d, accounts: { ...d.accounts, [acc.key]: acc } }))
      setSessionKey(acc.key)
    }

    if (mode === 'social') {
      const name = username.trim() || `Visitante ${provider}`
      const found = all.find((a) => a.provider === provider && a.username.toLowerCase() === name.toLowerCase())
      enter(found || make({ username: name, provider }))
      return { ok: true }
    }

    if (mode === 'entrar') {
      const id = username.trim().toLowerCase()
      if (!id) return { error: 'Digite seu nome de usuário ou e-mail.' }
      if (!pass) return { error: 'Digite sua senha.' }
      const acc = all.find((a) => a.username.toLowerCase() === id || (a.email && a.email.toLowerCase() === id))
      if (!acc) return { error: 'Não encontramos essa conta. Clique em “Criar conta” para começar.' }
      if (!acc.passHash || acc.passHash !== hashPass(pass)) return { error: 'Senha incorreta. Tente de novo.' }
      enter(acc)
      return { ok: true }
    }

    // criar conta
    const name = username.trim()
    if (name.length < 2) return { error: 'Escolha um nome de usuário com pelo menos 2 letras.' }
    if (!isEmail(email.trim())) return { error: 'Digite um e-mail válido, por exemplo voce@exemplo.com.' }
    const strength = checkPassword(pass, name)
    if (!strength.ok) return { error: strength.obvious ? 'Essa senha é óbvia demais. Evite sequências comuns e seu próprio nome.' : 'Sua senha ainda não é forte. Complete todos os itens da lista.' }
    if (all.some((a) => a.username.toLowerCase() === name.toLowerCase())) return { error: 'Esse nome de usuário já está em uso.' }
    if (all.some((a) => a.email && a.email.toLowerCase() === email.trim().toLowerCase())) return { error: 'Já existe uma conta com esse e-mail. Use “Entrar”.' }
    enter(make({ username: name, email: email.trim(), passHash: hashPass(pass) }))
    return { ok: true }
  }

  const logout = () => setSessionKey(null)

  // ---- vínculo responsável ↔ usuário por código ----
  const linkByCode = (guardianKey, raw) => {
    const code = normCode(raw)
    if (!code) return { error: 'Digite o código do usuário.' }
    const u = Object.values(db.accounts).find((a) => a.role === 'usuario' && normCode(a.linkCode) === code)
    if (!u) return { error: 'Código não encontrado. Confira com o usuário (formato FP-XXXXX).' }
    const g = db.accounts[guardianKey]
    if (g.linked.includes(u.key)) return { error: 'Você já está vinculado(a) a este usuário.' }
    setDb((d) => ({
      ...d,
      accounts: {
        ...d.accounts,
        [u.key]: { ...d.accounts[u.key], guardians: [...d.accounts[u.key].guardians, guardianKey] },
        [guardianKey]: { ...d.accounts[guardianKey], linked: [...d.accounts[guardianKey].linked, u.key] },
      },
    }))
    return { ok: true, name: u.profile.fullName || u.username }
  }
  const unlink = (guardianKey, userKey) => {
    if (!confirm('Desvincular este usuário? Você deixará de acompanhar o progresso dele.')) return
    setDb((d) => ({
      ...d,
      accounts: {
        ...d.accounts,
        [userKey]: { ...d.accounts[userKey], guardians: d.accounts[userKey].guardians.filter((k) => k !== guardianKey) },
        [guardianKey]: { ...d.accounts[guardianKey], linked: d.accounts[guardianKey].linked.filter((k) => k !== userKey) },
      },
    }))
    notify('Usuário desvinculado.')
  }

  const api = { updateMe, updateAcc, notify, logout, linkByCode, unlink }
  return (
    <>
      {!me && <Login onAuth={authenticate} />}
      {me && me.role === 'usuario' && <UserApp key={me.key} me={me} db={db} api={api} />}
      {me && me.role === 'responsavel' && <GuardianApp key={me.key} me={me} db={db} api={api} />}
      <div id="announce" role="status" aria-live="polite" style={{ display: toast ? 'block' : 'none' }}>{toast}</div>
    </>
  )
}
