// Get calculator modal, button, and input elements
const calculatorModal = document.getElementById('calculatorModal');
const calcButton = document.getElementById('calcButton');
const calculatorInput = document.querySelector('.calculator .input');

// Store the calculator string
let calculatorString = "";

// Add event listener to the calculator button to display the calculator modal
calcButton.addEventListener('click', () => {
    calculatorModal.style.display = 'block';
    calculatorString = "";
    calculatorInput.value = "";
});

// Add event listener to the window to close the calculator modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === calculatorModal) {
        calculatorModal.style.display = 'none';
    }
});

// Add event listeners to the calculator buttons to perform calculations
document.querySelectorAll('.calculator .button').forEach(button => {
    button.addEventListener('click', (e) => {
        const value = e.target.innerText;
        
        if (value === '=') {
            try {
                calculatorString = eval(calculatorString);
                calculatorInput.value = calculatorString;
            } catch (error) {
                calculatorInput.value = 'Error';
                calculatorString = '';
            }
        } else if (value === 'C') {
            calculatorString = '';
            calculatorInput.value = '';
        } else if (value === '←') {
            calculatorString = calculatorString.slice(0, -1);
            calculatorInput.value = calculatorString;
        } else {
            calculatorString += value;
            calculatorInput.value = calculatorString;
        }
    });
});
