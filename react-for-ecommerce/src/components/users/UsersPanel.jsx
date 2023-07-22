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
    },[user])
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
                                allUsers.map(user => {
                                    return(
                                        <li className="list-group-item">
                                            <div className="d-flex w-100 justify-content-between">
                                                <h5 className="mb-1">{user.name}</h5>
                                                <small>3 days ago</small>
                                            </div>
                                            <p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                                            <small>Donec id elit non mi porta.</small>
                                        </li>
                                    )
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