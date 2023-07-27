import React, {useContext, createContext} from "react";
import { UserContext } from "../users/UserContext";
import Swal from "sweetalert2";

export const ItemsContext = createContext();

function ItemsContextProvider({children}) {

    const {user, serverEndpoint} =  useContext(UserContext)
    const createProduct = async() => {
        Swal.fire({
            title: 'Create Product',
            html:  `
                    <div>
                        <input type="text" id="title" class="swal2-input" placeholder="title">
                        <input type="number" id="price" class="swal2-input" placeholder="price">
                        <input type="text" id="description" class="swal2-input" placeholder="description">
                        <select id="category" class="swal2-input" aria-label="Default select example">
                            <option selected value="comida">Comida</option>
                            <option value="ropa">Ropa</option>
                            <option value="otros">Otros</option>
                        </select>
                        <input type="number" id="stock" class="swal2-input" placeholder="stock">
                        <input type="file" id="image" class="swal2-input" accept: "image/*"
                    </div>`,
            confirmButtonText: 'Create',
            cancelButtonText: 'Cancel',
            showCancelButton: true,
            allowOutsideClick: false,
            focusConfirm: false,
            preConfirm: () => {
                const title = Swal.getPopup().querySelector('#title').value
                const price = Swal.getPopup().querySelector('#price').value
                const description = Swal.getPopup().querySelector('#description').value
                const category = Swal.getPopup().querySelector('#category').value
                const stock = Swal.getPopup().querySelector('#stock').value
                const image = Swal.getPopup().querySelector('#image').files

                if (!price || !description || !title || !category || !stock || !image) {
                    Swal.showValidationMessage(`Please complete all the fields`)
                }
                return { price: price, description: description, title: title, category:category, stock:stock, image:image}
            }
        }).then((result) => {
            if(result.isConfirmed) {
                let formData = new FormData();
                formData.append('product',result.value.image[0])
                let requestDataImage = {
                    method:"POST",
                    body: formData,
                    headers:{
                        "type": "formData"
                    },
                    credentials: 'include'
                }
                const request = new Request(serverEndpoint+'/api/users/'+user._id+'/documents', requestDataImage)
                fetch(request).then(async (response) =>{
                    if (!response.ok) {
                        const error = await response.json()
                        if(error.status === "WRONG") {
                            Swal.fire({
                                title: `Producto no creado`,
                                text: error.message
                            })
                        }
                        else if(response.status !== 201){
                            Swal.fire({
                                title: `Producto no creado`,
                                text: error.message
                            })
                        }
                    }
                    else {
                        const resultDocs = await response.json()
                        let data = {
                            price: parseInt(result.value.price), 
                            description: result.value.description, 
                            title: result.value.title,
                            category: result.value.category,
                            stock: parseInt(result.value.stock),
                            thumbnail: resultDocs.payload[0].reference
                        }
                        
                        let requestData = {
                            method:"POST",
                            body: JSON.stringify(data),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            },
                            credentials: 'include'
                        }
                        const request = new Request(serverEndpoint+'/api/products/', requestData)
                        fetch(request)
                        .then( async (response) => {
                            
                            if (!response.ok) {
                                const error = await response.json()
                                if(error.status === "WRONG") {
                                    Swal.fire({
                                        title: `Producto no creado`,
                                        text: error.message
                                    })
                                }
                                else if(error.code === "Unauthorized"){
                                    Swal.fire({
                                        title: `No tienes permisos para crear`,
                                    })
                                }
                            } 
                            else {
                                const data = await response.json()
                                Swal.fire({
                                    title: `Producto ${data.payload._id} creado exitosamente`,
                                    color: '#716add'
                                })
                            }
                        })
                    }   
                })
                
            }
        })
    }
    const editProduct = async(pid) => {
        Swal.fire({
            title: 'Edit Product',
            html:  `
                    <div>
                        <select id="property" class="swal2-input" aria-label="Default select example">
                            <option selected value="title">Titulo</option>
                            <option value="description">Descripción</option>
                            <option value="price">Precio</option>
                        </select>
                        <input type="text" id="newValue" class="swal2-input" placeholder="new value">
                    </div>`,
            confirmButtonText: 'update',
            focusConfirm: false,
            preConfirm: () => {
                const property = Swal.getPopup().querySelector('#property').value
                const newValue = Swal.getPopup().querySelector('#newValue').value

                if (!property || !newValue) {
                    Swal.showValidationMessage(`Please complete all the fields`)
                }
                return { property: property, newValue: newValue}
            }
        }).then((result) => {
            
            let data = {
                newValue: result.value.newValue,
                field: result.value.property
            }
            
            let requestData = {
                method:"PUT",
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include'
            }
            const request = new Request(serverEndpoint+'/api/products/'+pid, requestData)
            fetch(request)
            .then( async (response) => {
                
                if (!response.ok) {
                    const error = await response.json()
                    if(error.status === "WRONG") {
                        Swal.fire({
                            title: `Producto no creado`,
                            icon: "error",
                            text: error.message
                        })
                    }
                    else if(error.code === "Unauthorized"){
                        Swal.fire({
                            title: `No tienes permisos para crear`,
                            icon: "error"
                        })
                    }
                } 
                else {
                    const product = await response.json()
                    Swal.fire({
                        icon: "success",
                        title: `Producto ${product.title} - ${product._id} actualizado exitosamente`,
                        color: '#716add'
                    })
                }
            })
        })
    }
    const deleteProduct = async(pid) => {
        Swal.fire({
            icon: "warning",
            title: 'Delete Product',
            text: 'Estás seguro de que desea eliminar el producto?',
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
                const request = new Request(serverEndpoint+'/api/products/'+pid, requestData)
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
                        const product = await response.json()
                        Swal.fire({
                            icon: "success",
                            title: `Producto ${product._id} actualizado exitosamente`,
                            color: '#716add'
                        })
                    }
                })
            }
        })
    }
    return(
        <ItemsContext.Provider 
            value={{
                createProduct,
                editProduct,
                deleteProduct
            }}
            >
            {children}
        </ItemsContext.Provider>
    );
}

export default ItemsContextProvider;