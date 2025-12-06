/**
 * ============================================================================
 * UrbanReflex — Smart City Intelligence Platform
 * Copyright (C) 2025  WAG
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * For more information, visit: https://github.com/minhe51805/UrbanReflex
 * ============================================================================
 */

import Link from "next/link";
import { 
    Zap, 
    Bot, 
    Link2, 
    BarChart3, 
    Shield, 
    Rocket,
    Globe,
    Database,
    Sparkles,
    ArrowRight,
    Github,
    Code,
    Server,
    Cpu,
    Layers,
    ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

export function HomeContent() {
    return (
        <>
            {/* Navigation - Neobrutalism Style */}
            <nav className="sticky top-0 z-50 w-full border-b-4 border-black bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex h-24 items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-20 h-20 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center p-1.5">
                                <img
                                    src="/img/logo.png"
                                    alt="UrbanReflex Logo"
                                    width={200}
                                    height={200}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="font-black text-2xl">UrbanReflex</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/docs"
                                className="text-base font-bold text-black hover:underline border-4 border-transparent hover:border-black px-4 py-2 transition-all"
                            >
                                Docs
                            </Link>
                            <a
                                href="https://github.com/minhe51805/UrbanReflex"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-base font-bold text-black hover:underline border-4 border-transparent hover:border-black px-4 py-2 transition-all"
                            >
                                GitHub
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Neobrutalism Style */}
            <section className="relative py-16 md:py-24 lg:py-32 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-black bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <span className="w-2 h-2 bg-black"></span>
                            <span>NEW: Next.js 16, FastAPI, Gemini AI & NGSI-LD</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-tight text-black">
                            THE SCALABLE{" "}
                            <span className="block mt-2 bg-yellow-400 border-4 border-black px-4 py-2 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                SMART CITY
                            </span>
                            <span className="block mt-2">PLATFORM</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-black mb-12 max-w-3xl mx-auto leading-relaxed font-bold">
                            Save endless hours. Build faster. Ship smarter. The production-ready Smart City platform you need.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                            <Button asChild size="lg" className="text-lg">
                                <Link href="/docs">
                                    Get UrbanReflex
                                    <ArrowRight className="w-5 h-5" strokeWidth={3} />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="text-lg">
                                <Link href="/docs/getting-started">
                                    See Demo
                                </Link>
                            </Button>
                        </div>

                        {/* Trust Badge */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="w-10 h-10 bg-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-white text-sm font-black">
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center gap-1 ml-3">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-xl">★</span>
                                    ))}
                                    <span className="ml-2 font-black text-black text-xl">5.0</span>
                                </div>
                            </div>
                            <p className="text-base text-black font-bold">
                                TRUSTED BY 900+ DEVELOPERS
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tech Stack Section - Neobrutalism Style */}
            <section className="py-16 bg-yellow-400 border-y-4 border-black">
                <div className="container mx-auto px-4">
                    <p className="text-center text-base font-black text-black mb-10 uppercase tracking-wide">
                        Built with the tools you love
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                        {[
                            { name: "Next.js", icon: Code },
                            { name: "React", icon: Code },
                            { name: "TypeScript", icon: Layers },
                            { name: "Tailwind CSS", icon: Sparkles },
                            { name: "FastAPI", icon: Server },
                            { name: "MongoDB", icon: Database },
                            { name: "Gemini AI", icon: Cpu },
                            { name: "NGSI-LD", icon: Link2 }
                        ].map((tech, i) => {
                            const IconComponent = tech.icon;
                            return (
                                <div key={i} className="flex items-center gap-3 text-base font-black text-black bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 py-2">
                                    <IconComponent className="w-5 h-5" strokeWidth={3} />
                                    <span>{tech.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section - Neobrutalism Style */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
                                POWERFUL FEATURES
                            </h2>
                            <p className="text-xl text-black font-bold">
                                Everything you need to build a Smart City
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { 
                                    title: "Real-time Monitoring", 
                                    desc: "Monitor air quality, weather, traffic data với WebSocket updates theo thời gian thực.",
                                    icon: Zap,
                                    link: "/docs/api",
                                    color: "bg-blue-400"
                                },
                                { 
                                    title: "AI-Powered Analytics", 
                                    desc: "RAG chatbot với Gemini AI, automatic classification, và semantic search.",
                                    icon: Bot,
                                    link: "/docs/ai-services",
                                    badge: "Gemini AI",
                                    color: "bg-purple-400"
                                },
                                { 
                                    title: "NGSI-LD Compliant", 
                                    desc: "Tuân thủ tiêu chuẩn ETSI Smart City để tích hợp với các hệ thống IoT.",
                                    icon: Link2,
                                    link: "/docs/data-models",
                                    badge: "Orion-LD",
                                    color: "bg-green-400"
                                },
                                { 
                                    title: "Citizen Reports", 
                                    desc: "Hệ thống báo cáo với AI classification và priority detection.",
                                    icon: BarChart3,
                                    link: "/docs/api",
                                    color: "bg-red-400"
                                },
                                { 
                                    title: "Enterprise Security", 
                                    desc: "JWT authentication, API keys, role-based access control.",
                                    icon: Shield,
                                    link: "/docs/authentication",
                                    color: "bg-yellow-400"
                                },
                                { 
                                    title: "Scalable Architecture", 
                                    desc: "Docker-ready, microservices design với horizontal scaling support.",
                                    icon: Rocket,
                                    link: "/docs/deployment",
                                    color: "bg-pink-400"
                                }
                            ].map((feature, i) => {
                                const IconComponent = feature.icon;
                                return (
                                    <Card key={i} className="hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                                        <CardHeader>
                                            <div className={`w-14 h-14 ${feature.color} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-4`}>
                                                <IconComponent className="w-7 h-7 text-black" strokeWidth={3} />
                                            </div>
                                            <CardTitle className="text-2xl font-black text-black">{feature.title}</CardTitle>
                                            {feature.badge && (
                                                <div className="mt-2">
                                                    <span className="text-xs font-black bg-black text-white border-2 border-black px-2 py-1 inline-block">
                                                        {feature.badge}
                                                    </span>
                                                </div>
                                            )}
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-base text-black font-bold mb-4 leading-relaxed">
                                                {feature.desc}
                                            </CardDescription>
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={feature.link}>
                                                    Learn more
                                                    <ChevronRight className="w-4 h-4" strokeWidth={3} />
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Start Section - Neobrutalism Style */}
            <section className="py-24 bg-yellow-400 border-y-4 border-black">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
                                START BUILDING IN{" "}
                                <span className="bg-white border-4 border-black px-4 py-2 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    MINUTES
                                </span>
                            </h2>
                            <p className="text-xl text-black font-bold">
                                Chỉ cần vài lệnh để bắt đầu với UrbanReflex
                            </p>
                        </div>

                        <Card className="bg-white">
                            <CardHeader className="bg-black text-white border-b-4 border-black">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-2">
                                        <div className="w-4 h-4 bg-red-500 border-2 border-black"></div>
                                        <div className="w-4 h-4 bg-yellow-400 border-2 border-black"></div>
                                        <div className="w-4 h-4 bg-green-500 border-2 border-black"></div>
                                    </div>
                                    <span className="text-sm font-black font-mono ml-3">bash</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <pre className="text-sm md:text-base font-mono text-black font-bold">
                                    <code>
                                        <span className="text-gray-600"># Clone repository</span>{"\n"}
                                        <span className="text-green-600">$</span> git clone https://github.com/minhe51805/UrbanReflex.git{"\n"}
                                        <span className="text-green-600">$</span> cd UrbanReflex{"\n\n"}
                                        <span className="text-gray-600"># Setup and run</span>{"\n"}
                                        <span className="text-green-600">$</span> just setup{"\n"}
                                        <span className="text-green-600">$</span> just dev
                                    </code>
                                </pre>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Ecosystem Section - Neobrutalism Style */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto text-center mb-16">
                        <h2 className="text-5xl md:text-6xl font-black text-black mb-4">
                            POWERED BY{" "}
                            <span className="bg-yellow-400 border-4 border-black px-4 py-2 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                INDUSTRY LEADERS
                            </span>
                        </h2>
                        <p className="text-xl text-black font-bold max-w-2xl mx-auto">
                            Tích hợp với các dịch vụ hàng đầu trong ngành
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {[
                            { name: "OpenAQ", desc: "Air Quality Data", icon: Globe, color: "bg-blue-400" },
                            { name: "Orion-LD", desc: "Context Broker", icon: Link2, color: "bg-green-400" },
                            { name: "Pinecone", desc: "Vector Database", icon: Database, color: "bg-purple-400" },
                            { name: "Gemini AI", desc: "LLM Provider", icon: Sparkles, color: "bg-yellow-400" }
                        ].map((item, i) => {
                            const IconComponent = item.icon;
                            return (
                                <Card key={i} className="text-center">
                                    <CardHeader>
                                        <div className={`w-16 h-16 ${item.color} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto mb-4 flex items-center justify-center`}>
                                            <IconComponent className="w-8 h-8 text-black" strokeWidth={3} />
                                        </div>
                                        <CardTitle className="text-xl font-black text-black mb-2">{item.name}</CardTitle>
                                        <CardDescription className="text-sm text-black font-bold">
                                            {item.desc}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Support and Organization Section - Neobrutalism Style */}
            <section className="py-24 bg-yellow-400 border-y-4 border-black">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-5xl md:text-6xl font-black text-black mb-8">
                            SUPPORT AND{" "}
                            <span className="bg-white border-4 border-black px-4 py-2 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                ORGANIZATION
                            </span>
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-12">
                            <a
                                href="https://hutech.edu.vn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                            >
                                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all p-6">
                                    <img
                                        src="https://file1.hutech.edu.vn/file/editor/homepage/stories/hinh34/logo%20CMYK-01.png"
                                        alt="HUTECH University"
                                        height={80}
                                        className="h-20 w-auto object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            </a>
                            <a
                                href="https://vfossa.vn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                            >
                                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all p-6">
                                    <img
                                        src="https://vfossa.vn/uploads/about/logo-6b-new.png"
                                        alt="VFOSSA"
                                        height={80}
                                        className="h-20 w-auto object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            </a>
                            <a
                                href="https://www.olp.vn/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group"
                            >
                                <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all p-6">
                                    <img
                                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRePWbAslFDMVxeJCgHI6f_LSIuNOrlrEsEhA&s"
                                        alt="Vietnam OLP"
                                        height={80}
                                        className="h-20 w-auto object-contain"
                                        loading="lazy"
                                    />
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Neobrutalism Style */}
            <section className="py-24 bg-black border-y-4 border-black">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8">
                        READY TO BUILD THE{" "}
                        <span className="bg-yellow-400 text-black border-4 border-white px-4 py-2 inline-block shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                            CITY OF THE FUTURE?
                        </span>
                    </h2>
                    <p className="text-xl text-white font-bold mb-12 max-w-3xl mx-auto">
                        Khám phá documentation đầy đủ và bắt đầu xây dựng nền tảng Smart City của bạn.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" variant="secondary" className="text-lg">
                            <Link href="/docs">
                                Read Documentation
                                <ArrowRight className="w-5 h-5" strokeWidth={3} />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="text-lg border-white text-white hover:bg-white hover:text-black">
                            <a
                                href="https://github.com/minhe51805/UrbanReflex"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Github className="w-5 h-5" strokeWidth={3} />
                                View Full Project
                            </a>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer - Neobrutalism Style */}
            <footer className="py-16 bg-white border-t-4 border-black">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
                        {/* Brand Section */}
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                                <div className="w-20 h-20 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center p-1.5">
                                    <img
                                        src="/img/logo.png"
                                        alt="UrbanReflex Logo"
                                        width={200}
                                        height={200}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <span className="font-black text-2xl text-black">UrbanReflex</span>
                            </div>
                            <p className="text-sm text-black font-bold leading-relaxed max-w-xs mx-auto md:mx-0">
                                Enterprise-Grade Smart City Platform với AI-powered analytics và NGSI-LD compliance.
                            </p>
                        </div>

                        {/* Resources */}
                        <div>
                            <h4 className="font-black text-black mb-4 text-lg">RESOURCES</h4>
                            <ul className="space-y-2">
                                <li><Link href="/docs" className="text-sm text-black font-bold hover:underline">Documentation</Link></li>
                                <li><Link href="/docs/getting-started" className="text-sm text-black font-bold hover:underline">Getting Started</Link></li>
                                <li><a href="https://github.com/minhe51805/UrbanReflex" target="_blank" rel="noopener noreferrer" className="text-sm text-black font-bold hover:underline">GitHub Repository</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h4 className="font-black text-black mb-4 text-lg">LEGAL</h4>
                            <ul className="space-y-2">
                                <li><Link href="/docs/license" className="text-sm text-black font-bold hover:underline">License</Link></li>
                                <li><Link href="#" className="text-sm text-black font-bold hover:underline">Privacy Policy</Link></li>
                                <li><Link href="#" className="text-sm text-black font-bold hover:underline">Terms of Service</Link></li>
                            </ul>
                        </div>

                        {/* Connect */}
                        <div>
                            <h4 className="font-black text-black mb-4 text-lg">CONNECT</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="https://github.com/minhe51805/UrbanReflex" target="_blank" rel="noopener noreferrer" className="text-sm text-black font-bold hover:underline flex items-center justify-center md:justify-start gap-2">
                                        <Github className="w-4 h-4" strokeWidth={3} />
                                        Star us on GitHub
                                    </a>
                                </li>
                                <li><span className="text-sm text-black font-bold">contact@urbanreflex.dev</span></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 mt-8 border-t-4 border-black text-center">
                        <p className="text-sm text-black font-black">
                            © 2025 UrbanReflex. All rights reserved. v1.0.0
                        </p>
                    </div>
                </div>
            </footer>
        </>
    );
}
