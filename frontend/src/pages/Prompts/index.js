import React, { useContext, useEffect, useReducer, useState } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { AuthContext } from "../../context/Auth/AuthContext";
import api from "../../services/api";
import PromptModal from "../../components/PromptModal";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import { SocketContext } from "../../context/Socket/SocketContext";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import Title from "../../components/Title";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    margin: "40px auto",
    padding: theme.spacing(2),
    width: "80%",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  headerText: {
    fontWeight: "bold",
    color: "#333",
  },
  title: { 
    fontSize: "24px",    
    marginBottom: theme.spacing(3),
    width: "80%",   
    margin: "40px auto",

  },
  inputContainer: {
    display: "flex",
    justifyContent: "space-between",
    justifyContent: "center", 
    alignItems: "center",
    marginBottom: theme.spacing(3), 
    gap: theme.spacing(-2)
  },
  inputField: {
    flex: 0.9,
    marginRight: theme.spacing(2),
    width: "100px",
    

  },
  addButton: {
    backgroundColor: "#00b894",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#00a084",
      gap: theme.spacing(10)  
    },
  },
  actionButtons: {
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing(10),
  },
  table: {
    marginTop: theme.spacing(2), 
  },
}));

const reducer = (state, action) => {
  if (action.type === "LOAD_PROMPTS") {
    const prompts = action.payload;
    const newPrompts = [];

    prompts.forEach((prompt) => {
      const promptIndex = state.findIndex((p) => p.id === prompt.id);
      if (promptIndex !== -1) {
        state[promptIndex] = prompt;
      } else {
        newPrompts.push(prompt);
      }
    });

    return [...state, ...newPrompts];
  }

  if (action.type === "UPDATE_PROMPTS") {
    const prompt = action.payload;
    const promptIndex = state.findIndex((p) => p.id === prompt.id);

    if (promptIndex !== -1) {
      state[promptIndex] = prompt;
      return [...state];
    } else {
      return [prompt, ...state];
    }
  }

  if (action.type === "DELETE_PROMPT") {
    const promptId = action.payload;
    const promptIndex = state.findIndex((p) => p.id === promptId);
    if (promptIndex !== -1) {
      state.splice(promptIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const PromptTable = () => {
  const classes = useStyles();
  const [prompts, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const companyId = user.companyId;
  const socketManager = useContext(SocketContext);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data } = await api.get("/prompt");
        dispatch({ type: "LOAD_PROMPTS", payload: data.prompts });
      } catch (err) {
        toastError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-prompt`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_PROMPTS", payload: data.prompt });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_PROMPT", payload: data.promptId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [companyId, socketManager]);

  const handleOpenPromptModal = () => {
    setPromptModalOpen(true);
    setSelectedPrompt(null);
  };

  const handleClosePromptModal = () => {
    setPromptModalOpen(false);
    setSelectedPrompt(null);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedPrompt(null);
  };

  const handleDeletePrompt = async (promptId) => {
    try {
      const { data } = await api.delete(`/prompt/${promptId}`);
      toast.info(i18n.t(data.message));
    } catch (err) {
      toastError(err);
    }
    setSelectedPrompt(null);
  };

  return (
    <>
      <Title><h1 className={classes.title}>{i18n.t("Prompt")} ({prompts.length})</h1></Title>
      <Paper className={classes.mainPaper}>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.inputField}
            label="Novo Prompt"
            variant="outlined"
            size="small"
          />
          <Button
            variant="contained"
            className={classes.addButton}
            onClick={handleOpenPromptModal}
          >
            Adicionar prompt
          </Button>
        </div>

        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell className={classes.headerText}>TÍTULO</TableCell>
              <TableCell className={classes.headerText}>SETOR/FILA</TableCell>
              <TableCell className={classes.headerText}>MÁXIMO DE TOKEN RESPOSTA</TableCell>
              <TableCell className={classes.headerText} align="center">
                AÇÕES
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prompts.map((prompt) => (
              <TableRow key={prompt.id}>
                <TableCell align="left">{prompt.name}</TableCell>
                <TableCell align="left">{prompt.queue.name}</TableCell>
                <TableCell align="left">{prompt.maxTokens}</TableCell>
                <TableCell align="center" className={classes.actionButtons}>
                  <Button
                    onClick={() => {
                      setSelectedPrompt(prompt);
                      handleOpenPromptModal();
                    }}
                    color="primary"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedPrompt(prompt);
                      setConfirmModalOpen(true);
                    }}
                    color="secondary"
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <PromptModal
          open={promptModalOpen}
          onClose={handleClosePromptModal}
          promptId={selectedPrompt?.id}
        />
        <ConfirmationModal
          open={confirmModalOpen}
          onClose={handleCloseConfirmationModal}
          onConfirm={() => handleDeletePrompt(selectedPrompt.id)}
          title={i18n.t("prompts.confirmation.title")}
          message={i18n.t("prompts.confirmation.message")}
        />
      </Paper>
    </>
  );
};

export default PromptTable;
