document.addEventListener('DOMContentLoaded', () => {
    //Focus on first input field once loaded
    const firstField = document.getElementById('onlineActivityName');
    firstField.focus(); 

    // Add Online Activity Form
    const onlineActivityForm = document.getElementById('addOnlineActivityForm');
    if (onlineActivityForm) {
        onlineActivityForm.addEventListener('submit',async (event) => {
            event.preventDefault(); // Prevent default form submission
            const onlineActivityData = {
                onlineActivityName: firstField.value,
                pointsPerHour: document.getElementById('pointsPerHour').value,
                onlineActivityNameText: firstField.value.toLowerCase()
            };
            try {
                const response = await fetch('/api/online-activity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(onlineActivityData),
                })
                const responseText = await response.text();
                
                console.log('Response from API:' + responseText);

                // Clear the form if post is successful
                if (response.ok) {
                    showAlert(responseText,false);
                    clearForm(onlineActivityForm);
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
