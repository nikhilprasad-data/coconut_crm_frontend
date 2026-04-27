"use client";

import {useRouter} from "next/navigation";

import {useState,useEffect} from "react";

import styles from "./page.module.css";

export default function HierarchyReport() {
     const router = useRouter()

     const [role,setRole] = useState("");

     const [isLoading,setIsLoading] = useState(true);

     const [hierarchyData,setHierarchyData] = useState([]);

     useEffect(() => {

     const storedRole = localStorage.getItem("role");
     const token = localStorage.getItem("coconut_token");

     if (!token || storedRole !== "admin"){
          alert("Access Denied. Please Login as admin");
          router.push('/');
          return;
     }
     setRole(storedRole);

     fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/revenue-hierarchy`, {
          method         : "GET",
          mode           : "cors",
          credentials    : "omit",
          headers        : {
               "Content-Type" : "application/json",
               "Authorization": "Bearer " + token,
               "Accept"       : "application/json"
          }
     })
     .then((response) => (response.json()))

     .then((data) => {
          if (data.status === "success"){
               alert("Successfully fetched Hierarchy Report.");
               setHierarchyData(data.hierarchical_report);
          } else{
               alert("Error: " + data.message);
          }
          setIsLoading(false);
     })
     .catch((error) => {
          alert(error.message);
          setIsLoading(false);
     })
     }, []);

     const handleLogoutButton = () => {
          const token = localStorage.getItem("coconut_token");

          if (!token){
               alert("Session expired. Please Login again.")
               router.push('/')
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
                         <h2 className={styles.pageTitle}>🏢 Revenue Hierarchy Report</h2>
                         <p className={styles.pageSubtitle}>Multi-level aggregation (State {">"} City {">"} Seller)</p>
                    </div>
                    <div className={styles.headerBtnGroup}>
                         <button onClick={() => router.push('/manage-report')} className={styles.backBtn}>
                              🔙 Back to Analytics
                         </button>
                         <button onClick={handleLogoutButton} className={styles.logoutBtn}>
                              Logout 🚪
                         </button>
                    </div>
               </div>

               <div className={styles.tableCard}>
                    
                    {isLoading ? (
                         <div className={styles.loadingState}>
                              <h3>Building Hierarchy Tree... ⏳</h3>
                         </div>
                    ) : (
                         <div className={styles.tableResponsive}>
                              <table className={styles.dataTable}>
                                   <thead>
                                        <tr>
                                             <th className={styles.colLocation}>Location (State / City)</th>
                                             <th className={styles.colEntity}>Entity (Subtotals / Seller)</th> 
                                             <th className={styles.colRevenue}>Net Revenue (₹)</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {hierarchyData.length > 0 ? (
                                             hierarchyData.map((row, index) => {
                                                  
                                                  const isGrandTotal = row.grouping_state === 1;
                                                  const isStateTotal = row.grouping_state === 0 && row.grouping_city === 1;
                                                  const isCityTotal  = row.grouping_state === 0 && row.grouping_city === 0 && row.grouping_seller_name === 1;
                                                  const isStandardRow = !isGrandTotal && !isStateTotal && !isCityTotal;

                                                  let rowClass = styles.rowStandard;
                                                  let locationText = `${row.city}, ${row.state}`;
                                                  let entityText = `👤 ${row.seller_name}`;

                                                  if (isGrandTotal) {
                                                       rowClass = styles.rowGrandTotal;
                                                       locationText = "🌍 ALL REGIONS";
                                                       entityText = "GRAND TOTAL REVENUE";
                                                  } else if (isStateTotal) {
                                                       rowClass = styles.rowStateTotal;
                                                       locationText = `📍 STATE: ${row.state?.toUpperCase()}`;
                                                       entityText = `${row.state?.toUpperCase()} TOTAL`;
                                                  } else if (isCityTotal) {
                                                       rowClass = styles.rowCityTotal;
                                                       locationText = `${row.city}, ${row.state}`; 
                                                       entityText = `${row.city?.toUpperCase()} SUBTOTAL`;
                                                  }

                                                  return (
                                                       <tr key={index} className={rowClass}>
                                                            
                                                            <td className={`${styles.cell} ${isStandardRow ? styles.textDim : ''}`}>
                                                                 {locationText}
                                                            </td>
                                                            
                                                            <td className={`${styles.cell} ${isStandardRow ? styles.indentStandard : ''}`}>
                                                                 {entityText}
                                                            </td>
                                                            
                                                            <td className={`${styles.cell} ${styles.revenueAmount}`}>
                                                                 ₹{row.total_revenue}
                                                            </td>
                                                            
                                                       </tr>
                                                  )
                                             })
                                        ) : (
                                             <tr>
                                                  <td colSpan="3" className={styles.emptyState}>
                                                       No hierarchical data available.
                                                  </td>
                                             </tr>
                                        )}
                                   </tbody>
                              </table>
                         </div>
                    )}
               </div>
          </div>
     );
}