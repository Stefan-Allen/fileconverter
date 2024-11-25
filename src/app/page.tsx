import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <div className={styles.ctas}>
                    <Link
                        href="/converter/imageconverter"
                        passHref
                    >
                        <div className={styles.ctaButton}>
                            Image Converter
                        </div>
                    </Link>
                </div>

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
