import { useMount  } from '@/ahooks/useMount'
// import { useBoolean } from './ahooks/useBoolean'

function App() {
  useMount(() => console.log('hello, useMount'))

  return (
    <>
      <h1>ahooks-fake test</h1>
    </>
  )
}

export default App
