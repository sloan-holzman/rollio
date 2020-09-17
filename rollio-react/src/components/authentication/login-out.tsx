// START HERE
import useGetAppState from "../common/hooks/use-get-app-state";
import React, {useEffect, useState} from "react";
import TwitterLogin from 'react-twitter-auth';
import { withRouter } from 'react-router';
import { VENDOR_API } from "../../config";
import { receiveUser, logOut, fetchUserSuccess } from "../../redux/actions/user-actions";
import { UserDefaultState } from "../../redux/reducers/interfaces";
import { useDispatch } from "react-redux";
import { IconContext } from 'react-icons';
import { IoLogoTwitter } from 'react-icons/io';
import useGetRegions from './hooks/use-get-regions';
import useAuthentication from "../common/hooks/use-authentication";
import redirectToNewPage from "./utils/redirect-to-new-page";
const SIGN_IN = 'Sign In';
const SIGN_UP = 'Sign Up';

const Login = (props:any) => {
    const isLogin = !!props.isLogin;
    const dispatch = useDispatch();
    const [userType, setUserType] = useState<string>('');
    const { user, data, loadState } = useGetAppState();
    const { areRegionsLoaded } = loadState;
    const { regionsAll } = data;
    const twitterLoginUrl = `${VENDOR_API}/api/auth/twitter`;
    const twitterRequestTokenUrl = `${VENDOR_API}/api/auth/twitter/reverse`;
    const logout = () => {
        localStorage.clear();
        dispatch(logOut());
    };
    const onFailure = (error:any) => {
        alert(error);
    };

    const twitterResponse = (response:any) => {
        const token = response.headers.get('x-auth-token');
        response.json().then((user:UserDefaultState) => {
            if (token) {
                localStorage.token = token;
                dispatch(receiveUser(user));
                dispatch(fetchUserSuccess());
            }
        });
    };

    const goToOtherLoginPage = () => {
        props.history.push(isLogin ? '/signup' : '/login');
    };

    const loginOrSetUp = isLogin ? SIGN_IN : SIGN_UP;

    useEffect(() => {
        if (user.isAuthenticated && areRegionsLoaded) {
            redirectToNewPage(props, user, regionsAll);
        }
    }, [user, regionsAll, areRegionsLoaded]);
    useAuthentication(props, false);
    useGetRegions();

    const typeDescription = {
        [SIGN_IN]: {
            vendor: "You must sign in using your food truck's official twitter account.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do...",
            customer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do...'
        },
        [SIGN_UP]: {
            vendor: "You must sign up using your food truck's official twitter account.  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do...",
            customer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do...'
        }
    };

    const chooseUserType = (
        <div className="twitter_login__flex_grid twitter_login__margin_20_20">
            <div className="twitter_login__col">
                <h4 className="twitter_login__pointer" onClick={() => setUserType('vendor')}>Vendor {loginOrSetUp}</h4>
                    <p>{typeDescription[loginOrSetUp].vendor}</p>
            </div>
            <div className="twitter_login__col">
                <h4 className="twitter_login__pointer" onClick={() => setUserType('customer')}>Customer {loginOrSetUp}</h4>
                <p>{typeDescription[loginOrSetUp].customer}</p>
            </div>
        </div>
    );

    const loginFrame = (userType:string) => (
        <div className="twitter_login__button_wrapper">
            <h2> { userType.charAt(0).toUpperCase() + userType.slice(1) } {loginOrSetUp}</h2>
            <TwitterLogin
                loginUrl={`${twitterLoginUrl}/${userType}/`}
                onFailure={onFailure}
                onSuccess={twitterResponse}
                requestTokenUrl={twitterRequestTokenUrl}
                style={{margin: '0 0', padding: '0 0', border: '0'}}
            >
                <div className="twitter_login__login_button">
                    <IconContext.Provider value={{ size: '32', color: 'white' }}>
                        <div className="twitter_login__login_content twitter_login__pointer">
                            <IoLogoTwitter/>
                            CONTINUE WITH TWITTER
                        </div>
                    </IconContext.Provider>
                </div>
            </TwitterLogin>
            <p>{isLogin ? "Don't" : "Already"} have an account? <a className="twitter_login__sign_up_link twitter_login__pointer" onClick={goToOtherLoginPage}>{ isLogin ? SIGN_UP : SIGN_IN }</a></p>
        </div>
    );

    return (
        <div>
            { userType ? loginFrame(userType) : chooseUserType }
        </div>
    );
}

export default withRouter(Login);
