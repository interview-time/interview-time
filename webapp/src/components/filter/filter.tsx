import React, { useState } from "react";
import styles from "./filter.module.css";

type Props = {
    filters: string[];
    initActive?: string;
    onClick: any;
};

const Filter = ({ filters, initActive, onClick }: Props) => {
    const [activefilter, setActiveFilter] = useState(initActive ?? filters[0]);

    const onFilterClicked = (filter: string) => {
        setActiveFilter(filter);
        onClick(filter);
    };

    return (
        <div className={styles.wrapper}>
            {filters.map(filter => (
                <span
                    key={filter}
                    onClick={() => onFilterClicked(filter)}
                    className={`${styles.filter} ${activefilter === filter ? styles.active : ""}`}
                >
                    {filter}
                </span>
            ))}
        </div>
    );
};

export default Filter;
