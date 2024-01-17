const form = document.querySelector("form");
const resultDiv = document.querySelector(".result");
const errorDiv = document.querySelector(".error");
const spinner = document.querySelector(".spinner");
const showSpinner = () => {
  spinner.classList.add("visible");
};
const wordInput = document.getElementById("word-input");
const audioContainer = document.querySelector(".audio-container");

// Error Handling Functions
const showErrorMessage = (error) => {
  errorDiv.innerHTML = `<p>${error.message}</p>`;
  errorDiv.classList.add("visible");
  resultDiv.classList.remove("visible");
};

const hideErrorMessage = () => {
  errorDiv.innerHTML = "";
  errorDiv.classList.remove("visible");
};

const showWordNotFound = (word) => {
  errorDiv.innerHTML = `<p>No information found for the word: ${word}</p>`;
  errorDiv.classList.add("visible");
  resultDiv.classList.remove("visible");
};

// Spinner Functions
const hideSpinner = () => {
  spinner.classList.remove("visible");
};

// Search Word Function
function searchWord() {
  const word = wordInput.value.trim();

  if (word === "") {
    alert("Please enter a word to search.");
    return;
  }

  showSpinner();

  // Simulate a search
  setTimeout(() => {
    hideSpinner();
    // Replace this with actual search logic
    const result = `The meaning of ${word} is ...`;
    document.querySelector(".result").innerHTML = result;
  }, 2000);
}

// Main getWordInfo Function
const getWordInfo = async (word) => {
  try {
    hideErrorMessage();

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    const data = await response.json();

    if (data && data.length > 0) {
      showResult(data[0]);
    } else {
      showWordNotFound(word);
    }

    console.log(data);
  } catch (error) {
    console.error("Error getting word information:", error);
    showErrorMessage(error);
  }
};

// Result Handling Function
const showResult = (data) => {
  resultDiv.innerHTML = "";

  if (!data || !data.meanings || data.meanings.length === 0) {
    showWordNotFound(data.word);
    resultDiv.classList.remove("visible");
    return;
  }

  let definitions = data.meanings[0].definitions[0];

  resultDiv.innerHTML = `
      <h2><strong>Word:</strong>${data.word}</h2>
      <p class="partOfSpeech">${data.meanings[0].partOfSpeech}</p>
      <div class="audio-container"></div>
      <p>US <i class="fas fa-volume-up"></i></p>
      <p class="partOfSpeech"><strong>Phonetic:</strong>${data.phonetic}</p>
      <p><strong>Meaning:</strong>${definitions.definition || "Not Found"}</p>
      <p><strong>Example:</strong>${definitions.example || "Not Found"}</p>
      <p><strong>Antonyms:</strong>`;

  if (definitions.antonyms && definitions.antonyms.length > 0) {
    resultDiv.innerHTML += `<ul>`;
    for (let i = 0; i < definitions.antonyms.length; i++) {
      resultDiv.innerHTML += `<li>${definitions.antonyms[i]}</li>`;
    }
    resultDiv.innerHTML += `</ul>`;
  } else {
    resultDiv.innerHTML += `Not Found`;
  }

  if (data.sourceUrls) {
    resultDiv.innerHTML += `<div><a href="${data.sourceUrls}" target="_blank">Read More</a></div>`;
  }
  if (data.phonetics && data.phonetics.length > 0) {
    const phonetic = data.phonetics[0];
    if (phonetic.audio) {
      const audioElement = document.createElement("audio");
      audioElement.classList.add("audio-element");
      audioElement.src = phonetic.audio;
      audioElement.type = "audio/mpeg";
      audioElement.style.display = "none";
      document.body.appendChild(audioElement);

      const audioContainer = document.querySelector(".audio-container");
      audioContainer.appendChild(audioElement);

      document.querySelector(".fa-volume-up").addEventListener("click", () => {
        const audioElement = document.querySelector(".audio-element");
        audioElement.play();
      });
    }
  }

  resultDiv.classList.add("visible");
};

// Event Listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = form.elements[0].value.trim();

  if (inputValue) {
    showSpinner();
    getWordInfo(inputValue);
  } else {
    showEmptyInputError();
  }
});
