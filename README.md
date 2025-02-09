# Expense Tracker Application

Welcome to our Expense Tracker Application – your friendly companion for managing your income and expenses! This project was built with love using HTML, CSS, and JavaScript so you can track your spending, analyze trends, and even use handy tools like a calculator and a notes editor.

## Overview

Our app lets you:
- Easily add transactions with details like descriptions, amounts, dates, types (income or expense), and categories.
- Quickly view and filter your transaction history.
- Get a real-time summary of your current balance, total income, and total expenses.
- Visualize your finances with interactive pie charts.
- Perform quick calculations using the integrated calculator.
- Jot down thoughts and reminders with the in-app notes feature.

## Features

- **Transaction Management**  
  Add, edit, and delete transactions effortlessly. Your data is saved locally so you never lose track of your spending.
  
- **Statistics & Pie Charts**  
  View eye-catching charts in a modal that help you understand where your money's going by breaking down income versus expenses or by category.

- **Built-in Calculator**  
  Enjoy a simple and responsive calculator to handle quick math without leaving the app.
  
- **Notes Functionality**  
  Keep a personal diary or reminders by creating, updating, and deleting notes. Everything you write is saved locally.


## Project Structure

- **index.html**  
  Main HTML file containing structural elements for transaction input, headers, and modals.

- **style.css**  
  Global CSS for overall styling, layout with flexbox and grid, animations (fade, slide, pulse, bounce), and responsive behavior.

- **script.js**  
  Contains application logic for managing transactions, updating the balance, and interacting with the DOM.

- **PieChart folder**  
  - **statisticsStyle.css**: CSS styles for the statistics modal.  
  - **statisticsScript.js**: JavaScript for generating and updating pie charts based on transaction data.

- **Calculator folder**  
  - **calculatorStyle.css**: CSS for styling the calculator modal.  
  - **calculatorScript.js**: JavaScript for handling calculator operations such as arithmetic calculations and input management.

- **Notes folder**  
  - **notesStyle.css**: Styles for the notes modal, note cards, and form elements.  
  - **notesScript.js**: JavaScript for adding, editing, and deleting notes along with local storage interactions.

## Detailed Modal Behaviors

- **Statistics Modal:**  
  A friendly pop-up that shows you interactive charts. Just click outside or use the close button to dismiss it.

- **Calculator Modal:**  
  Opens up when you need a speedy calculation – it resets each time and is easy to close by clicking outside.

- **Notes Modal:**  
  A dedicated space to create or edit your notes, which will automatically refresh when you open or close it.

## Additional Details

- We use CSS variables to keep the design consistent and appealing.
- Enjoy smooth animations (slideIn, fadeIn, pulse, bounce) that make using the app fun.
- Responsive design means it looks great on both desktops and mobiles.
- JavaScript initializes after the page loads, ensuring everything works like a charm.

## Known Limitations

- The calculator relies on JavaScript’s eval() for simplicity. For extra security in a production setup, a parsing library would be ideal.
- Your browser’s local storage has its limits on data size.

