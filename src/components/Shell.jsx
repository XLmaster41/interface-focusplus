import Header from './Header.jsx'
import Tutorial from './Tutorial.jsx'

export default function Shell({ nav, page, onNavigate, me, onLogout, steps, tour, onTourClose, children }) {
  return (
    <>
      <a className="skip" href="#conteudo">Ir para o conteúdo principal</a>
      <Header nav={nav} page={page} onNavigate={onNavigate} me={me} onLogout={onLogout} />
      <main id="conteudo">
        {children}
        <p className="footer">Focus+ • Protótipo acadêmico de interface • Nenhuma funcionalidade clínica ou diagnóstica</p>
      </main>
      {tour && <Tutorial steps={steps} onNavigate={onNavigate} onClose={onTourClose} />}
    </>
  )
}
