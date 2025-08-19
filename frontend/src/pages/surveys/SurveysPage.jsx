import React from 'react'

const SurveysPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Surveys</h1>
        <p className="mt-1 text-sm text-secondary-600">
          Complete training surveys and provide feedback
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-secondary-400">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-secondary-900">Surveys Module</h3>
          <p className="mt-1 text-sm text-secondary-500">
            Survey management and completion functionality will be implemented here.
          </p>
        </div>
      </div>
    </div>
  )
}

export default SurveysPage
