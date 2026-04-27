"use client";

import {useState,useEffect} from "react";
import {useRouter} from "next/navigation";

import styles from "./page.module.css";

export default function SellerProfile() {
     const router = useRouter();
     const [profile,setProfile] = useState(null);
     const [isLoading,setIsLoading] = useState(true);

     useEffect(() =>{

          const token = localStorage.getItem("coconut_token");

          if (!token){
               alert("Session expired. Please login again.");
               router.push('/');
               return;
          } 
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/profile`, {
               method         : "GET",
               mode           : "cors",
               credentials    : "omit",
               headers        : {
                    "Authorization"     : "Bearer "+ token,
                    "Content-Type"      : "application/json",
                    "Accept"            : "application/json"
               }
          })
          .then((response) => response.json())

          .then((data) => {
               if (data.status === "success"){
                    alert("Successfully fetched your profile data");
                    setProfile(data.seller_profile);
               } else{
                    alert("Error: " + data.message);
               }
               setIsLoading(false);
          })
          .catch((error) =>{
               alert(error.message);
               setIsLoading(false);
          });
     }, []);

     return (
          <div className={styles.pageWrapper}>
               <div className={styles.profileCard}>
                    
                    <div className={styles.headerSection}>
                         <h2 className={styles.pageTitle}>👤 My Profile</h2>
                         <button onClick={() => router.push('/dashboard')} className={styles.backBtn}>
                              🔙 Dashboard
                         </button>
                    </div>

                    {isLoading ? (
                         <div className={styles.loadingState}>
                              Loading Profile Data... ⏳
                         </div>
                    ) : profile ? (

                         <div className={styles.profileGrid}>
                              
                              <div className={styles.infoRow}>
                                   <span className={styles.infoLabel}>Business Name:</span>
                                   <span className={styles.infoValue}>{profile.seller_name}</span>
                              </div>

                              <div className={styles.infoRow}>
                                   <span className={styles.infoLabel}>Username:</span>
                                   <span className={styles.infoValueHighlight}>@{profile.seller_user_name}</span>
                              </div>

                              <div className={styles.infoRow}>
                                   <span className={styles.infoLabel}>Contact Number:</span>
                                   <span className={styles.infoValue}>{profile.seller_contact_number}</span>
                              </div>

                              <div className={styles.infoRow}>
                                   <span className={styles.infoLabel}>City:</span>
                                   <span className={styles.infoValue}>{profile.seller_city}</span>
                              </div>

                              <div className={styles.infoRow}>
                                   <span className={styles.infoLabel}>State:</span>
                                   <span className={styles.infoValue}>{profile.seller_state}</span>
                              </div>

                         </div>
                    ) : (
                         <div className={styles.errorState}>
                              Failed to load profile data. ❌
                         </div>
                    )}

               </div>
          </div>
     );
}