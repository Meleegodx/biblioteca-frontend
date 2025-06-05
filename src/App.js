import React, { useEffect, useState } from 'react';

// Componente para listar livros
function ListaLivros() {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/livros')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao carregar livros');
        }
        return res.json();
      })
      .then((data) => {
        setLivros(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando livros...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Livros da Biblioteca</h2>
      {livros.length === 0 ? (
        <p>Nenhum livro encontrado.</p>
      ) : (
        <ul>
          {livros.map((livro) => (
            <li key={livro.id} style={{ marginBottom: '1rem' }}>
              <strong>{livro.titulo}</strong> (Ano: {livro.ano_publicacao})<br />
              <span><strong>Autor:</strong> {livro.autor_nome}</span><br />
              <span><strong>Editora:</strong> {livro.editora_nome}</span><br />
              <span><strong>Tipo:</strong> {livro.tipo_nome}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Componente para cadastrar livro
function FormularioCadastro({ onCadastroSucesso }) {
  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState('');
  const [autorId, setAutorId] = useState('');
  const [tipoId, setTipoId] = useState('');
  const [editoraId, setEditoraId] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const novoLivro = {
      titulo,
      ano_publicacao: parseInt(ano),
      autor_id: parseInt(autorId),
      tipo_id: parseInt(tipoId),
      editora_id: parseInt(editoraId),
    };

    try {
      const res = await fetch('http://localhost:3000/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoLivro),
      });

      if (!res.ok) {
        throw new Error('Erro ao cadastrar livro');
      }

      const data = await res.json();
      setMensagem(`Livro "${data.titulo}" cadastrado com sucesso!`);

      // Limpa o formulário
      setTitulo('');
      setAno('');
      setAutorId('');
      setTipoId('');
      setEditoraId('');

      // Atualiza a lista no componente pai
      onCadastroSucesso();

    } catch (error) {
      setMensagem(error.message);
    }
  };

  return (
    <div>
      <h2>Cadastro de Livro</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título: </label>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} required />
        </div>
        <div>
          <label>Ano de Publicação: </label>
          <input type="number" value={ano} onChange={e => setAno(e.target.value)} required />
        </div>
        <div>
          <label>ID do Autor: </label>
          <input type="number" value={autorId} onChange={e => setAutorId(e.target.value)} required />
        </div>
        <div>
          <label>ID do Tipo: </label>
          <input type="number" value={tipoId} onChange={e => setTipoId(e.target.value)} required />
        </div>
        <div>
          <label>ID da Editora: </label>
          <input type="number" value={editoraId} onChange={e => setEditoraId(e.target.value)} required />
        </div>
        <button type="submit">Cadastrar</button>
      </form>
      {mensagem && <p>{mensagem}</p>}
    </div>
  );
}

// Componente App principal unindo os dois
function App() {
  const [atualizarLista, setAtualizarLista] = useState(false);

  // Quando cadastro for feito com sucesso, altera o estado para disparar refresh na lista
  const handleCadastroSucesso = () => {
    setAtualizarLista(!atualizarLista);
  };

  return (
    <div>
      <h1>Biblioteca</h1>
      {/* Passa a flag para recarregar a lista */}
      <ListaLivros key={atualizarLista} />
      <FormularioCadastro onCadastroSucesso={handleCadastroSucesso} />
    </div>
  );
}

export default App;
