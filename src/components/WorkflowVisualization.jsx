"use client";

const workflowSteps = [
  "DNA Dataset Input",
  "Sequence Tokenization",
  "Diffusion Model Training",
  "Regulatory Pattern Learning",
  "Synthetic DNA Generation",
  "Expression Prediction",
  "Dashboard Analytics"
];

export default function WorkflowVisualization() {
  return (
    <section className="py-16 px-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="text-center mb-12 relative z-10">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
          How the DNA Diffusion Model Works
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Explore the complete pipeline that transforms raw DNA data into optimized synthetic regulatory sequences through advanced machine learning.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Enhanced animated connecting lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 800 400">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ffff" stopOpacity="0.8" />
                <stop offset="25%" stopColor="#c084fc" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#f472b6" stopOpacity="0.8" />
                <stop offset="75%" stopColor="#00d4ff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#00ffff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>

            {/* Main connecting lines with enhanced effects */}
            {Array.from({ length: 6 }, (_, i) => (
              <g key={`connection-${i}`}>
                {/* Main line */}
                <line
                  x1={150 + i * 100}
                  y1="200"
                  x2={250 + i * 100}
                  y2="200"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
                {/* Glow effect */}
                <line
                  x1={150 + i * 100}
                  y1="200"
                  x2={250 + i * 100}
                  y2="200"
                  stroke="url(#glowGradient)"
                  strokeWidth="8"
                  opacity="0.6"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.3 + 0.1}s` }}
                />
                {/* Flowing data particles */}
                <circle
                  r="3"
                  fill="#00ffff"
                  className="animate-data-flow"
                  style={{ animationDelay: `${i * 0.5}s` }}
                >
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    path={`M${150 + i * 100},200 L${250 + i * 100},200`}
                    begin={`${i * 0.3}s`}
                  />
                </circle>
              </g>
            ))}

            {/* Enhanced arrows with glow */}
            {Array.from({ length: 6 }, (_, i) => (
              <g key={`arrow-${i}`}>
                {/* Main arrow */}
                <polygon
                  points={`${245 + i * 100},195 ${255 + i * 100},200 ${245 + i * 100},205`}
                  fill="#00ffff"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.3 + 0.2}s` }}
                />
                {/* Arrow glow */}
                <polygon
                  points={`${245 + i * 100},193 ${257 + i * 100},200 ${245 + i * 100},207`}
                  fill="#00ffff"
                  opacity="0.4"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.3 + 0.3}s` }}
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Enhanced workflow steps */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-8">
          {workflowSteps.map((step, index) => (
            <div
              key={step}
              className="bg-[#111827]/80 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-400/80 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 transform hover:scale-110 animate-node-pulse group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Card background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-400/50 via-purple-400/50 to-pink-400/50 bg-clip-border opacity-0 group-hover:opacity-100 animate-border-glow transition-opacity duration-500"></div>

              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-400/50 transition-all duration-300 animate-pulse">
                  <span className="text-white font-bold text-xl drop-shadow-lg">{index + 1}</span>
                </div>
                <h3 className="text-center text-gray-200 font-semibold text-sm leading-tight group-hover:text-white transition-colors duration-300">
                  {step}
                </h3>
                <div className="w-full h-1 bg-gradient-to-r from-gray-700 to-gray-600 rounded-full mt-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Floating particles effect */}
              <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-ping" style={{ animationDelay: `${index * 0.5}s` }}></div>
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-ping" style={{ animationDelay: `${index * 0.7}s` }}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}