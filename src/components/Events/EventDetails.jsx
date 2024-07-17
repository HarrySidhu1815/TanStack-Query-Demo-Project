import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

import Header from "../Header.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteEvent, fetchEvent, queryClient } from "../../utils/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useState } from "react";
import Modal from "../UI/Modal.jsx";

export default function EventDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isError, isPending, error } = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ id: params.id, signal }),
  });

  const {
    mutate,
    isPending: deletePending,
    isError: deleteIsError,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["events"],
        refetchType: "none",
      });
      navigate("/events");
    },
  });
  function handleStartDelete() {
    setIsDeleting(true);
  }
  function handlStopDelete() {
    setIsDeleting(false);
  }

  function handledelete() {
    mutate({ id: params.id });
  }

  let content;

  if (isPending) {
    content = (
      <div id="event-details-content" className="center">
        <p>Fetching the data...</p>
      </div>
    );
  }
  if (isError) {
    content = (
      <div id="events-details-content" className="center">
        <ErrorBlock
          title={"Failed to fetch the event details"}
          message={error.info?.message || "Please try again!"}
        />
      </div>
    );
  }

  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt="" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>
                {formattedDate} @ {data.time}
              </time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      {isDeleting && (
        <Modal onClose={handlStopDelete}>
          <>
            <h2>Are you sure?</h2>
            <p>Do you really want to delete it? This step cannot be undone.</p>
            {deletePending ? (
              <p>Submitting Delete Request</p>
            ) : (
              <div className="form-actions">
                <button onClick={handlStopDelete} className="button-text">
                  Cancel
                </button>
                <button onClick={handledelete} className="button">
                  Delete
                </button>
              </div>
            )}
            {deleteIsError && (
              <ErrorBlock
                title={"Failed to Delete the event"}
                message={deleteError.info?.message || "Please try again"}
              />
            )}
          </>
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">{content}</article>
    </>
  );
}
