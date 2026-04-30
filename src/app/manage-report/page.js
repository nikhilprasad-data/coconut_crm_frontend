"use client";

import {useRouter} from "next/navigation";
import {useState,useEffect} from "react";
import SpinnerLoader from "@/components/SpinnerLoader";
import styles from "./page.module.css";
import toast from 'react-hot-toast';

export default function ManageReports() {
     
     const router = useRouter();

     const [role,setRole] = useState("");
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          const role     = localStorage.getItem("role"); 
          const token    = localStorage.getItem("coconut_token");

          if (!token || role !== "admin"){
               toast.error("Access Denied. Please log in as admin.");
               router.push('/');
               return;
          }
          setRole(role);
          setIsLoading(false);
     }, [router]);

     const handleYearlyReport       = () =>  router.push('/yearly-purchase');

     const handlHeierarchyReport    = () =>  router.push('/revenue-hierarchy');

     const handleLogoutButton = () => {
          const token = localStorage.getItem("coconut_token");

          if (!token){
               toast.error("Session expired. Please log in again.");
               router.push('/');
               return;
          }
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout/admin`, {
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
                    toast.success("Successfully logged out. 👋");
                    localStorage.removeItem("coconut_token");
                    localStorage.removeItem("role");
                    router.push('/');
               } else{
                    toast.error(data.message || "Logout failed.");
               }
          })
          .catch((error) => {
               toast.error("Network error. Please try again.");
          })
     }

     if (isLoading) {
          return <SpinnerLoader text="Loading Reports..." />;
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