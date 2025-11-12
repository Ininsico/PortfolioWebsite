import React from 'react';

const About = () => {
    const timelineData = [
        {
            period: "Matriculation",
            institution: "APCSACS Saraialagmir",
            location: "Jhelum Roots",
            description: "Where the foundation was laid—the beginning of an academic journey rooted in heritage",
            year: "Foundation Years",
            icon: "📜"
        },
        {
            period: "FSC",
            institution: "Government College University Lahore",
            location: "The Prestigious Institute",
            description: "Immersed in academic excellence at one of Pakistan's most revered institutions",
            year: "Intermediate",
            icon: "🏛️"
        },
        {
            period: "BS Computer Science",
            institution: "COMSATS Abbottabad",
            location: "Current Journey",
            description: "Diving deep into the digital realm, crafting the future through code and innovation",
            year: "Present",
            icon: "💻"
        }
    ];

    const skillsData = [
        { name: "Machine Learning", level: 85, description: "AI & Neural Networks" },
        { name: "Fullstack Development", level: 90, description: "End-to-End Solutions" },
        { name: "Frontend Technologies", level: 88, description: "User Experience & Interface" },
        { name: "Backend Development", level: 82, description: "Server Architecture & APIs" }
    ];

    const quote = "پروانہ باوجودِ علمِ ضرر، شعلۂ عشق میں کرے خودسپاری کہ حُسنِ زلیخا نہیں مِلتا، یوسف! بغیرِ ریاضتِ ہجرِ جاوداں";

    return (
        <section id="about" className="min-h-screen bg-black text-white py-20 px-4 relative overflow-hidden">
            {/* Subtle background patterns */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full"></div>
                <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-white rounded-full"></div>
                <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Hero Section with Quote */}
                <div className="text-center mb-24">
                    <div className="mb-12">
                        <div className="text-sm uppercase tracking-widest text-gray-400 mb-4">The Journey</div>
                        <h1 className="text-7xl md:text-9xl font-black mb-8 text-white tracking-tight">
                            MY STORY
                        </h1>
                    </div>
                    
                    {/* Persian/Urdu Quote */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-500">
                            <p className="text-2xl md:text-3xl leading-relaxed text-white/90 font-light text-center font-urdu" dir="rtl">
                                {quote}
                            </p>
                            <div className="mt-6 text-sm text-gray-400 text-center max-w-2xl mx-auto">
                                "Like the moth that knowingly embraces the flame, true beauty is only achieved through eternal sacrifice and perseverance"
                            </div>
                        </div>
                    </div>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        From the historic lands of <span className="text-white font-bold border-b-2 border-white">Jhelum</span> to the 
                        prestigious halls of <span className="text-white font-bold border-b-2 border-white">GCU Lahore</span>, 
                        now forging destiny through code at <span className="text-white font-bold border-b-2 border-white">COMSATS Abbottabad</span>
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    {/* Timeline Section */}
                    <div className="space-y-16">
                        <div className="text-center">
                            <h2 className="text-5xl font-black mb-4 text-white tracking-wide">ACADEMIC ODYSSEY</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-white to-white/20 mx-auto"></div>
                        </div>
                        
                        {timelineData.map((item, index) => (
                            <div key={index} className="relative pl-16 group">
                                {/* Enhanced Timeline Line */}
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white via-white/50 to-white/10 transform origin-top group-hover:scale-y-125 transition-all duration-700"></div>
                                
                                {/* Sophisticated Icon */}
                                <div className="absolute left-0 -translate-x-1/2 bg-black p-4 rounded-full border-2 border-white/30 group-hover:border-white group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-2xl">
                                    <span className="text-2xl">{item.icon}</span>
                                </div>

                                {/* Elevated Content Card */}
                                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-500 hover:shadow-2xl hover:scale-105">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-3xl font-bold text-white tracking-wide">{item.period}</h3>
                                        <span className="text-sm text-white/80 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                                            {item.year}
                                        </span>
                                    </div>
                                    <h4 className="text-xl text-white/90 font-semibold mb-3 tracking-wide">{item.institution}</h4>
                                    <p className="text-white/70 font-medium mb-4 text-lg">{item.location}</p>
                                    <p className="text-white/80 leading-relaxed text-lg">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Skills & Focus Section */}
                    <div className="space-y-16">
                        {/* Current Focus */}
                        <div>
                            <div className="text-center mb-12">
                                <h2 className="text-5xl font-black mb-4 text-white tracking-wide">CURRENT FOCUS</h2>
                                <div className="w-24 h-1 bg-gradient-to-r from-white to-white/20 mx-auto"></div>
                            </div>
                            
                            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 hover:border-white/30 transition-all duration-500">
                                <div className="text-center mb-10">
                                    <div className="text-7xl mb-6">⚡</div>
                                    <h3 className="text-4xl font-black text-white mb-6 tracking-wide">
                                        5TH SEMESTER CS
                                    </h3>
                                    <p className="text-xl text-white/80 leading-relaxed">
                                        Forging the future with cutting-edge technology and relentless innovation
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 text-center">
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 group">
                                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🤖</div>
                                        <h4 className="font-black text-white text-lg mb-2 tracking-wide">Machine Learning</h4>
                                        <p className="text-sm text-white/60">AI & Neural Networks</p>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-300 group">
                                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🌐</div>
                                        <h4 className="font-black text-white text-lg mb-2 tracking-wide">Fullstack Dev</h4>
                                        <p className="text-sm text-white/60">End-to-End Solutions</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Skills Progress */}
                        <div>
                            <div className="text-center mb-10">
                                <h3 className="text-4xl font-black mb-4 text-white tracking-wide">TECHNICAL ARSENAL</h3>
                                <div className="w-24 h-1 bg-gradient-to-r from-white to-white/20 mx-auto"></div>
                            </div>
                            
                            <div className="space-y-8">
                                {skillsData.map((skill, index) => (
                                    <div key={index} className="group">
                                        <div className="flex justify-between mb-3">
                                            <div>
                                                <span className="font-black text-white text-lg tracking-wide">{skill.name}</span>
                                                <p className="text-sm text-white/60 mt-1">{skill.description}</p>
                                            </div>
                                            <span className="text-white font-black text-xl bg-white/10 px-3 py-1 rounded-lg border border-white/20">
                                                {skill.level}%
                                            </span>
                                        </div>
                                        <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/10">
                                            <div 
                                                className="h-full bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-1500 ease-out transform origin-left group-hover:scale-x-105 shadow-lg"
                                                style={{ width: `${skill.level}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Philosophy Section */}
                <div className="mt-28 text-center">
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-16 border border-white/10 hover:border-white/30 transition-all duration-500">
                        <h2 className="text-6xl font-black mb-8 text-white tracking-tight">
                            THE MISSION
                        </h2>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-5xl mx-auto mb-12 font-light">
                            "From the historic grounds of <span className="text-white font-semibold">Jhelum</span> to the digital frontiers of tomorrow, 
                            I'm bridging centuries of heritage with cutting-edge innovation—one algorithm at a time."
                        </p>
                        <div className="mt-12 flex justify-center space-x-6 flex-wrap gap-4">
                            <span className="px-6 py-3 bg-white/10 text-white rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 font-semibold text-lg">#JhelumPride</span>
                            <span className="px-6 py-3 bg-white/10 text-white rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 font-semibold text-lg">#GCULegacy</span>
                            <span className="px-6 py-3 bg-white/10 text-white rounded-2xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 font-semibold text-lg">#COMSATSRising</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;