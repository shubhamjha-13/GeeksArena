import Navbar from "../components/Navbar";

export default function Resources() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-800">
            <Navbar />
            
            <div className="flex items-center justify-center min-h-screen pt-32 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16">
                        
                        {/* Wise Owl Character */}
                        <div className="flex-shrink-0">
                            <div className="animate-bounce">
                                <div className="relative">
                                    {/* Book Perch */}
                                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                                        <div className="flex space-x-1">
                                            <div className="w-20 h-4 bg-gradient-to-r from-amber-700 to-amber-900 rounded shadow-md"></div>
                                            <div className="w-16 h-4 bg-gradient-to-r from-emerald-700 to-emerald-900 rounded shadow-md -ml-2"></div>
                                            <div className="w-18 h-4 bg-gradient-to-r from-blue-700 to-blue-900 rounded shadow-md -ml-2"></div>
                                        </div>
                                    </div>

                                    {/* Owl Body */}
                                    <div className="relative">
                                        {/* Main Body */}
                                        <div className="w-32 h-36 bg-gradient-to-b from-amber-600 via-amber-700 to-amber-800 rounded-full relative shadow-xl">
                                            
                                            {/* Owl Head */}
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                <div className="w-28 h-28 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full relative shadow-md">
                                                    
                                                    {/* Ear Tufts */}
                                                    <div className="absolute -top-3 left-3 w-3 h-8 bg-gradient-to-t from-amber-700 to-amber-600 rounded-full transform rotate-12"></div>
                                                    <div className="absolute -top-3 right-3 w-3 h-8 bg-gradient-to-t from-amber-700 to-amber-600 rounded-full transform -rotate-12"></div>
                                                    
                                                    {/* Eyes */}
                                                    <div className="flex justify-center items-center pt-6 space-x-3">
                                                        <div className="relative">
                                                            <div className="w-8 h-8 bg-white rounded-full border-2 border-amber-700"></div>
                                                            <div className="absolute top-1 left-1 w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full animate-pulse"></div>
                                                            <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"></div>
                                                        </div>
                                                        <div className="relative">
                                                            <div className="w-8 h-8 bg-white rounded-full border-2 border-amber-700"></div>
                                                            <div className="absolute top-1 left-1 w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full animate-pulse"></div>
                                                            <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full"></div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Beak */}
                                                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                                                        <div className="w-0 h-0 border-l-3 border-r-3 border-t-4 border-l-transparent border-r-transparent border-t-orange-500"></div>
                                                    </div>
                                                    
                                                    {/* Graduation Cap */}
                                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-pulse">
                                                        <div className="w-16 h-2 bg-gradient-to-r from-purple-900 to-indigo-900 rounded"></div>
                                                        <div className="w-12 h-8 bg-gradient-to-b from-purple-800 to-purple-900 rounded-t-full mx-auto"></div>
                                                        {/* Tassel */}
                                                        <div className="absolute -right-2 top-0 w-1 h-6 bg-yellow-300 animate-sway"></div>
                                                        <div className="absolute -right-2 top-6 w-2 h-2 bg-yellow-300 rounded-full animate-bounce"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Wings */}
                                            <div className="absolute top-8 -left-4 w-8 h-16 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full transform rotate-12 animate-pulse"></div>
                                            <div className="absolute top-8 -right-4 w-8 h-16 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full transform -rotate-12 animate-pulse"></div>
                                            
                                            {/* Chest Pattern */}
                                            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                                                <div className="flex flex-col space-y-1 items-center">
                                                    <div className="w-8 h-1 bg-amber-900 rounded-full opacity-60"></div>
                                                    <div className="w-6 h-1 bg-amber-900 rounded-full opacity-60"></div>
                                                    <div className="w-4 h-1 bg-amber-900 rounded-full opacity-60"></div>
                                                </div>
                                            </div>
                                            
                                            {/* Feet */}
                                            <div className="absolute -bottom-6 left-6">
                                                <div className="flex space-x-1">
                                                    <div className="w-1 h-3 bg-orange-700 rounded"></div>
                                                    <div className="w-1 h-3 bg-orange-700 rounded"></div>
                                                    <div className="w-1 h-3 bg-orange-700 rounded"></div>
                                                </div>
                                            </div>
                                            <div className="absolute -bottom-6 right-6">
                                                <div className="flex space-x-1">
                                                    <div className="w-1 h-3 bg-orange-700 rounded"></div>
                                                    <div className="w-1 h-3 bg-orange-700 rounded"></div>
                                                    <div className="w-1 h-3 bg-orange-700 rounded"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Speech Bubble */}
                                    <div className="absolute -right-4 top-4 animate-pulse">
                                        <div className="bg-white rounded-2xl px-4 py-2 shadow-lg relative">
                                            <span className="text-2xl">🎓</span>
                                            <div className="absolute left-0 top-4 transform -translate-x-1">
                                                <div className="w-0 h-0 border-r-8 border-r-white border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Floating Books */}
                                    <div className="absolute -left-8 top-12 animate-bounce delay-300">
                                        <div className="w-6 h-8 bg-gradient-to-b from-red-600 to-red-800 rounded shadow-lg transform rotate-12"></div>
                                    </div>
                                    <div className="absolute -left-6 top-20 animate-bounce delay-500">
                                        <div className="w-5 h-7 bg-gradient-to-b from-green-600 to-green-800 rounded shadow-lg transform -rotate-6"></div>
                                    </div>
                                    
                                    {/* Knowledge Sparkles */}
                                    <div className="absolute top-0 right-8 animate-ping">
                                        <div className="w-1 h-1 bg-yellow-300 rounded-full"></div>
                                    </div>
                                    <div className="absolute top-4 right-2 animate-ping delay-150">
                                        <div className="w-1 h-1 bg-blue-300 rounded-full"></div>
                                    </div>
                                    <div className="absolute top-8 right-12 animate-ping delay-300">
                                        <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Text Content */}
                        <div className="flex-1 text-center lg:text-left space-y-8">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
                                We're Building
                                <br />
                                <span className="text-4xl md:text-5xl lg:text-6xl">Something Awesome</span>
                            </h1>
                            
                            <div className="relative">
                                <p className="text-lg md:text-xl lg:text-2xl text-gray-300 leading-relaxed">
                                    Stay tuned — exciting updates are coming soon!
                                </p>
                                
                                <div className="absolute -bottom-4 -right-4 text-4xl">🚀</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="fixed top-20 left-10 text-6xl opacity-20">💡</div>
                <div className="fixed top-40 right-20 text-4xl opacity-20">⭐</div>
                <div className="fixed bottom-20 left-20 text-5xl opacity-20">🎨</div>
                <div className="fixed bottom-40 right-10 text-3xl opacity-20">🔮</div>
            </div>
        </div>
    );
}