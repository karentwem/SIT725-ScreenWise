
// Points and Calculations
const minutesPerPoint = document.getElementById('minutesPerPoint');
const dailyAllowance = document.getElementById('dailyAllowancePoints');
const dailyLimit = document.getElementById('dailyLimitPoints');
const defaultPointsPerHour = document.getElementById('defaultPointsPerHour');
const pointsPerHour = document.getElementById('offlineActivityPointsPerHour');
const pointsAvailable = document.getElementById('pointsAvailable');
const offlineActivityPointsPerHour = document.getElementById('offlineActivityPointsPerHour');
const offlineActivityHours = document.getElementById('offlineActivityHours');


// Forms
const logOfflineActivityForm = document.getElementById('logOfflineActivityForm');


// UI Fields
const childName = document.getElementById('childNameSelect');
const offlineActivity = document.getElementById('offlineActivityNameSelect');


document.addEventListener('DOMContentLoaded', () => {
    
    //Populate select lists
    getChildList();
    getOfflineActivityList();
    
    // Add event listener to Start the Timer
    if (logOfflineActivityForm) {
        logOfflineActivityForm.addEventListener('submit', async (event) => {
            //event.preventDefault(); // Prevent default form submission

            const startDateTime = getCurrentTime()
            const startDate = startDateTime.substring(0, 10);
            const pointsEarnt = offlineActivityPointsPerHour.value * offlineActivityMinutes.value/60;
            try {

                // Create log offline activity record
                const logOfflineActivityData = {
                    childName: childName.value,
                    dateTime: startDateTime,
                    offlineActivityName: offlineActivity.value,
                    pointsPerHour: offlineActivityPointsPerHour.value,
                    offlineActivityNameText: offlineActivity.value.toLowerCase(),
                    offlineActivityMinutes: offlineActivityMinutes.value,
                    offlineActivityHours: offlineActivityMinutes.value/60,
                    pointEarnt: pointsEarnt
                };

                const response = await fetch('/api/log-offline-activity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(logOfflineActivityData),
                })
                const responseText = await response.text();

                if (response.ok) {
                    alert(responseText);
                } else {
                    showAlert(responseText,true);
                }

                 // Update available points
                 // Allow points earnt up to daily maximum

                 const dailyUsageData = {
                    childName: childName.value,
                    startDate: startDate,
                    pointsUsed: 0,
                    minsUsed: 0,
                    pointsAvailable: +dailyAllowance.value+pointsEarnt,//will only be used for new dailyUsage records
                    pointsLimit: dailyLimit.value,
                    pointsEarnt: pointsEarnt,
                    childNameText: childName.value.toLowerCase()
                };
                
                const usageResponse = await fetch('/api/daily-usage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dailyUsageData),
                });
                const usageResponseText = await usageResponse.text();

                if (usageResponse.ok) {
                    alert(usageResponseText);
                } else {
                    showAlert(usageResponseText,true);
                };

            } catch (error) {
                console.error('Fetch error:', error);
                showAlert('Network error: ' + error.message, true);
            } 
        });
    };
});
