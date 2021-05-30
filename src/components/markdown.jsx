import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { db } from "../firebase";

const Markdown = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState([]);
  const [editM, setEditm] = useState(null);
  const [idusuario, setIdusuario] = useState("");

  /* Function to create a new file */

  const newFile = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("El titulo no puede estar vacio");
      return;
    }
    const file = {
      tile: title,
      body: body,
    };
    try {
      const data = await db.collection("agenda").add(file);
      const { docs } = await db.collection("agenda").get();
      const nuevoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
      setFiles(nuevoArray);
    } catch (e) {
      console.log(e);
    }
    setTitle("");
    setBody("");
  };
  /* useEffect to get all tle files created*/
  useEffect(() => {
    const getFiles = async () => {
      const { docs } = await db.collection("agenda").get();
      const nuevoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
      setFiles(nuevoArray);
    };
    getFiles();
  }, []);
  /* editMode set the editm variable to true to show the "Edit" and "delete" buttons, and get the
   database specific document by id to save edit, also pass file id to variable userid to be
   used by updateFile and deleteFile  */
  const editMode = async (id) => {
    try {
      const data = await db.collection("agenda").doc(id).get();
      const { tile, body } = data.data();
      setTitle(tile);
      setBody(body);
      setIdusuario(id);
      setEditm(true);
    } catch (e) {
      console.log(e);
    }
  };
  /* updateFile allows updating the fields title and body with the id set in editMode */
  const updateFile = async (e) => {
    e.preventDefault();

    const fileupd = {
      tile: title,
      body: body,
    };
    try {
      await db.collection("agenda").doc(idusuario).set(fileupd);
      const { docs } = await db.collection("agenda").get();
      const nuevoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
      setFiles(nuevoArray);
    } catch (e) {
      console.log(e);
    }
    setTitle("");
    setBody("");
    setIdusuario("");
    setEditm(false);
  };
  /* deleteFile allows  delete a document with the id set in editMode*/
  const deleteFile = async (e) => {
    e.preventDefault();
    try {
      await db.collection("agenda").doc(idusuario).delete();

      const { docs } = await db.collection("agenda").get();
      const nuevoArray = docs.map((item) => ({ id: item.id, ...item.data() }));
      setFiles(nuevoArray);
    } catch (e) {
      console.log(e);
    }
    setTitle("");
    setBody("");
    setIdusuario("");
    setEditm(false);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-2 border bgcolor p-0">
          <h2 className="bg-light">Markdown Editor</h2>

          <form
            className="form-group mt-4"
            onSubmit={editM ? updateFile : newFile}
          >
            <input
              value={title}
              type="text"
              className="form-control mb-2"
              placeholder="Titulo del documento"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            {editM ? (
              <div>
                <input
                  type="submit"
                  value="Editar"
                  className="btn btn-dark btn-block m-auto"
                />
                <button
                  onClick={deleteFile}
                  className=" m-auto p-auto btn btn-danger btn-block"
                >
                  Eliminar
                </button>
              </div>
            ) : (
              <input
                type="submit"
                value="Crear"
                className="btn btn-dark btn-block"
              />
            )}
          </form>

          <div className="mt-4 list-group w-100">
            {files.length !== 0 ? (
              files.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="list-group-item list-group-item-action  h-50
                  "
                  onClick={(id) => editMode(item.id)}
                >
                  {item.tile}
                </button>
              ))
            ) : (
              <span></span>
            )}
          </div>
        </div>
        <div className="col-4 border">
          <textarea
            className="markdown__container w-100"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>
        <div className="col-4 border">
          <ReactMarkdown
            children={body}
            className="markdown__preview"
          ></ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default Markdown;
