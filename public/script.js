document.addEventListener('DOMContentLoaded', function() {
    // Sidebar toggle
    const body = document.querySelector('body');
    const toggle = body.querySelector('.sidebar-toggle');
    const sidebar = body.querySelector('.sidebar');
    const purpleButton = body.querySelector('.purple-button');
    const logo = document.getElementById('logo-image');
    const content = body.querySelector('.content');
    let isClosed = false;
    const toggleIcon = document.querySelector('.sidebar-toggle .material-symbols');

    sidebar.classList.toggle('close');
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('close');
        isClosed = !isClosed;
        if(isClosed) {
            logo.src = "./assets/images/logo(no text).png";
            content.style.marginLeft = "78px";
            toggleIcon.style.transform= "scaleX(1)";
        }
        else{
            logo.src = "./assets/images/logo.png";
            content.style.marginLeft = "250px";
            toggleIcon.style.transform= "scaleX(-1)";
        }
    });
});
//buat sign up
document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.querySelector('.password-field input');
    const toggleIcon = document.querySelector('.password-field img');

    toggleIcon.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type');
        passwordInput.setAttribute('type', type === 'password' ? 'text' : 'password');
        toggleIcon.src = type === 'password' ? './asset/eye-open.png' : './asset/eye.png';
    });
});

const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const fullName = document.getElementById('fullName').value; // You might not need fullName in the backend
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;


        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Send a fixed 'user' role
                body: JSON.stringify({ email, password, role: 'user' }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Signup successful:', data);
                // Redirect to signin page or home page
                window.location.href = 'signIn.html';
            } else {
                console.error('Signup failed:', data.message);
                // Display error message to the user (e.g., in a div)
                alert('Signup failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred during signup.');
        }
    });
}

// Handle Sign In Form Submission
const signinForm = document.getElementById('signinForm');
if (signinForm) {
    signinForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Signin successful:', data);
                // Store the token (e.g., in localStorage)
                localStorage.setItem('token', data.token);
                // Redirect to the dashboard or home page
                window.location.href = 'home.html';
            } else {
                console.error('Signin failed:', data.message);
                // Display error message to the user
                alert('Signin failed: ' + data.message);
            }
        } catch (error) {
            console.error('Error during signin:', error);
            alert('An error occurred during signin.');
        }
    });
}

