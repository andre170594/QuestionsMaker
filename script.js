// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBm_jbKnyNiXewzaHwp8wXYc-MuqKxKFVw",
  authDomain: "certificationproject-3dbf5.firebaseapp.com",
  databaseURL: "https://certificationproject-3dbf5-default-rtdb.firebaseio.com",
  projectId: "certificationproject-3dbf5",
  storageBucket: "certificationproject-3dbf5.firebasestorage.app",
  messagingSenderId: "126368435801",
  appId: "1:126368435801:web:33845b9d0b33b89baaab48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import {getDatabase, ref, get, set, child, update, remove, push}
    from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";

const db = getDatabase();

var questionInput = document.querySelector("#enterQuestion");
var addOpts = document.querySelector("#AddOpts");
var explanationInput = document.querySelector("#enterExplanation");

var insertBtn = document.querySelector("#insert");
var findBtn = document.querySelector("#find");




function AddOption() {
    // Get the options container and count current options
    const optionsContainer = document.querySelector("#options");
    const currentOptions = optionsContainer.querySelectorAll("input[type='text']");

    // Check if there are fewer than 6 options
    if (currentOptions.length < 6) {
        // Create a new option with checkbox
        const newOptionNumber = currentOptions.length + 1;
        const newOptionHTML = `
            <div class="option-container">
            <h4>OPT${newOptionNumber}</h4>
            <input id="opt${newOptionNumber}" type="text" class="option-input">
            <input type="checkbox" id="check${newOptionNumber}">
            </div>
        `;

        // Insert the new option HTML before the "Add Option" button
        const addButton = document.querySelector("#AddOpts");
        addButton.insertAdjacentHTML("beforebegin", newOptionHTML);
    } else {
        alert("Maximum of 6 options reached.");
    }
}


// Insert data function
function InsertData() {

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
        pergunta: questionText, // Question prompt
        listOpt: optionsList, // List of options
        explanation: explanationText, // Explanation for the question
        numCorrect: numCorrect // Number of correct options
    };

    var pathQuestions = "/questions/";
    if(document.getElementById("optionChooser").value === "CAD" )
        pathQuestions+="CAD/";
    if(document.getElementById("optionChooser").value === "CSA" )
        pathQuestions+="CSA/";
    if(document.getElementById("optionChooser").value === "CIS-HR" )
        pathQuestions+="CIS-HR/";

    const questionsRef = ref(db, pathQuestions);

    push(questionsRef, questionData)
        .then(() => {
            alert("Data added successfully");

            // limpar todos os campos
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

// Find data function
function FindDataByIndex() {

    const index = parseInt(document.getElementById("findByIndex").value, 10);
    // Validate the index input
    if (isNaN(index) || index < 0) {
        alert("Please enter a valid index.");
        return;
    }


    var pathQuestions = "/questions/";
    if(document.getElementById("optionChooser2").value === "CAD" )
        pathQuestions+="";
    if(document.getElementById("optionChooser2").value === "CSA" )
        pathQuestions+="CSA";
    if(document.getElementById("optionChooser2").value === "CIS-HR" )
        pathQuestions+="CIS-HR";



    const dbRef = ref(db, pathQuestions);
    get(dbRef)
        .then(async (snapshot) => {
            if (snapshot.exists()) {
                const questionsArray = Object.values(snapshot.val()); // Convert snapshot to an array
                if (index >= 0 && index < questionsArray.length) {
                    const questionData = questionsArray[index];

                    // Set question input fields with the retrieved data
                    questionInput.value = questionData.pergunta;
                    explanationInput.value = questionData.explanation;


                    // Check if there are enough options displayed; add more if needed
                    const requiredOptions = questionData.listOpt.length+1;
                    const currentOptions = document.querySelectorAll(".option-container").length;

                    // Add options until we have the required number
                    for (let i = currentOptions; i < requiredOptions; i++) {
                        AddOption();
                    }

                    await new Promise(resolve => setTimeout(resolve, 50));

                    questionData.listOpt.forEach((option, i) => {
                        // Dynamically add options if they don’t already exist

                        document.getElementById(`opt${i + 1}`).value = option.option;
                        document.getElementById(`check${i + 1}`).checked = option.answers;
                    });
                } else {
                    alert("Index out of range");
                }
            } else {
                alert("No data found");
            }
        })
        .catch((error) => {
            alert(error);
        });

}




// Event listeners for buttons
addOpts.addEventListener("click", AddOption);
insertBtn.addEventListener('click', InsertData);
findBtn.addEventListener('click', FindDataByIndex);




