import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const APIIntegration = () => {
    const containerRef = useRef(null);
    const apiRefs = useRef([]);
    const flowRefs = useRef([]);
    const sectionRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // API flow animation
            gsap.fromTo(apiRefs.current,
                { 
                    y: 50,
                    opacity: 0 
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 80%",
                        toggleActions: "play none none none"
                    }
                }
            );

            // Flow arrows animation
            gsap.fromTo(flowRefs.current,
                { 
                    scaleX: 0,
                    opacity: 0 
                },
                {
                    scaleX: 1,
                    opacity: 1,
                    duration: 0.4,
                    stagger: 0.3,
                    ease: "power2.out"
                }
            );

            // Section animations
            gsap.fromTo(sectionRefs.current,
                { 
                    y: 80,
                    opacity: 0 
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.3,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRefs.current,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const addToRefs = (el, refArray) => {
        if (el && !refArray.current.includes(el)) {
            refArray.current.push(el);
        }
    };

    return (
        <div className="bg-black text-white">
            {/* API Flow Section */}
            <section className="min-h-screen py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h1 className="text-7xl md:text-9xl font-black mb-8">API FLOW</h1>
                        <p className="text-2xl text-gray-300">Real-time data transfer between microservices</p>
                    </div>

                    <div ref={containerRef} className="flex items-center justify-center space-x-8 md:space-x-16 lg:space-x-24 mb-20">
                        {/* Auth API */}
                        <div 
                            ref={el => addToRefs(el, apiRefs)}
                            className="text-center p-6 border-2 border-white rounded-xl min-w-[180px] opacity-0"
                        >
                            <div className="text-2xl font-black mb-3">AUTH</div>
                            <div className="text-gray-300 text-sm">JWT Tokens</div>
                            <div className="text-gray-300 text-sm">Sessions</div>
                        </div>

                        <div 
                            ref={el => addToRefs(el, flowRefs)}
                            className="text-3xl font-black opacity-0 transform origin-center"
                        >
                            →
                        </div>

                        {/* Users API */}
                        <div 
                            ref={el => addToRefs(el, apiRefs)}
                            className="text-center p-6 border-2 border-white rounded-xl min-w-[180px] opacity-0"
                        >
                            <div className="text-2xl font-black mb-3">USERS</div>
                            <div className="text-gray-300 text-sm">Profiles</div>
                            <div className="text-gray-300 text-sm">Settings</div>
                        </div>

                        <div 
                            ref={el => addToRefs(el, flowRefs)}
                            className="text-3xl font-black opacity-0 transform origin-center"
                        >
                            →
                        </div>

                        {/* AI API */}
                        <div 
                            ref={el => addToRefs(el, apiRefs)}
                            className="text-center p-6 border-2 border-white rounded-xl min-w-[180px] opacity-0"
                        >
                            <div className="text-2xl font-black mb-3">AI</div>
                            <div className="text-gray-300 text-sm">Voice Clone</div>
                            <div className="text-gray-300 text-sm">ML Models</div>
                        </div>

                        <div 
                            ref={el => addToRefs(el, flowRefs)}
                            className="text-3xl font-black opacity-0 transform origin-center"
                        >
                            →
                        </div>

                        {/* Data API */}
                        <div 
                            ref={el => addToRefs(el, apiRefs)}
                            className="text-center p-6 border-2 border-white rounded-xl min-w-[180px] opacity-0"
                        >
                            <div className="text-2xl font-black mb-3">DATA</div>
                            <div className="text-gray-300 text-sm">Air Quality</div>
                            <div className="text-gray-300 text-sm">Analytics</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Database Design Section */}
            <section ref={el => addToRefs(el, sectionRefs)} className="min-h-screen py-20 px-4 border-t border-white opacity-0">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-6xl md:text-8xl font-black mb-8">DATABASE DESIGN</h2>
                        <p className="text-2xl text-gray-300">Optimized schemas for high-performance applications</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="border-2 border-white rounded-xl p-8">
                            <h3 className="text-3xl font-black mb-6">MongoDB Schema</h3>
                            <div className="space-y-4 font-mono text-sm">
                                <div className="border border-white p-4 rounded">
                                    <div className="text-green-400">users: &#123;</div>
                                    <div className="ml-4 text-cyan-400">_id: ObjectId,</div>
                                    <div className="ml-4 text-cyan-400">email: String,</div>
                                    <div className="ml-4 text-cyan-400">preferences: Object,</div>
                                    <div className="ml-4 text-cyan-400">sessions: Array</div>
                                    <div className="text-green-400">&#125;</div>
                                </div>
                                <div className="border border-white p-4 rounded">
                                    <div className="text-green-400">ai_models: &#123;</div>
                                    <div className="ml-4 text-cyan-400">_id: ObjectId,</div>
                                    <div className="ml-4 text-cyan-400">voice_data: Binary,</div>
                                    <div className="ml-4 text-cyan-400">accuracy: Number,</div>
                                    <div className="ml-4 text-cyan-400">training_data: Array</div>
                                    <div className="text-green-400">&#125;</div>
                                </div>
                            </div>
                        </div>

                        <div className="border-2 border-white rounded-xl p-8">
                            <h3 className="text-3xl font-black mb-6">PostgreSQL Schema</h3>
                            <div className="space-y-4 font-mono text-sm">
                                <div className="border border-white p-4 rounded">
                                    <div className="text-green-400">CREATE TABLE users (</div>
                                    <div className="ml-4 text-cyan-400">id SERIAL PRIMARY KEY,</div>
                                    <div className="ml-4 text-cyan-400">email VARCHAR(255) UNIQUE,</div>
                                    <div className="ml-4 text-cyan-400">created_at TIMESTAMP,</div>
                                    <div className="ml-4 text-cyan-400">updated_at TIMESTAMP</div>
                                    <div className="text-green-400">);</div>
                                </div>
                                <div className="border border-white p-4 rounded">
                                    <div className="text-green-400">CREATE TABLE air_quality (</div>
                                    <div className="ml-4 text-cyan-400">id SERIAL PRIMARY KEY,</div>
                                    <div className="ml-4 text-cyan-400">location VARCHAR(100),</div>
                                    <div className="ml-4 text-cyan-400">pollution_level FLOAT,</div>
                                    <div className="ml-4 text-cyan-400">timestamp TIMESTAMP</div>
                                    <div className="text-green-400">);</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* System Architecture Section */}
            <section ref={el => addToRefs(el, sectionRefs)} className="min-h-screen py-20 px-4 border-t border-white opacity-0">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-6xl md:text-8xl font-black mb-8">ARCHITECTURE</h2>
                        <p className="text-2xl text-gray-300">Scalable system design patterns</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="border-2 border-white rounded-xl p-6 text-center">
                            <div className="text-4xl mb-4">⚡</div>
                            <h3 className="text-2xl font-black mb-4">Microservices</h3>
                            <p className="text-gray-300">Independent deployable services</p>
                        </div>
                        <div className="border-2 border-white rounded-xl p-6 text-center">
                            <div className="text-4xl mb-4">🔗</div>
                            <h3 className="text-2xl font-black mb-4">API Gateway</h3>
                            <p className="text-gray-300">Single entry point routing</p>
                        </div>
                        <div className="border-2 border-white rounded-xl p-6 text-center">
                            <div className="text-4xl mb-4">📊</div>
                            <h3 className="text-2xl font-black mb-4">Load Balancer</h3>
                            <p className="text-gray-300">Traffic distribution</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Performance Metrics Section */}
            <section ref={el => addToRefs(el, sectionRefs)} className="min-h-screen py-20 px-4 border-t border-white opacity-0">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-6xl md:text-8xl font-black mb-8">PERFORMANCE</h2>
                        <p className="text-2xl text-gray-300">Real-time monitoring and analytics</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="border-2 border-white rounded-xl p-8">
                            <h3 className="text-3xl font-black mb-6">Response Times</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Auth API:</span>
                                    <span className="font-black">&lt; 50ms</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>AI Processing:</span>
                                    <span className="font-black">&lt; 200ms</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Database Queries:</span>
                                    <span className="font-black">&lt; 10ms</span>
                                </div>
                            </div>
                        </div>

                        <div className="border-2 border-white rounded-xl p-8">
                            <h3 className="text-3xl font-black mb-6">Throughput</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Requests/Second:</span>
                                    <span className="font-black">10,000+</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Concurrent Users:</span>
                                    <span className="font-black">50,000+</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Data Processed:</span>
                                    <span className="font-black">1TB/day</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default APIIntegration;