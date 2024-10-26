import React, { useState, useEffect, useReducer, useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import Board from 'react-trello';
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(4),
    marginTop: theme.spacing(10),
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
    boxShadow: "0 0 2px 0 rgba(0, 0, 0, 0.15)",
    borderRadius: "20px",
    backgroundColor: "rgba(252, 252, 252, 0.03)",
  },
  button: {
    background: "#34D3A3",
    border: "none",
    padding: "10px 12px",
    color: "black",
    fontWeight: "normal",
    borderRadius: "13px",
  },
  
}));

const Kanban = () => {
  const classes = useStyles();
  const history = useHistory();

  const [tags, setTags] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);


  const fetchTags = async () => {
    try {
      const response = await api.get("/tags/kanban");
      const fetchedTags = response.data.lista || []; 

      setTags(fetchedTags);

      // Fetch tickets after fetching tags
      await fetchTickets(jsonString);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const [file, setFile] = useState({
    lanes: []
  });


  const [tickets, setTickets] = useState([]);
  const { user } = useContext(AuthContext);
  const { profile, queues } = user;
  const jsonString = user.queues.map(queue => queue.UserQueue.queueId);

  const fetchTickets = async (jsonString) => {
    try {
      
      const { data } = await api.get("/ticket/kanban", {
        params: {
          queueIds: JSON.stringify(jsonString),
          teste: true
        }
      });
      setTickets(data.tickets);
    } catch (err) {
      console.log(err);
      setTickets([]);
    }
  };


  const popularCards = (jsonString) => {
    const filteredTickets = tickets.filter(ticket => ticket.tags.length === 0);

    const lanes = [
      {
        id: "lane0",
        title: i18n.t("Em aberto"),
        label: "1",
        cards: filteredTickets.map(ticket => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description: (
              <div>
                <p>
                  {ticket.contact.number}
                  <br />
                  {ticket.lastMessage}
                </p>
                <button 
                  className={classes.button} 
                  onClick={() => {
                    handleCardClick(ticket.uuid)
                  }}>
                    Ver Ticket
                </button>
              </div>
            ),
          title: ticket.contact.name,
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
        style: {backgroundColor: "rgba(252, 252, 252, 0.03)"},
      },
      {
        id: "lane1",
        title: "Em atendimento",
        label: "2",
        cards: [],
        style: {backgroundColor: "rgba(252, 252, 252, 0.03)"},
      },
      {
        id: "lane2",
        title: "Aguardando",
        label: "3",
        cards: [],
        style: {backgroundColor: "rgba(252, 252, 252, 0.03)"},
      },
      {
        id: "lane3",
        title: "Impedido",
        label: "4",
        cards: [],
        style: {backgroundColor: "rgba(252, 252, 252, 0.03)"},
      },
      {
        id: "lane4",
        title: "Finalizados",
        label: "5",
        cards: [],
        style: {backgroundColor: "rgba(252, 252, 252, 0.03)"},
      },
      ...tags.map(tag => {
        const filteredTickets = tickets.filter(ticket => {
          const tagIds = ticket.tags.map(tag => tag.id);
          return tagIds.includes(tag.id);
        });

        return {
          id: tag.id.toString(),
          title: tag.name,
          label: tag.id.toString(),
          cards: filteredTickets.map(ticket => ({
            id: ticket.id.toString(),
            label: "Ticket nº " + ticket.id.toString(),
            description: (
              <div>
                <p>
                  {ticket.contact.number}
                  <br />
                  {ticket.lastMessage}
                </p>
                <button 
                  className={classes.button} 
                  onClick={() => {
                    
                    handleCardClick(ticket.uuid)
                  }}>
                    Ver Ticket
                </button>
              </div>
            ),
            title: ticket.contact.name,
            draggable: true,
            href: "/tickets/" + ticket.uuid,          
          })),
          style: { color: tag.color, backgroundColor: "rgba(252, 252, 252, 0.03)"},
        };
      }),
    ];

    setFile({ lanes });
  };

  const handleCardClick = (uuid) => {  
    //console.log("Clicked on card with UUID:", uuid);
    history.push('/tickets/' + uuid);
  };

  useEffect(() => {
    popularCards(jsonString);
}, [tags, tickets, reloadData]);

  const handleCardMove = async (cardId, sourceLaneId, targetLaneId) => {
    try {
        
          await api.delete(`/ticket-tags/${targetLaneId}`);
        toast.success('Ticket Tag Removido!');
          await api.put(`/ticket-tags/${targetLaneId}/${sourceLaneId}`);
        toast.success('Ticket Tag Adicionado com Sucesso!');

    } catch (err) {
      console.log(err);
    }
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    margin: '10px 0',
    boxShadow: '0px 4px 16px #eae2fd',
  };

  return (
    <div className={classes.root}>
      <Board 
		data={file} 
		onCardMoveAcrossLanes={handleCardMove}
		style={{backgroundColor: 'rgba(252, 252, 252, 0.03)'}}
    cardStyle={cardStyle}
    />
    </div>
  );
};


export default Kanban;
