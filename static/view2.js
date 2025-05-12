window.selectdate = null;
window.selectedturfid=null;
window.selectedmanagerid=null;
window.selectedp=null;
window.selectedtype=null;
window.selectedSlots=null;
window.divnew=null;


const turffull = document.getElementsByClassName('turf-card');

for (let i = 0; i < turffull.length; i++) {
    turffull[i].addEventListener('click', function() {
        const cardContent = turffull[i];
        cardContent.style.position = "fixed";
        cardContent.style.top = "0";
        cardContent.style.left = "auto";
        cardContent.style.right = "0"; 
        cardContent.style.marginRight = "475px";
        cardContent.style.width = "50%";
        cardContent.style.height = "100%";
        cardContent.style.display = "flex";
        cardContent.style.justifyContent = "center";
        cardContent.style.alignItems = "center"; 
        cardContent.style.zIndex = "1000";
        cardContent.style.overflow = "auto"; 
        const sp = document.getElementsByClassName('close-symbol')[i]; 
        sp.style.display = "block"; 
        const turfId = cardContent.querySelector('.content h3').innerText; 
        console.log('Turf ID:', turfId);
        window.selectedturfid=turfId;
        window.divnew = document.getElementById(`star_container${turfId}`);
        console.log(window.divnew);
        console.log(window.selectedturfid);
        sp.addEventListener('click', function() {
            cardContent.style.position = "";
            cardContent.style.top = "";
            cardContent.style.left = "";
            cardContent.style.right = ""; 
            cardContent.style.marginRight = "";
            cardContent.style.width = "";
            cardContent.style.height = "";
            cardContent.style.display = "";
            cardContent.style.justifyContent = "";
            cardContent.style.alignItems = "";
            cardContent.style.zIndex = "";
            cardContent.style.overflow = ""
            sp.style.display = "none";
            location.reload();
        });
    });
}
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    const today = new Date();
    const dateOptions = [];
    for (let i = 0; i < 5; i++) {
        const nextDate = new Date();
        nextDate.setDate(today.getDate() + i);
        dateOptions.push(nextDate.toISOString().split('T')[0]);
    }
    console.log('Generated Date Options:', dateOptions);
    const turfCards = document.querySelectorAll('.turf-card');
    turfCards.forEach(card => {
        const turfId = card.querySelector('.content h3').innerText; 
        console.log('Turf ID:', turfId);
        const dateContainer = document.getElementById(`date-options-${turfId}`);
        console.log(dateContainer);
        console.log(dateOptions)
        dateOptions.forEach(date => {
            const radioHtml = `
            <label class='name'> <!-- Corrected from <lable> to <label> -->
                <input type="radio" name="date-${turfId}" value="${date}" onchange="fetchSlot(this, '${turfId}')">
                <span class='names'>${date}</span>
            </label>`;
            dateContainer.innerHTML += radioHtml; // Append the radio button to the container
            });
        });
    });
    function fetchSlot(radioElement, turfId) {
        const date = radioElement.value; // Get the selected date
        console.log(`Fetching slots for Turf ID: ${turfId} on Date: ${date}`); // Debugging line
        if (date) {
            fetch(`/${turfId}/${date}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(slots_data => {
                    console.log(slots_data); 
                    displaySlots(slots_data, turfId, date); // Call function to display slots
                })
                .catch(error => {
                    console.error('Error fetching slots:', error);
                });
        } else {
            console.warn('No date selected for Turf ID:', turfId); // Debugging line
        }
    }
    function displaySlots(slots_data, turfId, date) {
        const slotsContainer = document.getElementById(`slots-${turfId}`);
        slotsContainer.innerHTML = '';
        if (slots_data && slots_data.length > 0) {
            let slotHtml = '<h3 style="color:black">Available Slots:</h3>,<br><ul>';
                slots_data.forEach((slot, index) => {
                    slotHtml += `
                    <li><label class="namesc">
                        <input type="checkbox" ${slot.is_booked ? 'disabled' : ''} value="${index}"onchange="bookslot(${turfId},${date})')">
                        <span class='namesc'> ${(slot.slot_number) + 1}</span>
                        </label>
                    </li><br>`;
                 });
                 slotHtml += '</ul><br>';
                 slotsContainer.innerHTML = slotHtml;
                } else {
                    slotsContainer.innerHTML = '<p>No slots available for this date.</p>';
                }
            }
    

function bookSlot(turfId, date, time) {
    // Logic to book the slot
    console.log(`Booking Turf ID: ${turfId} on Date: ${date} at Time: ${time}`);
    // Here you can add the code to send a booking request to the server
    // For example:
    fetch(`/book`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ turfId, date, time })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert(`Booking successful: ${data.message}`); // Notify user of successful booking
    })
    .catch(error => {
        console.error('Error booking slot:', error);
        alert('There was an error booking the slot. Please try again.');
    });
}