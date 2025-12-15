// fonction permettant de recevoir une note
const renderStars = (rating) => {
    // arrondir le nombre
    const fullStars = Math.round(rating);
    return (
        <>
            {
                // Création d'un tableau de 5 elements pour l'évaluation
                [...Array(5)].map((_, i) => (
                    //  si l'évaluation est faite , on met la couleur jaune sinon on laisse la couleur initiale
                    <span
                        key={i}
                        style={{
                            color: i < fullStars ? "#ffb829" : "#e4e5e9",
                            fontSize: "20px",
                        }}
                    ></span>
                ))
            }
        </>
    );
};
