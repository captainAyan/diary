import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import { EDIT_NOTE_URL, GET_NOTE_URL } from "../constants/api";
import authConfig from "../util/authConfig";
import { decrypt, encrypt } from "../util/crypto";

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
          setData(data);
          setContent(decrypt(data?.content || "", password));
        })
        .catch((e) => {
          setIsError(true);
        })
        .finally(() => {
          setIsLoading(false);
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
            setContent(decrypt(data?.content || "", e.target.value));
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
                    content: encrypt(content, password),
                  },
                  authConfig(user?.token)
                )
                .then(({ data }) => {
                  setData(data);
                })
                .catch((e) => {
                  setIsError(true);
                })
                .finally(() => {
                  setIsLoading(false);
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
