import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface ExpandableDescriptionProps {
  text: string
  maxLength?: number
  className?: string
}

export function ExpandableDescription({ 
  text, 
  maxLength = 200, 
  className = '' 
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // If text is short enough, just display it normally
  if (text.length <= maxLength) {
    return (
      <div className={`whitespace-pre-wrap ${className}`}>
        {text}
      </div>
    )
  }

  const truncatedText = text.slice(0, maxLength).trim() + '...'

  return (
    <div className={className}>
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : '4.5rem' }}
        transition={{ 
          duration: 0.4, 
          ease: [0.4, 0.0, 0.2, 1] // Custom easing for natural feel
        }}
        className="overflow-hidden relative"
      >
        <div className="whitespace-pre-wrap leading-relaxed">
          {isExpanded ? text : truncatedText}
        </div>
        
        {/* Fade gradient overlay when collapsed */}
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"
          />
        )}
      </motion.div>

      {/* Read More/Less Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center space-x-1 mt-3 text-purple-600 hover:text-purple-700 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-md px-2 py-1"
        aria-expanded={isExpanded}
        aria-label={isExpanded ? 'Show less description' : 'Show more description'}
      >
        <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>
    </div>
  )
}

export default ExpandableDescription