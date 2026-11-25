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
  data: 'focusplus-prototype-v1', // tarefas, minutos de foco e preferências
  session: 'focusplus-session', // usuário logado
  tutorialSeen: 'focusplus-tutorial-seen', // nomes que já viram o tutorial
}
