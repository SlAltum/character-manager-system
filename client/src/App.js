import logo from './logo.svg';
import './App.css';
import SideMenu from './SideMenu';
import CharacterForm from './CharacterForm'
import Welcome from './Welcome';
import Cards from './Cards';
import CardDetails from './CardDetails';
import CharacterRevise from './CharacterRevise';
import {Route, Routes} from 'react-router-dom'


function App() {
  return (
    <div className='container'>
      <div className='side-menu'>
        <SideMenu />
      </div>
      <div className='main-content'>
      {/* <CharacterForm /> */}
        <Routes>
          <Route path="/" element={<Welcome/>}/>
          <Route path="/new" element={<CharacterForm/>}/>
          <Route path="/cards" element={<Cards/>}/>
          <Route path="/cards/:id" element={<CardDetails/>}/>
          <Route path="/revise/:id" element={<CharacterRevise/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
