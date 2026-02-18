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
    var secondOptionReference = document.getElementById(
      "secondOptionReference",
    );

    firstOptionReference.dataset.id = result.options[0].id;
    firstOptionReference.title = result.options[0].name;
    firstOptionReference.innerHTML =
      "<h3 class='ui center aligned header'>" +
      result.options[0].name +
      "</h3><h4 class='ui center aligned header' id='firstOptionPercentageReference'></h4>";

    secondOptionReference.dataset.id = result.options[1].id;
    secondOptionReference.title = result.options[1].name;
    secondOptionReference.innerHTML =
      "<h3 class='ui center aligned header'>" +
      result.options[1].name +
      "</h3><h4 class='ui center aligned header'  id='secondOptionPercentageReference'></h4>";

    countdownTimeStart(new Date(result.expired_date));
  } catch (error) {
    console.error(error.message);
  }
}

function showMessage(message, type = 'info') {
  const votedReference = document.getElementById("votedReference");
  votedReference.innerHTML = `<div class="ui ${type} message">${message}</div>`;
  
  setTimeout(() => {
    const messageDiv = votedReference.querySelector('.message');
    if (messageDiv) {
      messageDiv.style.transition = 'opacity 0.5s';
      messageDiv.style.opacity = '0';
      setTimeout(() => votedReference.innerHTML = '', 500);
    }
  }, 5000);
}

async function vote(element) {
  const idOption = element.dataset.id;
  const data = { id_option: idOption };

  try {
    const response = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.status === 409) {
      const error = await response.json();
showMessage(error.message || "Querendo burlar a urna né, vacilão?", 'warning');      return;
    }

    if (response.status === 403) {
      const error = await response.json();
      showMessage(error.message || "Esta enquete já expirou zé da manga!", 'error');
      return;
    }

    if (!response.ok) {
      const error = await response.json();
      showMessage(error.message || "Erro ao processar seu voto", 'error');
      return;
    }

    const result = await response.json();

    const votedReference = document.getElementById("votedReference");
    const firstOptionReference = document.getElementById("firstOptionReference");
    const secondOptionReference = document.getElementById("secondOptionReference");
    const countVotes = result.countVotes;

    const firstOptionPercentage = Math.floor((result.options[0].votes / countVotes) * 100) || 0;
    const secondOptionPercentage = Math.floor((result.options[1].votes / countVotes) * 100) || 0;

    firstOptionReference.style.width = firstOptionPercentage + "%";
    secondOptionReference.style.width = secondOptionPercentage + "%";

    const firstOptionPercentageReference = document.getElementById("firstOptionPercentageReference");
    firstOptionPercentageReference.innerHTML = "(" + firstOptionPercentage + "%)";

    const secondOptionPercentageReference = document.getElementById("secondOptionPercentageReference");
    secondOptionPercentageReference.innerHTML = "(" + secondOptionPercentage + "%)";

    votedReference.innerHTML = 
      `<div class="ui success message">Obrigado por votar! Você e mais ${countVotes - 1} pessoas votaram.</div>`;
  } catch (error) {
    showMessage("Não foi possível conectar ao servidor. Tente novamente.", 'error');
  }
}

function countdownTimeStart(countDownDate) {
  var timerReference = document.getElementById("timerReference");

  var x = setInterval(function () {
    var now = new Date().getTime();

    var distance = countDownDate - now;

    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
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
