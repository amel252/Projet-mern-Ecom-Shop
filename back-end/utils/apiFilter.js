class APIFilters {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    search() {
        const keyword = this.queryStr.keyword
            ? {
                  // si le mot recherché n'existe pas
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: "i",
                  },
              }
            : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }
    // recherche par rapport au prix , rating
    filters() {
        const queryCopy = { ...this.queryStr };
        const fieldsToRemove = ["keyword"];
        fieldsToRemove.forEach((el) => delete queryCopy[el]);
        let queryStr = JSON.stringify(queryCopy);
        // filtre par rapport au prix
        queryStr = queryStr.replace(
            /\b(gt|gte|lt|lte)\b/g,
            (match) => `$${match}`
        );
        console.log(queryStr);
        // convertir le Json en  objet
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }
    pagination(resPerPage) {
        // si la prochaine page n'existe pas on reste sur la page 1
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage.skip(skip));
        return this;
    }
}
export default APIFilters;
