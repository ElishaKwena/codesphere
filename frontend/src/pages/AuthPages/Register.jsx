import google from '../../assets/icons/google.png'
import github from '../../assets/icons/git.png'
import background from '../../assets/images/signup-back-image.jpeg'
import logo from '../../assets/icons/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import {useState} from 'react'
import {useAuth} from '../../context/AuthContext.jsx'
import api from '../../services/api'

const Register = () => {
    const [formData, setFormData] = useState({
        email:'',
        username: '',
        handlename: '',
        password: '',
        confirmPassword: ''    
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false); // Make sure this line exists
    const navigate = useNavigate();

    const [focus, setFocus] = useState({
        username: false,
        handlename: false,
        email: false,
        password: false,
        confirmPassword: false
    });

    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const validate = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword){
            newErrors.confirmPassword = 'Passwords do not match';
        }
        return newErrors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // This should work now
        setErrors({});
        
        // Validate form data first
        if (formData.password !== formData.confirmPassword) {
          setErrors({ confirmPassword: "Passwords don't match" });
          return;
        }
      
        try {
            console.log("submitting", formData);
            const response = await api.post('/auth/register/', {
              email: formData.email,
              username: formData.username,
              handlename: formData.handlename,
              password: formData.password,
              password2: formData.confirmPassword
            });
            console.log("response", response);
      
            if (response.status === 201) {
                console.log('Navigating to verify-email-sent with:', {
                    email: formData.email,
                    responseStatus: response.status
                });
                navigate('/verify-email-sent', { 
                    state: {
                        email: formData.email,
                        justRegistered:true,
                        from: '/register',
                        canResend:true
                     } ,
                     replace:true
                });
            }
            return
        } 
        catch (error) {
            if (error.response) {
                console.log("Error data:", error.response.data);
                console.log("Error status:", error.response.status);
                console.log("Error headers:", error.response.headers);
              // Handle Django validation errors
                if (error.response.status === 400) {
                    setErrors(error.response.data);
                }else{
                    setErrors({ general:error.response.data.detail });
              }
            } 
            else if (error.request) {
                console.log("Error request:", error.request);
                setErrors({ general: 'No response received from server' })
          }else{
                console.log("Error message:", error.message);
                setErrors({ general: error.message })
            
          }
        }finally{
            setIsSubmitting(false);
        }
      };

    
    return (
        <main className="w-full min-h-screen pt-0 mt-0 bg-dark900">
            <section 
                className="w-full flex items-center justify-between min-h-screen py-6 md:py-12 px-2 sm:px-4 relative mt-[0px]"
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-dark900/60 backdrop-blur-[2px]"></div>
                <div className="relative z-10 flex flex-col items-center justify-between w-full gap-6 register-container lg:flex-row lg:gap-4">
                    <div className="flex flex-col justify-center w-full gap-3 lg:w-1/2 lg:justify-start lg:gap-4"> 
                        <div className="flex items-center justify-center gap-2 top-left lg:justify-start lg:gap-3">
                            <img src={logo} alt="logo" className="w-[40px] h-[40px] lg:w-[60px] lg:h-[60px]"/>
                            <h1 className="text-2xl text-electric sm:text-3xl lg:text-4xl">CREATE AN ACCOUNT</h1>
                        </div>
                        <div className="px-2 left-content sm:px-4 lg:px-0">
                            <p className="mb-4 text-sm font-medium text-center text-electric/90 lg:mb-6 lg:text-left">Join CodeSphere to start your coding journey</p>
                            <div className="space-y-4 lg:space-y-6">
                                <div className="flex items-start gap-3 lg:gap-4">
                                    <ion-icon name="code-slash-outline" class="text-electric text-xl lg:text-2xl"></ion-icon>
                                    <div>
                                        <h3 className="mb-1 text-sm font-semibold text-electric lg:text-base">Boilerplate Collection</h3>
                                        <p className="text-xs text-white/90 lg:text-sm">Access a vast library of pre-built code templates and boilerplates to accelerate your development process</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 lg:gap-4">
                                    <ion-icon name="people-outline" class="text-electric text-xl lg:text-2xl"></ion-icon>
                                    <div>
                                        <h3 className="mb-1 text-sm font-semibold text-electric lg:text-base">Developer Community</h3>
                                        <p className="text-xs text-white/90 lg:text-sm">Connect with fellow developers, share your code, and collaborate on exciting projects</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 lg:gap-4">
                                    <ion-icon name="rocket-outline" class="text-electric text-xl lg:text-2xl"></ion-icon>
                                    <div>
                                        <h3 className="mb-1 text-sm font-semibold text-electric lg:text-base">Quick Start Solutions</h3>
                                        <p className="text-xs text-white/90 lg:text-sm">Get started instantly with ready-to-use components and solutions for your projects</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="register-right relative z-10 w-full max-w-[450px] px-2 sm:px-4">
                        <div className="w-full h-auto p-4 rounded-lg reg-form backdrop-blur-sm sm:p-6">
                            <div className="form-group">
                                {errors.general && <div className="error">{errors.general}</div>}
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                
                                <div className="relative form-group">
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="username" 
                                        value={formData.username}
                                        onChange={handleChange}
                                        onFocus={() => setFocus(f => ({...f, username: true}))}
                                        onBlur={() => setFocus(f => ({...f, username: false}))}
                                        required
                                        placeholder=" "
                                        className="w-full px-4 py-3 pr-12 text-white transition-all duration-200 border-t border-b border-l-0 border-r rounded-md peer bg-white/10 backdrop-blur-md focus:outline-none focus:ring-0 border-white/20 focus:border-l-4 focus:border-l-electric"
                                    
                                    />
                                    <label 
                                        htmlFor="name" 
                                        className={
                                            `absolute z-10 px-1 transition-all duration-200 pointer-events-none left-4 top-3
                                            ${focus.username || formData.username ? '-translate-y-5 text-sm text-electric bg-white/10 backdrop-blur-md font-semibold rounded-md' : 'text-white/70'}
                                            `
                                        }
                                    >
                                        Name
                                    </label>
                                    <ion-icon 
                                        name="person-outline" 
                                        className="absolute right-3 top-3 text-white/70 peer-focus:text-electric peer-focus:-translate-y-5 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:translate-y-0 transition-all duration-200 px-2 py-0.5 peer-focus:bg-white/10 peer-focus:backdrop-blur-md peer-focus:rounded-md text-xl z-10"
                                    ></ion-icon>
                                </div>
                                <div className="relative form-group">
                                    <input 
                                        type="text" 
                                        id="handlename" 
                                        name="handlename" 
                                        value={formData.handlename}
                                        onChange={handleChange}
                                        onFocus={() => setFocus(f => ({...f, handlename: true}))}
                                        onBlur={() => setFocus(f => ({...f, handlename: false}))}
                                        required
                                        placeholder=" "
                                        className="w-full px-4 py-3 pr-12 text-white transition-all duration-200 border-t border-b border-l-0 border-r rounded-md peer bg-white/10 backdrop-blur-md focus:outline-none focus:ring-0 border-white/20 focus:border-l-4 focus:border-l-electric"
                                    
                                    />
                                    <label 
                                        htmlFor="name" 
                                        className={
                                            `absolute z-10 px-1 transition-all duration-200 pointer-events-none left-4 top-3
                                            ${focus.handlename || formData.handlename ? '-translate-y-5 text-sm text-electric bg-white/10 backdrop-blur-md font-semibold rounded-md' : 'text-white/70'}
                                            `
                                        }
                                    >
                                        @handlename
                                    </label>
                                    <ion-icon 
                                        name="person-outline" 
                                        className="absolute right-3 top-3 text-white/70 peer-focus:text-electric peer-focus:-translate-y-5 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:translate-y-0 transition-all duration-200 px-2 py-0.5 peer-focus:bg-white/10 peer-focus:backdrop-blur-md peer-focus:rounded-md text-xl z-10"
                                    ></ion-icon>
                                </div>
                                {errors.username && <p className="error text-red000">{errors.username}</p>}
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
                                {errors.email && <p className="error text-red000">{errors.email}</p>}                                <div className="relative form-group">
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
                                {errors.password && <p className="error text-red000">{errors.password}</p>}
                                <div className="relative form-group">
                                    <input 
                                        type="password" 
                                        id="confirmPassword" 
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        onFocus={() => setFocus(f => ({...f, confirmPassword: true}))}
                                        onBlur={() => setFocus(f => ({...f, confirmPassword: false}))}
                                        required
                                        placeholder=" "
                                        className="w-full px-4 py-3 pr-12 text-white transition-all duration-200 border-t border-b border-l-0 border-r rounded-md peer bg-white/10 backdrop-blur-md focus:outline-none focus:ring-0 border-white/20 focus:border-l-4 focus:border-l-electric"
                                    />
                                    <label 
                                        htmlFor="confirmPassword" 
                                        className={
                                            `absolute z-10 px-1 transition-all duration-200 pointer-events-none left-4 top-3
                                            ${focus.confirmPassword || formData.confirmPassword ? '-translate-y-5 text-sm text-electric bg-white/10 backdrop-blur-md font-semibold rounded-md' : 'text-white/70'}
                                            `
                                        }
                                    >
                                        Confirm Password
                                    </label>
                                    <ion-icon 
                                        name="lock-closed-outline" 
                                        className="absolute right-3 top-3 text-white/70 peer-focus:text-electric peer-focus:-translate-y-5 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:translate-y-0 transition-all duration-200 px-2 py-0.5 peer-focus:bg-white/10 peer-focus:backdrop-blur-md peer-focus:rounded-md text-xl z-10"
                                    ></ion-icon>
                                </div>
                                {errors.password && <p className="text-red-500">{errors.password}</p>}
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium text-white transition-all duration-300 rounded-md bg-electric hover:bg-electric/80 group"
                                >
                                    {isSubmitting? 'Creating Account...' : 'Create Account'}
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
                                    <p className="mb-4">
                                        By continuing you agree to the{' '}
                                        <a href="" className="text-electric hover:underline">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="" className="text-electric hover:underline">Privacy Policy</a>
                                        {' '}of CodeSphere
                                    </p>
                                    <p>
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-electric hover:underline">Login</Link>
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

export default Register; 