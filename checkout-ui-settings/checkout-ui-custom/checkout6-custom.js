const SELECTORS = {
  form: 'form.form-step.box-edit',
  newsletter: 'form.form-step.box-edit p.newsletter',
  submitButton: 'form.form-step.box-edit .submit.btn.btn-success',
  editProfileBtn: '#edit-profile-data'
};

const getTermsHtml = (termsAccepted) => `
  <p class="checkbox-item">
    <label for="terms-link">
      <input
        type="checkbox"
        class="terms-checkbox"
        id="terms-checkbox"
        ${termsAccepted ? 'checked' : ''}
        aria-describedby="terms-description"
      />
      <span id="terms-description">Acepto los <a href="#" id="terms-link">términos y condiciones</a></span>
    </label>
  </p>

  <div
    id="terms-modal"
    class="terms-modal"
    role="dialog"
    aria-labelledby="terms-modal-title"
    aria-hidden="true"
    tabindex="-1"
  >
    <div class="terms-modal-content" role="document">
      <div class="terms-modal-header">
        <h3 id="terms-modal-title">Términos y condiciones</h3>
        <button
          id="close-modal"
          class="close-button"
          aria-label="Cerrar modal"
        >&times;</button>
      </div>
      <div class="terms-modal-body">
        <p>Términos y condiciones...</p>
      </div>
      <div class="terms-modal-footer">
        <button
          id="accept-terms"
          class="accept-button"
          aria-label="Aceptar términos y condiciones"
        >Aceptar</button>
      </div>
    </div>
  </div>
`;

const saveTermsAcceptance = (isAccepted) => {
  try {
    localStorage.setItem('vtexTermsAccepted', isAccepted.toString());
  } catch (error) {
    console.error('Error al guardar en localStorage:', error);
  }
};

const isTermsAccepted = () => {
  try {
    return localStorage.getItem('vtexTermsAccepted') === 'true';
  } catch (error) {
    console.error('Error al leer de localStorage:', error);
    return false;
  }
};

const showModal = () => {
  const modal = document.getElementById('terms-modal');
  if (modal) {
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    modal.focus();
  }
};

const hideModal = () => {
  const modal = document.getElementById('terms-modal');
  if (modal) {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }
};

const updateSubmitButtonState = () => {
  const submitButton = $(SELECTORS.submitButton);
  const termsCheckbox = document.getElementById('terms-checkbox');

  if (submitButton.length && termsCheckbox) {
    submitButton.prop('disabled', !termsCheckbox.checked);
  } else {
    console.warn('Elemento submit button o checkbox no encontrado');
  }
};

const buildTermsAndConditionsCheckbox = () => {
  const termsAccepted = isTermsAccepted();
  const termsHtml = getTermsHtml(termsAccepted);
  const newsletter = $(SELECTORS.newsletter);

  if (newsletter.length) {
    $(termsHtml).insertAfter(newsletter);
  } else {
    console.warn('Elemento newsletter no encontrado');
    const form = $(SELECTORS.form);
    if (form.length) {
      form.append(termsHtml);
    }
  }
};

const handleTermsLinkClick = (e) => {
  e.preventDefault();
  showModal();
};

const handleAcceptTermsClick = () => {
  const termsCheckbox = document.getElementById('terms-checkbox');
  if (termsCheckbox) {
    termsCheckbox.checked = true;
    saveTermsAcceptance(true);
    hideModal();
    updateSubmitButtonState();
  }
};

const handleCloseModalClick = () => {
  hideModal();
};

const handleModalBackdropClick = (e) => {
  if (e.target.id === 'terms-modal') {
    hideModal();
  }
};

const handleCheckboxChange = (e) => {
  const isChecked = e.target.checked;
  if (isChecked) {
    saveTermsAcceptance(true);
  } else {
    saveTermsAcceptance(false);
  }
  updateSubmitButtonState();
};

const attachEventListeners = () => {
  $(document)
    .on('click', '#terms-link', handleTermsLinkClick)
    .on('click', '#accept-terms', handleAcceptTermsClick)
    .on('click', '#close-modal', handleCloseModalClick)
    .on('click', '#terms-modal', handleModalBackdropClick)
    .on('change', '#terms-checkbox', handleCheckboxChange);
};

const initializeTermsAndConditions = () => {
  try {
    buildTermsAndConditionsCheckbox();
    updateSubmitButtonState();
    attachEventListeners();
  } catch (error) {
    console.error('Error al inicializar términos y condiciones:', error);
  }
};

const initCheckout = () => {
  vtexjs.checkout.getOrderForm()
    .done(() => {
      const termsAccepted = isTermsAccepted();
      if (!termsAccepted) {
        const editProfileBtn = document.querySelector(SELECTORS.editProfileBtn);
        if (editProfileBtn) {
          editProfileBtn.click();
        } else {
          console.warn('Botón de editar perfil no encontrado');
        }
      }
      initializeTermsAndConditions();
    })
    .fail((error) => {
      console.error('Error al obtener OrderForm:', error);
      initializeTermsAndConditions();
    });
};

$(document).ready(initCheckout);
