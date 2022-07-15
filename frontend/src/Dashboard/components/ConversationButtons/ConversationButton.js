import React from "react";

const ConversationButton = (props) => {
  const { onClickHandler, backgroundColor } = props;

  const styles = {
    button: {
      width: "50px",
      height: "50px",
      borderRadius: "40px",
      border: "2px solid #e6e5e8",
      textDecoration: "none",
      backgroundColor: backgroundColor ? backgroundColor : "#282C34",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "10px",
      boxShadow: "none",
      borderImage: "none",
      borderStyle: "none",
      borderWidth: "0px",
      outline: "none",
      cursor: "pointer",
    },
  };

  return (
    <button style={styles.button} onClick={onClickHandler}>
      {props.children}
    </button>
  );
};

export default ConversationButton;
