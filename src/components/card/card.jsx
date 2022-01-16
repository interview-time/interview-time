import styles from "./card.module.css";

/**
 *
 * @param {boolean} padding
 * @param {function} onClick
 * @param {CSSProperties} style
 * @param {string} className
 * @param {JSX.Element} children
 * @returns {JSX.Element}
 * @constructor
 */
const Card = ({ withPadding = true, onClick, style, className, children }) => {

    const paddingStyle = () => withPadding ? styles.padding : styles.noPadding

    const clickStyle = () => {
        if (onClick) {
            return styles.clickable
        }

        return null
    }

    return <div className={`${styles.card} ${paddingStyle()} ${clickStyle()} ${className}`}
                style={style}
                onClick={onClick}>
        {children}
    </div>
}

export default Card