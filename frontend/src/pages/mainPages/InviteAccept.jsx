import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { groupsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/constants';

// Icons
import close from '../../assets/icons/close.png';

const InviteAccept = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');
    const [group, setGroup] = useState(null);

    useEffect(() => {
        const acceptInvite = async () => {
            if (!user) {
                setStatus('error');
                setMessage('Please login to accept this invite');
                return;
            }

            try {
                setStatus('loading');
                const response = await groupsAPI.acceptInvite(token);
                setGroup(response.data.group);
                setStatus('success');
                setMessage('Successfully joined the group!');
                
                // Redirect to group after 2 seconds
                setTimeout(() => {
                    navigate(`/groups/${response.data.group.id}`);
                }, 2000);
            } catch (err) {
                console.error('Error accepting invite:', err);
                setStatus('error');
                setMessage(err.response?.data?.error || 'Failed to accept invite. The invite may have expired or been used.');
            }
        };

        acceptInvite();
    }, [token, user, navigate]);

    const getStatusIcon = () => {
        switch (status) {
            case 'loading':
                return <div className="w-16 h-16 border-4 border-electric border-t-transparent rounded-full animate-spin"></div>;
            case 'success':
                return (
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'error':
                return <img src={close} alt="Error" className="w-16 h-16" />;
            default:
                return null;
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'loading':
                return 'text-electric';
            case 'success':
                return 'text-green-400';
            case 'error':
                return 'text-red-400';
            default:
                return 'text-white';
        }
    };

    return (
        <main className='flex flex-col items-center justify-center w-full min-h-screen pt-[90px] bg-dark900'>
            <div className="flex flex-col items-center gap-6 p-8 border rounded-md border-border02 bg-dark800 max-w-md w-full">
                <div className="flex flex-col items-center gap-4">
                    {getStatusIcon()}
                    
                    <h1 className={`text-2xl font-bold ${getStatusColor()}`}>
                        {status === 'loading' && 'Processing Invite...'}
                        {status === 'success' && 'Welcome!'}
                        {status === 'error' && 'Invite Error'}
                    </h1>
                    
                    <p className="text-center text-border">
                        {message}
                    </p>
                </div>

                {group && status === 'success' && (
                    <div className="w-full p-4 border rounded-md border-border02 bg-dark700">
                        <h3 className="mb-2 text-lg font-semibold text-white">{group.name}</h3>
                        <p className="text-sm text-border">{group.description}</p>
                        <p className="mt-2 text-xs text-electric capitalize">{group.privacy} group</p>
                    </div>
                )}

                <div className="flex flex-col gap-2 w-full">
                    {status === 'success' && (
                        <p className="text-center text-sm text-border">
                            Redirecting to group...
                        </p>
                    )}
                    
                    {status === 'error' && (
                        <div className="flex flex-col gap-2">
                            <Link
                                to={ROUTES.login}
                                className="w-full p-3 text-center text-white transition-all duration-300 border rounded-md bg-electric border-electric hover:bg-electric/90"
                            >
                                Go to Login
                            </Link>
                            <Link
                                to={ROUTES.groups}
                                className="w-full p-3 text-center text-white transition-all duration-300 border rounded-md border-border02 hover:border-electric"
                            >
                                Browse Groups
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default InviteAccept; 