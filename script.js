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
