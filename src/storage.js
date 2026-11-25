// Leitura/escrita segura no localStorage (pode falhar em janela privada).
export function load(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key))
    return v ?? fallback
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export const KEYS = {
  db: 'focusplus-db-v2', // todas as contas (usuários e responsáveis) deste navegador
  session: 'focusplus-session-v2', // chave da conta logada
}
