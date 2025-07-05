import { Users, Calendar, Award, Globe, Sparkles, Heart, Star, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import AnimatedCounter from '../components/AnimatedCounter'

/**
 * Enhanced About page with consistent design and purple accents
 */
function AboutPage() {
  const [headerRef, headerInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [missionRef, missionInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [achievementsRef, achievementsInView] = useInView({ threshold: 0.3, triggerOnce: true })
  const [focusRef, focusInView] = useInView({ threshold: 0.3, triggerOnce: true })

  const highlights = [
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'Community Engagement',
      description: 'Fostering connections and self-development among young generation and community members',
      color: 'from-purple-100 to-blue-100'
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      title: 'Established 2018',
      description: 'Over 6 years of dedicated service to the Greater Vancouver community',
      color: 'from-blue-100 to-purple-100'
    },
    {
      icon: <Award className="h-8 w-8 text-orange-600" />,
      title: 'Positive Impact',
      description: 'Initiatives aimed at spreading positivity and fostering an inclusive community',
      color: 'from-orange-100 to-purple-100'
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      title: 'Multiculturalism',
      description: 'Encouraging appreciation and understanding of diverse cultures',
      color: 'from-green-100 to-blue-100'
    }
  ]

  const achievements = [
    { number: 30000, label: 'Community members served and helped', suffix: '+' },
    { number: 1500, label: 'Events hosted or participated in since 2018', suffix: '+' },
    { number: 40000, label: 'Volunteer hours contributed to the community', suffix: '+' },
    { number: 100, label: 'Strong partnerships with local organizations', suffix: '+' }
  ]

  const focusAreas = [
    {
      title: 'Community Service',
      description: 'Inspiring young people, new immigrants, and citizens to participate in meaningful community service activities',
      icon: <Heart className="h-6 w-6" />,
      color: 'from-red-500 to-pink-500'
    },
    {
      title: 'Self-Development',
      description: 'Providing opportunities for young people and community members to discover and nurture their talents and self-worth',
      icon: <Target className="h-6 w-6" />,
      color: 'from-purple-500 to-blue-500'
    },
    {
      title: 'Cultural Appreciation',
      description: 'Promoting multiculturalism and encouraging appreciation of diverse cultures',
      icon: <Globe className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Local Partnerships',
      description: 'Maintaining strong relationships with local communities and organizations to foster collaboration and support',
      icon: <Users className="h-6 w-6" />,
      color: 'from-blue-500 to-purple-500'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-orange-200/20 to-purple-200/20 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl" />

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500" />
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl" />
        
        <div className="relative section-padding text-white">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              ref={headerRef}
              initial={{ opacity: 0, y: 30 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium mb-6"
              >
                <img 
                  src="/cropped-unnamed-1.png" 
                  alt="VIVA" 
                  className="w-6 h-6 mr-3 rounded-full"
                />
                <Sparkles className="w-5 h-5 mr-2" />
                Empowering Communities Since 2018
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">VIVA</span>
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
              >
                A registered non-profit organization dedicated to community engagement 
                and empowering the next generation in Greater Vancouver, BC
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Mission Section */}
      <section className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 section-padding relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-orange-100/20 to-purple-100/20 rounded-full blur-2xl" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            ref={missionRef}
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Mission</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div variants={itemVariants}>
                <div className="space-y-6">
                  <p className="text-xl text-gray-600 leading-relaxed">
                    VIVA is a registered non-profit organization based in Greater Vancouver area, BC, Canada. 
                    Established in June 2018, we focus on community engagement and self-development among 
                    young generation and community members.
                  </p>
                  <div className="flex items-start">
                    <Heart className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <p className="text-xl text-gray-600 leading-relaxed">
                      Through our diverse programs and initiatives, we strive to create positive social impact 
                      by fostering an inclusive community where everyone can thrive and contribute meaningfully 
                      to society.
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6">
                {highlights.map((highlight, index) => (
                  <motion.div 
                    key={index} 
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 relative overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${highlight.color} rounded-full blur-xl opacity-30`} />
                    <div className="relative">
                      <div className={`w-16 h-16 bg-gradient-to-br ${highlight.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        {highlight.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                        {highlight.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {highlight.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Achievements Section */}
      <section className="relative overflow-hidden section-padding">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-orange-500" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-300/20 rounded-full blur-2xl" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            ref={achievementsRef}
            initial="hidden"
            animate={achievementsInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">Achievements</span>
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Since our establishment, we've made significant impact in the Greater Vancouver community
              </p>
            </motion.div>
            
            <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl" />
                  <div className="relative">
                    <div className="text-4xl md:text-5xl font-black text-white mb-3">
                      <AnimatedCounter end={achievement.number} suffix={achievement.suffix} />
                    </div>
                    <div className="text-white/80 font-medium text-lg">
                      {achievement.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Focus Areas */}
      <section className="bg-gradient-to-br from-gray-50 to-purple-50/50 section-padding relative overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-orange-200/15 to-purple-200/15 rounded-full blur-2xl" />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            ref={focusRef}
            initial="hidden"
            animate={focusInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Focus Areas</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We concentrate our efforts on key areas that drive meaningful community impact
              </p>
            </motion.div>
            
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {focusAreas.map((area, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="card p-8 relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/30 to-blue-100/30 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${area.color} text-white mb-6 shadow-lg`}>
                      {area.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {area.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {area.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
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
              Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Community</span>
            </h2>
            <div className="flex items-center justify-center mb-8">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              <p className="text-xl text-gray-600">
                Be part of our mission to create positive change in Greater Vancouver.
              </p>
            </div>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              Whether you're looking to volunteer, participate in events, or partner with us, 
              we welcome you to join our growing community.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="/events" 
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-2 transform hover:scale-105 hover:shadow-xl"
              >
                <span className="relative z-10">View Our Events</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
              <a 
                href="mailto:careerfairinvan@gmail.com" 
                className="bg-white hover:bg-purple-50 text-purple-600 font-semibold py-4 px-8 rounded-xl border-2 border-purple-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-2 transform hover:scale-105 hover:shadow-xl"
              >
                Get Involved
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage