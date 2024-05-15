const typingText = document.querySelector(".typing-text p"),
      inpField = document.querySelector(".wrapper .input-field"),
      tryAgainBtn = document.querySelector(".content button"),
      timeTag = document.querySelector(".time span b"),
      mistakeTag = document.querySelector(".mistake span"),
      wpmTag = document.querySelector(".wpm span"),
      cpmTag = document.querySelector(".cpm span"),
      resultsList = document.querySelector(".results-list"),
      addParagraphBtn = document.querySelector("#addParagraphBtn"),
      customParagraphTextarea = document.querySelector("#customParagraph"),
      paragraphCardsContainer = document.querySelector(".paragraph-cards");

let timer,
    maxTime = 60,
    timeLeft = maxTime,
    charIndex = mistakes = isTyping = 0,
    recentResults = [];

function loadParagraph(index) {
    typingText.innerHTML = "";
    paragraphs[index].split("").forEach(char => {
        let span = `<span>${char}</span>`;
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", (e) => {
        if (e.target !== customParagraphTextarea) {
            inpField.focus();
        }
    });
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
    if (document.activeElement !== inpField) return;

    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];
    if (charIndex < characters.length && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if (typedChar == null) {
            if (charIndex > 0) {
                charIndex--;
                if (characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        if (charIndex < characters.length) {
            characters[charIndex].classList.add("active");
        }

        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
        cpmTag.innerText = charIndex - mistakes;
    } else {
        clearInterval(timer);
        saveResult();
        inpField.value = "";
    }
}

function initTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
    } else {
        clearInterval(timer);
    }
}

function saveResult() {
    const wpm = wpmTag.innerText;
    const mistakes = mistakeTag.innerText;
    const cpm = cpmTag.innerText;
    const result = `WPM: ${wpm}, Mistakes: ${mistakes}, CPM: ${cpm}`;

    // Prevent duplicate save if already saved at end
    if (recentResults.length === 0 || recentResults[recentResults.length - 1] !== result) {
        recentResults.push(result);
    }

    if (recentResults.length > 5) {
        recentResults.shift();
    }

    updateResultsList();
}

function updateResultsList() {
    resultsList.innerHTML = "";
    recentResults.forEach(result => {
        const li = document.createElement("li");
        li.innerText = result;
        resultsList.appendChild(li);
    });
}

function resetGame() {
    loadParagraph(0);
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = isTyping = 0;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
    mistakeTag.innerText = 0;
    cpmTag.innerText = 0;
}

function addCustomParagraph() {
    const customParagraph = customParagraphTextarea.value.trim();
    if (customParagraph) {
        paragraphs.push(customParagraph);
        customParagraphTextarea.value = "";
        alert("Paragraph added successfully!");
        displayParagraphCards();
    } else {
        alert("Please enter a valid paragraph.");
    }
}

function displayParagraphCards() {
    paragraphCardsContainer.innerHTML = "";
    paragraphs.forEach((paragraph, index) => {
        const card = document.createElement("div");
        card.className = "paragraph-card";
        card.innerText = paragraph.length > 300 ? paragraph.slice(0, 300) + "..." : paragraph;
        card.addEventListener("click", () => loadParagraph(index));
        paragraphCardsContainer.appendChild(card);
    });
}

addParagraphBtn.addEventListener("click", addCustomParagraph);
loadParagraph(0);
inpField.addEventListener("input", initTyping);
tryAgainBtn.addEventListener("click", resetGame);
displayParagraphCards();
