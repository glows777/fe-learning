import withErrorBoundary from './error-boundary'

const User = () => {
  throw new Error('error')

  return <h2>user</h2>
}

const UserWithErrorBoundary = withErrorBoundary(User, {
  onError: () => console.error('出错啦'),
  fallback: <h1>error</h1>,
})

function App() {
  return (
    <>
      <div>
        <h1>error boundary</h1>
        <UserWithErrorBoundary />
      </div>
    </>
  )
}

export default App
