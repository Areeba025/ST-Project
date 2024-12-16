// Apply filters to the report table
function applyFilters() {
    const projectFilter = document.getElementById('filterProject').value;
    const platformFilter = document.getElementById('filterPlatform').value;
    const statusFilter = document.getElementById('filterStatus').value;

    const rows = document.querySelectorAll('#reportTable tbody tr');

    rows.forEach(row => {
        const project = row.cells[0].innerText;
        const platform = row.cells[1].innerText;
        const status = row.cells[2].innerText;

        const matchProject = projectFilter === "all" || projectFilter === project;
        const matchPlatform = platformFilter === "all" || platformFilter === platform;
        const matchStatus = statusFilter === "all" || statusFilter === status;

        if (matchProject && matchPlatform && matchStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Export table to PDF using jsPDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Set title for the PDF
    pdf.setFontSize(16);
    pdf.text('Report Summary', 15, 15);

    // Set font size for the table
    pdf.setFontSize(10);

    // Use autoTable plugin to add the table to the PDF
    pdf.autoTable({
        html: '#reportTable',  // Target the table by its ID
        startY: 25,            // Set the starting Y position for the table
        theme: 'grid',         // Apply grid style to the table
    });

    // Save the generated PDF
    pdf.save('report_summary.pdf');
}


// Export table to Excel
function exportToExcel() {
    const table = document.getElementById('reportTable');
    let tableHTML = table.outerHTML.replace(/ /g, '%20');
    const a = document.createElement('a');

    const fileName = 'report_summary.xlsx';
    a.href = 'data:application/vnd.ms-excel,' + tableHTML;
    a.download = fileName;
    a.click();
}

