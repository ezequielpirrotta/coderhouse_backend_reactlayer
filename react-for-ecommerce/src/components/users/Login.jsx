import React, { useState , useContext} from "react";
import { InputGroup,FormControl, Button } from "react-bootstrap";
import Swal from 'sweetalert2';
import { UserContext } from "./UserContext";

function Login() 
{
    const {user, serverEndpoint} = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'username') {
            setUsername(value);
        } 
        else if (name === 'password') {
            setPassword(value);
        } 
    };
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            const data = {username, password};
            const result = await fetch(serverEndpoint+'/api/sessions/login',{
                method:'POST',
                body:JSON.stringify(data),
                headers:{
                    'Content-Type':'application/json'
                },
                credentials: 'include'
            }).then((response)=>response.json())
            if(result.code===200){
                window.location.replace('/products');
            }
            else {
                Swal.fire({
                    title:"Error con su inicio de sesión",
                    icon:"error",
                    text: result.message?result.message:"Intente con un usuario registrado"
                })
            }
        }
    };

    const validateForm = () => {
        let errors = {};
        let isValid = true;

        if (!username) {
            isValid = false;
            errors['email'] = 'Please enter your email address.';
        } else if (!/\S+@\S+\.\S+/.test(username)) {
            isValid = false;
            errors['email'] = 'Please enter a valid email address.';
        }

        if (!password) {
            isValid = false;
            errors['password'] = 'Please enter your password.';
        }

        setErrors(errors);
        return isValid;
    };
    return (
        <div className="container-fluid m-3 d-flex justify-content-center">
            <div className="card d-flex justify-content-center">
                <h1 className="card-title"> Inicia sesión</h1>
                { user?
                    <div className="shadow-lg bg-body rounded">
                        <form id="loginForm" className="card-body row g-3 justify-content-center needs-validation" noValidate>
                            <div className="col-12">
                                <a className="btn btn-primary" href="/products" type="submit">Continuar </a>
                            </div>
                        </form>
                    </div>
                    :
                    <div className="shadow-lg bg-body rounded">
                        <form id="loginForm" onSubmit={handleSubmit} className="card-body row g-3 justify-content-center needs-validation" noValidate>
                            <div className="col-md-12">
                                <label htmlFor="username" className="form-label">Email</label>
                                <input type="text" 
                                    className={`form-control ${errors['email'] ? 'is-invalid' : ''}`} 
                                    name="username" 
                                    id="username" placeholder="someone@gmail.com" required
                                    onChange={handleInputChange} 
                                />
                                <div className="valid-feedback">
                                    ¡Se ve bien!
                                </div>
                                {errors['email'] && <div className="invalid-feedback">{errors['email']}</div>}

                                <div className="input-group flex-column">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            type={showPassword ? "text" : "password"}
                                            className={`form-control ${errors['password'] ? 'is-invalid' : ''}`}
                                            name="password"
                                            id="password" placeholder="*******" required
                                            onChange={handleInputChange}
                                        >

                                        </FormControl>
                                        {errors['password'] && <div className="invalid-feedback">{errors['password']}</div>}

                                        <Button
                                            variant="outline-secondary"
                                            onClick={toggleShowPassword}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {showPassword ? (
                                            <i className="fa fa-eye-slash"></i>
                                            ) : (
                                            <i className="fa fa-eye"></i>
                                            )}
                                        </Button>
                                        
                                    </InputGroup>
                                    
                                </div>

                                <div className="valid-feedback">
                                    ¡Se ve bien!
                                </div>
                                <div className="invalid-feedback">
                                    Este campo es requerido
                                </div>
                                <p>¿Olvidaste tu contraseña? <a href="/users/resetPassword/sendEmail">Restáurala aquí</a></p>
                            </div>
                            <div className="col-12">
                                <button className="btn btn-primary" type="submit">Continuar</button>
                            </div>
                        </form>
                        <p>Ingresa con github! <a href="/github/login">Click aqui</a></p>
                        <p>¿No estás registrado? <a href="/register">Regístrate aquí</a></p>
                    </div>
                }
            </div>
        </div>
    )
}
export default Login;