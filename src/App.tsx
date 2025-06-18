import {TodoTrigger} from './components/TodoTrigger'

function App() {
  
  return (
    <div className="flex flex-col items-center bg-indigo-50 p-8">
      <h1 className="mb-4 p-3  text-indigo-900 text-center text-2xl">What Do I Want ToDo</h1>
      <TodoTrigger />
    </div>
  )
}

export default App 
