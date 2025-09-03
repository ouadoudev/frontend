import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTodo,
  fetchTodos,
  markTodoAsCompleted,
  deleteTodo,
} from "@/store/todoSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Plus, Trash2, Calendar, Flag } from "lucide-react";
import { loggedUser } from "@/store/authSlice";

const TodoCard = () => {
  const dispatch = useDispatch();
  const { todos, fetchStatus, error } = useSelector((state) => state.todos);
  const currentUser = useSelector(loggedUser);

  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState();

  useEffect(() => {
    if (currentUser && fetchStatus === "idle") {
      dispatch(fetchTodos());
    }
  }, [dispatch, currentUser, fetchStatus]);

  const addTodo = useCallback(() => {
    if (newTodo.trim() && currentUser) {
      dispatch(
        createTodo({
          text: newTodo.trim(),
          completed: false,
          priority,
          due_date: dueDate,
          category: category || undefined,
        })
      );
      setNewTodo("");
      setCategory("");
      setPriority("medium");
      setDueDate(undefined);
    }
  }, [newTodo, priority, dueDate, category, dispatch, currentUser]);

  const toggleTodo = useCallback(
    (id, completed) => {
      dispatch(markTodoAsCompleted({ id, completed: !completed }));
    },
    [dispatch]
  );

  const removeTodo = useCallback(
    (id) => {
      dispatch(deleteTodo(id));
    },
    [dispatch]
  );

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
      <Card className="flex-1 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-100 shadow-xl">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
         Mes tâches
        </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {activeTodos.length} restantes
          </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {/* Input Section */}
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Input
              placeholder="Ajouter une nouvelle tâche..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button
              onClick={addTodo}
              size="sm"
              className="px-3"
              disabled={!newTodo.trim() || fetchStatus === "loading"}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex space-x-2">
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value)}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center space-x-2">
                    <Flag className="h-3 w-3 text-green-500" />
                    <span>Faible</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center space-x-2">
                    <Flag className="h-3 w-3 text-yellow-500" />
                    <span>Moyen</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center space-x-2">
                    <Flag className="h-3 w-3 text-red-500" />
                    <span>Élevé</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                setDueDate(
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
              className="w-44"
            />
          </div>
          <div className="flex space-x-2 w-80">
            <Input
              placeholder="Catégorie (optionnel)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Todo List Section */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {todos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Aucune tâche pour le moment</p>
              </div>
            ) : (
              <>
                {activeTodos.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700 px-1">
                      À faire
                    </h4>
                    {activeTodos.map((todo) => (
                      <div
                        key={todo._id}
                        className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 bg-white hover:shadow-sm transition-all"
                      >
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() =>
                            toggleTodo(todo._id, todo.completed)
                          }
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 break-words">
                            {todo.text}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getPriorityColor(
                                todo.priority
                              )}`}
                            >
                              {todo.priority === "high"
                                ? "Élevé"
                                : todo.priority === "medium"
                                ? "Moyen"
                                : "Faible"}
                            </Badge>
                            {todo.category && (
                              <Badge variant="outline" className="text-xs">
                                {todo.category}
                              </Badge>
                            )}
                            {todo.due_date && (
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {new Date(todo.due_date).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTodo(todo._id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {completedTodos.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 px-1">
                      Terminées
                    </h4>
                    {completedTodos.map((todo) => (
                      <div
                        key={todo._id}
                        className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() =>
                            toggleTodo(todo._id, todo.completed)
                          }
                          className="mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500 line-through break-words">
                            {todo.text}
                          </p>
                          {todo.category && (
                            <Badge variant="outline" className="text-xs mt-1">
                              {todo.category}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTodo(todo._id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>


        {/* Summary Footer */}
        {todos.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-600">
              <span>{completedTodos.length} terminées</span>
              <span>{activeTodos.length} en cours</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoCard;
