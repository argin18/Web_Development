import React from 'react'
import Note from './component/Note'

const App = () => {
  return (
    <div>
      <h1 className='font-bold text-5xl text-center mb-5 italic underline decoration-solid decoration-blue-500 '>Note App</h1>
      <Note/>
    </div>
  )
}

export default App