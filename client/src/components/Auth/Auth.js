import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Container, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { GoogleLogin } from 'react-google-login';
import makeStyles from './styles';
import Input from './Input';
import Icon from './icon';
import { gapi } from "gapi-script";
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { signin, signup } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmpassword: ''};
const Auth = () => {

    gapi.load("client:auth2", () => {
        gapi.client.init({
          clientId:
            "103793759052-qnm7m5mci7nuhokvhanudtpbrrev429u.apps.googleusercontent.com",
            clientSecret: "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",
          plugin_name: "chat",
        });
      });

    const classes= makeStyles();
    const [showPassword, setShowPassword] = useState(false);

    const [isSignup, setIsSignup] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();
    const [formData, setformData] = useState(initialState);

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)

    const handleSubmit = (e) => {
        e.preventDefault();
        if(isSignup) {
            dispatch(signup(formData, history));
        }
        else {
            dispatch(signin(formData, history));
        }
    };

    const handleChange = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value })
    };

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    }

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
            dispatch({type: 'AUTH', data: { result, token}});
            history.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    const googleFailure = (error) => {
        console.log(error);
        console.log("google Sign In was unsuccessful. Try Again Later");
    }

  return (
    <Container compnent="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon/>
            </Avatar>
            <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {isSignup && (
                        <>
                            <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                            <Input name="lastName" label="Last Name" handleChange={handleChange} half/>
                        </>
                    )}
                    <Input name="email" label="Email Address" handleChange={handleChange} type="email"/>
                    <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                    {isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password"/>}
                </Grid>
                <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                    {isSignup ? 'Sign Up' : 'Sign In'}
                </Button>
                <GoogleLogin 
                    clientId="103793759052-qnm7m5mci7nuhokvhanudtpbrrev429u.apps.googleusercontent.com"
                    render={(renderProps) => (
                        <Button className={classes.Google} color='primary' fullWidth onClick={renderProps.onClick} diabled={renderProps.disabled} startIcon={<Icon/>} variant="contained">Google Sign In</Button>
                    )}
                    onSuccess={googleSuccess}
                    onFailure={googleFailure}
                    cookiePolicy="single_host_origin"
                />
                <Grid container justify="flex-end">
                    <Grid item>
                        <Button onClick={switchMode}> {isSignup ? "Already have an account ? Sign In " : "Don't have an account ? Sign Up"} </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
  )
}

export default Auth