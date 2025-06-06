import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
    const [code, setCode] = useState(Array(6).fill(''));
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleCodeChange = (value: string, index: number) => {
        const updated = [...code];
        updated[index] = value.slice(0, 1);
        setCode(updated);

        const nextInput = document.getElementById(`code-${index + 1}`);
        if (value && nextInput) nextInput.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === confirmPassword && code.join('').length === 6) {
            console.log('Submitted:', { code: code.join(''), password });
        }
    };

    return (
        <>
            <h2 className="text-2xl font-semibold mb-2 text-center">Enter new password</h2>
            <p className="text-center text-sm text-neutral-600 mt-1 mb-4">
                Confirm code and enter new password
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Disabled Email */}
                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        value="testforai500@gmail.com"
                        className="form-input bg-neutral-100 text-neutral-500 cursor-not-allowed"
                        disabled
                    />
                </div>

                {/* Code Inputs */}
                <div className="form-group flex justify-between gap-2">
                    {code.map((digit, idx) => (
                        <input
                            key={idx}
                            id={`code-${idx}`}
                            type="text"
                            value={digit}
                            onChange={(e) => handleCodeChange(e.target.value, idx)}
                            maxLength={1}
                            className="w-12 h-12 text-center form-input text-xl"
                        />
                    ))}
                </div>

                {/* Password Input */}
                <div className="form-group relative">
                    <label className="form-label">Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        className="form-input pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-9 text-neutral-500"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* Confirm Password Input */}
                <div className="form-group relative">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        className="form-input pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-9 text-neutral-500"
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={code.join('').length !== 6 || password !== confirmPassword}
                        className="btn btn-primary flex-1 disabled:opacity-50"
                    >
                        Continue
                    </button>
                    <button type="button" className="btn btn-outline flex-1">
                        Resend
                    </button>
                </div>

                {/* Cancel */}
                <Link to="/signin" className="btn btn-primary w-full mt-2">
                    Cancel & Go To Sign In
                </Link>
            </form>
        </>
    );
};

export default ResetPassword;
