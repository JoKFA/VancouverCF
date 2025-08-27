import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Image, BarChart3, MessageSquare, CheckSquare, Users, Plus } from 'lucide-react'
import { ContentBlock, ContentBlockType, EventRecap } from '../../lib/supabase'

interface AddContentBlocksPanelProps {
  recap: EventRecap
  onAddBlock: (blockType: ContentBlockType) => void
  onEditBlock: (block: ContentBlock) => void
}

interface BlockTypeConfig {
  type: ContentBlockType
  name: string
  description: string
  icon: React.ReactNode
}

const blockTypeConfigs: BlockTypeConfig[] = [
  {
    type: 'text',
    name: 'Text Content',
    description: 'Add rich text blocks',
    icon: <FileText size={20} />
  },
  {
    type: 'image_gallery',
    name: 'Image Gallery',
    description: 'Photo collections with captions',
    icon: <Image size={20} />
  },
  {
    type: 'statistics',
    name: 'Statistics',
    description: 'Key metrics and numbers',
    icon: <BarChart3 size={20} />
  },
  {
    type: 'quote',
    name: 'Quote',
    description: 'Featured quotes or testimonials',
    icon: <MessageSquare size={20} />
  },
  {
    type: 'highlights',
    name: 'Highlights',
    description: 'Key takeaways and points',
    icon: <CheckSquare size={20} />
  },
  {
    type: 'attendee_feedback',
    name: 'Attendee Feedback',
    description: 'Participant comments and reviews',
    icon: <Users size={20} />
  }
]

function AddContentBlocksPanel({ recap, onAddBlock, onEditBlock }: AddContentBlocksPanelProps) {
  const getMissingBlockTypes = (): ContentBlockType[] => {
    const existingTypes = recap.content_blocks?.map(block => block.type) || []
    return blockTypeConfigs
      .map(config => config.type)
      .filter(type => !existingTypes.includes(type))
  }

  const getExistingBlocksByType = (): Map<ContentBlockType, ContentBlock[]> => {
    const blocksByType = new Map<ContentBlockType, ContentBlock[]>()
    
    recap.content_blocks?.forEach(block => {
      const existing = blocksByType.get(block.type) || []
      blocksByType.set(block.type, [...existing, block])
    })
    
    return blocksByType
  }

  const getBlockStats = (type: ContentBlockType, blocks: ContentBlock[]): string => {
    if (blocks.length === 0) return ''
    
    switch (type) {
      case 'statistics':
        const totalStats = blocks.reduce((sum, block) => 
          sum + (block.content.statistics?.length || 0), 0)
        return `${totalStats} stat${totalStats !== 1 ? 's' : ''} configured`
      
      case 'image_gallery':
        const totalImages = blocks.reduce((sum, block) => 
          sum + (block.content.images?.length || 0), 0)
        return `${totalImages} image${totalImages !== 1 ? 's' : ''} added`
      
      case 'highlights':
        const totalHighlights = blocks.reduce((sum, block) => 
          sum + (block.content.highlights?.length || 0), 0)
        return `${totalHighlights} highlight${totalHighlights !== 1 ? 's' : ''} added`
      
      case 'attendee_feedback':
        const totalFeedback = blocks.reduce((sum, block) => 
          sum + (block.content.feedback_items?.length || 0), 0)
        return `${totalFeedback} feedback item${totalFeedback !== 1 ? 's' : ''}`
      
      default:
        return `${blocks.length} block${blocks.length !== 1 ? 's' : ''} configured`
    }
  }

  const missingTypes = getMissingBlockTypes()
  const existingBlocks = getExistingBlocksByType()

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Content Blocks</h3>
        <span className="text-sm text-gray-500">
          {recap.content_blocks?.length || 0} of {blockTypeConfigs.length} block types configured
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blockTypeConfigs.map((config) => {
          const existingBlocksOfType = existingBlocks.get(config.type) || []
          const isExisting = existingBlocksOfType.length > 0
          const stats = getBlockStats(config.type, existingBlocksOfType)

          return (
            <motion.div
              key={config.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                isExisting
                  ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-md'
                  : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  isExisting 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {config.name}
                    </h4>
                    {isExisting && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {config.description}
                  </p>
                  {stats && (
                    <p className="text-xs text-purple-600 font-medium mt-1">
                      {stats}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                {isExisting ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onEditBlock(existingBlocksOfType[0])}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      ✏️ Edit
                    </motion.button>
                    {existingBlocksOfType.length < 3 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onAddBlock(config.type)}
                        className="px-3 py-2 bg-purple-100 text-purple-700 text-sm font-semibold rounded-lg hover:bg-purple-200 transition-colors"
                        title="Add another block of this type"
                      >
                        <Plus size={16} />
                      </motion.button>
                    )}
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAddBlock(config.type)}
                    className="w-full flex items-center justify-center px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Block
                  </motion.button>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {missingTypes.length > 0 && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
            </div>
            <p className="text-sm text-amber-800">
              <strong>Tip:</strong> You have {missingTypes.length} content block type{missingTypes.length !== 1 ? 's' : ''} available to add. 
              Consider adding {missingTypes.slice(0, 2).join(' and ')} to make your recap more engaging.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddContentBlocksPanel