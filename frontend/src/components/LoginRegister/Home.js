import {
    Button,
} from 'antd';
import {
    localStorageRemove,
} from "../../Utilities";
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigator = useNavigate();

    const handleLogout = async () => {
        await localStorageRemove("user");
        navigator("login");
    };

    return (
        <>
            <h1>Login Success!This is Home Page</h1>
            <Button
                variant="white"
                className="btn btn-outline-danger"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </>

    )
}
export default Home;