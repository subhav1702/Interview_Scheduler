export type SlotStatus = 'available' | 'overlap' | 'booked' | 'unavailable';

export interface TimeSlot {
  id: string;
  time: string; // e.g. "09:00"
  day: string; // Mon, Tue, Wed, Thu, Fri
  status: SlotStatus;
}

export interface Engineer {
  id: string;
  name: string;
  availability: Record<string, string[]>; // { Mon: ["09:00", "09:30", ...], ... }
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  preferredRange: {
    day: string;
    start: string;
    end: string;
  };
}

export interface Interview {
  id: string;
  candidateId: string;
  engineerId: string;
  time: string;
  day: string;
  duration: number; // 15, 30, 60
}
