import { ROUTES } from '../config/constants'

import ruby from '../assets/icons/ruby.png'
import ai from '../assets/icons/artificial.png'
import react from '../assets/icons/react.png'
import python from '../assets/icons/python.png'
import java from '../assets/icons/java.png'
import javascript from '../assets/icons/java-script.png'
import c from '../assets/icons/c.png'
import csharp from '../assets/icons/csharp.png'
import cpp from '../assets/icons/cplus.png'
import node from '../assets/icons/node.png'
import php from '../assets/icons/php.png'
import cyber from '../assets/icons/cyber.png'
import swift from '../assets/icons/swift.png'
import go from '../assets/icons/golang.png'
import mobile from '../assets/icons/mobile.png'
import rust from '../assets/icons/rust.png'
import kotlin from '../assets/icons/kotlin.jpeg'
import sql from '../assets/icons/sql.png'
import bootsrap from '../assets/icons/bootstrap.jpeg'
import flask from '../assets/icons/flask.jpeg'
import posts from '../assets/icons/posts.png'


export const recommended = [
    {
        id:1,
        name: 'Flask Developers',
        icon: flask,
        members:3000,
        link: ROUTES.communities
    },
    {
        id:2,
        name: 'Bootstrap Devs',
        icon: bootsrap,
        members:119000,
        link: ROUTES.communities
    },
    {
        id:3,
        name: 'Java Developers',
        icon: java,
        members:3630,
        link: ROUTES.communities
    },
    {
        id:4,
        name: 'Go-Lang Developers',
        icon: go,
        members:3870,
        link: ROUTES.communities
    },
    {
        id:5,
        name: 'Php Elephants',
        icon: php,
        members:65647,
        link: ROUTES.communities
    }
]


export const usergroups = [
    {
        id:1,
        name: 'Python Devs',
        icon: python,
        description: "The Swiss Army knife of programming! Whether you're diving into data science, automating tasks, building web apps with Django/Flask, or exploring AI with TensorFlow, this community is your launchpad for all things Pythonic.",
        role:'Admin',
        posts: 100,
        members: 10000,
        link: ROUTES.communities,
    },
    {
        id:2,
        name: 'JavaScript Devs',
        icon: javascript,
        description: "Calling all JavaScript enthusiasts! This is your hub for everything JS—whether you're mastering the basics, diving into frameworks like React and Node.js, or exploring advanced concepts. Join to share knowledge, collaborate on projects, solve coding challenges, and stay updated with the latest in the JavaScript ecosystem. Perfect for learners, coders, and tech pros alike. Let’s build, break, and innovate together!",
        role:'Owner',
        posts: 156,
        members: 36000,
        link: ROUTES.communities,
    },
    {
        id:3,
        name: 'AI Enthusiasts',
        icon: ai,
        description: "JAI Enthusiasts Hub is a vibrant community for developers, researchers, and tech enthusiasts passionate about artificial intelligence and its real-world applications. Whether you're exploring machine learning frameworks like TensorFlow and PyTorch, building AI-powered apps with JavaScript (Node.js, TensorFlow.js), experimenting with generative AI (LLMs, diffusion models), or discussing AI ethics and future trends—this is your space. Join us to share knowledge, collaborate on projects, participate in hackathons, and stay updated on the latest breakthroughs. All skill levels are welcome—let's innovate and grow together in the fast-evolving world of AI! 🚀 #AI #MachineLearning #JavaScript #TechCommunity",
        role:'Member',
        posts: 100,
        members: 2000,
        link: ROUTES.communities,
    },
    {
        id:4,
        name:'Node.Js developers',
        icon:node,
        description:"Node.js universe, where JavaScript breaks free from the browser and powers scalable servers, APIs, and real-time applications! Whether you're building RESTful services, WebSocket-driven apps, or serverless functions, this community is your hub for all things async, event-driven, and lightning-fast.",
        role:'Owner',
        posts: 235,
        members: 2456,
        link: ROUTES.communities,
    }


]