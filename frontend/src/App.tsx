import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {User} from './components/User.tsx'
import { Admin } from './components/Admin.tsx'
import { Landing } from './components/Landing.tsx';
import './App.css'

function App() {

  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}/>
        <Route path="/admin" element={<Admin />}/>
        <Route path="/user" element={<User/>}/>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
