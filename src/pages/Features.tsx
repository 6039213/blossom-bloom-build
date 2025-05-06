
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Zap, Database, Shield, Code, Laptop, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import MainNavbar from '@/components/layout/MainNavbar';
import Footer from '@/components/layout/Footer';

export default function Features() {
  const features = [
    {
      icon: <Rocket className="h-10 w-10 text-amber-600" />,
      title: "AI-Powered Website Generation",
      description: "Create complete websites from simple text prompts with advanced AI models."
    },
    {
      icon: <Zap className="h-10 w-10 text-amber-600" />,
      title: "Lightning Fast Development",
      description: "Build in minutes what would normally take days or weeks with traditional development."
    },
    {
      icon: <Database className="h-10 w-10 text-amber-600" />,
      title: "Project Management",
      description: "Organize and manage all your web projects in one centralized dashboard."
    },
    {
      icon: <Shield className="h-10 w-10 text-amber-600" />,
      title: "Secure Deployment",
      description: "Deploy your websites with industry-standard security practices built in."
    },
    {
      icon: <Code className="h-10 w-10 text-amber-600" />,
      title: "Full Code Access",
      description: "Get complete access to the generated code, with no lock-in or black boxes."
    },
    {
      icon: <Laptop className="h-10 w-10 text-amber-600" />,
      title: "Responsive Design",
      description: "All generated websites are fully responsive and work on any device."
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const detailFeatures = [
    {
      title: "Intuitive AI Interface",
      description: "Our natural language processing allows you to describe your website in plain English. No technical jargon required.",
      benefits: [
        "Simple text prompts generate complete websites",
        "Interactive refinement of generated designs",
        "No coding knowledge necessary"
      ]
    },
    {
      title: "Professional Design Quality",
      description: "Get professionally designed websites that follow modern best practices and design principles.",
      benefits: [
        "Beautiful, conversion-optimized layouts",
        "Consistent design language across pages",
        "Custom branding and color schemes"
      ]
    },
    {
      title: "Complete Control & Flexibility",
      description: "Unlike other website builders, you get full access to your code and can customize every aspect.",
      benefits: [
        "Download complete source code",
        "Modify and extend your website as needed",
        "No proprietary limitations or restrictions"
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-b from-amber-50 to-white dark:from-gray-950 dark:to-gray-900 min-h-screen">
      <MainNavbar />
      
      <header className="pt-32 pb-20 px-4 bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-900 dark:to-amber-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <svg className="absolute right-0 top-0 h-full opacity-20" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
                <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0"/>
              </filter>
            </defs>
            <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-sm">
              Powerful Features for Modern Web Development
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 mb-8">
              Build, deploy, and manage websites with our AI-powered platform
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-amber-800 hover:bg-amber-100 px-8 shadow-lg hover:shadow-xl transition-all">
                <Link to="/auth">Start Building Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10 px-8">
                <Link to="#features">Explore Features</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </header>

      <main>
        {/* Core Features Grid */}
        <section className="py-20 px-4" id="features">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-amber-900 dark:text-amber-300">
                Everything You Need To Build Amazing Websites
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Our powerful AI platform combines cutting-edge technology with user-friendly design to help you create stunning websites in minutes.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="p-6 h-full border-amber-200 dark:border-amber-900/20 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-700/30 transition-all duration-300 bg-white dark:bg-gray-900/80">
                    <div className="mb-6 p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg inline-block">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-amber-900 dark:text-amber-300">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Detailed Feature Sections */}
        <section className="py-16 bg-gradient-to-b from-amber-50/50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container mx-auto px-4">
            {detailFeatures.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 py-16 ${
                  index !== detailFeatures.length - 1 ? 'border-b border-amber-200/50 dark:border-amber-900/20' : ''
                }`}
              >
                <div className="lg:w-1/2">
                  <div className="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-900/10 p-8 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                      <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern id={`grid-${index}`} width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
                          </pattern>
                        </defs>
                        <rect width="100" height="100" fill={`url(#grid-${index})`} />
                      </svg>
                    </div>
                    <div className="relative z-10 flex items-center justify-center min-h-[300px]">
                      {/* Placeholder for feature illustration */}
                      <div className="w-64 h-64 bg-gradient-to-br from-amber-400/20 to-amber-600/20 dark:from-amber-700/20 dark:to-amber-500/20 rounded-full flex items-center justify-center">
                        <div className="w-48 h-48 bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-500 rounded-full flex items-center justify-center text-white text-6xl shadow-lg">
                          {index === 0 ? "AI" : index === 1 ? "UI" : "Dev"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-1/2">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-amber-900 dark:text-amber-300">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-4">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-3 mt-1 bg-amber-100 dark:bg-amber-900/30 p-1 rounded-full text-amber-600 dark:text-amber-400">
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4 bg-amber-600 dark:bg-amber-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
            </svg>
          </div>
          
          <motion.div 
            className="container mx-auto text-center relative z-10 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Join thousands of users who are building amazing websites with our AI-powered platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-amber-800 hover:bg-amber-100 px-8 shadow-lg hover:shadow-xl transition-all">
                <Link to="/auth">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10 px-8">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
