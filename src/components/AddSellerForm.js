"use client"

import {useRouter} from "next/navigation";
import {useState} from "react";
import toast from 'react-hot-toast';
import styles from "./AddSellerForm.module.css";
import SpinnerLoader from "@/components/SpinnerLoader";

export default function AddSellerForm() {

     const router = useRouter();

     const [city, setCity]                   = useState("");
     const [state, setState]                 = useState("");
     const [sellerName, setSellerName]       = useState("");
     const [contactNumber, setContactNumber] = useState("");
     const [userName, setUserName]           = useState("");
     const [password, setPassword]           = useState("");
     const [isSubmitting,setIsSubmitting]    = useState(false)

     const handleRegisterButton = (e) => {
          e.preventDefault()
          setIsSubmitting(true)

          const token = localStorage.getItem("coconut_token")

          if (!token){
               toast.error("Session expired. Please log in again.");
               setIsSubmitting(false)
               router.push('/')
               return;
          }
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/seller/add`, {
               method         : "POST",
               mode           : "cors",
               credentials    : "omit",
               headers        : {
                    "Content-Type" : "application/json",
                    "Accept"       : "application/json",
                    "Authorization": "Bearer " + token
               },
               body           : JSON.stringify({
                    "city"              : city,
                    "state"             : state,
                    "seller_name"       : sellerName,
                    "contact_number"    : contactNumber,
                    "username"          : userName,
                    "password"          : password
               })
          })
          .then((response) => response.json())
          .then((data) => {
               if (data.status == "success"){
                    toast.success("Seller added successfully! 🎉")
                    router.push('/manage-seller')
               } else{
                    toast.error(data.message || "Failed to add seller.")
                    setIsSubmitting(false)
               }
          })
          .catch((error) => {
               toast.error("Network error. Please try again.")
               setIsSubmitting(false)
          })
     }

     return (
          <div className={styles.pageWrapper}>
               <div className={styles.formCard}>
                    
                    <div className={styles.headerSection}>
                         <h2 className={styles.formTitle}>➕ Add New Seller</h2>
                         <button onClick={() => router.push('/manage-seller')} className={styles.cancelBtn} disabled={isSubmitting}>
                              Cancel
                         </button>
                    </div>

                    <form onSubmit={handleRegisterButton}>
                         <div className={styles.inputGrid}>
                              
                              <div className={styles.inputGroup}>
                                   <label className={styles.label}>Seller Business Name *</label>
                                   <input 
                                        type="text" 
                                        value={sellerName} 
                                        onChange={(e) => setSellerName(e.target.value)} 
                                        required 
                                        placeholder="e.g. Ramesh Enterprises" 
                                        className={styles.inputField} 
                                        disabled={isSubmitting}
                                   />
                              </div>

                              <div className={styles.inputGroup}>
                                   <label className={styles.label}>Contact Number *</label>
                                   <input 
                                        type="text" 
                                        value={contactNumber} 
                                        onChange={(e) => setContactNumber(e.target.value)} 
                                        required 
                                        placeholder="+91 9876543210" 
                                        className={styles.inputField} 
                                        disabled={isSubmitting}
                                   />
                              </div>

                              <div className={styles.inputGroup}>
                                   <label className={styles.label}>City *</label>
                                   <input 
                                        type="text" 
                                        value={city} 
                                        onChange={(e) => setCity(e.target.value)} 
                                        required 
                                        placeholder="e.g. Delhi" 
                                        className={styles.inputField} 
                                        disabled={isSubmitting}
                                   />
                              </div>

                              <div className={styles.inputGroup}>
                                   <label className={styles.label}>State *</label>
                                   <input 
                                        type="text" 
                                        value={state} 
                                        onChange={(e) => setState(e.target.value)} 
                                        required 
                                        placeholder="e.g. Delhi" 
                                        className={styles.inputField} 
                                        disabled={isSubmitting}
                                   />
                              </div>

                              <div className={styles.inputGroup}>
                                   <label className={styles.label}>Login Username *</label>
                                   <input 
                                        type="text" 
                                        value={userName} 
                                        onChange={(e) => setUserName(e.target.value)} 
                                        required 
                                        placeholder="Seller's login ID" 
                                        className={styles.inputField} 
                                        disabled={isSubmitting}
                                   />
                              </div>

                              <div className={styles.inputGroup}>
                                   <label className={styles.label}>Login Password *</label>
                                   <input 
                                        type="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        required 
                                        placeholder="Secret password" 
                                        className={styles.inputField} 
                                        disabled={isSubmitting}
                                   />
                              </div>

                         </div>

                         <button 
                              type="submit" 
                              disabled={isSubmitting} 
                              className={isSubmitting ? `${styles.submitBtn} ${styles.btnDisabled}` : styles.submitBtn}
                         >
                              {isSubmitting ? "Adding Seller..." : "Register Seller 🚀"}
                         </button>

                              {isSubmitting && (
                                   <div className={styles.loaderContainer}>
                                        <SpinnerLoader text="Saving Seller Details... ⏳" />
                                   </div>
                              )}
                    </form>
               </div>
          </div>
     );
}