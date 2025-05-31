import FacebookLogin from 'react-facebook-login';

const FacebookLoginButton = () => {
    const responseFacebook = (response: any) => {
        console.log(response);
    };

    return (
        <div className="w-full flex justify-center">
            <FacebookLogin
                appId="YOUR_APP_ID"
                autoLoad={false}
                fields="name,email,picture"
                callback={responseFacebook}
                cssClass="border w-full p-2"
                icon={<i className="fab fa-facebook-f"></i>}
                textButton="&nbsp;&nbsp;Continue with Facebook"
            />
        </div>
    );
};

export default FacebookLoginButton;
