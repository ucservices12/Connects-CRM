import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function CreateOrganization() {
    const navigate = useNavigate();
    const [organizationName, setOrganizationName] = useState('');
    const [error, setError] = useState('');

    const handleContinue = () => {
        if (!organizationName.trim()) {
            setError("Workspace name is required");
            return;
        }

        // You could store this in context or localStorage if needed
        localStorage.setItem("workspaceName", organizationName);

        navigate('/pricing-plan');
    };

    return (
        <div className="flex max-w-2xl flex-col sm:mt-36 px-4">
            <div>
                <h3 className="font-semibold">Name your Workspace</h3>
                <div className="form-group mt-6 grid gap-2">
                    <label className="form-label" htmlFor="organizationName">Workspace Name</label>
                    <input
                        id="organizationName"
                        type="text"
                        value={organizationName}
                        onChange={(e) => {
                            setOrganizationName(e.target.value);
                            if (error) setError('');
                        }}
                        className={`form-input pr-10 ${error ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500' : ''}`}
                        placeholder="Create your workspace name"
                    />
                    {error && <p className="text-xs text-danger-600 mt-1">{error}</p>}
                </div>
                <button
                    onClick={handleContinue}
                    className="btn bg-primary-800 text-white w-full mt-4"
                >
                    Continue
                </button>
            </div>

            {/* 
      <div className="text-center grid gap-2">
        <h3 className="text-3xl text-black font-bold">Welcome Back!</h3>
        <p className="text-blue-500 font-mono text-xl">testforai500@gmail.com</p>
        <div className="font-semibold">It seems you already tried signUp please click Continue to proceed with above email</div>
        <button onClick={() => navigate('verify-otp')} className="bg-primary-800 btn text-white">
          Continue
        </button>
      </div> 
      */}
        </div>
    );
}
