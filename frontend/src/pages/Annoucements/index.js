import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";


import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import AnnouncementModal from "../../components/AnnouncementModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";
const useStyles = makeStyles((theme) => ({
  
  mainPaper: {
    margin: "40px auto",
    padding: theme.spacing(2),
    width: "95%",
    height: "100%",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  headerText: {
    fontWeight: "bold",
    color: "#333",
    alignItems:  'left',
    gap: '10px'


  },
  title: { 
    fontSize: "24px",    
    marginBottom: theme.spacing(3),
    width: "50%",   
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
    flex: 0.5,
    marginRight: theme.spacing(2),
    width: "50px",
  },
  addButton: {
    backgroundColor: "#34D3A3",
    color: "",
    "&:hover": {
      backgroundColor: "#00a084",
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
  titulo: {
    fontWeight: "bold",
    color: "#333",
    margin: '10px auto',
    paddingRight: "200px"  
  },
  topolinha: {
    paddingRight: "600px",
    width: '200px' 
  }

}));

const reducer = (state, action) => {
  if (action.type === "LOAD_INFORMATIVOS") {
    const informativos = action.payload;
    const newInformativos = [];

    informativos.forEach((informativo) => {
      const informativoIndex = state.findIndex((i) => i.id === informativo.id);
      if (informativoIndex !== -1) {
        state[informativoIndex] = informativo;
      } else {
        newInformativos.push(informativo);
      }
    });

    return [...state, ...newInformativos];
  }

  if (action.type === "UPDATE_INFORMATIVOS") {
    const informativo = action.payload;
    const informativoIndex = state.findIndex((i) => i.id === informativo.id);

    if (informativoIndex !== -1) {
      state[informativoIndex] = informativo;
      return [...state];
    } else {
      return [informativo, ...state];
    }
  }

  if (action.type === "DELETE_INFORMATIVO") {
    const informativoId = action.payload;
    const informativoIndex = state.findIndex((i) => i.id === informativoId);
    if (informativoIndex !== -1) {
      state.splice(informativoIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const InformativoTable = () => {
  const classes = useStyles();
  const [informativos, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);
  const [informativoModalOpen, setInformativoModalOpen] = useState(false);
  const [selectedInformativo, setSelectedInformativo] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const companyId = user.companyId;
  const socketManager = useContext(SocketContext);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data } = await api.get("/informativo");
        dispatch({ type: "LOAD_INFORMATIVOS", payload: data.informativos });
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

    socket.on(`company-${companyId}-informativo`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_INFORMATIVOS", payload: data.informativo });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_INFORMATIVO", payload: data.informativoId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [companyId, socketManager]);

  const handleOpenInformativoModal = () => {
    setInformativoModalOpen(true);
    setSelectedInformativo(null);
  };

  const handleCloseInformativoModal = () => {
    setInformativoModalOpen(false);
    setSelectedInformativo(null);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedInformativo(null);
  };

  const handleDeleteInformativo = async (informativoId) => {
    try {
      const { data } = await api.delete(`/informativo/${informativoId}`);
      toast.info(i18n.t(data.message));
    } catch (err) {
      toastError(err);
    }
    setSelectedInformativo(null);
  };

  return (
    <>
      <Title><h1 className={classes.title}>{i18n.t("Informativo")} ({informativos.length})</h1></Title>
      <Paper className={classes.mainPaper}>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.inputField}
            label="Novo Informativo"
            variant="outlined"
            size="small"
          />
          <Button
            variant="contained"
            className={classes.addButton}
            onClick={handleOpenInformativoModal}
          >
            Adicionar Informativo
          </Button>
        </div>

        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
            <TableHead>
              <TableCell className={classes.titulo}>TÍTULO</TableCell>
              <TableCell className={classes.titulo}>PRIORIDADE</TableCell>
              <TableCell className={classes.titulo}>ARQUIVO</TableCell>
              <TableCell className={classes.titulo}>STATUS</TableCell>
              <TableCell className={classes.topolinha}>       </TableCell>

            </TableHead>
              <TableCell className={classes.headerText}>
                AÇÕES
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {informativos.map((informativo) => (
              <TableRow key={informativo.id}>
                <TableCell align="left">{informativo.name}</TableCell>
                <TableCell align="left">{informativo.queue.name}</TableCell>
                <TableCell align="left">{informativo.maxTokens}</TableCell>
                <TableCell align="center" className={classes.actionButtons}>
                  <Button
                    onClick={() => {
                      setSelectedInformativo(informativo);
                      handleOpenInformativoModal();
                    }}
                    color="primary"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedInformativo(informativo);
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

        <AnnouncementModal
          open={informativoModalOpen}
          onClose={handleCloseInformativoModal}
          promptId={selectedInformativo?.id}
        />
        <ConfirmationModal
          open={confirmModalOpen}
          onClose={handleCloseConfirmationModal}
          onConfirm={() => handleDeleteInformativo(selectedInformativo.id)}
          title={i18n.t("informativos.confirmation.title")}
          message={i18n.t("informativos.confirmation.message")}
        />
      </Paper>
    </>
  );
};

export default InformativoTable;
