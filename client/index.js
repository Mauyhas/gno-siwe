const connectButton = document.getElementById('connect');
const logoutButton = document.getElementById('logout');
const loggedOutDiv = document.getElementById('loggedOut');
const loggedInDiv = document.getElementById('loggedIn');
const loadingDiv = document.getElementById('loading');

const scheme = window.location.protocol.slice(0, -1);
const domain = window.location.host;
const origin = window.location.origin;

let provider;
let signer;
let profileId = null;
let isLoggedIn = false;
let isLoading = false;

// Function to create a SIWE message
function createSiweMessage(address, statement) {
  return {
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: '1',
  };
}

// Function to handle sign-in with Ethereum
async function signInWithEthereum() {
  const address = await signer.getAddress();
  const messageObj = createSiweMessage(address, 'Sign in with Ethereum to the app.');
  const message = `
    ${messageObj.domain} wants you to sign in with your Ethereum account:
    ${messageObj.address}

    ${messageObj.statement}

    URI: ${messageObj.uri}
    Version: ${messageObj.version}
    Chain ID: ${messageObj.chainId}
  `;

  return await signer.signMessage(message);
}

// Function to fetch profile data
async function getProfileData(userId) {
  const url = `http://localhost:3000/user-profile/get?id=${userId}`;

  try {
    const response = await fetch(url, { method: 'GET' });
    if (!response.ok) {
      document.getElementById('createUserProfile').style.display = 'block';
      document.getElementById('editUserProfile').style.display = 'none';
    } else {
      const data = await response.json();
      setFormData(data);
      document.getElementById('createUserProfile').style.display = 'none';
      document.getElementById('editUserProfile').style.display = 'block';
    }
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
  }
}

// Function to set form data
function setFormData(profileData) {
  document.getElementById('username').value = profileData.username;
  document.getElementById('bio').value = profileData.bio;
}

// Function to update UI based on flags
function updateUI() {
  loggedOutDiv.style.display = 'none';
  loggedInDiv.style.display = 'none';
  loadingDiv.style.display = 'none';

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

      // Connect to MetaMask and get user's address
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      signer = provider.getSigner();
      const address = await signer.getAddress();

      // Sign in with Ethereum
      await signInWithEthereum();

      profileId = address;
      isLoggedIn = true;
      isLoading = false;
      updateUI(); // Show logged-in state

      // Optionally, fetch profile data
      getProfileData(address);
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

// Form Submission to Save Profile Data
document.getElementById('profileForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const bio = document.getElementById('bio').value;
  const profileData = { profileId, username, bio };

  try {
    const response = await fetch('http://localhost:3000/user-profile/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

// Logout Button Click
logoutButton.addEventListener('click', () => {
  alert('Logged out!');
  isLoggedIn = false;
  updateUI(); // Show logged-out state
});

// Initial UI setup
updateUI();
