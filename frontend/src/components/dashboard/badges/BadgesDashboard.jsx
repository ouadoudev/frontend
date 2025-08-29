import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchAdminBadges, deleteBadge, toggleBadgeStatus } from "@/store/badgeSlice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles, Edit, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { BadgeIcon } from "./badge-icon"
import { toast } from "react-toastify"

const BadgesDashboard = () => {
  // Select data from the Redux store
  const adminBadges = useSelector((state) => state.badges.adminBadges)
  const status = useSelector((state) => state.badges.status)
  const error = useSelector((state) => state.badges.error)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Local state for UI controls
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedRarity, setSelectedRarity] = useState("")

  // Fetch badges from the backend when the component mounts
  useEffect(() => {
    // Only fetch if the status is 'idle' to prevent multiple fetches
    if (status === "idle") {
      dispatch(fetchAdminBadges())
    }
  }, [dispatch, status])

  // Handler for creating a new badge
  const handleCreateBadge = () => {
    navigate("/badges/create")
  }

  // Handler for editing an existing badge
  const handleEditBadge = (badgeId) => {
    navigate(`/badges/update/${badgeId}`)
  }

  // Handler for deleting a badge
  const handleDeleteBadge = (badgeId) => {
    if (window.confirm("Are you sure you want to delete this badge?")) {
      dispatch(deleteBadge(badgeId))
        .unwrap()
        .then(() => {
          toast.success("Badge deleted successfully!")
        })
        .catch((err) => {
          toast.error(err.message || "Failed to delete badge.")
        })
    }
  }

  // Handler for toggling a badge's active status
  const handleToggleStatus = (badgeId) => {
    dispatch(toggleBadgeStatus(badgeId))
      .unwrap()
      .then(() => {
        toast.success("Badge status updated.")
      })
      .catch((err) => {
        toast.error(err.message || "Failed to toggle badge status.")
      })
  }

  // Handler for page changes in pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Filtering logic based on selected category and rarity
  const filteredBadges = adminBadges.filter(
    (badge) =>
      (!selectedCategory || badge.category === selectedCategory) &&
      (!selectedRarity || badge.rarity === selectedRarity),
  )

  // Get unique categories and rarities for filter options
  const validCategories = [...new Set(adminBadges.map((badge) => badge.category))]
  const validRarities = [...new Set(adminBadges.map((badge) => badge.rarity))]

  // Pagination logic
  const indexOfLastBadge = currentPage * itemsPerPage
  const indexOfFirstBadge = indexOfLastBadge - itemsPerPage
  const currentBadges = filteredBadges.slice(indexOfFirstBadge, indexOfLastBadge)

  const totalPages = Math.ceil(filteredBadges.length / itemsPerPage)

  // Determine content to display based on loading status
  let content
  if (status === "loading") {
    content = (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="animate-spin text-gray-400 h-8 w-8" />
        <p className="ml-2 text-gray-500">Loading badges...</p>
      </div>
    )
  } else if (status === "failed") {
    content = <p className="text-center text-red-500 py-12">Error: {error}</p>
  } else if (currentBadges.length === 0) {
    content = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center my-12"
      >
        <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-semibold mb-2">No badges have been added yet.</h3>
        <p className="text-muted-foreground">There are currently no badges to display.</p>
      </motion.div>
    )
  } else {
    content = (
      <Table>
        <TableHeader>
          <TableRow className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
            <TableHead className="px-4 py-3">Icon</TableHead>
            <TableHead className="px-4 py-3">Name</TableHead>
            <TableHead className="px-4 py-3">Description</TableHead>
            <TableHead className="px-4 py-3">Category</TableHead>
            <TableHead className="px-4 py-3">Rarity</TableHead>
            <TableHead className="px-4 py-3">Points</TableHead>
            <TableHead className="px-4 py-3 text-center">Active</TableHead>
            <TableHead className="px-4 py-3 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBadges.map((badge) => (
            <TableRow key={badge._id} className="hover:bg-gray-50">
              <TableCell className="px-4 py-3">
                <BadgeIcon iconName={badge.icon} className="w-8 h-8 text-yellow-500" />
              </TableCell>
              <TableCell className="px-4 py-3 font-medium">{badge.name}</TableCell>
              <TableCell className="px-4 py-3 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                {badge.description}
              </TableCell>
              <TableCell className="px-4 py-3">{badge.category}</TableCell>
              <TableCell className="px-4 py-3">{badge.rarity}</TableCell>
              <TableCell className="px-4 py-3">{badge.points}</TableCell>
              <TableCell className="px-4 py-3 text-center">
                <Button size="sm" variant="ghost" onClick={() => handleToggleStatus(badge._id)}>
                  {badge.isActive ? (
                    <ToggleRight className="text-green-500" />
                  ) : (
                    <ToggleLeft className="text-red-500" />
                  )}
                </Button>
              </TableCell>
              <TableCell className="px-4 py-3">
                <div className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditBadge(badge._id)}
                    className="bg-transparent"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteBadge(badge._id)}
                    className="bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Manage Badges</CardTitle>
            <CardDescription>View, create, edit, and delete badges.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <Button
                className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                onClick={handleCreateBadge}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Badge
              </Button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                <div>
                  <Label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Category:
                  </Label>
                  <select
                    id="categoryFilter"
                    onChange={(e) => setSelectedCategory(e.target.value || "")}
                    value={selectedCategory || ""}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {validCategories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="rarityFilter" className="block text-sm font-medium text-gray-700 mb-1">
                    Rarity:
                  </Label>
                  <select
                    id="rarityFilter"
                    onChange={(e) => setSelectedRarity(e.target.value || "")}
                    value={selectedRarity || ""}
                    className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Rarities</option>
                    {validRarities.map((rarity, index) => (
                      <option key={index} value={rarity}>
                        {rarity}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {content}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      {currentPage !== 1 && (
                        <PaginationPrevious
                          className="cursor-pointer"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        />
                      )}
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          className="cursor-pointer"
                          onClick={() => handlePageChange(page)}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      {currentPage !== totalPages && (
                        <PaginationNext
                          className="cursor-pointer"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        />
                      )}
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BadgesDashboard
