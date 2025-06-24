import React from 'react'
import { Users, Calendar, Award, Globe } from 'lucide-react'

/**
 * About page with information about VIVA organization
 */
function AboutPage() {
  const highlights = [
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: 'Community Engagement',
      description: 'Fostering connections and self-development among young generation and community members'
    },
    {
      icon: <Calendar className="h-8 w-8 text-primary-600" />,
      title: 'Established 2018',
      description: 'Over 6 years of dedicated service to the Greater Vancouver community'
    },
    {
      icon: <Award className="h-8 w-8 text-primary-600" />,
      title: 'Positive Impact',
      description: 'Initiatives aimed at spreading positivity and fostering an inclusive community'
    },
    {
      icon: <Globe className="h-8 w-8 text-primary-600" />,
      title: 'Multiculturalism',
      description: 'Encouraging appreciation and understanding of diverse cultures'
    }
  ]

  const achievements = [
    { number: '30,000+', label: 'Community members served and helped' },
    { number: '1,500+', label: 'Events hosted or participated in since 2018' },
    { number: '40,000+', label: 'Volunteer hours contributed to the community' },
    { number: '100+', label: 'Strong partnerships with local organizations' }
  ]

  const focusAreas = [
    {
      title: 'Community Service',
      description: 'Inspiring young people, new immigrants, and citizens to participate in meaningful community service activities'
    },
    {
      title: 'Self-Development',
      description: 'Providing opportunities for young people and community members to discover and nurture their talents and self-worth'
    },
    {
      title: 'Cultural Appreciation',
      description: 'Promoting multiculturalism and encouraging appreciation of diverse cultures'
    },
    {
      title: 'Local Partnerships',
      description: 'Maintaining strong relationships with local communities and organizations to foster collaboration and support'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About VIVA
          </h1>
          <p className="text-xl text-primary-100 max-w-3xl mx-auto">
            A registered non-profit organization dedicated to community engagement 
            and empowering the next generation in Greater Vancouver, BC
          </p>
        </div>
      </section>

      {/* Organization Overview */}
      <section className="bg-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                VIVA is a registered non-profit organization based in Greater Vancouver area, BC, Canada. 
                Established in June 2018, we focus on community engagement and self-development among 
                young generation and community members.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Through our diverse programs and initiatives, we strive to create positive social impact 
                by fostering an inclusive community where everyone can thrive and contribute meaningfully 
                to society.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className="flex justify-center mb-4">
                    {highlight.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Our Achievements
            </h2>
            <p className="text-lg text-primary-100 max-w-2xl mx-auto">
              Since our establishment, we've made significant impact in the Greater Vancouver community
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {achievement.number}
                </div>
                <div className="text-primary-100">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="bg-gray-50 section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Focus Areas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We concentrate our efforts on key areas that drive meaningful community impact
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {focusAreas.map((area, index) => (
              <div key={index} className="card p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {area.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Join Our Community
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Be part of our mission to create positive change in Greater Vancouver. 
            Whether you're looking to volunteer, participate in events, or partner with us, 
            we welcome you to join our growing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/events" 
              className="btn-primary"
            >
              View Our Events
            </a>
            <a 
              href="mailto:careerfairinvan@gmail.com" 
              className="btn-secondary"
            >
              Get Involved
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage