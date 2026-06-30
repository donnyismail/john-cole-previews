import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  nightsBetween,
  validateStay,
  quote,
  otaSavings,
  isValidEmail,
  validateInquiry,
} from '../src/lib/booking.js';

test('nightsBetween counts whole nights', () => {
  assert.equal(nightsBetween('2026-07-01', '2026-07-05'), 4);
  assert.equal(nightsBetween('2026-07-01', '2026-07-02'), 1);
});

test('nightsBetween returns 0 for same/invalid/reversed dates', () => {
  assert.equal(nightsBetween('2026-07-05', '2026-07-05'), 0);
  assert.equal(nightsBetween('2026-07-05', '2026-07-01'), 0);
  assert.equal(nightsBetween('', '2026-07-01'), 0);
  assert.equal(nightsBetween('not-a-date', '2026-07-01'), 0);
});

test('validateStay enforces order, min-nights, and no past check-in', () => {
  const today = '2026-06-29';
  assert.equal(validateStay('2026-07-01', '2026-07-04', { today, minNights: 2 }).valid, true);
  // checkout before checkin
  assert.equal(validateStay('2026-07-04', '2026-07-01', { today }).valid, false);
  // below min nights
  const tooShort = validateStay('2026-07-01', '2026-07-02', { today, minNights: 2 });
  assert.equal(tooShort.valid, false);
  assert.match(tooShort.reason, /minimum/i);
  // check-in in the past
  assert.equal(validateStay('2026-06-01', '2026-06-10', { today }).valid, false);
});

test('quote computes subtotal, cleaning, taxes, and total', () => {
  const q = quote({ rate: 285, nights: 4, cleaning: 95, taxRate: 0 });
  assert.equal(q.subtotal, 1140);
  assert.equal(q.cleaning, 95);
  assert.equal(q.taxes, 0);
  assert.equal(q.total, 1235);
});

test('quote applies a tax rate to subtotal + cleaning', () => {
  const q = quote({ rate: 100, nights: 2, cleaning: 50, taxRate: 0.1 });
  // (200 + 50) * 0.10 = 25
  assert.equal(q.taxes, 25);
  assert.equal(q.total, 275);
});

test('quote throws on invalid inputs (no silent failure)', () => {
  assert.throws(() => quote({ rate: -1, nights: 2 }));
  assert.throws(() => quote({ rate: 100, nights: 0 }));
});

test('otaSavings estimates rounded platform fee savings', () => {
  // ~15% of 1000 = 150, rounded to nearest $5
  assert.equal(otaSavings(1000, 0.15), 150);
  assert.equal(otaSavings(1140, 0.15), 170); // 171 -> nearest 5 = 170
  assert.equal(otaSavings(0, 0.15), 0);
});

test('isValidEmail accepts good and rejects bad', () => {
  assert.equal(isValidEmail('john@example.com'), true);
  assert.equal(isValidEmail('a.b+c@sub.domain.co'), true);
  assert.equal(isValidEmail('nope'), false);
  assert.equal(isValidEmail('no@domain'), false);
  assert.equal(isValidEmail(''), false);
});

test('validateInquiry requires fields, valid email, and blocks honeypot spam', () => {
  const good = validateInquiry({ name: 'John', email: 'john@example.com', message: 'Hi', _gotcha: '' });
  assert.equal(good.valid, true);
  assert.equal(good.errors.length, 0);

  const missing = validateInquiry({ name: '', email: 'bad', message: '', _gotcha: '' });
  assert.equal(missing.valid, false);
  assert.ok(missing.errors.includes('name'));
  assert.ok(missing.errors.includes('email'));
  assert.ok(missing.errors.includes('message'));

  // honeypot filled => treated as spam, invalid
  const spam = validateInquiry({ name: 'Bot', email: 'bot@x.com', message: 'spam', _gotcha: 'filled' });
  assert.equal(spam.valid, false);
  assert.ok(spam.errors.includes('spam'));
});
