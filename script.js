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
                priceDisplay.innerHTML = `${cryptoInput.charAt(0).toUpperCase() + cryptoInput.slice(1)} Price: ${price}`;
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
document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    document.querySelector('.container').classList.toggle('dark-mode');
    document.getElementById('darkModeToggle').classList.toggle('dark-mode');
    document.getElementById('cryptoInput').classList.toggle('dark-mode');
    document.getElementById('fetchButton').classList.toggle('dark-mode');
    document.getElementById('priceDisplay').classList.toggle('dark-mode');

    // Change button text based on mode
    if (document.body.classList.contains('dark-mode')) {
        darkModeToggle.textContent = 'Light Mode'; // Change to Light Mode
    } else {
        darkModeToggle.textContent = 'Dark Mode'; // Change to Dark Mode
    }
});
