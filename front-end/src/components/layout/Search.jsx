import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const submitHandler = (e) => {
        e.preventDefault();
        //  trim pour supp l'espace , si le mot existe ?
        if (keyword?.trim()) {
            //  intégrer et ajout le mot recherche dans l'url
            navigate(`?/keyword=${keyword}`);
            //  si le mot est supprimé sur la barre de recherche , on appuie sur recherche ca revient sur home
        } else {
            navigate("/");
        }
    };

    return (
        <div>
            <form action={submitHandler}>
                <div className="input-group">
                    <input
                        type="text"
                        id="search_field"
                        aria-describedby="search_btn"
                        className="form-control"
                        placeholder="Enter the product name... "
                        name="keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button id="search_btn" className="btn" type="submit">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Search;
