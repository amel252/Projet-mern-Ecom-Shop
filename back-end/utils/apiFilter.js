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
}
export default APIFilters;
