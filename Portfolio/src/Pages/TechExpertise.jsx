import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TechnicalExpertise = () => {
    const containerRef = useRef(null);
    const sectionRefs = useRef([]);
    const titleRef = useRef(null);
    const skillBarsRef = useRef([]);
    const textRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(titleRef.current, 
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }
            );

            gsap.fromTo(sectionRefs.current,
                { 
                    y: 100,
                    opacity: 0,
                    scale: 0.9
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%",
                        end: "bottom 20%",
                        toggleActions: "play none none none"
                    }
                }
            );

            skillBarsRef.current.forEach((skillBar, index) => {
                gsap.fromTo(skillBar,
                    { width: "0%" },
                    {
                        width: skillBar.style.width,
                        duration: 1.2,
                        delay: 0.3 + (index * 0.05),
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: skillBar.parentElement,
                            start: "top 90%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });

            textRefs.current.forEach((text, index) => {
                gsap.fromTo(text,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        delay: 0.5 + (index * 0.1),
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: text,
                            start: "top 90%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const expertiseSections = [
        {
            id: 1,
            category: "Programming Languages",
            skills: [
                { name: "Python", level: 90, description: "Data Science & Automation" },
                { name: "JavaScript/TypeScript", level: 88, description: "Full Stack Development" },
                { name: "Java", level: 75, description: "Enterprise Applications" },
                { name: "C++", level: 70, description: "System Programming" },
                { name: "SQL", level: 85, description: "Database Management" }
            ],
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/>
                    <path d="M12 2v20"/>
                </svg>
            )
        },
        {
            id: 2,
            category: "Frontend Technologies",
            skills: [
                { name: "React.js", level: 92, description: "Component Architecture" },
                { name: "Next.js", level: 85, description: "SSR & Performance" },
                { name: "Tailwind CSS", level: 88, description: "Utility-First CSS" },
                { name: "Redux Toolkit", level: 82, description: "State Management" },
                { name: "GSAP", level: 78, description: "Animations & Interactions" }
            ],
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <path d="M8 21h8M12 17v4"/>
                </svg>
            )
        },
        {
            id: 3,
            category: "Backend & Databases",
            skills: [
                { name: "Node.js", level: 87, description: "Runtime Environment" },
                { name: "Express.js", level: 85, description: "Web Framework" },
                { name: "MongoDB", level: 80, description: "NoSQL Database" },
                { name: "PostgreSQL", level: 78, description: "Relational Database" },
                { name: "Redis", level: 72, description: "Caching & Sessions" }
            ],
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <ellipse cx="12" cy="5" rx="9" ry="3"/>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
            )
        },
        {
            id: 4,
            category: "AI & Machine Learning",
            skills: [
                { name: "TensorFlow", level: 83, description: "Deep Learning" },
                { name: "PyTorch", level: 79, description: "Research & Prototyping" },
                { name: "Scikit-learn", level: 85, description: "Classical ML" },
                { name: "OpenCV", level: 76, description: "Computer Vision" },
                { name: "NLTK", level: 72, description: "Natural Language" }
            ],
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a10 10 0 0 1 7.38 16.75A10 10 0 0 1 12 2z"/>
                    <path d="M12 2v20"/>
                    <path d="M2 12h20"/>
                    <circle cx="12" cy="12" r="4"/>
                </svg>
            )
        },
        {
            id: 5,
            category: "DevOps & Cloud",
            skills: [
                { name: "Docker", level: 75, description: "Containerization" },
                { name: "AWS", level: 68, description: "Cloud Services" },
                { name: "Git/GitHub", level: 90, description: "Version Control" },
                { name: "CI/CD", level: 72, description: "Automation" },
                { name: "Linux", level: 80, description: "System Administration" }
            ],
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 19l6-6-6-6M12 5h6M12 19h6"/>
                    <path d="M2 5h4M2 12h4M2 19h4"/>
                </svg>
            )
        },
        {
            id: 6,
            category: "Mobile Development",
            skills: [
                { name: "React Native", level: 78, description: "Cross-Platform" },
                { name: "Flutter", level: 65, description: "Dart Framework" },
                { name: "iOS Swift", level: 60, description: "Native iOS" },
                { name: "Android Kotlin", level: 62, description: "Native Android" },
                { name: "Expo", level: 70, description: "Development Platform" }
            ],
            icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                    <path d="M12 18h0"/>
                </svg>
            )
        }
    ];

    const addToRefs = (el) => {
        if (el && !sectionRefs.current.includes(el)) {
            sectionRefs.current.push(el);
        }
    };

    const addToSkillBars = (el, width) => {
        if (el && !skillBarsRef.current.includes(el)) {
            el.style.width = `${width}%`;
            skillBarsRef.current.push(el);
        }
    };

    const addToTextRefs = (el) => {
        if (el && !textRefs.current.includes(el)) {
            textRefs.current.push(el);
        }
    };

    return (
        <section id="technical-expertise" className="min-h-screen bg-white text-black py-32 px-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: '50px 50px'
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-24">
                    <h2 
                        ref={titleRef}
                        className="text-7xl md:text-9xl font-black mb-8 tracking-tighter opacity-0"
                    >
                        TECH
                    </h2>
                    <div className="w-32 h-1 bg-black mx-auto mb-8"></div>
                    <p ref={addToTextRefs} className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed opacity-0">
                        Mastering the digital tools that shape tomorrow's innovation landscape
                    </p>
                </div>

                <div 
                    ref={containerRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32"
                >
                    {expertiseSections.map((section, index) => (
                        <div
                            key={section.id}
                            ref={addToRefs}
                            className="bg-transparent border-2 border-black rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 group opacity-0"
                        >
                            <div className="flex items-center mb-8 pb-6 border-b-2 border-black group-hover:border-gray-400 transition-colors duration-300">
                                <div className="mr-4 group-hover:scale-110 transition-transform duration-300">
                                    {section.icon}
                                </div>
                                <h3 className="text-2xl font-black tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                                    {section.category}
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {section.skills.map((skill, skillIndex) => (
                                    <div key={skillIndex} className="group/skill">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-bold text-lg mb-1 group-hover/skill:translate-x-2 transition-transform duration-300">
                                                    {skill.name}
                                                </div>
                                                <div className="text-sm text-gray-600 group-hover/skill:translate-x-2 transition-transform duration-300 delay-75">
                                                    {skill.description}
                                                </div>
                                            </div>
                                            <span className="font-black text-xl bg-black text-white px-3 py-1 rounded-lg group-hover/skill:scale-110 transition-transform duration-300">
                                                {skill.level}%
                                            </span>
                                        </div>
                                        <div className="h-3 bg-gray-300 rounded-full overflow-hidden border border-black">
                                            <div 
                                                ref={el => addToSkillBars(el, skill.level)}
                                                className="h-full bg-black rounded-full transition-all duration-1000 ease-out transform origin-left"
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center border-t-2 border-black pt-16">
                    <h3 ref={addToTextRefs} className="text-4xl md:text-5xl font-black mb-6 tracking-tight opacity-0">
                        READY TO ENGINEER TOMORROW?
                    </h3>
                    <p ref={addToTextRefs} className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed opacity-0">
                        Let's combine technical excellence with innovative vision to build solutions that matter
                    </p>
                    <button className="bg-black text-white px-12 py-4 rounded-2xl font-bold text-lg border-2 border-black hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                        INITIATE COLLABORATION
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TechnicalExpertise;