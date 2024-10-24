import React, { useState, useEffect } from "react";
import qs from 'query-string';
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";
import InputMask from 'react-input-mask';
import { makeStyles } from "@material-ui/core/styles";
import logo from "../../assets/logo.png";
import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";
import { i18n } from "../../translate/i18n";


const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  sidebar: {
    backgroundColor: "#002D62",
    color: "#fff",
    width: "40%",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  sidebarText: {
    fontSize: "1.5rem",
    marginBottom: "2rem",
    lineHeight: "2.5rem",
  },
  formContainer: {
    width: "60%",
    padding: "2rem",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  form: {
    width: "100%",
    maxWidth: "400px",
  },
  submitButton: {
    backgroundColor: "#1dbf73",
    color: "#000",
    padding: "0.5rem",
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    width: "100%",
    borderRadius: "25px",
    marginTop: "1rem",
  },
  logo: {
    width: "150px",
    marginBottom: "2rem",
  },
  inputField: {
    width: "100%",
    padding: "1rem",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  errorMessage: {
    color: 'red',
    marginBottom: '1rem',
  }
}));

const UserSchema = Yup.object().shape({
  name: Yup.string().required("Nome da empresa é obrigatório."),
  email: Yup.string().email("Email inválido").required("Email é obrigatório."),
  phone: Yup.string().required("Telefone é obrigatório."),
  password: Yup.string().min(5, "Senha muito curta.").required("Senha é obrigatória."),
});

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  const dueDate = moment().add(3, "days").format();

  const initialState = {
    name: "",
    email: "",
    phone: "",
    password: "",
    planId: "",
  };
  
  const [user] = useState(initialState);
  const [plans, setPlans] = useState([]);
  const { list: fetchPlans } = usePlans();

  useEffect(() => {
    const fetchData = async () => {
      const list = await fetchPlans();
      setPlans(list);
    };
    fetchData();
  }, [fetchPlans]);

  const handleSignUp = async (values) => {
    try {
      // Cadastrando a empresa
      await openApi.post("/companies/cadastro", {
        ...values,
        recurrence: "MENSAL",
        dueDate,
        status: "t",
        campaignsEnabled: true,
      });

      // Após o cadastro, faça o login do usuário
      const loginResponse = await openApi.post("/auth/login", {
        email: values.email,
        password: values.password,
      });

      // Armazenar o token de autenticação
      localStorage.setItem('token', loginResponse.data.token);

      // Redireciona para a página principal
      history.push("/dashboard");
    } catch (err) {
      toastError(err);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <h2>Seja Bem Vindo!</h2>
        <ul className={classes.sidebarText}>
          <li>Projetos ilimitados e recursos</li>
          <li>Templates ilimitados</li>
          <li>Armazenamento ilimitado</li>
          <li>Visão em lista, quadro e calendário</li>
        </ul>
      </div>
      <div className={classes.formContainer}>
        <img src={logo} alt="Logo" className={classes.logo} />
        <Formik
          initialValues={user}
          validationSchema={UserSchema}
          onSubmit={(values) => handleSignUp(values)}
        >
          {({ touched, errors }) => (
            <Form className={classes.form}>
              {touched.name && errors.name && <div className={classes.errorMessage}>{errors.name}</div>}
              <Field as="input" name="name" placeholder="Nome da Empresa" className={classes.inputField} />
              
              {touched.email && errors.email && <div className={classes.errorMessage}>{errors.email}</div>}
              <Field as="input" name="email" type="email" placeholder="Email" className={classes.inputField} />
              
              {touched.phone && errors.phone && <div className={classes.errorMessage}>{errors.phone}</div>}
              <Field as={InputMask} mask="(99) 99999-9999" name="phone" placeholder="Telefone com DDD" className={classes.inputField} />
              
              {touched.password && errors.password && <div className={classes.errorMessage}>{errors.password}</div>}
              <Field as="input" name="password" type="password" placeholder="Senha" className={classes.inputField} />
              
              <button type="submit" className={classes.submitButton}>Cadastrar</button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
