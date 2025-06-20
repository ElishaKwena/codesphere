import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../config/constants'
import logo from '../../assets/icons/logo.png'
import user1 from '../../assets/images/user1.jpeg'
import user2 from '../../assets/images/user2.png'
import user3 from '../../assets/images/user.png'
import user4 from '../../assets/images/user.png'
import code from '../../assets/images/code.png'
import banner from '../../assets/images/banner.png'
import apple from '../../assets/icons/apple.png'
import google from '../../assets/icons/google-play.png'
import xLogo from '../../assets/icons/twitter.png'
import tiktok from '../../assets/icons/tiktok.png'
import facebook from '../../assets/icons/facebook.png'
import instagram from '../../assets/icons/instagram.png'
import discord from '../../assets/icons/discord.png'
import github from '../../assets/icons/github.png'

const LandingPage = () => {
    const [year] = useState(new Date().getFullYear())

    // Static values for counters
    const activeMembers = 24
    const communities = 100
    const discussions = 50

    return (
        <>
        <header className="w-full h-[90px] py-2 px-2 md:px-4 flex items-center justify-center fixed top-3 left-0 z- overflow-x-hidden z-50">
            <nav className="w-full md:w-[98%] bg-black/20 backdrop-blur-[6px] flex items-center justify-between py-4 px-4 rounded-lg">
                <div className="logo">
                    <Link to={ROUTES.home} className='flex items-center gap-2'>
                        <img src={logo} alt="logo" className='w-[40px] h-[40px] md:w-[50px] md:h-[50px]' />
                        <h1 className='text-xl md:text-2xl font-bold text-electric font-["Impact"]'>Codesphere</h1>
                    </Link>
                </div>
                <div className="call-btn">
                    <Link to={ROUTES.register} className='bg-electric px-3 py-1.5 md:px-4 md:py-2 rounded-[3px] text-white000 font-bold text-base md:text-lg hover:bg-electric/80 transition-colors duration-300'>Get Started</Link>
                </div>
            </nav>
        </header>
        <main className="container min-h-screen overflow-hidden bg-dark900 ">
            <section className="hero w-full py-6 md:py-12 px-4 bg-[radial-gradient(circle_at_75%_50%,rgba(37,99,235,0.15)_0%,rgba(10,10,10,1)_60%)] md:pt-[135px] pt-[150px]">
                <div className="hero-content w-[95%] md:w-[90%] mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
                    <div className="heroleft w-full md:w-[50%] flex items-center flex-col gap-2 px-2 md:px-4">
                        <div className="w-full hero-top">
                            <h1 className="text-center md:text-left"><span className="text-4xl font-bold text-white md:text-6xl">Connect. </span> <span className="text-4xl font-bold text-electric md:text-6xl">Code.</span><br/><span className="text-4xl font-bold text-white md:text-6xl">Collaborate.</span></h1>
                        </div>
                        <div className="w-full hero-mid">
                            <p className='text-white text-sm md:text-md font-["Inter"] text-center md:text-left'>The ultimate platform for developers to share knowledge, build <br className="hidden md:block"/> projects, and grow their careers in tech communities.</p>
                        </div>
                        <div className="flex flex-col items-start justify-start w-full gap-2 hero-cta md:flex-row">
                            <Link to={ROUTES.register} className='join bg-electric px-4 py-2 rounded-[3px] text-white000 font-bold text-base md:text-lg w-full md:w-auto text-center'>
                                Join Now - It's Free
                            </Link>
                            <Link to={ROUTES.register} className="demo flex items-center justify-center gap-2 text-white hover:text-electric hover:border-electric transition-colors duration-300 rounded-[3px] border-[2px] border-white px-4 py-2 w-full md:w-auto">
                                <ion-icon name="play-circle" className="text-2xl"></ion-icon>
                                Watch Demo
                            </Link>
                        </div>
                        <div className="flex flex-col items-center justify-start w-full gap-2 mt-4 members md:flex-row">
                            <div className="members-box relative w-[120px] h-[40px]">
                                <div className="absolute left-0 top-0 w-[40px] h-[40px] rounded-full border-2 border-dark900 overflow-hidden">
                                    <img src={user1} alt="user" className="object-cover w-full h-full" />
                                </div>
                                <div className="absolute left-[25px] top-0 w-[40px] h-[40px] rounded-full border-2 border-dark900 overflow-hidden">
                                    <img src={user2} alt="user" className="object-cover w-full h-full" />
                                </div>
                                <div className="absolute left-[50px] top-0 w-[40px] h-[40px] rounded-full border-2 border-dark900 overflow-hidden">
                                    <img src={user3} alt="user" className="object-cover w-full h-full" />
                                </div>
                                <div className="absolute left-[75px] top-0 w-[40px] h-[40px] rounded-full border-2 border-dark900 overflow-hidden">
                                    <img src={user4} alt="user" className="object-cover w-full h-full" />
                                </div>
                            </div>
                            <p className='text-white text-sm md:text-md font-["Inter"] text-left'>Join <span className='font-bold text-electric'>24,817+</span> developers worldwide</p>
                        </div>
                    </div>
                    <div className="heroright w-full md:w-[50%] flex items-center justify-center mt-8 md:mt-0">
                        <div className="example-post relative bg-dark800 w-full md:w-[90%] rounded-lg">
                            <div className="hero-absolute"></div>
                            <div className="relative z-10 flex items-center w-full gap-2 px-4 py-2 rounded-tl-lg rounded-tr-lg example-top justify-left bg-dark700">
                                <div className="flex items-center gap-2 circles justify-left">
                                    <span className="w-[15px] h-[15px] rounded-full bg-red000"></span>
                                    <span className="w-[15px] h-[15px] rounded-full bg-yellow"></span>
                                    <span className="w-[15px] h-[15px] rounded-full bg-success"></span>
                                </div>
                                <p className="text-border font-['Inter] text-base md:text-lg">#react-community</p>
                            </div>
                            <div className="relative z-10 flex items-start w-full gap-2 px-2 py-2 pb-8 rounded-b-lg example-post-content justify-left bg-dark800">
                                <div className="user-image-example-post w-[12%]">
                                    <img src={user4} alt="" className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full object-cover"/>
                                </div>
                                <div className="example-post-content-right w-[88%] flex items-center gap-3 flex-col">
                                    <div className="w-full right-content">
                                        <div className="flex items-center justify-between w-full">
                                            <h1 className="text-white font-bold text-sm md:text-md capitalize font-['Inter']">Sarah developer</h1>
                                            <p className="text-border02 text-xs md:text-sm font-['Inter']">12 hours ago</p>
                                        </div>
                                        <p className="text-border text-xs md:text-[14px] font-['Inter']">Has anyone implemented React Server Components in Production Yet?.</p>
                                    </div>
                                    <div className="right-image-box w-full border-l-[4px] border-electric rounded-lg">
                                        <img src={code} alt="" className="w-full h-[100px] md:h-[140px] object-cover rounded-lg"/>
                                    </div>
                                    <div className="flex items-center w-full gap-2 example-actions justify-left">
                                        <div className="flex items-center justify-center gap-1 example-actions-box">
                                            <ion-icon name="chatbox-outline" className="text-xl md:text-2xl text-border"></ion-icon>
                                            <p className="text-border text-xs md:text-sm font-['Inter']">12</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-1 example-actions-box">
                                            <ion-icon name="heart-outline" className="text-xl md:text-2xl text-border"></ion-icon>
                                            <p className="text-border text-xs md:text-sm font-['Inter']">34</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-1 example-actions-box">
                                            <ion-icon name="bookmark-outline" className="text-xl md:text-2xl text-border"></ion-icon>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="flex flex-col items-center justify-center w-full py-6 trusted bg-dark800">
                <h2 className="text-border text-lg md:text-xl font-bold font-['Inter'] text-center w-full">Trusted by developers at</h2>
                <div className="trusted-content w-full mx-auto flex  items-center justify-between gap-8 md:w-[90%] p-4 md:p-10">
                    <div className="flex items-center justify-center trustee" data-aos="zoom-in" data-aos-delay="400">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Sass_Logo_Color.svg" alt="Sass" className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] object-contain opacity-[0.8] hover:opacity-100 transition-opacity duration-300"/>
                    </div>
                    <div className="flex items-center justify-center trustee" data-aos="zoom-in" data-aos-delay="500">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg" alt="npm" className="w-[40px] h-[40px] md:w-[80px] md:h-[80px] object-contain opacity-[0.8] hover:opacity-100 transition-opacity duration-300"/>
                    </div>
                    <div className="flex items-center justify-center trustee" data-aos="zoom-in" data-aos-delay="600">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] object-contain opacity-[0.8] hover:opacity-100 transition-opacity duration-300"/>
                    </div>
                    <div className="flex items-center justify-center trustee" data-aos="zoom-in" data-aos-delay="700">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" alt="Node.js" className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] object-contain opacity-[0.8] hover:opacity-100 transition-opacity duration-300"/>
                    </div>
                    <div className="flex items-center justify-center trustee" data-aos="zoom-in" data-aos-delay="800">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" alt="Python" className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] object-contain opacity-[0.8] hover:opacity-100 transition-opacity duration-300"/>
                    </div>
                    <div className="flex items-center justify-center trustee" data-aos="zoom-in" data-aos-delay="900">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Laravel.svg" alt="Laravel" className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] object-contain opacity-[0.8] hover:opacity-100 transition-opacity duration-300"/>
                    </div>
                </div>
            </section>
            <section className="flex flex-col items-center w-full gap-2 features">
                <div className="flex flex-col items-center justify-center w-full gap-2 py-8 features-content">
                    <h1 className="text-white text-5xl font-bold font-['Inter'] text-center">Everything Developers Need</h1>
                    <p className="text-border text-xl font-['Inter'] text-center">From technical discussions to career growth, we,ve built the perfect environment for coders</p>
                </div>
                <div className="features-box w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
                    <div className="feature-card bg-dark800 p-6 rounded-lg border border-dark700 hover:border-electric hover:translate-y-[-5px] transition-all duration-300">
                        <div className="mb-4 feature-icon">
                            <div className="w-[50px] h-[50px] bg-electric/30 rounded-md flex items-center justify-center">
                                <ion-icon name="people" className="text-4xl text-electric"></ion-icon>
                            </div>
                        </div>
                        <div className="features-content">
                                <h1 className="text-white text-2xl font-bold font-['Inter'] mb-2">Tech Communities</h1>
                                <p className="text-border text-[18px] font-['Inter'] mb-4">Join Language/framewor-specific groups or craeate your own. Moderate with powerful tools.</p>
                                <ul className="text-border text-sm font-['Inter']">
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Public & private groups</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Advanced moderation</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Customizable roles</li>
                                </ul>
                            </div>
                    </div>
                    <div className="feature-card bg-dark800 p-6 rounded-lg border border-dark700 hover:border-electric hover:translate-y-[-5px] transition-all duration-300">
                        <div className="mb-4 feature-icon">
                            <div className="w-[50px] h-[50px] bg-electric/30 rounded-md flex items-center justify-center">
                                <ion-icon name="code-slash" className="text-4xl text-electric"></ion-icon>
                            </div>
                        </div>
                        <div className="features-content">
                                <h1 className="text-white text-2xl font-bold font-['Inter'] mb-2">Real-Time Collaboration</h1>
                                <p className="text-border text-[18px] font-['Inter'] mb-4">Built-in VS Code-like editor for pair programming and code reviews</p>
                                <ul className="text-border text-sm font-['Inter']">
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Multiplayer coding</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Terminal access</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Code execution</li>
                                </ul>
                            </div>
                    </div>
                    <div className="feature-card bg-dark800 p-6 rounded-lg border border-dark700 hover:border-electric hover:translate-y-[-5px] transition-all duration-300">
                        <div className="mb-4 feature-icon">
                            <div className="w-[50px] h-[50px] bg-electric/30 rounded-md flex items-center justify-center">
                                <ion-icon name="hardware-chip-outline" className="text-4xl text-electric"></ion-icon>
                            </div>
                        </div>
                        <div className="features-content">
                                <h1 className="text-white text-2xl font-bold font-['Inter'] mb-2">AI-Powered Features</h1>
                                <p className="text-border text-[18px] font-['Inter'] mb-4">Leverage AI to enhance your coding experience and productivity</p>
                                <ul className="text-border text-sm font-['Inter']">
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Code suggestions</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Code explanations</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Bug detection</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Smart completions</li>
                                </ul>
                            </div>
                    </div>
                    <div className="feature-card bg-dark800 p-6 rounded-lg border border-dark700 hover:border-electric hover:translate-y-[-5px] transition-all duration-300">
                        <div className="mb-4 feature-icon">
                            <div className="w-[50px] h-[50px] bg-electric/30 rounded-md flex items-center justify-center">
                                <ion-icon name="diamond" className="text-4xl text-electric"></ion-icon>
                            </div>
                        </div>
                        <div className="features-content">
                                <h1 className="text-white text-2xl font-bold font-['Inter'] mb-2">Gamification</h1>
                                <p className="text-border text-[18px] font-['Inter'] mb-4">Earn achievements and climb leaderboards for your contributions.</p>
                                <ul className="text-border text-sm font-['Inter']">
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Skills badge</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Weeekly challenges</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Reputation system</li>
                                </ul>
                            </div>
                    </div>
                    <div className="feature-card bg-dark800 p-6 rounded-lg border border-dark700 hover:border-electric hover:translate-y-[-5px] transition-all duration-300">
                        <div className="mb-4 feature-icon">
                            <div className="w-[50px] h-[50px] bg-electric/30 rounded-md flex items-center justify-center">
                                <ion-icon name="briefcase" className="text-4xl text-electric"></ion-icon>
                            </div>
                        </div>
                        <div className="features-content">
                                <h1 className="text-white text-2xl font-bold font-['Inter'] mb-2">Career Hub</h1>
                                <p className="text-border text-[18px] font-['Inter'] mb-4">Connect with opportunities tailored to your skills.</p>
                                <ul className="text-border text-sm font-['Inter']">
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Job matching</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Portfolio builder</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Interview prep</li>
                                </ul>
                            </div>
                    </div>
                    <div className="feature-card bg-dark800 p-6 rounded-lg border border-dark700 hover:border-electric hover:translate-y-[-5px] transition-all duration-300">
                        <div className="mb-4 feature-icon">
                            <div className="w-[50px] h-[50px] bg-electric/30 rounded-md flex items-center justify-center">
                                <ion-icon name="flash" className="text-4xl text-electric"></ion-icon>
                            </div>
                        </div>
                        <div className="features-content">
                                <h1 className="text-white text-2xl font-bold font-['Inter'] mb-2">Lightning-Fast Performance</h1>
                                <p className="text-border text-[18px] font-['Inter'] mb-4">Experience seamless interactions with our optimized platform.</p>
                                <ul className="text-border text-sm font-['Inter']">
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Fast loading</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Responsive design</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Scalable architecture</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> WebSockets</li>
                                    <li><ion-icon name="checkmark-outline" className="text-xl font-bold text-electric"></ion-icon> Edge caching</li>
                                </ul>
                            </div>
                    </div>
                </div>
            </section>
            <section className="flex flex-col items-center justify-center w-full py-6 trusted-devs bg-dark800">
                <h2 className="text-border text-lg md:text-xl font-bold font-['Inter'] text-center w-full">Trusted by developers worldwide</h2>
                <div className="developers w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
                    <div className="dev-card bg-dark700 p-6 rounded-lg border border-dark600 hover:border-electric hover:translate-y-[-5px] transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4 dev-info">
                            <img src={user1} alt="developer" className="w-[50px] h-[50px] rounded-full object-cover"/>
                            <div>
                                <h3 className="text-white text-xl font-bold font-['Inter']">Sarah Johnson</h3>
                                <p className="text-dark900 italic font-bold text-sm font-['Inter']">Senior Frontend Developer</p>
                            </div>
                        </div>
                        <p className="text-border text-md font-['Inter']">"Codesphere has transformed how I collaborate with other developers. The real-time features are incredible!"</p>
                        <div className="reating w-full flex items-center justify-left mt-[20px] gap-2">
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                        </div>
                    </div>
                    <div className="dev-card bg-dark700 p-6 rounded-lg border border-dark600 hover:border-electric hover:translate-y-[-5px] transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4 dev-info">
                            <img src={user2} alt="developer" className="w-[50px] h-[50px] rounded-full object-cover"/>
                            <div>
                                <h3 className="text-white text-xl font-bold font-['Inter']">Mike Chen</h3>
                                <p className="text-dark900 italic font-bold text-sm font-['Inter']">Full Stack Developer</p>
                            </div>
                        </div>
                        <p className="text-border text-md font-['Inter']">"The AI-powered features have significantly improved my coding efficiency. It's like having a pair programmer 24/7."</p>
                        <div className="reating w-full flex items-center justify-left mt-[20px] gap-2">
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                        </div>
                    </div>
                    <div className="dev-card bg-dark700 p-6 rounded-lg border border-dark600 hover:border-electric hover:translate-y-[-5px] transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4 dev-info">
                            <img src={user3} alt="developer" className="w-[50px] h-[50px] rounded-full object-cover"/>
                            <div>
                                <h3 className="text-white text-xl font-bold font-['Inter']">Emma Rodriguez</h3>
                                <p className="text-dark900 italic font-bold text-sm font-['Inter']">Backend Developer</p>
                            </div>
                        </div>
                        <p className="text-border text-md font-['Inter']">"The community features are amazing. I've learned so much from other developers and made great connections."</p>
                        <div className="reating w-full flex items-center justify-left mt-[20px] gap-2">
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                            <span className=''>
                                <ion-icon name="star" className="text-3xl text-yellow"></ion-icon>
                            </span>
                        </div>
                    </div>
                </div>
            </section>
            <section className="relative flex items-center justify-center w-full py-8 start md:py-12">
                <div className="start-div w-[90%] md:w-[80%] lg:w-[60%] flex flex-col gap-4 md:gap-6 items-center justify-center border border-border rounded-md bg-gradient-to-r from-dark800 to-dark700 p-4 md:p-8">
                    <div className="flex flex-col items-center justify-center w-full gap-3 top md:gap-6">
                        <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold font-['Inter'] text-center">Ready to join the Community?</h1>
                        <p className="text-border text-base md:text-lg font-['Inter'] text-center">Join a community of developers who are passionate about coding and building amazing things.</p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-full gap-4 actions md:flex-row md:gap-6">
                        <Link to={ROUTES.register} className="w-full md:w-[230px] bg-electric text-white px-4 md:px-6 py-3 md:py-4 rounded-md border-[3px] border-electric hover:bg-transparent hover:text-electric hover:translate-y-[-5px] transition-all duration-300 text-sm md:text-base text-center">Get Started for Free</Link>
                        <Link to={ROUTES.register} className="w-full md:w-[230px] bg-dark800 text-white px-4 md:px-6 py-3 md:py-4 rounded-md border-[3px] border-white hover:border-electric hover:translate-y-[-5px] hover:text-electric transition-all duration-300 text-sm md:text-base text-center">Explore Communities</Link>
                    </div>
                </div>
            </section>
            <section className="relative w-full banner">
                <div className="custom-shape-divider-top-1749208262">
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="shape-fill"></path>
                    </svg>
                </div>
                <div className="banner-content w-full min-h-[600px] flex flex-col-reverse gap-4 md:flex-row items-center justify-between md:pt-[80px] pt-[145px] px-4 md:px-8 lg:px-12 p-[40px] bg-gradient-to-br from-dark800 via-dark700 to-dark900">
                    <div className="image-container object-contain rounded-lg w-full md:w-[45%] md:full h-[200px] flex items-center justify-center mb-8 md:mb-0 bg-transparent">
                        <img 
                            src={banner}
                            alt="Coding illustration" 
                            className="object-contain w-full rounded-t-lg shadow-lg md:object-cover"
                        />
                    </div>
                    <div className="text-container w-full md:w-[45%] flex flex-col gap-6">
                        <h1 className="text-electric text-xl md:text-3xl font-bold font-['Inter']">YOUR ULTIMATE PROGRAMMING PARTNER</h1>
                        <h2 className="text-white text-3xl md:text-4xl font-bold font-['Inter']">Join Our Developer Community</h2>
                        <p className="text-base text-border md:text-lg">Connect with developers worldwide, share knowledge, and grow your skills in a supportive environment.</p>
                        <div className="flex flex-wrap items-center gap-4 stats md:gap-8">
                            <div className="stat">
                                <h3 className="text-2xl font-bold text-electric md:text-3xl">{activeMembers}K+</h3>
                                <p className="text-xs text-border md:text-sm">Active Members</p>
                            </div>
                            <div className="stat">
                                <h3 className="text-2xl font-bold text-electric md:text-3xl">{communities}+</h3>
                                <p className="text-xs text-border md:text-sm">Communities</p>
                            </div>
                            <div className="stat">
                                <h3 className="text-2xl font-bold text-electric md:text-3xl">{discussions}K+</h3>
                                <p className="text-xs text-border md:text-sm">Discussions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        <footer className="w-full py-8 footer bg-dark900">
            <div className="footer-content w-[95%] mx-auto flex flex-col lg:flex-row items-start justify-between px-2 gap-8">
                <div className="footer-left w-full lg:w-[40%] flex flex-col items-start justify-left gap-2">
                    <div className="flex items-center gap-3 top justify-left">
                        <img src={logo} alt="logo" className="w-[40px] h-[40px] object-cover"/>
                        <h1 className="text-electric text-2xl md:text-3xl font-bold font-['Impact']">Codesphere</h1>
                    </div>
                    <p className="text-border text-sm font-['Inter'] mt-[10px]">The ultimate platform for developer collaboration and knowledge sharing.</p>
                    <div className="flex flex-row items-start justify-center gap-2 mt-2 download md:flex-row sm:flex-row sm:items-center md:justify-left">
                        <a 
                            href="https://apps.apple.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center w-full gap-4 p-2 px-2 bg-white rounded-md justify-left md:px-4 sm:w-auto"
                        >
                            <span>
                                <img src={apple} alt="apple" className="w-[30px] h-[30px] md:w-[40px] md:h-[40px] object-cover"/>
                            </span>
                            <div>
                                <h2 className="text-dark900 text-sm font-['Inter']">Download on the</h2>
                                <p className="text-dark900 text-xl font-bold font-['Inter'] mt-[-5px]">App Store</p>
                            </div>
                        </a>
                        <a 
                            href="https://play.google.com/store" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center w-full gap-4 p-2 px-2 bg-white rounded-md justify-left md:px-4 sm:w-auto"
                        >
                            <span>
                                <img src={google} alt="google play" className="md:w-[40px] md:h-[40px] w-[30px] h-[30px] object-cover"/>
                            </span>
                            <div>
                                <h2 className="text-dark900 text-sm font-['Inter']">GET IT ON</h2>
                                <p className="text-dark900 text-xl font-bold font-['Inter'] mt-[-5px]">Google Play</p>
                            </div>
                        </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-4 social-links justify-left">
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-electric transition-all duration-300 hover:translate-y-[-5px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] rounded-full p-2">
                            <img src={xLogo} alt="x" className="w-[30px] h-[30px] object-cover"/>
                        </a>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-electric transition-all duration-300 hover:translate-y-[-5px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] rounded-full p-2">
                            <img src={tiktok} alt="tiktok" className="w-[30px] h-[30px] object-cover"/>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-electric transition-all duration-300 hover:translate-y-[-5px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] rounded-full p-2">
                            <img src={facebook} alt="facebook" className="w-[30px] h-[30px] object-cover"/>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-electric transition-all duration-300 hover:translate-y-[-5px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] rounded-full p-2">
                            <img src={instagram} alt="instagram" className="w-[30px] h-[30px] object-cover"/>
                        </a>
                        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-electric transition-all duration-300 hover:translate-y-[-5px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] rounded-full p-2">
                            <img src={discord} alt="discord" className="w-[30px] h-[30px] object-cover"/>
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-electric transition-all duration-300 hover:translate-y-[-5px] shadow-[0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] rounded-full p-2">
                            <img src={github} alt="github" className="w-[30px] h-[30px] object-cover"/>
                        </a>
                    </div>
               </div>
               <div className="footer-right w-full lg:w-[60%] md:w-[65%] grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="links-div">
                    <h1 className="text-md text-electric font-bold font-['Inter'] mb-4">Codesphere Pro</h1>
                    <ul className="text-border text-sm font-['Inter'] flex flex-col gap-4">
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">About Us</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Careers</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Blog</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Contact Us</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">FAQs</a></li>
                    </ul>
                </div>
                <div className="links-div">
                    <h1 className="text-electric text-md font-bold font-['Inter'] mb-4">Features</h1>
                    <ul className="text-border text-sm font-['Inter'] flex flex-col gap-4">
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Tech Communities</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Real-Time Collaboration</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">AI-Powered Features</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Gamification</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Career Hub</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Lightning-Fast Performance</a></li>
                    </ul>
                </div>
                <div className="links-div">
                    <h1 className="text-electric text-md font-bold font-['Inter'] mb-4">Resources</h1>
                    <ul className="text-border text-sm font-['Inter'] flex flex-col gap-4">
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Documentation</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">API</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Extensions</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Help Center</a></li>
                    </ul>
                </div>
                <div className="links-div">
                    <h1 className="text-electric text-md font-bold font-['Inter'] mb-4">Legal</h1>
                    <ul className="text-border text-sm font-['Inter'] flex flex-col gap-4">
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Privacy Policy</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Terms of Service</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Cookie Policy</a></li>
                        <li><a href="/" className="transition-colors duration-300 hover:text-electric">Community Guidelines</a></li>
                    </ul>
                </div>
               </div>
            </div>
            <div className="footer-bottom w-[95%] mx-auto flex flex-col items-center justify-center gap-2 mt-4">
                <hr className="w-full border-border" />
                <div className="flex flex-col items-center justify-between gap-2 py-4 top sm:flex-row">
                    <p className="text-border text-sm font-['Inter']">© {year} Codesphere. All rights reserved.</p>
                    <p className="text-border text-sm font-['Inter']">Powered by <span className="text-electric">Codesphere</span></p>
                </div>
            </div>
        </footer>
        </>
    )
}

export default LandingPage;