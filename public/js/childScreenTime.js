async function fetchChildRecords() {
  const childSelector = document.getElementById("child_selector");
  const childName = childSelector.options[childSelector.selectedIndex].value;

  if (!childName) {
    M.toast({ html: 'Please enter a child name.' });
    return;
  }

  try {
    // Fetch child records from the API
    const response = await fetch(`/api/screentimeusage?childName=${childName}`);
    const data = await response.json();

    if (response.status === 200) {
      const tableBody = document.getElementById('table-body');
      tableBody.innerHTML = '';  // Clear existing rows

      data.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${record.onlineActivityName || record.offlineActivityName}</td>
          <td>${record.pointsUsed.toFixed(2)}</td>
          <td>${record.minsUsed}</td>
          <td>${record.startDateTime}</td>
          <td>${record.endDateTime}</td>
        `;
        tableBody.appendChild(row);

        // for each record sum the following totaL points used and total minutes used
        const totalPointsUsed = data.reduce((acc, record) => acc + record.pointsUsed, 0);
        const totalMinsUsed = data.reduce((acc, record) => acc + record.minsUsed, 0);
        document.getElementById('total-points').textContent = totalPointsUsed.toFixed(2);
        document.getElementById('total-minutes').textContent = totalMinsUsed.toFixed(2);
      });
    } else {
      M.toast({ html: data });
    }
  } catch (error) {
    console.error('Error fetching child records:', error);
    M.toast({ html: 'An error occurred while fetching the data.' });
  }
}

async function fetchChilds() {
  // Fetch child records on form submit

  const response = await fetch('/api/childList', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const childList = await response.json();
  selectElement = document.getElementById('child_selector');

  // Add the options
  childList.forEach(child => {
    const option = document.createElement('option');
    option.value = child.childName;
    option.setAttribute('dailyAllowancePoints', child.dailyAllowancePoints);
    option.setAttribute('minutesPerPoint', child.minutesPerPoint);
    option.textContent = child.childName;
    selectElement.appendChild(option); // Append the option to the select element
  });

  // Initialize the select element using Materialize CSS
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
}

document.addEventListener('DOMContentLoaded', () => {
  fetchChilds();
})


