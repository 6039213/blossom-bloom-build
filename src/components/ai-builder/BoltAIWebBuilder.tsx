
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Code, Eye, Download, Copy, Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Sample prompts
const samplePrompts = [
  "Create a modern landing page for a coffee shop with a gold and brown color scheme",
  "Build a photography portfolio website with a dark theme and image gallery",
  "Design a SaaS dashboard with analytics charts and user management",
  "Create a personal blog with featured posts and a newsletter signup"
];

// Sample code templates
const codeTemplates = {
  landingPage: `// App.jsx
import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="px-4 py-6 md:px-8 lg:px-12">
        <div className="container mx-auto flex justify-between items-center">
          <div className="font-bold text-amber-800 text-xl md:text-2xl">Coffee House</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-amber-900 hover:text-amber-700">Home</a>
            <a href="#" className="text-amber-900 hover:text-amber-700">Menu</a>
            <a href="#" className="text-amber-900 hover:text-amber-700">About</a>
            <a href="#" className="text-amber-900 hover:text-amber-700">Contact</a>
          </nav>
          <button className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4 md:px-8 lg:px-12">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-900 mb-6">Artisanal Coffee Experience</h1>
            <p className="text-lg text-amber-800 mb-8">Discover our carefully selected coffee beans from around the world, roasted to perfection.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-amber-800 text-white rounded-md hover:bg-amber-700 transition">View Menu</button>
              <button className="px-6 py-3 border border-amber-800 text-amber-800 rounded-md hover:bg-amber-50 transition">Book a Table</button>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
              alt="Coffee cup on wooden table" 
              className="rounded-lg shadow-lg w-full"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20 px-4 md:px-8 lg:px-12 bg-amber-100">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4">Why Choose Us</h2>
          <p className="text-amber-800 max-w-2xl mx-auto">Our commitment to quality and service sets us apart.</p>
        </div>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-amber-700 text-3xl mb-4">♨️</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Premium Beans</h3>
            <p className="text-amber-800">Sourced from sustainable farms across the globe for unique flavors.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-amber-700 text-3xl mb-4">👨‍🍳</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Expert Baristas</h3>
            <p className="text-amber-800">Our skilled baristas craft each drink with care and precision.</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-amber-700 text-3xl mb-4">🌿</div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Eco-Friendly</h3>
            <p className="text-amber-800">Committed to sustainable practices that are good for the planet.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-20 px-4 md:px-8 lg:px-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-8">Visit Us Today</h2>
          <p className="text-lg text-amber-800 mb-8 max-w-2xl mx-auto">Experience our premium coffee and cozy atmosphere. We're open daily from 7am to 8pm.</p>
          <button className="px-8 py-3 bg-amber-800 text-white rounded-md hover:bg-amber-700 transition">Find Location</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-100 py-8 px-4 md:px-8 lg:px-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Coffee House</h3>
            <p>Bringing you the finest coffee experience since 2010.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Menu</a></li>
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Opening Hours</h4>
            <ul className="space-y-2">
              <li>Mon-Fri: 7am - 8pm</li>
              <li>Sat: 8am - 8pm</li>
              <li>Sun: 9am - 6pm</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>123 Coffee Street</li>
              <li>City, State 12345</li>
              <li>info@coffeehouse.com</li>
              <li>(123) 456-7890</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto mt-8 pt-8 border-t border-amber-800 text-center">
          <p>&copy; 2025 Coffee House. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}`,

  dashboard: `// App.jsx
import React, { useState } from 'react';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar - Mobile */}
      <div className={\`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden \${sidebarOpen ? 'block' : 'hidden'}\`} 
           onClick={() => setSidebarOpen(false)}></div>

      {/* Sidebar */}
      <div className={\`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0 \${sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'}\`}>
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <span className="mx-2 text-2xl font-semibold text-white">Dashboard</span>
          </div>
        </div>

        <nav className="mt-10">
          <a className="flex items-center px-6 py-2 mt-4 text-gray-100 bg-gray-700 bg-opacity-25" href="#">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
            </svg>
            <span className="mx-3">Dashboard</span>
          </a>

          <a className="flex items-center px-6 py-2 mt-4 text-gray-300 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" href="#">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span className="mx-3">Team</span>
          </a>

          <a className="flex items-center px-6 py-2 mt-4 text-gray-300 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" href="#">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span className="mx-3">Projects</span>
          </a>

          <a className="flex items-center px-6 py-2 mt-4 text-gray-300 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" href="#">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            <span className="mx-3">Documents</span>
          </a>

          <a className="flex items-center px-6 py-2 mt-4 text-gray-300 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100" href="#">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="mx-3">Settings</span>
          </a>
        </nav>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-500 dark:text-gray-200 focus:outline-none lg:hidden">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            <div className="relative mx-4 lg:mx-0">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </span>

              <input className="w-32 pl-10 pr-4 rounded-md form-input sm:w-64 focus:border-indigo-600 dark:bg-gray-700 dark:text-white dark:border-gray-600" type="text" placeholder="Search" />
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <button className="flex mx-4 text-gray-600 dark:text-gray-200 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </button>

              <div className="fixed inset-0 z-10 w-full h-full" style={{display: 'none'}}></div>
            </div>

            <div className="relative">
              <button className="relative block w-8 h-8 overflow-hidden rounded-full shadow focus:outline-none">
                <img className="object-cover w-full h-full" src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80" alt="Your avatar" />
              </button>

              <div className="fixed inset-0 z-10 w-full h-full" style={{display: 'none'}}></div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="container px-6 py-8 mx-auto">
            <h3 className="text-3xl font-medium text-gray-700 dark:text-gray-200">Dashboard</h3>

            <div className="mt-4">
              <div className="flex flex-wrap -mx-6">
                <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
                  <div className="flex items-center px-5 py-6 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                    <div className="p-3 bg-indigo-600 bg-opacity-75 rounded-full">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                      </svg>
                    </div>

                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">8,282</h4>
                      <div className="text-gray-500 dark:text-gray-400">New Users</div>
                    </div>
                  </div>
                </div>

                <div className="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                  <div className="flex items-center px-5 py-6 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                    <div className="p-3 bg-green-600 bg-opacity-75 rounded-full">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>

                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">200,521</h4>
                      <div className="text-gray-500 dark:text-gray-400">Total Orders</div>
                    </div>
                  </div>
                </div>

                <div className="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
                  <div className="flex items-center px-5 py-6 bg-white dark:bg-gray-800 rounded-md shadow-sm">
                    <div className="p-3 bg-pink-600 bg-opacity-75 rounded-full">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                      </svg>
                    </div>

                    <div className="mx-5">
                      <h4 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">$215,542</h4>
                      <div className="text-gray-500 dark:text-gray-400">Total Sales</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex flex-col mt-8">
                <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-b border-gray-200 rounded-md shadow-md dark:border-gray-700">
                      <table className="min-w-full overflow-x-scroll divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Name</th>
                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Title</th>
                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Status</th>
                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">Role</th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Edit</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10">
                                  <img className="w-10 h-10 rounded-full" src="https://avatars0.githubusercontent.com/u/57622665?s=460&u=8f581f4c4acd4c18c33a87b3e6476112325e8b38&v=4" alt="" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">Jane Doe</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">jane.doe@example.com</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">Software Engineer</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Engineering</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">Active</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">Admin</td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a href="#" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600">Edit</a>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10">
                                  <img className="w-10 h-10 rounded-full" src="https://avatars0.githubusercontent.com/u/57622665?s=460&u=8f581f4c4acd4c18c33a87b3e6476112325e8b38&v=4" alt="" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">John Smith</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">john.smith@example.com</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">Product Designer</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Design</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">Active</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">Member</td>
                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                              <a href="#" className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600">Edit</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}`
};

export default function BoltAIWebBuilder() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('preview');
  const [viewportSize, setViewportSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [progress, setProgress] = useState(0);
  const [progressInterval, setProgressIntervalRef] = useState<ReturnType<typeof setInterval> | null>(null);
  const [websiteType, setWebsiteType] = useState<'landingPage' | 'dashboard' | null>(null);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [progressInterval]);
  
  // Update iframe content when generated code changes
  useEffect(() => {
    if (iframeRef.current && Object.keys(generatedCode).length > 0) {
      updateIframeContent();
    }
  }, [generatedCode, viewportSize]);
  
  // Generate HTML content for iframe
  const updateIframeContent = () => {
    if (!iframeRef.current) return;
    
    try {
      // Create basic HTML wrapper
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website Preview</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; padding: 0; font-family: system-ui, sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // This is a simplified preview environment
    const App = ${Object.values(generatedCode)[0] || "() => <div>No preview available</div>"};
    
    // Mount the App component
    ReactDOM.render(React.createElement(App), document.getElementById('root'));
  </script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</body>
</html>`;
      
      // Set content to iframe
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    } catch (error) {
      console.error("Error updating preview:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a website description");
      return;
    }
    
    // Start generation process
    setIsGenerating(true);
    setProgress(0);
    
    // Determine website type based on prompt keywords
    let type: 'landingPage' | 'dashboard' = 'landingPage';
    if (prompt.toLowerCase().includes('dashboard') || 
        prompt.toLowerCase().includes('admin') || 
        prompt.toLowerCase().includes('analytics')) {
      type = 'dashboard';
    }
    setWebsiteType(type);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 5 + 1; // 1-6% increment
        const newProgress = prev + increment;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 200);
    setProgressIntervalRef(interval);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use pre-built templates based on website type
      const generatedCode = { 'App.jsx': codeTemplates[type] };
      setGeneratedCode(generatedCode);
      
      // Complete progress
      clearInterval(interval);
      setProgress(100);
      toast.success("Website generated successfully!");
      
      // Switch to preview tab
      setActiveTab('preview');
      
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate website. Please try again.");
    } finally {
      if (interval) clearInterval(interval);
      setIsGenerating(false);
    }
  };

  // Get appropriate class for viewport size
  const getPreviewContainerClass = () => {
    switch (viewportSize) {
      case 'mobile':
        return 'max-w-[375px] h-[667px]';
      case 'tablet':
        return 'max-w-[768px] h-[1024px]';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };
  
  // Handle sample prompt selection
  const handleUseSamplePrompt = (samplePrompt: string) => {
    setPrompt(samplePrompt);
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    const code = Object.values(generatedCode)[0] || '';
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    }
  };

  // Download code
  const handleDownloadCode = () => {
    const code = Object.values(generatedCode)[0] || '';
    if (code) {
      const blob = new Blob([code], { type: 'text/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'App.jsx';
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Code downloaded");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 h-full">
      {/* Left panel - Prompt input */}
      <Card className="lg:col-span-2 flex flex-col overflow-hidden bg-white dark:bg-gray-900 border rounded-lg shadow-sm">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline" className="font-semibold bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Website Builder
            </Badge>
            <span className="text-xs text-muted-foreground">Web Generator</span>
          </div>
          <h2 className="text-lg font-medium">Create your website</h2>
          <p className="text-sm text-muted-foreground">
            Describe the website you want to build
          </p>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your website in detail... (e.g., 'Create a modern coffee shop website with online ordering')"
              className="min-h-[120px] resize-none focus-visible:ring-blue-500"
            />
            
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors"
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </div>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Generate Website
                </>
              )}
            </Button>
          </form>

          {isGenerating && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2 text-sm">
                <span>Generating website...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Example prompts
            </h3>
            <div className="space-y-2">
              {samplePrompts.map((samplePrompt, index) => (
                <button
                  key={index}
                  onClick={() => handleUseSamplePrompt(samplePrompt)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition-colors"
                >
                  {samplePrompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Right panel - Preview and code */}
      <Card className="lg:col-span-5 flex flex-col overflow-hidden bg-white dark:bg-gray-900 border rounded-lg shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b p-4 bg-muted/30">
            <TabsList>
              <TabsTrigger value="preview" className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-1.5">
                <Code className="h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'preview' && (
              <div className="flex items-center gap-2">
                <Button
                  variant={viewportSize === 'mobile' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewportSize('mobile')}
                  className="h-8 w-8"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewportSize === 'tablet' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewportSize('tablet')}
                  className="h-8 w-8"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewportSize === 'desktop' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewportSize('desktop')}
                  className="h-8 w-8"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={updateIframeContent}
                  className="h-8 w-8"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <TabsContent value="preview" className="flex-1 p-4 m-0 overflow-hidden">
            <div className={`flex items-center justify-center mx-auto transition-all duration-300 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black rounded-lg border overflow-hidden h-full ${getPreviewContainerClass()}`}>
              {Object.keys(generatedCode).length > 0 ? (
                <iframe
                  ref={iframeRef}
                  title="Website Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <div className="text-center p-6 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">Website Preview</h3>
                  <p className="text-muted-foreground mb-6">
                    Enter your website description and click "Generate Website" to create your custom website.
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                    <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-3 text-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => handleUseSamplePrompt(samplePrompts[0])}>
                      <p className="text-sm font-medium">Landing Page</p>
                    </div>
                    <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-3 text-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" onClick={() => handleUseSamplePrompt(samplePrompts[2])}>
                      <p className="text-sm font-medium">Dashboard</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
            
          <TabsContent value="code" className="flex-1 flex flex-col m-0 overflow-hidden">
            {Object.keys(generatedCode).length > 0 ? (
              <>
                <div className="flex-1 overflow-auto">
                  <pre className="p-4 text-sm font-mono bg-gray-900 text-gray-100 h-full overflow-auto">
                    {Object.values(generatedCode)[0] || ''}
                  </pre>
                </div>

                <div className="border-t p-3 flex justify-between items-center bg-gray-800">
                  <div>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleCopyCode}
                      className="text-xs bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy Code
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadCode}
                      className="text-xs ml-2 bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {websiteType === 'landingPage' ? 'Landing Page Template' : 'Dashboard Template'}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <Code className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-xl font-medium mb-2">No code generated yet</h3>
                  <p className="text-muted-foreground">
                    Generate a website to see the code. You'll be able to view and download all the components.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
