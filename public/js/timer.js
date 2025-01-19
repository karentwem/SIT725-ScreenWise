// Global Variables
const socket = io();

// Points and Calculations
const startDateTime = document.getElementById('startDateTime');
const minutesPerPoint = document.getElementById('minutesPerPoint');
const dailyAllowance = document.getElementById('dailyAllowancePoints');
const dailyLimit = document.getElementById('dailyLimitPoints');
const defaultPointsPerHour = document.getElementById('defaultPointsPerHour');
const pointsPerHour = document.getElementById('pointsPerHour');
const pointsAvailable = document.getElementById('pointsAvailable');
const onlineActivityPointsPerHour = document.getElementById('onlineActivityPointsPerHour');
const offlineActivityPointsPerHour = document.getElementById('offlineActivityPointsPerHour');
const offlineActivityPointsPerHourText = document.getElementById('offlineActivityPointsPerHourText');

// Timer forms
const timerFormDisplay = document.getElementById('timerFormDisplay');
const timerForm = document.getElementById('timerForm');
const timerStatus = document.getElementById('timerStatus');
const timerRunning = document.getElementById('timerRunning');
const timerDisplay = document.getElementById('timerDisplay');
const rowNewTimer = document.getElementById('rowNewTimer');
const rowStopTimer = document.getElementById('rowStopTimer');


// UI Fields
const childName = document.getElementById('childNameSelect');
const onlineActivity = document.getElementById('onlineActivityNameSelect');
const offlineActivity = document.getElementById('offlineActivityNameSelect');


// Function to disconnect the socket
function disconnectSocket() {
    socket.disconnect(); // Disconnect the socket
    console.log('User disconnected');
};

/*
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
}; */


function calculateTimeDifference(dateString1, dateString2) {
    // Convert the date strings into Date objects
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = date2 - date1;

    // Convert the difference from milliseconds to minutes
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

    return differenceInMinutes;
};


// Calculate points used based on minutes used and online activity points per hour cost
function calculatePointsUsed(minsUsed, pointsPerHour) {
    if(pointsPerHour) {
        //if online activity selected, use points per hour from that
        return(minsUsed/60*pointsPerHour);
    } else {
        //get default points from child record
        return(minsUsed/60*defaultPointsPerHour.value);
    }
};

/*
//Display available points for selected child 
async function displayPointsAvailable(optionSelected) {
    

    if (optionSelected.selectedIndex>0) {
        // Retrieve the corresponding numeric value from the pointsAvailable attribute
        const selectedOption = optionSelected.options[optionSelected.selectedIndex];
        let pointsAvailableToday = selectedOption ? selectedOption.getAttribute('dailyAllowancePoints') : '';
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
            const minsPerPoint = selectedOption ? selectedOption.getAttribute('minutesPerPoint') : '';
            pointsAvailable.innerText = 'Points Available Today : ' + parseFloat(pointsAvailableToday).toFixed(2);
            minutesPerPoint.value = minsPerPoint;
            dailyAllowance.value = pointsAvailableToday;
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
        offlineActivityPointsPerHour.innerText = 'Points per hour earned if you ' + optionSelected.value.toLowerCase() + ': ' + pointsPerHourVal;
    } else {
        offlineActivityPointsPerHour.innerText = '';
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
*/
document.addEventListener('DOMContentLoaded', () => {
    
    //Populate select lists
    getChildList();
    getOfflineActivityList();
    getOnlineActivityList();

    // Hide timer running and new timer button when form loads
    timerFormDisplay.style.display="none";
    rowNewTimer.style.display="none";

    // Add event listener to Start the Timer
    if (timerForm) {
        timerForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission
            
            const pointsLeft = dailyAllowance.value;
            // Use default points per hour if no online activity selected
            let pointsPerHourVal = defaultPointsPerHour.value;
            if (pointsPerHour) {
                pointsPerHourVal = pointsPerHour.value;
            }
            if (childName != '') { 
                if(parseFloat(pointsLeft)>0) {
                    startDateTime.value = getCurrentTime();
                    timerStatus.innerText = 'active';
                    timerRunning.innerText = 'Timer Running';
                    timerDisplay.innerText = 'Minutes Used: 0, Points used: 0'

                    showAlert('Timer started at ' + startDateTime.value);

                    // Set variables to use for 10 minute warning
                    const pointsTenMinutes = pointsPerHourVal/6; 10
                    const pointsWarning = pointsLeft-pointsTenMinutes; 

                    // connect to the socket to keep track of minutes used
                    socket.on('minutes', (mins) => {
                        const timerDisplay = document.getElementById('timerDisplay'); 
                    
                        if (timerDisplay) {
                            points = mins*pointsPerHourVal/60;
                            timerDisplay.innerText = `Minutes used: ${mins}, Points used: ${points.toFixed(2)}`; 
                            if (points>=pointsWarning) {
                                const minsLeft = (pointsLeft / pointsPerHourVal * 60) - mins;
                                if (minsLeft>0) {
                                    // Still up to 10 minutes left
                                    showAlertPopup(`WARNING: ${minsLeft.toFixed(0)} minute(s) screen time left`);
                                } else {
                                    // Time is up
                                    let offlineActivityMsg = '';
                                    if (offlineActivity.value) {
                                        offlineActivityMsg = `\n\n It's time to ${offlineActivity.value.toUpperCase()} :-)`;
                                    };
                                    showAlertPopup(`Time's up! Your screen time is finished for today. If you keep using it, you'll have less time tomorrow.` + offlineActivityMsg);
                                }
                            }
                        }
                    });

                    // Populate the display form
                    document.getElementById('childNameDisplay').value = childName.value;
                    document.getElementById('onlineActivityNameDisplay').value = onlineActivity.value;
                    document.getElementById('offlineActivityNameDisplay').value = offlineActivity.value;
                    document.getElementById('pointsAvailableDisplay').innerText = pointsAvailable.innerText;
                    document.getElementById('onlineActivityPointsPerHourDisplay').innerText = onlineActivityPointsPerHour.innerText;
                    document.getElementById('offlineActivityPointsPerHourDisplay').innerText = offlineActivityPointsPerHourText.innerText;

                    // Initialize Materialize labels
                    //M.updateTextFields();

                    // Hide editable form and show display form
                    timerForm.style.display = 'none';
                    timerFormDisplay.style.display = 'block';
                } else {
                    showAlert('There are no available points left today, cannot start the timer.',true);
                };
            } else {
                showAlert('Please select your name',true);
            }
        });
    }


    // Add event listener to Stop the timer

    if (timerFormDisplay) {
        
        timerFormDisplay.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent default form submission

            // Online/offline activity selection is optional, populate if it has been selected
            let onlineActivityName='';
            let offlineActivityName='';
            if (onlineActivity) {
                onlineActivityName = onlineActivity.value;
            };
            if (offlineActivity) {
                offlineActivityName = offlineActivity.value;
            };

            // Calculate screen time usage
            const endTime = getCurrentTime(); 
            const minsUsed = calculateTimeDifference(startDateTime.value, endTime); 
            const pointsUsed = calculatePointsUsed(minsUsed, pointsPerHour.value);
  
            // Save timer data
            document.getElementById('endDateTime').value = endTime;

            const timerData = {
                childName: childName.value,
                onlineActivityName: onlineActivityName,
                offlineActivityName: offlineActivityName,
                startDateTime: startDateTime.value,
                endDateTime: endTime,
                minsUsed: minsUsed,
                pointsUsed: pointsUsed
            };

                try {
                    // Post timer record to database
                    const timerResponse = await fetch('/api/timer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(timerData),
                    });
                    const timerResponseText = await timerResponse.text();
                
                    // Display response
                    if (timerResponse.ok) {
                        showAlert(timerResponseText,false);
                    } else {
                        showAlert(timerResponseText,true);
                    }

                } catch (error) {
                    console.error('Fetch error:', error);
                    showAlert('Network error: ' + error.message, true);
                };
                     
                try {                      
                    // Update available points
                    const startDate = startDateTime.value.substring(0, 10);
                    const dailyUsageData = {
                        childName: childName.value,
                        startDate: startDate,
                        pointsUsed: pointsUsed,
                        minsUsed: minsUsed,
                        pointsAvailable: +dailyAllowance.value-pointsUsed,//will only be used for new dailyUsage records
                        pointsLimit: dailyLimit.value,
                        pointsEarnt: 0,
                        childNameText: childName.value.toLowerCase()
                    };
                
                    // Post timer record to database
                    const usageResponse = await fetch('/api/daily-usage', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(dailyUsageData),
                    });
                    const usageResponseText = await usageResponse.text();
                    
                    // Display response
                    if (usageResponse.ok) {
                        //Disconnect socket timer
                        disconnectSocket();
                        //Show timer complete form
                        rowStopTimer.style.display = 'none';
                        rowNewTimer.style.display = 'block';
                        timerStatus.innerText = '';
                        timerRunning.innerText = '';
                        timerDisplay.innerText = '';
                        timerForm.reset();
                    };
                            
                    } catch (error) {
                        console.error('Fetch error:', error);
                        showAlert('Network error: ' + error.message, true);
                    }   
        });
    }

});
