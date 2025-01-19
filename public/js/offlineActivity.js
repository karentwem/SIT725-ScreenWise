document.addEventListener('DOMContentLoaded', () => {
    //Focus on first input field once loaded
    const firstField = document.getElementById('offlineActivityName');
    firstField.focus(); 

    // Add Offline Activity
    const offlineActivityForm = document.getElementById('addOfflineActivityForm');
    if (offlineActivityForm) {
        offlineActivityForm.addEventListener('submit',async (event) => {
            event.preventDefault(); // Prevent default form submission
            const offlineActivityData = {
                offlineActivityName: firstField.value,
                pointsPerHour: document.getElementById('pointsPerHour').value,
                offlineActivityNameText: firstField.value.toLowerCase()
            };
            try {
                const response = await fetch('/api/offline-activity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(offlineActivityData),
                })
                const responseText = await response.text();
                
                console.log('Response from API:' + responseText);

                // Clear the form if post is successful
                if (response.ok) {
                    showAlert(responseText,false);
                    clearForm(offlineActivityForm);
                } else {
                    showAlert(responseText,true);
                }

            } catch (error) {
                console.error('Fetch error:', error);
                showAlert('Network error: ' + error.message, true);
            } 
        });
    };

});
