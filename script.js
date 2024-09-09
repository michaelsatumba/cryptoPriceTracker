document.getElementById('fetchButton').addEventListener('click', function() {
    const cryptoInput = document.getElementById('cryptoInput').value.toLowerCase();
    const priceDisplay = document.getElementById('priceDisplay');

    if (!cryptoInput) {
        priceDisplay.innerHTML = 'Please enter a cryptocurrency name.';
        return;
    }

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoInput}&vs_currencies=usd`)
        .then(response => response.json())
        .then(data => {
            if (data[cryptoInput]) {
                const price = data[cryptoInput].usd;
                priceDisplay.innerHTML = `${cryptoInput.charAt(0).toUpperCase() + cryptoInput.slice(1)} Price: $${price}`;
            } else {
                priceDisplay.innerHTML = 'Cryptocurrency not found. Please try again.';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            priceDisplay.innerHTML = 'An error occurred. Please try again later.';
        });
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.container').classList.toggle('dark-mode');
    document.getElementById('darkModeToggle').classList.toggle('dark-mode');
    document.getElementById('cryptoInput').classList.toggle('dark-mode');
    document.getElementById('fetchButton').classList.toggle('dark-mode');
    document.getElementById('priceDisplay').classList.toggle('dark-mode');
    document.querySelector('h1').classList.toggle('dark-mode'); // Toggle h1 color
    document.querySelector('h2').classList.toggle('dark-mode'); // Toggle h2 color
    document.getElementById('cryptoTable').classList.toggle('dark-mode'); // Toggle table color

    // Change button text based on mode
    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = 'Light Mode'; // Change to Light Mode
    } else {
        darkModeToggle.textContent = 'Dark Mode'; // Change to Dark Mode
    }
});

// Fetch Top 100 Cryptocurrencies
function fetchTopCryptos() {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#cryptoTable tbody');
            tableBody.innerHTML = ''; // Clear existing rows

            data.forEach((crypto, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${crypto.name}</td>
                    <td>${crypto.symbol.toUpperCase()}</td>
                    <td>$${crypto.current_price.toFixed(2)}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching top cryptocurrencies:', error);
        });
}

// Call the function to fetch top cryptocurrencies on page load
fetchTopCryptos();

let chartInstance = null;

document.getElementById('fetchButton').addEventListener('click', function() {
    const cryptoInput = document.getElementById('cryptoInput').value.toLowerCase();
    const priceDisplay = document.getElementById('priceDisplay');
    const priceChartElement = document.getElementById('priceChart');
    const priceChart = priceChartElement.getContext('2d');

    if (!cryptoInput) {
        priceDisplay.innerHTML = 'Please enter a cryptocurrency name.';
        return;
    }

    fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cryptoInput}&vs_currencies=usd`)
        .then(response => response.json())
        .then(data => {
            if (data[cryptoInput]) {
                const price = data[cryptoInput].usd;
                priceDisplay.innerHTML = `${cryptoInput.charAt(0).toUpperCase() + cryptoInput.slice(1)} Price: $${price}`;

                // Fetch historical data
                fetch(`https://api.coingecko.com/api/v3/coins/${cryptoInput}/market_chart?vs_currency=usd&days=30`)
                    .then(response => response.json())
                    .then(data => {
                        const labels = data.prices.map(price => new Date(price[0]));
                        const prices = data.prices.map(price => price[1]);

                        // Log data for debugging
                        console.log('Labels:', labels);
                        console.log('Prices:', prices);

                        // Destroy previous chart instance if it exists
                        if (chartInstance) {
                            chartInstance.destroy();
                        }

                        // Show the canvas element
                        priceChartElement.style.display = 'block';

                        // Create new chart instance
                        chartInstance = new Chart(priceChart, {
                            type: 'line',
                            data: {
                                labels: labels,
                                datasets: [{
                                    label: `${cryptoInput.charAt(0).toUpperCase() + cryptoInput.slice(1)} Price (Last 30 Days)`,
                                    data: prices,
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1,
                                    fill: false
                                }]
                            },
                            options: {
                                scales: {
                                    x: {
                                        type: 'time',
                                        time: {
                                            unit: 'day'
                                        },
                                        adapters: {
                                            date: {
                                                locale: window.dateFnsLocaleEnUS // Use the global locale object
                                            }
                                        }
                                    },
                                    y: {
                                        beginAtZero: false
                                    }
                                }
                            }
                        });
                    });
            } else {
                priceDisplay.innerHTML = 'Cryptocurrency not found. Please try again.';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            priceDisplay.innerHTML = 'An error occurred. Please try again later.';
        });
});