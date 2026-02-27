function applyPollVisuals(countVotes, options, isAlreadyVoted = false) {
  const firstRef = document.getElementById("firstOptionReference");
  const secondRef = document.getElementById("secondOptionReference");
  const votedRef = document.getElementById("votedReference");

  const firstPercentage =
    Math.floor((options[0].votes / countVotes) * 100) || 0;
  const secondPercentage =
    Math.floor((options[1].votes / countVotes) * 100) || 0;

  firstRef.style.width = firstPercentage + "%";
  secondRef.style.width = secondPercentage + "%";

  document.getElementById("firstOptionPercentageReference").innerHTML =
    `(${firstPercentage}%)`;
  document.getElementById("secondOptionPercentageReference").innerHTML =
    `(${secondPercentage}%)`;

  if (isAlreadyVoted) {
    votedRef.innerHTML = `<div class="ui success message">Você já votou nesta enquete! Total de votos: ${countVotes}</div>`;
    firstRef.style.pointerEvents = "none";
    secondRef.style.pointerEvents = "none";
  }
}

async function getPool() {
  try {
    const response = await fetch("/api/pools", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error(`Response status: ${response.status}`);

    const result = await response.json();

    var firstOptionReference = document.getElementById("firstOptionReference");
    var secondOptionReference = document.getElementById(
      "secondOptionReference",
    );

    firstOptionReference.dataset.id = result.options[0].id;
    firstOptionReference.innerHTML = `<h3 class='ui center aligned header'>${result.options[0].name}</h3><h4 class='ui center aligned header' id='firstOptionPercentageReference'></h4>`;

    secondOptionReference.dataset.id = result.options[1].id;
    secondOptionReference.innerHTML = `<h3 class='ui center aligned header'>${result.options[1].name}</h3><h4 class='ui center aligned header' id='secondOptionPercentageReference'></h4>`;

    countdownTimeStart(new Date(result.expired_date));

    const savedPoll = JSON.parse(localStorage.getItem("user_vote_data"));

    if (savedPoll) {
      applyPollVisuals(savedPoll.countVotes, savedPoll.options, true);
    }
  } catch (error) {
    console.error(error.message);
  }
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
      showMessage(
        error.message || "Querendo burlar a urna né, vacilão?",
        "warning",
      );
      return;
    }

    if (!response.ok) {
      const error = await response.json();
      showMessage(error.message || "Erro ao votar", "error");
      return;
    }

    const result = await response.json();

    applyPollVisuals(result.countVotes, result.options, true);

    const dataToSave = {
      voted: true,
      countVotes: result.countVotes,
      options: result.options,
    };
    localStorage.setItem("user_vote_data", JSON.stringify(dataToSave));
  } catch (error) {
    showMessage("Erro de conexão.", "error");
  }
}

function showMessage(message, type = "info") {
  const votedReference = document.getElementById("votedReference");
  votedReference.innerHTML = `<div class="ui ${type} message">${message}</div>`;
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

    if (timerReference)
      timerReference.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
    if (distance < 0) {
      clearInterval(x);
      timerReference.innerHTML = "ACABOU!";
    }
  }, 1000);
}

getPool();
