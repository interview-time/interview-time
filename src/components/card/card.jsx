import styles from "./card.module.css";

/**
 *
 * @param {boolean} padding
 * @param {CSSProperties} style
 * @param {string} className
 * @param {JSX.Element} children
 * @returns {JSX.Element}
 * @constructor
 */
const Card = ({ withPadding = true, style, className, children }) => {

    return <div className={`${styles.card} ${withPadding ? styles.padding : styles.noPadding} ${className}`} style={style}>
        {children}
    </div>
}

export default Card