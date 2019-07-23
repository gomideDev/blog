if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://devteste:#@dev#1996@cluster0-bstbk.mongodb.net/test?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://devteste:dev123456789@cluster0-bstbk.mongodb.net/test?retryWrites=true&w=majority"}
    //module.exports = {mongoURI: "mongodb://localhost/blogapp"}
}