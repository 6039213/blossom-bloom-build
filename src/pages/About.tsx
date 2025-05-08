import React from 'react';
import { motion } from 'framer-motion';
import MainNavbar from '@/components/layout/MainNavbar';
import Footer from '@/components/layout/Footer';
import { APP_NAME } from '@/lib/constants';
export default function AboutPage() {
  const teamMembers = [{
    name: "Alex Chen",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    bio: "Former AI researcher with a passion for making technology accessible to everyone."
  }, {
    name: "Sarah Johnson",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    bio: "Full-stack developer who believes in the power of AI to transform web development."
  }, {
    name: "Michael Rodriguez",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    bio: "Award-winning UI/UX designer with 10+ years experience creating beautiful digital experiences."
  }, {
    name: "Emily Zhang",
    role: "AI Research Lead",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80",
    bio: "PhD in machine learning, specializing in natural language processing and computer vision."
  }];

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };
  return <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white dark:from-gray-950 dark:to-gray-900">
      <MainNavbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-900 dark:to-amber-800 text-white">
          <div className="container max-w-screen-xl mx-auto">
            <div className="max-w-3xl">
              <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5
            }}>
                About {APP_NAME}
              </motion.h1>
              <motion.p className="text-xl md:text-2xl text-amber-100" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5,
              delay: 0.1
            }}>
                We're revolutionizing the way websites are created through the power of artificial intelligence.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 px-4">
          <div className="container max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{
              opacity: 0,
              x: -30
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.7
            }} viewport={{
              once: true
            }}>
                <div className="bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-900/10 p-8 rounded-2xl shadow-lg overflow-hidden relative">
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%">
                      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="currentColor" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#dots)" />
                    </svg>
                  </div>
                  <div className="relative">
                    <h3 className="text-3xl font-bold mb-6 text-amber-900 dark:text-amber-300">Our Mission</h3>
                    <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
                      Our mission is to democratize web development by making it accessible to everyone, 
                      regardless of their technical background.
                    </p>
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                      We believe that great ideas deserve great websites, and we're here to help make that happen
                      through the power of artificial intelligence and intuitive design.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div initial={{
              opacity: 0,
              x: 30
            }} whileInView={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.7
            }} viewport={{
              once: true
            }}>
                <h2 className="text-3xl font-bold mb-6 text-amber-900 dark:text-amber-300">Our Story</h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p>
                    {APP_NAME} was born from a simple idea: what if creating a website could be as easy as having a conversation?
                    We've combined cutting-edge AI technology with intuitive design tools to make that vision a reality.
                  </p>
                  <p>
                    Founded in 2023, our team of designers, developers, and AI researchers came together with a shared
                    vision of transforming the web development process. After months of development and testing,
                    we launched our first AI website builder to overwhelming positive feedback.
                  </p>
                  <p>
                    Today, {APP_NAME} is used by thousands of entrepreneurs, small businesses, and creators
                    around the world to bring their online presence to life without writing a single line of code.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container max-w-screen-xl mx-auto">
            <motion.div className="text-center mb-16" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} viewport={{
            once: true
          }}>
              <h2 className="text-3xl font-bold mb-4 text-amber-900 dark:text-amber-300">Our Values</h2>
              <p className="text-xl max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
                These core principles guide everything we do at {APP_NAME}.
              </p>
            </motion.div>
            
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
            once: true
          }}>
              {[{
              title: "Accessibility",
              description: "We believe everyone should be able to create professional websites, regardless of technical skill.",
              icon: "🌐"
            }, {
              title: "Innovation",
              description: "We're constantly pushing boundaries to create better tools and experiences.",
              icon: "💡"
            }, {
              title: "Quality",
              description: "We're committed to producing beautiful, high-performing websites that meet modern standards.",
              icon: "✨"
            }].map((value, index) => <motion.div key={index} variants={itemVariants} className="bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-900/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-3xl mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-amber-900 dark:text-amber-300">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </motion.div>)}
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4">
          
        </section>
        
        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-900 dark:to-amber-800 text-white">
          <div className="container max-w-screen-xl mx-auto text-center">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} viewport={{
            once: true
          }}>
              <h2 className="text-3xl font-bold mb-6">Join Us on Our Journey</h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                We're just getting started. Experience the future of web development today with {APP_NAME}.
              </p>
              <motion.a href="/auth" className="inline-block py-3 px-8 bg-white text-amber-800 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all hover:bg-amber-50" whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }}>
                Get Started Free
              </motion.a>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
}