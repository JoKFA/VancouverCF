import { Link } from 'react-router-dom'
import { Users, Award, FileText, ArrowRight, Sparkles, Star, Heart, Briefcase, TrendingUp, Network } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import ParticleBackground from '../components/ParticleBackground'
import AnimatedCounter from '../components/AnimatedCounter'

function HomePage() {
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [aboutRef, aboutInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [programsRef, programsInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [impactRef, impactInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [careerRef, careerInView] = useInView({ threshold: 0.3, triggerOnce: true })

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
      color: 'from-blue-500 to-purple-500'
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
      color: 'from-green-500 to-blue-500'
    },
  ]

  const careerBenefits = [
    {
      icon: <Briefcase className="h-12 w-12" />,
      title: 'Direct Employer Access',
      description: 'Meet hiring managers and recruiters from top Vancouver companies face-to-face.',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: <Network className="h-12 w-12" />,
      title: 'Professional Networking',
      description: 'Build valuable connections that can accelerate your career growth.',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <TrendingUp className="h-12 w-12" />,
      title: 'Career Advancement',
      description: 'Discover new opportunities and take the next step in your professional journey.',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      color: 'from-green-500 to-blue-500'
    }
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
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500" />
        <div className="absolute inset-0 bg-black/20" />
        <ParticleBackground />
        
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-300/15 rounded-full blur-xl" />
        
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
                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium mb-6 border border-white/30"
              >
                <img 
                  src="/cropped-unnamed-1.png" 
                  alt="Vancouver Career Fair" 
                  className="w-6 h-6 mr-3 rounded-full"
                />
                <Sparkles className="w-5 h-5 mr-2" />
                Vancouver Career Fair 2025
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                Shape Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300">
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
              <Link to="/events" className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-2 transform hover:scale-105 hover:shadow-2xl">
                <span className="relative z-10 flex items-center">
                  View Events
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link to="/resume" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl border border-white/30 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 transform hover:scale-105 hover:shadow-xl">
                Submit Resume
              </Link>
              <a href="mailto:careerfairinvan@gmail.com" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-xl border border-white/30 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50 focus:ring-offset-2 transform hover:scale-105 hover:shadow-xl">
                Contact Us
              </a>
            </motion.div>
          </motion.div>
        </div>

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

      <section className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 section-padding relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-orange-100/20 to-purple-100/20 rounded-full blur-2xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            ref={careerRef}
            initial="hidden"
            animate={careerInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-8"
            >
              Why Choose Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Career Fair?</span>
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Experience the difference that personalized career development can make in your professional journey
            </motion.p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {careerBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -15, scale: 1.03 }}
                className="group relative overflow-hidden rounded-2xl shadow-xl"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={benefit.image} 
                    alt={benefit.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
                </div>
                
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${benefit.color} text-white mb-4 w-fit shadow-lg`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-purple-600/0 to-purple-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-gray-50 to-purple-50/50 section-padding relative overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-orange-200/15 to-purple-200/15 rounded-full blur-2xl" />
        
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
              About the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Event</span>
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
              <div className="flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500 mr-2" />
                <p className="text-xl text-gray-600 leading-relaxed">
                  Our mission is to bridge the gap between skilled individuals and diverse companies in Greater Vancouver, 
                  fostering meaningful connections that drive career growth and business success.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 section-padding relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-orange-100/20 to-purple-100/20 rounded-full blur-2xl" />
        
        <div className="max-w-7xl mx-auto relative">
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
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Programs</span>
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
                whileHover={{ y: -10, scale: 1.02 }}
                className="card card-hover p-8 text-center group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                <div className="relative">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${program.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {program.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {program.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden section-padding">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl" />
        
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
              className="text-4xl md:text-5xl font-bold mb-8 text-white"
            >
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Impact</span>
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
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl" />
                <div className="relative">
                  <div className="text-4xl md:text-5xl font-black text-white mb-3">
                    <AnimatedCounter end={stat.number} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/80 font-medium text-lg">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 section-padding relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-xl" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-200/15 to-purple-200/15 rounded-full blur-2xl" />
        
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Get Started?</span>
            </h2>
            <div className="flex items-center justify-center mb-8">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              <p className="text-xl text-gray-600 leading-relaxed">
                Join thousands of professionals who have advanced their careers through our events.
              </p>
            </div>
            <p className="text-lg text-gray-600 mb-12">
              Your next opportunity is just one connection away.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/events" className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-2 transform hover:scale-105 hover:shadow-xl">
                <span className="relative z-10 flex items-center">
                  Explore Events
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link to="/about" className="bg-white hover:bg-purple-50 text-purple-600 font-semibold py-4 px-8 rounded-xl border-2 border-purple-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-2 transform hover:scale-105 hover:shadow-xl">
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