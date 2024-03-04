document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar');
    const selectedDay = document.getElementById('selectedDay');
    const sampleEventsList = document.getElementById('sampleEvents');
    const addedEvents = []; // Array to store added community events

    // Define the common structure for events
    function Event(date, time, name) {
        this.date = date;
        this.time = time;
        this.name = name;
    }

    // Function to generate calendar days for May
    function generateCalendar() {
        const daysInMay = 31; // This should be dynamic, but for simplicity, let's keep it as is
        calendar.innerHTML = '';
        const currentMonth = document.getElementById('currentMonth').textContent;
        for (let i = 1; i <= daysInMay; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = i;
            if (i === 18) { // Highlight May 18 initially
                dayElement.classList.add('selected');
                selectedDay.textContent = `${currentMonth} ${i}`;
                updateDailyEvents(selectedDay.textContent);
            }
            dayElement.addEventListener('click', function() {
                const selectedDate = `${currentMonth} ${i}`;
                displayDailyViewList(selectedDate);
            });
            calendar.appendChild(dayElement);
        }
    }

    function convertToDate(dateString) {
        var parts = dateString.split('/');
        var date = new Date(2000, parseInt(parts[0]) - 1, parseInt(parts[1]));
        var month = date.toLocaleString('en-US', { month: 'long' });
        var day = date.getDate();
        return month + ' ' + day;
    }

    // Function to update daily events when day is changed
    function updateDailyEvents(selectedDate) {
        sampleEventsList.innerHTML = ''; // Clear previous events
        // Display only added community events for the selected date
        const selectedEvents = addedEvents.filter(eventData => {
            const eventDate = new Date(eventData.date);
            const formattedSelectedDate = selectedDate.split(' ').slice(0, 2).join(' '); // Format selected date
            const formattedEventDate = `${eventDate.toLocaleString('en-US', { month: 'short' })} ${eventDate.getDate()}`;
            return formattedEventDate === formattedSelectedDate;
        });
        selectedEvents.forEach(eventData => {
            const eventItem = document.createElement('li');
            eventItem.textContent = `${eventData.time} - ${eventData.name}`;
            sampleEventsList.appendChild(eventItem);
        });
    }

    function displayDailyViewList(selectedDate) { 
        // Remove 'selected' class from all day elements
        const allDayElements = document.querySelectorAll('.day');
        allDayElements.forEach(day => day.classList.remove('selected'));
        
        // Find the day element corresponding to the selected date
        const currentMonth = document.getElementById('currentMonth').textContent;
        const selectedDayElement = Array.from(allDayElements).find(day => {
            return day.textContent == parseInt(selectedDate.split(' ')[1]) && currentMonth == selectedDate.split(' ')[0];
        });
    
        // Add 'selected' class to the clicked day element
        selectedDayElement.classList.add('selected');
    
        selectedDay.textContent = selectedDate;
        updateDailyEvents(selectedDate);
    }

    // Initial setup
    generateCalendar();

    // Month navigation
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');

    prevMonthBtn.addEventListener('click', function() {
        // Update the current month and regenerate the calendar
        document.getElementById('currentMonth').textContent = 'June';
        generateCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        // Update the current month and regenerate the calendar
        document.getElementById('currentMonth').textContent = 'May';
        generateCalendar();
    });

    const communityEvents = [
        new Event('05/13', '06:00 PM', 'Poker'),
        new Event('05/15', '09:00 AM', 'Charity Walk'),
        new Event('05/20', '01:00 PM', 'Volunteer Day'),
        new Event('05/25', '12:00 PM', 'Community Picnic')
    ];

    // Populate community events list
    const eventList = document.getElementById('eventList');

    communityEvents.forEach(eventData => {
        const { date, time, name } = eventData;
        const eventDay = document.createElement('div');
        eventDay.classList.add('event-day');
        const dayHeading = document.createElement('h3');
        dayHeading.textContent = date;
        eventDay.appendChild(dayHeading);
        const eventBox = document.createElement('div');
        eventBox.classList.add('event-box');
        eventBox.textContent = `${time} - ${name}`;
        eventBox.addEventListener('click', function() {
            if (!eventBox.classList.contains('added')) { // Check if event is already added
                selectedDay.textContent = date; // Switch to event day
                const eventItem = document.createElement('li');
                eventItem.textContent = `${time} - ${name}`;
                sampleEventsList.appendChild(eventItem); // Add event to daily list
                eventBox.classList.add('added'); // Mark event as added
                addedEvents.push(eventData); // Add event to addedEvents array
                displayDailyViewList(convertToDate(date));
            }
        });
        eventDay.appendChild(eventBox);
        eventList.appendChild(eventDay);
    });

    // Scrolling functionality
    const scrollUpBtn = document.getElementById('scrollUpBtn');
    const scrollDownBtn = document.getElementById('scrollDownBtn');
    let currentIndex = 0;

    scrollUpBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateScrollHighlight();
        }
    });

    scrollDownBtn.addEventListener('click', function() {
        if (currentIndex < communityEvents.length - 1) {
            currentIndex++;
            updateScrollHighlight();
        }
    });

    // Add this function to scroll to the selected item
    function scrollToSelectedEvent() {
        const selectedEvent = document.querySelector('.event-box.highlight');
        if (selectedEvent) {
            selectedEvent.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Modify the existing function where you update the scroll highlight
    function updateScrollHighlight() {
        const eventBoxes = document.querySelectorAll('.event-box');
        eventBoxes.forEach((box, index) => {
            if (index === currentIndex) {
                box.classList.add('highlight');
                scrollToSelectedEvent(); // Call the function to scroll to the selected item
            } else {
                box.classList.remove('highlight');
            }
        });
    }

    // Event handling for adding new events
    const eventNameInput = document.getElementById('eventNameInput');
    const eventDateTimeInput = document.getElementById('eventDateTimeInput');
    const eventNameCheckButton = document.getElementById('eventNameCheckButton');
    const eventDateTimeCheckButton = document.getElementById('eventDateTimeCheckButton');
    const confirmButton = document.getElementById('confirmButton');
    const deleteButton = document.getElementById('deleteButton');
    const errorMessage = document.getElementById('errorMessage');

    let eventNameValid = false;
    let eventDateTimeValid = false;

    eventNameCheckButton.addEventListener('click', function() {
        const eventNameValue = eventNameInput.value.trim();
        if (eventNameValue) {
            eventNameInput.classList.remove('invalid');
            eventNameInput.classList.add('valid');
            eventNameValid = true;
        } else {
            eventNameInput.classList.remove('valid');
            eventNameInput.classList.add('invalid');
            eventNameValid = false;
        }
    });

    eventDateTimeCheckButton.addEventListener('click', function() {
        const eventDateTimeValue = eventDateTimeInput.value.trim();
        const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01]),\s*(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i;
        if (regex.test(eventDateTimeValue)) {
            eventDateTimeInput.classList.remove('invalid');
            eventDateTimeInput.classList.add('valid');
            eventDateTimeValid = true;
        } else {
            eventDateTimeInput.classList.remove('valid');
            eventDateTimeInput.classList.add('invalid');
            eventDateTimeValid = false;
        }
    });

    confirmButton.addEventListener('click', function() {
        if (eventNameValid && eventDateTimeValid) {
            const eventName = eventNameInput.value.trim();
            const eventDateTime = eventDateTimeInput.value.trim();
            const [date, time] = eventDateTime.split(', ');
            const eventData = new Event(date, time, eventName);
            addedEvents.push(eventData);
            updateDailyEvents(date);
            eventNameInput.value = '';
            eventDateTimeInput.value = '';
            eventNameInput.classList.remove('valid', 'invalid');
            eventDateTimeInput.classList.remove('valid', 'invalid');
            errorMessage.textContent = '';
            
            
            displayDailyViewList(convertToDate(date));
        } else {
            errorMessage.textContent = 'Please fill in both event name and date/time correctly.';
        }
    });

    

    deleteButton.addEventListener('click', function() {
        eventNameInput.value = '';
        eventDateTimeInput.value = '';
        eventNameInput.classList.remove('valid', 'invalid');
        eventDateTimeInput.classList.remove('valid', 'invalid');
        errorMessage.textContent = '';
    });

    const firstEventBox = document.querySelector('.event-box');
    if (firstEventBox) {
        firstEventBox.classList.add('highlight');
        scrollToSelectedEvent(); // Scroll to the selected item
    }
});
