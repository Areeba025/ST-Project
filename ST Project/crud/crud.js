let bugCount = 1; // To keep track of bug row IDs

// Add New Bug
document.getElementById('addBug').addEventListener('click', function () {
    const table = document.querySelector('#bugsTable tbody');
    bugCount++;
    
    const newRow = `
        <tr>
            <td>${bugCount}</td>
            <td>New Bug</td>
            <td>New Description</td>
            <td>
                <select class="platform-dropdown">
                    <option value="Mobile">Mobile</option>
                    <option value="Web">Web</option>
                </select>
            </td>
            <td>Category</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td><input type='file' multiple onchange='previewImages(this)'></td>
            <td>
                <button class="btn-edit" onclick="editBug(this)">Edit</button>
                <button class="btn-delete" onclick="deleteBug(this)">Delete</button>
            </td>
        </tr>
    `;
    table.insertAdjacentHTML('beforeend', newRow);
});


// Edit Bug
function editBug(button) {
    const row = button.closest('tr');
    const cells = row.querySelectorAll('td');
    
    cells[1].innerHTML = `<input type='text' value='${cells[1].textContent}'>`;
    cells[2].innerHTML = `<input type='text' value='${cells[2].textContent}'>`;
    cells[3].innerHTML = `
        <select class="platform-dropdown">
            <option value="Mobile" ${cells[3].textContent === 'Mobile' ? 'selected' : ''}>Mobile</option>
            <option value="Web" ${cells[3].textContent === 'Web' ? 'selected' : ''}>Web</option>
        </select>
    `;
    cells[4].innerHTML = `<input type='text' value='${cells[4].textContent}'>`;

    button.textContent = 'Save';
    button.onclick = () => saveBug(button);
}


// Save Bug
function saveBug(button) {
    const row = button.closest('tr');
    const inputs = row.querySelectorAll('input, select');
    const cells = row.querySelectorAll('td');
    
    cells[1].textContent = inputs[0].value;
    cells[2].textContent = inputs[1].value;
    cells[3].textContent = inputs[2].value; // Dropdown value
    cells[4].textContent = inputs[3].value;

    button.textContent = 'Edit';
    button.onclick = () => editBug(button);
}


// Delete Bug
function deleteBug(button) {
    if (confirm('Are you sure you want to delete this bug?')) {
        button.closest('tr').remove();
    }
}

// Preview Images
function previewImages(input) {
    const files = input.files;
    const container = input.parentNode;
    container.innerHTML = '';
    for (let file of files) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '50px';
            img.style.margin = '5px';
            container.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}

// Save Table as PDF
document.getElementById('savePDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.autoTable({
        html: '#bugsTable', // Select the table
        startY: 10, // Optional: Start position of the table
        theme: 'striped', // Optional: Theme for the table
    });
    doc.save('bugs_report.pdf'); // Save the PDF with the specified filename
});

// Save Table as Excel
document.getElementById('saveExcel').addEventListener('click', () => {
    const table = document.getElementById('bugsTable');
    const wb = XLSX.utils.table_to_book(table, { sheet: "Bugs Report" });
    XLSX.writeFile(wb, 'bugs_report.xlsx');
});

