import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { ArrowRight, Shield, Users, FileCheck, Zap, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Landing() {
    const { user } = useAuth();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // If user is logged in, redirect to dashboard
    if (user) {
        window.location.href = '/dashboard';
        return null;
    }

    const features = [
        {
            icon: FileCheck,
            title: 'Digital Proposals',
            description: 'Upload and manage proposals with secure cloud storage'
        },
        {
            icon: Users,
            title: 'Committee Voting',
            description: 'Real-time voting with automatic quorum calculation'
        },
        {
            icon: Shield,
            title: 'Audit Trail',
            description: 'Complete digital record of all decisions and actions'
        },
        {
            icon: Zap,
            title: 'Instant Results',
            description: 'Automated workflow from submission to approval'
        }
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-900">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute w-full h-full object-cover opacity-40"
                >
                    <source
                        src="https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-connections-27911-large.mp4"
                        type="video/mp4"
                    />
                </video>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-primary/30" />
                {/* Animated Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Header */}
                <header className="w-full px-6 py-6">
                    <nav className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <span className="text-white font-bold text-lg">O</span>
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">OPARS</span>
                        </div>
                        <Link
                            to="/login"
                            className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all duration-300"
                        >
                            Sign In
                        </Link>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="max-w-6xl mx-auto text-center">
                        {/* Animated Badge */}
                        <div
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-sm mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            Online Proposal Approval System
                        </div>

                        {/* Main Heading */}
                        <h1
                            className={`text-5xl md:text-7xl font-bold text-white mb-6 leading-tight transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            Streamline Your
                            <span className="block bg-gradient-to-r from-primary via-red-400 to-secondary bg-clip-text text-transparent">
                                Approval Process
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p
                            className={`text-xl md:text-2xl text-white/60 max-w-2xl mx-auto mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            Transform committee decisions with digital voting, real-time tracking, and complete audit trails.
                        </p>

                        {/* CTA Buttons */}
                        <div
                            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            <Link
                                to="/login"
                                className="group px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a
                                href="#features"
                                className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white font-medium hover:bg-white/10 transition-all duration-300"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </main>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronDown className="w-8 h-8 text-white/40" />
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="relative z-10 py-24 px-6 bg-gradient-to-b from-transparent to-slate-950">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-white/60 text-center mb-16 max-w-2xl mx-auto">
                        A complete solution for managing proposal approvals from submission to decision.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-white/60 text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="relative z-10 py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-white/60 mb-8 max-w-xl mx-auto">
                            Join the digital transformation of proposal management. Start streamlining your approval process today.
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-900 font-semibold hover:bg-white/90 transition-all duration-300 hover:scale-105"
                        >
                            Start Now
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-8 px-6 border-t border-white/10">
                <div className="max-w-7xl mx-auto text-center text-white/40 text-sm">
                    © 2024 OPARS. Universiti Kebangsaan Malaysia.
                </div>
            </footer>
        </div>
    );
}
