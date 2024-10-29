import React, { useState } from "react";
import { makeStyles, Paper, Typography, IconButton, InputBase, Modal } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import AccessibilityIcon from '@material-ui/icons/Accessibility';
import MessageIcon from '@material-ui/icons/Message';
import LockIcon from '@material-ui/icons/Lock';
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";

const useStyles = makeStyles(theme => ({
  mainPaperContainer: {
    overflow: 'auto', 
    maxHeight: 'calc(100vh - 200px)',
    padding: theme.spacing(2),
    backgroundColor: '#F8F8FF',
    position: 'relative', 
    '&::-webkit-scrollbar': {
      display: 'none', 
    },
    scrollbarWidth: 'none', 

  mainPaper: {
    width: '100%',
    padding: theme.spacing(2),
    backgroundColor: '#fff',
    borderRadius: theme.spacing(2),
    boxShadow: theme.shadows[3],
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(4),
  },
  searchInput: {
    padding: theme.spacing(1, 2),
    border: '1px solid #ccc',
    borderRadius: theme.spacing(1),
    width: '100%',
    maxWidth: '500px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchIcon: {
    marginRight: theme.spacing(1),
  },
  helpGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: theme.spacing(3),
  },
  helpPaper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: theme.spacing(3),
    boxShadow: theme.shadows[0],
    borderRadius: theme.spacing(1),
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: `0 0 12px ${theme.palette.primary.main}`,
    },
  },
  helpIcon: {
    fontSize: '3rem',
    color: theme.palette.primary.main,
    marginRight: theme.spacing(2),
  },
  helpContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  helpTitle: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  helpDescription: {
    color: theme.palette.text.secondary,
  },
  linkText: {
    color: theme.palette.primary.main,
    fontWeight: 600,
    marginTop: theme.spacing(1),
    cursor: 'pointer',
  },
  videoModal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  videoModalContent: {
    position: 'relative',
    width: '80%',
    height: '80%',
    backgroundColor: '#fff',
    borderRadius: theme.spacing(1),
    boxShadow: theme.shadows[5],
  },
}));

const Helps = () => {
  const classes = useStyles();

  const [selectedVideo, setSelectedVideo] = useState(null);

  const helpsData = [
    {
      id: 1,
      title: "Como utilizar o Respostas Rápidas",
      description: "Aprenda a usar as respostas rápidas para melhorar sua comunicação.",
      icon: <MessageIcon className={classes.helpIcon} />,
      video:"",
    },
    {
      id: 2,
      title: "Acessibilidade",
      description: "Saiba como garantir que seu sistema seja acessível para todos.",
      icon: <AccessibilityIcon className={classes.helpIcon} />,
      video:"",
    },
    {
      id: 3,
      title: "Como utilizar o Respostas Rápidas",
      description: "Aprenda a usar as respostas rápidas para melhorar sua comunicação.",
      icon: <LockIcon className={classes.helpIcon} />,
      video:"",
    },
    {
      id: 4,
      title: "Como utilizar o Respostas Rápidas",
      description: "Aprenda a usar as respostas rápidas para melhorar sua comunicação.",
      icon: <LockIcon className={classes.helpIcon} />,
    },
    {
      id: 5,
      title: "Como utilizar o Respostas Rápidas",
      description: "Aprenda a usar as respostas rápidas para melhorar sua comunicação.",
      icon: <LockIcon className={classes.helpIcon} />,
      video:"",
    },
    {
      id: 6,
      title: "Como utilizar o Respostas Rápidas",
      description: "Aprenda a usar as respostas rápidas para melhorar sua comunicação.",
      icon: <LockIcon className={classes.helpIcon} />,
      video:"",
    },
  ];

  const openVideoModal = (videoId) => {
    setSelectedVideo(videoId);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const renderVideoModal = () => {
    return (
      <Modal
        open={Boolean(selectedVideo)}
        onClose={closeVideoModal}
        className={classes.videoModal}
      >
        <div className={classes.videoModalContent}>
          {selectedVideo && (
            <iframe
              style={{ width: "100%", height: "100%" }}
              src={`https://www.youtube.com/embed/${selectedVideo}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </Modal>
    );
  };

  const renderHelps = () => {
    return (
      <div className={classes.helpGrid}>
        {helpsData.map((help) => (
          <Paper key={help.id} className={classes.helpPaper} onClick={() => openVideoModal(help.video)}>
            <div className={classes.helpIcon}>
              {help.icon}
            </div>
            <div className={classes.helpContent}>
              <Typography variant="h6" className={classes.helpTitle}>
                {help.title}
              </Typography>
              <Typography variant="body2" className={classes.helpDescription}>
                {help.description}
              </Typography>
              <Typography variant="body2" className={classes.linkText}>
                mais sobre
              </Typography>
            </div>
          </Paper>
        ))}
      </div>
    );
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>{i18n.t("helps.title")} ({helpsData.length})</Title>
        <MainHeaderButtonsWrapper></MainHeaderButtonsWrapper>
      </MainHeader>
      <div className={classes.mainPaperContainer}>
        <div className={classes.mainPaper}>
          <div className={classes.searchContainer}>
            <div className={classes.searchInput}>
              <SearchIcon className={classes.searchIcon} />
              <InputBase placeholder="Como posso te ajudar?" fullWidth />
            </div>
          </div>
          {renderHelps()}
        </div>
      </div>
      {renderVideoModal()}
    </MainContainer>
  );
};

export default Helps;
