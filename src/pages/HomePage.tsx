import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, Award, FileText, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import ParticleBackground from '../components/ParticleBackground'
import AnimatedCounter from '../components/AnimatedCounter'

/**
 * Enhanced homepage with animations and modern design
 */
function HomePage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [aboutRef, aboutInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [programsRef, programsInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [impactRef, impactInView] = useInView({ threshold: 0.3, triggerOnce: true })

  const impactStats = [
    { number: 25000, label: 'Community members served', suffix: '+' },
    { number: 1500, label: 'Community activities hosted', suffix: '+' },
    { number: 40000, label: 'Volunteer hours contributed', suffix: '+' },
    { number: 100, label: 'Community partnerships', suffix: '+' },
  ]

  const programs = [
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Career Seminars',
      description: 'Expert-led sessions on industry trends and career development strategies.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: 'Development Workshops',
      description: 'Hands-on workshops to build essential professional skills and competencies.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Job Companion Program',
      description: 'Personalized guidance and support throughout your job search journey.',
      color: 'from-green-500 to-emerald-500'
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center animated-gradient">
        <ParticleBackground />
        <div className="relative z-10 max-w-7xl mx-auto section-padding text-center">
          <motion.div
            ref={heroRef}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium mb-6"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Vancouver Career Fair 2025
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                Shape Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Future
                </span>
              </h1>
            </motion.div>

            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed"
            >
              Connect with top employers, explore career opportunities, and advance your professional journey 
              in Greater Vancouver's most comprehensive career development event.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8"
            >
              <Link to="/events" className="btn-primary group">
                View Events
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/resume" className="btn-secondary">
                Submit Resume
              </Link>
              <a href="mailto:careerfairinvan@gmail.com" className="btn-secondary">
                Contact Us
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="bg-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-white opacity-50" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            ref={aboutRef}
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-8"
            >
              About the <span className="text-gradient">Event</span>
            </motion.h2>
            <motion.div 
              variants={itemVariants}
              className="max-w-4xl mx-auto space-y-6"
            >
              <p className="text-xl text-gray-600 leading-relaxed">
                In today's competitive job market, networking and direct engagement with potential employers 
                are more crucial than ever. The Vancouver Career Fair creates a dynamic space where talented 
                job seekers and leading employers come together to explore mutual opportunities.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                Our mission is to bridge the gap between skilled individuals and diverse companies in Greater Vancouver, 
                fostering meaningful connections that drive career growth and business success.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="bg-gray-50 section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            ref={programsRef}
            initial="hidden"
            animate={programsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Our <span className="text-gradient">Programs</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Comprehensive career development programs designed to empower your professional journey
            </motion.p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {programs.map((program, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="card card-hover p-8 text-center group"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${program.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {program.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {program.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {program.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="gradient-bg text-white section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            ref={impactRef}
            initial="hidden"
            animate={impactInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-8"
            >
              Our <span className="text-yellow-300">Impact</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-white/90 max-w-3xl mx-auto"
            >
              Through our diverse range of programs, events, and volunteer opportunities, 
              we strive to empower individuals, foster connections, and support local growth.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 glass-effect rounded-2xl"
              >
                <div className="text-4xl md:text-5xl font-black text-white mb-3">
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-white/80 font-medium text-lg">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Ready to <span className="text-gradient">Get Started?</span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Join thousands of professionals who have advanced their careers through our events. 
              Your next opportunity is just one connection away.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/events" className="btn-primary group">
                Explore Events
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="btn-outline">
                Learn More About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage