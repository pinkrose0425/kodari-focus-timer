import Timer from './components/Timer'
import TodoList from './components/TodoList'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row items-center justify-center gap-8 p-8">
      <Timer />
      <TodoList />
    </div>
  )
}

export default App
