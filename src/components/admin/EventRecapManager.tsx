import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Calendar,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  FileText,
  Image,
  BarChart3,
  MessageSquare,
  CheckSquare,
  Users
} from 'lucide-react'
import { supabase, Event, EventRecap, ContentBlock, ContentBlockType } from '../../lib/supabase'
import { EventMigrationService } from '../../lib/migration'
import { ContentBlockEditor } from './ContentBlockEditor'
// Remove the AddContentBlocksPanel import - we'll inline the functionality

interface EventRecapManagerProps {
  onClose?: () => void
}

export function EventRecapManager({ onClose }: EventRecapManagerProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [recaps, setRecaps] = useState<EventRecap[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedRecap, setSelectedRecap] = useState<EventRecap | null>(null)
  const [loading, setLoading] = useState(true)
  const [migrationLoading, setMigrationLoading] = useState(false)
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
  
  // Operation loading states
  const [creatingRecap, setCreatingRecap] = useState<string | null>(null)
  const [addingBlock, setAddingBlock] = useState(false)
  const [showAddBlockMenu, setShowAddBlockMenu] = useState(false)
  const addMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadData()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddBlockMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadData = async () => {
    try {
      const [eventsResult, recapsResult] = await Promise.all([
        supabase.from('events').select('*').order('date', { ascending: false }),
        supabase.from('event_recaps').select('*').order('created_at', { ascending: false })
      ])

      if (eventsResult.data) setEvents(eventsResult.data)
      if (recapsResult.data) setRecaps(recapsResult.data)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const runMigration = async () => {
    setMigrationLoading(true)
    try {
      const migrationService = new EventMigrationService()
      const results = await migrationService.migrateAllEvents()
      
      const successful = results.filter(r => r.success).length
      toast.success(`Migration completed! Successfully migrated ${successful} events.`)
      
      await loadData()
    } catch (error) {
      console.error('Migration failed:', error)
      toast.error('Migration failed. Check console for details.')
    } finally {
      setMigrationLoading(false)
    }
  }

  const createSampleRecap = async (eventId: string) => {
    setCreatingRecap(eventId)
    try {
      const migrationService = new EventMigrationService()
      await migrationService.createSampleRecap(eventId)
      toast.success('Sample recap created successfully!')
      await loadData()
    } catch (error) {
      console.error('Error creating sample recap:', error)
      toast.error('Failed to create sample recap')
    } finally {
      setCreatingRecap(null)
    }
  }

  const deleteRecap = async (recapId: string) => {
    if (!confirm('Are you sure you want to delete this recap?')) return

    try {
      const { error } = await supabase
        .from('event_recaps')
        .delete()
        .eq('id', recapId)

      if (error) throw error
      await loadData()
      setSelectedRecap(null)
    } catch (error) {
      console.error('Error deleting recap:', error)
      toast.error('Failed to delete recap')
    }
  }

  const togglePublished = async (recap: EventRecap) => {
    try {
      const { error } = await supabase
        .from('event_recaps')
        .update({ published: !recap.published })
        .eq('id', recap.id)

      if (error) throw error
      await loadData()
    } catch (error) {
      console.error('Error updating recap:', error)
      toast.error('Failed to update recap')
    }
  }

  const getContentBlockIcon = (type: string) => {
    switch (type) {
      case 'text': return FileText
      case 'image_gallery': return Image
      case 'statistics': return BarChart3
      case 'quote': return MessageSquare
      case 'highlights': return CheckSquare
      case 'attendee_feedback': return Users
      default: return FileText
    }
  }

  const getRecapForEvent = (eventId: string) => {
    return recaps.find(recap => recap.event_id === eventId)
  }

  const handleEditBlock = (block: ContentBlock) => {
    setEditingBlock(block)
  }

  const handleSaveBlock = async (updatedBlock: ContentBlock) => {
    if (!selectedRecap) return
    
    try {
      // Update the content block in the recap
      const updatedBlocks = selectedRecap.content_blocks.map(block =>
        block.id === updatedBlock.id ? updatedBlock : block
      )

      const { error } = await supabase
        .from('event_recaps')
        .update({ content_blocks: updatedBlocks })
        .eq('id', selectedRecap.id)

      if (error) throw error

      // Update local state
      await loadData()
      setEditingBlock(null)
      
      // Update selected recap
      if (selectedEvent) {
        const updatedRecap = getRecapForEvent(selectedEvent.id)
        setSelectedRecap(updatedRecap || null)
      }
      
      toast.success('Content block updated successfully!')
    } catch (error) {
      console.error('Error updating content block:', error)
      toast.error('Failed to update content block')
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    if (!selectedRecap) return
    if (!confirm('Are you sure you want to delete this content block?')) return

    try {
      // Remove the content block from the recap
      const updatedBlocks = selectedRecap.content_blocks.filter(block => block.id !== blockId)

      const { error } = await supabase
        .from('event_recaps')
        .update({ content_blocks: updatedBlocks })
        .eq('id', selectedRecap.id)

      if (error) throw error

      // Update local state
      await loadData()
      setEditingBlock(null)
      
      // Update selected recap
      if (selectedEvent) {
        const updatedRecap = getRecapForEvent(selectedEvent.id)
        setSelectedRecap(updatedRecap || null)
      }
      
      toast.success('Content block deleted successfully!')
    } catch (error) {
      console.error('Error deleting content block:', error)
      toast.error('Failed to delete content block')
    }
  }

  const handleAddContentBlock = async (blockType: ContentBlockType) => {
    if (!selectedRecap) return
    
    setAddingBlock(true)
    try {
      // Create default content for different block types
      const getDefaultContent = (type: ContentBlockType) => {
        switch (type) {
          case 'text':
            return { text: '<p>Enter your content here...</p>' }
          case 'image_gallery':
            return { images: [] }
          case 'statistics':
            return { statistics: [] }
          case 'quote':
            return { text: '', author: '' }
          case 'highlights':
            return { highlights: [] }
          case 'attendee_feedback':
            return { feedback_items: [] }
          default:
            return {}
        }
      }

      // Generate new block
      const newBlock: ContentBlock = {
        id: crypto.randomUUID(),
        type: blockType,
        order: (selectedRecap.content_blocks?.length || 0) + 1,
        content: getDefaultContent(blockType)
      }

      // Add to existing blocks
      const updatedBlocks = [...(selectedRecap.content_blocks || []), newBlock]
      
      // Update database
      const { error } = await supabase
        .from('event_recaps')
        .update({ content_blocks: updatedBlocks })
        .eq('id', selectedRecap.id)

      if (error) throw error

      // Update local state
      const updatedRecap = { ...selectedRecap, content_blocks: updatedBlocks }
      setSelectedRecap(updatedRecap)
      setRecaps(recaps.map(r => r.id === selectedRecap.id ? updatedRecap : r))

      // Automatically open the editor for the new block
      setEditingBlock(newBlock)
      
    } catch (error) {
      console.error('Error adding content block:', error)
      toast.error('Failed to add content block')
    } finally {
      setAddingBlock(false)
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Recap Manager</h1>
          <p className="text-gray-600 mt-2">Manage structured event recaps and migrate from legacy system</p>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runMigration}
            disabled={migrationLoading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {migrationLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Plus size={16} className="mr-2" />
            )}
            Run Migration
          </motion.button>
          {onClose && (
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Past Events</h2>
            <p className="text-gray-600 text-sm">Select a past event to manage its recap</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {events.filter(event => event.status === 'past').length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Past Events</p>
                <p className="text-sm">Events need to be marked as "past" before you can create recaps for them.</p>
              </div>
            ) : (
              events.filter(event => event.status === 'past').map((event) => {
              const recap = getRecapForEvent(event.id)
              return (
                <motion.div
                  key={event.id}
                  whileHover={{ backgroundColor: '#f8fafc' }}
                  onClick={() => {
                    setSelectedEvent(event)
                    setSelectedRecap(recap || null)
                  }}
                  className={`p-4 border-b border-gray-50 cursor-pointer ${
                    selectedEvent?.id === event.id ? 'bg-purple-50 border-purple-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-1 space-x-4">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'upcoming' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {event.status}
                      </span>
                      {recap && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          recap.published 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {recap.published ? 'Published' : 'Draft'}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
            )}
          </div>
        </div>

        {/* Recap Details */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedEvent ? `${selectedEvent.title} - Recap` : 'Select Event'}
              </h2>
              {selectedRecap && (
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => togglePublished(selectedRecap)}
                    className={`flex items-center px-3 py-1 rounded-lg text-sm font-medium ${
                      selectedRecap.published
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  >
                    <Eye size={14} className="mr-1" />
                    {selectedRecap.published ? 'Published' : 'Draft'}
                  </motion.button>
                  <button
                    onClick={() => deleteRecap(selectedRecap.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {selectedEvent ? (
              selectedRecap ? (
                /* Show Recap Details */
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{selectedRecap.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{selectedRecap.summary}</p>
                  </div>

                  {/* Content Blocks */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Content Blocks ({selectedRecap.content_blocks?.length || 0})</h4>
                    <div className="space-y-2">
                      {selectedRecap.content_blocks?.map((block: ContentBlock, index: number) => {
                        const IconComponent = getContentBlockIcon(block.type)
                        return (
                          <motion.div
                            key={block.id}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group"
                            onClick={() => handleEditBlock(block)}
                          >
                            <IconComponent size={16} className="text-purple-600 mr-3" />
                            <div className="flex-1">
                              <span className="font-medium text-sm capitalize">{block.type.replace('_', ' ')}</span>
                              <span className="text-gray-500 text-xs ml-2">#{index + 1}</span>
                            </div>
                            <Edit size={14} className="text-gray-400 group-hover:text-purple-600 transition-colors" />
                          </motion.div>
                        )
                      })}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Click on any block to edit its content</p>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Add Content Block Button */}
                    <div className="relative" ref={addMenuRef}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddBlockMenu(!showAddBlockMenu)}
                        disabled={addingBlock}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                          addingBlock
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                        } text-white`}
                      >
                        {addingBlock ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus size={16} className="mr-2" />
                            Add Content Block
                          </>
                        )}
                      </motion.button>

                      {/* Dropdown Menu */}
                      {showAddBlockMenu && !addingBlock && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
                        >
                          <div className="p-3 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Select Content Type</h3>
                          </div>
                          <div className="p-2 space-y-1">
                            {[
                              { type: 'text' as ContentBlockType, name: 'Text Content', icon: '📝', desc: 'Rich text blocks' },
                              { type: 'image_gallery' as ContentBlockType, name: 'Image Gallery', icon: '🖼️', desc: 'Photo collections' },
                              { type: 'statistics' as ContentBlockType, name: 'Statistics', icon: '📊', desc: 'Key metrics' },
                              { type: 'quote' as ContentBlockType, name: 'Quote', icon: '💬', desc: 'Testimonials' },
                              { type: 'highlights' as ContentBlockType, name: 'Highlights', icon: '✨', desc: 'Key takeaways' },
                              { type: 'attendee_feedback' as ContentBlockType, name: 'Feedback', icon: '👥', desc: 'Participant reviews' }
                            ].map((blockType) => (
                              <motion.button
                                key={blockType.type}
                                whileHover={{ backgroundColor: '#f8fafc' }}
                                onClick={() => {
                                  handleAddContentBlock(blockType.type)
                                  setShowAddBlockMenu(false)
                                }}
                                className="w-full flex items-start p-3 text-left rounded-lg transition-colors"
                              >
                                <span className="text-xl mr-3 mt-0.5">{blockType.icon}</span>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{blockType.name}</div>
                                  <div className="text-sm text-gray-500">{blockType.desc}</div>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(`/events/${selectedEvent.id}`, '_blank')}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      <Eye size={16} className="mr-2" />
                      Preview
                    </motion.button>
                  </div>
                </div>
              ) : (
                /* No Recap - Show Creation Options */
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recap Available</h3>
                  <p className="text-gray-600 mb-6">Create a structured recap for this event</p>
                  
                  <div className="space-y-3">
                    <motion.button
                      whileHover={creatingRecap !== selectedEvent.id ? { scale: 1.05 } : {}}
                      whileTap={creatingRecap !== selectedEvent.id ? { scale: 0.95 } : {}}
                      onClick={() => createSampleRecap(selectedEvent.id)}
                      disabled={creatingRecap === selectedEvent.id}
                      className={`flex items-center justify-center w-full px-4 py-3 rounded-lg transition-colors ${
                        creatingRecap === selectedEvent.id
                          ? 'bg-purple-400 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700'
                      } text-white`}
                    >
                      {creatingRecap === selectedEvent.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Creating Recap...
                        </>
                      ) : (
                        <>
                          <Plus size={16} className="mr-2" />
                          Create Sample Recap
                        </>
                      )}
                    </motion.button>
                    
                    {selectedEvent.recap_file_url && (
                      <div className="text-sm text-gray-500">
                        <p className="mb-2">Legacy recap file detected:</p>
                        <a 
                          href={selectedEvent.recap_file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 underline"
                        >
                          View Original File
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )
            ) : (
              /* No Event Selected */
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Event</h3>
                <p className="text-gray-600">Choose an event from the list to manage its recap</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{events.filter(e => e.status === 'past').length}</div>
              <div className="text-gray-600 text-sm">Past Events</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <FileText size={24} className="text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{recaps.length}</div>
              <div className="text-gray-600 text-sm">Structured Recaps</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
              <Eye size={24} className="text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{recaps.filter(r => r.published).length}</div>
              <div className="text-gray-600 text-sm">Published</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
              <Edit size={24} className="text-yellow-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{recaps.filter(r => !r.published).length}</div>
              <div className="text-gray-600 text-sm">Drafts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Block Editor Modal */}
      {editingBlock && (
        <ContentBlockEditor
          block={editingBlock}
          onSave={handleSaveBlock}
          onCancel={() => setEditingBlock(null)}
          onDelete={() => handleDeleteBlock(editingBlock.id)}
        />
      )}
    </div>
  )
}