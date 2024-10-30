const connectButton = document.getElementById('connect');
const logoutButton = document.getElementById('logout');
const loggedOutDiv = document.getElementById('loggedOut');
const loggedInDiv = document.getElementById('loggedIn');
const loadingDiv = document.getElementById('loading');

let isLoggedIn = false;
let isLoading = false;
let profileId = null;

async function getProfileData(userId) {
  const url = `http://35.238.178.34:3000/user-profile/get?id=${userId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      // Show "Create User Profile" section if the profile doesn't exist
      document.getElementById('createUserProfile').style.display = 'block';
      document.getElementById('editUserProfile').style.display = 'none';
    } else {
      // Show "Edit User Profile" section if the profile exists
      const data = await response.json();
      setFormData(data);
      document.getElementById('createUserProfile').style.display = 'none';
      document.getElementById('editUserProfile').style.display = 'block';
    }

  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    // Optionally, handle additional error logic here, like showing a message to the user
  }
}


function setFormData(profileData) {
  document.getElementById('username').value = profileData.username;
  document.getElementById('bio').value = profileData.bio;
}
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
      const profileData = getProfileData(address);
      profileId = address
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
    alert('Accont/Wallet not found! Please install it.');
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
      //TODO - configure host:port
      const response = await fetch('http://35.238.178.34:3000/user-profile/set', {
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
