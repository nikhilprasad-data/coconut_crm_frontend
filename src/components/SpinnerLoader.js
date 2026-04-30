import styles from "./SpinnerLoader.module.css";

export default function SpinnerLoader({ text = "Loading..." }) {
    return (
        <div className={styles.spinnerWrapper}>
            <div className={styles.circleSpinner}></div>
            <p className={styles.spinnerText}>{text}</p>
        </div>
    );
}