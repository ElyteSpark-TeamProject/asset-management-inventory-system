import { useEffect, useMemo, useState } from "react";
import { Search, Download, BarChart } from "lucide-react";
import { Asset } from "../types/asset";
import { fetchAssets } from "../api/assets";

// ==========================================
// MEMBER 6: REPORTS PAGE (FRONTEND)
// Task: Search bar + category/status filters + "Export to CSV" for the
// asset inventory.
//
// How it works:
// 1. On page load, fetch every asset once so we can build the category
//    dropdown and have data to show immediately.
// 2. As the user types in the search box or changes a dropdown, we ask
//    the backend to filter (via query params, coordinated with Member 2's
//    Asset routes) AND filter again on the frontend, so the page keeps
//    working correctly even before/if the backend ignores those params.
// 3. "Export to CSV" turns whatever rows are currently visible into a
//    downloadable .csv file.
// ==========================================

const STATUS_OPTIONS = ["All", "Available", "Assigned", "Maintenance", "Retired"];

export default function Reports() {
  const [allAssets, setAllAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Load the full asset list once, when the page first opens.
  useEffect(() => {
    let isCancelled = false;
    async function loadInitialAssets() {
      setIsLoading(true);
      const data = await fetchAssets();
      if (isCancelled) return;
      setAllAssets(data);
      setFilteredAssets(data);
      setIsLoading(false);
    }
    loadInitialAssets();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Re-run the search/filter whenever the user changes search text or a
  // dropdown. A small delay (debounce) stops us from sending a network
  // request on every single keystroke.
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      applyFilters();
    }, 400);

    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, categoryFilter, statusFilter, allAssets]);

  async function applyFilters() {
    // Ask the backend to filter first (coordinated with Member 2's Asset
    // routes: GET /api/assets?search=...&category=...).
    const category = categoryFilter === "All" ? undefined : categoryFilter;
    const results = await fetchAssets({ search: searchTerm, category });

    // Also filter on the frontend so search/category/status all work
    // together, and so the page behaves correctly even if the backend
    // ignores the query params or the mock data fallback is being used.
    const finalResults = results.filter((asset) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.serialNumber ?? "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "All" || asset.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || asset.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    setFilteredAssets(finalResults);
  }

  // Build the list of category options from the full asset list, so the
  // dropdown always matches whatever categories actually exist.
  const categoryOptions = useMemo(() => {
    const unique = new Set(allAssets.map((asset) => asset.category));
    return ["All", ...Array.from(unique)];
  }, [allAssets]);

  function handleClearFilters() {
    setSearchTerm("");
    setCategoryFilter("All");
    setStatusFilter("All");
  }

  // Converts the currently visible rows into a CSV file and downloads it.
  function handleExportToCsv() {
    if (filteredAssets.length === 0) {
      alert("There is nothing to export. Try changing your search or filters.");
      return;
    }

    const headers = ["Serial Number", "Name", "Category", "Status", "Purchase Date"];

    const rows = filteredAssets.map((asset) => [
      asset.serialNumber ?? "N/A",
      asset.name,
      asset.category,
      asset.status,
      asset.purchaseDate ?? "N/A",
    ]);

    // Wrap every value in quotes so commas inside a value (e.g. names)
    // don't break the CSV columns.
    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `asset-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Asset Reports</h1>
          <p className="text-gray-500 mt-1">Search, filter, and export the company asset inventory.</p>
        </div>
        <button
          type="button"
          onClick={handleExportToCsv}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 hover:bg-blue-700 font-medium shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" /> Export to CSV
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center">
        <div className="relative flex-1 min-w-[220px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or serial number..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-white"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category === "All" ? "All Categories" : category}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === "All" ? "All Statuses" : status}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleClearFilters}
          className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
        >
          Clear Filters
        </button>
      </div>

      <p className="text-sm text-gray-500">
        {isLoading ? "Loading assets..." : `Showing ${filteredAssets.length} of ${allAssets.length} assets`}
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Serial Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Purchase Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.serialNumber ?? "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          asset.status === "Available"
                            ? "bg-green-100 text-green-800"
                            : asset.status === "Assigned"
                            ? "bg-blue-100 text-blue-800"
                            : asset.status === "Maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.purchaseDate ?? "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <BarChart className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-900">No assets match your search/filters.</p>
              <p className="text-sm mt-1">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
