import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CreateCoursePage() {
  const [step, setStep] = useState(1)
  const totalSteps = 4
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    prerequisites: '',
    objectives: '',
    duration: '',
    price: '',
    image: '',
    curriculum: '',
    instructor: '',
    instructorBio: '',
    materials: '',
    tags: '',
    published: false
  })
  const [errors, setErrors] = useState({})
  const [isNextDisabled, setIsNextDisabled] = useState(true)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked) => {
    setFormData(prev => ({ ...prev, published: checked }))
  }

  const validateStep = () => {
    let stepErrors = {}
    let isValid = true

    if (step === 1) {
      if (!formData.title.trim()) stepErrors.title = 'Title is required'
      if (!formData.description.trim()) stepErrors.description = 'Description is required'
      if (!formData.category) stepErrors.category = 'Category is required'
    } else if (step === 2) {
      if (!formData.level) stepErrors.level = 'Difficulty level is required'
      if (!formData.prerequisites.trim()) stepErrors.prerequisites = 'Prerequisites are required'
      if (!formData.objectives.trim()) stepErrors.objectives = 'Learning objectives are required'
    } else if (step === 3) {
      if (!formData.duration) stepErrors.duration = 'Duration is required'
      if (!formData.price) stepErrors.price = 'Price is required'
      if (!formData.image.trim()) stepErrors.image = 'Image URL is required'
      if (!formData.curriculum.trim()) stepErrors.curriculum = 'Curriculum is required'
    } else if (step === 4) {
      if (!formData.instructor.trim()) stepErrors.instructor = 'Instructor name is required'
      if (!formData.instructorBio.trim()) stepErrors.instructorBio = 'Instructor bio is required'
      if (!formData.materials.trim()) stepErrors.materials = 'Course materials are required'
      if (!formData.tags.trim()) stepErrors.tags = 'Tags are required'
    }

    setErrors(stepErrors)
    isValid = Object.keys(stepErrors).length === 0
    setIsNextDisabled(!isValid)
    return isValid
  }

  useEffect(() => {
    validateStep()
  }, [formData, step])

  const nextStep = () => {
    if (validateStep()) {
      setStep(step => Math.min(step + 1, totalSteps))
    }
  }

  const prevStep = () => setStep(step => Math.max(step - 1, 1))

  const handleSubmit = () => {
    if (validateStep()) {
      console.log('Form submitted:', formData)
      // Here you would typically send the data to your backend
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-1/4 h-2 rounded-full ${
                    i + 1 <= step ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-500">
              Step {step} of {totalSteps}
            </p>
          </div>

          <form className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter course title" 
                  />
                  {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter course description" 
                  />
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => handleSelectChange('category', value)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="programming">Programming</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select onValueChange={(value) => handleSelectChange('level', value)}>
                    <SelectTrigger id="level">
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prerequisites">Prerequisites</Label>
                  <Textarea 
                    id="prerequisites" 
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleInputChange}
                    placeholder="Enter course prerequisites (one per line)" 
                  />
                  {errors.prerequisites && <p className="text-red-500 text-sm">{errors.prerequisites}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="objectives">Learning Objectives</Label>
                  <Textarea 
                    id="objectives" 
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleInputChange}
                    placeholder="Enter learning objectives (one per line)" 
                  />
                  {errors.objectives && <p className="text-red-500 text-sm">{errors.objectives}</p>}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="duration">Course Duration (in hours)</Label>
                  <Input 
                    id="duration" 
                    name="duration"
                    type="number" 
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="Enter course duration" 
                  />
                  {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    name="price"
                    type="number" 
                    step="0.01" 
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter course price" 
                  />
                  {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Course Image URL</Label>
                  <Input 
                    id="image" 
                    name="image"
                    type="url" 
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Enter course image URL" 
                  />
                  {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="curriculum">Curriculum (one item per line)</Label>
                  <Textarea 
                    id="curriculum" 
                    name="curriculum"
                    value={formData.curriculum}
                    onChange={handleInputChange}
                    placeholder="Enter curriculum items" 
                  />
                  {errors.curriculum && <p className="text-red-500 text-sm">{errors.curriculum}</p>}
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor Name</Label>
                  <Input 
                    id="instructor" 
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    placeholder="Enter instructor name" 
                  />
                  {errors.instructor && <p className="text-red-500 text-sm">{errors.instructor}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructorBio">Instructor Bio</Label>
                  <Textarea 
                    id="instructorBio" 
                    name="instructorBio"
                    value={formData.instructorBio}
                    onChange={handleInputChange}
                    placeholder="Enter instructor bio" 
                  />
                  {errors.instructorBio && <p className="text-red-500 text-sm">{errors.instructorBio}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="materials">Course Materials</Label>
                  <Textarea 
                    id="materials" 
                    name="materials"
                    value={formData.materials}
                    onChange={handleInputChange}
                    placeholder="Enter course materials (e.g., PDFs, videos, quizzes)" 
                  />
                  {errors.materials && <p className="text-red-500 text-sm">{errors.materials}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input 
                    id="tags" 
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Enter course tags" 
                  />
                  {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="published" 
                    checked={formData.published}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="published">Publish course immediately</Label>
                </div>
              </>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={prevStep}
            disabled={step === 1}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button
            onClick={step === totalSteps ? handleSubmit : nextStep}
            disabled={isNextDisabled}
          >
            {step === totalSteps ? 'Create Course' : (
              <>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}