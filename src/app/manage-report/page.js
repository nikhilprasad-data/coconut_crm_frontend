"use client";

import {useRouter} from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function ManageReports() {
     
     const router = useRouter();

     const [role,setRole] = useState("");

     useEffect(() => {
          const role     = localStorage.getItem("role"); 
          const token    = localStorage.getItem("coconut_token");

          if (!token || role !== "admin"){
               alert("Access Denied. Please Login as admin");
               router.push('/');
               return;
          }
          setRole(role);
     }, []);

     const handleYearlyReport       = () =>  router.push('/yearly-purchase');

     const handlHeierarchyReport    = () =>  router.push('/revenue-hierarchy');

     const handleLogoutButton = () => {
          const token = localStorage.getItem("coconut_token");

          if (!token){
               alert("Session expired. Please Login again.")
               router.push('/');
               return;
          }
          fetch("http://127.0.0.1:5000/api/auth/logout/admin", {
               method         : "POST",
               mode           : "cors",
               credentials    : "omit",

               headers        : {
                    "Content-Type" : "application/json",
                    "Authorization": "Bearer " + token,
                    "Accept"       : "application/json"
               }
          })
          .then((response) => response.json())

          .then((data) => {
               if (data.status === "success"){
                    alert("Successfully Loged out");
                    localStorage.removeItem("coconut_token");
                    localStorage.removeItem("role");
                    router.push('/');
               } else{
                    alert("Error: " + data.message);
               }
          })
          .catch((error) => {
               alert(error.message);
          })
     }
     return (
          <div className={styles.pageWrapper}>
               
               <div className={styles.headerSection}>
                    <div>
                         <h2 className={styles.pageTitle}>📊 Analytics & Reports</h2>
                         <p className={styles.pageSubtitle}>System-wide financial insights and hierarchy</p>
                    </div>
                    <div className={styles.headerBtnGroup}>
                         <button onClick={() => router.push('/dashboard')} className={styles.backBtn}>
                              🔙 Back
                         </button>
                         <button onClick={handleLogoutButton} className={styles.logoutBtn}>
                              Logout 🚪
                         </button>
                    </div>
               </div>

               <div className={styles.cardsContainer}>
                    
                    <div className={styles.reportCard}>
                         <div className={styles.cardIcon}>📈</div>
                         <h3 className={styles.cardTitle}>Yearly Purchase Report</h3>
                         <p className={styles.cardDesc}>
                              View aggregated purchase data grouped by year. Analyze trends and total expenses.
                         </p>
                         <button onClick={handleYearlyReport} className={`${styles.actionBtn} ${styles.btnBlue}`}>
                              View Report 🚀
                         </button>
                    </div>

                    <div className={styles.reportCard}>
                         <div className={styles.cardIcon}>🏢</div>
                         <h3 className={styles.cardTitle}>Revenue Hierarchy</h3>
                         <p className={styles.cardDesc}>
                              Track financial hierarchy from top-level management down to individual sellers.
                         </p>
                         <button onClick={handlHeierarchyReport} className={`${styles.actionBtn} ${styles.btnGreen}`}>
                              View Hierarchy 📊
                         </button>
                    </div>

               </div>
          </div>
     );
}