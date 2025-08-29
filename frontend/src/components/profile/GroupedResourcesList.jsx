import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getGroupedResources } from "@/store/resourcesSlice"

import {  BookOpenIcon, Captions, ChevronDownIcon, ChevronRightIcon, Dock, } from "lucide-react"


const GroupedResourcesList = () => {
  const dispatch = useDispatch()
  const {
    groupedResources,
    isLoading: groupedResourcesLoading,
    message: groupedResourcesError,
  } = useSelector((state) => state.resources)

  const [expandedCycles, setExpandedCycles] = useState({})
  const [expandedLevels, setExpandedLevels] = useState({})
  const [expandedStreams, setExpandedStreams] = useState({})
  const [expandedSubjects, setExpandedSubjects] = useState({})
  const [expandedTypes, setExpandedTypes] = useState({})

  useEffect(() => {
    dispatch(getGroupedResources())
  }, [dispatch])

  // Group resources by hierarchy
  const organizeResources = (resources) => {
    const organized = {}

    resources.forEach((item) => {
      const { educationalCycle, educationalLevel, stream, subject, resources: resourceList } = item

      if (!organized[educationalCycle]) {
        organized[educationalCycle] = {}
      }
      if (!organized[educationalCycle][educationalLevel]) {
        organized[educationalCycle][educationalLevel] = {}
      }
      if (!organized[educationalCycle][educationalLevel][stream || "General"]) {
        organized[educationalCycle][educationalLevel][stream || "General"] = {}
      }
      if (!organized[educationalCycle][educationalLevel][stream || "General"][subject]) {
        organized[educationalCycle][educationalLevel][stream || "General"][subject] = {}
      }

      // Group resources by type within each subject
      resourceList.forEach((resource) => {
        const type = resource.type || "Other"
        if (!organized[educationalCycle][educationalLevel][stream || "General"][subject][type]) {
          organized[educationalCycle][educationalLevel][stream || "General"][subject][type] = []
        }
        organized[educationalCycle][educationalLevel][stream || "General"][subject][type].push(resource)
      })
    })

    return organized
  }

  const toggleExpanded = (setState, key) => {
    setState((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "cours":
        return <BookOpenIcon className="w-4 h-4" />
      case "exercice":
        return <Captions className="w-4 h-4" />
      default:
        return <Dock className="w-4 h-4" />
    }
  }

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "cours":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "exercice":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (groupedResourcesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading resources...</span>
      </div>
    )
  }

  if (groupedResourcesError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
        <p className="text-red-800">Error: {groupedResourcesError}</p>
      </div>
    )
  }

  if (!groupedResources || groupedResources.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <BookOpenIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No resources available</p>
      </div>
    )
  }

  const organizedResources = organizeResources(groupedResources)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold">Educational Resources</h1>
          <p className="text-blue-100 mt-2">Browse resources organized by educational structure</p>
        </div>

        <div className="p-6">
          {Object.entries(organizedResources).map(([cycle, levels]) => {
            const cycleKey = cycle
            const isCycleExpanded = expandedCycles[cycleKey]

            return (
              <div key={cycleKey} className="mb-4">
                {/* Educational Cycle Level */}
                <button
                  onClick={() => toggleExpanded(setExpandedCycles, cycleKey)}
                  className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                >
                  <div className="flex items-center">
                    {isCycleExpanded ? (
                      <ChevronDownIcon className="w-5 h-5 text-blue-600 mr-3" />
                    ) : (
                      <ChevronRightIcon className="w-5 h-5 text-blue-600 mr-3" />
                    )}
                    <span className="font-semibold text-blue-900">{cycle}</span>
                  </div>
                  <span className="text-sm text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
                    {Object.keys(levels).length} level{Object.keys(levels).length !== 1 ? "s" : ""}
                  </span>
                </button>

                {/* Educational Levels */}
                {isCycleExpanded && (
                  <div className="ml-6 mt-2 space-y-2">
                    {Object.entries(levels).map(([level, streams]) => {
                      const levelKey = `${cycleKey}-${level}`
                      const isLevelExpanded = expandedLevels[levelKey]

                      return (
                        <div key={levelKey}>
                          <button
                            onClick={() => toggleExpanded(setExpandedLevels, levelKey)}
                            className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
                          >
                            <div className="flex items-center">
                              {isLevelExpanded ? (
                                <ChevronDownIcon className="w-4 h-4 text-green-600 mr-2" />
                              ) : (
                                <ChevronRightIcon className="w-4 h-4 text-green-600 mr-2" />
                              )}
                              <span className="font-medium text-green-900">{level}</span>
                            </div>
                            <span className="text-sm text-green-600 bg-green-200 px-2 py-1 rounded-full">
                              {Object.keys(streams).length} stream{Object.keys(streams).length !== 1 ? "s" : ""}
                            </span>
                          </button>

                          {/* Streams */}
                          {isLevelExpanded && (
                            <div className="ml-6 mt-2 space-y-2">
                              {Object.entries(streams).map(([stream, subjects]) => {
                                const streamKey = `${levelKey}-${stream}`
                                const isStreamExpanded = expandedStreams[streamKey]

                                return (
                                  <div key={streamKey}>
                                    <button
                                      onClick={() => toggleExpanded(setExpandedStreams, streamKey)}
                                      className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors"
                                    >
                                      <div className="flex items-center">
                                        {isStreamExpanded ? (
                                          <ChevronDownIcon className="w-4 h-4 text-purple-600 mr-2" />
                                        ) : (
                                          <ChevronRightIcon className="w-4 h-4 text-purple-600 mr-2" />
                                        )}
                                        <span className="font-medium text-purple-900">{stream}</span>
                                      </div>
                                      <span className="text-sm text-purple-600 bg-purple-200 px-2 py-1 rounded-full">
                                        {Object.keys(subjects).length} subject
                                        {Object.keys(subjects).length !== 1 ? "s" : ""}
                                      </span>
                                    </button>

                                    {/* Subjects */}
                                    {isStreamExpanded && (
                                      <div className="ml-6 mt-2 space-y-2">
                                        {Object.entries(subjects).map(([subject, types]) => {
                                          const subjectKey = `${streamKey}-${subject}`
                                          const isSubjectExpanded = expandedSubjects[subjectKey]

                                          return (
                                            <div key={subjectKey}>
                                              <button
                                                onClick={() => toggleExpanded(setExpandedSubjects, subjectKey)}
                                                className="w-full flex items-center justify-between p-3 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors"
                                              >
                                                <div className="flex items-center">
                                                  {isSubjectExpanded ? (
                                                    <ChevronDownIcon className="w-4 h-4 text-orange-600 mr-2" />
                                                  ) : (
                                                    <ChevronRightIcon className="w-4 h-4 text-orange-600 mr-2" />
                                                  )}
                                                  <span className="font-medium text-orange-900">{subject}</span>
                                                </div>
                                                <span className="text-sm text-orange-600 bg-orange-200 px-2 py-1 rounded-full">
                                                  {Object.keys(types).length} type
                                                  {Object.keys(types).length !== 1 ? "s" : ""}
                                                </span>
                                              </button>

                                              {/* Resource Types */}
                                              {isSubjectExpanded && (
                                                <div className="ml-6 mt-2 space-y-2">
                                                  {Object.entries(types).map(([type, resources]) => {
                                                    const typeKey = `${subjectKey}-${type}`
                                                    const isTypeExpanded = expandedTypes[typeKey]

                                                    return (
                                                      <div key={typeKey}>
                                                        <button
                                                          onClick={() => toggleExpanded(setExpandedTypes, typeKey)}
                                                          className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                                                        >
                                                          <div className="flex items-center">
                                                            {isTypeExpanded ? (
                                                              <ChevronDownIcon className="w-4 h-4 text-gray-600 mr-2" />
                                                            ) : (
                                                              <ChevronRightIcon className="w-4 h-4 text-gray-600 mr-2" />
                                                            )}
                                                            {getTypeIcon(type)}
                                                            <span className="font-medium text-gray-900 ml-2">
                                                              {type}
                                                            </span>
                                                          </div>
                                                          <span className="text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded-full">
                                                            {resources.length} resource
                                                            {resources.length !== 1 ? "s" : ""}
                                                          </span>
                                                        </button>

                                                        {/* Individual Resources */}
                                                        {isTypeExpanded && (
                                                          <div className="ml-6 mt-2 space-y-2">
                                                            {resources.map((resource) => (
                                                              <div
                                                                key={resource._id}
                                                                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                                                              >
                                                                <div className="flex-1">
                                                                  <h4 className="font-medium text-gray-900">
                                                                    {resource.title}
                                                                  </h4>
                                                                  {resource.description && (
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                      {resource.description}
                                                                    </p>
                                                                  )}
                                                                  <div className="flex items-center mt-2">
                                                                    <span
                                                                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(resource.type)}`}
                                                                    >
                                                                      {getTypeIcon(resource.type)}
                                                                      <span className="ml-1">{resource.type}</span>
                                                                    </span>
                                                                    <span className="text-xs text-gray-500 ml-3">
                                                                      {new Date(
                                                                        resource.createdAt,
                                                                      ).toLocaleDateString()}
                                                                    </span>
                                                                  </div>
                                                                </div>
                                                                {resource.pdf?.url && (
                                                                  <a
                                                                    href={resource.pdf.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="ml-4 inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                                                                  >
                                                                    <DocumentArrowDownIcon className="w-4 h-4 mr-1" />
                                                                    Download
                                                                  </a>
                                                                )}
                                                              </div>
                                                            ))}
                                                          </div>
                                                        )}
                                                      </div>
                                                    )
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default GroupedResourcesList
