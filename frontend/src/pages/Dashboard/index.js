import React, { useContext, useState, useEffect } from "react";

import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";

import SpeedIcon from "@material-ui/icons/Speed";
import GroupIcon from "@material-ui/icons/Group";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PersonIcon from "@material-ui/icons/Person";
import CallIcon from "@material-ui/icons/Call";
import RecordVoiceOverIcon from "@material-ui/icons/RecordVoiceOver";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ForumIcon from "@material-ui/icons/Forum";
import FilterListIcon from "@material-ui/icons/FilterList";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from '@material-ui/icons/Send';
import MessageIcon from '@material-ui/icons/Message';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import TimerIcon from '@material-ui/icons/Timer';

import { makeStyles } from "@material-ui/core/styles";
import { grey, blue } from "@material-ui/core/colors";
import { toast } from "react-toastify";

import Chart from "./Chart";
import ButtonWithSpinner from "../../components/ButtonWithSpinner";

import CardCounter from "../../components/Dashboard/CardCounter";
import TableAttendantsStatus from "../../components/Dashboard/TableAttendantsStatus";
import { isArray } from "lodash";

import { AuthContext } from "../../context/Auth/AuthContext";

import useDashboard from "../../hooks/useDashboard";
import useTickets from "../../hooks/useTickets";
import useUsers from "../../hooks/useUsers";
import useContacts from "../../hooks/useContacts";
import useMessages from "../../hooks/useMessages";
import { ChatsUser } from "./ChartsUser"

import Filters from "./Filters";
import { isEmpty } from "lodash";
import moment from "moment";
import { ChartsDate } from "./ChartsDate";
import Box from "@material-ui/core/Box";
import VerticalLine from "../../components/VerticalLine/VerticalLine";
import Intersect from "../../assets/Intersect.png";

import api from '../../services/api';
import { alignProperty } from "@mui/material/styles/cssUtils";
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import jsPDF from 'jspdf';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(10),
    paddingBottom: theme.padding,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    height: 240,
    overflowY: "auto",
    ...theme.scrollbarStyles,
  },
  cardAvatar: {
    fontSize: "55px",
    color: grey[500],
    backgroundColor: "#ffffff",
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  cardTitle: {
    fontSize: "18px",
    color: blue[700],
  },
  cardSubtitle: {
    color: grey[600],
    fontSize: "14px",
  },
  alignRight: {
    textAlign: "center",
    marginTop: "40px",
    marginBottom: "40px",
  },
  fullWidth: {
    width: "300px",
    height: "80px",
    textAlign: "start",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "61px",
    marginTop: "40px", 
    borderRadius: "20px",
    boxShadow: " 0px 0px 10px rgba(128, 144, 155, 0.2)",  
    backgroundColor: "#ffffff", 
    cursor: "pointer",
  },
  selectContainer: {
    width: "300px",
    height: "80px",
    textAlign: "left",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "61px",
    marginTop: "20px", 
    borderRadius: "20px",
    boxShadow: " 0px 0px 10px rgba(128, 144, 155, 0.2)",  
    backgroundColor: "#ffffff",
  },
  iframeDashboard: {
    width: "100%",
    height: "calc(100vh - 64px)",
    border: "none",
  },
  container: {
    paddingTop: theme.spacing(13),
    paddingBottom: theme.spacing(4),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 240,
  },
  customFixedHeightPaper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: 120,
  },
  customFixedHeightPaperLg: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
  },
  cards: {
    padding: theme.spacing(4),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    borderRadius: "20px",
    alignItems: "center",
    boxShadow: "0px 10px 30px rgba(138, 197, 62, 0.4);",
    //backgroundColor: "palette",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : "#34d3a3",
    color:  theme.palette.type === 'dark' ? theme.pallet.primary : "#000000",
  },
  noUnderline: {
    display: "flex", 
    margin: "20px", 
    alignItems: "center", 
    justifyContent: "space-between",
    "&:before": {
      borderBottom: "none", // Remove a linha antes do foco
    },
    "&:after": {
      borderBottom: "none", // Remove a linha após o foco
    },
  },
  cardsTempo:{
    width: "140px",
    height: "140px",
    borderRadius: "20px",
    backgroundColor: "rgba(52, 211, 163, 0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  GeralCard:{
    display: "flex", 
    flexDirection: "row",
    width: "100%",
    gap: "20px", 
    alignItems:"center",
    justifyContent: "center",
  },
  card5: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card6: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card7: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card8: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  card9: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
    height: "100%",
    //backgroundColor: theme.palette.primary.main,
    backgroundColor: theme.palette.type === 'dark' ? theme.palette.boxticket.main : theme.palette.primary.main,
    color: "#eee",
  },
  fixedHeightPaper2: {
    padding: theme.spacing(2),
    marginTop: "30px",
    display: "flex",
    overflow: "auto",
    alignItems: "center",
    flexDirection: "column",
    marginTop: "20px",
  },
  atendimento:{
    display: "flex", 
    flexDirection: "column", 
    paddingLeft: "20px",
    paddingRight: "20px",
    gap: "20px",
    width: "65%",
    [theme.breakpoints.down('sm')]: {
      width: "100%",
		},
    [theme.breakpoints.down('md')]: {
      width: "100%",
    },
    [theme.breakpoints.down('lg')]: {
      width: "100%",
    },
    [theme.breakpoints.down('xl')]: {
      width: "100%",
    },
  },
  graficos:{
    display: "flex", 
    flexDirection: "row",
    width: "100%",
    gap: "20px", 
    alignItems:"center",
    justifyContent: "center"
  },
  geral:{
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
  boxGeral:{
    marginLeft: "10px",
    gap:"60px",
    [theme.breakpoints.down('sm')]: {
      marginLeft: "40px",
      gap:"20px",
    },
  },
}));

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: '#000000',
  },
});

const Dashboard = () => {
  const classes = useStyles();
  const [counters, setCounters] = useState({});
  const [attendants, setAttendants] = useState([]);
  const [period, setPeriod] = useState(0);
  const [filterType, setFilterType] = useState(1);
  const [dateFrom, setDateFrom] = useState(moment("1", "D").format("YYYY-MM-DD"));
  const [dateTo, setDateTo] = useState(moment().format("YYYY-MM-DD"));
  const [loading, setLoading] = useState(false);
  const { find } = useDashboard();

  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  let now = `${year}-${month < 10 ? `0${month}` : `${month}`}-${date < 10 ? `0${date}` : `${date}`}`;

  const [showFilter, setShowFilter] = useState(false);
  const [queueTicket, setQueueTicket] = useState(false);

  const { user } = useContext(AuthContext);
  var userQueueIds = [];

  if (user.queues && user.queues.length > 0) {
    userQueueIds = user.queues.map((q) => q.id);
  }

  useEffect(() => {
    async function firstLoad() {
      await fetchData();
    }
    setTimeout(() => {
      firstLoad();
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
    async function handleChangePeriod(value) {
    setPeriod(value);
  }

  async function handleChangeFilterType(value) {
    setFilterType(value);
    if (value === 1) {
      setPeriod(0);
    } else {
      setDateFrom("");
      setDateTo("");
    }
  }

  async function fetchData() {
    setLoading(true);

    let params = {};

    if (period > 0) {
      params = {
        days: period,
      };
    }

    if (!isEmpty(dateFrom) && moment(dateFrom).isValid()) {
      params = {
        ...params,
        date_from: moment(dateFrom).format("YYYY-MM-DD"),
      };
    }

    if (!isEmpty(dateTo) && moment(dateTo).isValid()) {
      params = {
        ...params,
        date_to: moment(dateTo).format("YYYY-MM-DD"),
      };
    }

    if (Object.keys(params).length === 0) {
      toast.error("Parametrize o filtro");
      setLoading(false);
      return;
    }

    const data = await find(params);

    setCounters(data.counters);
    if (isArray(data.attendants)) {
      setAttendants(data.attendants);
    } else {
      setAttendants([]);
    }

    setLoading(false);
  }

  function formatTime(minutes) {
    return moment()
      .startOf("day")
      .add(minutes, "minutes")
      .format("HH[:]mm[]");
  }

  const GetUsers = () => {
    let count;
    let userOnline = 0;
    attendants.forEach(user => {
      if (user.online === true) {
        userOnline = userOnline + 1
      }
    })
    count = userOnline === 0 ? 0 : userOnline;
    return count;
  };
  
    const GetContacts = (all) => {
    let props = {};
    if (all) {
      props = {};
    }
    const { count } = useContacts(props);
    return count;
  };
  
    function renderFilters() {
    if (filterType === 1) {
      return (
        <>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Data Inicial"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className={classes.fullWidth}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: '14px',      
                  fontWeight: 'bold',      
                  color: "#333",       
                  transform: 'translate(10px, -15px)', 
                },
              }}
              InputProps={{
                disableUnderline: true, // Remove a linha inferior
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label= "Data Final"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className={classes.fullWidth}
              InputLabelProps={{
                shrink: true,
                style: {
                  fontSize: '14px',        // Define o tamanho da fonte
                  fontWeight: 'bold',      // Define a espessura da fonte
                  color: "#333",        // Define a cor do label
                  transform: 'translate(10px, -15px)', // Ajusta a posição vertical do label
                },
              }}
              InputProps={{
                disableUnderline: true, // Remove a linha inferior
              }}
            />
          </Grid>
        </>
      );
    } else {
      return (
        <Grid item xs={12} sm={6} md={4}>
          <FormControl className={classes.selectContainer}>
            <InputLabel id="period-selector-label"></InputLabel>
            <Select
              labelId="period-selector-label"
              id="period-selector"
              value={period}
              onChange={(e) => handleChangePeriod(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                disableUnderline: true, // Remove a linha inferior
              }}
              className={classes.noUnderline}
            >
              <MenuItem value={0}>Nenhum selecionado</MenuItem>
              <MenuItem value={3}>Últimos 3 dias</MenuItem>
              <MenuItem value={7}>Últimos 7 dias</MenuItem>
              <MenuItem value={15}>Últimos 15 dias</MenuItem>
              <MenuItem value={30}>Últimos 30 dias</MenuItem>
              <MenuItem value={60}>Últimos 60 dias</MenuItem>
              <MenuItem value={90}>Últimos 90 dias</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      );
    }
  }

  const generatePdf = (counters) => {
    const doc = new jsPDF();
  
    doc.setFontSize(20);
    doc.text('Dashboard PDF', 20, 20);
  
    doc.setFontSize(12);
    doc.text(`T.M de Conversa: ${formatTime(counters.avgSupportTime)}`, 20, 40);
    doc.text(`T.M de Espera: ${formatTime(counters.avgWaitTime)}`, 20, 50);
    doc.text(`Novos Contatos: ${counters.newContacts}`, 20, 60);
    doc.text(`Suporte Finalizado: ${counters.supportFinished}`, 20, 70);
    doc.text(`Suporte em Andamento: ${counters.supportHappening}`, 20, 80);
    doc.text(`Suporte Pendente: ${counters.supportPending}`, 20, 90);
  
    doc.save('dashboard.pdf');
  };

  return (
   
      <Container maxWidth="xl" className={classes.container}>
        <Grid container spacing={3} justifyContent="flex-end" className={classes.geral}>
          <Grid item xs={12} md={8} className={classes.atendimento}>  
            {/* CARDS */}  
            <Grid className={classes.GeralCard}>
              {/* EM ATENDIMENTO */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  className={classes.cards}
                  style={{ overflow: "hidden" }}
                  elevation={6}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={8}>
                      <Typography
                        component="h4"
                        variant="arial"
                        paragraph
                        style={{fontWeight: "bold"}}
                      >
                        Em Conversa
                      </Typography>
                      <Grid item>
                        <Typography
                          component="h1"
                          variant="h4"
                        >
                          {counters.supportHappening}
                        </Typography>
                      </Grid>
                  
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>            
              {/* AGUARDANDO */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  className={classes.cards}
                  style={{ overflow: "hidden" }}
                  elevation={6}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={8}>
                      <Typography
                        component="h4"
                        variant="arial"
                        paragraph
                        style={{fontWeight: "bold"}}
                      >
                        Aguardando
                      </Typography>
                      <Grid item>
                        <Typography
                          component="h1"
                          variant="h4"
                        >
                          {counters.supportPending}
                        </Typography>
                      </Grid>
                      
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>        

            {/*Cards e gráficos*/}
            <Grid className={classes.graficos}>
              {/* FINALIZADOS */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  className={classes.cards}
                  style={{ overflow: "hidden" }}
                  elevation={6}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={8}>
                      <Typography
                        component="h4"
                        variant="arial"
                        paragraph
                        style={{fontWeight: "bold"}}
                      >
                        Finalizados
                      </Typography>
                      <Grid item>
                        <Typography
                          component="h1"
                          variant="h4"
                        >
                          {counters.supportFinished}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* NOVOS CONTATOS */}
              <Grid item xs={12} sm={6} md={4}>
                <Paper
                  className={classes.cards}
                  style={{ overflow: "hidden" }}
                  elevation={6}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={8}>
                      <Typography
                        component="h4"
                        variant="arial"
                        paragraph
                        style={{fontWeight: "bold"}}
                      >
                        Novos Contatos
                      </Typography>
                      <Grid item>
                        <Typography
                          component="h1"
                          variant="h4"
                        >
                          {GetContacts(true)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>  
              </Grid>
              </Grid>
              {/* TOTAL DE ATENDIMENTOS POR USUARIO */}
              <Grid item xs={12} style={{marginTop: "30px"}}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Total de Conversas por Usuários
                </Typography>
                <Paper className={classes.fixedHeightPaper2}> 
                  <ChatsUser />
                </Paper>
              </Grid>

              {/* TOTAL DE ATENDIMENTOS */}
              <Grid item xs={12}>
                <Paper className={classes.fixedHeightPaper2}>
                  <ChartsDate />
                </Paper>
            </Grid>
            
          </Grid>

        <Grid  item xs={12} md={4} style={{ width: "100%" }}> 
            <Grid container direction="column" spacing={3} style={{ marginBottom: "30px", marginTop: "50px" }}>
              <Grid item> 
                <Typography
                  variant="h6"
                  style={{marginLeft: "60px"}}
                >
                  Estatísticas
                </Typography>
              </Grid>
              <Grid item>
                <Box display="flex" flexDirection="row" gap="20px" alignItems="center" justifyContent="center" className={classes.boxGeral}>
                {/* T.M. DE ATENDIMENTO */}
                <Grid item xs={12} sm={6} md={4} >
                  <Paper
                    className={classes.cardsTempo}
                    style={{ overflow: "hidden" }}
                    elevation={6}
                  >
                    <Grid container spacing={3} style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px"}}>
                      <Grid item xs={8}>
                        <Typography
                          component="h4"
                          variant="arial"
                          paragraph
                        >
                          T.M de Conversa
                        </Typography>
                        <Grid item>
                          <Typography
                            component="h5"
                            variant="h5"
                            style={{color: "#006ed3", fontWeight: "bold"}}
                          >
                            {formatTime(counters.avgSupportTime)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                {/* T.M. DE ESPERA */}
                <Grid item xs={12} sm={6} md={4}>
                  <Paper
                    className={classes.cardsTempo}
                    style={{ overflow: "hidden" }}
                    elevation={6}
                  >
                    <Grid container spacing={3} style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px"}}>
                      <Grid item xs={8}>
                        <Typography
                          component="h4"
                          variant="arial"
                          paragraph
                        >
                          T.M de Espera
                        </Typography>
                        <Grid item>
                          <Typography
                            component="h5"
                            variant="h5"
                            style={{color: "#006ed3", fontWeight: "bold"}}
                          >
                            {formatTime(counters.avgWaitTime)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                </Box>
              </Grid>
            </Grid>
		  
		      {/* FILTROS */}
          <Grid item xs={12} sm={6} md={4} style={{marginTop: "130px"}}>
            < Typography
              variant="h6"
              style={{marginLeft: "60px"}}
            >
                Filtros
            </Typography>
            <FormControl className={classes.selectContainer}>
              <InputLabel id="period-selector-label" ></InputLabel>
              <Select
                labelId="period-selector-label"
                value={filterType}
                onChange={(e) => handleChangeFilterType(e.target.value)}
                className={classes.noUnderline}
              >
                <MenuItem value={1}>Filtro por Data</MenuItem>
                <MenuItem value={2}>Filtro por Período</MenuItem>
              </Select>
            
            </FormControl>
          </Grid>

          {renderFilters()}

          {/* BOTAO FILTRAR */}
          <Grid item xs={12} className={classes.alignRight}>
            <ButtonWithSpinner
              loading={loading}
              onClick={() => fetchData()}
              variant="contained"
              color="primary"
            >
              Filtrar
            </ButtonWithSpinner>
          </Grid>

          {/* USUARIOS ONLINE */}
          <Grid item xs={12}>
            {attendants.length ? (
              <TableAttendantsStatus
                attendants={attendants}
                loading={loading}
              />
            ) : null}
          </Grid>
           {/* BOTÃO PARA GERAR PDF */}
           <Grid item xs={12} className={classes.alignRight}>
            <Button variant="contained" color="primary" onClick={generatePdf}>
              Baixar PDF
            </Button>
          </Grid>
        </Grid>


          {/* ATENDENTES ATIVOS */}
			  {/*<Grid item xs={12} sm={6} md={4}>
            <Paper
              className={classes.card6}
              style={{ overflow: "hidden" }}
              elevation={6}
            >
              <Grid container spacing={3}>
                <Grid item xs={8}>
                  <Typography
                    component="h3"
                    variant="h6"
                    paragraph
                  >
                    Conversas Ativas
                  </Typography>
                  <Grid item>
                    <Typography
                      component="h1"
                      variant="h4"
                    >
                      {GetUsers()}
                      <span
                        style={{ color: "#805753" }}
                      >
                        /{attendants.length}
                      </span>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <RecordVoiceOverIcon
                    style={{
                      fontSize: 100,
                      color: "#805753",
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
            </Grid>*/}
        </Grid>
      </Container >

  );
};

export default Dashboard;
