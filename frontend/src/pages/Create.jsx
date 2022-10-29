import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import CryptoJS from "crypto-js";

import { CREATE_NOTE_URL } from "../constants/api";
import authConfig from "../util/authConfig";

export default function Create() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    password: "",
  });
  const { title, content, password } = formData;

  const [isLoading, setIsLoading] = useState();
  const [error, setError] = useState();
  const [message, setMessage] = useState("");

  async function createNote() {
    setIsLoading(true);
    setError(null);
    setMessage("");
    try {
      await axios.post(
        CREATE_NOTE_URL,
        {
          title,
          content: CryptoJS.AES.encrypt(
            JSON.stringify(content),
            password
          ).toString(),
        },
        authConfig(user?.token)
      );
      setMessage("Note saved");
    } catch (e) {
      setError(e.response.data.error);
    }
    setIsLoading(false);
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createNote();
  };

  const handleReset = (e) => {
    setFormData({ title: "", content: "", password: "" });
  };

  return (
    <main>
      <h1>Create a Note</h1>

      <form onSubmit={handleSubmit} onReset={handleReset}>
        <fieldset>
          <legend>Note:</legend>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            placeholder="Title"
            onChange={onChange}
          />
          <label htmlFor="content">Content</label>
          <textarea
            type="text"
            name="content"
            id="content"
            value={content}
            placeholder="Content"
            rows={6}
            onChange={onChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder="Password"
            onChange={onChange}
          />
          <p style={{ color: "red" }}>{error ? error.message : null}</p>
          <p style={{ color: "green" }}>{message ? message : null}</p>
          <input
            type="submit"
            value={isLoading ? "Loading..." : "Save"}
            disabled={isLoading}
          />
          &nbsp;
          <input type="reset" value="Reset" />
        </fieldset>
      </form>
    </main>
  );
}
