import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { useNavigate } from "react-router-dom"
  
  export function LoginPopup({ isOpen, onClose }) {
    const navigate = useNavigate()
  
    const handleLogin = () => {
      navigate("/login")
      onClose()
    }
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              Please log in to view and select subjects based on your educational level.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleLogin}>Go to Login</Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  
  