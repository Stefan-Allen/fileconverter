import styles from "./page.module.css";
import Navbar from "@/app/components/navbar/page";


export default function Home() {
    return (
        <div className={styles.page}>
            <Navbar/>
            <main className={styles.main}>

                <div className={styles.logo}>
                    File Converter
                </div>

                <ol className={styles.instructions}>
                    <li>
                        Get started by selecting <code>Converter</code>.
                    </li>
                    <li>
                        Instantly convert files for <code>free</code> (images).
                    </li>

                </ol>
            </main>
        </div>
    );
}
