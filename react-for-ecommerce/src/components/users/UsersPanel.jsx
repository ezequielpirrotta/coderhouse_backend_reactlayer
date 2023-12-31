import React from "react";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import Error from "../errors_&_timeout/Error";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function UsersPanel () {
    const {user, getUsers, clearUsers, deleteUser} = useContext(UserContext)
    const [allUsers, setAllUsers] = useState(null)
    useEffect(()=> {
        if(user.role==="admin"){
            getUsers().then( async (users) => { 
                setAllUsers(users);
            })
        }
    },[user,getUsers])
    return(
        <>
        {
            user.role==="admin"?
            allUsers?
                <div className="container">
                    <div className="row justify-content-center">

                        <ul className="list-group col-8 container">
                            {
                                allUsers.map(otherUser => {
                                    if(user.username === otherUser.username){
                                        return(
                                            null
                                        )
                                    }
                                    else {
                                        return(
                                            <li key={otherUser.username} className="list-group-item row">
                                                <div className="col">

                                                    <div className="d-flex w-100 justify-content-between">
                                                        <h5 className="mb-1"><b>{otherUser.name}</b>
                                                            <span className={`m-2 badge rounded-pill ${otherUser.role==="user"?'bg-success':user.role==="premium"?'bg-warning text-dark':"bg-danger"}`}>{otherUser.role}</span>
                                                        </h5>
                                                        <small>{otherUser.last_connection}</small>
                                                    </div>
                                                    <p className="mb-1"><b>Mail:</b> {otherUser.username}</p>
                                                </div>
                                                <div className="col d-flex justify-content-end">
                                                    <Link className=" btn btn-danger p-2" onClick={() =>deleteUser(otherUser.username)}>Eliminar</Link>
                                                </div>
                                            </li>
                                        )
                                    }
                                })
                            }
                        </ul>
                        <div className="col-2 justify-content-center align-self-center ">
                            <Link className=" btn btn-danger p-2" onClick={() =>clearUsers()}>Limpiar usuarios</Link>
                        </div>
                    </div>
                </div>
                :
                <Error status={"waiting"} customMessage={"Espera mientras cargamos los usuarios..."}></Error>
            :
            <Error status={"empty"} customMessage={"No tienes permiso para acceder a esta vista."}></Error>                   
        }
        </>
    )
}
export default UsersPanel;