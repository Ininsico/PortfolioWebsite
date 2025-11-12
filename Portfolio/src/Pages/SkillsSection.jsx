import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SkillsSection = () => {
    const containerRef = useRef(null)
    const leftStickyRef = useRef(null)
    const skillItemsRef = useRef([])
    const projectCardsRef = useRef([])
    const experienceItemsRef = useRef([])
    const statNumbersRef = useRef([])

    const skills = [
        {
            category: "Frontend",
            items: ["React", "JavaScript", "TypeScript", "HTML/CSS", "Tailwind CSS", "Next.js", "Vue.js"]
        },
        {
            category: "Backend",
            items: ["Node.js", "Express", "Python", "MongoDB", "PostgreSQL", "GraphQL", "Redis"]
        },
        {
            category: "Tools & Others",
            items: ["Git", "Docker", "AWS", "Figma", "Jest", "Webpack", "CI/CD"]
        }
    ];

    const projects = [
        {
            title: "School Website",
            description: "Made a School Website for KidsHeavenSchoolSystem in Faislabad",
            technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redis"],
            image: "/image.png"
        },
        {
            title: "3DModelBuilder",
            description: "Blender in a Webpage Create 3D Models inside a webpage",
            technologies: ["React", "Socket.io", "Express", "PostgreSQL", "Docker"],
            image: "/3d.png"
        },
        {
            title: "ComsatConnect",
            description: "Zoom App inside a Webpage Create Invite Add members Share screen record Meetings",
            technologies: ["Python", "TensorFlow", "React", "FastAPI", "AWS"],
            image: "/zoom.png"
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Immediate animations with no delay
            gsap.fromTo(leftStickyRef.current,
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: leftStickyRef.current,
                        start: "top 90%",
                        end: "bottom 10%",
                        toggleActions: "play none none none"
                    }
                }
            )

            // Fast skill items animation
            skillItemsRef.current.forEach((item) => {
                gsap.fromTo(item,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        scrollTrigger: {
                            trigger: item,
                            start: "top 90%",
                            end: "bottom 10%",
                            toggleActions: "play none none none"
                        }
                    }
                )
            })

            // Fast project cards
            projectCardsRef.current.forEach((card) => {
                gsap.fromTo(card,
                    {
                        opacity: 0,
                        y: 40
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                            end: "bottom 15%",
                            toggleActions: "play none none none"
                        }
                    }
                )
            })

            // Fast experience items
            experienceItemsRef.current.forEach((item) => {
                gsap.fromTo(item,
                    {
                        opacity: 0,
                        x: -50
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.4,
                        scrollTrigger: {
                            trigger: item,
                            start: "top 90%",
                            end: "bottom 10%",
                            toggleActions: "play none none none"
                        }
                    }
                )
            })

            // Fast stat numbers
            statNumbersRef.current.forEach((stat) => {
                gsap.fromTo(stat,
                    {
                        scale: 0.8
                    },
                    {
                        scale: 1,
                        duration: 0.3,
                        scrollTrigger: {
                            trigger: stat,
                            start: "top 95%",
                            end: "bottom 5%",
                            toggleActions: "play none none none"
                        }
                    }
                )
            })

            // Fast sections
            const sections = gsap.utils.toArray('.content-section')
            sections.forEach((section) => {
                gsap.fromTo(section,
                    {
                        opacity: 0,
                        y: 60
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        scrollTrigger: {
                            trigger: section,
                            start: "top 85%",
                            end: "bottom 15%",
                            toggleActions: "play none none none"
                        }
                    }
                )
            })

            // Fast skill bubbles
            const skillBubbles = gsap.utils.toArray('.skill-bubble')
            skillBubbles.forEach((bubble) => {
                gsap.fromTo(bubble,
                    {
                        scale: 0.7
                    },
                    {
                        scale: 1,
                        duration: 0.3,
                        scrollTrigger: {
                            trigger: bubble,
                            start: "top 95%",
                            end: "bottom 5%",
                            toggleActions: "play none none none"
                        }
                    }
                )
            })

        }, containerRef)

        return () => ctx.revert()
    }, [])

    const addToSkillRefs = (el) => {
        if (el && !skillItemsRef.current.includes(el)) {
            skillItemsRef.current.push(el)
        }
    }

    const addToProjectRefs = (el) => {
        if (el && !projectCardsRef.current.includes(el)) {
            projectCardsRef.current.push(el)
        }
    }

    const addToExperienceRefs = (el) => {
        if (el && !experienceItemsRef.current.includes(el)) {
            experienceItemsRef.current.push(el)
        }
    }

    const addToStatRefs = (el) => {
        if (el && !statNumbersRef.current.includes(el)) {
            statNumbersRef.current.push(el)
        }
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-didone">
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sticky Container */}
                    <div className="lg:w-1/3">
                        <div ref={leftStickyRef} className="sticky top-8 bg-black rounded-2xl p-8 border border-white">
                            <div className="text-center mb-8">
                                <div className="w-40 h-40 mx-auto mb-6 rounded-full border-4 border-white overflow-hidden">
                                    <img
                                        src="/Me.jpeg"
                                        alt="Arslan Rathore"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h1 className="text-4xl font-bold font-didone mb-2 tracking-tight">
                                    ARSLAN RATHORE
                                </h1>
                                <h2 className="text-xl font-didone mb-4 opacity-80">ININSICO CORP</h2>
                                <p className="text-lg opacity-70 font-didone">
                                    FULL STACK DEVELOPER & ML ENTHUSIAST
                                </p>
                            </div>

                            <div className="space-y-8">
                                {skills.map((skillGroup, index) => (
                                    <div
                                        key={index}
                                        ref={addToSkillRefs}
                                        className="border border-white rounded-xl p-6"
                                    >
                                        <h3 className="font-didone font-bold text-xl mb-4 tracking-wide">
                                            {skillGroup.category}
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {skillGroup.items.map((skill, skillIndex) => (
                                                <span
                                                    key={skillIndex}
                                                    className="skill-bubble px-4 py-2 border border-white rounded-full text-sm font-didone hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div ref={addToSkillRefs} className="mt-8 pt-8 border-t border-white">
                                <h3 className="font-didone font-bold text-xl mb-4 tracking-wide">CONTACT</h3>
                                <div className="space-y-3 text-lg">
                                    <p className="font-didone">📧 ininsico@gmail.com</p>
                                    <p className="font-didone">📱 +923315821144</p>
                                    <p className="font-didone">📍 SF Hostel Comsat Abbottabad</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Scrollable Content */}
                    <div className="lg:w-2/3">
                        <div className="space-y-16">
                            {/* About Section */}
                            <section ref={addToSkillRefs} className="content-section border border-white rounded-2xl p-10">
                                <h2 className="text-3xl font-didone font-bold mb-8 tracking-tight">ABOUT ME</h2>
                                <p className="text-xl leading-relaxed opacity-90 font-didone mb-8">
                                    PASSIONATE FULL-STACK DEVELOPER WITH EXPERTISE IN MODERN WEB TECHNOLOGIES.
                                    I CREATE SEAMLESS, USER-FRIENDLY APPLICATIONS THAT SOLVE REAL-WORLD PROBLEMS.
                                    CURRENTLY PUSHING BOUNDARIES AT ININSICO CORP, BUILDING INNOVATIVE SOLUTIONS
                                    THAT MAKE A DIFFERENCE.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-6 border border-white rounded-lg">
                                        <div ref={addToStatRefs} className="text-4xl font-didone font-bold mb-2">50+</div>
                                        <div className="text-lg opacity-80 font-didone">PROJECTS COMPLETED</div>
                                    </div>
                                    <div className="text-center p-6 border border-white rounded-lg">
                                        <div ref={addToStatRefs} className="text-4xl font-didone font-bold mb-2">3+</div>
                                        <div className="text-lg opacity-80 font-didone">YEARS EXPERIENCE</div>
                                    </div>
                                    <div className="text-center p-6 border border-white rounded-lg">
                                        <div ref={addToStatRefs} className="text-4xl font-didone font-bold mb-2">100%</div>
                                        <div className="text-lg opacity-80 font-didone">CLIENT SATISFACTION</div>
                                    </div>
                                </div>
                            </section>

                            {/* Featured Projects */}
                            <section className="content-section border border-white rounded-2xl p-10">
                                <h2 className="text-3xl font-didone font-bold mb-8 tracking-tight">FEATURED PROJECTS</h2>
                                <div className="space-y-10">
                                    {projects.map((project, index) => (
                                        <div
                                            key={index}
                                            ref={addToProjectRefs}
                                            className="border border-white rounded-xl p-8 hover:bg-white hover:text-black transition-all duration-500"
                                        >
                                            <div className="flex flex-col lg:flex-row gap-8 items-center">
                                                <div className="lg:w-2/5">
                                                    <div className="w-full h-64 border-2 border-white rounded-lg overflow-hidden">
                                                        <img
                                                            src={project.image}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="lg:w-3/5">
                                                    <h3 className="text-2xl font-didone font-bold mb-4 tracking-tight">{project.title}</h3>
                                                    <p className="text-lg opacity-90 mb-6 font-didone leading-relaxed">{project.description}</p>
                                                    <div className="flex flex-wrap gap-3">
                                                        {project.technologies.map((tech, techIndex) => (
                                                            <span
                                                                key={techIndex}
                                                                className="px-4 py-2 border border-white rounded-full text-sm font-didone"
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Experience Timeline */}
                            <section className="content-section border border-white rounded-2xl p-10">
                                <h2 className="text-3xl font-didone font-bold mb-8 tracking-tight">EXPERIENCE</h2>
                                <div className="space-y-8">
                                    <div
                                        ref={addToExperienceRefs}
                                        className="border-l-4 border-white pl-8 py-4"
                                    >
                                        <h3 className="text-2xl font-didone font-bold mb-2">FullStack DEVELOPER</h3>
                                        <p className="text-xl font-didone mb-4 opacity-80">ININSICO CORP • 2022 - PRESENT</p>
                                        <p className="text-lg opacity-90 font-didone leading-relaxed">
                                            LEADING DEVELOPMENT  AND ARCHITECTING SCALABLE SOLUTIONS FOR ENTERPRISE CLIENTS.
                                            SPEARHEADING INNOVATION IN WEB TECHNOLOGIES AND MENTORING JUNIOR DEVELOPERS.
                                        </p>
                                    </div>
                                    <div
                                        ref={addToExperienceRefs}
                                        className="border-l-4 border-white pl-8 py-4"
                                    >
                                        <h3 className="text-2xl font-didone font-bold mb-2">FULL STACK DEVELOPER</h3>
                                        <p className="text-xl font-didone mb-4 opacity-80">InfoTech</p>
                                        <p className="text-lg opacity-90 font-didone leading-relaxed">
                                            DEVELOPED AND MAINTAINED MULTIPLE WEB APPLICATIONS USING MODERN FRAMEWORKS.
                                            IMPLEMENTED CLOUD SOLUTIONS AND OPTIMIZED APPLICATION PERFORMANCE.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Certifications */}
                            <section className="content-section border border-white rounded-2xl p-10">
                                <h2 className="text-3xl font-didone font-bold mb-8 tracking-tight">CERTIFICATIONS</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border border-white p-6 rounded-lg hover:bg-white hover:text-black transition-all duration-300">
                                        <h3 className="text-xl font-didone font-bold mb-2">Comsat Semester Project Winner</h3>
                                        <p className="text-lg opacity-80 font-didone">Website Developement</p>
                                    </div>
                                    <div className="border border-white p-6 rounded-lg hover:bg-white hover:text-black transition-all duration-300">
                                        <h3 className="text-xl font-didone font-bold mb-2">CNNA Course Networking</h3>
                                        <p className="text-lg opacity-80 font-didone">Hawaeui</p>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkillsSection