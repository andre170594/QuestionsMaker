
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";


const firebaseConfig = {
  apiKey: "AIzaSyBm_jbKnyNiXewzaHwp8wXYc-MuqKxKFVw",
  authDomain: "certificationproject-3dbf5.firebaseapp.com",
  databaseURL: "https://certificationproject-3dbf5-default-rtdb.firebaseio.com",
  projectId: "certificationproject-3dbf5",
  storageBucket: "certificationproject-3dbf5.firebasestorage.app",
  messagingSenderId: "126368435801",
  appId: "1:126368435801:web:33845b9d0b33b89baaab48"
};

const app = initializeApp(firebaseConfig);

import {getDatabase, ref, get, set, child, update, remove, push}
    from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const db = getDatabase();

var questionInput = document.querySelector("#enterQuestion");
var addOpts = document.querySelector("#AddOpts");
var explanationInput = document.querySelector("#enterExplanation");
var insertBtn = document.querySelector("#insert");
var removeBtn = document.querySelector("#RemoveOpts");
var updateBtn = document.querySelector("#update");
var removeQuestionBtn = document.querySelector("#remove");


var categoryChooser = document.getElementById("categoryChooser");
var questionsList = document.getElementById("questionsList");
var viewQuestionButton = document.getElementById("viewQuestion");



function AddOption() {

    const optionsContainer = document.querySelector("#options");
    const currentOptions = optionsContainer.querySelectorAll("input[type='text']");


    if (currentOptions.length < 6) {
        const newOptionNumber = currentOptions.length + 1;
        const newOptionHTML = `
            <div class="option-container">
            <h4>OPT${newOptionNumber}</h4>
            <input id="opt${newOptionNumber}" type="text" class="option-input">
            <input type="checkbox" id="check${newOptionNumber}">
            </div>
        `;

        const addButton = document.querySelector("#AddOpts");
        addButton.insertAdjacentHTML("beforebegin", newOptionHTML);
    } else {
        alert("Maximum of 6 options reached.");
    }
}
function RemoveOption() {
    const optionsContainer = document.querySelector("#options");
    const currentOptions = optionsContainer.querySelectorAll(".option-container");

    if (currentOptions.length > 2) {
        const lastOption = currentOptions[currentOptions.length - 1];

        console.log("Attempting to remove:", lastOption);
        console.log("Is lastOption a child of optionsContainer?", optionsContainer.contains(lastOption));

        if (optionsContainer.contains(lastOption)) {
            lastOption.remove();
            console.log("Successfully removed:", lastOption);
        }
    } else {
        alert("Minimum of 2 options required.");
    }
}



function InsertData() {
    const category = document.getElementById("categoryChooser").value;
    if (category==="NONE") {
        alert("Please select a category.");
        return;
    }
    if (!questionInput.value) {
        alert("Please enter a question before inserting.");
        return;
    }

  const optionsList = [];
  let numCorrect = 0;

   let i = 1;
    while (document.getElementById(`opt${i}`)) {
        const optionText = document.getElementById(`opt${i}`).value;
        const isCorrect = document.getElementById(`check${i}`).checked;

        if (isCorrect) {
            numCorrect++;
        }
        optionsList.push({
            option: optionText,
            answers: isCorrect,
            selected: false
        });
        i++;
    }
    const questionText = questionInput.value;
    const explanationText = explanationInput.value;
    const questionData = {
        pergunta: questionText,
        listOpt: optionsList,
        explanation: explanationText,
        numCorrect: numCorrect
    };

    const pathQuestions = `/questions/${category}/`;
    const questionsRef = ref(db, pathQuestions);

    push(questionsRef, questionData)
        .then(() => {
            alert("Data added successfully");

            // Update counter for the selected category
            const counterPath = `/examNumQ/${category}`;
            const counterRef = ref(db, counterPath);

            get(counterRef)
                .then((snapshot) => {
                    let currentCount = snapshot.val() || 0;
                    currentCount += 1; // Increment the counter

                    return set(counterRef, currentCount);
                })
                .then(() => {
                    console.log("Counter updated successfully.");
                })
                .catch((error) => {
                    console.error("Error updating counter:", error);
                    alert("Failed to update the counter. Please try again.");
                });


            questionInput.value = "";
            explanationInput.value = "";
            optionsList.forEach((_, index) => {
                document.getElementById(`opt${index + 1}`).value = "";
                document.getElementById(`check${index + 1}`).checked = false;
            });
        })
        .catch((error) => {
            alert(error);
        })
}
async function loadQuestionsForCategory(category) {
    questionsList.innerHTML = ""; // Clear previous options
    const questionsRef = ref(db, `questions/${category}`);

    try {
        const snapshot = await get(questionsRef);
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const questionId = childSnapshot.key;
                const questionData = childSnapshot.val().pergunta; // Assuming 'pergunta' is the question text

                // Add each question as an option in the dropdown
                const option = document.createElement("option");
                option.value = questionId;
                option.textContent = questionData;
                option.className = "fixed-dropdown-option";
                questionsList.appendChild(option);
            });
        } else {
            alert("No questions found for this category.");
        }
    } catch (error) {
        alert("Error fetching questions: " + error);
    }
}
async function UpdateQuestion() {
    const selectedCategory = categoryChooser.value;
    const selectedQuestionId = questionsList.value;

    if (!selectedQuestionId) {
        alert("Please select a question to update.");
        return;
    }

    // Define the path to the selected question
    const questionRef = ref(db, `questions/${selectedCategory}/${selectedQuestionId}`);

    // Optional: Verify question exists before updating
    try {
        const snapshot = await get(questionRef);
        if (!snapshot.exists()) {
            alert("Selected question does not exist.");
            return;
        }
    } catch (error) {
        alert("Error verifying question: " + error);
        return;
    }

    // Collect updated question data
    const optionsList = [];
    let numCorrect = 0;

    let i = 1;
    while (document.getElementById(`opt${i}`)) {
        const optionText = document.getElementById(`opt${i}`).value;
        const isCorrect = document.getElementById(`check${i}`).checked;

        if (isCorrect) {
            numCorrect++;
        }
        optionsList.push({
            option: optionText,
            answers: isCorrect,
            selected: false
        });
        i++;
    }

    const questionText = questionInput.value;
    const explanationText = explanationInput.value;
    const updatedQuestionData = {
        pergunta: questionText,
        listOpt: optionsList,
        explanation: explanationText,
        numCorrect: numCorrect
    };

    // Update data in Firebase
    try {
        await update(questionRef, updatedQuestionData);
        alert("Question updated successfully.");
    } catch (error) {
        alert("Error updating question: " + error);
    }
}
async function DeleteQuestion() {
    const selectedCategory = categoryChooser.value;
    const selectedQuestionId = questionsList.value;

    if (!selectedQuestionId) {
        alert("Please select a question to delete.");
        return;
    }

    const questionRef = ref(db, `questions/${selectedCategory}/${selectedQuestionId}`);
    const confirmDelete = confirm("Are you sure you want to delete this question?");
    if (!confirmDelete) {
        return;
    }

    try {
        await remove(questionRef);
        alert("Question deleted successfully.");

        const counterPath = `/examNumQ/${selectedCategory}`;
        const counterRef = ref(db, counterPath);

        const snapshot = await get(counterRef);
        let currentCount = snapshot.val() || 0;

        if (currentCount > 0) {
            currentCount -= 1;
            await set(counterRef, currentCount);
            console.log("Counter updated successfully.");
        } else {
            console.log("Counter is already at zero; no decrement needed.");
        }

        await loadQuestionsForCategory(selectedCategory);

        questionInput.value = "";
        explanationInput.value = "";
        const optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = ""; // Clear all options

        for (let i = 1; i <= 2; i++) {
            optionsContainer.insertAdjacentHTML("beforeend", `
                <div class="option-container">
                    <h4>OPT${i}</h4>
                    <input id="opt${i}" type="text" class="option-input" value="">
                    <input type="checkbox" id="check${i}">
                </div>
            `);
        }

    } catch (error) {
        alert("Error deleting question: " + error);
    }
}


// Event listeners for buttons
addOpts.addEventListener("click", AddOption);
insertBtn.addEventListener('click', InsertData);
removeBtn.addEventListener('click', RemoveOption);
updateBtn.addEventListener('click', UpdateQuestion);
removeQuestionBtn.addEventListener('click', DeleteQuestion);
categoryChooser.addEventListener("change", async () => {
    const selectedCategory = categoryChooser.value;
    await loadQuestionsForCategory(selectedCategory);
});
viewQuestionButton.addEventListener("click", async () => {
    const selectedCategory = categoryChooser.value;
    const selectedQuestionId = questionsList.value;

    if (selectedQuestionId) {
        const questionRef = ref(db, `questions/${selectedCategory}/${selectedQuestionId}`);
        const snapshot = await get(questionRef);

        if (snapshot.exists()) {
            const questionData = snapshot.val();
            questionInput.value = questionData.pergunta;
            explanationInput.value = questionData.explanation;

            const optionsContainer = document.getElementById("options");
            optionsContainer.innerHTML = "";

            questionData.listOpt.forEach((option, index) => {
                const optionContainer = document.createElement("div");
                optionContainer.classList.add("option-container");

                optionContainer.innerHTML = `
                    <h4>OPT${index + 1}</h4>
                    <input id="opt${index + 1}" type="text" class="option-input" value="${option.option}">
                    <input type="checkbox" id="check${index + 1}" ${option.answers ? "checked" : ""}>
                `;
                optionsContainer.appendChild(optionContainer);
            });
        } else {
            alert("Question not found.");
        }
    }
});





