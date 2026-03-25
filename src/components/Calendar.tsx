import { Fragment } from 'react';
import { HOURS, DAYS } from '../data/mockData';
import type { Candidate, Engineer } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatTime12hr, formatDayDate, generateTimeSlots, get30MinBlock } from '../utils/dateUtils';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CalendarProps {
  candidate: Candidate | null;
  engineerFilterId: string | 'all';
  engineers: Engineer[];
  bookedSlots: { day: string; time: string; engineerId: string }[];
  duration: number;
  onSlotClick: (day: string, time: string) => void;
}

export function isTimeInRange(time: string, start: string, end: string) {
  return time >= start && time < end;
}

export function checkEngineerAvailability(
  engineer: Engineer,
  day: string,
  startIndex: number,
  slotsNeeded: number,
  bookedSlots: { day: string; time: string; engineerId: string }[]
) {
  for (let i = 0; i < slotsNeeded; i++) {
    const slotTime = HOURS[startIndex + i];
    if (!slotTime) return false;

    const isAvailableInRoster = engineer.availability[day]?.includes(slotTime);
    const isBooked = bookedSlots.some(
      (b) => b.day === day && b.time === slotTime && b.engineerId === engineer.id
    );
    
    if (!isAvailableInRoster || isBooked) return false;
  }
  return true;
}

export function getOverlappingSlotStatus(
  day: string,
  time: string,
  candidate: Candidate | null,
  engineerFilterId: string | 'all',
  engineers: Engineer[],
  bookedSlots: { day: string; time: string; engineerId: string }[],
  duration: number
) {
  const isCandidatePreferred = candidate 
    ? day === candidate.preferredRange.day && isTimeInRange(time, candidate.preferredRange.start, candidate.preferredRange.end)
    : false;

  const baseBlockTime = get30MinBlock(time);
  const startIndex = HOURS.indexOf(baseBlockTime);
  if (startIndex === -1) return 'unavailable';

  const slotsNeeded = duration === 60 ? 2 : 1;

  const hasAvailableEngineer = engineers.some((eng) => {
    if (engineerFilterId !== 'all' && eng.id !== engineerFilterId) return false;
    return checkEngineerAvailability(eng, day, startIndex, slotsNeeded, bookedSlots);
  });

  if (hasAvailableEngineer) {
    return isCandidatePreferred ? 'overlap' : 'available';
  }

  return 'unavailable';
}

export function Calendar({
  candidate,
  engineerFilterId,
  engineers,
  bookedSlots,
  duration,
  onSlotClick,
}: CalendarProps) {
  return (
    <div className="w-full overflow-hidden rounded-3xl glass-card border border-border-primary">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="grid grid-cols-[60px_repeat(5,1fr)] sm:grid-cols-[80px_repeat(5,1fr)] min-w-[500px] sm:min-w-[700px] lg:min-w-full">
          <div className="h-10 sm:h-12 flex items-center justify-center font-bold text-[9px] sm:text-[11px] tracking-widest text-text-tertiary bg-background-tertiary sticky left-0 z-20 border-b border-border-primary">
            TIME
          </div>

          {DAYS.map((day) => (
            <div key={day} className="h-10 sm:h-12 flex flex-col items-center justify-center border-l border-border-primary border-b border-border-primary bg-background-tertiary sticky top-0 z-30">
              <span className="font-bold text-xs sm:text-sm lg:text-base text-text-primary leading-tight tracking-wide">{formatDayDate(day).split(',')[0]}</span>
              <span className="hidden sm:block text-[9px] sm:text-[10px] text-text-secondary font-medium">{formatDayDate(day).split(',')[1]}</span>
            </div>
          ))}

          {generateTimeSlots(duration).map((hour) => (
            <Fragment key={hour}>
              <div className="h-14 sm:h-16 flex flex-col items-center justify-center text-[11px] sm:text-[12px] font-bold text-text-secondary bg-background-tertiary sticky left-0 z-20 border-t border-border-secondary shadow-[5px_0_10px_rgba(0,0,0,0.05)] dark:shadow-[5px_0_10px_rgba(0,0,0,0.2)]">
                <span className="leading-none mb-0.5">{formatTime12hr(hour).split(' ')[0]}</span>
                <span className="text-[8px] sm:text-[9px] text-text-tertiary font-black">{formatTime12hr(hour).split(' ')[1]}</span>
              </div>

              {DAYS.map((day) => {
                const status = getOverlappingSlotStatus(day, hour, candidate, engineerFilterId, engineers, bookedSlots, duration);
                const baseBlockTime = get30MinBlock(hour);
                const startIndex = HOURS.indexOf(baseBlockTime);
                const slotsNeeded = duration === 60 ? 2 : 1;

                return (
                  <div
                    key={`${day}-${hour}`}
                    onClick={() => status !== 'unavailable' && onSlotClick(day, hour)}
                    className={cn(
                      "h-16 sm:h-20 lg:h-24 border-t border-l border-border-primary relative transition-all duration-300 cursor-pointer group flex flex-col p-1 sm:p-1.5 gap-0.5 sm:gap-1",
                      status === 'unavailable' && "striped-bg opacity-40 cursor-not-allowed",
                      status === 'available' && "bg-border-secondary hover:bg-accent-primary/10",
                      status === 'overlap' && "bg-accent-primary/10 border-accent-primary/30 z-[2] shadow-[inset_0_0_15px_rgba(124,58,237,0.1)] hover:bg-accent-primary/20"
                    )}
                  >
                    {status === 'overlap' && (
                      <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 animate-bounce-in z-10 hidden sm:block">
                        <span className="text-[7px] sm:text-[9px] font-black tracking-tighter text-white bg-accent-primary px-1 py-0.5 rounded shadow-lg leading-none">
                          Preferred ⭐
                        </span>
                      </div>
                    )}

                    <div className="mt-auto flex flex-col gap-1">
                      {engineers.map((eng) => {
                        if (engineerFilterId !== 'all' && engineerFilterId !== eng.id) return null;

                        const isAvailable = checkEngineerAvailability(eng, day, startIndex, slotsNeeded, bookedSlots);
                        const stateStyles = isAvailable
                          ? "bg-accent-primary/20 text-accent-primary border-accent-primary/30"
                          : "bg-border-secondary text-text-tertiary border-border-secondary opacity-40";

                        return (
                          <div
                            key={eng.id}
                            className={cn("px-1 sm:px-1.5 py-px sm:py-0.5 rounded text-[7px] sm:text-[8px] lg:text-[9px] font-bold border transition-all truncate", stateStyles)}
                          >
                            {eng.name.split(' ')[1] || eng.name}
                          </div>
                        );
                      })}
                    </div>

                    {status === 'available' && (
                      <div className="absolute inset-0 bg-accent-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[7px] sm:text-[8px] font-bold text-accent-primary bg-background-primary px-1 sm:px-2 py-0.5 rounded shadow-sm uppercase tracking-widest hidden sm:block">Select</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
