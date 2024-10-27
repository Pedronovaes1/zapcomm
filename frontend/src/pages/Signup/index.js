import React, { useState, useEffect } from "react";
import qs from 'query-string'

import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import InputMask from 'react-input-mask';
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo from "../../assets/logo.png";
import Moneyverse from "../../assets/Moneyverse.png"; //imagem adicionada

import { i18n } from "../../translate/i18n";

import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";
const Copyright = () => {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{"Copyright © "}
			<Link color="inherit" href="#">
				PLW
			</Link>{" "}
		   {new Date().getFullYear()}
			{"."}
		</Typography>
	);
};

const useStyles = makeStyles(theme => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%",
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const UserSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
	password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email").required("Required"),
});

const SignUp = () => {
	const classes = useStyles();
	const history = useHistory();
	let companyId = null

	const params = qs.parse(window.location.search)
	if (params.companyId !== undefined) {
		companyId = params.companyId
	}

	const initialState = { name: "", email: "", phone: "", password: "", planId: "", };

	const [user] = useState(initialState);
	const dueDate = moment().add(3, "day").format();
	const handleSignUp = async values => {
		Object.assign(values, { recurrence: "MENSAL" });
		Object.assign(values, { dueDate: dueDate });
		Object.assign(values, { status: "t" });
		Object.assign(values, { campaignsEnabled: true });
		try {
			await openApi.post("/companies/cadastro", values);
			toast.success(i18n.t("signup.toasts.success"));
			history.push("/login");
		} catch (err) {
			console.log(err);
			toastError(err);
		}
	};

	const [plans, setPlans] = useState([]);
	const { list: listPlans } = usePlans();

	useEffect(() => {
		async function fetchData() {
			const list = await listPlans();
			setPlans(list);
		}
		fetchData();
	}, []);


	return (
		<Container component="main" maxWidth="xs" style={{ margin: "0 auto", paddingRight: "20px",  }}>
			<CssBaseline />

			<div
  style={{
    background: "#0C2454",
    width: "416px",
    height: "1024px",
    padding: "196px 34.17px 278px 34px",
    gap: "0px",
    opacity: "1px",
    position: "absolute", 
    top: "0", 
    left: "0", 
	display: "flex",
	justifyContent: "center",
	alignItems: "flex-start",
	flexDirection: "column",
	paddingLeft: "100px",
  }}
>

<img src={Moneyverse} alt="Moneyverse" 


style={{ maxWidth: "80%", position: "relative", top: "-240px"  }} /> {/* Nova Imagem */}
<div style={{ color: "#FFFFFF !important", fontSize: "px", lineHeight: "1.4", marginTop: "-200px" }}></div>
<Typography variant="h6" style={{ fontWeight: "bold", marginBottom: "8px", color: "#FFFFFF"}}></Typography>
Seja Bem vindo!
 <Typography/>
 <ul style={{ paddingLeft: "20px", listStyleType: "disc", margin: 0, color: "#FFFFFF" }}></ul>

 <li>Unlimited projects and resources</li>
 <li>Unlimited templates</li>
 <li>Unlimited storage</li>
 <li>List, Board, and Calendar views...</li>
 <ul/>
</div>






			<div className={classes.paper} 
			style={{ 
				borderRadius: "35px",
				backgroundColor: "#fff", 
				overflow: "hidden",
				border: "1px solid #66666659",
				 padding: "30px",
				}}>
					


				<div>
					<center><img style={{ margin: "0 auto", width: "70%" }} src={logo} alt="Whats" /></center>
				</div>
				<Typography
				 variant="h6"
				 style={{
					textAlign: "center",
					color: "#0C2454",
					marginTop: "10px",
				 }}
				 >
					create an account
				 </Typography>
				{/*<Typography component="h1" variant="h5">
					{i18n.t("signup.title")}
				</Typography>*/}
				{/* <form className={classes.form} noValidate onSubmit={handleSignUp}> */}
				<Formik
					initialValues={user}
					enableReinitialize={true}
					validationSchema={UserSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							handleSignUp(values);
							actions.setSubmitting(false);
						}, 400);
					}}
				>
					{({ touched, errors, isSubmitting }) => (
						<Form className={classes.form}>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<Field
										as={TextField}
										autoComplete="name"
										name="name"
										error={touched.name && Boolean(errors.name)}
										helperText={touched.name && errors.name}
										variant="outlined"
										fullWidth
										id="name"
										label="Nome da Empresa"
									/>
								</Grid>

								<Grid item xs={12}>
									<Field
										as={TextField}
										variant="outlined"
										fullWidth
										id="email"
										label={i18n.t("signup.form.email")}
										name="email"
										error={touched.email && Boolean(errors.email)}
										helperText={touched.email && errors.email}
										autoComplete="email"
										required
									/>
								</Grid>
								
							<Grid item xs={12}>
								<Field
									as={InputMask}
									mask="(99) 99999-9999"
									variant="outlined"
									fullWidth
									id="phone"
									name="phone"
									error={touched.phone && Boolean(errors.phone)}
									helperText={touched.phone && errors.phone}
									autoComplete="phone"
									required
								>
									{({ field }) => (
										<TextField
											{...field}
											variant="outlined"
											fullWidth
											label="Telefone com (DDD)"
											inputProps={{ maxLength: 11 }} // Definindo o limite de caracteres
										/>
									)}
								</Field>
							</Grid>
								<Grid item xs={12}>
									<Field
										as={TextField}
										variant="outlined"
										fullWidth
										borderradius='30px'
										name="password"
										error={touched.password && Boolean(errors.password)}
										helperText={touched.password && errors.password}
										label={i18n.t("signup.form.password")}
										type="password"
										id="password"
										autoComplete="current-password"
										style={{ marginTop: "8px" }}
										required
									/>
								</Grid>

							</Grid>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								style={{ backgroundColor: "#34D3A3", padding: "5px 10px", width: "80%", borderRadius: "40px",
									margin: "0 auto",	display: "block", marginBottom: "40px",  marginTop: "20px" 
									
								 }}
								className={classes.submit}
							>
								{i18n.t("signup.buttons.submit")}
							</Button>
							<Grid container justify="flex-end">
								<Grid item>
									<Link
										href="#"
										variant="body2"
										component={RouterLink}
										to="/login"
									>
										{i18n.t("signup.buttons.login")}
									</Link>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</div>
			<Box mt={5}>{/* <Copyright /> */}</Box>
		</Container>
	);
};

export default SignUp;
