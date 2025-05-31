import { useEffect, useRef } from "react";

// like Chart.js, Recharts, or Victory
const InvoiceStatusChart = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Data for the chart
    const data = [
        { label: 'Paid', value: 58, color: '#16A34A' },   
        { label: 'Pending', value: 25, color: '#F59E0B' },
        { label: 'Overdue', value: 12, color: '#DC2626' },
        { label: 'Draft', value: 5, color: '#6B7280' }, 
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the donut chart
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        let startAngle = 0;
        const total = data.reduce((sum, item) => sum + item.value, 0);

        data.forEach(item => {
            const sliceAngle = (2 * Math.PI * item.value) / total;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();

            ctx.fillStyle = item.color;
            ctx.fill();

            startAngle += sliceAngle;
        });

        // Draw a white circle in the middle for the donut hole
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();

        // Draw the total in the center
        ctx.fillStyle = '#1F2937'; // neutral-800
        ctx.font = 'bold 16px system-ui';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(total.toString(), centerX, centerY);

    }, []);

    return (
        <div className="flex flex-col items-center">
            <canvas
                ref={canvasRef}
                width={200}
                height={200}
                className="mb-4"
            ></canvas>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center">
                        <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: item.color }}
                        ></div>
                        <span className="text-sm text-neutral-700">{item.label}: {item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvoiceStatusChart;