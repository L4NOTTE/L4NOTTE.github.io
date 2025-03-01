
document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'modal-overlay';
  Object.assign(modalOverlay.style, {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000'
  });
  document.body.appendChild(modalOverlay);

  const modalContainer = document.createElement('div');
  modalContainer.id = 'modal-container';
  Object.assign(modalContainer.style, {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '90%',
    position: 'relative'
  });
  modalOverlay.appendChild(modalContainer);

  const closeButton = document.createElement('span');
  closeButton.textContent = '×';
  Object.assign(closeButton.style, {
    cursor: 'pointer',
    position: 'absolute',
    top: '10px',
    right: '20px',
    fontSize: '24px'
  });
  modalContainer.appendChild(closeButton);

  // Контейнер для контента формы
  const modalContent = document.createElement('div');
  modalContent.id = 'modal-content';
  modalContainer.appendChild(modalContent);

  function openModal(contentHTML) {
    modalContent.innerHTML = contentHTML;
    modalOverlay.style.display = 'flex';
  }

  function closeModal() {
    modalOverlay.style.display = 'none';
  }

  closeButton.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  const loginBtn = document.querySelector('.Log_in');
  const registerBtn = document.querySelector('.Register');

  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(`
        <h2 style="text-align: center; font-family: Montserrat-Bold;">Login</h2>
        <form id="login-form" style="display: flex; flex-direction: column; gap: 10px;">
          <label for="login-email">Email:</label>
          <input type="email" id="login-email" required style="padding: 8px; font-size: 14px;">
          <label for="login-password">Password:</label>
          <input type="password" id="login-password" required style="padding: 8px; font-size: 14px;">
          <button type="submit" style="padding: 10px; background-color: #FFA520; border: none; color: #fff; font-family: Montserrat-Medium; cursor: pointer;">Login</button>
        </form>
      `);
      const loginForm = document.getElementById('login-form');
      loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Login submitted!');
        closeModal();
      });
    });
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(`
        <h2 style="text-align: center; font-family: Montserrat-Bold;">Register</h2>
        <form id="register-form" style="display: flex; flex-direction: column; gap: 10px;">
          <label for="register-name">Name:</label>
          <input type="text" id="register-name" required style="padding: 8px; font-size: 14px;">
          <label for="register-email">Email:</label>
          <input type="email" id="register-email" required style="padding: 8px; font-size: 14px;">
          <label for="register-password">Password:</label>
          <input type="password" id="register-password" required style="padding: 8px; font-size: 14px;">
          <button type="submit" style="padding: 10px; background-color: #FFA520; border: none; color: #fff; font-family: Montserrat-Medium; cursor: pointer;">Register</button>
        </form>
      `);
      const registerForm = document.getElementById('register-form');
      registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
       
        alert('Registration submitted!');
        closeModal();
      });
    });
  }
});
