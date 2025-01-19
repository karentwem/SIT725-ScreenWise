function calculateDailyAllowanceMinutes() {
    let dailyAllowancePoints = document.getElementById('dailyAllowancePoints').value;
    let minutesPerPoint = document.getElementById('minutesPerPoint').value;
    if (dailyAllowancePoints>0 & minutesPerPoint>0) {
        let dailyAllowanceMinutes = dailyAllowancePoints*minutesPerPoint;
        document.getElementById('dailyAllowanceMinutes').textContent = dailyAllowanceMinutes + " minutes"
    }
};

function calculateDailyLimitMinutes() {
    let dailyLimitPoints = document.getElementById('dailyLimitPoints').value;
    let minutesPerPoint = document.getElementById('minutesPerPoint').value;
    if (dailyLimitPoints>0 & minutesPerPoint>0) {
        let dailyLimitMinutes = dailyLimitPoints*minutesPerPoint;
        document.getElementById('dailyLimitMinutes').textContent = dailyLimitMinutes + " minutes"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Focus on the first input field once loaded
    const firstField = document.getElementById('childName');
    firstField.focus(); 


    // Add event listener for Add Child Form submission 
    const childForm = document.getElementById('addChildForm');
    if (childForm) {
        childForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            const childData = {
                childName: firstField.value,
                dailyAllowancePoints: document.getElementById('dailyAllowancePoints').value,
                dailyLimitPoints: document.getElementById('dailyLimitPoints').value,
                minutesPerPoint: document.getElementById('minutesPerPoint').value,
                childNameText: firstField.value.toLowerCase()
            };

            try {
                const response = await fetch('/api/child', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(childData),
                });
                const responseText = await response.text();
                
                console.log('Response from API:' + responseText);

                // Clear the form if post is successful
                if (response.ok) {
                    showAlert(responseText,false);
                    clearForm(childForm);
                } else {
                    showAlert(responseText,true);
                }

            } catch (error) {
                console.error('Fetch error:', error);
                showAlert('Network error: ' + error.message, true);
            } 
        });
    }
});

