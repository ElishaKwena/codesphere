import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LogoutButton = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    
    const handleLogout = async () => {
        await logout();
        navigate('/login'); // Handle navigation in component
    };
    
    return <button onClick={handleLogout}>Logout</button>;
};