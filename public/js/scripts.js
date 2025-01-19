// Display messages
function showAlert(message,isError) {
    if (isError) {
        alertBox = document.getElementById('messageError');
        alertBoxClear = document.getElementById('messageOk')
    } else {
        alertBox = document.getElementById('messageOk');
        alertBoxClear = document.getElementById('messageError');
    };
    alertBox.innerText = message;
    alertBoxClear.innerText = '';
};

function showAlertPopup(message) {
    document.getElementById('alertMessage').innerText = message;
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('customAlert').style.display = 'block';
};

function closeAlertPopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('customAlert').style.display = 'none';
}

// Clear input form fields
function clearForm(form) {
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.value = ''; // Clear the value of each input
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false; // Uncheck checkboxes and radio buttons
            }
        });
    }
    // Clear span text values
    const spans = form.querySelectorAll('span');
    spans.forEach(span => {
        span.textContent = ''; // Clear the text content of each span
    });
};


// Populate list of childName options for selection
async function getChildList() {
    const selectElement = document.getElementById('childNameSelect');
    if (selectElement) {
        try {
            const response = await fetch('/api/list-child', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const childList = await response.json();
        

            // Add the options
            childList.forEach(child => {
                const option = document.createElement('option');
                option.value = child.childName; 
                option.setAttribute('dailyAllowancePoints',child.dailyAllowancePoints);
                option.setAttribute('dailyLimitPoints', child.dailyLimitPoints);
                option.setAttribute('minutesPerPoint',child.minutesPerPoint);
                option.textContent = child.childName; 
                selectElement.appendChild(option); // Append the option to the select element
            });
    
            // Initialize the select element using Materialize CSS
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems);

        } catch (error) {
            console.error('Fetch error:', error);
            showAlert('Network error: ' + error.message, true);
        };
    };
};


// Populate list of online activity options for selection
async function getOnlineActivityList() {
    const selectElement = onlineActivity;
    if (selectElement) {
        try {
            // Get list from db
            const response = await fetch('/api/list-onlineActivity', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const onlineActivityList = await response.json();
                
            // Add the options
            onlineActivityList.forEach(onlineActivity => {
                const option = document.createElement('option');
                option.value = onlineActivity.onlineActivityName; 
                option.setAttribute('pointsPerHour',onlineActivity.pointsPerHour);
                option.textContent = onlineActivity.onlineActivityName + ' (' + onlineActivity.pointsPerHour + ' points per hour)'; 
                selectElement.appendChild(option); // Append the option to the select element
            });
           
            // Initialize the select element using Materialize CSS
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems);

        } catch (error) {
               console.error('Fetch error:', error);
               showAlert('Network error: ' + error.message, true);
        };
    };
};


// Populate list of offline activity options for selection
async function getOfflineActivityList() {
    const selectElement = offlineActivity;
    if (selectElement) {
        try {
            // Get list from db
            const response = await fetch('/api/list-offlineActivity', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const offlineActivityList = await response.json();

            while (selectElement.options.length > 1) {
                selectElement.remove(1); // Remove from index 1 to keep the default option (0)
            }

            // Add the options
            offlineActivityList.forEach(offlineActivity => {
                const option = document.createElement('option');
                option.value = offlineActivity.offlineActivityName; 
                option.setAttribute('pointsPerHour',offlineActivity.pointsPerHour);
                option.textContent = offlineActivity.offlineActivityName + ' (' + offlineActivity.pointsPerHour + ' points per hour)'; 
                selectElement.appendChild(option); // Append the option to the select element
            });
        
            // Initialize the select element using Materialize CSS
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems);

        } catch (error) {
               console.error('Fetch error:', error);
               showAlert('Network error: ' + error.message, true);
        };
    };
};


//Display available points for selected child 
async function displayPointsAvailable(optionSelected) {
    

    if (optionSelected.selectedIndex>0) {
        // Retrieve the corresponding numeric value from the pointsAvailable attribute
        const selectedOption = optionSelected.options[optionSelected.selectedIndex];
        let pointsAvailableToday = selectedOption ? parseFloat(selectedOption.getAttribute('dailyAllowancePoints')) : '';
        let limitPointsAvailable = selectedOption ? parseFloat(selectedOption.getAttribute('dailyLimitPoints')) : '';
        
        const childNameText = selectedOption.value.toLowerCase();

        // Check if daily usage document exists, return current balance if it does
        const todayDate = getCurrentTime();
        const usageData = {
            childNameText: childNameText,
            startDate: todayDate.substring(0, 10)
        };
        // Construct query parameters
        const queryParams = new URLSearchParams(usageData).toString();

        try {
            // Get daily usage record for selected child
            const response = await fetch(`/api/get-daily-usage?${queryParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const dailyUsagePointsAvailable = await response.text();
            if (dailyUsagePointsAvailable) {
                pointsAvailableToday = dailyUsagePointsAvailable;
            } 
            
            if(pointsAvailableToday>limitPointsAvailable) {
                pointsAvailableToday = limitPointsAvailable;
            };
            minsPerPoint = selectedOption ? selectedOption.getAttribute('minutesPerPoint') : '';
            pointsAvailable.innerText = 'Points Available Today : ' + parseFloat(pointsAvailableToday).toFixed(2);
            dailyAllowance.value = pointsAvailableToday;
            dailyLimit.value = limitPointsAvailable;
            minutesPerPoint.value = minsPerPoint;
            // Calculate default points per hour, use if no online activity has been selected
            const defaultPointsPerHourVal = 60/minutesPerPoint.value;
            defaultPointsPerHour.value = defaultPointsPerHourVal;

        } catch (error) {
            console.error('Fetch error:', error);
            showAlert('Network error: ' + error.message, true);

        };

    } else {
        pointsAvailable.innerText = '';
    };

};


// Display selected online activity points per hour
function displayOnlineActivityPointsPerHour(optionSelected) {
        
    if (optionSelected.selectedIndex>0) {
        // Retrieve the corresponding numeric value from the pointsAvailable attribute
        const selectedOption = optionSelected.options[optionSelected.selectedIndex];
        const pointsPerHourVal = selectedOption ? selectedOption.getAttribute('pointsPerHour') : '';
        pointsPerHour.value = pointsPerHourVal;
        
        // Calculate how much time left in minutes for this activity
        mins = (dailyAllowance.value/pointsPerHourVal*60).toFixed(0);

        // Display activity points per hour and minutes available
        onlineActivityPointsPerHour.innerText = 'Points per hour for ' + optionSelected.value + ': ' + pointsPerHourVal + '. Maximum ' + mins + ' minutes available for this activity.';

    } else {
        pointsAvailable.innerText = '';
    };

};


// Display selected offline activity points per hour
function displayOfflineActivityPointsPerHour(optionSelected) {

    if (optionSelected.selectedIndex>0) {
        // Retrieve the corresponding numeric value from the pointsAvailable attribute
        const selectedOption = optionSelected.options[optionSelected.selectedIndex];
        const pointsPerHourVal = selectedOption ? selectedOption.getAttribute('pointsPerHour') : '';
        offlineActivityPointsPerHourText.innerText = 'Points per hour earned if you ' + optionSelected.value.toLowerCase() + ': ' + pointsPerHourVal;
        if (offlineActivityPointsPerHour) {
            offlineActivityPointsPerHour.value = pointsPerHourVal;
        }
    } else {
        offlineActivityPointsPerHourText.innerText = '';
    };

};



// Function to get current date in specified timezone (AEDT) as a date-only string
function getCurrentTime() {
    // Create a new Date object for the current date and time
    const date = new Date();

    // Format the date to the specified timezone (Australia/Sydney)
    const options = {
        timeZone: 'Australia/Sydney',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false 
    };

    const formatter = new Intl.DateTimeFormat('en-AU', options);
    const parts = formatter.formatToParts(date);
    
    // Extract year, month, and day
    const year = parts.find(part => part.type === 'year').value;
    const month = parts.find(part => part.type === 'month').value;
    const day = parts.find(part => part.type === 'day').value;
    const hour = parts.find(part => part.type === 'hour').value;
    const minute = parts.find(part => part.type === 'minute').value;

    // Create a date-only string in YYYY-MM-DD hh:mm 
    return `${year}-${month}-${day} ${hour}:${minute}`
};


document.addEventListener('DOMContentLoaded', () => {
       
    // Return to Index Admin Main Menu
    const btnBackToIndexAdmin = document.getElementById('btnBackToIndexAdmin');
    if (btnBackToIndexAdmin) {    
        btnBackToIndexAdmin.addEventListener('click', () => {
            window.location.href = 'indexAdmin.html';
        });
    };

    // Return to Index Main Menu
    const btnBack = document.getElementById('btnBack');
    if (btnBack) {    
        btnBack.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    };
    const btnBackToIndex = document.getElementById('btnBackToIndex');
    if (btnBackToIndex) {    
        btnBackToIndex.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    };

    
    // Display Add Child Form
    const btnAddChildForm = document.getElementById('btnAddChildForm');
    if (btnAddChildForm) {    
        btnAddChildForm.addEventListener('click', () => {
            window.location.href='child.html';
        });
    };

    const listChildren = document.getElementById('listChildren');
    if (listChildren) {    
        listChildren.addEventListener('click', () => {
            window.location.href='list_children.html';
        });
    };

    const openAddOfflineActivity = document.getElementById('openAddOfflineActivity');
    if (openAddOfflineActivity) {    
        openAddOfflineActivity.addEventListener('click', () => {
            window.location.href='offlineActivity.html';
        });
    };

    const openListOfflineActivity = document.getElementById('openListOfflineActivity');
    if (openListOfflineActivity) {    
        openListOfflineActivity.addEventListener('click', () => {
            window.location.href='listOfflineActivity.html';
        });
    };

    // Display Add Offline Activity Form
    const btnAddOfflineActivityForm = document.getElementById('btnAddOfflineActivityForm');
    if (btnAddOfflineActivityForm) {    
        btnAddOfflineActivityForm.addEventListener('click', () => {
            window.location.href='offlineActivity.html';
        });
    };

    // Display Add Timer Form
    const btnTimerForm = document.getElementById('btnTimerForm');
    if (btnTimerForm) {    
        btnTimerForm.addEventListener('click', () => {
            window.location.href='timer.html';
        });
    };

    // Display Log Offline Activity Form
    const btnLogOfflineActivityForm = document.getElementById('btnLogOfflineActivityForm');
        if (btnLogOfflineActivityForm) {    
            btnLogOfflineActivityForm.addEventListener('click', () => {
                window.location.href='logOFflineActivity.html';
            });
        };
    
    // Display Add Online Activity Form
    const btnAddOnlineActivityForm = document.getElementById('btnAddOnlineActivityForm');
    if (btnAddOnlineActivityForm) {    
        btnAddOnlineActivityForm.addEventListener('click', () => {
            window.location.href='onlineActivity.html';
        });
    };

    const openAddOnlineActivity = document.getElementById('openAddOnlineActivity');
    if (openAddOnlineActivity) {    
        openAddOnlineActivity.addEventListener('click', () => {
            window.location.href='onlineActivity.html';
        });
    };

    const openListOnlineActivity = document.getElementById('openListOnlineActivity');
    if (openListOnlineActivity) {    
        openListOnlineActivity.addEventListener('click', () => {
            window.location.href='listOnlineActivity.html';
        });
    };

});

