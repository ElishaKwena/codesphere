import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import background from '../../assets/images/signup-back-image.jpeg';
import logo from '../../assets/icons/logo.png';

const VerifyEmail = () => {
    const { uidb64, token } = useParams();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/auth/verify-email/${uidb64}/${token}/`);
                if (response.status === 200) {
                    setMessage('Email verified successfully! Redirecting to login...');
                    setTimeout(() => navigate('/login', {
                        state: { 
                            emailVerified: true,
                            email: response.data.email // If your backend returns this
                        }
                    }), 3000);
                }
            } catch (err) {
                setError(err.response?.data?.detail || 'Invalid or expired verification link');
            } finally {
                setIsLoading(false);
            }
        };
        verifyEmail();
    }, [uidb64, token, navigate]);

    return (
        <main className="w-full min-h-screen bg-dark900">
            <section 
                className="relative flex items-center justify-center w-full min-h-screen px-2 py-6 md:py-12 sm:px-4"
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-dark900/60 backdrop-blur-[2px]"></div>
                <div className="relative z-10 w-full max-w-md p-8 rounded-lg bg-white/10 backdrop-blur-sm">
                    <div className="flex justify-center mb-6">
                        <img src={logo} alt="logo" className="w-16 h-16"/>
                    </div>
                    
                    {isLoading && !message && !error && (
                        <>
                            <h2 className="mb-4 text-2xl font-bold text-center text-electric">
                                Verifying Your Email
                            </h2>
                            <p className="text-center text-white">Please wait while we verify your email...</p>
                        </>
                    )}
                    
                    {message && (
                        <>
                            <h2 className="mb-4 text-2xl font-bold text-center text-electric">
                                Verification Successful!
                            </h2>
                            <p className="text-center text-white">{message}</p>
                        </>
                    )}
                    
                    {error && (
                        <>
                            <h2 className="mb-4 text-2xl font-bold text-center text-electric">
                                Verification Failed
                            </h2>
                            <p className="mb-4 text-center text-red-500">{error}</p>
                            <div className="flex justify-center">
                                <button
                                    onClick={() => navigate('/verify-email-sent')}
                                    className="px-4 py-2 text-white transition rounded bg-electric hover:bg-electric/80"
                                >
                                    Request New Verification Link
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
};

export default VerifyEmail;