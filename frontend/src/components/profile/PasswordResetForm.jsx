import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { requestReset, validateReset, passwordReset } from "@/store/passwordResetSlice"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Mail, Lock, CheckCircle } from 'lucide-react'
import { toast } from "react-toastify"
import AnimatedBackground from "../AnimatedBackground"

const PasswordResetForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await dispatch(requestReset(email))
      toast.success('Verification code sent to your email')
      setStep(2)
    } catch (err) {
      setError("Failed to send verification code. Please try again.")
    }
    setIsLoading(false)
  }

  const handleValidateReset = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      await dispatch(validateReset(code))
      toast.success('Verification successful')
      setStep(3)
    } catch (err) {
      setError("Invalid verification code. Please try again.")
    }
    setIsLoading(false)
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setIsLoading(true)
    setError("")
    try {
      await dispatch(passwordReset({ code, password: newPassword }))
      toast.success('Password reset successful')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError("Failed to reset password. Please try again.")
    }
    setIsLoading(false)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleRequestReset}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                Send Verification Code
              </Button>
            </div>
          </form>
        )
      case 2:
        return (
          <form onSubmit={handleValidateReset}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter verification code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                Verify Code
              </Button>
            </div>
          </form>
        )
      case 3:
        return (
          <form onSubmit={handlePasswordReset}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                Reset Password
              </Button>
            </div>
          </form>
        )
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <AnimatedBackground />
    <div className="flex items-center z-10 justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Follow the steps below to reset your account password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Progress value={(step / 3) * 100} className="w-full" />
          </div>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {renderStep()}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} disabled={isLoading}>
              Back
            </Button>
          )}
          <div className="text-sm text-gray-500">
            Step {step} of 3
          </div>
        </CardFooter>
      </Card>
    </div>
    </section>
  )
}

export default PasswordResetForm

