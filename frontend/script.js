async function getPool() {
    try {
        const response = await  fetch("http://localhost:3000/pools", {
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        });
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("getPool complete! response:", result);
        
        var poolReference = document.getElementById("poolReference");
        var firstOptionReference = document.getElementById("firstOptionReference");
        var secondOptionReference = document.getElementById("secondOptionReference");
        
        poolReference.innerHTML = result.name;
        firstOptionReference.dataset.id = result.options[0].id;
        firstOptionReference.innerHTML = result.options[0].name;
        
        secondOptionReference.dataset.id = result.options[1].id;
        secondOptionReference.innerHTML = result.options[1].name;
        
        countdownTimeStart(new Date(result.expired_date));
    } catch (error) {
        console.error(error.message);
    }
}

async function vote(element) {
    try {
        idOption = element.dataset.id;
        let data = {
            id_option: idOption
        };
        
        const response = await fetch("http://localhost:3000/vote", {
            method: "POST",
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify(data)
        })
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("vote complete! response:", result);
        
        var votedReference = document.getElementById("votedReference");
        var firstOptionReference = document.getElementById("firstOptionReference");
        var secondOptionReference = document.getElementById("secondOptionReference");
        var countVotes = result.countVotes;
        
        var firstOptionPercentage = (result.totalVotes[0] / countVotes) * 100;
        var secondOptionPercetage = (result.totalVotes[1] / countVotes) * 100;
        
        firstOptionReference.style.width = firstOptionPercentage;
        secondOptionReference.style.width = secondOptionPercetage;
        
        votedReference.innerHTML = "você escolheu <b> xxxx" + "</b> e mais <b>" + result.countVotes + "</b> votaram";
        
    } catch (error) {
        console.error(error.message);
    }
}


function countdownTimeStart(countDownDate){
    var timerReference = document.getElementById("timerReference");
    
    var x = setInterval(function() {
        
        var now = new Date().getTime();
        
        var distance = countDownDate - now;
        
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        if (timerReference != null) {
            timerReference.innerHTML = hours + "h "+ minutes + "m " + seconds + "s ";
        }
        
        if (distance < 0) {
            clearInterval(x);
            timerReference.innerHTML = "ACABOU!";
        }
    }, 1000);
}

getPool();