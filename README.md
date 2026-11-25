# Focus+ — interface (React + Vite)


Reescrita **somente da interface** do protótipo FocusPlus, com a mesma estética.
## Rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/index.html (arquivo único, abre com duplo clique)
```

## Como funciona o login e o tutorial

- Login aceita **qualquer nome e senha** (protótipo, nada vai para servidor).
- No **primeiro acesso de cada nome** o tutorial aparece automaticamente (8 passos, quadradinhos apontando cada parte).
  Botão **Pular tutorial** (ou tecla Esc) a qualquer momento; setas ← → navegam.
- Quem já viu (ou pulou) **não vê de novo**. Dá para rever em *Configurações → Rever tutorial*.
- Tudo é guardado no `localStorage` (chaves em `src/storage.js`).

## Estrutura

```
src/App.jsx               estado geral (tarefas, preferências, login, tutorial)
src/styles.css            todo o visual (variáveis de cor no topo)
src/storage.js            localStorage
src/hooks/useTimer.js     cronômetro do modo foco
src/components/           Header · Login · Tutorial · TaskItem · TaskDialog
src/pages/                Inicio · Tarefas · Foco · Progresso · Config
```

Para mudar os passos do tutorial, edite o array `STEPS` em `src/components/Tutorial.jsx`
(cada passo aponta para um elemento marcado com `data-tour="..."`).
>>>>>>> c954fcfc3220f4d4909fad464105bf939b37891c
