import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchBadgeById, updateBadge } from "@/store/badgeSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import { BadgeIcon } from "./badge-icon";
import { toast } from "react-toastify";

const conditionTypes = [
  "quiz_count",
  "quiz_score",
  "quiz_time",
  "course_completion",
  "lesson_completion",
  "time_spent",
  "testimonial_given",
  "exam_score",
  "subject_enrollment",
  "custom_field",
];

const operators = [">=", "<=", ">", "<", "==", "!=", "contains", "exists"];

const EditBadge = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const status = useSelector((state) => state.badges.status);
  const currentBadge = useSelector((state) => state.badges.currentBadge);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    rarity: "common",
    points: 10,
    icon: "trophy",
    color: "#FFD700",
    isActive: true,
    isSecret: false,
    isVisible: true,
    maxEarnings: 1,
    conditions: [],
    prerequisites: [],
    conditionLogic: "AND",
    availableFrom: "",
    availableUntil: "",
  });

  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const rarityOptions = ["common", "rare", "epic", "legendary"];
  const categoryOptions = [
    "performance",
    "progress",
    "engagement",
    "social",
    "special",
  ];
const iconOptions = [
  "trophy", "medal", "award", "star", "crown", "target", "zap", "shield", 
  "heart", "flame", "gem", "rocket", "lightbulb", "users", "calendar", 
  "clock", "check-circle", "gift", "bookmark", "flag", "sword", "leaf", 
  "mountain", "sun", "moon"
];

  useEffect(() => {
    const loadBadgeData = async () => {
      setIsLoading(true);
      try {
        let badgeData = currentBadge;
        if (!badgeData || badgeData._id !== id) {
          badgeData = await dispatch(fetchBadgeById(id)).unwrap();
        }
        setFormData({
          name: badgeData.name || "",
          description: badgeData.description || "",
          category: badgeData.category || "",
          rarity: badgeData.rarity || "common",
          points: badgeData.points || 10,
          icon: badgeData.icon || "trophy",
          color: badgeData.color,
          isActive:
            badgeData.isActive !== undefined ? badgeData.isActive : true,
          isSecret: badgeData.isSecret || false,
          isVisible:
            badgeData.isVisible !== undefined ? badgeData.isVisible : true,
          maxEarnings: badgeData.maxEarnings || 1,
          conditions: badgeData.conditions || [],
          prerequisites: badgeData.prerequisites || [],
          conditionLogic: badgeData.conditionLogic || "AND",
          availableFrom: badgeData.availableFrom
            ? new Date(badgeData.availableFrom).toISOString().split("T")[0]
            : "",
          availableUntil: badgeData.availableUntil
            ? new Date(badgeData.availableUntil).toISOString().split("T")[0]
            : "",
        });
      } catch (error) {
        toast.error("Failed to load badge data");
        console.error("Error loading badge data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadBadgeData();
    }
  }, [id, dispatch, currentBadge]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? Number(value) || 0
          : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleConditionChange = (index, name, value) => {
    setFormData((prev) => {
      const newConditions = [...prev.conditions];
      newConditions[index] = { ...newConditions[index], [name]: value };
      return { ...prev, conditions: newConditions };
    });
    if (errors[`condition-${index}`]) {
      setErrors((prev) => ({ ...prev, [`condition-${index}`]: "" }));
    }
  };

  const addCondition = () => {
    setFormData((prev) => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        { type: "", field: "", operator: "", value: "", description: "" },
      ],
    }));
  };

  const removeCondition = (index) => {
    setFormData((prev) => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index),
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`condition-${index}`];
      return newErrors;
    });
  };

  const addPrerequisite = () => {
    const trimmedInput = prerequisiteInput.trim();
    if (trimmedInput && !formData.prerequisites.includes(trimmedInput)) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, trimmedInput],
      }));
      setPrerequisiteInput("");
    }
  };

  const removePrerequisite = (prereqToRemove) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((p) => p !== prereqToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Badge name is required.";
    if (!formData.description.trim())
      newErrors.description = "Description is required.";
    if (!formData.category.trim()) newErrors.category = "Category is required.";
    if (formData.points < 1) newErrors.points = "Points must be at least 1.";
    if (formData.maxEarnings < 1)
      newErrors.maxEarnings = "Max earnings must be at least 1.";

    if (formData.availableFrom && formData.availableUntil) {
      const fromDate = new Date(formData.availableFrom);
      const untilDate = new Date(formData.availableUntil);
      if (fromDate >= untilDate) {
        newErrors.availableUntil =
          "Available Until must be after Available From.";
      }
    }

    formData.conditions.forEach((condition, index) => {
      if (!condition.type)
        newErrors[`condition-${index}-type`] = "Condition type is required.";
      if (!condition.operator)
        newErrors[`condition-${index}-operator`] = "Operator is required.";
      if (!condition.value)
        newErrors[`condition-${index}-value`] = "Value is required.";
      if (!condition.description)
        newErrors[`condition-${index}-description`] =
          "Description is required.";
      if (
        ["==", "!=", ">=", "<=", ">", "<"].includes(condition.operator) &&
        isNaN(condition.value)
      ) {
        newErrors[`condition-${index}-value`] =
          "Value must be a number for this operator.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the form errors.");
      return;
    }

    try {
      const updates = {
        ...formData,
        availableFrom: formData.availableFrom
          ? new Date(formData.availableFrom)
          : null,
        availableUntil: formData.availableUntil
          ? new Date(formData.availableUntil)
          : null,
      };
      await dispatch(updateBadge({ id, updates })).unwrap();
      toast.success("Badge updated successfully!");
      navigate("/badges");
    } catch (error) {
      toast.error(error.message || "Failed to update badge.");
    }
  };

  const handleCancel = () => {
    navigate("/badges");
  };

  const isSubmitting = status === "loading";

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="flex justify-center items-center py-12">
              <Loader2
                className="animate-spin text-gray-400 h-8 w-8"
                aria-hidden="true"
              />
              <p className="ml-2 text-gray-500">Loading badge data...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-transparent"
                aria-label="Go back to badges list"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <CardTitle>Edit Badge</CardTitle>
                <CardDescription>Update badge information</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Badge Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter badge name"
                    className={errors.name ? "border-red-500" : ""}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="text-red-500 text-sm mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.category ? "border-red-500" : ""
                    }`}
                    aria-invalid={!!errors.category}
                    aria-describedby={
                      errors.category ? "category-error" : undefined
                    }
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p
                      id="category-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.category}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter badge description"
                  rows={3}
                  className={errors.description ? "border-red-500" : ""}
                  aria-invalid={!!errors.description}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                />
                {errors.description && (
                  <p
                    id="description-error"
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Badge Properties */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rarity">Rarity</Label>
                  <select
                    id="rarity"
                    name="rarity"
                    value={formData.rarity}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {rarityOptions.map((rarity) => (
                      <option key={rarity} value={rarity}>
                        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="points">Points *</Label>
                  <Input
                    id="points"
                    name="points"
                    type="number"
                    value={formData.points}
                    onChange={handleInputChange}
                    min="1"
                    className={errors.points ? "border-red-500" : ""}
                    aria-invalid={!!errors.points}
                    aria-describedby={
                      errors.points ? "points-error" : undefined
                    }
                  />
                  {errors.points && (
                    <p id="points-error" className="text-red-500 text-sm mt-1">
                      {errors.points}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="maxEarnings">Max Earnings *</Label>
                  <Input
                    id="maxEarnings"
                    name="maxEarnings"
                    type="number"
                    value={formData.maxEarnings}
                    onChange={handleInputChange}
                    min="1"
                    className={errors.maxEarnings ? "border-red-500" : ""}
                    aria-invalid={!!errors.maxEarnings}
                    aria-describedby={
                      errors.maxEarnings ? "maxEarnings-error" : undefined
                    }
                  />
                  {errors.maxEarnings && (
                    <p
                      id="maxEarnings-error"
                      className="text-red-500 text-sm mt-1"
                    >
                      {errors.maxEarnings}
                    </p>
                  )}
                </div>
              </div>

              {/* Icon and Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <select
                    id="icon"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {iconOptions.map((icon) => (
                      <option key={icon} value={icon}>
                        {icon.charAt(0).toUpperCase() + icon.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Preview:</span>
                    <BadgeIcon
                      iconName={formData.icon}
                      className="w-6 h-6"
                      style={{ color: formData.color }}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="color">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      name="color"
                      type="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-16 h-10 p-1 border border-gray-300 rounded"
                      aria-label="Select badge color"
                    />
                    <Input
                      name="color"
                      type="text"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="#FFD700"
                      className="flex-1"
                      aria-label="Enter badge color hex code"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Current color:{" "}
                    <span className="font-medium">{formData.color}</span>
                  </p>
                </div>
              </div>

              {/* Conditions Section */}
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <Label>Conditions</Label>
                  <Button
                    type="button"
                    onClick={addCondition}
                    variant="outline"
                    className="flex items-center gap-1"
                    aria-label="Add new condition"
                  >
                    <Plus className="w-4 h-4" />
                    Add Condition
                  </Button>
                </div>
                <p className="text-sm text-gray-500">
                  Define the criteria for earning the badge.
                </p>
                {formData.conditions.map((condition, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-gray-800">
                        Condition #{index + 1}
                      </h4>
                      <Button
                        type="button"
                        onClick={() => removeCondition(index)}
                        variant="outline"
                        size="sm"
                        className="bg-transparent text-gray-500 hover:text-red-500"
                        aria-label={`Remove condition ${index + 1}`}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`condition-type-${index}`}>Type</Label>
                        <select
                          id={`condition-type-${index}`}
                          value={condition.type}
                          onChange={(e) =>
                            handleConditionChange(index, "type", e.target.value)
                          }
                          className={`w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm ${
                            errors[`condition-${index}-type`]
                              ? "border-red-500"
                              : ""
                          }`}
                          aria-invalid={!!errors[`condition-${index}-type`]}
                          aria-describedby={
                            errors[`condition-${index}-type`]
                              ? `condition-type-error-${index}`
                              : undefined
                          }
                        >
                          <option value="">Select type</option>
                          {conditionTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        {errors[`condition-${index}-type`] && (
                          <p
                            id={`condition-type-error-${index}`}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors[`condition-${index}-type`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`condition-operator-${index}`}>
                          Operator
                        </Label>
                        <select
                          id={`condition-operator-${index}`}
                          value={condition.operator}
                          onChange={(e) =>
                            handleConditionChange(
                              index,
                              "operator",
                              e.target.value
                            )
                          }
                          className={`w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm ${
                            errors[`condition-${index}-operator`]
                              ? "border-red-500"
                              : ""
                          }`}
                          aria-invalid={!!errors[`condition-${index}-operator`]}
                          aria-describedby={
                            errors[`condition-${index}-operator`]
                              ? `condition-operator-error-${index}`
                              : undefined
                          }
                        >
                          <option value="">Select operator</option>
                          {operators.map((op) => (
                            <option key={op} value={op}>
                              {op}
                            </option>
                          ))}
                        </select>
                        {errors[`condition-${index}-operator`] && (
                          <p
                            id={`condition-operator-error-${index}`}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors[`condition-${index}-operator`]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`condition-field-${index}`}>
                          Field
                        </Label>
                        <Input
                          id={`condition-field-${index}`}
                          type="text"
                          value={condition.field}
                          onChange={(e) =>
                            handleConditionChange(
                              index,
                              "field",
                              e.target.value
                            )
                          }
                          placeholder="e.g., quiz_id"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`condition-value-${index}`}>
                          Value
                        </Label>
                        <Input
                          id={`condition-value-${index}`}
                          type="text"
                          value={condition.value}
                          onChange={(e) =>
                            handleConditionChange(
                              index,
                              "value",
                              e.target.value
                            )
                          }
                          placeholder="e.g., 90"
                          className={
                            errors[`condition-${index}-value`]
                              ? "border-red-500"
                              : ""
                          }
                          aria-invalid={!!errors[`condition-${index}-value`]}
                          aria-describedby={
                            errors[`condition-${index}-value`]
                              ? `condition-value-error-${index}`
                              : undefined
                          }
                        />
                        {errors[`condition-${index}-value`] && (
                          <p
                            id={`condition-value-error-${index}`}
                            className="text-red-500 text-sm mt-1"
                          >
                            {errors[`condition-${index}-value`]}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`condition-description-${index}`}>
                        Description
                      </Label>
                      <Input
                        id={`condition-description-${index}`}
                        type="text"
                        value={condition.description}
                        onChange={(e) =>
                          handleConditionChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="e.g., Score is greater than or equal to 90"
                        className={
                          errors[`condition-${index}-description`]
                            ? "border-red-500"
                            : ""
                        }
                        aria-invalid={
                          !!errors[`condition-${index}-description`]
                        }
                        aria-describedby={
                          errors[`condition-${index}-description`]
                            ? `condition-description-error-${index}`
                            : undefined
                        }
                      />
                      {errors[`condition-${index}-description`] && (
                        <p
                          id={`condition-description-error-${index}`}
                          className="text-red-500 text-sm mt-1"
                        >
                          {errors[`condition-${index}-description`]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Prerequisites Section */}
              <div className="space-y-4 pt-6 border-t">
                <Label>Prerequisites</Label>
                <p className="text-sm text-gray-500">
                  Other badges required to earn this one. Enter a Badge ID.
                </p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={prerequisiteInput}
                    onChange={(e) => setPrerequisiteInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPrerequisite();
                      }
                    }}
                    placeholder="Enter prerequisite Badge ID"
                    aria-label="Enter prerequisite Badge ID"
                  />
                  <Button
                    type="button"
                    onClick={addPrerequisite}
                    aria-label="Add prerequisite"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.prerequisites.map((prereq) => (
                    <div
                      key={prereq}
                      className="flex items-center bg-gray-200 text-gray-800 rounded-full px-3 py-1 text-sm font-medium"
                    >
                      <span>{prereq}</span>
                      <button
                        type="button"
                        onClick={() => removePrerequisite(prereq)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                        aria-label={`Remove prerequisite ${prereq}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-3 pt-6 border-t">
                <Label>Badge Settings</Label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="rounded"
                      aria-label="Toggle badge active status"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isVisible"
                      checked={formData.isVisible}
                      onChange={handleInputChange}
                      className="rounded"
                      aria-label="Toggle badge visibility"
                    />
                    <span className="text-sm">Visible to users</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isSecret"
                      checked={formData.isSecret}
                      onChange={handleInputChange}
                      className="rounded"
                      aria-label="Toggle secret badge status"
                    />
                    <span className="text-sm">Secret badge</span>
                  </label>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-3 pt-6 border-t">
                <Label>Advanced Settings</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="conditionLogic">Condition Logic</Label>
                    <select
                      id="conditionLogic"
                      name="conditionLogic"
                      value={formData.conditionLogic}
                      onChange={handleInputChange}
                      className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AND">AND</option>
                      <option value="OR">OR</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="availableFrom">Available From</Label>
                    <Input
                      id="availableFrom"
                      name="availableFrom"
                      type="date"
                      value={formData.availableFrom}
                      onChange={handleInputChange}
                      className="w-full"
                      aria-describedby={
                        errors.availableUntil
                          ? "availableUntil-error"
                          : undefined
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="availableUntil">Available Until</Label>
                    <Input
                      id="availableUntil"
                      name="availableUntil"
                      type="date"
                      value={formData.availableUntil}
                      onChange={handleInputChange}
                      className={errors.availableUntil ? "border-red-500" : ""}
                      aria-invalid={!!errors.availableUntil}
                      aria-describedby={
                        errors.availableUntil
                          ? "availableUntil-error"
                          : undefined
                      }
                    />
                    {errors.availableUntil && (
                      <p
                        id="availableUntil-error"
                        className="text-red-500 text-sm mt-1"
                      >
                        {errors.availableUntil}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  aria-label="Cancel editing"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                  aria-label={isSubmitting ? "Updating badge" : "Update badge"}
                >
                  {isSubmitting ? (
                    <Loader2
                      className="w-4 h-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isSubmitting ? "Updating..." : "Update Badge"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditBadge;
