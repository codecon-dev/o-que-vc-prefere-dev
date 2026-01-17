async function getPool() {
  try {
    const response = await fetch("/api/pools", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log("getPool complete! response:", result);

    var firstOptionReference = document.getElementById("firstOptionReference");
    var secondOptionReference = document.getElementById("secondOptionReference");

    firstOptionReference.dataset.id = result.options[0].id;
    firstOptionReference.innerHTML = "<h3 class='ui center aligned header'>" + result.options[0].name + "</h3><span id='firstOptionPercentageReference'></span>";

    secondOptionReference.dataset.id = result.options[1].id;
    secondOptionReference.innerHTML = "<h3 class='ui center aligned header'>" + result.options[1].name + "</h3><span id='secondOptionPercentageReference'></span>";

    countdownTimeStart(new Date(result.expired_date));
  } catch (error) {
    console.error(error.message);
  }
}

async function vote(element) {
  try {
    idOption = element.dataset.id;
    let data = {
      id_option: idOption,
    };

    const response = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log("vote complete! response:", result);

    var votedReference = document.getElementById("votedReference");
    var firstOptionReference = document.getElementById("firstOptionReference");
    var secondOptionReference = document.getElementById("secondOptionReference");
    var countVotes = result.countVotes;

    var firstOptionPercentage = (result.options[0][1] / countVotes) * 100;
    var secondOptionPercetage = (result.options[0][2] / countVotes) * 100;

    firstOptionReference.style.width = firstOptionPercentage + "%";
    secondOptionReference.style.width = secondOptionPercetage + "%";

    var firstOptionPercentageReference = document.getElementById("firstOptionPercentageReference");
        firstOptionPercentageReference.innerHTML = "("+firstOptionPercentage+"%)";

        var secondOptionPercentageReference = document.getElementById("secondOptionPercentageReference");
        secondOptionPercentageReference.innerHTML = "("+secondOptionPercetage+"%)";

        votedReference.innerHTML = "Obrigado por votar, você e mais " + result.countVotes + " pessoas votaram.";
    } catch (error) {
        console.error(error.message);
    }
}

function countdownTimeStart(countDownDate) {
  var timerReference = document.getElementById("timerReference");

  var x = setInterval(function () {
    var now = new Date().getTime();

    var distance = countDownDate - now;

    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (timerReference != null) {
      timerReference.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
    }

    if (distance < 0) {
      clearInterval(x);
      timerReference.innerHTML = "ACABOU!";
    }
  }, 1000);
}

getPool();
