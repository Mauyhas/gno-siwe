const connectButton = document.getElementById('connect');
const logoutButton = document.getElementById('logout');
const loggedOutDiv = document.getElementById('loggedOut');
const loggedInDiv = document.getElementById('loggedIn');
const loadingDiv = document.getElementById('loading');

let isLoggedIn = false;
let isLoading = false;
let profileId = null

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
      profileId = address
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

document.getElementById('profileForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get the form values
    const username = document.getElementById('username').value;
    const bio = document.getElementById('bio').value;
    // Prepare the data payload
    const profileData = { profileId, username, bio };

    try {
      // Send the data to the backend
      const response = await fetch('http://localhost:3000/user-profile/set', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      // Check if the response is successful
      if (response.ok) {
        alert('Profile saved successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again later.');
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
