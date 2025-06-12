import { ROUTES } from '../config/constants'

import ruby from '../assets/icons/ruby.png'
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


export const groups = [
    {   id:1,
        name: 'React DevOps',
        icon: react,
        description: "React DevOps is a vibrant group for frontend developers passionate about React.js, Next.js, and modern web development. Whether you're a beginner looking to learn or an experienced coder wanting to share knowledge, this is the perfect space to collaborate, discuss best practices, and stay updated with the latest trends. Join us to exchange ideas, solve coding challenges, work on projects, and network with fellow React enthusiasts. Let's build amazing web experiences together",
        type:'private',
        posts: 1000,
        members: 24000,
        link: ROUTES.communities,
    },
    {
        id:2,
        name: 'JavaScript Devs',
        icon: javascript,
        description: "Calling all JavaScript enthusiasts! This is your hub for everything JS—whether you're mastering the basics, diving into frameworks like React and Node.js, or exploring advanced concepts. Join to share knowledge, collaborate on projects, solve coding challenges, and stay updated with the latest in the JavaScript ecosystem. Perfect for learners, coders, and tech pros alike. Let’s build, break, and innovate together!",
        type:'public',
        posts: 156,
        members: 36000,
        link: ROUTES.communities,
    },
    {
        id:3,
        name: 'Php Elephants',
        icon: php,
        description: "Join the herd of passionate PHP developers who keep the digital world running! PHP remains one of the most reliable and widely used server-side scripting languages, powering giants like WordPress, Facebook (initially), and Wikipedia. Whether you're working with legacy systems or modern frameworks like Laravel and Symfony, this community is your go-to hub for sharing knowledge, troubleshooting challenges, and staying ahead in backend development.",
        type:'private',
        posts: 100,
        members: 2000,
        link: ROUTES.communities,
    },
    {
        id:4,
        name: 'Ruby Devs',
        icon: ruby,
        description: "Welcome to the world of Ruby, where clean syntax meets developer happiness! Whether you're crafting elegant Rails applications, building APIs, or scripting with Ruby's expressive power, this community is your space to connect, learn, and grow.",
        type:'public',
        posts: 345,
        members: 10000,
        link: ROUTES.communities,
    },
    {
        id:5,
        name: 'Java Devs',
        icon: java,
        description: "Java Devs,  where reliability meets innovation! Whether you're developing enterprise-grade applications, Android apps, or diving into Spring Boot microservices, this community is your hub for mastering Java's powerful ecosystem",
        type:'private',
        posts: 100,
        members: 10000,
        link: ROUTES.communities,
    },
    {
        id:6,
        name: 'Python Devs',
        icon: python,
        description: "The Swiss Army knife of programming! Whether you're diving into data science, automating tasks, building web apps with Django/Flask, or exploring AI with TensorFlow, this community is your launchpad for all things Pythonic.",
        type:'public',
        posts: 100,
        members: 10000,
        link: ROUTES.communities,
    },
    {
        id:7,
        name: 'C Devs',
        icon: c,
        description:"The  foundation of modern computing! Whether you're writing kernel modules, embedded firmware, high-performance algorithms, or just love the raw power of pointers and memory management, this community is for those who speak in bits, bytes, and sheer efficiency.",
        type:'private',
        posts: 100,
        members: 10000,
        link: ROUTES.communities,
    },
    {
        id:8,
        name: 'C++ Devs',
        icon: cpp,
        description: "Welcome to the realm of C++, the language that shapes high-performance software, game engines, and cutting-edge systems! Whether you're optimizing complex algorithms, building cross-platform applications, or pushing the limits of embedded systems, this community is your hub for mastering the art and science of C++.",
        type:'public',
        posts: 100,
        members: 10000,
        link: ROUTES.communities,
    },
    {
        id:9,
        name:'Node.Js developers',
        icon:node,
        description:"Node.js universe, where JavaScript breaks free from the browser and powers scalable servers, APIs, and real-time applications! Whether you're building RESTful services, WebSocket-driven apps, or serverless functions, this community is your hub for all things async, event-driven, and lightning-fast.",
        type:'private',
        posts: 235,
        members: 2456,
        link: ROUTES.communities,
    },
    {
        id:10,
        name:'C - Shappers',
        icon:csharp,
        description:"Welcome to the world of C# and .NET! Whether you're building Windows apps, web apps, or mobile apps, this community is your hub for mastering the art and science of C# and .NET.",
        type:'public',
        posts: 342,
        members:5423,
        link: ROUTES.communities,
    },
    {
        id:11,
        name:'Cyber Security',
        icon:cyber,
        description:"Where every line of defense matters and every vulnerability tells a story. Whether you're a penetration tester, ethical hacker, security analyst, or just starting your journey in securing the digital realm, this is your command center.",
        type:'private',
        posts: 134,
        members: 345,
        link: ROUTES.communities,
    },
    {
        id:12,
        name:"Go lang devs",
        description:"Go (Golang) is for those who crave clean code without sacrificing speed. Whether you're building microservices, cloud-native apps, or CLI tools, Go's concurrency model and minimalistic design let you ship efficient, scalable code fast.",
        icon:go,
        type:'public',
        posts: 237,
        members: 785,
        link: ROUTES.communities,
    },
    {
        id:13,
        name:"Swift Crafters",
        icon:swift,
        description:"Swift is where elegance meets performance. Whether you're crafting iOS apps, macOS utilities, or server-side projects, Swift’s modern syntax and powerful features let you turn ideas into reality—without the baggage.",
        type:'public',
        posts: 125,
        members: 657,
        link: ROUTES.communities,
    },
    {
        id:14,
        name:"Mobile Devs",
        icon:mobile,
        description:"From sleek iOS apps with Swift to dynamic Android apps with Kotlin, and cross-platform magic with Flutter or React Native, mobile development is where creativity meets cutting-edge tech. Whether you're optimizing for performance, designing intuitive UI/UX, or bridging native and hybrid solutions, this is your arena.",
        type:'public',
        posts:876,
        members: 657,
        link: ROUTES.communities,
    },
    {
        id:15,
        name:"Rust",
        icon:rust,
        description:"Rust isn’t just a language—it’s a revolution. Whether you’re building system-level software, WebAssembly modules, or high-performance APIs, Rust’s fearless concurrency and memory safety let you push boundaries without crashes or undefined behavior.",
        type:'public',
        posts: 876,
        members: 657,
        link: ROUTES.communities,
    },
    {
        id:16,
        name:'Kotlin Developers',
        icon:kotlin,
        description:"Kotlin is the pragmatic choice for Android development, backend services, and beyond. With its seamless Java interoperability, null safety, and expressive syntax, Kotlin lets you write less boilerplate and focus on what matters—building great software.",
        type:'public',
        posts: 876,
        members: 657,
        link: ROUTES.communities,
    },
    {
        id:17,
        name:"SQL database devs",
        icon:sql,
        description:"SQL is the universal language of databases, transforming raw data into actionable insights. Whether you're optimizing queries, designing schemas, or battling NULLs, this is where data meets precision.",
        type:'public',
        posts: 876,
        members: 657,
        link: ROUTES.communities,
    }



]