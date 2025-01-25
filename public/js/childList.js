let dataTable;

document.addEventListener('DOMContentLoaded', () => {
    $('.modal').modal();
    // Initialize the DataTable
    dataTable = $('#childTable').DataTable({
        columnDefs: [
            { width: '10%', targets: 0 }, // Column 1 (Index)
            { width: '30%', targets: 1 }, // Column 2 (Child Name)
            { width: '13%', targets: 2 }, // Column 3 (Daily Allowance Points)
            { width: '13%', targets: 3 }, // Column 4 (Minutes Per Point)
            { width: '13%', targets: 4 }, // Column 5 (Daily Limit Points)
            { width: '21%', targets: 5 }, // Column 6 (Actions)
        ],
    });

    
    document.getElementById('btnUpdateChild').addEventListener('click', async () => {
        const childId = document.getElementById('childId').value;
        const childName = document.getElementById('updateChildName').value;
        const dailyAllowancePoints = document.getElementById('updateDailyAllowancePoints').value;
        const minutesPerPoint = document.getElementById('updateMinutesPerPoint').value;
        const dailyLimitPoints = document.getElementById('updateDailyLimitPoints').value;

        if (!childName || !dailyAllowancePoints || !minutesPerPoint || !dailyLimitPoints) {
            alert('All fields are required!');
            return;
        }

        try {
            const response = await fetch(`/api/childList/${childId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ childName, dailyAllowancePoints, minutesPerPoint, dailyLimitPoints }),
            });
            const result = await response.json();

            if (response.ok) {
                showAlert('Child updated successfully!', false);
                fetchChild(); // Refresh the table
                const modal = M.Modal.getInstance(document.getElementById('updateChildModal'));
                modal.close(); // Close the modal
            } else {
                showAlert('Error updating child: ' + result.message, true);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            showAlert('Network error: ' + error.message, true);
        }
    });

    // Fetch and display child records on load
    fetchChild();
});

// Fetch Child
async function fetchChild() {
    try {
        const response = await fetch('/api/childList', { method: 'GET' });
        const data = await response.json();

        if (response.ok) {
            populateDataTable(data);
        } else {
            showAlert('Error fetching child: ' + data.message, true);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        showAlert('Network error: ' + error.message, true);
    }
}

// Populate DataTable
function populateDataTable(childList) {
    dataTable.clear(); // Clear existing data in the DataTable

    childList.forEach((child, index) => {
        dataTable.row.add([
            index + 1,
            child.childName,
            child.dailyAllowancePoints,
            child.minutesPerPoint,
            child.dailyLimitPoints,
            `
            <a href="#updateChildModal" class="btn-small yellow darken-2 modal-trigger" onclick="openUpdateModal('${child._id}', '${child.childName}', '${child.dailyAllowancePoints}', '${child.minutesPerPoint}', '${child.dailyLimitPoints}')">Edit</a>
            <button class="btn-small red" onclick="deleteChild('${child._id}')">Delete</button>
            `,
        ]);
    });

    dataTable.draw(); // Redraw the DataTable
}


// Open Update Modal
function openUpdateModal(id, name, dailyAllowancePoints, minutesPerPoint, dailyLimitPoints) {
    document.getElementById('childId').value = id;
    document.getElementById('updateChildName').value = name;
    document.getElementById('updateDailyAllowancePoints').value = dailyAllowancePoints;
    document.getElementById('updateMinutesPerPoint').value = minutesPerPoint;
    document.getElementById('updateDailyLimitPoints').value = dailyLimitPoints;

    // Update labels for Materialize inputs
    M.updateTextFields();

    // Open the modal


}
// Delete Child
async function deleteChild(childId) {
    if (!confirm('Are you sure you want to delete this child?')) return;

    try {
        const response = await fetch(`/api/childList/${childId}`, { method: 'DELETE' });
        const result = await response.json();

        if (response.ok) {
            showAlert('Child deleted successfully!', false);
            fetchChild(); // Refresh the table
        } else {
            showAlert('Error deleting child: ' + result.message, true);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        showAlert('Network error: ' + error.message, true);
    }
}
