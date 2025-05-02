
import React from 'react';
import { Card } from "@/components/ui/card";
import { Github, Linkedin, Twitter } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export default function Team() {
  const teamMembers: TeamMember[] = [
    {
      name: "Alex Morgan",
      role: "Founder & CEO",
      bio: "Alex founded Blossom AI with a vision to democratize web development using artificial intelligence. With over 15 years of experience in software engineering and AI, he leads our product strategy.",
      image: "https://i.pravatar.cc/300?img=1",
      social: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com"
      }
    },
    {
      name: "Jordan Lee",
      role: "Chief Technology Officer",
      bio: "Jordan oversees our technical architecture and AI integration. Previously lead engineer at several tech giants, she brings deep expertise in machine learning and web technologies.",
      image: "https://i.pravatar.cc/300?img=2",
      social: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com",
        github: "https://github.com"
      }
    },
    {
      name: "Sam Chen",
      role: "Head of Product Design",
      bio: "Sam ensures our platform delivers an exceptional user experience. With a background in UX design for AI tools, he works to make complex technology accessible to everyone.",
      image: "https://i.pravatar.cc/300?img=3",
      social: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      name: "Taylor Wilson",
      role: "AI Research Lead",
      bio: "Taylor leads our AI research initiatives, focusing on improving our generation models and developing new capabilities for web application creation.",
      image: "https://i.pravatar.cc/300?img=4",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      name: "Morgan Rivera",
      role: "Head of Customer Success",
      bio: "Morgan ensures our customers get the most from our platform. With experience in both technical support and customer education, she leads our support team.",
      image: "https://i.pravatar.cc/300?img=5",
      social: {
        twitter: "https://twitter.com",
        linkedin: "https://linkedin.com"
      }
    },
    {
      name: "Jamie Zhang",
      role: "Senior Full-Stack Developer",
      bio: "Jamie works on our core platform features and integrations. A passionate advocate for open-source software, he contributes to several community projects.",
      image: "https://i.pravatar.cc/300?img=6",
      social: {
        github: "https://github.com",
        linkedin: "https://linkedin.com"
      }
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Team</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Meet the passionate individuals behind Blossom AI who are revolutionizing web development.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-square relative">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold">{member.name}</h2>
                <p className="text-primary font-medium mb-4">{member.role}</p>
                <p className="text-muted-foreground mb-4">{member.bio}</p>
                
                <div className="flex gap-4">
                  {member.social.twitter && (
                    <a 
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  
                  {member.social.linkedin && (
                    <a 
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  
                  {member.social.github && (
                    <a 
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
