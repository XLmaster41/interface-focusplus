import { useRef } from 'react'
import { Avatar } from './Avatar.jsx'

// Redimensiona a foto para 256px (cabe no localStorage) e devolve como data URL.
function resize(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        const size = 256
        const c = document.createElement('canvas')
        c.width = c.height = size
        const s = Math.min(img.width, img.height)
        c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size)
        resolve(c.toDataURL('image/jpeg', 0.85))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function PhotoField({ acc, onChange, notify }) {
  const input = useRef(null)
  const pick = async (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    if (!f.type.startsWith('image/')) return notify('Escolha um arquivo de imagem.')
    try { onChange(await resize(f)); notify('Foto atualizada.') } catch { notify('Não foi possível ler essa imagem.') }
  }
  return (
    <div className="photo-field">
      <Avatar acc={acc} size={92} />
      <div>
        <div className="actions">
          <button type="button" className="btn small" onClick={() => input.current.click()}>{acc.profile.photo ? 'Trocar foto' : 'Adicionar foto'}</button>
          {acc.profile.photo && <button type="button" className="btn small ghost" onClick={() => onChange('')}>Remover</button>}
        </div>
        <p className="hint" style={{ margin: '8px 0 0' }}>JPG ou PNG. A foto fica só neste navegador.</p>
        <input ref={input} type="file" accept="image/*" onChange={pick} className="sr-only" tabIndex={-1} aria-label="Escolher foto de perfil" />
      </div>
    </div>
  )
}
