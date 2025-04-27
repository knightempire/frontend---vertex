import React, { useState, useEffect, useRef } from 'react';
import { Activity, Database, Layers, BarChart2, Map, Zap } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import logo from '../assets/linkendin.png';

const Dashboard = () => {
  const [seismicLines, setSeismicLines] = useState([]);
  const [oilDrops, setOilDrops] = useState([]);
  
  const canvasRef = useRef(null);
  
  const milkyWhite = "#f5f5f7";
  const primaryColor = "#6366f1"; 
  const accentColor = "#ec4899"; 
  const darkColor = "#1e293b"; 
  const successColor = "#10b981"; 
  const gradientButton = "linear-gradient(135deg, #ec4899 0%, #6366f1 100%)";
  // New contrasting background gradient that complements the existing color scheme
  const backgroundGradient = "linear-gradient(135deg, #0f172a 0%, #334155 100%)";

  useEffect(() => {
    const lines = [];
    for (let i = 0; i < 15; i++) {
      lines.push({
        id: i,
        left: Math.random() * 100,
        width: 150 + Math.random() * 400,
        height: 1 + Math.random() * 2,
        animationDuration: 3 + Math.random() * 7,
        delay: Math.random() * 5,
        opacity: 0.2 + Math.random() * 0.4
      });
    }
    setSeismicLines(lines);

    const drops = [];
    for (let i = 0; i < 12; i++) {
      drops.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 5 + Math.random() * 15,
        opacity: 0.1 + Math.random() * 0.3,
        animationDuration: 10 + Math.random() * 30,
        delay: Math.random() * 15,
        color: Math.random() > 0.5 ? primaryColor : accentColor
      });
    }
    setOilDrops(drops);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      let animationFrameId;
      
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const time = Date.now() * 0.001;
        for (let i = 0; i < 3; i++) {
          const x = canvas.width * (0.3 + i * 0.2);
          const y = canvas.height * (0.2 + i * 0.3);
          const maxRadius = 60 + i * 40;
          
          for (let j = 0; j < 3; j++) {
            const radius = ((time + j * 0.7) % 3) * maxRadius / 3;
            const opacity = 1 - (radius / maxRadius);
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = i % 2 === 0 
              ? `rgba(99, 102, 241, ${opacity * 0.15})` 
              : `rgba(236, 72, 153, ${opacity * 0.15})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
        
        for (let i = 0; i < 25; i++) {
          const x = Math.sin(time * 0.3 + i) * canvas.width * 0.4 + canvas.width * 0.5;
          const y = Math.cos(time * 0.2 + i * 0.7) * canvas.height * 0.4 + canvas.height * 0.5;
          const size = 1 + Math.sin(time + i) * 1.5;
          
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.5, size), 0, Math.PI * 2);
          const particleColor = i % 3 === 0 
            ? `rgba(99, 102, 241, ${0.1 + Math.sin(time + i * 0.3) * 0.1})` 
            : i % 3 === 1 
              ? `rgba(236, 72, 153, ${0.1 + Math.sin(time + i * 0.3) * 0.1})` 
              : `rgba(167, 139, 250, ${0.1 + Math.sin(time + i * 0.3) * 0.1})`;
          ctx.fillStyle = particleColor;
          ctx.fill();
        }
        
        animationFrameId = requestAnimationFrame(animate);
      };
      
      animate();
      
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const platforms = [
    {
      name: "AI Prodn ",
      description: "Build your Dynamic model in hours. Predict Future Production in Minutes.",
      icon: <BarChart2 className="h-6 w-6" style={{ color: primaryColor }} />,
      stats: [
        { label: "History Match", value: ">98%" },
        { label: "Accurate Forecast", value: "5 Years" },
        { label: "Reservoir Physics", value: "Enabled" }
      ],
      linkedChartId: "efficiency"
    },
    {
      name: "Auto DCA",
      description: "Generate DCA data in minutes. Generate Deep insights on your data",
      icon: <BarChart2 className="h-6 w-6" style={{ color: primaryColor }} />,
      stats: [
        { label: "Season Variation", value: "Captured" },
        { label: "Deeper Insights", value: "Enabled" },
        { label: "Data Loading", value: "Automated" }
      ],
      linkedChartId: "efficiency"
    },
    {
      name: "AutoMBAL",
      description: "A unique conventional and Automated approach. Run Simulation with varying parameters.",
      icon: <Database className="h-6 w-6" style={{ color: accentColor }} />,
      stats: [
        { label: "Data Entry", value: "Automated" },
        { label: "Energy Plot", value: "Enabled" },
        { label: "Simulation", value: "Multi parameter" }
      ],
      linkedChartId: "resources"
    },
    {
      name: "AI fAIcies",
      description: "Build your reservoir Facies from Seismic. Know your geology before doing any studies",
      icon: <Layers className="h-6 w-6" style={{ color: primaryColor }} />,
      stats: [
        { label: "Data from Seismic", value: "Enabled" },
        { label: "Multi Parameters", value: "Enabled" },
        { label: "Enhanced Results", value: "Enabled" }
      ],
      linkedChartId: "forecast"
    },
    {
      name: "AI Geomech",
      description: "Our Answers to AI Based Rock Mechanics. Fully Automated Data Loading",
      icon: <Map className="h-6 w-6" style={{ color: accentColor }} />,
      stats: [
        { label: "Data Preparation", value: "Automated" },
        { label: "Rock Mechanics", value: "Automated" },
        { label: "Lithfacies", value: "Predicted" }
      ],
      linkedChartId: "costs"
    }
  ];

  const productionData = [
    { name: 'Jan', value: 1200, target: 1000 },
    { name: 'Feb', value: 1800, target: 1500 },
    { name: 'Mar', value: 1600, target: 1600 },
    { name: 'Apr', value: 2200, target: 1800 },
    { name: 'May', value: 2500, target: 2000 },
    { name: 'Jun', value: 2100, target: 2200 }
  ];

  const efficiencyData = [
    { name: 'Well A', value: 85, industry: 62 },
    { name: 'Well B', value: 66, industry: 62 },
    { name: 'Well C', value: 91, industry: 62 },
    { name: 'Well D', value: 78, industry: 62 }
  ];

  const resourceData = [
    { name: 'Oil', value: 65 },
    { name: 'Gas', value: 25 },
    { name: 'Water', value: 10 }
  ];
  
  const forecastData = [
    { name: 'Jul', projection: 2300, worstCase: 2100, bestCase: 2500 },
    { name: 'Aug', projection: 2450, worstCase: 2200, bestCase: 2700 },
    { name: 'Sep', projection: 2600, worstCase: 2350, bestCase: 2850 },
    { name: 'Oct', projection: 2800, worstCase: 2500, bestCase: 3100 },
    { name: 'Nov', projection: 2750, worstCase: 2400, bestCase: 3000 },
    { name: 'Dec', projection: 3000, worstCase: 2600, bestCase: 3300 }
  ];
  
  const costSavingsData = [
    { name: 'Maintenance', before: 34, after: 14 },
    { name: 'Personnel', before: 28, after: 23 },
    { name: 'Equipment', before: 22, after: 17 },
    { name: 'Downtime', before: 16, after: 4 }
  ];

  const newCostSavingsOverTimeData = [
    { month: 'Jan', savings: 500 },
    { month: 'Feb', savings: 700 },
    { month: 'Mar', savings: 800 },
    { month: 'Apr', savings: 900 },
    { month: 'May', savings: 1100 },
    { month: 'Jun', savings: 1300 }
  ];

  const COLORS = [primaryColor, accentColor, "#a78bfa", "#f59e0b"];

  const dashboardSections = [
    {
      id: "production",
      title: "Production Performance",
      description: "Real-time production metrics across all wells",
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={productionData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <XAxis dataKey="name" stroke={darkColor} tick={{fontSize: 10}} />
            <YAxis stroke={darkColor} tick={{fontSize: 10}} />
            <Tooltip 
              contentStyle={{ backgroundColor: milkyWhite, borderColor: `${darkColor}20` }}
              labelStyle={{ color: darkColor }}
            />
            <Line type="monotone" dataKey="value" stroke={accentColor} strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="target" stroke={`${primaryColor}80`} strokeWidth={2} strokeDasharray="5 5" />
          </LineChart>
        </ResponsiveContainer>
      )
    },
    {
      id: "efficiency",
      title: "Well Efficiency Analysis",
      description: "Compare well performance against industry benchmarks",
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={efficiencyData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <XAxis dataKey="name" stroke={darkColor} tick={{fontSize: 10}} />
            <YAxis stroke={darkColor} tick={{fontSize: 10}} />
            <Tooltip 
              contentStyle={{ backgroundColor: milkyWhite, borderColor: `${darkColor}20` }}
              labelStyle={{ color: darkColor }}
            />
            <Bar dataKey="value" fill={accentColor} radius={[4, 4, 0, 0]} />
            <Bar dataKey="industry" fill={`${primaryColor}40`} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    },
    {
      id: "resources",
      title: "Resource Distribution",
      description: "Current breakdown of extracted resources",
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={resourceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {resourceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: milkyWhite, borderColor: `${darkColor}20` }}
              labelStyle={{ color: darkColor }}
            />
          </PieChart>
        </ResponsiveContainer>
      )
    },
    {
      id: "forecast",
      title: "Production Forecast",
      description: "Six-month production forecast with confidence intervals",
      chart: (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
            <XAxis dataKey="name" stroke={darkColor} tick={{fontSize: 10}} />
            <YAxis stroke={darkColor} tick={{fontSize: 10}} />
            <Tooltip 
              contentStyle={{ backgroundColor: milkyWhite, borderColor: `${darkColor}20` }}
              labelStyle={{ color: darkColor }}
            />
            <Area type="monotone" dataKey="bestCase" stackId="1" stroke={successColor} fill={`${successColor}20`} />
            <Area type="monotone" dataKey="projection" stackId="2" stroke={primaryColor} fill={`${primaryColor}40`} />
            <Area type="monotone" dataKey="worstCase" stackId="3" stroke={`${accentColor}80`} fill={`${accentColor}20`} />
          </AreaChart>
        </ResponsiveContainer>
      )
    },
    // {
    //   id: "costs",
    //   title: "Cost Reduction Analysis",
    //   description: "Before and after implementation cost comparison",
    //   chart: (
    //     <ResponsiveContainer width="100%" height={200}>
    //       <BarChart data={costSavingsData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
    //         <XAxis dataKey="name" stroke={darkColor} tick={{fontSize: 10}} />
    //         <YAxis stroke={darkColor} tick={{fontSize: 10}} />
    //         <Tooltip 
    //           contentStyle={{ backgroundColor: milkyWhite, borderColor: `${darkColor}20` }}
    //           labelStyle={{ color: darkColor }}
    //         />
    //         <Bar dataKey="before" name="Before" fill={`${accentColor}80`} radius={[4, 4, 0, 0]} />
    //         <Bar dataKey="after" name="After" fill={successColor} radius={[4, 4, 0, 0]} />
    //       </BarChart>
    //     </ResponsiveContainer>
    //   )
    // },
    // {
    //   id: "costSavingsOverTime",
    //   title: "Cost Savings Over Time",
    //   description: "Monthly cost savings achieved",
    //   chart: (
    //     <ResponsiveContainer width="100%" height={200}>
    //       <LineChart data={newCostSavingsOverTimeData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
    //         <XAxis dataKey="month" stroke={darkColor} tick={{fontSize: 10}} />
    //         <YAxis stroke={darkColor} tick={{fontSize: 10}} />
    //         <Tooltip 
    //           contentStyle={{ backgroundColor: milkyWhite, borderColor: `${darkColor}20` }}
    //           labelStyle={{ color: darkColor }}
    //         />
    //         <Line type="monotone" dataKey="savings" stroke={successColor} strokeWidth={3} dot={{ r: 4 }} />
    //       </LineChart>
    //     </ResponsiveContainer>
    //   )
    // }
  ];

  return (
    <div className="h-screen w-full overflow-hidden relative">
      <style jsx>{`
        @keyframes seismicWave {
          0% { transform: scaleY(1) translateX(-10px); }
          50% { transform: scaleY(1.5) translateX(10px); }
          100% { transform: scaleY(1) translateX(-10px); }
        }
        @keyframes float {
          0% { transform: translate(0, 0); }
          50% { transform: translate(15px, -15px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.7); }
          70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(236, 72, 153, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
        }
      `}</style>
      
      <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-40" />
      
      <div className="fixed inset-0 overflow-hidden opacity-15 z-0 pointer-events-none">
        {seismicLines.map(line => (
          <div 
            key={`seismic-${line.id}`}
            className="absolute h-px"
            style={{
              left: `${line.left}%`,
              top: `${20 + (line.id * 3)}%`,
              width: `${line.width}px`,
              height: `${line.height}px`,
              opacity: line.opacity,
              background: line.id % 2 ? primaryColor : accentColor,
              animation: `seismicWave ${line.animationDuration}s ease-in-out ${line.delay}s infinite`,
              transform: `rotate(${line.id % 2 ? '2deg' : '- 2deg'})`
            }}
          ></div>
        ))}
        
        {oilDrops.map(drop => (
          <div 
            key={`drop-${drop.id}`}
            className="absolute rounded-full"
            style={{
              left: `${drop.left}%`,
              top: `${drop.top}%`,
              width: `${drop.size}px`,
              height: `${drop.size}px`,
              background: drop.color,
              opacity: drop.opacity,
              animation: `float ${drop.animationDuration}s ease-in-out ${drop.delay}s infinite`,
              filter: `blur(${Math.random() > 0.7 ? '2px' : '0'})`
            }}
          ></div>
        ))}
      </div>

      <nav className="sticky top-0 left-0 right-0 z-20 bg-opacity-80 backdrop-blur-md" style={{ backgroundColor: `linear-gradient(135deg, #0f172a 0%, #334155 100%)` }}>
        <div className="px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center">
                  <img src="https://images.ctfassets.net/tyqyfq36jzv2/4LDyHu4fEajllYmI8y5bj7/124bcfb1b6a522326d7d90ac1e3debc8/Linkedin-logo-png.png" alt="Company Logo" className="h-8" />
                </div>
              </div>
            </div>
            
            {/* Moved login button to the right side */}
            <div className="flex items-center space-x-4">
              <a 
                href="/login" 
                className="font-medium px-6 py-3 rounded-lg text-base relative overflow-hidden group text-white shadow-lg"
                style={{ 
                  background: gradientButton,
                  animation: "pulse 2s infinite"
                }}
              >
                <span className="absolute inset-0 w-0 bg-opacity-30 transition-all duration-300 group-hover:w-full" 
                      style={{ background: `rgba(255, 255, 255, 0.3)` }}></span>
                <span className="relative z-10 font-bold">LOGIN</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-full" style={{ maxHeight: "calc(100vh - 64px)" }}>
        {/* Left sidebar with background color applied only to this section */}
        <div className="w-1/3 p-4 overflow-y-auto" style={{ background: backgroundGradient }}>
          <div className="space-y-3">
            {platforms.map((platform, index) => (
              <div 
                key={index}
                className={`p-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg cursor-pointer border`}
                style={{
                  borderColor: `${darkColor}20`,
                  backgroundColor: 'white',
                  zIndex: 10
                }}
              >
                <div className="flex items-center mb-1">
                  {platform.icon}
                  <h3 className="text-sm font-semibold ml-2" style={{ color: darkColor }}>{platform.name}</h3>
                </div>
                <p className="text-xs mb-1" style={{ color: darkColor }}>{platform.description}</p>
                <div className="flex flex-wrap gap-2">
                  {platform.stats.map((stat, i) => (
                    <div key={i} className="flex-1 min-w-0">
                      <span className="text-xs block" style={{ color: darkColor }}>{stat.label}</span>
                      <span className="text-xs font-medium" style={{ color: primaryColor }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Content Area - Dashboard Charts with white background */}
        <div className="w-3/4 p-4 overflow-y-auto bg-white" style={{ maxHeight: "calc(100vh - 64px)" }}>
  <div className="grid grid-cols-2 gap-4"> {/* Change this to grid-cols-2 */}
    {dashboardSections.map(section => (
      <div 
        key={section.id} 
        id={section.id} 
        className="bg-white rounded-lg shadow-lg p-4 transition-opacity duration-500 opacity-100 animate-fadeIn"
      >
        <div className="mb-3">
          <h2 className="text-lg font-bold" style={{ color: darkColor }}>{section.title}</h2>
          <p className="text-xs" style={{ color: darkColor }}>{section.description}</p>
        </div>
        {section.chart}
      </div>
    ))}
  </div>
</div>

      </div>
    </div>
  );
};

export default Dashboard;