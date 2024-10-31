import { BrowserProvider } from 'ethers';
import { SiweMessage } from 'siwe';

const domain = window.location.host;
const origin = window.location.origin;
const BACKEND_ADDR = "http://localhost:3000";
let isLoggedIn = false;
let isLoading = false;
let provider = new BrowserProvider(window.ethereum);
let message = null;
let signature = null;

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

    message = await createSiweMessage(address, 'Sign in with Ethereum to the app.');
    signature = await signer.signMessage(message);

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
  loggedInDiv.style.display = 'block';
  loggedOutDiv.style.display = 'none';
  loadingDiv.style.display = 'none';
  updateUI();
}

// Logout and clear session data
async function logout() {
  localStorage.removeItem('siwe_session');
  sessionStorage.removeItem('siwe_session');

  isLoggedIn = false;
  updateUI();
}

// Update the UI based on the login state
function updateUI() {
  loggedOutDiv.style.display = isLoggedIn ? 'none' : 'block';
  loggedInDiv.style.display = isLoggedIn ? 'block' : 'none';
  loadingDiv.style.display = isLoading ? 'block' : 'none';
}
