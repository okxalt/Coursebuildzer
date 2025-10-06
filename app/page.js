'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('idea');
  const [userInput, setUserInput] = useState('');
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState('');
  const [numChapters, setNumChapters] = useState(7);
  const [courseOutline, setCourseOutline] = useState(null);
  const [generatedContent, setGeneratedContent] = useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Discover opportunities
  const handleDiscoverOpportunities = async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/discover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: userInput }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setOpportunities(data.opportunities);
        setCurrentStep('opportunities');
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Generate outline
  const handleGenerateOutline = async () => {
    if (!selectedOpportunity) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          opportunityTitle: selectedOpportunity,
          numChapters: numChapters 
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setCourseOutline(data.outline);
        setCurrentStep('generation');
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Generate chapter content
  const handleGenerateChapter = async () => {
    if (!courseOutline || currentChapterIndex >= courseOutline.chapters.length) return;
    
    setIsLoading(true);
    const chapter = courseOutline.chapters[currentChapterIndex];
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseTitle: courseOutline.title,
          chapterTitle: chapter.title,
          learningObjectives: chapter.summary
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setGeneratedContent(prev => [...prev, data.content]);
        setCurrentChapterIndex(prev => prev + 1);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetApp = () => {
    setCurrentStep('idea');
    setUserInput('');
    setOpportunities([]);
    setSelectedOpportunity('');
    setNumChapters(7);
    setCourseOutline(null);
    setGeneratedContent([]);
    setCurrentChapterIndex(0);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Course Creator
          </h1>
          <p className="text-lg text-gray-600">
            Transform your ideas into complete courses and ebooks
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['idea', 'opportunities', 'outline', 'generation'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step 
                    ? 'bg-blue-600 text-white' 
                    : ['idea', 'opportunities', 'outline', 'generation'].indexOf(currentStep) > index
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < 3 && (
                  <div className={`w-8 h-1 ${
                    ['idea', 'opportunities', 'outline', 'generation'].indexOf(currentStep) > index
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Idea Input */}
        {currentStep === 'idea' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                What's your course idea?
              </h2>
              <div className="space-y-4">
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g., A guide to sourdough baking for beginners"
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={handleDiscoverOpportunities}
                  disabled={!userInput.trim() || isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Discovering Opportunities...' : 'Discover Opportunities'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Opportunity Selection */}
        {currentStep === 'opportunities' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Choose your course opportunity
              </h2>
              <div className="grid gap-4">
                {opportunities.map((opportunity, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedOpportunity(opportunity);
                      setCurrentStep('outline');
                    }}
                    className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{opportunity}</h3>
                  </button>
                ))}
              </div>
              <button
                onClick={resetApp}
                className="mt-6 text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to idea input
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Outline Configuration */}
        {currentStep === 'outline' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Configure your course
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Opportunity
                  </label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                    {selectedOpportunity}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Chapters
                  </label>
                  <input
                    type="number"
                    value={numChapters}
                    onChange={(e) => setNumChapters(parseInt(e.target.value))}
                    min="3"
                    max="15"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleGenerateOutline}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Generating Outline...' : 'Generate Outline'}
                </button>
                <button
                  onClick={() => setCurrentStep('opportunities')}
                  className="w-full text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to opportunities
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Content Generation */}
        {currentStep === 'generation' && courseOutline && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {courseOutline.title}
              </h2>
              
              {/* Course Outline */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Course Outline</h3>
                <div className="space-y-2">
                  {courseOutline.chapters.map((chapter, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                      <ul className="mt-2 text-sm text-gray-600">
                        {chapter.summary.map((point, pointIndex) => (
                          <li key={pointIndex} className="list-disc list-inside">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated Content */}
              {generatedContent.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Content</h3>
                  <div className="space-y-6">
                    {generatedContent.map((content, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          {courseOutline.chapters[index].title}
                        </h4>
                        <div className="prose max-w-none">
                          <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generation Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                {currentChapterIndex < courseOutline.chapters.length ? (
                  <button
                    onClick={handleGenerateChapter}
                    disabled={isLoading}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading 
                      ? 'Generating Chapter...' 
                      : `Generate Chapter ${currentChapterIndex + 1}: ${courseOutline.chapters[currentChapterIndex].title}`
                    }
                  </button>
                ) : (
                  <div className="flex-1 text-center py-3 px-6 bg-green-100 text-green-800 rounded-lg font-medium">
                    🎉 Course Complete! All chapters have been generated.
                  </div>
                )}
                
                <button
                  onClick={resetApp}
                  className="px-6 py-3 text-blue-600 hover:text-blue-800 font-medium border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Create New Course
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}