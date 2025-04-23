const buildTermsAndConditionsCheckbox = function () {
  const termsAccepted = localStorage.getItem('vtexTermsAccepted') === 'true';

  const termsHtml = `
  <p class="checkbox-item">
    <label for="terms-link">
        <input type="checkbox" class="terms-checkbox" id="terms-checkbox" ${termsAccepted ? 'checked' : ''} /> Acepto los <a href="#" id="terms-link">términos y condiciones</a></label>
  </p>

  <div id="terms-modal" class="terms-modal">
    <div class="terms-modal-content">
      <div class="terms-modal-header">
        <h3>Términos y condiciones</h3>
        <button id="close-modal" class="close-button">&times;</button>
      </div>
      <div class="terms-modal-body">
        <p>Términos y condiciones...</p>
      </div>
      <div class="terms-modal-footer">
        <button id="accept-terms" class="accept-button">Aceptar</button>
      </div>
    </div>
  </div>
  `;

  const newsletter = $('form.form-step.box-edit p.newsletter');
  if (newsletter.length) {
    $(termsHtml).insertAfter(newsletter);
  }
}

const eventTermsAndConditionsCheckbox = function () {
  $(document)
    .on('click', '#terms-link', function(e) {
      e.preventDefault();
      $('#terms-modal').fadeIn(300);
    })
    .on('click', '#accept-terms', function() {
      $('#terms-checkbox').prop('checked', true);
      localStorage.setItem('vtexTermsAccepted', 'true');
      $('#terms-modal').fadeOut(300);
      checkSubmitButton();
    })
    .on('click', '#close-modal', function() {
      $('#terms-modal').fadeOut(300);
    })
    .on('click', '#terms-modal', function(e) {
      if ($(e.target).is('#terms-modal')) {
        $(this).fadeOut(300);
      }
    })
    .on('change', '#terms-checkbox', function() {
      if (!$(this).is(':checked')) {
        localStorage.removeItem('vtexTermsAccepted');
      } else {
        localStorage.setItem('vtexTermsAccepted', 'true');
      }
      checkSubmitButton();
    });
}

function checkSubmitButton() {
  const isChecked = $('#terms-checkbox').is(':checked');
  $('form.form-step.box-edit .submit.btn.btn-success').prop('disabled', !isChecked);
}

$(document).ready(function() {
  vtexjs.checkout.getOrderForm()
    .done(function() {
      var termsAccepted = localStorage.getItem('vtexTermsAccepted') === 'true';
      if (!termsAccepted) {
        document.querySelector("#edit-profile-data").click();
      }
      buildTermsAndConditionsCheckbox();
      checkSubmitButton();
      eventTermsAndConditionsCheckbox();
    })

});
