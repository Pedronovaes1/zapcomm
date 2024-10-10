import React, { useState, useEffect, useCallback } from "react";
import { makeStyles, Paper, Typography, Modal, IconButton } from "@material-ui/core";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import useHelps from "../../hooks/useHelps";

const useStyles = makeStyles(theme => ({
  mainPaperContainer: {
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 200px)',
    padding: theme.spacing(2),
    backgroundColor: '#F8F8FF', 
  },
  mainPaper: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: theme.spacing(3),
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  helpPaper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(3),
    boxShadow: theme.shadows[3],
    borderRadius: theme.spacing(1),
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: `0 0 12px ${theme.palette.primary.main}`,
    },
  },
  helpIcon: {
    fontSize: '3rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
  },
  helpTitle: {
    fontWeight: 600,
    textAlign: 'center',
    marginBottom: theme.spacing(1),
  },
  helpDescription: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
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
  const [records, setRecords] = useState([]);
  const { list } = useHelps(); 
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const helps = await list();
      setRecords(helps);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openVideoModal = (video) => {
    setSelectedVideo(video);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  const handleModalClose = useCallback((event) => {
    if (event.key === "Escape") {
      closeVideoModal();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleModalClose);
    return () => {
      document.removeEventListener("keydown", handleModalClose);
    };
  }, [handleModalClose]);

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
              style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
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
      <div className={classes.mainPaperContainer}>
        <div className={classes.mainPaper}>
          {records.length ? records.map((record, key) => (
            <Paper
              key={key}
              className={classes.helpPaper}
              onClick={() => openVideoModal(record.video)}
            >
              <div className={classes.helpIcon}>
                <IconButton>{/* Ícone aqui */}</IconButton>
              </div>
              
              <Typography variant="h6" className={classes.helpTitle}>
                {record.title}
              </Typography>
              
              <Typography variant="body2" className={classes.helpDescription}>
                {record.description}
              </Typography>
            </Paper>
          )) : null}
        </div>
      </div>
    );
  };

  return (
    <MainContainer>
      <MainHeader>
        <Title>{i18n.t("helps.title")} ({records.length})</Title>
        <MainHeaderButtonsWrapper></MainHeaderButtonsWrapper>
      </MainHeader>
      <div className={classes.mainPaper}>
        {renderHelps()}
      </div>
      {renderVideoModal()}
    </MainContainer>
  );
};

export default Helps;
