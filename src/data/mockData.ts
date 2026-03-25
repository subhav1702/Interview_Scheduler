import type { Engineer, Candidate } from '../types';

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
export const HOURS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]; // Up to 6:00 PM (exclusive)

export const engineers: Engineer[] = [
  {
    id: 'e1',
    name: 'Mike(Frontend)',
    availability: {
      Mon: ['09:00', '09:30', '10:00', '14:00', '14:30', '15:00'],
      Tue: ['14:00', '14:30', '15:00', '15:30', '16:00'],
      Wed: ['09:00', '11:00', '11:30', '12:00'],
      Thu: ['14:00', '16:00', '16:30'],
      Fri: ['09:00', '09:30', '10:00', '10:30']
    }
  },
  {
    id: 'e2',
    name: 'John(Backend)',
    availability: {
      Mon: ['10:00', '10:30', '11:00', '11:30'],
      Tue: ['09:00', '09:30', '10:00', '15:00', '15:30', '16:00'],
      Wed: ['14:00', '14:30', '15:00', '15:30', '16:30'],
      Thu: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'],
      Fri: ['14:00', '14:30', '15:00', '15:30']
    }
  },
  {
    id: 'e3',
    name: 'Mikel(Lead)',
    availability: {
      Mon: ['16:00', '16:30', '17:00', '17:30'],
      Tue: ['11:00', '11:30', '12:00', '14:30', '15:00'],
      Wed: ['09:00', '09:30', '10:00', '10:30'],
      Thu: ['13:00', '13:30', '14:00', '14:30'],
      Fri: ['11:00', '11:30', '12:00', '12:30']
    }
  }
];

export const candidates: Candidate[] = [
  {
    id: 'c1',
    name: 'Sarah Drasner',
    email: 'sarah@example.com',
    preferredRange: {
      day: 'Tue',
      start: '14:00',
      end: '17:00'
    }
  },
  {
    id: 'c2',
    name: 'Dan Abramov',
    email: 'dan@example.com',
    preferredRange: {
      day: 'Wed',
      start: '09:00',
      end: '12:00'
    }
  },
  {
    id: 'c3',
    name: 'Rich Harris',
    email: 'rich@example.com',
    preferredRange: {
      day: 'Fri',
      start: '10:00',
      end: '13:00'
    }
  }
];
