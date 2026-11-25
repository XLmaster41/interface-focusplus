# Focus+ — interface (React + Vite)

Reescrita **somente da interface** do protótipo FocusPlus, com a mesma estética.

## Rodar
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/index.html (arquivo único, abre com duplo clique)
```

## O que tem
- **Login / Criar conta** para *usuário* ou *responsável*, com medidor de **senha forte** (8+ caracteres, minúscula, maiúscula, número, símbolo; recusa senhas óbvias ou com o nome). Login social (Google/Facebook/Apple) é simulado.
- **Menu do perfil** (foto no canto superior direito): Perfil, Configurações, Suporte, Sair da conta.
- **Usuário**: tarefas, modo foco, progresso e **gamificação** — pontos, níveis, sequência de dias, 10 emblemas, ranking (pode esconder em Configurações) e loja de recompensas. No Perfil há foto, dados e o **código de vínculo** (FP-XXXXX).
- **Responsável** (interface própria): Painel de acompanhamento, envio de atividades com pontos, loja de recompensas, entrega de pedidos e mimos. Após o login, digita o código do usuário e **vincula na hora**.
- **Tutorial** de quadradinhos no 1º acesso de cada conta (pular a qualquer momento; rever em Configurações/Suporte).

## Pontuação (src/lib/game.js)
tarefa +10 · etapa +2 · sessão de foco +25 · atividade do responsável: valor definido por ele · cada 100 pontos = 1 nível.

## Dados
Tudo fica no `localStorage` (chave `focusplus-db-v2`). Como não há servidor, **usuário e responsável precisam estar no mesmo navegador** para o vínculo funcionar. Senhas usam um hash de brinquedo: em produção use backend + bcrypt/argon2 e OAuth real.

## Estrutura
```
src/App.jsx            contas, login, vínculo por código
src/UserApp.jsx        telas do usuário      src/GuardianApp.jsx   telas do responsável
src/lib/               auth (senha forte), game (pontos/emblemas), accounts
src/components/        Login · Header · Avatar(+menu) · Tutorial · PhotoField · TaskDialog…
src/pages/             Inicio · Tarefas · Foco · Progresso · PerfilUsuario · guardian · Config · Suporte
```
