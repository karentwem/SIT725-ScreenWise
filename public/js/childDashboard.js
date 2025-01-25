// Function to extract the `id` from the URL
function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id'); // Extracts 'id' from ?id=somevalue
}

// Main function to fetch and display child data
function fetchChildData() {
  // Get the ID from the URL
  const childId = getIdFromUrl();

  // Ensure the ID exists
  if (!childId) {
    document.getElementById('childDataDisplay').textContent = 'Error: No ID provided in the URL.';
    return;
  }

  // API URL
  const apiUrl = `http://localhost:3000/api/child/${childId}`;

  // Fetch data from the API
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {

      if(data){
        // Display the Child Name
        const displayChildName = document.getElementById('childName');
        displayChildName.textContent = data.childName;

        data.data.offlineActivities.forEach(activity => {
          const offlineData = document.getElementById('offlineActivity');
          offlineData.innerHTML = `
            <li class="collection-item">${activity}</li>
          `
        });

        data.data.onlineActivities.forEach(activity => {
          const onlineData = document.getElementById('onlineActivity');
          onlineData.innerHTML = `
            <li class="collection-item">${activity}</li>
          `
        });
      }
      
    })
    .catch(error => {
      // Handle errors
      M.toast({ html: error.message, classes: 'red darken-1' });
    });
}

// Call the main function on page load
window.onload = fetchChildData;














const ctx = document.getElementById('usageChart').getContext('2d');
const usageChart = new Chart(ctx, {
   type: 'line',
   data: {
     labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
     datasets: [
       {
         label: 'Usage in Hours',
         data: [2, 3, 1.5, 4, 2.5, 3.5, 2],
         borderColor: 'rgba(75, 192, 192, 1)',
         backgroundColor: 'rgba(75, 192, 192, 0.2)',
         borderWidth: 2
       }
     ]
   },
   options: {
     responsive: true,
     scales: {
       y: {
         beginAtZero: true
       }
     }
  }
});