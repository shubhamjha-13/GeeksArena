import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Button1 from "../components/button1";
import LetterGlitch from "../components/LetterGlitch";
import {
  FaLaptopCode,
  FaCode,
  FaChartLine,
  FaTrophy,
  FaUsers,
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaDiscord,
  FaBookOpen,
  FaCheck,
} from "react-icons/fa";
import ScrambledText from "../components/ScrambleText";
import SpotlightCard from "../components/SpotlightCard";
import Aurora from "../components/Background1";

export default function Landing() {
  const colors = ["#ffaa40", "#9c40ff", "#ffaa40"];
  const gradientStyles = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
    display: "inline",
    fontWeight: "bold",
    fontSize: "4rem",
    textTransform: "uppercase",
  };
  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white">
        {/* Aurora sits behind everything */}
        <Aurora
          className="absolute inset-0 z-0"
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />

        {/* Navbar floats above the Aurora */}
        <div className="relative">
          <Navbar />
        </div>

        {/* Main content also above */}
        <section className="relative p-4">
          <div className="flex items-center">
            <div className="container mx-auto px-8 py-20 flex">
              <div className="max-w-3xl">
                <ScrambledText
                  className="scrambled-text-demo text-4xl md:text-6xl font-bold leading-tight"
                  radius={100}
                  duration={1.2}
                  speed={0.5}
                  scrambleChars=".:"
                >
                  A{" "}
                  <span
                    style={{
                      backgroundImage: `linear-gradient(to right, ${colors.join(
                        ", "
                      )})`,
                    }}
                  >
                    Lab
                  </span>{" "}
                  where Coders Practice and Prove Themselves
                </ScrambledText>

                <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mb-8"></div>

                <p className="text-xl  text-gray-300 mb-10 max-w-2xl ">
                  Train rigorously, solve real challenges, and sharpen your
                  coding mind. LetLabs is your lab to practice and push past
                  your limits — built for coders who want to lead.
                </p>

                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 ">
                  <Button1>Join Now</Button1>
                </div>
              </div>
            </div>

            <LetterGlitch
              glitchSpeed={50}
              centerVignette={true}
              outerVignette={false}
              smooth={true}
            />
          </div>

          {/* Floating code blocks */}
          <div className="absolute bottom-20 right-20 w-64 h-64 border-2 border-blue-500/20 rounded-lg transform rotate-12 hidden lg:block"></div>
          <div className="absolute top-40 left-40 w-48 h-48 border-2 border-teal-500/20 rounded-lg transform -rotate-6 hidden lg:block"></div>
        </section>

        <section className="py-20 text-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left Column */}
              <div className="lg:w-1/2">
                <div className="mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                    Ultimate Coding Workspace
                  </h2>
                  <p className="text-xl text-gray-300 mb-8 max-w-3xl">
                    We offer a rich workspace for solving coding problems with a
                    wide range of tools and features to enhance your coding
                    experience. Whether you're a beginner or a seasoned pro, our
                    workspace equips you with everything you need to code
                    smarter, faster, and better!
                  </p>

                  <div className="mb-12">
                    <h3 className="text-2xl font-bold mb-6 flex items-center">
                      <FaBookOpen className="text-blue-400 mr-3" />
                      Public Sheet Library
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Access a vast, community-driven library of coding Sheets
                      and challenges designed to sharpen your skills and prepare
                      you for real-world problem-solving.
                    </p>

                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                          <FaCheck className="text-green-400" />
                        </div>
                        <h4 className="text-xl font-semibold">
                          Community Driven
                        </h4>
                      </div>

                      <div className="ml-11">
                        <div className="flex items-center mb-4">
                          <div className="bg-gray-700 rounded-lg px-4 py-2 mr-4 flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                            <span>Sheet #3</span>
                          </div>
                          <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-lg">
                            2
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                          <div className="bg-gray-700 rounded-lg px-4 py-2 flex items-center">
                            <div className="w-3 h-3 rounded-full bg-teal-400 mr-2"></div>
                            <span>Dynamic Programming</span>
                          </div>
                          <div className="bg-gray-700 rounded-lg px-4 py-2 flex items-center">
                            <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
                            <span>Graph Algorithms</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:w-1/2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Stats Card 1 */}

                  <SpotlightCard
                    className="
    bg-gradient-to-br 
    from-teal-600/20 
    to-teal-800/20 
    rounded-xl 
    p-8 
    border 
    border-teal-500/30 
    relative 
    overflow-hidden 
    transform        
    transition-all   
    duration-300     
    ease-in-out      
    hover:scale-105  
    hover:shadow-lg  
    custom-spotlight-card
  "
                    spotlightColor="rgba(0, 229, 255, 0.2)"
                  >
                    <div className="absolute top-4 right-4 text-7xl opacity-10">
                      <FaCode />
                    </div>
                    <div className="text-5xl font-bold mb-4">200+</div>
                    <div className="text-gray-300 text-lg">
                      Successfully Implemented Coding Problems
                    </div>
                  </SpotlightCard>

                  {/* Stats Card 2 */}

                  <SpotlightCard
                    className="
    bg-gradient-to-br 
    from-teal-600/20 
    to-teal-800/20 
    rounded-xl 
    p-8 
    border 
    border-teal-500/30 
    relative 
    overflow-hidden 
    transform        
    transition-all   
    duration-300     
    ease-in-out      
    hover:scale-105  
    hover:shadow-lg  
    custom-spotlight-card
  "
                    spotlightColor="rgba(0, 229, 255, 0.2)"
                  >
                    <div className="absolute top-4 right-4 text-7xl opacity-10">
                      <FaChartLine />
                    </div>
                    <div className="text-5xl font-bold mb-4 text-teal-400">
                      +15%
                    </div>
                    <div className="text-gray-300 text-lg">
                      Increase in Performance and Problem-Solving Success Rate
                    </div>
                  </SpotlightCard>

                  {/* Feature Card 1 */}
                  <div className=" rounded-xl p-8 border border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mr-4">
                        <FaUsers className="text-blue-400 text-xl" />
                      </div>
                      <h3 className="text-xl font-bold">
                        Community Collaboration
                      </h3>
                    </div>
                    <p className="text-gray-400">
                      Join discussions, share solutions, and learn from other
                      developers in our active community forums.
                    </p>
                  </div>

                  {/* Feature Card 2 */}
                  <div className=" rounded-xl p-8 border border-gray-700">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center mr-4">
                        <FaCode className="text-teal-400 text-xl" />
                      </div>
                      <h3 className="text-xl font-bold">
                        Advanced Code Editor
                      </h3>
                    </div>
                    <p className="text-gray-400">
                      Our powerful editor features syntax highlighting,
                      auto-completion, and real-time collaboration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 relative z-0">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              Why <span className="text-blue-400">LetLabs</span> is Different
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<FaCode className="text-3xl" />}
                title="Real-world Challenges"
                description="Solve challenges that mimic real industry problems to prepare for technical interviews."
              />
              <FeatureCard
                icon={<FaChartLine className="text-3xl" />}
                title="Progress Tracking"
                description="Track your improvement with detailed analytics and personalized insights."
              />
              <FeatureCard
                icon={<FaTrophy className="text-3xl" />}
                title="Competitive Environment"
                description="Join coding competitions and climb the leaderboard to prove your skills."
              />
              <FeatureCard
                icon={<FaUsers className="text-3xl" />}
                title="Community Support"
                description="Connect with a vibrant community of coders to share solutions and get feedback."
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 ">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              What Our <span className="text-blue-400">Coders</span> Say
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Testimonial
                quote="LetLabs helped me land my dream job at Google. The challenges were exactly what I needed to prepare."
                author="Sarah Johnson"
                role="Software Engineer at Google"
              />
              <Testimonial
                quote="The practice sheets are incredible. I've improved my problem-solving speed by 40% in just 3 months."
                author="Michael Chen"
                role="Frontend Developer at Meta"
              />
              <Testimonial
                quote="The community support is amazing. I've learned more from peer discussions than any course I've taken."
                author="Emma Rodriguez"
                role="Fullstack Developer at Stripe"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-8 md:mb-0">
                <div className="flex items-center space-x-2 mb-4">
                  <FaLaptopCode className="text-blue-400 text-2xl" />
                  <span className="text-xl font-bold">
                    <span className="text-blue-400">Let</span>Labs
                  </span>
                </div>
                <p className="text-gray-400 max-w-xs">
                  The ultimate coding lab for developers to practice, compete,
                  and excel.
                </p>
                <div className="flex space-x-4 mt-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <FaGithub className="text-xl" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <FaTwitter className="text-xl" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <FaLinkedin className="text-xl" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <FaDiscord className="text-xl" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <FooterColumn
                  title="Resources"
                  links={["Challenges", "Sheets", "Learning Paths", "Blog"]}
                />
                <FooterColumn
                  title="Community"
                  links={["Forums", "Leaderboard", "Events", "Mentorship"]}
                />
                <FooterColumn
                  title="Company"
                  links={["About", "Careers", "Contact", "Press"]}
                />
                <FooterColumn
                  title="Legal"
                  links={["Privacy", "Terms", "Security", "Cookies"]}
                />
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
              <p>
                © 2023 LetLabs. All rights reserved. Designed for coders who
                want to lead.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700 hover:border-blue-500 transition-all hover:-translate-y-2">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-teal-400/20 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
};

const Testimonial = ({ quote, author, role }) => {
  return (
    <div className="bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl border border-gray-700">
      <div className="text-yellow-400 mb-4">{"★".repeat(5)}</div>
      <p className="text-gray-300 italic mb-6">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 mr-4"></div>
        <div>
          <p className="font-bold">{author}</p>
          <p className="text-gray-400 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

const FooterColumn = ({ title, links }) => {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
