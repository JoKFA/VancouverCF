import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, Award, FileText } from 'lucide-react'

/**
 * Homepage component with hero section, about, programs, and impact statistics
 */
function HomePage() {
  const impactStats = [
    { number: '25,000+', label: 'Community members served' },
    { number: '1,500+', label: 'Community activities hosted' },
    { number: '40,000+', label: 'Volunteer hours contributed' },
    { number: '100+', label: 'Community partnerships' },
  ]

  const programs = [
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: 'Career Seminars',
      description: 'Expert-led sessions on industry trends and career development strategies.'
    },
    {
      icon: <Award className="h-8 w-8 text-primary-600" />,
      title: 'Development Workshops',
      description: 'Hands-on workshops to build essential professional skills and competencies.'
    },
    {
      icon: <FileText className="h-8 w-8 text-primary-600" />,
      title: 'Job Companion Program',
      description: 'Personalized guidance and support throughout your job search journey.'
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Vancouver Career Fair 2025
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-primary-100">
              by VIVA Events
            </p>
            <p className="text-lg md:text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Connect with top employers, explore career opportunities, and advance your professional journey 
              in Greater Vancouver's most comprehensive career development event.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                View Events
              </Link>
              <Link to="/resume" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
                Submit Resume
              </Link>
              <a href="mailto:careerfairinvan@gmail.com" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About the Event
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                In today's competitive job market, networking and direct engagement with potential employers 
                are more crucial than ever. The Vancouver Career Fair creates a dynamic space where talented 
                job seekers and leading employers come together to explore mutual opportunities.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our mission is to bridge the gap between skilled individuals and diverse companies in Greater Vancouver, 
                fostering meaningful connections that drive career growth and business success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="bg-gray-50 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Programs
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive career development programs designed to empower your professional journey
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="flex justify-center mb-4">
                  {program.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {program.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our Impact
            </h2>
            <p className="text-lg text-primary-100 max-w-3xl mx-auto">
              Through our diverse range of programs, events, and volunteer opportunities, 
              we strive to empower individuals, foster connections, and support local growth.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage