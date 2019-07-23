const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//Cria Model
const PostagenSchema = new Schema({
    titulo:{
        type: String,
        required: true
    },
    conteudo:{
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    slug:{
        type: String,
        required: true
    },
    data:{
        type: Date,
        default: Date.now()
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'categorias',
        required: true
    }
})

//Referencia Collection
mongoose.model('postagens', PostagenSchema)