'use client';

import { motion } from 'framer-motion';
import { Users, Heart, Linkedin, Twitter, Github, Mail } from 'lucide-react';

const team = [
  {
    name: 'Christa Hasenkopf',
    role: 'Executive Director & Co-Founder',
    bio: 'Environmental scientist passionate about democratizing air quality data',
    image: '👩‍🔬',
    social: {
      linkedin: '#',
      twitter: '#',
      email: 'christa@openaq.org'
    }
  },
  {
    name: 'Joe Flasher',
    role: 'CTO & Co-Founder',
    bio: 'Full-stack developer building open-source solutions for environmental data',
    image: '👨‍💻',
    social: {
      linkedin: '#',
      github: '#',
      email: 'joe@openaq.org'
    }
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Partnerships',
    bio: 'Building global collaborations to expand air quality monitoring networks',
    image: '👩‍💼',
    social: {
      linkedin: '#',
      email: 'sarah@openaq.org'
    }
  },
  {
    name: 'Michael Chen',
    role: 'Lead Data Scientist',
    bio: 'Developing algorithms for air quality data harmonization and analysis',
    image: '👨‍🔬',
    social: {
      linkedin: '#',
      github: '#',
      email: 'michael@openaq.org'
    }
  },
  {
    name: 'Emily Rodriguez',
    role: 'Community Manager',
    bio: 'Engaging with our global community of air quality advocates',
    image: '👩‍💼',
    social: {
      twitter: '#',
      email: 'emily@openaq.org'
    }
  },
  {
    name: 'David Kim',
    role: 'DevOps Engineer',
    bio: 'Ensuring platform reliability and scalability',
    image: '👨‍💼',
    social: {
      github: '#',
      linkedin: '#',
      email: 'david@openaq.org'
    }
  }
];

const advisors = [
  {
    name: 'Dr. Jane Smith',
    role: 'Environmental Health Advisor',
    affiliation: 'Harvard University',
    image: '👩‍🏫'
  },
  {
    name: 'Prof. Robert Lee',
    role: 'Data Science Advisor',
    affiliation: 'MIT',
    image: '👨‍🏫'
  },
  {
    name: 'Dr. Maria Garcia',
    role: 'Policy Advisor',
    affiliation: 'WHO',
    image: '👩‍⚕️'
  },
  {
    name: 'James Wilson',
    role: 'Technology Advisor',
    affiliation: 'Google',
    image: '👨‍💻'
  }
];

export default function PeoplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-6 shadow-lg">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Meet Our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Team</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Passionate individuals working together to democratize air quality data and create a healthier planet for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Core Team</h2>
            <p className="text-lg text-slate-600">
              The dedicated team behind UrbanReflex
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-8">
                  <div className="text-6xl mb-4 text-center">{member.image}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                    {member.name}
                  </h3>
                  <p className="text-primary font-semibold mb-4 text-center">
                    {member.role}
                  </p>
                  <p className="text-slate-600 mb-6 text-center">
                    {member.bio}
                  </p>
                  
                  <div className="flex justify-center space-x-4">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-sky-100 hover:text-sky-600 transition-colors">
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.github && (
                      <a href={member.social.github} className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 hover:text-slate-900 transition-colors">
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {member.social.email && (
                      <a href={`mailto:${member.social.email}`} className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
                        <Mail className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisors */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Advisory Board</h2>
            <p className="text-lg text-slate-600">
              Expert guidance from leading professionals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advisors.map((advisor, index) => (
              <motion.div
                key={advisor.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="text-5xl mb-4">{advisor.image}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {advisor.name}
                </h3>
                <p className="text-primary font-semibold mb-2">
                  {advisor.role}
                </p>
                <p className="text-slate-600 text-sm">
                  {advisor.affiliation}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl mb-8 opacity-90">
              We are always looking for passionate individuals to help us democratize air quality data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/careers" className="px-8 py-4 bg-white text-primary rounded-lg font-bold hover:bg-slate-100 transition-colors">
                View Open Positions
              </a>
              <a href="/volunteer" className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg font-bold hover:bg-white/20 transition-colors border-2 border-white">
                Volunteer With Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

