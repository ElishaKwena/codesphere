import google from '../../assets/icons/google.png'
import github from '../../assets/icons/git.png'
import background from '../../assets/images/signup-back-image.jpeg'
import logo from '../../assets/icons/logo.png'

const Login = () => {
    return (
        <main className="w-full min-h-screen bg-dark900">
            <section 
                className="w-full flex items-center justify-end min-h-screen py-6 md:py-12 px-2 sm:px-4 relative mt-[90px]"
                style={{
                    backgroundImage: `url(${background})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                <div className="absolute inset-0 bg-dark900/60 backdrop-blur-[2px]"></div>
                <div className="w-full lg:w-1/2 flex items-center justify-center relative z-10">
                    <div className="login-form w-full max-w-[450px] px-2 sm:px-4">
                        <div className="top-section flex justify-center items-center gap-2 lg:gap-3 mb-6 lg:mb-8">
                            <img src={logo} alt="logo" className="w-[40px] h-[40px] lg:w-[60px] lg:h-[60px]"/>
                            <h1 className="text-electric text-2xl sm:text-3xl lg:text-4xl">LOGIN</h1>
                        </div>
                        <div className="reg-form w-full h-auto backdrop-blur-sm rounded-lg p-4 sm:p-6">
                            <form action="" className="space-y-4">
                                <div className="form-group relative">
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        className="peer w-full px-4 py-3 bg-white/10 backdrop-blur-md text-white rounded-md focus:outline-none focus:ring-0 border-l-0 border-r border-t border-b border-white/20 focus:border-l-4 focus:border-l-electric transition-all duration-200 pr-12"
                                        placeholder=" "
                                    />
                                    <label 
                                        htmlFor="email" 
                                        className="absolute left-4 top-3 text-white/70 peer-focus:text-electric peer-focus:-translate-y-5 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:translate-y-0 transition-all duration-200 pointer-events-none px-1 peer-focus:bg-white/10 peer-focus:backdrop-blur-md peer-focus:font-semibold peer-focus:rounded-md z-10"
                                    >
                                        Email
                                    </label>
                                    <ion-icon 
                                        name="mail-outline" 
                                        className="absolute right-3 top-3 text-white/70 peer-focus:text-electric peer-focus:-translate-y-5 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:translate-y-0 transition-all duration-200 px-2 py-0.5 peer-focus:bg-white/10 peer-focus:backdrop-blur-md peer-focus:rounded-md text-xl z-10"
                                    ></ion-icon>
                                </div>

                                <div className="form-group relative">
                                    <input 
                                        type="password" 
                                        id="password" 
                                        name="password" 
                                        className="peer w-full px-4 py-3 bg-white/10 backdrop-blur-md text-white rounded-md focus:outline-none focus:ring-0 border-l-0 border-r border-t border-b border-white/20 focus:border-l-4 focus:border-l-electric transition-all duration-200 pr-12"
                                        placeholder=" "
                                    />
                                    <label 
                                        htmlFor="password" 
                                        className="absolute left-4 top-3 text-white/70 peer-focus:text-electric peer-focus:-translate-y-5 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:translate-y-0 transition-all duration-200 pointer-events-none px-1 peer-focus:bg-white/10 peer-focus:backdrop-blur-md peer-focus:font-semibold peer-focus:rounded-md z-10"
                                    >
                                        Password
                                    </label>
                                    <ion-icon 
                                        name="lock-closed-outline" 
                                        className="absolute right-3 top-3 text-white/70 peer-focus:text-electric peer-focus:-translate-y-5 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:translate-y-0 transition-all duration-200 px-2 py-0.5 peer-focus:bg-white/10 peer-focus:backdrop-blur-md peer-focus:rounded-md text-xl z-10"
                                    ></ion-icon>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-electric text-white py-3 px-4 rounded-md hover:bg-electric/80 transition-all duration-300 font-medium flex items-center justify-center gap-2 group"
                                >
                                    <span>Login</span>
                                    <ion-icon 
                                        name="arrow-forward-outline" 
                                        className="text-xl group-hover:translate-x-1 transition-transform duration-300"
                                    ></ion-icon>
                                </button>
                            </form>

                            <div className="mt-6">
                                <div className="relative flex items-center justify-center">
                                    <div className="border-t border-border flex-grow"></div>
                                    <span className="mx-4 text-border text-sm">or continue with</span>
                                    <div className="border-t border-border flex-grow"></div>
                                </div>

                                <div className="mt-6 flex flex-col gap-3">
                                    <button 
                                        type="button"
                                        className="w-full bg-white text-dark900 py-3 px-4 rounded-md hover:bg-gray-100 transition-all duration-300 font-medium flex items-center justify-center gap-3 group"
                                    >
                                        <img src={google} alt="Google" className="w-5 h-5" />
                                        <span>Continue with Google</span>
                                    </button>
                                    <button 
                                        type="button"
                                        className="w-full bg-white text-dark900 py-3 px-4 rounded-md hover:bg-gray-100 transition-all duration-300 font-medium flex items-center justify-center gap-3 group"
                                    >
                                        <img src={github} alt="GitHub" className="w-5 h-5" />
                                        <span>Continue with GitHub</span>
                                    </button>
                                </div>

                                <div className="mt-6 text-center text-sm text-border">
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