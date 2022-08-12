import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./components/LoginRegister/Login";
import Register from "./components/LoginRegister/Register";
import Home from "./components/LoginRegister/Home";
import PrivateRoute from "./helpers/PrivateRoute";

function App() {

  return (
    <Router>
      <Routes>
        <Route exact path='/' element={
          <PrivateRoute>
            < Home />
          </PrivateRoute>
        }>
        </Route>
        <Route exact path='/login' element={
          < Login />
        }></Route>
        <Route exact path='/register' element={
          < Register />
        }>
        </Route>
      </Routes>
    </Router >
  );
}
export default App;