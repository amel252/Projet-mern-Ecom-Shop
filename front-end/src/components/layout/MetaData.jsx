import { useEffect } from "react";

const MetaData = ({ title }) => {
    useEffect(() => {
        document.title = `${title} -ShopIT`;
    }, [title]);
    return null;
};
MetaData.defaultProps = {
    title: "Buy your product online",
};
export default MetaData;
