// Event listener for the "Submit Bug Report" button
document.getElementById("submit-btn").addEventListener("click", () => {
    // Collecting all form values into an object
    const bugReport = {
        id: document.getElementById("bug-id").value,
        status: document.getElementById("status").value,
        platform: document.getElementById("platform").value,
        severity: document.getElementById("severity").value,
        module: document.getElementById("module").value,
        fromDate: document.getElementById("from-date").value,
        toDate: document.getElementById("to-date").value,
        images: document.getElementById("image-upload").files // Collecting the image files
    };

    // Validate form data: Check if any field is empty
    if (Object.values(bugReport).includes("") || bugReport.images.length === 0) {
        alert("Please fill all fields and upload at least one image!"); // Show alert if form is incomplete
        return;
    }

    // Get the table body to append the new report row
    const tableBody = document.querySelector("#report-table tbody");
    const row = document.createElement("tr"); // Create a new row for the table

    // Populate the row with the bug report data
    Object.values(bugReport).slice(0, -1).forEach(value => { // Exclude images from this loop
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    // Add images to the row
    const imagesCell = document.createElement("td");
    Array.from(bugReport.images).forEach(file => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file); // Display the image
        imagesCell.appendChild(img);
    });
    row.appendChild(imagesCell);

    // Create "Actions" column with Edit and Delete buttons
    const actionsCell = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () => editBugReport(row));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", () => deleteBugReport(row));

    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    row.appendChild(actionsCell);
    tableBody.appendChild(row);

    // Clear the form for the next input
    document.getElementById("bug-report-form").reset();
    document.getElementById("image-preview").innerHTML = ""; // Clear image preview
});

// Edit functionality: Pre-fill the form with the existing data from the row
function editBugReport(row) {
    const cells = row.querySelectorAll("td");
    document.getElementById("bug-id").value = cells[0].textContent;
    document.getElementById("status").value = cells[1].textContent;
    document.getElementById("platform").value = cells[2].textContent;
    document.getElementById("severity").value = cells[3].textContent;
    document.getElementById("module").value = cells[4].textContent;
    document.getElementById("from-date").value = cells[5].textContent;
    document.getElementById("to-date").value = cells[6].textContent;
    
    // Images handling (just an example, you'd ideally want to add preview logic)
}

// Delete functionality: Remove the row from the table
function deleteBugReport(row) {
    row.remove();
}

// Image preview logic
document.getElementById("image-upload").addEventListener("change", event => {
    const preview = document.getElementById("image-preview");
    preview.innerHTML = ""; // Clear previous previews

    Array.from(event.target.files).forEach(file => {
        const img = document.createElement("img");
        img.src = URL.createObjectURL(file); // Create image preview
        preview.appendChild(img);
    });
});

document.getElementById("export-pdf-btn").addEventListener("click", () => {
    const { jsPDF } = window.jspdf; // Ensure jsPDF is accessed from the window object
    const doc = new jsPDF();

    // Get the table and rows
    const table = document.getElementById("report-table");
    const rows = [];

    // Extract headers (you can also customize this if you want more specific headers)
    const header = ["ID", "Status", "Platform", "Severity", "Module", "From Date", "To Date", "Images", "Actions"];
    rows.push(header); // Push headers to the rows array

    // Extract table rows (excluding the header)
    const tableRows = table.querySelectorAll("tbody tr");
    tableRows.forEach(row => {
        const rowData = Array.from(row.querySelectorAll("td")).map(cell => cell.textContent || cell.innerText);
        rows.push(rowData); // Push row data to the rows array
    });

    // Use autoTable to add the rows to the PDF
    doc.autoTable({
        head: [header],  // Table header
        body: rows.slice(1),  // Table rows (excluding header)
    });

    // Save the PDF with the name 'bug-report.pdf'
    doc.save("bug-report.pdf");
});


document.getElementById("export-excel-btn").addEventListener("click", () => {
    const table = document.getElementById("report-table");
    const tableRows = table.querySelectorAll("tbody tr");

    // Create an array of rows for the Excel file
    let rows = [];
    tableRows.forEach(row => {
        const rowData = Array.from(row.querySelectorAll("td")).map(cell => cell.textContent || cell.innerText);
        rows.push(rowData);
    });

    // Create a workbook and add the data
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["ID", "Status", "Platform", "Severity", "Module", "From Date", "To Date", "Images", "Actions"], ...rows]);
    XLSX.utils.book_append_sheet(wb, ws, "Bug Report");

    // Export the workbook as an Excel file
    XLSX.writeFile(wb, "bug-report.xlsx");
});

