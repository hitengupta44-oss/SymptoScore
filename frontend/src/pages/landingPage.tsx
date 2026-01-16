
import React from 'react';
import { HeartPulse, Users, Clock, WifiOff, Zap, ShieldCheck, Share2 } from 'lucide-react';

// Re-usable card components, defined locally
const StatCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-surface p-8 rounded-xl shadow-lg text-center hover:shadow-primary/20 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <div className="flex justify-center items-center mb-4 text-primary">
            {icon}
        </div>
        <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary">{description}</p>
    </div>
);

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-primary mt-1">
            {icon}
        </div>
        <div>
            <h4 className="text-xl font-bold text-text-primary">{title}</h4>
            <p className="text-text-secondary">{description}</p>
        </div>
    </div>
);


const App: React.FC = () => {
    return (
        <div className="bg-background font-sans text-text-primary h-screen overflow-hidden">
            {/* Header */}
            <header className="bg-background/80 backdrop-blur-md fixed top-0 z-50 w-full shadow-md">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-primary">
                        <a href="#">SymptoScore AI</a>
                    </div>
                    <nav className="flex items-center space-x-4">
                        <a href="#" className="text-text-primary hover:text-primary transition-colors">Login</a>
                        <a href="#" className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-light transition-transform duration-300 hover:scale-105">
                            Sign Up
                        </a>
                    </nav>
                </div>
            </header>

            <main className="scroll-container">
                {/* Hero Section */}
                <section className="bg-background relative isolate overflow-hidden full-screen-section">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight mb-4">
                            AI-Powered Medical Screening, <br className="hidden md:block" /> At Your Fingertips.
                        </h1>
                        <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-6">
                            Our intelligent system uses a probabilistic model to analyze your responses, providing a preliminary screening to help you understand your health better. It's fast, confidential, and accessible.
                        </p>
                        <h2 className="font-display text-4xl text-primary mb-8">
                            "Just 10 minutes can make the difference"
                        </h2>
                        <button className="bg-primary text-white font-bold text-xl px-10 py-4 rounded-full shadow-lg hover:bg-primary-light transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50">
                            Start Your Screening
                        </button>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-background full-screen-section">
                    <div className="container mx-auto px-6">
                        <div className="text-center max-w-4xl mx-auto mb-12">
                            <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">Bridging the Healthcare Gap</h2>
                            <p className="text-lg text-text-secondary">
                                High-volume hospitals face immense pressure, leading to long waits. We aim to change that.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <StatCard
                                icon={<Users size={64} strokeWidth={1.5} />}
                                title="Millions Overlooked"
                                description="A significant percentage of visitors leave without proper preliminary screening due to overwhelming crowds."
                            />
                            <StatCard
                                icon={<Clock size={64} strokeWidth={1.5} />}
                                title="Hours in Waiting"
                                description="The average wait time for a simple consultation can stretch for hours, discouraging many from seeking necessary advice."
                            />
                            <StatCard
                                icon={<HeartPulse size={64} strokeWidth={1.5} />}
                                title="Strained Resources"
                                description="Our platform helps alleviate the burden on healthcare professionals by providing an initial layer of screening."
                            />
                        </div>
                    </div>
                </section>

                {/* Lightweight Model Section */}
                <section className="bg-background full-screen-section">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">Lightweight AI, Maximum Impact</h2>
                                <p className="text-lg text-text-secondary mb-6">
                                    Our breakthrough allows our tool to run on any device, even offline, ensuring accessibility for everyone, everywhere.
                                </p>
                            </div>
                            <div className="space-y-8">
                                <BenefitCard
                                    icon={<WifiOff size={32} strokeWidth={1.5} />}
                                    title="Offline Accessibility"
                                    description="Our model runs directly on your device, providing reliable screening without an internet connection."
                                />
                                <BenefitCard
                                    icon={<Zap size={32} strokeWidth={1.5} />}
                                    title="Instantaneous Results"
                                    description="On-device processing means no server delays. Get your preliminary results in seconds."
                                />
                                <BenefitCard
                                    icon={<ShieldCheck size={32} strokeWidth={1.5} />}
                                    title="Enhanced Privacy"
                                    description="Your sensitive data is processed locally and never leaves your device, ensuring complete confidentiality."
                                />
                                <BenefitCard
                                    icon={<Share2 size={32} strokeWidth={1.5} />}
                                    title="Infinitely Scalable"
                                    description="Distribute our tool to remote communities at virtually no cost thanks to its lightweight architecture."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Us Section */}
                <section className="bg-background full-screen-section">
                    <div className="container mx-auto px-6 text-center max-w-4xl">
                        <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">Our Mission: Accessible Healthcare for All</h2>
                        <p className="text-lg text-text-secondary mb-4">
                            SymptoScore AI was born from a simple yet powerful idea: that technology can bridge the gap between people and essential healthcare services. Our team of dedicated doctors, data scientists, and engineers is passionate about creating tools that are not only intelligent but also intuitive and accessible. We believe that everyone deserves the peace of mind that comes with understanding their health.
                        </p>
                        <p className="text-lg text-text-secondary">
                            Our vision is a future where proactive health screening is a seamless part of daily life. By providing a fast, private, and reliable first step in the healthcare journey, we empower individuals to make informed decisions and help alleviate the strain on medical professionals. SymptoScore AI is more than an app; it's our commitment to a healthier world.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-surface text-text-secondary thin-section">
                    <div className="container mx-auto px-6 py-6 text-center">
                        <div className="flex justify-center space-x-6 mb-4">
                            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
                        </div>
                        <p className="text-sm">&copy; {new Date().getFullYear()} SymptoScore AI. All rights reserved.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default App;
