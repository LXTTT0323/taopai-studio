// Use only the invisible form ID issued after recipient activation.
// Never put a recipient email address, API key or activation URL in this file.
export const FORM_ID = "3bcb1b5275790f0c6a9ecbd3e53c2511";
export const FORM_VERIFIED = true;

export function getFormAction(id, verified) {
  if (!verified || typeof id !== "string" || !/^[a-zA-Z0-9_-]{16,128}$/.test(id)) return null;
  return "https://formsubmit.co/" + id;
}

export function initializeConsultation(doc, config = { id: FORM_ID, verified: FORM_VERIFIED }) {
  const form = doc.getElementById("consult-form");
  if (!form) return;
  const button = form.querySelector('button[type="submit"]');
  const status = doc.getElementById("consult-status");
  const action = getFormAction(config.id, config.verified);
  if (!action) {
    button.disabled = true;
    form.addEventListener("submit", event => event.preventDefault());
    return;
  }
  form.action = action;
  button.disabled = false;
  status.textContent = "本次咨询免费。完成验证后发送预约，我们会通过你留下的联系方式与你确认时间。";
  form.addEventListener("submit", event => {
    const fields = ["name", "stage", "challenge", "contact"];
    for (const name of fields) {
      const input = form.elements.namedItem(name);
      input.value = input.value.trim();
      if (!input.value) {
        event.preventDefault();
        input.reportValidity();
        input.focus();
        return;
      }
    }
    if (form.elements.namedItem("_honey").value) {
      event.preventDefault();
      status.textContent = "未发送，请刷新页面后重新填写。";
      return;
    }
    status.textContent = "正在前往安全验证页面，请完成验证以发送咨询。";
    // Native submission retains FormSubmit's reCAPTCHA; do not disable it.
  });
}

if (typeof document !== "undefined") initializeConsultation(document);
