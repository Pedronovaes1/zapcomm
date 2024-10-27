import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid"; 
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { versionSystem } from "../../../package.json";
import { i18n } from "../../translate/i18n";
import { nomeEmpresa } from "../../../package.json";
import { AuthContext } from "../../context/Auth/AuthContext";
import logo from "../../assets/logo.png";
import Moneyverse from "../../assets/Moneyverse.png";


const Copyright = () => {
	return (
		<Typography variant="body2" color="primary" align="center">
			{"Copyright "}
 			<Link color="primary" href="#">
 				{ nomeEmpresa } - v { versionSystem }
 			</Link>{" "}
 			{new Date().getFullYear()}
 			{"."}
 		</Typography>
 	);
 };

const useStyles = makeStyles(theme => ({
	root: {
		width: "100%",
		//background: "linear-gradient(to right, #682EE3 , #682EE3 , #682EE3)",
		//backgroundImage: "url(https://i.imgur.com/CGby9tN.png)",
		backgroundColor: "#FFFFFF",
		backgroundRepeat: "no-repeat",
		backgroundSize: "100% 100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		textAlign: "center",
		margin: "0",
		padding: "0",
		boxSizing: "border-box",
	},
	container:{
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		height: "100vh",
		boxSizing: "border-box",
		paddingLeft: "0",
		paddingRight: "0",
	},
	paper: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: "65%",
	},
	infoContainer: {
		backgroundColor: "#0C2454",
		color: "#FFFFFF",
		padding: theme.spacing(4),
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		width: "35%",
		height: "100%",
    },
	avatar: {
	 
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "50%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		backgroundColor: "#34D3A3",
		color: "black",
	},
	powered: {
		color: "white"
	}
}));

const Login = () => {
	const classes = useStyles();

	const [user, setUser] = useState({ email: "", password: "" });

	const { handleLogin } = useContext(AuthContext);

	const handleChangeInput = e => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

	const handlSubmit = e => {
		e.preventDefault();
		handleLogin(user);
	};

	
	return (
		<Box className={classes.root}>
			<CssBaseline />
			<Container className={classes.container} component="main" maxWidth="false">
				<CssBaseline />	
				<div className={classes.paper}>
					
					<img style={{ margin: "40px auto", width: "35%" }} src={logo} alt="Whats" />
					
					{/*<Typography component="h1" variant="h5">
						{i18n.t("login.title")}
					</Typography>*/}
					<form className={classes.form} noValidate onSubmit={handlSubmit}>
						<TextField
							variant="outlined"
							margin="normal"
							required
							fullWidth
							id="email"
							label={i18n.t("login.form.email")}
							name="email"
							value={user.email}
							onChange={handleChangeInput}
							autoComplete="email"
							autoFocus
						/>
						<TextField //esses textfield faz a página principal do container
							variant="outlined"
							margin="normal"
							required
							fullWidth
							name="password"
							label={i18n.t("login.form.password")}
							type="password"
							id="password"
							value={user.password}
							onChange={handleChangeInput}
							autoComplete="current-password"
						/>
						
						<Grid container justify="flex-end">
						<Grid item xs={6} style={{ textAlign: "right" }}>
							<Link component={RouterLink} to="/forgetpsw" variant="body2">
							Esqueceu sua senha?
							</Link>
						</Grid>
						</Grid>
						
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							{i18n.t("login.buttons.submit")}
						</Button>
						{ <Grid container>
							<Grid item>
								<Link
									href="#"
									variant="body2"
									component={RouterLink}
									to="/signup"
								>
									{i18n.t("login.buttons.register")}
								</Link>
							</Grid>
						</Grid> }
					</form>	
				</div>
				<div className={classes.infoContainer}>
					<img src={Moneyverse} style={{ filter: "brightness(1.1) contrast(1.2) saturate(1.0)"}}/>
					<Typography variant="h5" style={{textAlign:"justify", marginTop: "40px"}}>Seja Bem-vindo!</Typography>
					<ul style={{ lineHeight: "30px", fontSize:"14px", textAlign: "justify", fontWeight: "200"}}>
						<li>Lorem Ipsum is simply dummy. </li>
						<li>Lorem Ipsum is simply dummy. </li>
						<li>ULorem Ipsum is simply dummy. </li>
						<li>Lorem Ipsum is simply dummy.</li>
					</ul>
				</div>
				{/*<Box mt={8}><Copyright /></Box>*/}
		</Container>
		</Box>
	);
};

export default Login;
