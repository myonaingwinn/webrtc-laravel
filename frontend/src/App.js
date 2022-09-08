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
import Loading from "./components/Loading/Loading";
import { useRef } from "react";
import Error from "./components/Error/Error";
import PrivateChat from "./components/PrivateChat/PrivateChat";

function App() {
    const loadingRef = useRef();

    const handleLoading = () => {
        if (loadingRef.current) loadingRef.current.handleLoading();
    };

    return (
        <Loading ref={loadingRef}>
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
                <Route
                    path="/chat/:roomName"
                    element={
                        <PrivateRoute>
                            <Header>
                                <PrivateChat />
                            </Header>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/register"
                    element={<Register handleLoading={handleLoading} />}
                />
                <Route
                    path="/login"
                    element={<Login handleLoading={handleLoading} />}
                />
                <Route path="*" element={<Error />} />
            </Routes>
        </Loading>
    );
}
export default App;
