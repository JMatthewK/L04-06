// src/js/spreadsheet.js
// DOM generation + jQuery interactivity + editing + summary updates

const sampleData = {
    students: ["Ava", "Noah", "Mia", "Liam", "Zoe", "Ethan", "Ivy", "Sam", "Kai", "Emma"],
    assessments: ["Lab 1", "Lab 2", "Lab 3", "Midterm", "Final"],
    grades: [
        [92, 85, 88, 79, 91],
        [76, 81, 74, 69, 72],
        [88, 90, 84, 93, 86],
        [63, 58, 71, 66, 60],
        [95, 92, 97, 89, 94],
        [82, 77, 80, 74, 79],
        [70, 73, 68, 72, 75],
        [55, 61, 59, 63, 58],
        [84, 86, 83, 81, 85],
        [91, 88, 90, 87, 92]
    ]
};



// de-selects every cell in the gradebook by removing the selected class
function deselectAll() {
    $('.selected').removeClass('selected');
}

// selects every non-header cell in the specified row (indexed starting with zero) 
function selectRow(rowIndex){
    deselectAll();

    // Skip the row header for the nth (rowIndex) row
    $('gradebook-table tr:eq(${rowIndex}) td').addClass("selected");
}
 
// selects every non-header cell in the specified column (indexed starting with zero)  
function selectColumn(colIndex){
    deselectAll();

    $(this).find('td:eq(${colIndex - 1})').addClass("selected");
}

// Event handlers for clicking the row and column headers

function createHeaderEvents(){
    // Column headers
    $("#gradebook-table th.column-header").each(function (colIndex){
        $(this.on("click", function (){
            selectColumn(colIndex);
        }));
    });

    // Row headers
    $("#gradebook-table th.row-header").each(function (rowIndex){
        $(this.on("click", function (){
            selectRow(rowIndex + 1);
        }));
    });
}

// Summary panels for updating
// what is selected
// count of valid numeric grades in selection
// mean average grade of the selection
// min and max grade of selection

function updateRowSummary(rowIndex){
    const matrix = convertToMatrix(sampleData);
    const values = getRow(matrix, rowIndex - 1);

    updateSummaryPanel("Row", sampleData.students[rowIndex - 1], values);
}

function updateSummaryForColumn(colIndex) {
    const matrix = convertToMatrix(sampleData);
    const values = getColumn(matrix, colIndex - 1);

    updateSummaryPanel("Column", sampleData.assessments[colIndex - 1], values);
}

// Function that both rows and columns use to update the summary panel
function updateSummaryPanel(type, label, values) {
    if (values.length === 0) {
        $("#selection-summary-text").text("Nothing selected.");
        return;
    }

    const count = values.length;
    const mean = (values.reduce((a, b) => a + b, 0) / count).toFixed(2);
    const min = Math.min(...values);
    const max = Math.max(...values);

    $("#selection-summary-text").html(`
        <strong>${type}:</strong> ${label}<br>
        Count: ${count}<br>
        Mean: ${mean}<br>
        Min: ${min}<br>
        Max: ${max}
    `);
}

// Code to make every non-header table cell editable

function makeCellsEditable() {
    // Select only td, not headers
    $("#gradebook-table td").on("click", function () {
        const cell = $(this);
        const oldValue = cell.text();

        // Replace with input
        cell.html(`<input type="text" class="edit-field" value="${oldValue}">`);
        const input = cell.find("input");
        input.focus();

        // Save on ENTER
        input.on("keydown", function (e) {
            if (e.key === "Enter") {
                const newValue = input.val().trim();
                cell.text(newValue);
            }
        });
    });
}
