import React, { useState, useEffect } from "react";
import Header from "../component/Header";
import Nav from "../component/Nav";
import { Search, RotateCcw } from "lucide-react";
import Footer from "../component/Footer";
import PopUp from "../component/PopUp";
import NepaliDate from "nepali-date-converter";
import axios from "axios";

const Return = () => {
  const todayBS = new NepaliDate(new Date()).format("YYYY-MM-DD");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [returnList, setReturnList] = useState([]);
  const [returns, setReturns] = useState([]);
  const [books, setBooks] = useState([]);
    const [members, setMembers] = useState([]);

  // Fetch issues from database
  useEffect(() => {
    fetchIssues();
    fetchReturns();
    fetchBooks();
    fetchMembers();
  }, []);

  // Only show issues that are not yet returned
const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost/copy/api/books/get.php");
      if (Array.isArray(res.data)) setBooks(res.data);
    } catch (err) {
      console.error("Fetch books error:", err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost/copy/api/members/get.php");
      if (Array.isArray(res.data)) setMembers(res.data);
    } catch (err) {
      console.error("Fetch members error:", err);
    }
  };

  const fetchIssues = async () => {
    try {
      const response = await fetch(
        "http://localhost/copy/api/issue/get.php",
      );
      const data = await response.json();
      setReturnList(data.filter((i) => i.status !== "returned"));
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const fetchReturns = async () => {
    try {
      const response = await fetch(
        "http://localhost/copy/api/return/get.php",
      );
      const data = await response.json();
      setReturns(data);
    } catch (error) {
      console.error("Error fetching returns:", error);
    }
  };

  const openPopUp = (issue) => {
    setData(issue);
    setOpen(true);
  };

  const closePopUp = () => {
    setOpen(false);
    setData(null);
  };

  const isOverdue = (d) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new NepaliDate(d).toJsDate();
    due.setHours(0, 0, 0, 0);

    return today > due;
  };

  const filteredData = returnList.filter(
    (i) =>
      i.userId?.toString().toLowerCase().includes(search.toLowerCase()) ||
      i.bookid?.toString().includes(search) ||
      i.id?.toString().includes(search),
  );

  const confirm = async () => {
  if (!data) return;

  try {
    const response = await fetch(
      "http://localhost/copy/api/return/add.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ issueId: data.id }),
      }
    );

    const result = await response.json();

    if (result.success) {

      //  Save return report in DB
      await fetch("http://localhost/copy/api/reports/add.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report_type: "Returned Books",
          description: `Book ID ${data.bookid} returned by User ${data.userId}`,
          report_date: new Date().toISOString().split("T")[0],
        }),
      });

      fetchIssues();
      fetchReturns();

      setOpen(false);
      setData(null);

    } else {
      alert("Error returning book: " + result.error);
    }

  } catch (error) {
    console.error("Error:", error);
    alert("Failed to return book.");
  }
};

const getBookDetails = (bookId) => {
    const book = books.find(b => b.id == bookId);
    return book ? `${book.Bname} ` : 'Unknown Book';
  };

  const getMemberDetails = (memberId) => {
    const member = members.find(m => m.id == memberId);
    return member ? member.Mname : 'Unknown Member';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex pt-17">
        <Nav />

        <div className="flex-1 p-6">
          {/* Top Bar */}
          <div className="flex bg-gray-200 justify-between items-center p-4 rounded-lg mb-4">
            <h1 className="text-2xl font-semibold">Return Books</h1>

            {/* Search */}
            <div className="flex gap-2 bg-white px-3 py-2 rounded-lg shadow items-center">
              <Search className="text-gray-500 cursor-pointer " />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search by User ID or Book ID"
                className="outline-none text-sm"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Issue ID</th>
                  <th className="p-3 text-left">User ID</th>
                  <th className="p-3 text-left hidden md:table-cell">Member</th>
                  <th className="p-3 text-left">Book ID</th>
                  <th className="p-3 text-left hidden md:table-cell">Book Details</th>
                  <th className="p-3 text-left">Issue Date</th>
                  <th className="p-3 text-left">Due Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((i) => (
                  <tr key={i.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{i.id}</td>
                    <td className="p-3">{i.userId}</td>
                    <td className="p-3 hidden md:table-cell text-sm">
                        {getMemberDetails(i.userId)}
                      </td>
                    <td className="p-3">{i.bookid}</td>
                    <td className="p-3 hidden md:table-cell text-sm">
                        {getBookDetails(i.bookid)}
                      </td>
                    <td className="p-3">{i.issuedAt || i.createdAt}</td>
                    <td className="p-3">{i.dueDate}</td>
                    <td className="p-3">
                      {isOverdue(i.dueDate) ? (
                        <p className="text-red-600 font-semibold">Overdue</p>
                      ) : (
                        <p className="text-green-600 font-semibold">On Time</p>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => openPopUp(i)}
                        title="Return Book"
                        className="flex gap-2 cursor-pointer items-center bg-green-600 text-white px-3 py-2 rounded-lg shadow hover:bg-green-700 active:scale-95"
                      >
                        <RotateCcw size={18} />
                        Return
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center p-4 text-gray-500">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* pop up */}
      {open && (
        <PopUp title="Confirm Book Return" onclose={closePopUp}>
          <p>
            Issue ID: <b>{data.id}</b>
          </p>
          {console.log(data)}
          <p>
            User ID: <b>{data.userId}</b>
          </p>
          <p>
            Book ID: <b>{data.bookid}</b>
          </p>
          <p>
            Due Date: <b>{data.dueDate}</b>
          </p>
          <button
            onClick={confirm}
            className="mt-4 bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Confirm Return
          </button>
        </PopUp>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Return;