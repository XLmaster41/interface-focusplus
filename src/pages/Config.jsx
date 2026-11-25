<<<<<<< HEAD
export default function Config({ active, me, onPref, onReplayTutorial }) {
  const prefs = me.prefs
  const isUser = me.role === 'usuario'
=======
export default function Config({ active, prefs, onPref, onReplayTutorial, onLogout }) {
>>>>>>> c954fcfc3220f4d4909fad464105bf939b37891c
  return (
    <section id="config" className={`screen ${active ? 'active' : ''}`} aria-labelledby="titulo-config">
      <p className="eyebrow">Você no controle</p>
      <h1 id="titulo-config" className="title">Configurações</h1>
      <p className="intro">Ajuste a interface de acordo com suas necessidades e preferências.</p>
      <div className="card" data-tour="config-card">
<<<<<<< HEAD
        <h2>Preferências</h2>
=======
        <h2>Preferências de acessibilidade</h2>
>>>>>>> c954fcfc3220f4d4909fad464105bf939b37891c
        <div className="setting">
          <div><h3>Tema da interface</h3><p>Escolha uma aparência que seja confortável para você.</p></div>
          <select aria-label="Tema da interface" value={prefs.theme} onChange={(e) => onPref('theme', e.target.value)}>
            <option value="light">Claro</option><option value="dark">Escuro</option>
          </select>
        </div>
        <div className="setting">
          <div><h3>Tamanho do texto</h3><p>Aumente as letras se desejar.</p></div>
          <select aria-label="Tamanho do texto" value={prefs.font} onChange={(e) => onPref('font', e.target.value)}>
            <option value="normal">Padrão</option><option value="large">Ampliado</option>
          </select>
        </div>
<<<<<<< HEAD
        {isUser && (
          <>
            <div className="setting">
              <div><h3>Tempo sugerido de foco</h3><p>O intervalo inicial poderá ser alterado antes da sessão.</p></div>
              <select aria-label="Tempo sugerido de foco" value={prefs.minutes} onChange={(e) => onPref('minutes', Number(e.target.value))}>
                {[5, 15, 25, 40, 50].map((m) => <option key={m} value={m}>{m} minutos</option>)}
              </select>
            </div>
            <div className="setting">
              <div><h3>Som ao finalizar</h3><p>Recurso opcional, desligado por padrão.</p></div>
              <select aria-label="Som ao finalizar" value={prefs.sound} onChange={(e) => onPref('sound', e.target.value)}>
                <option value="off">Desativado</option><option value="on">Ativado</option>
              </select>
            </div>
            <div className="setting">
              <div><h3>Mostrar ranking</h3><p>Se comparar-se com outros não ajuda, esconda o ranking. Seus pontos continuam valendo.</p></div>
              <select aria-label="Mostrar ranking" value={prefs.showRanking === false ? 'off' : 'on'} onChange={(e) => onPref('showRanking', e.target.value === 'on')}>
                <option value="on">Mostrar</option><option value="off">Esconder</option>
              </select>
            </div>
          </>
        )}
=======
        <div className="setting">
          <div><h3>Tempo sugerido de foco</h3><p>O intervalo inicial poderá ser alterado antes da sessão.</p></div>
          <select aria-label="Tempo sugerido de foco" value={prefs.minutes} onChange={(e) => onPref('minutes', Number(e.target.value))}>
            {[5, 15, 25, 40, 50].map((m) => <option key={m} value={m}>{m} minutos</option>)}
          </select>
        </div>
        <div className="setting">
          <div><h3>Som ao finalizar</h3><p>Recurso opcional, desligado por padrão.</p></div>
          <select aria-label="Som ao finalizar" value={prefs.sound} onChange={(e) => onPref('sound', e.target.value)}>
            <option value="off">Desativado</option><option value="on">Ativado</option>
          </select>
        </div>
>>>>>>> c954fcfc3220f4d4909fad464105bf939b37891c
        <div className="setting">
          <div><h3>Tutorial</h3><p>Reveja os quadradinhos que explicam cada parte da interface.</p></div>
          <button className="btn" onClick={onReplayTutorial}>Rever tutorial</button>
        </div>
<<<<<<< HEAD
=======
        <div className="setting">
          <div><h3>Conta</h3><p>Sair e voltar à tela de login.</p></div>
          <button className="btn danger" onClick={onLogout}>Sair</button>
        </div>
>>>>>>> c954fcfc3220f4d4909fad464105bf939b37891c
        <p className="hint">As configurações são guardadas apenas neste navegador. Não há envio de dados a servidores.</p>
      </div>
    </section>
  )
}
