import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  contactsHeader: {
    display: "flex",
    alignItems: "center",
    padding: "16px 6px", 
    backgroundColor: '#F8F8FF', 
    boxShadow: theme.shadows[1], 
  },
}));

const MainHeader = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.contactsHeader}>{children}</div>;
};

export default MainHeader;
