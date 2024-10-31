import { BrowserProvider } from 'ethers';
import { SiweMessage } from 'siwe';

const domain = window.location.host;
const origin = window.location.origin;
const BACKEND_ADDR = "http://35.238.178.34:3000";
let provider = new BrowserProvider(window.ethereum);
let isLoggedIn = false;
let isLoading = false;

// UI Element References
const siweBtn = document.getElementById('siweBtn');
const logoutBtn = document.getElementById('logout');
const loggedOutDiv = document.getElementById('loggedIn');
const loggedInDiv = document.getElementById('editUserProfile');
const loadingDiv = document.getElementById('loading');

// Initialize button event listeners
siweBtn.onclick = signInWithEthereum;
logoutBtn.onclick = logout;

// Fetch nonce and create SIWE message
async function createSiweMessage(address, statement) {
  const res = await fetch(`${BACKEND_ADDR}/nonce`, {
    method: 'GET',
    credentials: 'include',
  });

  const nonce = await res.text();
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: '1',
    nonce,
  });
  
  return message.prepareMessage();
}

// Sign in with Ethereum and update UI
async function signInWithEthereum() {
  try {
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    const message = await createSiweMessage(address, 'Sign in with Ethereum to the app.');
    const signature = await signer.signMessage(message);

    // Store the values in localStorage
    localStorage.setItem('addressProfileId', address);
    localStorage.setItem('message', message);
    localStorage.setItem('signature', signature);

    isLoggedIn = true;
    showEditProfileForm("Welcome! You are now logged in.");
  } catch (e) {
    console.error(e);
    alert('Failed to log in');
  }
}

// Show profile form upon successful login
async function showEditProfileForm(msg) {
  document.getElementById('welcomeMessage').innerText = msg;
  await fetchProfile()
  loggedInDiv.style.display = 'block';
  loggedOutDiv.style.display = 'none';
  loadingDiv.style.display = 'none';
  updateUI();
}

// Logout and clear session data
async function logout() {
  localStorage.removeItem('addressProfileId');
  localStorage.removeItem('message');
  localStorage.removeItem('signature');

  isLoggedIn = false;
  updateUI();
}

async function fetchProfile() {
    const addressProfileIdLocalStorage = localStorage.getItem('addressProfileId')
    // Ensure the profile ID is provided
    if (!addressProfileIdLocalStorage) {
      console.error('Profile ID is missing.');
      return;
    }
  
    // Define the URL for the GET request with the profile ID as a query parameter
    const url = `${BACKEND_ADDR}/user-profile/get?id=${addressProfileIdLocalStorage}`;
  
    try {
      // Send a GET request to retrieve the profile
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        // Show "Edit User Profile" section if the profile exists
        const data = await response.json();
        setFormData(data);
        
      }
  
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }

  function setFormData(profileData) {
    document.getElementById('username').value = profileData.username;
    document.getElementById('bio').value = profileData.bio;
  }
  

// Form submission to save profile
document.getElementById('profileForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Retrieve form data
  const username = document.getElementById('username').value;
  const bio = document.getElementById('bio').value;

  // Retrieve values from localStorage
  const addressProfileId = localStorage.getItem('addressProfileId');
  const message = localStorage.getItem('message');
  const signature = localStorage.getItem('signature');

  const profileData = { 
    addressProfileId, 
    username, 
    bio, 
    message, 
    signature 
  };
  
  try {
    // Send a POST request to save the profile
    const response = await fetch(`${BACKEND_ADDR}/user-profile/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(profileData),
    });

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

// Update the UI based on the login state
function updateUI() {
  loggedOutDiv.style.display = isLoggedIn ? 'none' : 'block';
  loggedInDiv.style.display = isLoggedIn ? 'block' : 'none';
  loadingDiv.style.display = isLoading ? 'block' : 'none';
}
