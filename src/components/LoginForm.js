"use client";

import { useRouter } from "next/navigation";
import {useState} from "react";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
     const [username,setUsername]  = useState("");
     const[password,setPassword]   = useState("");
     const[role,setRole]           = useState("admin");

     const router = useRouter();

     const loadDemoDetails = (demoRole) =>{
          if (demoRole === 'admin'){
               setRole("admin");
               setUsername("demo_admin_11");
               setPassword("demo_password");
          } else{
               setRole("Seller");
               setUsername("demo_seller_12");
               setPassword("demo_password");
          }
     };
     const handleLoginSubmit = (e) => {
          e.preventDefault()

          const apiUrl = role == "admin"
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/admin`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/seller`;

          fetch(apiUrl,{
               method       : "POST",
               mode         : "cors",
               credentials  : "omit",
               headers      : {
                    "Content-Type"  : "application/json",
                    "Accept"        : "application/json"  
               },
               body : 
                    JSON.stringify({
                         username : username,
                         password : password
                    })
          })
          .then((response)=> response.json())
          .then((data) => {
               if (data.status === "success"){
                    alert("Login Successfull, Wellcome " + username);
                    localStorage.setItem("coconut_token", data.access_token);
                    localStorage.setItem("role", role)
                    router.push('/dashboard');
               } else{
                    alert("Login Failed " + data.message);
               }
          })
          .catch((error) => {
               alert(error.message);
          });
     };

return (
    <div className={styles.pageWrapper}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>🥥 Coconut CRM Login</h2>
        
        <form onSubmit={handleLoginSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Role:</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className={styles.inputField}
              suppressHydrationWarning={true}
            >
              <option value="admin">Admin</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              className={styles.inputField}
              placeholder="Enter username"
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={styles.inputField}
              placeholder="Enter password"
              required 
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Login Securely
          </button>
        </form>

        {/*Demo Shortcuts */}
        <div className={styles.demoSection}>
          <p className={styles.demoText}>Interviewer Demo Shortcuts:</p>
          <div className={styles.demoBtnRow}>
            <button 
              type="button" 
              onClick={() => loadDemoDetails("admin")}
              className={styles.demoBtnAdmin}
            >
              Demo Admin
            </button>
            
            <button 
              type="button" 
              onClick={() => loadDemoDetails("seller")}
              className={styles.demoBtnSeller}
            >
              Demo Seller
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}