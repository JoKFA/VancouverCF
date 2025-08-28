import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Archive, Search, Download, X, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase, Event, Resume, TeamMember, EventRecap } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { EventRecapManager } from '../components/admin/EventRecapManager'

/**
 * Admin Dashboard Component
 * Main admin interface for managing all content
 * 
 * Features:
 * - Event management (create, edit, delete, move to past)
 * - Resume review and download
 * - Team member management
 * - File uploads for event recaps and team avatars
 * 
 * Access: Only available to authenticated users when admin is enabled
 */
function AdminPage() {
  const { signOut } = useAuth()
  
  // Tab state management
  const [activeTab, setActiveTab] = useState<'events' | 'resumes' | 'team' | 'recaps'>('events')
  
  // Data state
  const [events, setEvents] = useState<Event[]>([])
  const [resumes, setResumes] = useState<Resume[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [eventRecaps, setEventRecaps] = useState<EventRecap[]>([])
  const [loading, setLoading] = useState(true)
  
  // Operation loading states
  const [savingEvent, setSavingEvent] = useState(false)
  const [savingTeamMember, setSavingTeamMember] = useState(false)
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null)
  const [deletingTeamMember, setDeletingTeamMember] = useState<string | null>(null)
  
  // Modal state for events
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  
  // Modal state for team members
  const [showTeamModal, setShowTeamModal] = useState(false)
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null)
  
  // Resume search functionality
  const [searchTerm, setSearchTerm] = useState('')
  
  // Move event to past functionality
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [movingEvent, setMovingEvent] = useState<Event | null>(null)
  const [blogFile, setBlogFile] = useState<File | null>(null)
  
  // File upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [eventImageFile, setEventImageFile] = useState<File | null>(null)

  // Load all data when component mounts
  useEffect(() => {
    fetchData()
  }, [])

  /**
   * Fetch all data from database
   * Loads events, resumes, and team members
   */
  const fetchData = async () => {
    try {
      const [eventsResponse, resumesResponse, teamResponse, recapsResponse] = await Promise.all([
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        supabase.from('resumes').select('*').order('created_at', { ascending: false }),
        supabase.from('team_members').select('*').order('order_index', { ascending: true }),
        supabase.from('event_recaps').select('*').order('created_at', { ascending: false })
      ])

      if (eventsResponse.error) throw eventsResponse.error
      if (resumesResponse.error) throw resumesResponse.error
      if (teamResponse.error) throw teamResponse.error
      if (recapsResponse.error) throw recapsResponse.error

      setEvents(eventsResponse.data || [])
      setResumes(resumesResponse.data || [])
      setTeamMembers(teamResponse.data || [])
      setEventRecaps(recapsResponse.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle event form submission (create or update)
   * Processes form data, uploads image if provided, and saves to database
   */
  const handleEventSubmit = async (formData: FormData) => {
    setSavingEvent(true)
    try {
      let imageUrl = editingEvent?.image_url || formData.get('image_url') as string || ''

      // Upload image file if provided
      if (eventImageFile) {
        const fileExt = eventImageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `event-images/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('event-images')
          .upload(filePath, eventImageFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('event-images')
          .getPublicUrl(filePath)

        imageUrl = data.publicUrl
      }

      const eventData = {
        title: formData.get('title') as string,
        date: formData.get('date') as string,
        location: formData.get('location') as string,
        description: formData.get('description') as string,
        image_url: imageUrl,
        status: formData.get('status') as 'upcoming' | 'past'
      }

      if (editingEvent) {
        // Update existing event
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id)
        if (error) throw error
      } else {
        // Create new event
        const { error } = await supabase
          .from('events')
          .insert([eventData])
        if (error) throw error
      }

      await fetchData()
      setShowEventModal(false)
      setEditingEvent(null)
      setEventImageFile(null)
      toast.success(editingEvent ? 'Event updated successfully!' : 'Event created successfully!')
    } catch (error) {
      console.error('Error saving event:', error)
      toast.error('Failed to save event. Please try again.')
    } finally {
      setSavingEvent(false)
    }
  }

  /**
   * Handle team member form submission (create or update)
   * Includes avatar file upload to storage
   */
  const handleTeamSubmit = async (formData: FormData) => {
    setSavingTeamMember(true)
    try {
      let avatarUrl = editingTeamMember?.avatar_url || ''

      // Upload avatar file if provided
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `avatars/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)

        avatarUrl = data.publicUrl
      }

      const teamData = {
        name: formData.get('name') as string,
        title: formData.get('title') as string,
        bio: formData.get('bio') as string,
        avatar_url: avatarUrl,
        order_index: parseInt(formData.get('order_index') as string) || 0
      }

      if (editingTeamMember) {
        // Update existing team member
        const { error } = await supabase
          .from('team_members')
          .update(teamData)
          .eq('id', editingTeamMember.id)
        if (error) throw error
      } else {
        // Create new team member
        const { error } = await supabase
          .from('team_members')
          .insert([teamData])
        if (error) throw error
      }

      await fetchData()
      setShowTeamModal(false)
      setEditingTeamMember(null)
      setAvatarFile(null)
      toast.success(editingTeamMember ? 'Team member updated successfully!' : 'Team member added successfully!')
    } catch (error) {
      console.error('Error saving team member:', error)
      toast.error('Failed to save team member. Please try again.')
    } finally {
      setSavingTeamMember(false)
    }
  }

  /**
   * Delete an event from the database
   * Includes confirmation dialog for safety
   */
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    setDeletingEvent(eventId)
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
      
      if (error) throw error
      await fetchData()
      toast.success('Event deleted successfully!')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event. Please try again.')
    } finally {
      setDeletingEvent(null)
    }
  }

  /**
   * Delete a team member from the database
   * Includes confirmation dialog for safety
   */
  const handleDeleteTeamMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return
    
    setDeletingTeamMember(memberId)
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId)
      
      if (error) throw error
      await fetchData()
      toast.success('Team member deleted successfully!')
    } catch (error) {
      console.error('Error deleting team member:', error)
      toast.error('Failed to delete team member. Please try again.')
    } finally {
      setDeletingTeamMember(null)
    }
  }

  /**
   * Move event from upcoming to past status
   * Uploads blog/recap file and updates event status
   */
  const handleMoveToPast = async () => {
    if (!movingEvent || !blogFile) return

    try {
      // Upload blog file to storage
      const fileExt = blogFile.name.split('.').pop()
      const fileName = `${Date.now()}-${movingEvent.id}.${fileExt}`
      const filePath = `blogs/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('blogs')
        .upload(filePath, blogFile)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('blogs')
        .getPublicUrl(filePath)

      // Update event status and add blog file URL
      const { error: updateError } = await supabase
        .from('events')
        .update({
          status: 'past',
          recap_file_url: data.publicUrl
        })
        .eq('id', movingEvent.id)

      if (updateError) throw updateError

      await fetchData()
      setShowMoveModal(false)
      setMovingEvent(null)
      setBlogFile(null)
    } catch (error) {
      console.error('Error moving event to past:', error)
      toast.error('Failed to move event to past. Please try again.')
    }
  }

  /**
   * Download resume file
   * Creates a download link and triggers download
   */
  const downloadResume = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * Filter resumes based on search term
   * Searches name, email, and phone fields
   */
  const filteredResumes = resumes.filter(resume =>
    resume.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.phone.includes(searchTerm)
  )

  /**
   * Format date for display
   * Converts ISO date string to readable format
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  /**
   * Get recap information for a specific event
   */
  const getEventRecapInfo = (eventId: string) => {
    const recap = eventRecaps.find(r => r.event_id === eventId)
    return {
      hasRecap: !!recap,
      recap: recap,
      isPublished: recap?.published || false,
      contentBlocksCount: recap?.content_blocks?.length || 0,
      hasLegacyFile: false // This would be true if event has recap_file_url
    }
  }

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="section-padding">
      <div className="max-w-7xl mx-auto">
        {/* Admin header with sign out button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={signOut}
            className="btn-secondary"
          >
            Sign Out
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'events'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('recaps')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'recaps'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Event Recaps
          </button>
          <button
            onClick={() => setActiveTab('resumes')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'resumes'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Resumes
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'team'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Team
          </button>
        </div>

        {/* Events management tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Events & Recaps Overview</h2>
              <button
                onClick={() => setShowEventModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add Event
              </button>
            </div>

            {/* Quick Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Total Events</p>
                    <p className="text-3xl font-bold text-purple-900">{events.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    📅
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Published Recaps</p>
                    <p className="text-3xl font-bold text-green-900">
                      {eventRecaps.filter(r => r.published).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    ✅
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Draft Recaps</p>
                    <p className="text-3xl font-bold text-amber-900">
                      {eventRecaps.filter(r => !r.published).length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    📝
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">No Recap</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {events.length - eventRecaps.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    📄
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {events.map((event) => {
                const recapInfo = getEventRecapInfo(event.id)
                return (
                <div key={event.id} className="card p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {formatDate(event.date)} • {event.location}
                      </p>
                      <div className="text-gray-600 mb-4 whitespace-pre-wrap">
                        {event.description}
                      </div>
                      
                      {/* Event Status and Recap Status */}
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          event.status === 'upcoming'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                        
                        {/* Recap Status Badge - Only for past events */}
                        {event.status === 'past' && (
                          recapInfo.hasRecap ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              recapInfo.isPublished
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              📝 {recapInfo.isPublished ? 'Published Recap' : 'Draft Recap'}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                              📄 No Recap
                            </span>
                          )
                        )}
                      </div>
                      
                      {/* Recap Details */}
                      {event.status === 'past' && recapInfo.hasRecap && (
                        <div className="text-sm text-gray-500 mb-2">
                          {recapInfo.contentBlocksCount} content blocks • Last updated {formatDate(recapInfo.recap!.updated_at!)}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {event.status === 'past' && (
                        <button
                          onClick={() => {
                            setActiveTab('recaps')
                            // TODO: Add way to pre-select this event in recap manager
                          }}
                          className={`p-2 transition-colors ${
                            recapInfo.hasRecap
                              ? 'text-blue-600 hover:text-blue-700'
                              : 'text-gray-600 hover:text-purple-600'
                          }`}
                          title={recapInfo.hasRecap ? 'Manage existing recap' : 'Create recap for this event'}
                        >
                          📝
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingEvent(event)
                          setShowEventModal(true)
                        }}
                        className="p-2 text-gray-600 hover:text-primary-600"
                        title="Edit event details"
                      >
                        <Edit size={18} />
                      </button>
                      {event.status === 'upcoming' && (
                        <button
                          onClick={() => {
                            setMovingEvent(event)
                            setShowMoveModal(true)
                          }}
                          className="p-2 text-gray-600 hover:text-orange-600"
                        >
                          <Archive size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        disabled={deletingEvent === event.id}
                        className={`p-2 transition-colors ${
                          deletingEvent === event.id
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:text-red-600'
                        }`}
                      >
                        {deletingEvent === event.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-red-600" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Event Recaps management tab */}
        {activeTab === 'recaps' && (
          <EventRecapManager />
        )}

        {/* Resume management tab */}
        {activeTab === 'resumes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Resume Submissions</h2>
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resumes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredResumes.map((resume) => (
                <div key={resume.id} className="card p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {resume.name}
                      </h3>
                      <p className="text-gray-600">{resume.email}</p>
                      <p className="text-gray-600">{resume.phone}</p>
                      <p className="text-sm text-gray-500">
                        Submitted: {formatDate(resume.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={() => downloadResume(resume.file_url, `${resume.name}_resume.pdf`)}
                      className="btn-primary flex items-center"
                    >
                      <Download size={18} className="mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team management tab */}
        {activeTab === 'team' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Manage Team</h2>
              <button
                onClick={() => setShowTeamModal(true)}
                className="btn-primary flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add Team Member
              </button>
            </div>

            <div className="grid gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-16 h-16 mr-4">
                        {member.avatar_url ? (
                          <img
                            src={member.avatar_url}
                            alt={member.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                            <User size={24} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {member.name}
                        </h3>
                        <p className="text-purple-600 font-medium">{member.title}</p>
                        <p className="text-gray-600 mt-1">{member.bio}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Order: {member.order_index}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingTeamMember(member)
                          setShowTeamModal(true)
                        }}
                        className="p-2 text-gray-600 hover:text-primary-600"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTeamMember(member.id)}
                        disabled={deletingTeamMember === member.id}
                        className={`p-2 transition-colors ${
                          deletingTeamMember === member.id
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-600 hover:text-red-600'
                        }`}
                      >
                        {deletingTeamMember === member.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-red-600" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Event creation/editing modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h3>
                <button
                  onClick={() => {
                    setShowEventModal(false)
                    setEditingEvent(null)
                    setEventImageFile(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault()
                handleEventSubmit(new FormData(e.currentTarget))
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingEvent?.title || ''}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      defaultValue={editingEvent?.date || ''}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={editingEvent?.location || ''}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      rows={4}
                      defaultValue={editingEvent?.description || ''}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Image
                    </label>
                    <div className="space-y-4">
                      {/* File upload option */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Upload Image File
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setEventImageFile(e.target.files?.[0] || null)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      {/* URL option as fallback */}
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Or enter Image URL
                        </label>
                        <input
                          type="url"
                          name="image_url"
                          defaultValue={editingEvent?.image_url || ''}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                      
                      {/* Preview current image if editing */}
                      {editingEvent?.image_url && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Current image:</p>
                          <img
                            src={editingEvent.image_url}
                            alt="Current event image"
                            className="w-32 h-24 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500">
                        Upload a new image file to replace the current image, or leave both fields empty for no image.
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      name="status"
                      defaultValue={editingEvent?.status || 'upcoming'}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventModal(false)
                      setEditingEvent(null)
                      setEventImageFile(null)
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={savingEvent}
                    className={`btn-primary flex items-center space-x-2 ${
                      savingEvent ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {savingEvent && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    )}
                    <span>{savingEvent ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Team member creation/editing modal */}
        {showTeamModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingTeamMember ? 'Edit Team Member' : 'Add New Team Member'}
                </h3>
                <button
                  onClick={() => {
                    setShowTeamModal(false)
                    setEditingTeamMember(null)
                    setAvatarFile(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault()
                handleTeamSubmit(new FormData(e.currentTarget))
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={editingTeamMember?.name || ''}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingTeamMember?.title || ''}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio *
                    </label>
                    <textarea
                      name="bio"
                      rows={4}
                      defaultValue={editingTeamMember?.bio || ''}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avatar Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    {editingTeamMember?.avatar_url && (
                      <div className="mt-2">
                        <img
                          src={editingTeamMember.avatar_url}
                          alt="Current avatar"
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      name="order_index"
                      defaultValue={editingTeamMember?.order_index || 0}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTeamModal(false)
                      setEditingTeamMember(null)
                      setAvatarFile(null)
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={savingTeamMember}
                    className={`btn-primary flex items-center space-x-2 ${
                      savingTeamMember ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {savingTeamMember && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    )}
                    <span>{savingTeamMember ? 'Saving...' : (editingTeamMember ? 'Update Team Member' : 'Create Team Member')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Move event to past modal */}
        {showMoveModal && movingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Move Event to Past
                </h3>
                <button
                  onClick={() => {
                    setShowMoveModal(false)
                    setMovingEvent(null)
                    setBlogFile(null)
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Moving "{movingEvent.title}" to past events. Please upload a blog file (Word or PDF).
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blog File (Word or PDF) *
                </label>
                <input
                  type="file"
                  accept=".docx,.pdf"
                  onChange={(e) => setBlogFile(e.target.files?.[0] || null)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowMoveModal(false)
                    setMovingEvent(null)
                    setBlogFile(null)
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMoveToPast}
                  disabled={!blogFile}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Move to Past
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage