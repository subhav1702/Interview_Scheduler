export const formatTime12hr = (time: string): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  let h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12; // 0 should be 12
  return `${h}:${minutes} ${ampm}`;
};

export const formatDayDate = (dayString: string): string => {
  // Map our short day strings to specific dates for the UI 
  const dates: Record<string, string> = {
    'Mon': 'Mon, Oct 24',
    'Tue': 'Tue, Oct 25',
    'Wed': 'Wed, Oct 26',
    'Thu': 'Thu, Oct 27',
    'Fri': 'Fri, Oct 28'
  };
  return dates[dayString] || dayString;
};

export const formatPreferredRange = (day: string, start: string, end: string): string => {
  const dayStr = day === 'Tue' ? 'Tues' : day === 'Thu' ? 'Thurs' : day;
  
  const parseHour = (timeStr: string) => parseInt(timeStr.split(':')[0], 10);
  const startH = parseHour(start);
  const endH = parseHour(end);
  const startM = start.split(':')[1];
  const endM = end.split(':')[1];

  const startAmpm = startH >= 12 ? 'PM' : 'AM';
  const endAmpm = endH >= 12 ? 'PM' : 'AM';

  const formatH = (h: number, m: string) => {
    let hour = h % 12 || 12;
    return m === '00' ? `${hour}` : `${hour}:${m}`;
  };

  const formattedStart = formatH(startH, startM);
  const formattedEnd = formatH(endH, endM);

  if (startAmpm === endAmpm) {
    return `${dayStr} ${formattedStart}–${formattedEnd} ${endAmpm}`;
  }
  
  return `${dayStr} ${formattedStart} ${startAmpm}–${formattedEnd} ${endAmpm}`;
};

export const generateTimeSlots = (duration: number): string[] => {
  const slots: string[] = [];
  let currentMinutes = 9 * 60; // 9:00 AM
  const endMinutes = 18 * 60; // 6:00 PM
  
  while (currentMinutes < endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const mins = currentMinutes % 60;
    const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    slots.push(timeStr);
    currentMinutes += duration;
  }
  
  return slots;
};

export const get30MinBlock = (timeStr: string): string => {
  const [h, m] = timeStr.split(':');
  const mins = parseInt(m, 10);
  const blockMins = mins >= 30 ? '30' : '00';
  return `${h}:${blockMins}`;
};
