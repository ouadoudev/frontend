import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeacherRevenueHistory } from "@/store/revenueSlice";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Download,
  DollarSign,
  FileText,
  ArrowUp,
  ArrowDown,
  PieChart,
  LineChart,
  BarChart2,
  AlertCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  ChartTooltip,
  Legend
);

const TeacherRevenueHistory = () => {
  const dispatch = useDispatch();
  const { monthlyRevenues, detailedRevenues, loading, error } = useSelector(
    (state) => state.revenue
  );

  const [filters, setFilters] = useState({
    year: "",
    month: "",
    status: "",
    search: "",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    dispatch(fetchTeacherRevenueHistory());
  }, [dispatch]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      year: "",
      month: "",
      status: "",
      search: "",
    });
    setCurrentPage(1);
  };

  // Filter revenues
  const filteredMonthlyRevenues = monthlyRevenues.filter((rev) => {
    if (filters.year && rev.year !== parseInt(filters.year)) return false;
    if (filters.month && rev.month !== parseInt(filters.month)) return false;
    if (filters.status && rev.paid !== (filters.status === "paid"))
      return false;
    return true;
  });

  const filteredDetailedRevenues = detailedRevenues.filter((detail) => {
    if (
      filters.year &&
      new Date(detail.createdAt).getFullYear() !== parseInt(filters.year)
    )
      return false;
    if (
      filters.month &&
      new Date(detail.createdAt).getMonth() + 1 !== parseInt(filters.month)
    )
      return false;
    if (filters.status && detail.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSubject = detail.subject?.title
        ?.toLowerCase()
        .includes(searchLower);
      const matchesInvoice = detail.subscription?.invoiceNumber
        ?.toLowerCase()
        .includes(searchLower);
      if (!matchesSubject && !matchesInvoice) return false;
    }
    return true;
  });

  // Calculate stats
  const calculateMetrics = () => {
    const totalRevenue = filteredMonthlyRevenues.reduce(
      (sum, rev) => sum + rev.totalAmount,
      0
    );
    const paidRevenue = filteredMonthlyRevenues
      .filter((rev) => rev.paid)
      .reduce((sum, rev) => sum + rev.totalAmount, 0);
    const pendingRevenue = totalRevenue - paidRevenue;

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    // If it's January, last month is December of the previous year
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonth = lastMonthDate.getMonth() + 1;
    const lastMonthYear = lastMonthDate.getFullYear();

    const currentMonthRevenue = filteredMonthlyRevenues
      .filter((rev) => rev.month === currentMonth && rev.year === currentYear)
      .reduce((sum, rev) => sum + rev.totalAmount, 0);

    const lastMonthRevenue = filteredMonthlyRevenues
      .filter((rev) => rev.month === lastMonth && rev.year === lastMonthYear)
      .reduce((sum, rev) => sum + rev.totalAmount, 0);

    const revenueChange =
      lastMonthRevenue > 0
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    const averageMonthlyRevenue =
      filteredMonthlyRevenues.length > 0
        ? totalRevenue / filteredMonthlyRevenues.length
        : 0;

    return {
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      revenueChange,
      averageMonthlyRevenue,
    };
  };

  const metrics = calculateMetrics();

  // Chart data
  const dailyRevenueData = filteredDetailedRevenues.reduce((acc, revenue) => {
    const date = new Date(revenue.createdAt).toLocaleDateString("fr-FR");
    acc[date] = (acc[date] || 0) + revenue.amount;
    return acc;
  }, {});

  const lineChartData = {
    labels: Object.keys(dailyRevenueData).sort(
      (a, b) => new Date(a) - new Date(b)
    ),
    datasets: [
      {
        label: "Revenu Journalier (MAD)",
        data: Object.keys(dailyRevenueData)
          .sort((a, b) => new Date(a) - new Date(b))
          .map((date) => dailyRevenueData[date]),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const monthlyChartData = {
    labels: filteredMonthlyRevenues
      .map((rev) =>
        format(new Date(rev.year, rev.month - 1), "MMM yyyy", { locale: fr })
      )
      .sort((a, b) => new Date(a) - new Date(b)),
    datasets: [
      {
        label: "Revenus Mensuels (MAD)",
        data: filteredMonthlyRevenues
          .sort((a, b) => new Date(a.year, a.month) - new Date(b.year, b.month))
          .map((rev) => rev.totalAmount),
        backgroundColor: "rgba(139, 92, 246, 0.7)",
        borderColor: "#8b5cf6",
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#1f2937", 
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label || "Revenu"}: ${context.raw.toFixed(
              2
            )} MAD`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `${value} MAD`;
          },
          color: "#1f2937",
        },
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          color: "#1f2937",
        },
        grid: {
          display: false,
        },
      },
    },
  };
  // Export to CSV
  const exportToCSV = (type) => {
    let csvContent = "";
    let filename = "";

    if (type === "monthly") {
      csvContent = "Period,Amount,Status,Paid At\n";
      filteredMonthlyRevenues.forEach((rev) => {
        const row = [
          `${rev.month}/${rev.year}`,
          rev.totalAmount.toFixed(2),
          rev.paid ? "Paid" : "Pending",
          rev.paidAt ? format(new Date(rev.paidAt), "yyyy-MM-dd HH:mm") : "",
        ].join(",");
        csvContent += row + "\n";
      });
      filename = `monthly_revenue_${format(new Date(), "yyyyMMdd")}.csv`;
    } else {
      csvContent = "Date,Subject,Invoice,Courses,Share Ratio,Amount,Status\n";
      filteredDetailedRevenues.forEach((detail) => {
        const row = [
          format(new Date(detail.createdAt), "yyyy-MM-dd"),
          detail.subject?.title || "N/A",
          detail.subscription?.invoiceNumber || "N/A",
          `${detail.courseCount}/${detail.totalCoursesInSubject}`,
          detail.shareRatio,
          detail.amount.toFixed(2),
          detail.status,
        ].join(",");
        csvContent += row + "\n";
      });
      filename = `detailed_revenue_${format(new Date(), "yyyyMMdd")}.csv`;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination
  const totalPages = Math.ceil(filteredDetailedRevenues.length / itemsPerPage);
  const paginatedDetailedRevenues = filteredDetailedRevenues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate filter options
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const monthNames = [
    { value: "1", label: "Janvier" },
    { value: "2", label: "Février" },
    { value: "3", label: "Mars" },
    { value: "4", label: "Avril" },
    { value: "5", label: "Mai" },
    { value: "6", label: "Juin" },
    { value: "7", label: "Juillet" },
    { value: "8", label: "Août" },
    { value: "9", label: "Septembre" },
    { value: "10", label: "Octobre" },
    { value: "11", label: "Novembre" },
    { value: "12", label: "Décembre" },
  ];

  return (
    <TooltipProvider>
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <Card>
            <CardHeader>
              <CardTitle>Tableau de Bord des Revenus</CardTitle>
              <CardDescription>
                <p>
                  Consultez l'historique de vos revenus et les détails des
                  transactions
                </p>
                <div className="flex gap-3 justify-end">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full md:w-auto"
                  >
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                      <TabsTrigger value="transactions">
                        Transactions
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Button
                    variant="outline"
                    onClick={() => dispatch(fetchTeacherRevenueHistory())}
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                  <Button
                    onClick={() =>
                      exportToCSV(
                        activeTab === "overview" ? "monthly" : "detailed"
                      )
                    }
                    disabled={
                      activeTab === "overview"
                        ? filteredMonthlyRevenues.length === 0
                        : filteredDetailedRevenues.length === 0
                    }
                    variant="secondary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV
                  </Button>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTab === "overview" ? (
                <>
                  {/* Stats Overview */}
                  <Card className="lg:col-span-3">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" />
                        Vue d'ensemble des revenus
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              Résumé de vos revenus totaux et de leur
                              répartition
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Revenu Total
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-blue-600" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-blue-800">
                              {loading ? (
                                <Skeleton className="h-8 w-24" />
                              ) : (
                                `${metrics.totalRevenue.toFixed(2)} MAD`
                              )}
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-green-50 to-green-100">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Revenu Payé
                            </CardTitle>
                            <Badge
                              variant="default"
                              className="h-4 w-4 bg-green-500"
                            />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-800">
                              {loading ? (
                                <Skeleton className="h-8 w-24" />
                              ) : (
                                `${metrics.paidRevenue.toFixed(2)} MAD`
                              )}
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              En Attente
                            </CardTitle>
                            <Badge variant="secondary" className="h-4 w-4" />
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-yellow-800">
                              {loading ? (
                                <Skeleton className="h-8 w-24" />
                              ) : (
                                `${metrics.pendingRevenue.toFixed(2)} MAD`
                              )}
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                              Évolution Annuelle
                            </CardTitle>
                            {metrics.revenueChange >= 0 ? (
                              <ArrowUp className="h-4 w-4 text-purple-600" />
                            ) : (
                              <ArrowDown className="h-4 w-4 text-purple-600" />
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-purple-800">
                              {loading ? (
                                <Skeleton className="h-8 w-24" />
                              ) : (
                                `${Math.abs(metrics.revenueChange).toFixed(1)}%`
                              )}
                            </div>
                            <p
                              className={`text-sm ${
                                metrics.revenueChange >= 0
                                  ? "text-purple-600"
                                  : "text-purple-600"
                              } mt-2`}
                            >
                             par rapport au mois dernier
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-6">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <LineChart className="h-5 w-5" />
                          Revenu Journalier
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="flex items-center justify-center h-full">
                            <Skeleton className="h-8 w-8 animate-spin" />
                          </div>
                        ) : (
                          <Line data={lineChartData} options={chartOptions} />
                        )}
                      </CardContent>
                    </Card>
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart2 className="h-5 w-5" />
                          Revenus Mensuels
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {loading ? (
                          <div className="flex items-center justify-center h-full">
                            <Skeleton className="h-8 w-8 animate-spin" />
                          </div>
                        ) : (
                          <Line
                            data={monthlyChartData}
                            options={chartOptions}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Détails des Transactions
                        </CardTitle>
                        <Button variant="ghost" onClick={handleResetFilters}>
                          Réinitialiser les Filtres
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Année
                          </label>
                          <Select
                            value={filters.year}
                            onValueChange={(value) =>
                              handleFilterChange("year", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Toutes les Années" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="a">
                                Toutes les Années
                              </SelectItem>
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mois
                          </label>
                          <Select
                            value={filters.month}
                            onValueChange={(value) =>
                              handleFilterChange("month", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tous les Mois" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="a">Tous les Mois</SelectItem>
                              {monthNames.map((month) => (
                                <SelectItem
                                  key={month.value}
                                  value={month.value}
                                >
                                  {month.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Statut
                          </label>
                          <Select
                            value={filters.status}
                            onValueChange={(value) =>
                              handleFilterChange("status", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tous les Statuts" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="a">
                                Tous les Statuts
                              </SelectItem>
                              <SelectItem value="paid">Payé</SelectItem>
                              <SelectItem value="pending">
                                En attente
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <div>
                              <h3 className="font-medium">Erreur</h3>
                              <p className="text-sm">{error}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      {loading ? (
                        <div className="space-y-4">
                          {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                          ))}
                        </div>
                      ) : filteredDetailedRevenues.length === 0 ? (
                        <div className="text-center py-12 space-y-2">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="text-lg font-medium text-gray-900">
                            Aucune transaction trouvée
                          </h3>
                          <p className="text-sm text-gray-500">
                            Ajustez vos filtres ou critères de recherche
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader className="bg-gray-50">
                                <TableRow>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Discipline</TableHead>
                                  <TableHead className="text-right">
                                    Montant
                                  </TableHead>
                                  <TableHead>Statut</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {paginatedDetailedRevenues.map((detail) => (
                                  <TableRow
                                    key={detail._id}
                                    className="hover:bg-gray-50"
                                  >
                                    <TableCell>
                                      {format(
                                        new Date(detail.createdAt),
                                        "yyyy-MM-dd"
                                      )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                      {detail.subject?.title || "N/A"}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                      {detail.amount.toFixed(2)} MAD
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          detail.status === "paid"
                                            ? "default"
                                            : "secondary"
                                        }
                                      >
                                        {detail.status === "paid"
                                          ? "Payé"
                                          : "En attente"}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="text-sm text-muted-foreground">
                              Affichage de{" "}
                              {(currentPage - 1) * itemsPerPage + 1} à{" "}
                              {Math.min(
                                currentPage * itemsPerPage,
                                filteredDetailedRevenues.length
                              )}{" "}
                              sur {filteredDetailedRevenues.length} entrées
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.max(prev - 1, 1)
                                  )
                                }
                                disabled={currentPage === 1}
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                  )
                                }
                                disabled={currentPage === totalPages}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TeacherRevenueHistory;
