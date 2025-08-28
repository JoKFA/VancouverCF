import { motion } from 'framer-motion'
import { 
  ContentBlock, 
  TextBlock, 
  ImageGalleryBlock, 
  StatisticsBlock, 
  QuoteBlock, 
  HighlightsBlock, 
  AttendeeFeedbackBlock 
} from '../../lib/supabase'
import { 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Award, 
  Star,
  Quote,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'

interface ContentBlockRendererProps {
  blocks: ContentBlock[]
}

export function ContentBlockRenderer({ blocks }: ContentBlockRendererProps) {
  return (
    <div className="space-y-12">
      {blocks
        .sort((a, b) => a.order - b.order)
        .map((block, index) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <ContentBlockComponent block={block} />
          </motion.div>
        ))}
    </div>
  )
}

function ContentBlockComponent({ block }: { block: ContentBlock }) {
  // Safety check for malformed content blocks
  if (!block || !block.type || !block.content) {
    console.warn('Malformed content block:', block)
    return null
  }

  // Check if content is empty and should be hidden
  const isEmpty = isContentBlockEmpty(block)
  if (isEmpty) {
    return null
  }

  switch (block.type) {
    case 'text':
      return <TextBlockComponent block={block as TextBlock} />
    case 'image_gallery':
      return <ImageGalleryComponent block={block as ImageGalleryBlock} />
    case 'statistics':
      return <StatisticsComponent block={block as StatisticsBlock} />
    case 'quote':
      return <QuoteComponent block={block as QuoteBlock} />
    case 'highlights':
      return <HighlightsComponent block={block as HighlightsBlock} />
    case 'attendee_feedback':
      return <AttendeeFeedbackComponent block={block as AttendeeFeedbackBlock} />
    default:
      console.warn('Unknown content block type:', block.type)
      return null
  }
}

// Helper function to check if a content block is empty
function isContentBlockEmpty(block: ContentBlock): boolean {
  switch (block.type) {
    case 'text':
      const textContent = block.content.text?.trim() || ''
      return !textContent || textContent === '<p></p>' || textContent === '<p><br></p>'
    
    case 'image_gallery':
      return !block.content.images || block.content.images.length === 0
    
    case 'statistics':
      return !block.content.stats || block.content.stats.length === 0
    
    case 'quote':
      return !block.content.quote?.trim()
    
    case 'highlights':
      return !block.content.items || block.content.items.length === 0 || 
             block.content.items.every((item: any) => !item.text?.trim())
    
    case 'attendee_feedback':
      return !block.content.feedback || block.content.feedback.length === 0 ||
             block.content.feedback.every((item: any) => !item.comment?.trim())
    
    default:
      return false
  }
}

function TextBlockComponent({ block }: { block: TextBlock }) {
  const { text, style = 'normal' } = block.content

  const styleClasses = {
    normal: 'prose prose-lg max-w-none text-gray-700',
    callout: 'bg-gradient-to-r from-purple-50 to-blue-50 p-8 rounded-2xl border border-purple-100 prose prose-lg max-w-none',
    centered: 'text-center prose prose-lg max-w-none text-gray-700'
  }

  return (
    <div className={styleClasses[style]}>
      <div dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  )
}

function ImageGalleryComponent({ block }: { block: ImageGalleryBlock }) {
  const { images, layout, show_captions } = block.content
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  if (layout === 'carousel') {
    return <ImageCarousel images={images} showCaptions={show_captions} />
  }

  const gridClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    masonry: 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6'
  }

  return (
    <div className="space-y-6">
      <div className={gridClasses[layout] || gridClasses.grid}>
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image.url}
              alt={image.alt_text}
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {show_captions && image.caption && (
              <div className="p-4 bg-white">
                <p className="text-gray-700 text-sm">{image.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].alt_text}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ×
            </button>
            {selectedImage > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedImage(selectedImage - 1) }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              >
                <ChevronLeft size={32} />
              </button>
            )}
            {selectedImage < images.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedImage(selectedImage + 1) }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              >
                <ChevronRight size={32} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ImageCarousel({ images, showCaptions }: { images: Array<{url: string, caption?: string, alt_text: string}>, showCaptions: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl">
      <div 
        className="flex transition-transform duration-300"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0 relative">
            <img
              src={image.url}
              alt={image.alt_text}
              className="w-full h-96 object-cover"
            />
            {showCaptions && image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white text-lg">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white disabled:opacity-50"
        disabled={currentIndex === 0}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={() => setCurrentIndex(Math.min(images.length - 1, currentIndex + 1))}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 text-white disabled:opacity-50"
        disabled={currentIndex === images.length - 1}
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function StatisticsComponent({ block }: { block: StatisticsBlock }) {
  const { stats, layout, style } = block.content

  const getIconComponent = (iconName?: string) => {
    const iconMap = {
      users: Users,
      trending: TrendingUp,
      award: Award,
      star: Star
    }
    const IconComponent = iconName ? iconMap[iconName as keyof typeof iconMap] : Users
    return IconComponent || Users
  }

  const layoutClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
    cards: 'grid grid-cols-1 md:grid-cols-2 gap-8',
    horizontal: 'flex flex-wrap justify-center gap-8'
  }

  const getStatCardStyle = (statStyle: string) => {
    switch (statStyle) {
      case 'colorful':
        return 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
      case 'gradient':
        return 'bg-gradient-to-br from-purple-50 via-blue-50 to-orange-50 border border-purple-100'
      default:
        return 'bg-white border border-gray-200'
    }
  }

  return (
    <div className={layoutClasses[layout]}>
      {stats.map((stat, index) => {
        const IconComponent = getIconComponent(stat.icon)
        return (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            className={`p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
              getStatCardStyle(style)
            } ${stat.highlight ? 'ring-2 ring-purple-400 ring-offset-2' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                style === 'colorful' ? 'bg-white/20' : 'bg-gradient-to-br from-purple-100 to-blue-100'
              }`}>
                <IconComponent size={24} className={
                  style === 'colorful' ? 'text-white' : 'text-purple-600'
                } />
              </div>
            </div>
            <div className="text-3xl font-bold mb-2">
              {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
            </div>
            <div className={`text-sm font-medium ${
              style === 'colorful' ? 'text-white/90' : 'text-gray-600'
            }`}>
              {stat.label}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function QuoteComponent({ block }: { block: QuoteBlock }) {
  const { quote, author, author_title, author_image, style } = block.content

  const styleVariants = {
    simple: 'border-l-4 border-purple-500 pl-6 py-4',
    card: 'bg-white p-8 rounded-2xl shadow-lg border border-gray-100',
    testimonial: 'bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl relative overflow-hidden'
  }

  return (
    <div className={styleVariants[style]}>
      {style === 'testimonial' && (
        <div className="absolute top-4 left-6 text-6xl text-purple-200 font-serif">
          <Quote size={48} />
        </div>
      )}
      <div className={style === 'testimonial' ? 'relative z-10' : ''}>
        <blockquote className="text-xl text-gray-700 mb-6 leading-relaxed italic">
          "{quote}"
        </blockquote>
        <div className="flex items-center space-x-4">
          {author_image && (
            <img
              src={author_image}
              alt={author}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
          <div>
            <div className="font-semibold text-gray-900">{author}</div>
            {author_title && (
              <div className="text-gray-600 text-sm">{author_title}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function HighlightsComponent({ block }: { block: HighlightsBlock }) {
  const { items, style } = block.content

  const getIcon = (itemStyle: string, index: number) => {
    switch (itemStyle) {
      case 'checklist':
        return <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
      case 'numbered':
        return (
          <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
            {index + 1}
          </div>
        )
      default:
        return <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0 mt-3" />
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Highlights</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-start space-x-3"
          >
            {getIcon(style, index)}
            <span className="text-gray-700 leading-relaxed">{item.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function AttendeeFeedbackComponent({ block }: { block: AttendeeFeedbackBlock }) {
  const { feedback, display_style } = block.content

  const renderStars = (rating?: number) => {
    if (!rating) return null
    return (
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
          />
        ))}
      </div>
    )
  }

  if (display_style === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedback.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
          >
            {item.rating && (
              <div className="mb-3">{renderStars(item.rating)}</div>
            )}
            <p className="text-gray-700 mb-4 italic">"{item.comment}"</p>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">{item.author}</div>
                {item.role && (
                  <div className="text-sm text-gray-600">{item.role}</div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Attendees Said</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {feedback.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center"
          >
            <p className="text-gray-700 mb-3 italic">"{item.comment}"</p>
            <div className="font-semibold text-gray-900">{item.author}</div>
            {item.role && (
              <div className="text-sm text-gray-600">{item.role}</div>
            )}
            {item.rating && (
              <div className="mt-2 flex justify-center">{renderStars(item.rating)}</div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}