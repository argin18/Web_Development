import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Nav from "../component/Nav";
import Card from "../component/Card";
import Footer from "../component/Footer";
import { BookOpen, Users, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [issues, setIssues] = useState([]);
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [recentIssues, setRecentIssues] = useState([]);
  const [recentMembers, setRecentMembers] = useState([]);
  const [recentReturns, setRecentReturns] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);

  const navigate =useNavigate();
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data from backend
      const [booksRes, membersRes, issuesRes, returnsRes] = await Promise.all([
        axios.get("http://localhost/copy/api/books/get.php"),
        axios.get("http://localhost/copy/api/members/get.php"),
        axios.get("http://localhost/copy/api/issue/get.php"),
        axios.get("http://localhost/copy/api/return/get.php"),
      ]);

      const booksData = Array.isArray(booksRes.data) ? booksRes.data : [];
      const membersData = Array.isArray(membersRes.data) ? membersRes.data : [];
      const issuesData = Array.isArray(issuesRes.data) ? issuesRes.data : [];
      const returnsData = Array.isArray(returnsRes.data) ? returnsRes.data : [];

      setBooks(booksData);
      setMembers(membersData);
      setIssues(issuesData);
      setReturns(returnsData);

      // Calculate overdue books
      const overdue = issuesData.filter(issue => {
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Parse Nepali date (assuming format YYYY-MM-DD)
          const [year, month, day] = issue.dueDate.split('-').map(Number);
          // This is a simplified check - you might need a proper Nepali date library
          const dueDate = new Date(`${year}-${month}-${day}`);
          dueDate.setHours(0, 0, 0, 0);
          
          return today > dueDate;
        } catch {
          return false;
        }
      });

      setOverdueBooks(overdue);

      // Set last 5 recent entries
      setRecentIssues(issuesData.slice(-5).reverse());
      setRecentMembers(membersData.slice(-5).reverse());
      setRecentReturns(returnsData.slice(-5).reverse());

      setError("");
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalBooks = books.length;
  const totalCopies = books.reduce((sum, book) => sum + (parseInt(book.quantity) || 1), 0);
  const availableCopies = books.reduce((sum, book) => sum + (parseInt(book.available) || 0), 0);
  const issuedBooks = issues.length;
  const totalMembers = members.length;
  const totalReturns = returns.length;
  
  // Books that are completely unavailable (all copies issued)
  const unavailableBooks = books.filter(book => (parseInt(book.available) || 0) === 0).length;
  
  // Books with low stock (less than 3 copies available)
  const lowStockBooks = books.filter(book => {
    const available = parseInt(book.available) || 0;
    return available > 0 && available < 3;
  }).length;

  const cardData = [
    { 
      title: "Total Books", 
      value: totalBooks, 
      subtitle: `${totalCopies} total copies`,
      color: "text-blue-700",
      path:'/books',
      icon: <BookOpen className="text-blue-500" size={24} />
    },
    { 
      title: "Available Books", 
      value: availableCopies, 
      subtitle: `${unavailableBooks} books unavailable`,
      color: "text-green-600",
      path:'/books',
      icon: <CheckCircle className="text-green-500" size={24} />
    },
    { 
      title: "Issued Books", 
      value: issuedBooks, 
      subtitle: `${overdueBooks.length} overdue`,
      color: "text-orange-600",
      path:'/issue',
      icon: <Clock className="text-orange-500" size={24} />
    },
    { 
      title: "Total Members", 
      value: totalMembers, 
      subtitle: `${recentMembers.length} new this month`,
      color: "text-purple-600",
      path:'/member',
      icon: <Users className="text-purple-500" size={24} />
    },
  ];

  // Get book details by ID
  const getBookDetails = (bookId) => {
    const book = books.find(b => b.id == bookId);
    return book ? {
      name: book.Bname,
      author: book.Bauthor,
      available: book.available || 0,
      total: book.quantity || 1
    } : null;
  };

  // Get member details by ID
  const getMemberDetails = (memberId) => {
    const member = members.find(m => m.id == memberId);
    return member ? member.Mname : 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex pt-17">
          <Nav />
          <main className="flex-1 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading dashboard...</p>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex pt-17">
        <Nav />

        <main className="flex-1 p-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Stats Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {cardData.map((card) => (
              // <Card key={card.title} onClick={()=> navigate(card.path)} {...card} />
              <div key={card.title}  onClick={() => navigate(card.path) } className="bg-white cursor-pointer rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-gray-600 font-medium">{card.title}</h4>
                  {card.icon}
                </div>
                <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                {card.subtitle && (
                  <p className="text-sm text-gray-500 mt-1">{card.subtitle}</p>
                )}
              </div>
            ))}
          </section>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="text-gray-600 font-medium mb-2">Book Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Copies:</span>
                  <span className="font-semibold">{totalCopies}</span>
                </div>
                <div className="flex justify-between">
                  <span>Available:</span>
                  <span className="font-semibold text-green-600">{availableCopies}</span>
                </div>
                <div className="flex justify-between">
                  <span>Issued:</span>
                  <span className="font-semibold text-orange-600">{issuedBooks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unavailable:</span>
                  <span className="font-semibold text-red-600">{unavailableBooks}</span>
                </div>
                <div className="flex justify-between">
                  <span>Low Stock (&lt;3):</span>
                  <span className="font-semibold text-yellow-600">{lowStockBooks}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="text-gray-600 font-medium mb-2">Issue Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Issued:</span>
                  <span className="font-semibold">{issues.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overdue:</span>
                  <span className="font-semibold text-red-600">{overdueBooks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>On Time:</span>
                  <span className="font-semibold text-green-600">{issues.length - overdueBooks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Returns:</span>
                  <span className="font-semibold">{returns.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h4 className="text-gray-600 font-medium mb-2">Quick Actions</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => navigate('/src/pages/Books.jsx')}
                  className="w-full text-left px-3 py-2 cursor-pointer bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                >
                   Manage Books
                </button>
                <button 
                  onClick={() => navigate('/src/pages/Issue.jsx')}
                  className="w-full text-left px-3 py-2 cursor-pointer bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                >
                   Issue Books
                </button>
                <button 
                  onClick={() =>navigate('/src/pages/Return.jsx')}
                  className="w-full text-left px-3 py-2 cursor-pointer bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100"
                >
                   Return Books
                </button>
              </div>
            </div>
          </div>

          {/* Overdue Books Alert */}
          {overdueBooks.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="text-red-500 mr-3" size={24} />
                <div>
                  <h3 className="font-semibold text-red-700">Overdue Books Alert</h3>
                  <p className="text-sm text-red-600">
                    {overdueBooks.length} book(s) are overdue. Please collect them immediately.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Low Stock Alert */}
          {lowStockBooks > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="text-yellow-500 mr-3" size={24} />
                <div>
                  <h3 className="font-semibold text-yellow-700">Low Stock Alert</h3>
                  <p className="text-sm text-yellow-600">
                    {lowStockBooks} book(s) have less than 3 copies available. Consider ordering more.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recently Issued Books */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Clock size={24} />
              Recently Issued Books
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">Book ID</th>
                    <th className="p-3 text-left">Book Name</th>
                    <th className="p-3 text-left">Member ID</th>
                    <th className="p-3 text-left">Member Name</th>
                    <th className="p-3 text-left">Issue Date</th>
                    <th className="p-3 text-left">Due Date</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentIssues.length ? (
                    recentIssues.map((issue) => {
                      const book = getBookDetails(issue.bookid);
                      const isOverdue = () => {
                        try {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const [year, month, day] = issue.dueDate.split('-').map(Number);
                          const dueDate = new Date(`${year}-${month}-${day}`);
                          dueDate.setHours(0, 0, 0, 0);
                          return today > dueDate;
                        } catch {
                          return false;
                        }
                      };
                      const overdue = isOverdue();

                      return (
                        <tr key={issue.id} className="border-t">
                          <td className="p-3">{issue.bookid}</td>
                          <td className="p-3">{book?.name || 'Unknown'}</td>
                          <td className="p-3">{issue.userId}</td>
                          <td className="p-3">{getMemberDetails(issue.userId)}</td>
                          <td className="p-3">{issue.issuedAt}</td>
                          <td className="p-3">{issue.dueDate}</td>
                          <td className="p-3">
                            {overdue ? (
                              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">
                                Overdue
                              </span>
                            ) : (
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                                Issued
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center p-4 text-gray-500">
                        No issued books found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recently Added Members */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Users size={24} />
              Recently Added Members
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">Member ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left">Address</th>
                    <th className="p-3 text-left">Joined Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMembers.length ? (
                    recentMembers.map((m) => (
                      <tr key={m.id} className="border-t">
                        <td className="p-3">{m.id}</td>
                        <td className="p-3 font-medium">{m.Mname}</td>
                        <td className="p-3">{m.Memail}</td>
                        <td className="p-3">{m.Mphone}</td>
                        <td className="p-3">{m.Maddress}</td>
                        <td className="p-3">{new Date(m.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500">
                        No members found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent Returns */}
          <section>
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <CheckCircle size={24} />
              Recent Returns
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg shadow">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3 text-left">Return ID</th>
                    <th className="p-3 text-left">Issue ID</th>
                    <th className="p-3 text-left">Book ID</th>
                    <th className="p-3 text-left">Member ID</th>
                    <th className="p-3 text-left">Return Date</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReturns.length ? (
                    recentReturns.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="p-3">{r.id}</td>
                        <td className="p-3">{r.issue_id}</td>
                        <td className="p-3">{r.bookid}</td>
                        <td className="p-3">{r.userId}</td>
                        <td className="p-3">{new Date(r.return_date).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            r.return_status === 'overdue' 
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {r.return_status || 'On Time'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center p-4 text-gray-500">
                        No returns found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;