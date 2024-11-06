import { Routes, Route } from 'react-router-dom'

import Libro from './componente/Libro'
import Navbar from './inicio/Navbar'
import Home from './inicio/Home'
import Reproductor from './componente/Reproductor'
import Audiotex from './componente/Audiotex'
import Login from './inicio/Login'
import Registro from './inicio/Registro'
import { useState } from 'react'
import Resultados from './componente/Resultados'
import Filtros from './componente/Filtros'
import usePlayerStore  from './PlayerStore'
import MainLayout from './rutas/MainLayout'
import SimpleLayout from './rutas/SimpleLayout'

const App = () => {
  
  
  const [txt, setTxt] = useState("");
  const { isVisible, hidePlayer, paragraphs, currentParagraphIndex, setCurrentParagraphIndex } = usePlayerStore();  // Usar Zustand
  


  return (
    <div className='app'>
      
      <div className='content'>
      <Routes>
        <Route path='/'element={ <MainLayout/>}>
          <Route path='/' element={<Home />} />
          <Route path='/Libro/:id' element={<Libro/>} />
          <Route path='/Libro/:id/Audiotex' element={<Audiotex setTxt={setTxt} />} />

          <Route path='/Libro/busqueda/resultados' element={<Resultados/>}/>
         
          <Route path='/Libros/:filtro/:id_filtro' element={<Filtros/>}/>
          {/* <Route path='/libros/:id' element = {}></Route> */}
        </Route>
        <Route path='/'element={ <SimpleLayout/>}>
          <Route path='/Login' element={<Login/>} />
          <Route path='/Registro' element={<Registro/>} />
        </Route>
      </Routes>
      


      </div>
      {isVisible && (
        <Reproductor
          onClose={hidePlayer}
          paragraphs={paragraphs}
          setCurrentParagraphIndex={setCurrentParagraphIndex}
          currentParagraphIndex={currentParagraphIndex}
        />
      )}
      
    </div>
  );
};

export default App;
