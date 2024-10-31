import React, { useState, useEffect } from "react";
import qs from 'query-string';
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import InputMask from 'react-input-mask';
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo from "../../assets/logo.png";
import { i18n } from "../../translate/i18n";
import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";
import Moneyverse from "../../assets/Moneyverse.png";

const useStyles = makeStyles(theme => ({
	root: {
		width: "100%",
		backgroundColor: "#FFFFFF",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		margin: "0",
		padding: "0",
		boxSizing: "border-box",
	},
	container: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		height: "100vh",
		paddingLeft: "0",
		paddingRight: "0",
	},
	paper: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		width: "65%",
		border: "1px solid #0C2454",
		borderRadius: "15px",
		padding: theme.spacing(1),
		margin: theme.spacing(0),
		[theme.breakpoints.down('sm')]: {
			width: "90%",
			height: "auto",
			justifyContent: "center",
			alignItems: "center",
		},
	},
	formGrid: {
		backgroundColor: "#fff",
		width: "40%",
		alignItems: "center",
		justifyContent: "center",
		[theme.breakpoints.down('sm')]: {
			width: "50%",
		},
	},
	avatar: {
		backgroundColor: theme.palette.secondary.main,
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
		[theme.breakpoints.down('sm')]: {
			display: 'none',
		},
	},
	form: {
		width: "100%",
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const UserSchema = Yup.object().shape({
	name: Yup.string().min(2, "Too Short!").max(50, "Too Long!").required("Required"),
	password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
	email: Yup.string().email("Invalid email").required("Required"),
});

const SignUp = () => {
	const classes = useStyles();
	const history = useHistory();
	let companyId = null;

	const params = qs.parse(window.location.search);
	if (params.companyId !== undefined) {
		companyId = params.companyId;
	}

	const initialState = { name: "", email: "", phone: "", password: "", planId: "" };
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
		<Box className={classes.root}>
			<Container component="main" maxWidth="false" className={classes.container}>
				<CssBaseline />
				<div className={classes.infoContainer}>
					<center>
					<img src={Moneyverse} alt="Moneyverse" style={{ width: "80%", marginBottom: "20px" }} />
					</center>
					<Typography variant="h5" style={{ textAlign: "justify", marginTop: "40px" }}>Seja Bem-vindo!</Typography>
					<ul style={{ lineHeight: "30px", fontSize: "14px", textAlign: "justify", fontWeight: "200" }}>
						<li>Unlimited projects and resources</li>
						<li>Unlimited templates</li>
						<li>Unlimited storage</li>
						<li>List, Board, and Calendar views...</li>
					</ul>
				</div>
				<div className={classes.paper}>
					<Grid className={classes.formGrid}>
						<div>
							<center><img style={{ margin: "0 auto", width: "70%" }} src={logo} alt="Whats" /></center>
						</div>
						<Typography variant="h6" style={{ textAlign: "center", color: "#0C2454", marginTop: "10px" }}>
						create an account
						</Typography>
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
												InputProps={{
													style: { borderRadius: '15px' }
												}}
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
												InputProps={{
													style: { borderRadius: '15px' }
												}}
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
												InputProps={{
													style: { borderRadius: '15px' }
												}}
											>
												{({ field }) => (
													<TextField
														{...field}
														variant="outlined"
														fullWidth
														label="Telefone com (DDD)"
														inputProps={{ maxLength: 11 }}
														InputProps={{
															style: { borderRadius: '15px' }
														}}
													/>
												)}
											</Field>
										</Grid>
										<Grid item xs={12}>
											<Field
												as={TextField}
												variant="outlined"
												fullWidth
												name="password"
												error={touched.password && Boolean(errors.password)}
												helperText={touched.password && errors.password}
												label={i18n.t("signup.form.password")}
												type="password"
												id="password"
												autoComplete="current-password"
												required
												InputProps={{
													style: { borderRadius: '15px' }
												}}
											/>
										</Grid>
										<Grid item xs={12}>
											<InputLabel htmlFor="plan-selection">Plano</InputLabel>
											<Field
												as={Select}
												variant="outlined"
												fullWidth
												id="plan-selection"
												label="Plano"
												name="planId"
												required
												style={{ borderRadius: '15px' }}
												
											>
												{plans.map((plan, key) => (
													<MenuItem key={key} value={plan.id}>
														{plan.name} - Atendentes: {plan.users} - WhatsApp: {plan.connections} - Filas: {plan.queues} - R$ {plan.value}
													</MenuItem>
												))}
											</Field>
										</Grid>
									</Grid>
									<Button
										type="submit"
										fullWidth
										variant="contained"
										color="secondary"
										className={classes.submit}
										style={{borderRadius:"100px",width:"210px", heigth:"6opx"}}
									>
										{i18n.t("Cadastrar")}
									</Button>
									<Grid container justify="flex-end">
										<Grid item>
											<Link href="#" variant="body2" component={RouterLink} to="/login">
												{i18n.t("signup.buttons.login")}
											</Link>
										</Grid>
									</Grid>
								</Form>
							)}
						</Formik>
					</Grid>
				</div>
			</Container>
		</Box>
	);
};

export default SignUp;
