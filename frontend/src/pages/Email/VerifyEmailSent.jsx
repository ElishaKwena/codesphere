import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import background from '../../assets/images/signup-back-image.jpeg';
import logo from '../../assets/icons/logo.png';

const VerifyEmailSent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [error, setError] = useState(null);
    const email = location.state?.email || 'your email';
    const justRegistered = location.state?.justRegistered;

    useEffect(() =>{
        if (!location.state?.email){
            navigate('/register');
        }
    },[location, navigate]);

    
    const handleResend = async () => {
        setIsResending(true);
        setError(null);
        try {
            const response = await api.post('/auth/resend-verification/', { email });
            if (response.status === 200) {
                setResendSuccess(true);
                setTimeout(() => setResendSuccess(false), 5000);
            }
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to resend verification email');
        } finally {
            setIsResending(false);
        }
    };
    console.log('Location state:', location.state);
    
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
                    
                    <h2 className="mb-4 text-2xl font-bold text-center text-electric">
                        Verify Your Email
                    </h2>
                    
                    <div className="space-y-4 text-white">
                        <p>We've sent a verification link to <span className="font-semibold">{email}</span>.</p>
                        
                        {justRegistered && (
                            <p className="text-electric">Thank you for registering! Please verify your email to continue.</p>
                        )}
                        
                        <div className="mt-6 space-y-2">
                            <p className="font-medium">Didn't receive the email?</p>
                            <ul className="pl-5 space-y-2 list-disc">
                                <li>Check your spam folder</li>
                                <li>Verify you entered the correct email</li>
                                <li>
                                    <button
                                        onClick={handleResend}
                                        disabled={isResending || resendSuccess}
                                        className={`text-electric hover:underline ${isResending ? 'opacity-50' : ''}`}
                                    >
                                        {isResending ? 'Sending...' : 
                                         resendSuccess ? 'Verification email resent!' : 'Resend verification email'}
                                    </button>
                                </li>
                            </ul>
                        </div>
                        
                        {error && <p className="mt-4 text-red-500">{error}</p>}
                        
                        <div className="pt-4 mt-6 border-t border-white/20">
                            <button 
                                onClick={() => navigate('/login')}
                                className="text-electric hover:underline"
                            >
                                Already verified? Proceed to Login
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default VerifyEmailSent;