import React, { useState } from 'react'
import { Upload, CheckCircle, AlertCircle, FileText, User, Mail, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

/**
 * Enhanced resume upload page with animations and modern design
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="section-padding">
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
                <div className="card p-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                  >
                    <CheckCircle size={48} className="text-green-500" />
                  </motion.div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Resume Submitted Successfully!
                  </h1>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Thank you for submitting your resume. We'll review it and get back to you 
                    if there are suitable opportunities.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSuccess(false)}
                    className="btn-primary"
                  >
                    Submit Another Resume
                  </motion.button>
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
                {/* Header */}
                <div className="text-center mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <FileText size={32} className="text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                      Submit Your <span className="text-gradient">Resume</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      Upload your resume to be considered for upcoming career opportunities
                    </p>
                  </motion.div>
                </div>

                {/* Form */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="card p-8"
                >
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                        <User className="w-5 h-5 mr-2 text-primary-600" />
                        Personal Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 text-gray-900 font-medium"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 text-gray-900 font-medium"
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 text-gray-900 font-medium"
                            placeholder="Enter your email address"
                          />
                        </div>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Resume (PDF only, max 5MB) *
                      </label>
                      <div
                        className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 ${
                          dragActive 
                            ? 'border-primary-500 bg-primary-50' 
                            : file 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50/50'
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
                            animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
                            transition={{ duration: 0.2 }}
                            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                              file ? 'bg-green-100' : 'bg-gray-100'
                            }`}
                          >
                            {file ? (
                              <CheckCircle className="w-8 h-8 text-green-500" />
                            ) : (
                              <Upload className="w-8 h-8 text-gray-400" />
                            )}
                          </motion.div>
                          
                          <p className="text-lg font-semibold text-gray-900 mb-2">
                            {file ? file.name : 'Drop your resume here or click to browse'}
                          </p>
                          <p className="text-gray-500">
                            PDF files only, up to 5MB
                          </p>
                        </div>
                      </div>
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

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg py-5"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                          />
                          Submitting...
                        </div>
                      ) : (
                        'Submit Resume'
                      )}
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