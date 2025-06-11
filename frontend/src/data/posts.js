import post1 from '../assets/icons/post1.jpg'
import post2 from '../assets/icons/post2.jpg'
import post4 from '../assets/icons/post4.png'
import post3 from '../assets/icons/post3.jpg'
import post5 from '../assets/icons/post5.jpeg'
import post6 from '../assets/icons/post6.png'
import post7 from '../assets/icons/post7.jpeg'
import profile from '../assets/images/user1.jpeg'
import profile2 from '../assets/images/user2.png'
import typelogo from '../assets/icons/typescript.png'
import like from '../assets/icons/like.png'
import comments from '../assets/icons/comments.png'
import python from '../assets/icons/python.png'
import react from '../assets/icons/react.png'
import docker from '../assets/icons/docker.png'
import java from '../assets/icons/java.png'
import tensorflow from '../assets/icons/artificial.png'
import css from '../assets/icons/css.png'
import javascript from '../assets/icons/java-script.png'
import profile3 from '../assets/images/user.png'
import profile4 from '../assets/images/user4.png'
import profile5 from '../assets/images/user5.png'
import profile6 from '../assets/images/user6.png'
import profile7 from '../assets/images/user7.png'
import api from '../assets/icons/api.png'
import api2 from '../assets/icons/api.svg'
import rust from '../assets/icons/rust.png'
import expert from '../assets/icons/expert.webp'
import post9 from '../assets/icons/post9.jpeg'
import ai from '../assets/icons/artificial.png'
import post10 from '../assets/icons/post10.jpeg'

export const posts = [    
    {
        id: 1,
        title: 'Unlock the power of advanced TypeScript',
        content: 'Once you are comfortable with the basics of TypeScript, it\'s time to explore the advanced features that make it a truly powerful language',
        votes: 234,
        comments:23,
        author:{
            id:1,
            authorname:'Sarah Developer',
            image:profile,
            handle:'@sarahdeveloper254'
        },
        createdAt: '2025-01-01T08:00:00Z',
        group: 
            {
                id: 'group-1',
                groupIcon: typelogo,
                groupName: 'TypeScript',
                groupLink: '/groups/typescript',
        },
        postBanner: post1
    },
    {
        id: 2,
        title: 'JavaScript ES2024 Features You Should Know',
        content: 'From `.groupBy()` to the new `Records` API, here’s what’s coming in ES2024 and how to use it today with Babel.',
        votes: 320,
        comments: 25,
        author:{
            id:1,
            authorname:'JS Updates',
            image:profile3,
            handle:'@jsupdates'
        },
        createdAt: '2025-03-15T10:00:00Z',
        group: 
            {
                id: 'group-js-news',
                groupIcon: javascript,
                groupName: 'JavaScript News',
                groupLink: '/groups/js-news',
            },
        postBanner: post7,
    },
    {
        id: 3,
        title: 'Why Python 3.12 is Faster Than Ever',
        content: 'With the new adaptive interpreter and optimizations, Python 3.12 is up to **20% faster** in some benchmarks. Here’s why.',
        votes: 410,
        comments: 45,
        author:{
            id:1,
            authorname:'Python Insider',
            image:profile4,
            handle:'@pyinsider'
        },
        createdAt: '2025-04-05T08:00:00Z',
        group: 
            {
                id: 'group-python-lang',
                groupIcon: python,
                groupName: 'Python Language',
                groupLink: '/groups/python',
            },
        postBanner: post2,
    },
    {
        id: 4,
        title: 'Rust vs Go: Which One for System Programming?',
        content: 'Both are great for performance, but Rust’s ownership model and Go’s simplicity make them ideal for different use cases. Let’s compare!',
        votes: 275,
        comments:56,
        author:{
            id:1,
            authorname:'Systems Expert',
            image:profile6,
            handle:'@systemsexpert'
        },
        createdAt: '2025-05-10T12:00:00Z',
        group: 
            {
                id: 'group-rust-lang',
                groupIcon: rust,
                groupName: 'Rust Programming',
                groupLink: '/groups/rust',
            },
        postBanner: expert
    },
    {
        id: 5,
        title: 'How We Scaled Our API to 1M Requests/Second',
        content: 'From load balancing to caching strategies, here’s the tech stack (Node.js + Redis + Kubernetes) and optimizations that made it possible.',
        votes: 520,
        comments:34,
        author:{
            id:1,
            authorname:'ScaleMaster',
            image:profile3,
            handle:'@scalemaster'
        },
        createdAt: '2025-06-01T09:00:00Z',
        group: 
            {
                id: 'group-devops',
                groupIcon: api,
                groupName: 'DevOps Engineers',
                groupLink: '/groups/devops',
            },
        postBanner: api2,
    },
    {
        id: 6,
        title: 'The Future of AI: Beyond GPT-5',
        content: 'Multimodal models, self-improving AI, and ethical challenges—what’s next in artificial intelligence?',
        votes: 890,
        comments: 87,
        author:{
            id:1,
            authorname:'AI Futurist',
            image:profile2,
            handle:'@aifuturist'
        },
        createdAt: '2025-07-20T07:00:00Z',
        group: 
            {
                id: 'group-ai-enthusiasts',
                groupIcon: ai,
                groupName: 'AI Enthusiasts',
                groupLink: '/groups/ai',
            },
        postBanner: post10
    },
    {
        id: 7,
        title: 'CSS 2024: New Features You’ll Love',
        content: 'Container queries, `:has()` selector, and nesting are finally here! Here’s how to use them in production today.',
        votes: 180,
        comments: 21,
        author:{
            id:1,
            authorname:'CSS Updates',
            image:profile2,
            handle:'@cssupdates'
        },
        createdAt: '2025-08-05T11:00:00Z',
        group: 
            {
                id: 'group-css',
                groupIcon: css,
                groupName: 'CSS Developers',
                groupLink: '/groups/css',
            },
        postBanner: post9,
    }
]