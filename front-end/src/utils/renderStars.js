// // fonction permettant de recevoir une note
// const renderStars = (rating = 0) => {
//     // arrondir le nombre
//     const fullStars = Math.round(Number(rating));
//     return (
//         <>
//             {
//                 // Création d'un tableau de 5 elements pour l'évaluation
//                 [...Array(5)].map((_, i) => (
//                     //  si l'évaluation est faite , on met la couleur jaune sinon on laisse la couleur initiale
//                     <span
//                         key={i}
//                         style={{
//                             color: i < fullStars ? "#ffb829" : "#e4e5e9",
//                             fontSize: "20px",
//                         }}
//                     >
//                         ★
//                     </span>
//                 ))
//             }
//         </>
//     );
// };
// export default renderStars;
// fonction permettant de recevoir une note
const renderStars = (rating, setRating) => {
    return (
        <>
            {[...Array(5)].map((_, i) => {
                const starValue = i + 1;

                return (
                    <span
                        key={i}
                        onClick={() => setRating(starValue)}
                        style={{
                            cursor: "pointer",
                            color: starValue <= rating ? "#ffb829" : "#e4e5e9",
                            fontSize: "22px",
                        }}
                    >
                        ★
                    </span>
                );
            })}
        </>
    );
};

export default renderStars;
