import React from "react";
import Tickets from "../components/Tickets";

const BacklogList = ({
  tickets,
  users,
  handleEditTicket,
  handleDeleteTicket,
}) => {
  return (
    <Tickets
      tickets={tickets}
      users={users}
      handleEditTicket={handleEditTicket}
      handleDeleteTicket={handleDeleteTicket}
    />
  );
};

export default BacklogList;
