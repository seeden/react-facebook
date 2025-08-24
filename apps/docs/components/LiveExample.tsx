'use client'

import { ReactNode, useState } from 'react'
import { motion } from 'framer-motion'
import CodeBlock from './CodeBlock'
import { Eye, Code, RefreshCw } from 'lucide-react'

interface LiveExampleProps {
  title: string
  description: string
  code: string
  controls?: ReactNode
  children: ReactNode
  error?: string
}

export default function LiveExample({ 
  title, 
  description, 
  code, 
  controls, 
  children, 
  error 
}: LiveExampleProps) {
  const [key, setKey] = useState(0)

  const refresh = () => {
    setKey(prev => prev + 1)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <button
            onClick={refresh}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Refresh component"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Controls */}
        {controls && (
          <div className="w-80 p-6 bg-gray-50 border-r border-gray-200 space-y-4">
            <h4 className="font-medium text-gray-900 mb-3">Properties</h4>
            {controls}
          </div>
        )}

        {/* Content */}
        <div className="flex-1">
          {/* Preview Section */}
          <div className="border-b border-gray-200">
            <div className="px-6 py-3 bg-gray-50">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Preview</span>
              </div>
            </div>
            <div className="p-6">
              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div 
                  key={key} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="min-h-[200px] flex items-center justify-center"
                >
                  {children}
                </motion.div>
              )}
            </div>
          </div>

          {/* Code Section */}
          <div>
            <div className="px-6 py-3 bg-gray-50">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Code</span>
              </div>
            </div>
            <div className="p-0">
              <CodeBlock code={code} language="tsx" showLineNumbers={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}