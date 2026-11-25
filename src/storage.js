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
<<<<<<< HEAD
  db: 'focusplus-db-v2', // todas as contas (usuários e responsáveis) deste navegador
  session: 'focusplus-session-v2', // chave da conta logada
=======
  data: 'focusplus-prototype-v1', // tarefas, minutos de foco e preferências
  session: 'focusplus-session', // usuário logado
  tutorialSeen: 'focusplus-tutorial-seen', // nomes que já viram o tutorial
>>>>>>> c954fcfc3220f4d4909fad464105bf939b37891c
}
