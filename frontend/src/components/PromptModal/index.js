import React, { useState, useEffect } from "react";

import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Grid } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { InputAdornment, IconButton } from "@material-ui/core";

import QueueSelectSingle from "../../components/QueueSelectSingle"; 

import api from "../../services/api";
import toastError from "../../errors/toastError";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  btnWrapper: {
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  fieldSpacing: {
    marginBottom: theme.spacing(2), 
  },
}));

const PromptSchema = Yup.object().shape({
  modelName: Yup.string().min(5, "Muito curto!").max(100, "Muito longo!").required("Obrigatório"),
  trainingPrompt: Yup.string().min(50, "Muito curto!").required("Descreva o prompt para Inteligência Artificial"),
  maxTokensLimit: Yup.number().required("Informe o número máximo de tokens").min(1, "O número máximo de tokens deve ser maior que zero"),
  responseTokenLimit: Yup.number().required("Informe o número máximo de tokens na resposta").min(1, "O número máximo de tokens deve ser maior que zero"),
  temperatureValue: Yup.number().required("Informe a temperatura").min(0, "A temperatura deve ser maior ou igual a zero"),
  apiKeyValue: Yup.string().required("Informe a API Key"),
  queueId: Yup.number().required("Informe a fila").nullable(), 
  maxMsgCount: Yup.number().required("Informe o número máximo de mensagens").min(1, "O número máximo de mensagens deve ser maior que zero"),
  stopSeq: Yup.string().required("Informe a sequência de parada"), 
  freqPenalty: Yup.number().required("Informe a penalidade de frequência").min(0, "Deve ser maior ou igual a zero"), 
  presencePenaltyValue: Yup.number().required("Informe a penalidade de presença").min(0, "Deve ser maior ou igual a zero"), 

  
  voiceName: Yup.string().required("Informe a voz"),
  voiceApiKey: Yup.string().required("Informe a Chave da API de voz"),
  voiceRegion: Yup.string().required("Informe a região de voz"),
  maxMessageHistory: Yup.number().required("Informe o número máximo de mensagens no histórico").min(1, "Deve ser maior que zero"),
  maxResponseTokens: Yup.number().required("Informe o número máximo de tokens na resposta").min(1, "Deve ser maior que zero"),
});

const PromptModal = ({ open, onClose, promptId }) => {
  const classes = useStyles();
  const [showApiKey, setShowApiKey] = useState(false);

  const handleToggleApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const initialState = {
    modelName: "",
    trainingPrompt: "",
    maxTokensLimit: 100,
    responseTokenLimit: 50, 
    temperatureValue: 1,
    apiKeyValue: "",
    queueId: null, 
    maxMsgCount: 10,
    stopSeq: "", 
    freqPenalty: 0, 
    presencePenaltyValue: 0, 

    
    voiceName: "", 
    voiceApiKey: "", 
    voiceRegion: "", 
    maxMessageHistory: 10, 
    maxResponseTokens: 50, 
  };

  const [prompt, setPrompt] = useState(initialState);

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!promptId) {
        setPrompt(initialState);
        return;
      }
      try {
        const { data } = await api.get(`/prompt/${promptId}`);
        setPrompt((prevState) => ({
          ...prevState,
          ...data,
        }));
      } catch (err) {
        toastError(err);
      }
    };

    fetchPrompt();
  }, [promptId, open]);

  const handleClose = () => {
    setPrompt(initialState);
    onClose();
  };

  const handleSavePrompt = async (values) => {
    try {
      if (promptId) {
        await api.put(`/prompt/${promptId}`, values);
      } else {
        await api.post("/prompt", values);
      }
      toast.success("Prompt salvo com sucesso!");
    } catch (err) {
      toastError(err);
    }
    handleClose();
  };

  return (
    <div className={classes.root}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" scroll="paper" fullWidth>
        <DialogTitle id="form-dialog-title">
          {promptId ? "Editar Prompt" : "Adicionar Prompt"}
        </DialogTitle>
        <Formik
          initialValues={prompt}
          enableReinitialize={true}
          validationSchema={PromptSchema}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              handleSavePrompt(values);
              actions.setSubmitting(false);
            }, 400);
          }}
        >
          {({ touched, errors, isSubmitting, values, setFieldValue }) => (
            <Form style={{ width: "100%" }}>
              <DialogContent dividers>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      label="Nome do Modelo"
                      name="modelName"
                      error={touched.modelName && Boolean(errors.modelName)}
                      helperText={touched.modelName && errors.modelName}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.fieldSpacing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      label="API Key"
                      name="apiKeyValue"
                      type={showApiKey ? "text" : "password"}
                      error={touched.apiKeyValue && Boolean(errors.apiKeyValue)}
                      helperText={touched.apiKeyValue && errors.apiKeyValue}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.fieldSpacing}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleToggleApiKey}>
                              {showApiKey ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      label="Prompt"
                      name="trainingPrompt" 
                      error={touched.trainingPrompt && Boolean(errors.trainingPrompt)}
                      helperText={touched.trainingPrompt && errors.trainingPrompt}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      multiline
                      rows={4}
                      className={classes.fieldSpacing}
                      style={{ marginBottom: 0 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      label="Fila"
                      name="queueId" 
                      error={touched.queueId && Boolean(errors.queueId)}
                      helperText={touched.queueId && errors.queueId}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.fieldSpacing}
                    />
                  </Grid>
                {}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      label="Voz"
                      name="voiceName"
                      error={touched.voiceName && Boolean(errors.voiceName)}
                      helperText={touched.voiceName && errors.voiceName}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.fieldSpacing}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      label="Chave da API de Voz"
                      name="voiceApiKey"
                      error={touched.voiceApiKey && Boolean(errors.voiceApiKey)}
                      helperText={touched.voiceApiKey && errors.voiceApiKey}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.fieldSpacing}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      label="Região de Voz"
                      name="voiceRegion"
                      error={touched.voiceRegion && Boolean(errors.voiceRegion)}
                      helperText={touched.voiceRegion && errors.voiceRegion}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.fieldSpacing}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      label="Máximo de Mensagens no Histórico"
                      name="maxMessageHistory"
                      type="number"
                      error={touched.maxMessageHistory && Boolean(errors.maxMessageHistory)}
                      helperText={touched.maxMessageHistory && errors.maxMessageHistory}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.fieldSpacing}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      label="Máximo de Tokens na Resposta"
                      name="maxResponseTokens"
                      type="number"
                      error={touched.maxResponseTokens && Boolean(errors.maxResponseTokens)}
                      helperText={touched.maxResponseTokens && errors.maxResponseTokens}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.fieldSpacing}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      label="Temperatura"
                      name="temperatureValue"
                      type="number"
                      error={touched.temperatureValue && Boolean(errors.temperatureValue)}
                      helperText={touched.temperatureValue && errors.temperatureValue}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      className={classes.fieldSpacing}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions style={{ justifyContent: "center" }}>
            <Button 
                onClick={handleClose} 
                style={{ 
                backgroundColor: '#ffffff', 
                color: 'black', 
                borderRadius: '16px', 
                padding: '12px 24px', 
                fontSize: '16px', 
                border: '2px solid rgba(0, 0, 0, 0.2)', 
                }} 
            >
                Cancelar
            </Button>
            <div className={classes.btnWrapper}>
                <Button 
                type="submit" 
                style={{ 
                    backgroundColor: '#34D3A3', 
                    color: 'black', 
                    borderRadius: '16px', 
                    padding: '12px 24px', 
                    fontSize: '16px', 
                }} 
                disabled={isSubmitting}
                >
                Salvar
                </Button>
                {isSubmitting && <CircularProgress size={24} className={classes.buttonProgress} />}
            </div>
            </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </div>
  );
};

export default PromptModal;
