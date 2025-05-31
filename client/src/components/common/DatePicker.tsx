import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
    selectedDate: Date;
    onChange: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        onChange(newDate);
        setIsOpen(false);
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);

        const days = [];
        const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

        // Add weekday headers
        weekdays.forEach((day, index) => {
            days.push(
                <div key={`weekday-${index}`} className="text-center text-xs text-neutral-500 font-medium py-1">
                    {day}
                </div>
            );
        });

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isSelected =
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year;

            days.push(
                <div
                    key={`day-${day}`}
                    className={`p-2 text-center rounded-full w-8 h-8 flex items-center justify-center mx-auto cursor-pointer hover:bg-neutral-100 ${isSelected ? 'bg-primary-600 text-white hover:bg-primary-700' : ''
                        }`}
                    onClick={() => handleDateSelect(day)}
                >
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="relative" ref={calendarRef}>
            <div
                className="form-input flex items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Calendar size={18} className="mr-2 text-neutral-500" />
                {formatDate(selectedDate)}
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 p-3 w-64">
                    <div className="flex justify-between items-center mb-2">
                        <button
                            className="p-1 hover:bg-neutral-100 rounded"
                            onClick={handlePrevMonth}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>

                        <span className="font-medium">
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>

                        <button
                            className="p-1 hover:bg-neutral-100 rounded"
                            onClick={handleNextMonth}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;