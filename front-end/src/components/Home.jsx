import React from "react";
import { useEffect } from "react";
import MetaData from "./layout/MetaData";
import { useGetProductsQuery } from "../redux/api/productsApi";
import ProductItem from "./product/ProductItem";
import Loader from "./layout/Loader";
import toast from "react-hot-toast";
import CustomPagination from "./layout/CustomPagination";
import Filter from "./layout/Filter";
import { useSearchParams } from "react-router-dom";

const Home = () => {
    let [searchParams] = useSearchParams();

    //  si on est sur une page sans pagination on reste sur la premiere , si
    const page = Number(searchParams.get("page")) || 1;
    //  si on n'a pas de mot clé sur la barre de recherche le site revient sur home
    const keyword = searchParams.get("keyword") || "";
    //  on filtre par catégorie
    const category = searchParams.get("category") || "";
    //  on filtre par ratings
    const rating = searchParams.get("ratings");

    //recherche de valeur min et max
    const rawMin = searchParams.get("min");
    const rawMax = searchParams.get("max");

    //  si le nombre n'est pas null on le prend et converti en nombre sinon undefined
    const min = rawMin !== null ? Number(rawMin) : undefined;
    const max = rawMax !== null ? Number(rawMax) : undefined;

    //  faire la copie
    const params = {
        page,
        keyword,
        ...(min !== undefined && { "price[gte]": min }),
        ...(max !== undefined && { "price[lte]": max }),
        ...(rating && { ratings: rating }),
        ...(category && { category }),
    };

    //  filter pour eviter des valeurs undefined
    const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([__, v]) => v !== undefined && v !== "")
    );
    const { data, isLoading, error, isError } =
        useGetProductsQuery(cleanParams);
    // console.log(data);

    //  si on a un souci avec la récup du data
    useEffect(() => {
        if (isError) {
            toast.error(error?.data?.message || "Error is occured");
        }
    }, [isError]);

    //  si le motcles existe je prends 4 coloms sinon 3
    const columnSize = keyword ? 4 : 3;
    if (isLoading) return <Loader />;

    return (
        <>
            <MetaData title="Buy your product online" />
            <div className="container">
                <div className="row">
                    {keyword && (
                        <div className="col-6 col-md-3 mt-5">
                            <Filter />
                        </div>
                    )}
                    <div
                        className={
                            keyword ? "col-6 col-md-9" : "col-6 col-md-12"
                        }
                    >
                        <h1 id="products_heading" className="text-secondary">
                            {/*  si on fait une recherche on affiche le nombre d'article avec (keyword)sinon le ancien titre   */}
                            {keyword
                                ? `${data?.products?.length}Products found with keyword:${keyword}`
                                : "Latest Products"}
                        </h1>
                        <section id="products" className="mt-5">
                            <div className="row">
                                {data?.products?.map((product) => (
                                    <ProductItem
                                        product={product}
                                        columnSize={columnSize}
                                    />
                                ))}
                            </div>
                        </section>
                        <CustomPagination
                            resPerPage={data?.resPerPage}
                            filteredProductsCount={data?.filteredProductsCount}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
