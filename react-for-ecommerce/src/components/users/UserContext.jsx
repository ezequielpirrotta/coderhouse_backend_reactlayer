import React from "react";
import { useState, createContext } from "react";
import { useEffect } from "react";
import Swal from 'sweetalert2';


export const UserContext = createContext();

function UserContextProvider({children}) {
    const serverEndpoint = process.env.REACT_APP_SERVER_ENDPOINT
    const port = '3000';
    const server_port = '8080';
    const endpoint = 'http://localhost:';
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
   
    useEffect(() => {
        
        getUser()
        .then( async (userData) => { 
            setUser(userData);
            setLoading(false);
        })
        .catch((error) => {
            console.error('Error fetching user profile:', error);
            Swal.fire({
                title:"An error occurred while fetching the user profile.",
                icon:"error",
                text: error.message
            })
            setLoading(false);
        });
        
    })
    const getUser = async () => {
        const response = await fetch(serverEndpoint+'/api/sessions/current', {credentials: 'include'})
        let userData = await response.json();
        if(response.status === 401){
            userData = null
        }
        else {
            if(!Object.keys(user).length === 0 ){
                userData = null
            }
        }
        return userData;
    }
    const getUsers = async () => {
        const response = await fetch(serverEndpoint+'/api/users/', {credentials: 'include'})
        let userData = await response.json();
        if(response.status === 401){
            userData = null
        }
        else {
            if(!Object.keys(user).length === 0 ){
                userData = null
            }
        }
        return userData.payload;
    }
    const clearUsers = () => {
        Swal.fire({
            icon: "warning",
            title: 'Delete users',
            text: 'Esta acción eliminará a los usuarios que no hayan estado activos durante las últimas 48 hs\n Desea continuar?',
            confirmButtonText: 'Delete',
            focusConfirm: false,
        }).then((result) => {
            if(result.isConfirmed){
                let requestData = {
                    method:"DELETE",
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                    credentials: 'include'
                }
                const request = new Request(serverEndpoint+'/api/users/', requestData)
                fetch(request)
                .then( async (response) => {
                    
                    if (!response.ok) {
                        const error = await response.json()
                        if(error.status === "WRONG") {
                            Swal.fire({
                                icon: "error",
                                title: `Error eliminando producto`,
                                text: error.message
                            })
                        }
                        else if(error.code === "Unauthorized"){
                            Swal.fire({
                                title: `No tienes permisos para eliminar`,
                                icon: "error"
                            })
                        }
                    } 
                    else {
                        Swal.fire({
                            icon: "success",
                            title: `Usuarios depurados correctamente!`,
                            color: '#716add'
                        })
                    }
                })
            }
        })
    }
    const closeUserSession = async () => {
        Swal.fire({
            title: 'Are you sure you want to exit?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
        }).then( async (result) => {
            if (result.isConfirmed) {
                const result = await fetch(serverEndpoint+'/api/sessions/logout',{credentials: 'include'})
                .then((response)=>response.json())
                if(result.error){
                    Swal.fire({
                        title:"Error",
                        icon:"error",
                        text: result.message
                    })
                }
                else {
                    window.location.replace('/');
                }
            }
        })
    }
    const uploadDocs = async () => {
        Swal.fire({
            title:"Que documentación quieres subir?",
            icon:"info",
            html:  `
                <div>
                    <label for="image">Seleccionar archivo:</label>
                    <input name="docs" type="file" id="image" class="swal2-input" accept: "image/*" multiple>
                </div>
            `,
            confirmButtonText: "Upload",
            showConfirmButton: true,
            allowOutsideClick: false,
            showCloseButton: true,
            preConfirm: () => {
                const files = Swal.getPopup().querySelector('#image').files
                return { files: files}
            }
        }).then(async (result) => {
            if(result.isConfirmed) {
                let formData = new FormData();
                for (let i = 0; i < result.value.files.length; i++) {
                    formData.append("docs", result.value.files[i]);
                }
                const changeResult = await fetch(serverEndpoint+'/api/users/'+user._id+'/documents',{
                    method:'POST',
                    body: formData,
                    headers:{
                        "type": "formData"
                    },
                    credentials: 'include'
                }).then(async (response) => response.json())
                if (changeResult.code === 201) {
                    Swal.fire({
                        title:"Usuario actualizado correctamente",
                        icon:"success",
                        timer: 4000,
                        text: changeResult.message
                    })
                }
                else {
                    Swal.fire({
                        title:"Error actualizando usuario",
                        icon:"error",
                        text: changeResult.message?changeResult.message:"Intente con un usuario registrado"
                    })
                }
            }
        })
    }
    const changeRol = async () => {
        Swal.fire({
            title:"A qué rol quieres cambiar?",
            icon:"info",
            input: 'select',
            inputOptions: {
            'premium':'Premium',
            'user':'Usuario'
            },
            inputPlaceholder: 'Selecciona un rol',
            inputAttributes: {
            maxlength: 10,
            autocapitalize: 'off',
            autocorrect: 'off'
            },
            confirmButtonText: "Change",
            showCancelButton: true,
            showConfirmButton: true,
            showCloseButton: true
        
        }).then(async (result) => {
            if(result.isConfirmed) {
                console.log(result)
                
                const changeResult = await fetch(serverEndpoint+'/api/users/premium/'+user._id,{
                    method:'PUT',
                    body:JSON.stringify({role: result.value}),
                    headers:{
                        'Content-Type':'application/json'
                    },
                    credentials: 'include'
                }).then(async(response) => response.json())
                console.log(changeResult)
                if (changeResult.code === 201) {
                    console.log("llegué")
                    console.log(changeResult)
                    Swal.fire({
                        title:"Usuario actualizado correctamente",
                        icon:"success",
                        timer: 4000,
                        text: changeResult.message
                    })
                }
                else {
                    console.log({...changeResult})
                    Swal.fire({
                        title:"Error actualizando usuario",
                        icon:"error",
                        text: changeResult.message?changeResult.message:changeResult.detail?changeResult.detail:"Intente con un usuario registrado"
                    })
                }
            }
        })
    } 
    return(
        <UserContext.Provider 
            value={{
                user,
                getUsers,
                clearUsers,
                loading,
                port,
                server_port,
                endpoint,
                closeUserSession,
                changeRol,
                uploadDocs,
                serverEndpoint
            }}>
            {children}
        </UserContext.Provider>
    );
}
export default UserContextProvider;