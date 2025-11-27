document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.querySelector("#expense-form");
  const list = document.querySelector("#expense-list");
  const totalAmt = document.querySelector("#total-amount");
  const filterCategory = document.querySelector("#filter-category");

  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let editId = null;
  document.querySelector("#expense-name").focus();
  // Displaying espenses
  const display = (expenses) => {
    list.innerHTML = "";
    expenses.forEach((expense) => {
      let tr = document.createElement("tr");
    //   tr.classList.toggle("color", editId===expense.id);
      if (editId === expense.id) tr.classList.add("color");
      tr.innerHTML = `<td>${expense.name}</td>
    <td>${expense.amount.toFixed(2)}</td>
    <td>${expense.category}</td>
    <td>${expense.date}</td> 
    <td>
         <button class="edit-btn" data-id="${expense.id}">Edit</button>
     <button class="delete-btn" data-id="${expense.id}">Delete</button>
     </td> `;
      list.appendChild(tr);
    });
  };

  // updating total amount
  const update = () => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    totalAmt.textContent = total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  // save storage
  const saveExpense = () => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  };
  // showing saved expenses
  display(expenses);
  update();

  // stopping browser refresing JSON.parse(localStorage.getItem("expenses"))
  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const eNameInput = document.querySelector("#expense-name");
    const amountInput = document.querySelector("#expense-amount");
    const categoryInput = document.querySelector("#expense-category");
    const dateInput = document.querySelector("#expense-date");

    [eNameInput, amountInput, categoryInput, dateInput].forEach((input) =>
      input.classList.remove("error")
    );

    const eName = eNameInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    // checking invalid
    const invalid = [];
    const p = document.querySelector("#invalid");
    p.innerHTML = "";
    if (!eName) {
      invalid.push("Expense Name");
      eNameInput.classList.add("error");
    }
    if (!amountInput.value || isNaN(amount) || amount <= 0) {
      invalid.push("Amount");
      amountInput.classList.add("error");
    }
    if (!category) {
      invalid.push("Category");
      categoryInput.classList.add("error");
    }
    if (!date) {
      invalid.push("Date");
      dateInput.classList.add("error");
    }

    if (invalid.length > 0) {
      p.innerHTML = `Please fill the: ${invalid.join(
        ", "
      )} FIELDS CORRECTLY..!`;
      document.querySelector(".error").focus();
      return;
    }

    // checking editing
    if (editId !== null) {
      const ind = expenses.findIndex((e) => e.id === editId);
      expenses[ind] = {
        id: editId,
        name: eName,
        amount,
        category,
        date,
      };
      editId = null;
    } else {
      expenses.push({
        id: Date.now(),
        name: eName,
        amount,
        category,
        date,
      });
    }

    // creating an object
    // const expense = {
    //   id: Date.now(),
    //   name: eName,
    //   amount: amount,
    //   category: category,
    //   date: date,
    // };

    saveExpense();
    display(expenses);
    update();
    expenseForm.reset();
  });

  // Adding list
  list.addEventListener("click", (e) => {
    // delete btn

    if (e.target.classList.contains("delete-btn")) {
      if (confirm("Are you sure you want to delete this expenses ?")) {
        const id = parseInt(e.target.dataset.id);
        expenses = expenses.filter((expense) => expense.id !== id);
        saveExpense();
        display(expenses);
        update();
      }
    }
    // edit btn
    if (e.target.classList.contains("edit-btn")) {
      const id = parseInt(e.target.dataset.id);
      const expense = expenses.find((expense) => expense.id === id);
      document.getElementById("expense-name").value = expense.name;
      document.getElementById("expense-amount").value = expense.amount;
      document.getElementById("expense-category").value = expense.category;
      document.getElementById("expense-date").value = expense.date;
      editId = id;
      //   expenses = expenses.filter((expense) => expense.id !== id);
      //   saveExpense();
      //   display(expenses);
      //   update();
    }
  });
  // filter categori
  filterCategory.addEventListener("change", (e) => {
    const category = e.target.value;
    let p = document.querySelector(".msg");
    p.innerHTML = "";
    if (category === "All") {
      display(expenses);
      update();
    } else {
      const filteredExpenses = expenses.filter(
        (expense) => expense.category === category
      );
      if (filteredExpenses.length === 0) {
        p.innerHTML = "No Expenses Found 💰😍";
        list.innerHTML = "";
        totalAmt.textContent = "0.00";
      } else {
        display(filteredExpenses);

        const total = filteredExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        totalAmt.textContent = total.toFixed(2);
      }
    }
  });
});
