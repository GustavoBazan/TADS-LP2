import { useState, useEffect } from 'react'

const CATEGORIAS = ['Alimentos', 'Limpeza', 'Higiene', 'Outros']
const CHAVE_STORAGE = 'listaDeCompras'

function App() {
  const [itens, setItens] = useState(() => {
    const salvo = localStorage.getItem(CHAVE_STORAGE)
    if (salvo) {
      return JSON.parse(salvo)
    }
    return []
  })

  const [novoNome, setNovoNome] = useState('')
  const [novaQuantidade, setNovaQuantidade] = useState('')
  const [novaCategoria, setNovaCategoria] = useState(CATEGORIAS[0])

  const [editandoId, setEditandoId] = useState(null)
  const [filtro, setFiltro] = useState('todos')
  const [erro, setErro] = useState('')
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(itens))
  }, [itens])

  function adicionarItem(e) {
    e.preventDefault()

    if (novoNome.trim() === '') {
      setErro('Digite o nome do item antes de adicionar.')
      setMensagem('')
      return
    }

    const novoItem = {
      id: crypto.randomUUID(),
      nome: novoNome,
      quantidade: novaQuantidade,
      categoria: novaCategoria,
      comprado: false,
    }

    setItens([...itens, novoItem])
    setNovoNome('')
    setNovaQuantidade('')
    setNovaCategoria(CATEGORIAS[0])
    setErro('')
    setMensagem('Item adicionado com sucesso!')
  }

  function removerItem(id) {
    const confirmou = window.confirm('Tem certeza que deseja remover este item?')
    if (!confirmou) return

    setItens(itens.filter((item) => item.id !== id))
    setMensagem('Item removido.')
  }

  function marcarComoComprado(id) {
    setItens(
      itens.map((item) =>
        item.id === id ? { ...item, comprado: !item.comprado } : item
      )
    )
  }

  function editarCampo(id, campo, valor) {
    setItens(
      itens.map((item) => (item.id === id ? { ...item, [campo]: valor } : item))
    )
  }

  function fecharEdicao(item) {
    if (item.nome.trim() === '') {
      setErro('Digite o nome do item antes de salvar.')
      return
    }

    setEditandoId(null)
    setErro('')
    setMensagem('Item atualizado com sucesso!')
  }

  const itensFiltrados = itens.filter((item) => {
    if (filtro === 'pendentes') return !item.comprado
    if (filtro === 'comprados') return item.comprado
    return true
  })

  const total = itens.length
  const comprados = itens.filter((item) => item.comprado).length
  const restantes = total - comprados

  return (
    <div className="min-h-screen bg-emerald-600 flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-5">Lista de Compras</h1>

        <form onSubmit={adicionarItem} className="border border-gray-200 rounded p-4 mb-5">
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nome do item"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Qtd."
                value={novaQuantidade}
                onChange={(e) => setNovaQuantidade(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-20"
              />
              <select
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 flex-1"
              >
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-green-700 text-white rounded px-3 py-2 hover:bg-green-800"
            >
              Adicionar
            </button>
          </div>

          {erro && <p className="text-red-600 text-sm mt-3">{erro}</p>}
          {mensagem && <p className="text-green-700 text-sm mt-3">{mensagem}</p>}
        </form>

        <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFiltro('todos')}
              className={`px-3 py-1.5 rounded border text-sm ${filtro === 'todos' ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-600'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltro('pendentes')}
              className={`px-3 py-1.5 rounded border text-sm ${filtro === 'pendentes' ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-600'}`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setFiltro('comprados')}
              className={`px-3 py-1.5 rounded border text-sm ${filtro === 'comprados' ? 'bg-green-700 text-white border-green-700' : 'border-gray-300 text-gray-600'}`}
            >
              Comprados
            </button>
          </div>
          <span className="text-sm text-gray-600">
            {comprados}/{total} comprados ({restantes} restantes)
          </span>
        </div>

        <ul className="flex flex-col gap-3">
          {itensFiltrados.length === 0 && (
            <li className="text-gray-500 text-sm text-center py-4">
              Nenhum item para mostrar.
            </li>
          )}

          {itensFiltrados.map((item) => (
            <li key={item.id} className="border border-gray-200 rounded p-3">
              {editandoId === item.id ? (
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={item.nome}
                    onChange={(e) => editarCampo(item.id, 'nome', e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={item.quantidade}
                      onChange={(e) => editarCampo(item.id, 'quantidade', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 w-20"
                    />
                    <select
                      value={item.categoria}
                      onChange={(e) => editarCampo(item.id, 'categoria', e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 flex-1"
                    >
                      {CATEGORIAS.map((categoria) => (
                        <option key={categoria} value={categoria}>
                          {categoria}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => fecharEdicao(item)}
                    className="bg-green-700 text-white rounded px-3 py-2"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-3 flex-1 cursor-pointer min-w-0">
                    <input
                      type="checkbox"
                      checked={item.comprado}
                      onChange={() => marcarComoComprado(item.id)}
                    />
                    <span className={`truncate ${item.comprado ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {item.nome}
                      {item.quantidade && ` (${item.quantidade})`}
                      {item.categoria && ` - ${item.categoria}`}
                    </span>
                  </label>
                  <div className="flex gap-3 shrink-0">
                    <button
                      onClick={() => setEditandoId(item.id)}
                      className="text-sm text-gray-600 underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => removerItem(item.id)}
                      className="text-sm text-red-600 underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
