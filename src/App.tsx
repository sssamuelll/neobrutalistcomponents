// src/App.tsx
import { useState } from 'react'
import { Button, Input } from 'neobrutalistcomponents'; // tu librería
import './App.css';

function App() {
  const [count, setCount] = useState(0)
  const [valor, setValor] = useState('')

  return (
    <>
      <h1>Demo: Vite + React + Neobrutalist Components</h1>

      <div className="card">
        <Button onClick={() => setCount(c => c + 1)}>
          count is {count}
        </Button>
        <p>Edit <code>src/App.tsx</code> y guarda para probar HMR</p>
      </div>

      <div className="card">
        <Input
          id="mi-input"
          label="Mi campo brutalista"
          placeholder="Escribe algo..."
          value={valor}
          onChange={e => setValor(e.target.value)}
        />
        <p>Valor actual: “{valor}”</p>
      </div>
    </>
  )
}

export default App
