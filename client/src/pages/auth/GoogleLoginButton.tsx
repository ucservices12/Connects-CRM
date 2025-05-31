// GoogleLoginButton.jsx
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const GoogleLoginButton = () => {
    const handleLoginSuccess = (credentialResponse) => {
        const decoded = jwtDecode(credentialResponse.credential);
        console.log('Google Login Success:', decoded);

        // TODO: Send `decoded` to your backend API if needed
    };

    const handleLoginError = () => {
        console.error('Google Login Failed');
    };

    return (
        <div style={{ width: '100%' }}>
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                theme="outline"
                size="large"
            />
        </div>
    );
};

export default GoogleLoginButton;
