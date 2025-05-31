import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
    const [code, setCode] = useState(new Array(6).fill(""));
    const inputsRef = useRef([]);
    const Navigate = useNavigate();

    const handleChange = (value, index) => {
        if (!/^[0-9a-zA-Z]?$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleVerify = () => {
        Navigate('/create-organization');
    };

    return (
        <div className="flex flex-col items-center justify-center px-4">
            <div className="max-w-md w-full flex flex-col items-center space-y-6">
                <div className="text-4xl text-blue-500">
                    📩
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Verify your Email</h2>
                <p className="text-gray-600 text-center">
                    We have sent a verification code to your email<br />
                    Enter this code to verify your account
                </p>

                <div className="flex space-x-2">
                    {code.map((char, idx) => (
                        <input
                            key={idx}
                            type="text"
                            maxLength={1}
                            value={char}
                            onChange={(e) => handleChange(e.target.value, idx)}
                            onKeyDown={(e) => handleKeyDown(e, idx)}
                            ref={(el) => (inputsRef.current[idx] = el)}
                            className="w-12 h-12 text-center border rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={code.includes("")}
                    className={`w-full py-2 rounded-md text-white font-semibold ${code.includes("") ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                        }`}
                >
                    Verify
                </button>

                <button className="text-blue-600 hover:underline font-semibold text-sm">
                    resend
                </button>

                <Link to='/login' className="text-blue-600 hover:bg-gray-50 font-semibold text-sm border px-8 py-2 rounded-md">
                    Cancel
                </Link>
            </div>
        </div>
    );
}