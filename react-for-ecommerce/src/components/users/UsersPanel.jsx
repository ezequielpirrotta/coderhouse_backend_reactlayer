import React from "react";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import Error from "../errors_&_timeout/Error";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function UsersPanel () {
    const {user, getUsers, clearUsers} = useContext(UserContext)
    const [allUsers, setAllUsers] = useState(null)
    useEffect(()=> {
        if(user.role==="admin"){
            getUsers().then( async (users) => { 
                setAllUsers(users);
            })
        }
    },[user,getUsers])
    console.log(allUsers)
    return(
        <>
        {
            user.role==="admin"?
            allUsers?
                <div className="container">
                    <div className="row justify-content-center">

                        <ul className="list-group col-8">
                            {
                                allUsers.map(otherUser => {
                                    if(user.username === otherUser.username){
                                        return(
                                            null
                                        )
                                    }
                                    else {
                                        console.log(otherUser)
                                        return(
                                            <li key={otherUser.username} className="list-group-item">
                                                <div className="d-flex w-100 justify-content-between">
                                                    <h5 className="mb-1"><b>{otherUser.name}</b>
                                                        <span className={`m-2 badge ${otherUser.role==="user"?'bg-success':user.role==="premium"?'bg-warning':"bg-danger"}`}>{otherUser.role}</span>
                                                    </h5>
                                                    <small>{otherUser.last_connection}</small>
                                                </div>
                                                <p className="mb-1"><b>Mail:</b> {otherUser.username}</p>
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