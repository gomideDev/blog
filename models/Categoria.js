const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Cria o model
const CategoriaSchema = new Schema({
    nome:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }
})

//Referencia a collection
mongoose.model('categorias', CategoriaSchema)