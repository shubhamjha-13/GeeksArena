import Navbar from "../components/Navbar";

export default function Sheets() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-800">
            <Navbar />
            
            <div className="flex items-center justify-center min-h-screen pt-32 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
                        
                        {/* Tree of Knowledge Character */}
                        <div className="flex-shrink-0">
                            <div className="animate-bounce">
                                <div className="relative">
                                    {/* Tree Crown/Leaves */}
                                    <div className="relative">
                                        {/* Main Crown */}
                                        <div className="w-40 h-32 bg-gradient-to-b from-emerald-700 to-emerald-900 rounded-full relative shadow-xl opacity-90">
                                            
                                            {/* Knowledge Leaves with Icons */}
                                            {/* Top row leaves */}
                                            <div className="absolute top-2 left-8 animate-pulse">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-sm font-bold text-blue-200">∑</span>
                                                </div>
                                            </div>
                                            <div className="absolute top-1 right-6 animate-pulse delay-100">
                                                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-sm font-bold text-purple-200">{}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Middle row leaves */}
                                            <div className="absolute top-8 left-4 animate-pulse delay-200">
                                                <div className="w-9 h-9 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-sm font-bold text-red-200">π</span>
                                                </div>
                                            </div>
                                            <div className="absolute top-6 right-2 animate-pulse delay-300">
                                                <div className="w-8 h-8 bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-sm font-bold text-yellow-200">⚡</span>
                                                </div>
                                            </div>
                                            <div className="absolute top-12 left-16 animate-pulse delay-400">
                                                <div className="w-7 h-7 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-xs font-bold text-indigo-200">AI</span>
                                                </div>
                                            </div>
                                            
                                            {/* Bottom row leaves */}
                                            <div className="absolute bottom-4 left-12 animate-pulse delay-500">
                                                <div className="w-8 h-8 bg-gradient-to-br from-teal-600 to-teal-800 rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-sm font-bold text-teal-200">∞</span>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-2 right-8 animate-pulse delay-600">
                                                <div className="w-9 h-9 bg-gradient-to-br from-pink-600 to-pink-800 rounded-full flex items-center justify-center shadow-md">
                                                    <span className="text-sm font-bold text-pink-200">λ</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Additional foliage clusters */}
                                        <div className="absolute -top-4 left-12 w-24 h-24 bg-gradient-to-b from-green-700 to-green-900 rounded-full opacity-70 animate-pulse delay-700"></div>
                                        <div className="absolute -top-2 right-8 w-20 h-20 bg-gradient-to-b from-emerald-800 to-emerald-900 rounded-full opacity-60 animate-pulse delay-800"></div>
                                    </div>
                                    
                                    {/* Tree Trunk made of Books */}
                                    <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
                                        <div className="flex flex-col items-center space-y-1">
                                            {/* Book Stack forming trunk */}
                                            <div className="w-14 h-4 bg-gradient-to-r from-blue-700 to-blue-900 rounded shadow-md transform rotate-1"></div>
                                            <div className="w-16 h-4 bg-gradient-to-r from-red-700 to-red-900 rounded shadow-md transform -rotate-1"></div>
                                            <div className="w-12 h-4 bg-gradient-to-r from-green-700 to-green-900 rounded shadow-md transform rotate-2"></div>
                                            <div className="w-15 h-4 bg-gradient-to-r from-purple-700 to-purple-900 rounded shadow-md transform -rotate-1"></div>
                                            <div className="w-13 h-4 bg-gradient-to-r from-yellow-700 to-yellow-900 rounded shadow-md transform rotate-1"></div>
                                            <div className="w-16 h-4 bg-gradient-to-r from-indigo-700 to-indigo-900 rounded shadow-md transform -rotate-2"></div>
                                            <div className="w-14 h-4 bg-gradient-to-r from-teal-700 to-teal-900 rounded shadow-md transform rotate-1"></div>
                                            <div className="w-15 h-4 bg-gradient-to-r from-orange-700 to-orange-900 rounded shadow-md transform -rotate-1"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Tree Roots with Book Spines */}
                                    <div className="absolute top-56 left-1/2 transform -translate-x-1/2">
                                        <div className="flex justify-center space-x-2">
                                            {/* Left root */}
                                            <div className="flex space-x-1 transform -rotate-12">
                                                <div className="w-2 h-8 bg-gradient-to-b from-amber-800 to-amber-900 rounded-b"></div>
                                                <div className="w-2 h-6 bg-gradient-to-b from-emerald-800 to-emerald-900 rounded-b"></div>
                                            </div>
                                            
                                            {/* Center root */}
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-10 bg-gradient-to-b from-blue-800 to-blue-900 rounded-b"></div>
                                                <div className="w-2 h-8 bg-gradient-to-b from-red-800 to-red-900 rounded-b"></div>
                                                <div className="w-2 h-9 bg-gradient-to-b from-purple-800 to-purple-900 rounded-b"></div>
                                            </div>
                                            
                                            {/* Right root */}
                                            <div className="flex space-x-1 transform rotate-12">
                                                <div className="w-2 h-7 bg-gradient-to-b from-teal-800 to-teal-900 rounded-b"></div>
                                                <div className="w-2 h-5 bg-gradient-to-b from-orange-800 to-orange-900 rounded-b"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Growing Knowledge Fruits */}
                                    <div className="absolute top-8 left-2 animate-bounce delay-1000">
                                        <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full shadow-lg">
                                            <div className="w-2 h-2 bg-green-600 rounded-full mx-auto"></div>
                                        </div>
                                    </div>
                                    <div className="absolute top-16 right-4 animate-bounce delay-1200">
                                        <div className="w-5 h-5 bg-gradient-to-br from-red-500 to-red-700 rounded-full shadow-lg">
                                            <div className="w-1 h-1 bg-green-600 rounded-full mx-auto mt-1"></div>
                                        </div>
                                    </div>
                                    
                                    {/* Floating Knowledge Sparkles */}
                                    <div className="absolute -top-8 left-8 animate-ping">
                                        <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                                    </div>
                                    <div className="absolute -top-4 right-12 animate-ping delay-500">
                                        <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                                    </div>
                                    <div className="absolute -top-6 right-4 animate-ping delay-1000">
                                        <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
                                    </div>
                                    
                                    {/* Wisdom Aura */}
                                    <div className="absolute -inset-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full opacity-10 animate-pulse delay-500"></div>
                                </div>
                            </div>
                        </div>

                        {/* Main Text Content */}
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
                                DSA Sheet
                                <br />
                                <span className="text-4xl md:text-5xl lg:text-6xl">Coming Soon</span>
                            </h1>
                            
                            <div className="relative">
                                <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed">
                                    The Sheet That Turns Beginners into Pros.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements - Data themed */}
                <div className="fixed top-20 left-10 text-6xl opacity-20">📈</div>
                <div className="fixed top-40 right-20 text-4xl opacity-20">📋</div>
                <div className="fixed bottom-20 left-20 text-5xl opacity-20">🧮</div>
                <div className="fixed bottom-40 right-10 text-3xl opacity-20">📊</div>
            </div>
        </div>
    );
}