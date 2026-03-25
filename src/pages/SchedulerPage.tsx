import { cn } from '../utils/cn';
import { useState } from 'react';
import { Calendar } from '../components/Calendar';
import { candidates, engineers, HOURS } from '../data/mockData';
import type { Candidate, Engineer } from '../types';
import { User, Users, Calendar as CalendarIcon, Filter, CheckCircle, Clock, ChevronDown } from 'lucide-react';
import { formatTime12hr, formatDayDate, formatPreferredRange, get30MinBlock } from '../utils/dateUtils';

export function SchedulerPage() {
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [engineerFilterId, setEngineerFilterId] = useState<string | 'all'>('all');
    const [duration, setDuration] = useState<number>(30);
    const [bookedSlots, setBookedSlots] = useState<{ day: string; time: string; engineerId: string }[]>([]);
    const [confirmation, setConfirmation] = useState<{
        candidate: string,
        availableEngineers: Engineer[],
        selectedEngineerId: string,
        time: string,
        day: string
    } | null>(null);
    const [showSuccess, setShowSuccess] = useState<string | null>(null);

    const handleSlotClick = (day: string, time: string) => {
        if (!selectedCandidate) return;

        const baseBlockTime = get30MinBlock(time);
        const startIndex = HOURS.indexOf(baseBlockTime);
        const slotsNeeded = duration === 60 ? 2 : 1;

        const availableEngineers = engineers.filter(e => {
            if (engineerFilterId !== 'all' && e.id !== engineerFilterId) return false;
            
            for (let i = 0; i < slotsNeeded; i++) {
                const slotTime = HOURS[startIndex + i];
                if (!slotTime) return false;
                const isEngAvailable = e.availability[day]?.includes(slotTime);
                const isAlreadyBooked = bookedSlots.some(b => b.day === day && b.time === slotTime && b.engineerId === e.id);
                if (!isEngAvailable || isAlreadyBooked) return false;
            }
            return true;
        });

        if (availableEngineers.length > 0) {
            setConfirmation({
                candidate: selectedCandidate.name,
                availableEngineers: availableEngineers,
                selectedEngineerId: availableEngineers[0].id,
                time: time,
                day: day
            });
        }
    };

    const confirmInterview = () => {
        if (confirmation) {
            const eng = engineers.find(e => e.id === confirmation.selectedEngineerId);
            if (eng) {
                const baseBlockTime = get30MinBlock(confirmation.time);
                const startIndex = HOURS.indexOf(baseBlockTime);
                const slotsNeeded = duration === 60 ? 2 : 1;
                const newSlots = [];
                for (let i = 0; i < slotsNeeded; i++) {
                    newSlots.push({ day: confirmation.day, time: HOURS[startIndex + i], engineerId: eng.id });
                }
                const formattedDate = formatDayDate(confirmation.day);
                const formattedTime = formatTime12hr(confirmation.time);
                
                setBookedSlots([...bookedSlots, ...newSlots]);
                setShowSuccess(`Interview scheduled with ${eng.name} for ${confirmation.candidate} on ${formattedDate} at ${formattedTime}!`);
                setTimeout(() => setShowSuccess(null), 5000);
            }
            setConfirmation(null);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-10 relative w-full overflow-x-hidden">
            {showSuccess && (
                <div className="fixed top-24 right-4 sm:right-6 z-[60] animate-bounce-in max-w-[calc(100vw-2rem)]">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-400/50">
                        <CheckCircle size={20} />
                        <p className="font-bold text-sm tracking-wide">{showSuccess}</p>
                    </div>
                </div>
            )}

            <div className="mb-6 lg:mb-10 animate-fade-in">
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2 lg:mb-3">Availability Scheduler</h1>
                <p className="text-text-secondary font-medium text-sm lg:text-base">Coordinate and finalize interview slots across your team and candidates.</p>
            </div>

            <div className="w-full">
                {/* Left: Calendar & Filters */}
                <div className="space-y-6 sm:space-y-8 animate-fade-in delay-100">
                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-end gap-3 sm:gap-6 w-full">
                        <div className="flex flex-col gap-1.5 sm:gap-2 w-full sm:flex-1 sm:min-w-[200px]">
                            <label className="text-xs font-bold text-text-tertiary tracking-widest uppercase ml-1">Candidate Selection</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
                                <select
                                    className="appearance-none w-full bg-background-secondary border border-border-primary py-3 pl-10 pr-10 rounded-xl focus:ring-2 focus:ring-accent-primary outline-none text-sm font-medium transition-all text-text-primary"
                                    onChange={(e) => setSelectedCandidate(candidates.find(c => c.id === e.target.value) || null)}
                                    defaultValue={selectedCandidate?.id || ""}
                                >
                                    <option value="" disabled>Select a candidate...</option>
                                    {candidates.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full sm:flex-1 sm:min-w-[200px]">
                            <label className="text-xs font-bold text-text-tertiary tracking-widest uppercase ml-1">Filter by Engineer</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
                                <select
                                    className="appearance-none w-full bg-background-secondary border border-border-primary py-3 pl-10 pr-10 rounded-xl focus:ring-2 focus:ring-accent-primary outline-none text-sm font-medium transition-all text-text-primary"
                                    onChange={(e) => setEngineerFilterId(e.target.value)}
                                    defaultValue={engineerFilterId}
                                >
                                    <option value="all">All Available Engineers</option>
                                    {engineers.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5 sm:gap-2 w-full sm:flex-1 sm:min-w-[150px]">
                            <label className="text-xs font-bold text-text-tertiary tracking-widest uppercase ml-1">Duration</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" size={16} />
                                <select
                                    className="appearance-none w-full bg-background-secondary border border-border-primary py-3 pl-10 pr-10 rounded-xl focus:ring-2 focus:ring-accent-primary outline-none text-sm font-medium transition-all text-text-primary"
                                    onChange={(e) => setDuration(Number(e.target.value))}
                                    value={duration}
                                >
                                    <option value={15}>15 Minutes</option>
                                    <option value={30}>30 Minutes</option>
                                    <option value={60}>60 Minutes</option>
                                </select>
                            </div>
                        </div>

                        {selectedCandidate && (
                            <div className="flex items-center gap-3 bg-accent-primary/10 border border-accent-primary/20 p-3 rounded-xl w-full sm:w-auto sm:ml-auto">
                                <CalendarIcon size={18} className="text-accent-primary" />
                                <div>
                                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-0.5">Preferred Time</p>
                                    <p className="text-sm font-bold text-text-primary leading-none">
                                        {formatPreferredRange(selectedCandidate.preferredRange.day, selectedCandidate.preferredRange.start, selectedCandidate.preferredRange.end)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 lg:gap-8 text-sm font-medium bg-background-tertiary border border-border-secondary p-5 rounded-2xl w-full">
                        <div className="flex items-center gap-2.5">
                            <div className="w-4 h-4 bg-accent-primary rounded-md shadow-[0_0_10px_rgba(124,58,237,0.4)]" />
                            <span className="text-text-primary font-bold">Optimal Match</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-text-secondary">
                            <div className="w-4 h-4 bg-border-secondary border border-border-primary rounded-md" />
                            <span>General Availability</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-text-tertiary">
                            <div className="w-4 h-4 striped-bg border border-border-secondary rounded-md opacity-40" />
                            <span>Slot Blocked</span>
                        </div>
                    </div>

                    <Calendar
                        candidate={selectedCandidate}
                        engineerFilterId={engineerFilterId}
                        engineers={engineers}
                        bookedSlots={bookedSlots}
                        duration={duration}
                        onSlotClick={handleSlotClick}
                    />
                </div>
            </div>

            {confirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-primary/80 backdrop-blur-md px-4 py-6 animate-fade-in overflow-y-auto">
                    <div className="glass-card max-w-md w-full p-6 lg:p-8 shadow-2xl shadow-accent-primary/10 border-accent-primary/30 relative overflow-hidden my-auto">
                        <div className="absolute top-0 left-0 w-1 lg:w-1.5 h-full bg-accent-primary" />
                        <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6">Confirm Interview</h2>
                        <div className="space-y-4 lg:space-y-6 mb-6 lg:mb-8 text-sm lg:text-base">
                            <div className="flex items-start gap-4 p-3 lg:p-4 bg-border-secondary rounded-2xl border border-border-secondary">
                                <div className="p-2 bg-accent-primary/20 rounded-lg text-accent-primary shrink-0">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Candidate</p>
                                    <p className="font-bold">{confirmation.candidate}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 p-3 lg:p-4 bg-border-secondary rounded-2xl border border-border-secondary">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-accent-primary/20 rounded-lg text-accent-primary shrink-0">
                                        <Filter size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Select Engineer</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {confirmation.availableEngineers.map(eng => (
                                        <button
                                            key={eng.id}
                                            onClick={() => setConfirmation({ ...confirmation, selectedEngineerId: eng.id })}
                                            className={cn(
                                                "p-3 rounded-xl border text-sm font-bold text-left transition-all",
                                                confirmation.selectedEngineerId === eng.id
                                                    ? "bg-accent-primary border-accent-primary text-white shadow-lg shadow-accent-primary/20"
                                                    : "bg-background-secondary border-border-primary text-text-secondary hover:border-text-tertiary"
                                            )}
                                        >
                                            {eng.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 lg:p-4 bg-border-secondary rounded-2xl border border-border-secondary">
                                <div className="p-2 bg-accent-primary/20 rounded-lg text-accent-primary shrink-0">
                                    <CalendarIcon size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">Schedule</p>
                                    <p className="font-bold">{formatDayDate(confirmation.day)} • {formatTime12hr(confirmation.time)}</p>
                                    <p className="text-[10px] text-text-secondary font-bold mt-1 tracking-wider">{duration} Minute Session</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                            <button
                                onClick={() => setConfirmation(null)}
                                className="flex-1 py-3 lg:py-4 px-6 rounded-2xl glass hover:bg-white/10 font-bold transition-all text-sm lg:text-base order-2 sm:order-1"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmInterview}
                                className="flex-2 py-3 lg:py-4 px-6 lg:px-8 rounded-2xl bg-accent-primary hover:bg-accent-secondary text-white font-extrabold transition-all shadow-xl shadow-accent-primary/30 active:scale-95 text-sm lg:text-base order-1 sm:order-2"
                            >
                                Confirm Slot
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
