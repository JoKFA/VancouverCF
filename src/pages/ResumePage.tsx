import { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, FileText, User, Mail, Phone, Sparkles, Star, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

/**
 * Enhanced resume upload page with purple accents and improved animations
 */
function ResumePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  /**
   * Handle form input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  /**
   * Handle file selection with validation
   */
  const handleFileChange = (selectedFile: File) => {
    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file')
      return
    }
    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }
    setFile(selectedFile)
    setError(null)
  }

  /**
   * Handle drag and drop
   */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  /**
   * Upload file to Supabase storage
   */
  const uploadFile = async (file: File): Promise<string> => {
    // Check if Supabase is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('dummy')) {
      throw new Error('File upload is not available. Please configure Supabase.')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `resumes/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath)

    return data.publicUrl
  }

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.phone || !file) {
        throw new Error('Please fill in all fields and select a file')
      }

      // Check if Supabase is properly configured
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('dummy')) {
        throw new Error('Resume submission is not available. Please configure Supabase.')
      }

      // Upload file
      const fileUrl = await uploadFile(file)

      // Save resume data to database
      const { error: dbError } = await supabase
        .from('resumes')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            file_url: fileUrl
          }
        ])

      if (dbError) throw dbError

      setSuccess(true)
      setFormData({ name: '', email: '', phone: '' })
      setFile(null)

    } catch (error: any) {
      setError(error.message || 'Failed to submit resume')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-orange-200/20 to-purple-200/20 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-xl" />
      
      <div className="section-padding relative">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="card p-12 relative overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full blur-xl" />
                  
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
                    >
                      <CheckCircle size={48} className="text-green-500" />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Resume Submitted Successfully!
                      </h1>
                      <div className="flex items-center justify-center mb-6">
                        <Heart className="w-5 h-5 text-red-500 mr-2" />
                        <p className="text-lg text-gray-600">
                          Thank you for trusting us with your career journey
                        </p>
                      </div>
                      <p className="text-gray-600 mb-8 leading-relaxed">
                        We'll review your resume carefully and get back to you if there are suitable opportunities. 
                        Keep an eye on your inbox!
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSuccess(false)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Submit Another Resume
                      </motion.button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Enhanced Header */}
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                      className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full text-purple-600 font-medium mb-6 shadow-lg border border-purple-100"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Career Opportunities Await
                    </motion.div>
                    
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <FileText size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                      Submit Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Resume</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                      Take the first step towards your dream career. Upload your resume and let us connect you 
                      with amazing opportunities in Vancouver.
                    </p>
                  </motion.div>
                </div>

                {/* Enhanced Form */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="card p-8 relative overflow-hidden"
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-blue-100/50 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-orange-100/30 to-purple-100/30 rounded-full blur-xl" />
                  
                  <form onSubmit={handleSubmit} className="space-y-8 relative">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Personal Information
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium hover:border-purple-300"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium hover:border-purple-300"
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </motion.div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 font-medium hover:border-purple-300"
                            placeholder="Enter your email address"
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Enhanced File Upload */}
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-purple-100 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <label className="text-sm font-semibold text-gray-700">
                          Resume (PDF only, max 5MB) *
                        </label>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
                          dragActive 
                            ? 'border-purple-500 bg-purple-50 scale-105' 
                            : file 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50/50'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                          required
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        
                        <div className="p-12 text-center">
                          <motion.div
                            animate={dragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg ${
                              file ? 'bg-gradient-to-br from-green-100 to-emerald-100' : 'bg-gradient-to-br from-purple-100 to-blue-100'
                            }`}
                          >
                            {file ? (
                              <CheckCircle className="w-8 h-8 text-green-500" />
                            ) : (
                              <Upload className="w-8 h-8 text-purple-600" />
                            )}
                          </motion.div>
                          
                          <p className="text-lg font-semibold text-gray-900 mb-2">
                            {file ? (
                              <span className="flex items-center justify-center">
                                <Star className="w-5 h-5 text-green-500 mr-2" />
                                {file.name}
                              </span>
                            ) : (
                              'Drop your resume here or click to browse'
                            )}
                          </p>
                          <p className="text-gray-500">
                            PDF files only, up to 5MB
                          </p>
                        </div>
                      </motion.div>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                        >
                          <AlertCircle size={20} className="text-red-500 mr-3 flex-shrink-0" />
                          <p className="text-red-700 font-medium">{error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Enhanced Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-lg relative overflow-hidden"
                    >
                      {loading && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-blue-600/50" />
                      )}
                      <div className="relative flex items-center justify-center">
                        {loading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                            />
                            Submitting Your Resume...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Submit Resume
                          </>
                        )}
                      </div>
                    </motion.button>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default ResumePage