import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Home from './Routes/Home'
import About from './Routes/About'
import Project from './Routes/Project'
import SignIn from './Routes/SignIn'
import SignUp from './Routes/SignUp'
import Dashboard from './Routes/Dashboard'
import Header from './components/Header'

function App() {
 
  return (
    <BrowserRouter>
    <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/project' element={<Project />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
