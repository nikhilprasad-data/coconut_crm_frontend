"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./LoginForm.module.css";
import toast from 'react-hot-toast';
import SpinnerLoader from "@/components/SpinnerLoader";

export default function LoginForm() {
     const [username, setUsername] = useState("");
     const [password, setPassword] = useState("");
     const [role, setRole] = useState("admin");
     const [isSubmitting, setIsSubmitting] = useState(false);

     const router = useRouter();

     const loadDemoDetails = (demoRole) => {
          if (demoRole === 'admin') {
               setRole("admin");
               setUsername("demo_admin_11");
               setPassword("demo_password");
               toast.success("Admin demo credentials loaded. 🛠️");
          } else {
               setRole("Seller");
               setUsername("demo_seller_12");
               setPassword("demo_password");
               toast.success("Seller demo credentials loaded. 🏪");
          }
     };

     const handleLoginSubmit = (e) => {
          e.preventDefault();
          setIsSubmitting(true);

          const apiUrl = role == "admin"
               ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/admin`
               : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/seller`;

          fetch(apiUrl, {
               method: "POST",
               mode: "cors",
               credentials: "omit",
               headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
               },
               body: JSON.stringify({
                    username: username,
                    password: password
               })
          })
          .then((response) => response.json())
          .then((data) => {
               if (data.status === "success") {
                    toast.success(`Welcome back, ${username}! 🚀`);
                    localStorage.setItem("coconut_token", data.access_token);
                    localStorage.setItem("role", role);
                    router.push('/dashboard');
               } else {
                    toast.error(data.message || "Login Failed. Please check your credentials.");
                    setIsSubmitting(false);
               }
          })
          .catch((error) => {
               toast.error("Network error. Please try again later.");
               setIsSubmitting(false);
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
                                   disabled={isSubmitting}
                              >
                                   <option value="admin">Admin</option>
                                   <option value="Seller">Seller</option>
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
                                   disabled={isSubmitting}
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
                                   disabled={isSubmitting}
                              />
                         </div>

                         <button 
                              type="submit" 
                              className={isSubmitting ? `${styles.submitBtn} ${styles.btnDisabled}` : styles.submitBtn}
                              disabled={isSubmitting}
                         >
                              {isSubmitting ? "Verifying Credentials..." : "Login Securely"}
                         </button>
                    </form>

                    {isSubmitting && (
                         <div className={styles.loaderOverlay}>
                              <SpinnerLoader text="Authenticating... 🥥" />
                         </div>
                    )}

                    <div className={styles.demoSection}>
                         <p className={styles.demoText}>Interviewer Demo Shortcuts:</p>
                         <div className={styles.demoBtnRow}>
                              <button
                                   type="button"
                                   onClick={() => loadDemoDetails("admin")}
                                   className={styles.demoBtnAdmin}
                                   disabled={isSubmitting}
                              >
                                   Demo Admin
                              </button>

                              <button
                                   type="button"
                                   onClick={() => loadDemoDetails("seller")}
                                   className={styles.demoBtnSeller}
                                   disabled={isSubmitting}
                              >
                                   Demo Seller
                              </button>
                         </div>
                    </div>
               </div>
          </div>
     );
}