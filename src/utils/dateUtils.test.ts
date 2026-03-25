import { describe, it, expect } from 'vitest';
import {
  formatTime12hr,
  formatPreferredRange,
  generateTimeSlots,
  get30MinBlock,
} from './dateUtils';

describe('dateUtils logic', () => {
  describe('formatTime12hr', () => {
    it('should format morning hours correctly', () => {
      expect(formatTime12hr('09:00')).toBe('9:00 AM');
      expect(formatTime12hr('11:30')).toBe('11:30 AM');
    });

    it('should handle noon properly', () => {
      expect(formatTime12hr('12:00')).toBe('12:00 PM');
      expect(formatTime12hr('12:45')).toBe('12:45 PM');
    });

    it('should format afternoon/evening hours correctly', () => {
      expect(formatTime12hr('14:30')).toBe('2:30 PM');
      expect(formatTime12hr('18:00')).toBe('6:00 PM');
    });

    it('should handle midnight correctly', () => {
      expect(formatTime12hr('00:00')).toBe('12:00 AM');
      expect(formatTime12hr('00:15')).toBe('12:15 AM');
    });
  });

  describe('formatPreferredRange', () => {
    it('should condense the start AM/PM if it matches the end period', () => {
      expect(formatPreferredRange('Tue', '14:00', '17:00')).toBe('Tues 2–5 PM');
      expect(formatPreferredRange('Wed', '09:00', '11:00')).toBe('Wed 9–11 AM');
    });

    it('should display both AM and PM if the time span crosses noon', () => {
      expect(formatPreferredRange('Thu', '10:00', '14:00')).toBe('Thurs 10 AM–2 PM');
    });

    it('should keep the minutes if the start or end is not exactly on the hour', () => {
      expect(formatPreferredRange('Fri', '10:30', '13:00')).toBe('Fri 10:30 AM–1 PM');
      expect(formatPreferredRange('Mon', '09:00', '11:45')).toBe('Mon 9–11:45 AM');
    });
  });

  describe('generateTimeSlots', () => {
    it('should generate 60-minute interval blocks', () => {
      const slots = generateTimeSlots(60);
      expect(slots[0]).toBe('09:00');
      expect(slots[1]).toBe('10:00');
      expect(slots[2]).toBe('11:00');
      expect(slots.length).toBe(9); // 9 AM up to 5 PM
    });

    it('should generate 15-minute interval blocks', () => {
      const slots = generateTimeSlots(15);
      expect(slots[0]).toBe('09:00');
      expect(slots[1]).toBe('09:15');
      expect(slots[2]).toBe('09:30');
      expect(slots[3]).toBe('09:45');
      expect(slots[4]).toBe('10:00');
    });
  });

  describe('get30MinBlock', () => {
    it('should round 15-minute increments down to the closest 30-min valid block', () => {
      expect(get30MinBlock('09:15')).toBe('09:00');
      expect(get30MinBlock('09:00')).toBe('09:00');
      expect(get30MinBlock('14:45')).toBe('14:30');
      expect(get30MinBlock('14:30')).toBe('14:30');
    });
  });
});
