"use client";

import {useState,useEffect} from "react";
import {useRouter} from "next/navigation";
import SpinnerLoader from "@/components/SpinnerLoader";
import styles from "./page.module.css";
import toast from 'react-hot-toast';

export default function SellerProfile() {
     const router = useRouter();
     const [profile,setProfile] = useState(null);
     const [isLoading,setIsLoading] = useState(true);

     useEffect(() =>{

          const token = localStorage.getItem("coconut_token");

          if (!token){
               toast.error("Session expired. Please log in again.");
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
                    toast.success("Profile data loaded successfully. 👤");
                    setProfile(data.seller_profile);
               } else{
                    toast.error(data.message || "Failed to load profile.");
               }
               setIsLoading(false);
          })
          .catch((error) =>{
               toast.error("Network error. Please try again.");
               setIsLoading(false);
          });
     }, [router]);

     const handleLogoutButton = () => {
          const token = localStorage.getItem("coconut_token");
          const role = localStorage.getItem("role");

          if (!token){
               toast.error("Session expired. Please log in again.");
               router.push('/');
               return;
          }
          
          const apiUrl = role === 'admin' 
               ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout/admin`
               : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout/seller`;

          fetch(apiUrl, {
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

     return (
          <div className={styles.pageWrapper}>
               <div className={styles.profileCard}>
                    
                    <div className={styles.headerSection}>
                         <h2 className={styles.pageTitle}>👤 My Profile</h2>
                         <div className={styles.headerBtnGroup}>
                              <button onClick={() => router.push('/dashboard')} className={styles.backBtn}>
                                   🔙 Dashboard
                              </button>
                              <button onClick={handleLogoutButton} className={styles.logoutBtn}>
                                   Logout 🚪
                              </button>
                         </div>
                    </div>

                    {isLoading ? (
                         <SpinnerLoader text="Loading Profile Data... ⏳" />
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