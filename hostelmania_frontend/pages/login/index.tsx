import React, { useRef, useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import classes from "../../styles/login.module.scss";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import axios from "axios";
import { notifyMessage } from "../../helper/toast";
import Cookie from "js-cookie";
import AuthContext from "../../context/authContext";

const Login = () => {
  const { getAuth } = useContext(AuthContext);
  const API = `${process.env.NEXT_PUBLIC_API}/login`;

  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setError("");
    // setLoading(true);
    if (userNameRef.current && passwordRef.current) {
      const username = userNameRef.current.value;
      const password = passwordRef.current.value;
      const body = { username, password };

      try {
        const { data, status } = await axios.post(API, body);
        console.log(data)
        if (status > 201 || !data) throw new Error();
        Cookie.set("jwt", data.token);
        getAuth();
        router.push("/hostels");
      } catch (e) {
        setError("Invalid username or password");
        notifyMessage("Invalid username or password");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={classes.login}>
      <h2>Login</h2>
      <div className="flex">
        <div className={`${classes.dis} flex`}>
          <form className={classes.form} onSubmit={onSubmit}>
            <div className={classes.fr}>
              <label htmlFor="username">Username</label>
              <TextField
                id="username"
                variant="outlined"
                className={classes.text}
                required
                inputRef={userNameRef}
              />
              <label htmlFor="password">Password</label>
              <TextField
                id="password"
                type="password"
                variant="outlined"
                className={classes.text}
                required
                inputRef={passwordRef}
              />
              {error && <p className={classes.error}>{error}</p>}
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

// import React, { useRef, useContext, useState } from "react";
// import TextField from "@mui/material/TextField";
// import classes from "../../styles/login.module.scss";
// import Button from "@mui/material/Button";
// import { useRouter } from "next/router";
// import axios from "axios";
// import { notifyMessage } from "../../helper/toast";
// import Cookie from "js-cookie";
// import AuthContext from "../../context/authContext";

// const Login = () => {
//   const { getAuth } = useContext(AuthContext);
//   const API = `${process.env.NEXT_PUBLIC_API}/login`;

//   const userNameRef = useRef<HTMLInputElement>(null);
//   const passwordRef = useRef<HTMLInputElement>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     console.log("hello")
//     if (userNameRef.current && passwordRef.current) {
//       const username = userNameRef.current.value;
//       const password = userNameRef.current.value;
//       const body = { username, password };

//       try {
//         const res = await axios.post(API, body)
//         // const { data, status } = await axios.post(API, body);
//         console.log("response_data", res.data)
//         if (res.status > 201 || res.data) throw new Error();
//         Cookie.set("jwt", res.data.token); // Store JWT
//         getAuth();
//         console.log("token", res.data.token)
//         // router.push("/Hostels");
//       } catch (e) {
//         console.log(e)
//         setError("Invalid username or password");
//         notifyMessage("Invalid username or password");
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   return (
//     <div className={classes.login}>
//       <h2>Login</h2>
//       <div className="flex">
//         <div className={`${classes.dis} flex`}>
//           <form className={classes.form} onSubmit={onSubmit}>
//             <div className={classes.fr}>
//               <label htmlFor="username">Username</label>
//               <TextField
//                 id="username"
//                 variant="outlined"
//                 className={classes.text}
//                 required
//                 inputRef={userNameRef}
//               />
//               <label htmlFor="password">Password</label>
//               <TextField
//                 id="password"
//                 type="password"
//                 variant="outlined"
//                 className={classes.text}
//                 required
//                 inputRef={passwordRef}
//               />
//               {error && <p className={classes.error}>{error}</p>}
//               <Button type="submit" variant="contained" disabled={loading}>
//                 {loading ? "Logging in..." : "Login"}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
