import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../consultation.js', import.meta.url), 'utf8');
const moduleUrl = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
const { getFormAction, initializeConsultation } = await import(moduleUrl);

test('unverified recipient is never enabled', () => {
  assert.equal(getFormAction('a'.repeat(32), false), null);
});
test('only opaque form identifiers are accepted', () => {
  for (const value of ['', 'hello@example.com', '../other-endpoint', 'https://formsubmit.co/anything', '<script>', null]) {
    assert.equal(getFormAction(value, true), null);
  }
  assert.equal(getFormAction('a'.repeat(32), true), 'https://formsubmit.co/' + 'a'.repeat(32));
});
test('pending setup disables submission without sending data', () => {
  const button = { disabled: false };
  let submit;
  const form = { querySelector: () => button, addEventListener: (event, handler) => { submit = handler; } };
  initializeConsultation({ getElementById: id => id === 'consult-form' ? form : { textContent: '' } }, { id: '', verified: false });
  assert.equal(button.disabled, true);
  let prevented = false;
  submit({ preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
});
test('public website no longer contains email links or recipient identifiers', () => {
  for (const path of ['../index.html', '../app.js', '../consultation.js', '../thank-you.html']) {
    const text = readFileSync(new URL(path, import.meta.url), 'utf8');
    assert.doesNotMatch(text, /mailto:|@gmail\.com/);
  }
});
function activeForm(values = {}) {
  const fields = Object.fromEntries(['name', 'stage', 'challenge', 'contact', '_honey'].map(name => [name, {
    value: name === '_honey' ? '' : ' test ',
    reportValidity() {}, focus() {},
  }]));
  for (const [name, value] of Object.entries(values)) fields[name].value = value;
  const button = { disabled: true };
  const status = { textContent: '' };
  let submit;
  const form = {
    querySelector: () => button,
    elements: { namedItem: name => fields[name] },
    addEventListener: (name, handler) => { submit = handler; },
  };
  initializeConsultation({ getElementById: id => id === 'consult-form' ? form : status }, { id: 'a'.repeat(32), verified: true });
  let prevented = false;
  submit({ preventDefault: () => { prevented = true; } });
  return { form, fields, button, status, prevented };
}
test('verified form posts to an opaque endpoint and retains all four fields', () => {
  const result = activeForm();
  assert.equal(result.form.action, 'https://formsubmit.co/' + 'a'.repeat(32));
  assert.equal(result.button.disabled, false);
  assert.equal(result.prevented, false);
  for (const name of ['name', 'stage', 'challenge', 'contact']) assert.equal(result.fields[name].value, 'test');
  assert.match(result.status.textContent, /验证/);
});
test('whitespace-only required field blocks submission', () => {
  assert.equal(activeForm({ challenge: '  ' }).prevented, true);
});
test('honeypot submission is blocked without reporting success', () => {
  const result = activeForm({ _honey: 'spam' });
  assert.equal(result.prevented, true);
  assert.match(result.status.textContent, /未发送/);
});
test('form keeps spam protection and private fields out of query parameters', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /id="consult-form" method="POST"/);
  assert.match(html, /name="_honey"/);
  assert.doesNotMatch(html, /name="_captcha" value="false"/);
  assert.doesNotMatch(html, /id="generated"/);
});
