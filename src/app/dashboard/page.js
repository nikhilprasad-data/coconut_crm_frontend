"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Dashboard() {
     const router   = useRouter();

     const [userRole, setRole] = useState("");

     useEffect(()=>{
          const role = localStorage.getItem("role");

          if (role){
               setRole(role);
          } else{
               router.push('/');
          }
     }, []);


     const handleSellerButton           = () => router.push('/manage-seller');

     const handlePurchaseButton         = () => router.push('/manage-purchase');

     const handlePaymentButton          = () => router.push('/manage-payment');

     const handleReportButton           = () => router.push('/manage-report');

     const handleSellerProfileButton    = () => router.push('/seller-profile');

     const handleSellerPurchaseButton   = () => router.push('/seller-purchase');

     const handleSellerPaymentButton    = () => router.push('/seller-payment');

     const handleLogoutButton           = (e) => {
          e.preventDefault()
          const role     = localStorage.getItem("role");
          const token    = localStorage.getItem("coconut_token");

          const apiUrl   = role == 'admin'
          ?"http://127.0.0.1:5000/api/auth/logout/admin"
          :"http://127.0.0.1:5000/api/auth/logout/seller";

          fetch(apiUrl,{
               method    : "POST",
               mode      : "cors",
               credentials: "omit",
               headers   : {
                    "Content-Type"      : "application/json",
                    "Authorization"     : "Bearer " + token,
                    "Accept"            : "application/json"
               }
          })
          .then((response)=> response.json())

          .then((data)=>{
               if (data.status === "success"){
                    alert(data.message);
                    localStorage.removeItem("coconut_token");
                    localStorage.removeItem("role");
                    router.push('/');
               } else{
                    alert(data.message);
               }
          })
          .catch((error)=>{
               alert(error.message);
          });
     };
return (
          <div className={styles.pageWrapper}>
               
               <div className={styles.topNavbar}>
                    <div className={styles.logoArea}>
                         <h2 className={styles.logoText}>🥥 Coconut CRM</h2>
                         <p className={styles.welcomeText}>
                              Welcome back, <span className={styles.roleHighlight}>{userRole}</span>!
                         </p>
                    </div>
                    <button onClick={handleLogoutButton} className={styles.logoutBtn}>
                         Logout 🚪
                    </button>
               </div>


               {userRole === "admin" && (
                    <div className={styles.dashboardSection}>
                         <h3 className={styles.sectionTitle}>🛡️ Admin Control Panel</h3>
                         
                         <div className={styles.cardGrid}>
                              
                              <div onClick={handleSellerButton} className={`${styles.dashboardCard} ${styles.borderBlue}`}>
                                   <h3 className={styles.cardTitle}>📦 Manage Sellers</h3>
                                   <p className={styles.cardDesc}>Add, Edit, or Delete Sellers</p>
                              </div>

                              <div onClick={handlePurchaseButton} className={`${styles.dashboardCard} ${styles.borderGreen}`}>
                                   <h3 className={styles.cardTitle}>🛒 All Purchases</h3>
                                   <p className={styles.cardDesc}>Track all incoming inventory</p>
                              </div>

                              <div onClick={handlePaymentButton} className={`${styles.dashboardCard} ${styles.borderYellow}`}>
                                   <h3 className={styles.cardTitle}>💳 All Payments</h3>
                                   <p className={styles.cardDesc}>View financial transactions</p>
                              </div>

                              <div onClick={handleReportButton} className={`${styles.dashboardCard} ${styles.borderTeal}`}>
                                   <h3 className={styles.cardTitle}>📊 Analytics & Reports</h3>
                                   <p className={styles.cardDesc}>System-wide statistics</p>
                              </div>

                         </div>
                    </div>
               )}


               {userRole === "seller" && (
                    <div className={styles.dashboardSection}>
                         <h3 className={styles.sectionTitle}>🏪 My Dashboard</h3>
                         
                         <div className={styles.cardGrid}>
                              
                              <div onClick={handleSellerProfileButton} className={`${styles.dashboardCard} ${styles.borderPurple}`}>
                                   <h3 className={styles.cardTitle}>👤 My Profile</h3>
                                   <p className={styles.cardDesc}>View your personal details</p>
                              </div>

                              <div onClick={handleSellerPurchaseButton} className={`${styles.dashboardCard} ${styles.borderGreen}`}>
                                   <h3 className={styles.cardTitle}>🛒 My Purchases</h3>
                                   <p className={styles.cardDesc}>Check your inward stock</p>
                              </div>

                              <div onClick={handleSellerPaymentButton} className={`${styles.dashboardCard} ${styles.borderYellow}`}>
                                   <h3 className={styles.cardTitle}>💳 My Payments</h3>
                                   <p className={styles.cardDesc}>Track your received amounts</p>
                              </div>

                         </div>
                    </div>
               )}

          </div>
     );
}