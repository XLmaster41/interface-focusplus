// ATENÇÃO: protótipo acadêmico. O "hash" abaixo NÃO é seguro; em produção use backend + bcrypt/argon2.
export function hashPass(s) {
  let h = 5381
  for (const c of s) h = ((h << 5) + h + c.charCodeAt(0)) | 0
  return 'h' + (h >>> 0).toString(36) + s.length
}

const COMMON = ['12345678', 'password', 'senha123', 'senha1234', 'qwerty123', '123456789', 'abcd1234']

// Regras da senha forte: 8+ caracteres, minúscula, maiúscula, número e símbolo.
export function checkPassword(pass, username = '') {
  const checks = [
    { id: 'len', label: 'Pelo menos 8 caracteres', ok: pass.length >= 8 },
    { id: 'low', label: 'Uma letra minúscula', ok: /[a-zà-ÿ]/.test(pass) },
    { id: 'up', label: 'Uma letra maiúscula', ok: /[A-ZÀ-Ý]/.test(pass) },
    { id: 'num', label: 'Um número', ok: /\d/.test(pass) },
    { id: 'sym', label: 'Um símbolo (! @ # $ …)', ok: /[^A-Za-z0-9À-ÿ]/.test(pass) },
  ]
  const score = checks.filter((c) => c.ok).length
  const obvious =
    COMMON.includes(pass.toLowerCase()) ||
    (username.trim().length >= 3 && pass.toLowerCase().includes(username.trim().toLowerCase()))
  const ok = score === 5 && !obvious
  const labels = ['Muito fraca', 'Fraca', 'Fraca', 'Média', 'Boa', 'Forte']
  return {
    checks, score, ok, obvious,
    label: obvious && score === 5 ? 'Evite senhas óbvias ou com seu nome' : labels[score],
    level: ok ? 'strong' : score >= 4 ? 'good' : score >= 3 ? 'mid' : 'weak',
  }
}

const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sem letras/números parecidos (0/O, 1/I)
export function makeCode(existing = []) {
  let code
  do {
    code = 'FP-' + Array.from({ length: 5 }, () => ALPHA[Math.floor(Math.random() * ALPHA.length)]).join('')
  } while (existing.includes(code))
  return code
}
export const normCode = (c) => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
export const newKey = (role) => (role === 'usuario' ? 'u' : 'r') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
export const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)
