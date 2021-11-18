import React, { createContext, useReducer, useContext, useLayoutEffect } from "react";
import { BrowserRouter, Route, Switch, useHistory} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Home from "./screens/Home/Home";
import Profile from "./screens/Profile/Profile";
import Login from "./screens/Login/Login";
import Signup from "./screens/Signup/Signup";
import EditProfile from "./screens/Edit Profile/EditProfile";
import IndividualPost from "./screens/Individual Post/IndiavidualPost";
import About from "./components/About/About";
import { authReducer, initialState } from "./reducers/authReducer";

export const AuthContext = createContext();

const Routing = () => {
    const history = useHistory();
    // eslint-disable-next-line no-unused-vars
    const { authState, authDispatch } = useContext(AuthContext);
    useLayoutEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            authDispatch({ type: "USER", payload: user });
        } else {
            history.push("/");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <Switch>
            <Route path="/" exact={true}>
                <About />
            </Route>
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/home" exact={true}>
                <Home />
            </Route>
            <Route exact path="/profile/:username">
                <Profile />
            </Route>
            <Route path="/signup">
                <Signup />
            </Route>
            <Route path = "/editprofile">
                <EditProfile/>
            </Route>
            <Route path = "/post/:postID">
                <IndividualPost/>
            </Route>
        </Switch>
    );
};

function App() {
    const [authState, authDispatch] = useReducer(authReducer, initialState);
    return (
        <>
            <AuthContext.Provider value={{ authState, authDispatch }}>
                <BrowserRouter>
                    <Navbar />
                    <Routing />
                </BrowserRouter>
            </AuthContext.Provider>
        </>
    );
}

export default App;
