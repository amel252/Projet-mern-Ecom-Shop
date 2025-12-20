import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "react-js-pagination";

const CustomPagination = ({ resPerPage, filteredProductsCount }) => {
    //  1ere étape
    const [currentPage, setCurrentPage] = useState();
    let [searchParams] = useSearchParams();
    const navigate = useNavigate();
    //  si on est pas sur le mode pagination on reste sur la 1ere page
    const page = Number(searchParams.get("page")) || 1;
    useEffect(() => {
        //  ca va mettre a jour la page
        setCurrentPage(page);
    });
    //  2eme étape
    const setCurrentPageNumber = (pageNumber) => {
        setCurrentPage(pageNumber);
        if (searchParams.has("page")) {
            //  s'il trouve page sur url il va le metre a jour avec la nouvel valeur, page suivante
            searchParams.set("page", pageNumber);
        } else {
            //  on passe a la page précédante
            searchParams.append("page", pageNumber);
        }
        //  on récupere l'url + '?'(queries string) + (mot recherché)
        const path = window.location.pathname + "?" + searchParams.toString();
        // redirige vers le path complet
        navigate(path);
    };

    //  3eme étape
    return (
        <div div className="d-flex justify-content-center my-5">
            {filteredProductsCount > resPerPage && (
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={filteredProductsCount}
                    onChange={setCurrentPageNumber}
                    nextPageText={"Next"}
                    prevPageText={"Prev"}
                    firstPageText={"First"}
                    lastPageText={"Last"}
                    itemClass="page-item"
                    linkClass="page-link"
                />
            )}
        </div>
    );
};

export default CustomPagination;
