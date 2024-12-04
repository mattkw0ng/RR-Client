
function ConflictEditor({ event }) {
  useEffect(() => {
    for (room in event.rooms) {
      axios.get('/getRoomEvents')
      // now i have a list of events 
      const rooms =
        [
          {
            roomName: "Sanctuary",
            approvedEvents: [{ eventId: 1, timeRange: [x, y] }, { eventId: 2, timeRange: [x, y] }]
          },
          {
            roomName: "Chapel",
            approvedEvents: [{ eventId: 3, timeRange: [x, y] }, { eventId: 4, timeRange: [x, y] }]
          }
        ]

    }

  })

  return (

    <div>
      {rooms.map((room) => {
        <ConflictTimeline approvedEvents={room.approvedEvents} pendingEvent={event} />
      })}
    </div>

  )
}
