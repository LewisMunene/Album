import Link from 'next/link'
import styles from './DashboardFooter.module.css'

export default function DashboardFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                {/* Links */}
                <div className={styles.links}>
                    <Link href="/privacy" className={styles.link}>Privacy</Link>
                    <Link href="/terms" className={styles.link}>Terms</Link>
                    <Link href="/help" className={styles.link}>Help</Link>

                    <Link
                        href="https://www.linkedin.com/in/lewis-muthee-4990121aa/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                    >
                        Built by the amazing Lewis Munene Muthee ;D
                    </Link>
                </div>

                {/* Copyright */}
                <p className={styles.copyright}>
                    © {new Date().getFullYear()} Muthee Family. Made with ❤️
                </p>
            </div>
        </footer>
    )
}