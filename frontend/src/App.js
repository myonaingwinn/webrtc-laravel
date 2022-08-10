import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from "./components/Login/Register";
import PeerCall from "./components/Peer/PeerCall";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={< PeerCall />}></Route>
        <Route exact path='/register' element={< Register />}></Route>
        <Route exact path='/list' element={< PeerCall />}></Route>
      </Routes>
    </Router>
  );
}
export default App;