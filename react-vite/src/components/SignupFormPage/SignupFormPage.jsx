import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { thunkSignup } from "../../redux/session";
import './SignupForm.css'

function SignupFormPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");


  if (sessionUser) return <Navigate to="/" replace={true} />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        first_name: firstName,
        last_name: lastName,
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      navigate("/");
    }
  };

  return (
    <div className='signup-page'>
      <div className='signup-section'>
      <form className='signup-form' onSubmit={handleSubmit}>
        <h1 className='signup-title'>Create an Account</h1>
        {errors.server && <p className='error'>{errors.server}</p>}
        
          <input
            placeholder="*First Name"
            type="text"
            value={firstName}
            minLength="1" 
            maxLength="50"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {errors.first_name && <p className='error'>{errors.last_name}</p>}

          <input
            placeholder="*Last Name"
            type="text"
            value={lastName}
            minLength="1" 
            maxLength="50"
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {errors.last_name && <p className='error'>{errors.last_name}</p>}
          
      
            <input
              placeholder="*Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
        
          {errors.email && <p className='error'>{errors.email}</p>}
          
            <input
              placeholder="*Username"
              type="text"
              value={username}
              minLength="1" 
              maxLength="40"
              title="cannot exceed 40 characters"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
         
          {errors.username && <p className='error'>{errors.username}</p>}
          
            <input
              placeholder="*Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
     
          {errors.password && <p className='error'>{errors.password}</p>}
         
            <input
              type="password"
              value={confirmPassword}
              placeholder="*Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
       
          {errors.confirmPassword && <p className='error'>{errors.confirmPassword}</p>}
          <button 
              className="sign-up-button" 
              type="submit">
                Sign Up
            </button>
          <button className= 'login-button' 
          onClick={()=> navigate('/login')}>Log In</button>
        </form>
      </div>
      
    </div>
  );
}

export default SignupFormPage;
