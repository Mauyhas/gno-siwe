const connectButton = document.getElementById('connect');
const logoutButton = document.getElementById('logout');
const loggedOutDiv = document.getElementById('loggedOut');
const loggedInDiv = document.getElementById('loggedIn');
const loadingDiv = document.getElementById('loading');

let isLoggedIn = false;
let isLoading = false;

// Function to update UI based on flags
function updateUI() {
  // Hide all state divs initially
  loggedOutDiv.style.display = 'none';
  loggedInDiv.style.display = 'none';
  loadingDiv.style.display = 'none';

  // Show the correct div based on flags
  if (isLoading) {
    loadingDiv.style.display = 'block';
  } else if (isLoggedIn) {
    loggedInDiv.style.display = 'block';
  } else {
    loggedOutDiv.style.display = 'block';
  }
}

// Connect Wallet Button Click
connectButton.addEventListener('click', async () => {
  if (window.ethereum) {
    try {
      isLoading = true;
      updateUI(); // Show loading state

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      console.log('Connected to Ethereum Wallet with address:', address);
      isLoggedIn = true;
      isLoading = false;
      updateUI(); // Show logged-in state

    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect');
      isLoading = false;
      updateUI(); // Go back to logged-out state
    }
  } else {
    alert('MetaMask not found! Please install it.');
  }
});

// Logout Button Click
logoutButton.addEventListener('click', () => {
  console.log('Logging out...');
  alert('Logged out!');

  isLoggedIn = false;
  updateUI(); // Show logged-out state
});

// Initial UI setup
updateUI();
