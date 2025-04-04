import {
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDrop,
} from "../../../src/app/components/DragAndDrop";

describe("Drag and Drop Functions", () => {
  let mockSetTickets;
  let mockUpdateTicket;
  let mockEvent;

  beforeEach(() => {
    mockSetTickets = jest.fn();
    mockUpdateTicket = jest.fn();
    mockEvent = {
      preventDefault: jest.fn(),
      dataTransfer: {
        setData: jest.fn(),
        getData: jest.fn(),
      },
      target: {
        style: {
          opacity: 1,
        },
      },
    };
  });

  test("handleDragStart sets data and changes opacity", () => {
    const ticket = { id: 1 };

    handleDragStart(mockEvent, ticket);

    expect(mockEvent.dataTransfer.setData).toHaveBeenCalledWith(
      "ticketId",
      ticket.id
    );
    expect(mockEvent.target.style.opacity).toBe(0.5);
  });

  test("handleDragEnd resets opacity", () => {
    handleDragEnd(mockEvent);

    expect(mockEvent.target.style.opacity).toBe(1);
  });

  test("handleDragOver prevents default behavior", () => {
    handleDragOver(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  test("handleDrop updates ticket status and calls updateTicket", async () => {
    const ticket = { id: 1, status: "new" };
    const tickets = [ticket];
    const status = "in-progress";

    mockEvent.dataTransfer.getData.mockReturnValue(ticket.id.toString());

    await handleDrop(
      mockEvent,
      status,
      tickets,
      mockSetTickets,
      mockUpdateTicket
    );

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockUpdateTicket).toHaveBeenCalledWith(ticket.id, { ...ticket });
    expect(mockSetTickets).toHaveBeenCalledWith([
      { ...ticket, status: "in-progress" },
    ]);
  });

  test("handleDrop does not update if ticket is not found", async () => {
    const tickets = [{ id: 1, status: "new" }];
    const status = "in-progress";

    mockEvent.dataTransfer.getData.mockReturnValue("2"); // Different ticket id

    await handleDrop(
      mockEvent,
      status,
      tickets,
      mockSetTickets,
      mockUpdateTicket
    );

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockUpdateTicket).not.toHaveBeenCalled();
    expect(mockSetTickets).not.toHaveBeenCalled();
  });
});
