import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import PrivateRoute from "./helpers/PrivateRoute";
import Header from "./components/Header/Header";
import RoomList from "./components/Room/RoomList";
import CreateRoom from "./components/Room/CreateRoom";
import UserList from "./components/User/UserList";
import Room from "./components/Room/Room";

function App() {
    return (
        <Routes>
            <Route
                exact
                path="/"
                element={
                    <PrivateRoute>
                        <Header>
                            <Home />
                        </Header>
                    </PrivateRoute>
                }
            />
            <Route
                path="/rooms"
                element={
                    <PrivateRoute>
                        <Header>
                            <RoomList />
                        </Header>
                    </PrivateRoute>
                }
            />
            <Route
                path="/create_room"
                element={
                    <PrivateRoute>
                        <Header>
                            <CreateRoom />
                        </Header>
                    </PrivateRoute>
                }
            />
            <Route
                path="/rooms/:id"
                element={
                    <PrivateRoute>
                        <Header>
                            <Room />
                        </Header>
                    </PrivateRoute>
                }
            />
            <Route
                path="/users"
                element={
                    <PrivateRoute>
                        <Header>
                            <UserList />
                        </Header>
                    </PrivateRoute>
                }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}
export default App;
