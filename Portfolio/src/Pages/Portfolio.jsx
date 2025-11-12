import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Portfolio = () => {
    const containerRef = useRef(null);
    const sidebarRef = useRef(null);
    const projectRefs = useRef([]);
    const imageRefs = useRef([]);
    const titleRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Sidebar pinning
            gsap.to(sidebarRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    pin: sidebarRef.current,
                    pinSpacing: false
                }
            });

            // Project cards animation - FASTER
            projectRefs.current.forEach((project, index) => {
                gsap.fromTo(project,
                    { 
                        x: -80,
                        opacity: 0,
                        scale: 0.95
                    },
                    {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.6,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: project,
                            start: "top 90%",
                            end: "bottom 10%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });

            // Image animations - FASTER
            imageRefs.current.forEach((image, index) => {
                gsap.fromTo(image,
                    { 
                        scale: 1.1,
                        opacity: 0
                    },
                    {
                        scale: 1,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: image,
                            start: "top 95%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });

            // Title animations - FASTER
            titleRefs.current.forEach((title, index) => {
                gsap.fromTo(title,
                    { 
                        y: 30,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: title,
                            start: "top 95%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const projects = [
        {
            id: 1,
            title: "Blender in Webpage",
            category: "3D Web Application",
            description: "A fully functional 3D modeling suite running directly in the browser using WebGL and Three.js. Features real-time rendering, mesh editing, and export capabilities.",
            technologies: ["Three.js", "WebGL", "React", "Node.js"],
            image: "/3d.png",
            status: "Building",
            github: "https://github.com/Ininsico/3DModelBuilder",
            live: "https://ininsico.vercel.app"
        },
        {
            id: 2,
            title: "Zoom Web Clone",
            category: "Video Conferencing",
            description: "Real-time video conferencing platform with screen sharing, chat, and recording features. Built with WebRTC for peer-to-peer communication.",
            technologies: ["WebRTC", "Socket.io", "React", "Express"],
            image: "/zoom.png",
            status: "Completed",
            github: "https://github.com/Ininsico/Combits",
            live: "https://comsatsconnect.vercel.app/"
        },
        {
            id: 3,
            title: "Voice Clone AI",
            category: "Artificial Intelligence",
            description: "Advanced neural network that clones human voices with 95% accuracy. Uses deep learning models for voice synthesis and transfer learning.",
            technologies: ["Python", "TensorFlow", "PyTorch", "NLP"],
            image: "/api/placeholder/600/400",
            status: "In Development",
            github: "https://github.com",
            live: null
        },
        {
            id: 4,
            title: "Air Pollution Detector AI",
            category: "Machine Learning",
            description: "Computer vision system that detects and analyzes air pollution levels from satellite imagery and sensor data using convolutional neural networks.",
            technologies: ["Python", "OpenCV", "CNN", "IoT"],
            image: "/api/placeholder/600/400",
            status: "In Developement",
            github: "https://github.com",
            live: "https://demo.com"
        },
        {
            id: 5,
            title: "Neural Style Transfer",
            category: "Computer Vision",
            description: "Real-time artistic style transfer application that applies famous painting styles to live video feed using generative adversarial networks.",
            technologies: ["TensorFlow", "GAN", "Python", "Flask"],
            image: "/api/placeholder/600/400",
            status: "in Developement",
            github: "https://github.com",
            live: "https://demo.com"
        },
        {
            id: 6,
            title: "Blockchain Voting System",
            category: "Web3 Application",
            description: "Decentralized voting platform built on Ethereum blockchain ensuring transparency, security, and immutability of voting records.",
            technologies: ["Solidity", "Web3.js", "React", "Ethereum"],
            image: "/api/placeholder/600/400",
            status: "In Development",
            github: "https://github.com",
            live: null
        }
    ];

    const categories = [...new Set(projects.map(project => project.category))];

    const addToRefs = (el, refArray) => {
        if (el && !refArray.current.includes(el)) {
            refArray.current.push(el);
        }
    };

    return (
        <section id="portfolio" className="min-h-screen bg-white text-black py-20 px-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter">PROJECTS</h2>
                    <div className="w-32 h-1 bg-black mx-auto mb-8"></div>
                    <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        Building the future one algorithm at a time
                    </p>
                </div>

                <div ref={containerRef} className="flex gap-12">
                    <div ref={sidebarRef} className="w-1/4">
                        <div className="sticky top-24">
                            <h3 className="text-3xl font-black mb-8 border-b-2 border-black pb-4">CATEGORIES</h3>
                            <div className="space-y-2">
                                {categories.map((category, index) => (
                                    <button
                                        key={index}
                                        className="block w-full text-left py-4 px-6 rounded-lg font-bold text-lg hover:bg-black hover:text-white transition-all duration-300 border-2 border-transparent hover:border-black"
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="mt-12 p-6 border-2 border-black rounded-2xl">
                                <h4 className="text-xl font-black mb-4">STATS</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Total Projects</span>
                                        <span className="font-black">{projects.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Completed</span>
                                        <span className="font-black">{projects.filter(p => p.status === 'Completed').length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>In Development</span>
                                        <span className="font-black">{projects.filter(p => p.status === 'In Development').length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-3/4">
                        <div className="space-y-24">
                            {projects.map((project, index) => (
                                <div
                                    key={project.id}
                                    ref={el => addToRefs(el, projectRefs)}
                                    className="bg-transparent border-2 border-black rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                                >
                                    <div className="flex">
                                        <div className="w-2/5 relative overflow-hidden">
                                            <div 
                                                ref={el => addToRefs(el, imageRefs)}
                                                className="w-full h-64 bg-gray-200 group-hover:scale-105 transition-transform duration-500"
                                                style={{
                                                    backgroundImage: `url(${project.image})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center'
                                                }}
                                            ></div>
                                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-black border-2 ${
                                                project.status === 'Completed' 
                                                    ? 'bg-black text-white border-black' 
                                                    : 'bg-white text-black border-black'
                                            }`}>
                                                {project.status}
                                            </div>
                                        </div>

                                        <div className="w-3/5 p-8">
                                            <h3 
                                                ref={el => addToRefs(el, titleRefs)}
                                                className="text-4xl font-black mb-4 leading-tight"
                                            >
                                                {project.title}
                                            </h3>
                                            
                                            <div className="flex items-center mb-4">
                                                <span className="px-3 py-1 bg-black text-white text-sm font-bold rounded-full">
                                                    {project.category}
                                                </span>
                                            </div>

                                            <p className="text-gray-700 text-lg leading-relaxed mb-6">
                                                {project.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {project.technologies.map((tech, techIndex) => (
                                                    <span 
                                                        key={techIndex}
                                                        className="px-3 py-1 bg-gray-100 text-black text-sm font-bold rounded-full border border-black"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex gap-4">
                                                <a 
                                                    href={project.github}
                                                    className="px-6 py-3 bg-black text-white font-bold rounded-full hover:bg-transparent hover:text-black border-2 border-black transition-all duration-300"
                                                >
                                                    GitHub
                                                </a>
                                                {project.live && (
                                                    <a 
                                                        href={project.live}
                                                        className="px-6 py-3 bg-transparent text-black font-bold rounded-full hover:bg-black hover:text-white border-2 border-black transition-all duration-300"
                                                    >
                                                        Live Demo
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center mt-32 pt-16 border-t-2 border-black">
                    <h3 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                        READY TO COLLABORATE?
                    </h3>
                    <button className="bg-black text-white px-12 py-4 rounded-2xl font-bold text-lg border-2 border-black hover:bg-white hover:text-black transition-all duration-300 hover:scale-105">
                        START A PROJECT
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;