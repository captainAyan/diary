import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import CryptoJS from "crypto-js";

import { EDIT_NOTE_URL, GET_NOTE_URL } from "../constants/api";
import authConfig from "../util/authConfig";

export default function View() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [data, setData] = useState();
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      axios
        .get(GET_NOTE_URL + id, authConfig(user?.token))
        .then(({ data }) => {
          setIsLoading(false);
          setData(data);
        })
        .catch((e) => {
          setIsLoading(false);
          setIsError(true);
        });
    }
  }, [user, navigate, id]);

  return (
    <main>
      <div>{isLoading ? <h2>Loading...</h2> : null}</div>
      <div>{isError ? <h2>Not found</h2> : null}</div>
      <p />
      <input
        type="password"
        placeholder="Password"
        disabled={editMode}
        onChange={(e) => {
          try {
            setPassword(e.target.value);

            let content = CryptoJS.AES.decrypt(
              data?.content || "",
              e.target.value
            )
              .toString(CryptoJS.enc.Utf8)
              .slice(1, -1);

            setContent(content);
          } catch (e) {
            setContent(null);
            setEditMode(false);
          }
        }}
      />

      <h1>{data?.title}</h1>

      {content ? (
        <button
          onClick={() => (editMode ? setEditMode(false) : setEditMode(true))}
        >
          {editMode ? "Read Mode" : "Edit Mode"}
        </button>
      ) : null}

      {editMode ? (
        <>
          <textarea
            type="text"
            name="content"
            id="content"
            value={content}
            placeholder="Content"
            style={{ resize: "vertical" }}
            rows={6}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            disabled={isLoading}
            onClick={() => {
              setIsLoading(true);
              axios
                .put(
                  EDIT_NOTE_URL + id,
                  {
                    title: data?.title,
                    content: CryptoJS.AES.encrypt(
                      JSON.stringify(content),
                      password
                    ).toString(),
                  },
                  authConfig(user?.token)
                )
                .then(({ data }) => {
                  setIsLoading(false);
                  setData(data);
                })
                .catch((e) => {
                  setIsLoading(false);
                  setIsError(true);
                });
            }}
          >
            {isLoading ? "Loading..." : "Save"}
          </button>
        </>
      ) : (
        <p
          style={{
            width: "100%",
            whiteSpace: "pre-line",
            textAlign: "justify",
          }}
        >
          {content || "Invalid password"}
        </p>
      )}
    </main>
  );
}
