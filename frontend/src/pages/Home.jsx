import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import { DELETE_NOTE_URL, GET_ALL_NOTES_URL } from "../constants/api";
import authConfig from "../util/authConfig";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function getNotes() {
    setIsLoading(true);
    const { data } = await axios.get(GET_ALL_NOTES_URL, authConfig(user.token));
    setData(data);
    setIsLoading(false);
  }

  async function deleteNote(id) {
    await axios.delete(DELETE_NOTE_URL + id, authConfig(user?.token));
    const { data } = await axios.get(GET_ALL_NOTES_URL, authConfig(user.token));
    setData(data);
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      getNotes();
    }
  }, [user, navigate]);

  return (
    <main>
      <h1>
        Welcome,{" "}
        <span style={{ textTransform: "capitalize" }}>{user?.firstName}</span>
      </h1>
      <div>{isLoading ? <h4>Loading...</h4> : null}</div>
      <ul>
        {data?.notes?.map((note) => {
          return (
            <li key={note.id}>
              <h2>{note.title}</h2>
              <Link to={`view/${note.id}`}>[View]</Link>
              <a href="#" onClick={() => deleteNote(note.id)}>
                [Delete]
              </a>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
