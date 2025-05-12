window.selectdate = null;
window.selectedturfid=null;
window.selectedmanagerid=null;
window.selectedp=null;
window.selectedtype=null;
window.selectedSlots=null;
window.divnew=null;
window.user_id=document.getElementById('user_id').innerText;


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


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Send the location to the server
        fetch('/update_location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ latitude, longitude })
        });
    });
} else {
    console.log("Geolocation is not supported by this browser.");
}
function profile() {
    const profile = document.getElementById("pd");
    console.log("hii");
    if (profile.style.display === "none" || profile.style.display === "") {
        console.log('hii');
        profile.style.display = "block";
        profile.style.position=''
    } else {
        profile.style.display = "none";
    }
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
        if (turfId){
            fetch(`/get_star/${turfId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(text => {
                console.log(text.turf_id); 
                console.log(text.rating);
                const a = text.turf_id;
                const number = text.rating;
                let integerPart = Math.floor(number);
                let decimalPart = Math.round((number - integerPart) * 10); 
                const star = document.getElementById(`ratingstar${a}`);
                star.innerHTML = ""; // Corrected from innerHtml to innerHTML
                for (let i = 1; i <= 5; i++) {
                    console.log("loop");
                    if(0 == integerPart){
                        star.innerHTML += `<svg height="50px" width="50px" fill="rgb(255, 255, 255)" stroke="black" stroke-width="0.5" viewBox="0 0 24 24" width="24px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path></svg>`;
                    }
                    else if (i <= integerPart) {
                        // Full star
                        star.innerHTML += `<svg height="50px" width="50px" fill="rgb(255, 217, 0)" stroke="black" stroke-width="0.5" viewBox="0 0 24 24" width="24px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path></svg>`;
                    } else {
                        // Handle empty and half stars
                        if (decimalPart === 0) {
                            // Empty star
                            star.innerHTML +=`<svg height="50px" width="50px" fill="white" stroke="black" stroke-width="0.5"   viewBox="0 0 24 24" width="24px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path></svg>`;
                        } else if (decimalPart <= 3) {
                            decimalpart=0;
                            star.innerHTML += `<svg height="50px" width="50px" fill="rgb(252, 237, 156)" stroke="black" stroke-width="0.5" viewBox="0 0 24 24" width="24px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path></svg>`;
                        } else if (decimalPart > 3 && decimalPart <= 6) {
                            decimalpart=0;
                            star.innerHTML += `<svg height="50px" width="50px" fill="rgb(253, 227, 78)" stroke="black" stroke-width="0.5" viewBox="0 0 24 24" width="24px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path></svg>`;
                        } else {
                            console.log('newstar')
                            decimalpart=0;
                            star.innerHTML += ` <svg height="50px" width="50px" fill="rgb(253, 224, 58)" stroke="black" stroke-width="0.5" viewBox="0 0 24 24" width="24px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g><path d="M9.362,9.158c0,0-3.16,0.35-5.268,0.584c-0.19,0.023-0.358,0.15-0.421,0.343s0,0.394,0.14,0.521    c1.566,1.429,3.919,3.569,3.919,3.569c-0.002,0-0.646,3.113-1.074,5.19c-0.036,0.188,0.032,0.387,0.196,0.506    c0.163,0.119,0.373,0.121,0.538,0.028c1.844-1.048,4.606-2.624,4.606-2.624s2.763,1.576,4.604,2.625    c0.168,0.092,0.378,0.09,0.541-0.029c0.164-0.119,0.232-0.318,0.195-0.505c-0.428-2.078-1.071-5.191-1.071-5.191    s2.353-2.14,3.919-3.566c0.14-0.131,0.202-0.332,0.14-0.524s-0.23-0.319-0.42-0.341c-2.108-0.236-5.269-0.586-5.269-0.586    s-1.31-2.898-2.183-4.83c-0.082-0.173-0.254-0.294-0.456-0.294s-0.375,0.122-0.453,0.294C10.671,6.26,9.362,9.158,9.362,9.158z"></path></svg>`;
                        }
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching slots:', error);
            });
            fetch(`/whishlist/${turfId}/${window.user_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(text => {
                const likeds = document.getElementById(`liked${text.turf_id}`); // Ensure this ID exists in your HTML
                likeds.innerHTML = `
                <form class="like-form" id="whish${text.turf_id}" method="POST">
                <input type="hidden" name="turf_id" value="${text.turf_id}">
                <input type="hidden" name="user_id" value="${text.user_id}">
                <button type="submit" id="add${text.turf_id}" class="like-button" ;
                style="color: ${text.liked ? 'red' : 'white'}" 
                onclick="${text.liked ? `poplist(${text.turf_id})` : `addlist(${text.turf_id})`}">
                <span class="heart"  >&#10084;</span>
                </button>
                </form>
                `;
                
            })
            .catch(error => {
                console.error('Error fetching slots:', error);
            });

        }
        else {
        console.warn('No date selected for Turf ID:', turfId); // Debugging lin
        }
        const a = document.getElementById(`sh${turfId}`);
        let should_open_review; // Use let for block scope
        if (a) {
            const y = a.innerText.trim(); // Trim whitespace
            console.log(y)
            console.log('Element found, innerText:', y);
            should_open_review = y.toLowerCase(); // Normalize to lowercase
            console.log(should_open_review);
            console.log(!should_open_review);
        } else {
            console.log('Element not found, setting should_open_review to false');
            should_open_review = false; // Set to false if the element does not exist
        }
        if (should_open_review) {
            console.log("Opening review form for turfId:", turfId);
            const element = document.getElementById(`writereview${turfId}`);
            if (element) {
                element.style.display = "block"; // Show the review form
                uploadfun(turfId);
                
            } else {
                console.error(`Review form with ID writereview${turfId} does not exist.`);
            }
        }
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
                    <input type="checkbox" ${slot.is_booked ? 'disabled' : ''} value="${index}"onchange="viewpaytype('${turfId}','${date}')">
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

function viewpaytype(turfId,date){
    window.selectdate=date;
    console.log(date);
    console.log(turfId);
    const manager = document.getElementById('manager').innerText;
    const avd = document.getElementById('advance').innerText;
    const full = document.getElementById('full').innerText;
    const paytypecontainer= document.getElementById(`paytype-${turfId}`);
    console.log(paytypecontainer)
    paytypecontainer.innerHTML='';
    const innerp=`<div class="pbutton" style="padding-left: 90px;">
                            <label class="paytypel">
                              <input type="radio" name="ptype" id="advance_payment" value='${avd}' onchange="qrgenerator(this,'${manager}','${turfId}')"> <span class='names'>pay adv</span>
                          </label>
                          <label class="paytypel">
                              <input type="radio" name="ptype" id="full_payment" value="${full}" onchange="qrgenerator(this,'${manager}','${turfId}')"> <span class='names'>pay full</span>
                          </label> 
                          </div>
                          <div id="payqr-${turfId}" style="display:none;">
                              <h1>please scan in gpay add pay for your booking</h1>
                              <img scr="" id="qrCode-${turfId}">  
                          </div>
                      <div id="upload_payment_proof-${turfId}"></div>
                      <div id="bookbutton-${turfId}"></div>`
    paytypecontainer.innerHTML=innerp;                  
}
function qrgenerator(radioElement,manager_id,turfId){
    console.log('work');
    window.selectedturfid=turfId;
    window.selectedmanagerid=manager_id;
    console.log(turfId);
    console.log(manager_id);
    const qrcontainer=document.getElementById(`payqr-${turfId}`);
    qrcontainer.style.display = "flex";
    qrcontainer.style.flexWrap = "wrap";
    const slotsContainer = document.getElementById(`slots-${turfId}`);
    window.selectedSlots= Array.from(slotsContainer.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    console.log(selectedSlots.length);
    const price =radioElement.value;
    window.selectedp=price;
    const paymenttype =radioElement.id;
    window.selectedtype=paymenttype;
    const p=price*selectedSlots.length;
    fetch(`/qrcode/${price}/${manager_id}`, { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
            const qrCodeImg = document.getElementById(`qrCode-${turfId}`);
            qrCodeImg.src = `data:image/png;base64,${data.qr_code}`;
            upload_proof();
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
function upload_proof(){
    const date=window.selectdate;
    const turf_id=window.selectedturfid;
    const manager_id=window.selectedmanagerid;
    const paymenttype=window.selectedtype;
    const price=window.selectedp;
    const selectedSlots=window.selectedSlots;
    const user =document.getElementById("user_id").innerText;
    console.log("Generating form with the following values:");
    console.log("Manager ID:", manager_id);
    console.log("Date:", date);
    console.log("Turf ID:", turf_id);
    console.log("Payment Type:", paymenttype);
    console.log("Price:", price);
    console.log("Selected Slots:", selectedSlots);
    const formtoproof= document.getElementById(`upload_payment_proof-${turf_id}`);
    var formhtml = `
            <form  id="uploadForm"  enctype="multipart/form-data">
                <input type="hidden" name="manager_id" value="${manager_id}">
                <input type="hidden" name="date" value="${date}">
                <input type="hidden" name="turf_id" value="${turf_id}">
                <input type="hidden" name="user_id" value="${user}">
                <input type="hidden" name="paymenttype" value="${paymenttype}">
                <input type="hidden" name="price" value="${price}">
                <input type="hidden" name="slots" value="${selectedSlots.join(',')}">
                <input type="file"  name="file" accept="image/*, application/pdf" required>
                <input type="submit">
            </form>`;
    formtoproof.innerHTML = formhtml;
    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', function(event) {
    event.preventDefault(); 
    const formData = new FormData(uploadForm);
    fetch('/uploadpayp', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Assuming the server returns JSON
        }).then(text => {
            console.log("hii",text)
            onUploadSuccess(text); 
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });
}
function onUploadSuccess(data) {
    console.log("Upload successful:", data);
    const date=window.selectdate;
    const turfid=window.selectedturfid;
    console.log(turfid)
    const bookslot=document.getElementById(`Bookbutton-${turfid}`);
    bookslot.style.display="block";
    bookslot.innerHTML="";
    const buttonadd=`<button onclick="bookSlots('${date}', ${turfid})">Book </button>`;
    bookslot.innerHTML=buttonadd;
   
}
function bookSlots(date, turfId) {
    const slotsContainer = document.getElementById(`slots-${turfId}`);
    const selectedSlots = Array.from(slotsContainer.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);
    console.log('Selected Slots:', selectedSlots[0]);
    if (selectedSlots.length > 0) {
        for (let i = 0; i < selectedSlots.length; i++) {
            fetch(`/book/${date}/${turfId}/${selectedSlots[i]}`,{method: 'POST'})
            .then(response => {
                if (response.ok) {
                    return response.json(); // Parse JSON respons
                    } else {
                        throw new Error('Failed to book slots');
                    }
                })
                .then(data => {
                    location.reload();
                    console.log(data.message)
                })
                .catch(error => {
                    console.error('Error booking slots:', error);
                });
        }
    }
     else {
        alert('Please select at least one slot to book.');
     }
}
function uploadfun(turf){
    console.log("this is new");
    console.log(turf);
    const uploadForm = document.getElementById(`write_review${turf}`);
    console.log(uploadForm);
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const formData = new FormData(uploadForm);
        console.log(uploadForm)
        console.log('review working.....')
        fetch('/reviewing', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log("yes")
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Assuming the server returns JSON
        }).then(text => {
            rating(text.turf_id,text.user_id);
            console.log("rewvie write sucess full");
            
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });
}
function rating(turf,user){
    console.log('rating')
    console.log(turf);
    console.log(user);
    const newDiv = document.createElement('div');
    newDiv.id = 'myd'; // Set an ID
    newDiv.className = 'modal';
    newDiv.innerHTML = `
    <div class="modal-content">
        <h1>Rathing</h1> 
        <form id="ratingstar">
            <input type="hidden" value='${turf}' name="turfid">
            <input type="hidden" value="${user}" name="userid">
            <div class="rating">
                <input type="radio" id="star-1" name="star-radio" value="5.0">
                <label for="star-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
                    </svg>
                </label>
                <input type="radio" id="star-2" name="star-radio" value="4.0">
                <label for="star-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
                    </svg>
                </label>
                <input type="radio" id="star-3" name="star-radio" value="3.0">
                <label for="star-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
                    </svg>
                </label>
                <input type="radio" id="star-4" name="star-radio" value="2.0">
                <label for="star-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
                    </svg>
                </label>
                <input type="radio" id="star-5" name="star-radio" value="1.0">
                <label for="star-5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
                    </svg>
                </label>
            </div>
            <input id="confirmButton" type="submit" value="Submit Rating" >
        </form>
    </div> `;
    document.body.appendChild(newDiv);
    console.log(document.body.appendChild(newDiv));  
    const uploadForm = document.getElementById('ratingstar');
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const formData = new FormData(uploadForm); // Create FormData object
        console.log('Submitting rating...');
        fetch('/ratingstar', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Response from server:', data);
            document.body.removeChild(newDiv); 
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert('There was an error submitting your rating. Please try again.');
        });
    }); 
}
    function addlist(turf){
        const a = document.getElementById(`add${turf}`);
        a.style.color = "red";
        const formh = document.getElementById(`whish${turf}`);
        formh.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission
            const formData = new FormData(formh); // Create FormData object
            console.log('Submitting rating...');
            fetch('/addwhish', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }); 
    }

    function poplist(turf){
        const a = document.getElementById(`add${turf}`);
        a.style.color = "white";
        const formh = document.getElementById(`whish${turf}`);
        formh.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission
            const formData = new FormData(formh); // Create FormData object
            console.log('Submitting rating...');
            fetch('/popwhish', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }); 
    }
