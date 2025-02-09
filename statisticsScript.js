document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const statisticsModal = document.getElementById('statisticsModal');
    const statsButton = document.getElementById('statsButton');
    const closeStatsButton = statisticsModal.querySelector('.close-modal');
    const statsTabs = document.querySelectorAll('.stats-tab');
    let currentTab = 'overview'; // Default tab
    let pieChart = null; // Placeholder for the chart instance

    // Event listeners setup
    statsButton.addEventListener('click', showStatistics);
    closeStatsButton.addEventListener('click', () => statisticsModal.style.display = 'none');
    statsTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            statsTabs.forEach(t => t.classList.remove('active')); // Remove active class from all tabs
            e.target.classList.add('active'); // Add active class to the clicked tab
            currentTab = e.target.dataset.type; // Update current tab
            updatePieChart(); // Update the pie chart based on the selected tab
        });
    });
    window.addEventListener('click', (e) => {
        if (e.target === statisticsModal) statisticsModal.style.display = 'none'; // Close modal if clicked outside
    });

    // Function to show the statistics modal
    function showStatistics() {
        statisticsModal.style.display = 'block'; 
        currentTab = 'overview';
        statsTabs[0].classList.add('active');
        updatePieChart(); 
    }

    // Function to determine chart data based on the current tab
    function getChartData() {
        switch (currentTab) {
            case 'overview':
                // Calculate total income and expense
                const incomeTotal = transactions.filter(trx => trx.type === 'income').reduce((sum, trx) => sum + trx.amount, 0);
                const expenseTotal = transactions.filter(trx => trx.type === 'expense').reduce((sum, trx) => sum + trx.amount, 0);
                return { labels: ['Income', 'Expense'], data: [incomeTotal, expenseTotal], backgroundColor: ['#4CAF50', '#f44336'] };
            case 'income':
                return getCategoryData('income'); // Get category-wise income data
            case 'expense':
                return getCategoryData('expense'); // Get category-wise expense data
        }
    }

    // Function to get category-wise data for a given transaction type
    function getCategoryData(type) {
        const categoryTotals = {};
        transactions.filter(trx => trx.type === type).forEach(trx => {
            const amount = Math.abs(trx.amount);
            if (categoryTotals[trx.category]) categoryTotals[trx.category] += amount;
            else categoryTotals[trx.category] = amount;
        });
        const categories = Object.keys(categoryTotals);
        return { labels: categories, data: categories.map(cat => categoryTotals[cat]), backgroundColor: categories.map(cat => categoryColors[cat] || getRandomColor()) };
    }

    // function to update the pie chart
    function updatePieChart() {
        const ctx = document.getElementById('categoryPieChart').getContext('2d'); // Get chart context
        const chartData = getChartData(); // Get data for the chart
        const data = { labels: chartData.labels, datasets: [{ data: chartData.data, backgroundColor: chartData.backgroundColor, borderWidth: 1 }] }; // Chart data configuration
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { font: { family: "'Inter', sans-serif", size: 12 } } },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const label = context.label || ''; // Get label
                            const value = context.raw || 0; // Get value
                            const total = context.dataset.data.reduce((a, b) => a + b, 0); // Calculate total
                            const percentage = ((value / total) * 100).toFixed(1); // Calculate percentage
                            return `${label}: ${formatCurrency(value)} (${percentage}%)`; // format label
                        }
                    }
                }
            }
        };
        if (pieChart) pieChart.destroy(); // destroy existing chart instance
        pieChart = new Chart(ctx, { type: 'pie', data: data, options: options }); // Create new chart 
    }

    // ctegory colors mapping
    const categoryColors = {
        food: '#FF6384',
        transportation: '#36A2EB',
        utilities: '#FFCE56',
        entertainment: '#4BC0C0',
        shopping: '#9966FF',
        health: '#FF9F40',
        education: '#FF99CC',
        salary: '#66FF99',
        investment: '#99CCFF',
        other: '#C9CBCF'
    };

    // function to generate a random color
    function getRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
});
