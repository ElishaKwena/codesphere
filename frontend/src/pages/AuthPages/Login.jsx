import google from '../../assets/icons/google.png'
import github from '../../assets/icons/git.png'
import background from '../../assets/images/signup-back-image.jpeg'
import logo from '../../assets/icons/logo.png'

import {useLocation} from 'react-router-dom'
import { useState , useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api'
import { ROUTES } from '../../config/constants';


const Login = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const navigate = useNavigate();
    const [focus, setFocus] = useState({
        email: false,
        password: false
    });
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
            await login(formData.email, formData.password);
            console.log('Login successful');
        }catch (error){
            console.error('Login error:', error); 
            if(error.response?.data?.can_resend){
                // show option to resend verifictaion email
                setErrors({
                    api:error.response.data.error || error.detail || 'Login Failed. Please check your credentials',
                    canResend:true,
                    email: error.response.data.email
                });
            }else{
                setErrors({
                    api:error.error || 'Login failed'
                })
            }
        }
    };
    // Add resend button in your error display
    {errors.canResend && (
        <button 
            onClick={async () => {
                try {
                    await api.post('/auth/resend-verification/', { email: errors.email });
                    alert('Verification email resent!');
                } catch (err) {
                    setErrors({...errors, api: 'Failed to resend verification'});
                }
            }}
        >
            Resend Verification Email
        </button>
    )}

    return (
        <main className="w-full min-h-screen bg-dark900">
            <section 
                className="w-full flex items-center justify-end min-h-screen py-6 md:py-12 px-2 sm:px-4 relative mt-[0px]"
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-dark900/60 backdrop-blur-[2px]"></div>
                <div className="relative z-10 flex items-center justify-center w-full lg:w-1/2">
                    <div className="login-form w-full max-w-[450px] px-2 sm:px-4">
                        <div className="flex items-center justify-center gap-2 mb-6 top-section lg:gap-3 lg:mb-8">
                            <img src={logo} alt="logo" className="w-[40px] h-[40px] lg:w-[60px] lg:h-[60px]"/>
                            <h1 className="text-2xl text-electric sm:text-3xl lg:text-4xl">LOGIN</h1>
                        </div>
                        <div className="w-full h-auto p-4 rounded-lg reg-form backdrop-blur-sm sm:p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="relative form-group">
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocus(f => ({...f, email: true}))}
                                        onBlur={() => setFocus(f => ({...f, email: false}))}
                                        required
                                        placeholder=" "
                                        className="w-full px-4 py-3 pr-12 text-white transition-all duration-200 border-t border-b border-l-0 border-r rounded-md peer bg-white/10 backdrop-blur-md focus:outline-none focus:ring-0 border-white/20 focus:border-l-4 focus:border-l-electric"
                                    />
                                    <label 
                                        htmlFor="email" 
                                        className={
                                            `absolute z-10 px-1 transition-all duration-200 pointer-events-none left-4 top-3
                                            ${focus.email || formData.email ? '-translate-y-5 text-sm text-electric bg-white/10 backdrop-blur-md font-semibold rounded-md' : 'text-white/70'}
                                            `
                                        }
                                    >
                                        Email
                                    </label>
                                    <ion-icon 
                                        name="mail-outline" 
                                        className="absolute right-3 top-3 text-white/70 peer-focus:text-electric peer-focus:-translate-y-5 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:translate-y-0 transition-all duration-200 px-2 py-0.5 peer-focus:bg-white/10 peer-focus:backdrop-blur-md peer-focus:rounded-md text-xl z-10"
                                    ></ion-icon>
                                </div>

                                <div className="relative form-group">
                                    <input 
                                        type="password" 
                                        id="password" 
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setFocus(f => ({...f, password: true}))}
                                        onBlur={() => setFocus(f => ({...f, password: false}))}
                                        required
                                        placeholder=" "
                                        className="w-full px-4 py-3 pr-12 text-white transition-all duration-200 border-t border-b border-l-0 border-r rounded-md peer bg-white/10 backdrop-blur-md focus:outline-none focus:ring-0 border-white/20 focus:border-l-4 focus:border-l-electric"
                                    />
                                    <label 
                                        htmlFor="password" 
                                        className={
                                            `absolute z-10 px-1 transition-all duration-200 pointer-events-none left-4 top-3
                                            ${focus.password || formData.password ? '-translate-y-5 text-sm text-electric bg-white/10 backdrop-blur-md font-semibold rounded-md' : 'text-white/70'}
                                            `
                                        }
                                    >
                                        Password
                                    </label>
                                    <ion-icon 
                                        name="lock-closed-outline" 
                                        className="absolute right-3 top-3 text-white/70 peer-focus:text-electric peer-focus:-translate-y-5 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:translate-y-0 transition-all duration-200 px-2 py-0.5 peer-focus:bg-white/10 peer-focus:backdrop-blur-md peer-focus:rounded-md text-xl z-10"
                                    ></ion-icon>
                                </div>
                                <Link to={ROUTES.password_reset_request} className="text-electric hover:underline text-sm block mt-2 text-right">
                                    Forgotten password?
                                </Link>
                                {errors.api && (
                                    <div className="flex flex-col gap-2 p-3 text-red-500 rounded-md bg-red-500/10">
                                        <div>{errors.api}</div>
                                                                
                                        {errors.canResend && (
                                            <button 
                                                type="button"  // Important to prevent form submission
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    try {
                                                        const response = await api.post('/auth/resend-verification/', { 
                                                            email: errors.email 
                                                        });
                                                        if (response.data.success) {
                                                            setErrors({
                                                                ...errors,
                                                                api: "Verification email sent! Please check your inbox."
                                                            });
                                                        }
                                                    } catch (err) {
                                                        setErrors({
                                                            ...errors, 
                                                            api: err.response?.data?.error || 'Failed to resend verification'
                                                        });
                                                    }
                                                }}
                                                className="self-start text-sm underline transition-colors hover:text-electric"
                                            >
                                                Resend Verification Email
                                            </button>
                                        )}
                                    </div>
                                )}
                                <button 
                                    type="submit"
                                    className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white transition-all duration-300 rounded-md bg-electric hover:bg-electric/80 group"
                                >
                                    <span>Login</span>
                                    <ion-icon 
                                        name="arrow-forward-outline" 
                                        className="text-xl transition-transform duration-300 group-hover:translate-x-1"
                                    ></ion-icon>
                                </button>
                            </form>

                            <div className="mt-6">
                                <div className="relative flex items-center justify-center">
                                    <div className="flex-grow border-t border-border"></div>
                                    <span className="mx-4 text-sm text-border">or continue with</span>
                                    <div className="flex-grow border-t border-border"></div>
                                </div>

                                <div className="flex flex-col gap-3 mt-6">
                                    <button 
                                        type="button"
                                        className="flex items-center justify-center w-full gap-3 px-4 py-3 font-medium transition-all duration-300 bg-white rounded-md text-dark900 hover:bg-gray-100 group"
                                    >
                                        <img src={google} alt="Google" className="w-5 h-5" />
                                        <span>Continue with Google</span>
                                    </button>
                                    <button 
                                        type="button"
                                        className="flex items-center justify-center w-full gap-3 px-4 py-3 font-medium transition-all duration-300 bg-white rounded-md text-dark900 hover:bg-gray-100 group"
                                    >
                                        <img src={github} alt="GitHub" className="w-5 h-5" />
                                        <span>Continue with GitHub</span>
                                    </button>
                                </div>

                                <div className="mt-6 text-sm text-center text-border">
                                    <p>
                                        Don't have an account?{' '}
                                        <a href="/register" className="text-electric hover:underline">Register</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
        </div>
            </section>
        </main>
    )
}

export default Login;