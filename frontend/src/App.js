import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import PrivateRoute from "./helpers/PrivateRoute";
import Header from "./components/Header/Header";
import RoomList from "./components/Room/RoomList";
import CreateRoom from "./components/Room/CreateRoom";
import UserList from "./components/User/UserList";
// import Chat from "./components/Chat/Chat";
import Mainform from "./components/MessageChat/Mainform";
import Chatroom from "./components/MessageChat/Chatroom";
import Namesec from "./components/MessageChat/Namesec";
import ChatDesign from "./components/MessageChat/ChatDesign";

function App() {
    return (
        <Router>
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

                <Route
                    path="/Chatroom"
                    element={
                        <PrivateRoute>
                            <Header>
                                <Chatroom />
                            </Header>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/message"
                    element={
                        <PrivateRoute>
                            <Header>
                                <Namesec />
                            </Header>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <PrivateRoute>
                            <Header>
                                <ChatDesign />
                            </Header>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/chat/message/mainform"
                    element={
                        <PrivateRoute>
                            <Header>
                                <Mainform />
                            </Header>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/chat/message/:roomname"
                    element={
                        <PrivateRoute>
                            <Header>
                                <Chatroom />
                            </Header>
                        </PrivateRoute>
                    }
                />
            </Routes>
        </Router>
    );
}
export default App;
