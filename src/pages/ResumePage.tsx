import React, { useState } from 'react'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

/**
 * Resume upload page with form validation and file handling
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
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
      
      // Reset file input
      const fileInput = document.getElementById('resume-file') as HTMLInputElement
      if (fileInput) fileInput.value = ''

    } catch (error: any) {
      setError(error.message || 'Failed to submit resume')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="section-padding">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle size={64} className="mx-auto text-green-500 mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Resume Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for submitting your resume. We'll review it and get back to you 
            if there are suitable opportunities.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="btn-primary"
          >
            Submit Another Resume
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="section-padding">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Submit Your Resume
          </h1>
          <p className="text-lg text-gray-600">
            Upload your resume to be considered for upcoming career opportunities
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Enter your email address"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="Enter your phone number"
              />
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="resume-file" className="block text-sm font-medium text-gray-700 mb-2">
                Resume (PDF only, max 5MB) *
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="resume-file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
                <label
                  htmlFor="resume-file"
                  className="w-full flex items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="text-center">
                    <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">
                      {file ? file.name : 'Click to upload your resume'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PDF files only, up to 5MB
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle size={20} className="text-red-500 mr-3" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Resume'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResumePage