
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight } from 'lucide-react';
import MainNavbar from '@/components/layout/MainNavbar';
import Footer from '@/components/layout/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function TemplatesPage() {
  const templates = [
    {
      id: '1',
      title: 'Modern Portfolio',
      category: 'Portfolio',
      description: 'A clean, minimal portfolio template perfect for designers and creatives.',
      image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      featured: true
    },
    {
      id: '2',
      title: 'Coffee Shop',
      category: 'Business',
      description: 'Warm and inviting template for cafés and coffee shops.',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      featured: true
    },
    {
      id: '3',
      title: 'Professional Blog',
      category: 'Blog',
      description: 'Clean and professional blog template with excellent typography.',
      image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      featured: false
    },
    {
      id: '4',
      title: 'Tech Startup',
      category: 'Business',
      description: 'Modern and sleek template for tech startups and SaaS companies.',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      featured: false
    },
    {
      id: '5',
      title: 'Fitness Coach',
      category: 'Personal',
      description: 'Dynamic template for personal trainers and fitness professionals.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      featured: false
    },
    {
      id: '6',
      title: 'Restaurant',
      category: 'Business',
      description: 'Elegant template for restaurants with menu showcasing.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      featured: true
    }
  ];

  const categories = ['All', 'Business', 'Portfolio', 'Blog', 'E-commerce', 'Personal', 'Landing Page'];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-white dark:from-gray-950 dark:to-gray-900">
      <MainNavbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4 bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-900 dark:to-amber-800 text-white">
          <div className="container max-w-screen-xl mx-auto">
            <div className="max-w-3xl">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Website Templates
              </motion.h1>
              <motion.p 
                className="text-xl text-amber-100 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Browse our collection of professionally designed templates or create your own with our AI builder.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-amber-300" />
                  <Input 
                    placeholder="Search templates..." 
                    className="pl-10 bg-white/10 border-white/20 focus:border-white text-white placeholder:text-amber-200 rounded-lg"
                  />
                </div>
                <Button className="bg-white text-amber-800 hover:bg-amber-100 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter Templates
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Categories */}
        <section className="py-8 px-4 border-b border-amber-200 dark:border-amber-900/20">
          <div className="container max-w-screen-xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Button 
                    variant={index === 0 ? "default" : "outline"}
                    className={index === 0 ? 
                      "bg-amber-600 hover:bg-amber-700 text-white" : 
                      "border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30"
                    }
                    size="sm"
                  >
                    {category}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Templates */}
        <section className="py-16 px-4">
          <div className="container max-w-screen-xl mx-auto">
            <motion.h2 
              className="text-2xl font-bold mb-8 text-amber-900 dark:text-amber-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Featured Templates
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {templates.filter(t => t.featured).map((template) => (
                <motion.div 
                  key={template.id}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-amber-200 dark:border-amber-900/20">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img 
                        src={template.image} 
                        alt={template.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-amber-900 dark:text-amber-300">
                          {template.title}
                        </h3>
                        <Badge variant="outline" className="border-amber-300 text-amber-800 dark:border-amber-800 dark:text-amber-400">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {template.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <Link 
                          to={`/templates/${template.id}`}
                          className="inline-flex items-center text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 font-medium"
                        >
                          Preview
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30">
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* All Templates */}
        <section className="py-16 px-4 bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-950">
          <div className="container max-w-screen-xl mx-auto">
            <motion.h2 
              className="text-2xl font-bold mb-8 text-amber-900 dark:text-amber-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              All Templates
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {templates.map((template) => (
                <motion.div 
                  key={template.id}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-amber-200 dark:border-amber-900/20">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img 
                        src={template.image} 
                        alt={template.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      {template.featured && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-amber-500 hover:bg-amber-600">Featured</Badge>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-amber-900 dark:text-amber-300">{template.title}</h3>
                        <Badge variant="outline" className="border-amber-300 text-amber-800 dark:border-amber-800 dark:text-amber-400">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {template.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <Link 
                          to={`/templates/${template.id}`}
                          className="inline-flex items-center text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 font-medium"
                        >
                          Preview
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/30">
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* Create Custom Template */}
        <section className="py-16 px-4 bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-900 dark:to-amber-800 text-white">
          <div className="container max-w-screen-xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-2/3">
                <motion.h2 
                  className="text-3xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  Can't find the perfect template?
                </motion.h2>
                <motion.p 
                  className="text-xl text-amber-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  Use our AI website builder to create a completely custom website tailored to your specific needs.
                </motion.p>
              </div>
              <div className="md:w-1/3 flex justify-center md:justify-end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-amber-800 hover:bg-amber-100 px-8 shadow-lg hover:shadow-xl transition-all"
                  >
                    <Link to="/dashboard/ai-builder">
                      Create Custom Website
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
