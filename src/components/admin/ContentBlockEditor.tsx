import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  FileText, 
  Image, 
  BarChart3, 
  MessageSquare, 
  CheckSquare, 
  Users,
  Upload
} from 'lucide-react'
import { ContentBlock, ContentBlockType } from '../../lib/supabase'

interface ContentBlockEditorProps {
  block: ContentBlock
  onSave: (updatedBlock: ContentBlock) => void
  onCancel: () => void
  onDelete: () => void
}

export function ContentBlockEditor({ block, onSave, onCancel, onDelete }: ContentBlockEditorProps) {
  const [editedBlock, setEditedBlock] = useState<ContentBlock>({ ...block })

  const handleSave = () => {
    onSave(editedBlock)
  }

  const updateBlockContent = (newContent: any) => {
    setEditedBlock({ ...editedBlock, content: newContent })
  }

  const getBlockIcon = (type: ContentBlockType) => {
    const iconMap = {
      text: FileText,
      image_gallery: Image,
      statistics: BarChart3,
      quote: MessageSquare,
      highlights: CheckSquare,
      attendee_feedback: Users
    }
    const IconComponent = iconMap[type]
    return <IconComponent size={20} className="text-purple-600" />
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {getBlockIcon(editedBlock.type)}
            <h2 className="text-2xl font-bold text-gray-900 capitalize">
              Edit {editedBlock.type.replace('_', ' ')} Block
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onDelete}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={onCancel}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {editedBlock.type === 'text' && (
            <TextBlockEditor content={editedBlock.content} onChange={updateBlockContent} />
          )}
          {editedBlock.type === 'statistics' && (
            <StatisticsBlockEditor content={editedBlock.content} onChange={updateBlockContent} />
          )}
          {editedBlock.type === 'highlights' && (
            <HighlightsBlockEditor content={editedBlock.content} onChange={updateBlockContent} />
          )}
          {editedBlock.type === 'quote' && (
            <QuoteBlockEditor content={editedBlock.content} onChange={updateBlockContent} />
          )}
          {editedBlock.type === 'attendee_feedback' && (
            <FeedbackBlockEditor content={editedBlock.content} onChange={updateBlockContent} />
          )}
          {editedBlock.type === 'image_gallery' && (
            <ImageGalleryEditor content={editedBlock.content} onChange={updateBlockContent} />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// Individual block editors
function TextBlockEditor({ content, onChange }: { content: any, onChange: (content: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Text Content</label>
        <textarea
          value={content.text || ''}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          rows={10}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          placeholder="Enter your text content here..."
        />
        <p className="text-sm text-gray-500 mt-2">You can use basic HTML tags like &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, etc.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
        <select
          value={content.style || 'normal'}
          onChange={(e) => onChange({ ...content, style: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="normal">Normal</option>
          <option value="callout">Callout (highlighted box)</option>
          <option value="centered">Centered</option>
        </select>
      </div>
    </div>
  )
}

function StatisticsBlockEditor({ content, onChange }: { content: any, onChange: (content: any) => void }) {
  const stats = content.stats || []

  const addStat = () => {
    const newStats = [...stats, { label: '', value: '', icon: 'users' }]
    onChange({ ...content, stats: newStats })
  }

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...stats]
    newStats[index] = { ...newStats[index], [field]: value }
    onChange({ ...content, stats: newStats })
  }

  const removeStat = (index: number) => {
    const newStats = stats.filter((_: any, i: number) => i !== index)
    onChange({ ...content, stats: newStats })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
        <button
          onClick={addStat}
          className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={16} className="mr-1" />
          Add Stat
        </button>
      </div>

      {stats.map((stat: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Statistic #{index + 1}</span>
            <button
              onClick={() => removeStat(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Label</label>
              <input
                type="text"
                value={stat.label || ''}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Attendees"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Value</label>
              <input
                type="text"
                value={stat.value || ''}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., 250"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Icon</label>
              <select
                value={stat.icon || 'users'}
                onChange={(e) => updateStat(index, 'icon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="users">Users</option>
                <option value="trending">Trending</option>
                <option value="star">Star</option>
                <option value="award">Award</option>
              </select>
            </div>
          </div>
        </div>
      ))}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Layout</label>
          <select
            value={content.layout || 'grid'}
            onChange={(e) => onChange({ ...content, layout: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="grid">Grid</option>
            <option value="cards">Cards</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
          <select
            value={content.style || 'gradient'}
            onChange={(e) => onChange({ ...content, style: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="minimal">Minimal</option>
            <option value="colorful">Colorful</option>
            <option value="gradient">Gradient</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function HighlightsBlockEditor({ content, onChange }: { content: any, onChange: (content: any) => void }) {
  const items = content.items || []

  const addItem = () => {
    const newItems = [...items, { text: '' }]
    onChange({ ...content, items: newItems })
  }

  const updateItem = (index: number, text: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], text }
    onChange({ ...content, items: newItems })
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index)
    onChange({ ...content, items: newItems })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Key Highlights</h3>
        <button
          onClick={addItem}
          className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={16} className="mr-1" />
          Add Highlight
        </button>
      </div>

      {items.map((item: any, index: number) => (
        <div key={index} className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
          <input
            type="text"
            value={item.text || ''}
            onChange={(e) => updateItem(index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Enter highlight text..."
          />
          <button
            onClick={() => removeItem(index)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Display Style</label>
        <select
          value={content.style || 'checklist'}
          onChange={(e) => onChange({ ...content, style: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="checklist">Checklist (with checkmarks)</option>
          <option value="bullets">Bullet points</option>
          <option value="numbered">Numbered list</option>
        </select>
      </div>
    </div>
  )
}

function QuoteBlockEditor({ content, onChange }: { content: any, onChange: (content: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Quote Text</label>
        <textarea
          value={content.quote || ''}
          onChange={(e) => onChange({ ...content, quote: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
          placeholder="Enter the quote text..."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
          <input
            type="text"
            value={content.author || ''}
            onChange={(e) => onChange({ ...content, author: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Author name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Author Title (optional)</label>
          <input
            type="text"
            value={content.author_title || ''}
            onChange={(e) => onChange({ ...content, author_title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Job title or role"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Display Style</label>
        <select
          value={content.style || 'testimonial'}
          onChange={(e) => onChange({ ...content, style: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        >
          <option value="simple">Simple (border line)</option>
          <option value="card">Card style</option>
          <option value="testimonial">Testimonial (highlighted)</option>
        </select>
      </div>
    </div>
  )
}

function FeedbackBlockEditor({ content, onChange }: { content: any, onChange: (content: any) => void }) {
  const feedback = content.feedback || []

  const addFeedback = () => {
    const newFeedback = [...feedback, { comment: '', author: '', rating: 5 }]
    onChange({ ...content, feedback: newFeedback })
  }

  const updateFeedback = (index: number, field: string, value: any) => {
    const newFeedback = [...feedback]
    newFeedback[index] = { ...newFeedback[index], [field]: value }
    onChange({ ...content, feedback: newFeedback })
  }

  const removeFeedback = (index: number) => {
    const newFeedback = feedback.filter((_: any, i: number) => i !== index)
    onChange({ ...content, feedback: newFeedback })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Attendee Feedback</h3>
        <button
          onClick={addFeedback}
          className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={16} className="mr-1" />
          Add Feedback
        </button>
      </div>

      {feedback.map((item: any, index: number) => (
        <div key={index} className="p-4 border border-gray-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Feedback #{index + 1}</span>
            <button
              onClick={() => removeFeedback(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Comment</label>
            <textarea
              value={item.comment || ''}
              onChange={(e) => updateFeedback(index, 'comment', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Feedback comment..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Author</label>
              <input
                type="text"
                value={item.author || ''}
                onChange={(e) => updateFeedback(index, 'author', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Author name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Role (optional)</label>
              <input
                type="text"
                value={item.role || ''}
                onChange={(e) => updateFeedback(index, 'role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Job title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={item.rating || 5}
                onChange={(e) => updateFeedback(index, 'rating', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ImageGalleryEditor({ }: { content: any, onChange: (content: any) => void }) {
  return (
    <div className="space-y-4">
      <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-xl">
        <Upload size={32} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Image gallery editing coming soon!</p>
        <p className="text-sm text-gray-500 mt-2">For now, you can manage images through file uploads in the admin interface.</p>
      </div>
    </div>
  )
}