import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";


const ConfirmDialog = ({
  show,
  title = "Confirm",
  message = "Are you sure you want to proceed?",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
  icon = <AlertTriangle className="h-5 w-5" />,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="max-w-md w-full mx-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {icon}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{message}</p>
          <div className="flex justify-end space-x-3">
            <Button onClick={onCancel} variant="outline">
              {cancelText}
            </Button>
            <Button onClick={onConfirm} variant={destructive ? "destructive" : "default"}>
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmDialog;
