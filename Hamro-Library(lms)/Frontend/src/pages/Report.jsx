import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Nav from "../component/Nav";
import { CalendarDays, FileText } from "lucide-react";
import Card from "../component/Card";
import PopUp from "../component/PopUp";
import Footer from "../component/Footer";
import { useNavigate } from "react-router-dom";

const Report = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [returns, setReturns] = useState([]);
  const [dataReports, setDataReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  // Fetch all data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksRes, issuesRes, returnsRes, reportsRes] = await Promise.all([
          fetch("http://localhost/copy/api/books/get.php"),
          fetch("http://localhost/copy/api/issue/get.php"),
          fetch("http://localhost/copy/api/return/get.php"),
          fetch("http://localhost/copy/api/reports/get.php"),
        ]);

        const [booksData, issuesData, returnsData, reportsData] = await Promise.all([
          booksRes.json(),
          issuesRes.json(),
          returnsRes.json(),
          reportsRes.json(),
        ]);

        setBooks(booksData);
        setIssues(issuesData);
        setReturns(returnsData);

        // Map DB fields to match frontend report structure
        setDataReports(
          Array.isArray(reportsData)
            ? reportsData.map((r) => ({
                id: r.id,
                type: r.report_type,
                detail: r.description,
                date:  r.created_at, // Use report_date if available
              }))
            : [],
        );
      } catch (err) {
        console.error("Error fetching report data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const reportCard = [
    { title: "Total Books",path:'/books', value: books.length, color: "text-blue-700" },
    { title: "Issued Books",path:'/issue', value: issues.length, color: "text-orange-600" },
    { title: "Returned Books",path:'/return', value: returns.length, color: "text-green-600" },
  ];

  const openPopUp = (report) => {
    setData(report);
    setOpen(true);
  };

  const closePopUp = () => {
    setOpen(false);
    setData(null);
  };

  // Helper function to format date to YYYY-MM-DD for comparison
  const formatDateForComparison = (dateString) => {
    if (!dateString) return "";
    
    // Handle different date formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Filter reports by date range
  const filteredReports = dataReports.filter((report) => {
    // If no date filters are set, show all reports
    if (!startDate && !endDate) return true;

    const reportDate = formatDateForComparison(report.date);
    if (!reportDate) return false;

    // Compare dates
    if (startDate && endDate) {
      return reportDate >= startDate && reportDate <= endDate;
    } else if (startDate) {
      return reportDate >= startDate;
    } else if (endDate) {
      return reportDate <= endDate;
    }
    
    return true;
  });

  // Alternative filtering method using Date objects
  const filteredReportsAlternative = dataReports.filter((report) => {
    if (!startDate && !endDate) return true;

    const reportDateObj = new Date(report.date);
    if (isNaN(reportDateObj.getTime())) return false;

    // Reset time part for accurate date comparison
    reportDateObj.setHours(0, 0, 0, 0);

    if (startDate) {
      const startDateObj = new Date(startDate);
      startDateObj.setHours(0, 0, 0, 0);
      if (reportDateObj < startDateObj) return false;
    }

    if (endDate) {
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999); // Include the entire end day
      if (reportDateObj > endDateObj) return false;
    }

    return true;
  });

  // Use the alternative filtering method (more reliable)
  const finalFilteredReports = filteredReportsAlternative;

  // Clear date filters
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex pt-17">
        <Nav />
        <div className="flex-1 p-6">
          {/* Date Filter */}
          <div className="flex flex-col md:flex-row bg-gray-200 justify-between items-start md:items-center gap-4 p-4 rounded-lg mb-6">
            <h1 className="text-2xl font-semibold">Reports</h1>
            
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex gap-2 bg-white px-3 py-2 rounded-lg shadow items-center">
                <CalendarDays className="text-gray-500" size={18} />
                <input
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  type="date"
                  className="outline-none text-sm"
                  placeholder="Start Date"
                />
              </div>
              
              <span className="text-gray-500 hidden sm:block">to</span>
              
              <div className="flex gap-2 bg-white px-3 py-2 rounded-lg shadow items-center">
                <CalendarDays className="text-gray-500" size={18} />
                <input
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  type="date"
                  className="outline-none text-sm"
                  placeholder="End Date"
                />
              </div>
              
              {(startDate || endDate) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Report Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {reportCard.map((card) => (
              <Card  key={card.title}  onClick={() =>navigate(card.path)} {...card} />
            ))}
          </section>

          {/* Filter Info */}
          {(startDate || endDate) && (
            <div className="mb-4 text-sm text-gray-600">
              Showing reports from {startDate || "the beginning"} to {endDate || "today"}
              <span className="ml-2 font-semibold">
                ({finalFilteredReports.length} reports found)
              </span>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Report ID</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      Loading reports...
                    </td>
                  </tr>
                ) : finalFilteredReports.length > 0 ? (
                  finalFilteredReports.map((d) => (
                    <tr key={d.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{d.id}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          d.type === 'Issued Books' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {d.type}
                        </span>
                      </td>
                      <td className="p-3">{d.detail}</td>
                      <td className="p-3">{d.date}</td>
                      {/* {console.log(d)} */}
                      <td className="p-3">
                        <button
                          onClick={() => openPopUp(d)}
                          className="flex gap-1 cursor-pointer items-center text-blue-600 hover:underline"
                        >
                          <FileText size={18} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      {dataReports.length === 0 
                        ? "No reports found." 
                        : "No reports found for selected date range."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {finalFilteredReports.length > 0 && (
            <div className="mt-4 text-sm text-gray-600 text-right">
              Total: {finalFilteredReports.length} reports
            </div>
          )}
        </div>
      </div>

      {/* PopUp */}
      {open && (
        <PopUp title="Report Details" onclose={closePopUp}>
          <div className="space-y-3">
            <p>
              <span className="font-semibold">Report ID:</span> {data?.id}
            </p>
            <p>
              <span className="font-semibold">Type:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                data?.type === 'Issued Books' 
                  ? 'bg-orange-100 text-orange-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {data?.type}
              </span>
            </p>
            <p>
              <span className="font-semibold">Description:</span> {data?.detail}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {data?.date}
            </p>
          </div>
        </PopUp>
      )}

      <Footer />
    </div>
  );
};

export default Report;