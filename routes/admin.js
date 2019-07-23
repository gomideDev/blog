const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/Categoria');
require('../models/Postagem');
const Categoria = mongoose.model('categorias');
const Postagem = mongoose.model('postagens');

router.get('/', (req, res)=>{
    res.render('admin/index');
})

router.get('/categorias/add', (req, res)=>{
    res.render('admin/addCategorias')
})

router.get('/categorias', (req, res)=>{
    Categoria.find().sort({date:'desc'}).then((categorias)=>{
        res.render('admin/categorias', {categorias});
    })
    
})

router.post('/categorias/nova', (req, res)=>{

    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: 'Nome inválido'})
    }

    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({texto:'slug inválido'})
    }

    if(req.body.nome.length < 2 ){
        erros.push({texto:'nome muito pequeno'})
    }
    if(req.body.slug.length < 2){
        erros.push({texto:'Slug muito pequeno'})
    }

    if(erros.length > 0){
        res.render('admin/addCategorias', {erros: erros})
    }else{

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
       
        new Categoria(novaCategoria).save().then(()=>{
            req.flash('success_msg', "Categoria Saved!")
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg', 'Categoria not saved')
            res.redirect('/admin')
        })
    }

})

    router.get('/categorias/edit/:id', (req, res)=>{
        
            Categoria.findOne({_id: req.params.id}).then((categoria)=>{
                res.render('admin/editCategoria', {categoria:categoria})
            }).catch((err)=>{
                req.flash('error_msg', 'Esta categoria não existe!')
                res.redirect('/admin/categorias')
            })
        
        


    })

    router.post('/categorias/edit', (req, res)=>{

            Categoria.findOne({_id: req.body.id}).then((categoria)=>{

            var erros = [];

            if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
                erros.push({texto: 'Nome inválido'})
            }

            if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
                erros.push({texto:'slug inválido'})
            }

            if(req.body.nome.length < 2 ){
                erros.push({texto:'nome muito pequeno'})
            }
            if(req.body.slug.length < 2){
                erros.push({texto:'Slug muito pequeno'})
            }
            if(erros > 0){
                res.redirect('/admin/categorias', erros)
            }else{

            
                categoria.nome = req.body.nome,
                categoria.slug = req.body.slug
                categoria.save().then(()=>{
                    req.flash('success_msg', "Categoria editada com sucesso!");
                    res.redirect('/admin/categorias');
                }).catch((err)=>{
                    req.flash('error_msg', "Houve um erro interno ao salvar a edição da categoria!")
                    res.redirect('/admin/categorias')
                })
            }
            }).catch((err)=>{
                req.flash('error_msg', 'Falha na edição da categoria!')
                res.redirect('/admin/categorias');
            })
        
    })

    router.post('/categorias/delete', (req,res)=>{
        Categoria.remove({_id : req.body.id}).then(()=>{
            req.flash('success_msg', "Categoria deletada com sucesso!");
            res.redirect('/admin/categorias');
        }).catch((err)=>{
            req.flash('error_msg', "Houve um erro ao deletar a categoria!")
            res.redirect('/admin/categorias');
        })
    })

    router.get('/postagens', (req, res)=>{
        Postagem.find().populate("categoria").sort({data:"desc"}).then((postagens)=>{
            res.render('admin/postagens', {postagens: postagens})
        }).catch(()=>{
            req.flash("error_msg", "Erro ao listar as postagens");
            res.redirect('/admin')
        })
        
    })

    router.get('/postagem/add', (req, res)=>{
        Categoria.find().then((categorias)=>{
            res.render('admin/addPostagem', {categorias: categorias})
        })
    })

    router.post('/postagens/nova', (req, res)=>{

        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            conteudo: req.body.conteudo,
            descricao: req.body.descricao,
            categoria: req.body.categoria 
        }

        var erros = [];

        if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
            erros.push({texto: 'Titulo inválido'})
        }
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.titulo == null){
            erros.push({texto: 'Slug inválido'})
        }
        if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
            erros.push({texto: 'Conteúdo inválido'})
        }
        if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
            erros.push({texto: 'Descrição inválida'})
        }
        if(!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null || req.body.categoria == 0){
            erros.push({texto: 'Categoria inválida'})
        }
        if(req.body.titulo.length < 2){
            erros.push({texto: 'Titulo muito pequeno'})
        }if(req.body.slug.length < 2){
            erros.push({texto: 'Slug muito pequeno'})
        }if(req.body.conteudo.length < 2){
            erros.push({texto: 'Conteudo muito pequeno'})
        }if(req.body.descricao.length < 2){
            erros.push({texto: 'Descricao muito pequena'})
        }if(req.body.categoria.length < 2){
            erros.push({texto: 'Categoria muito pequena'})
        }

        if(erros > 0){
            res.render('admin/addPostagem', erros)
        }else{
            new Postagem(novaPostagem).save().then(()=>{
                req.flash('error_success', 'Postagem criada com sucesso');
                res.redirect('/admin/postagens');
            }).catch((err)=>{
                req.flash('error_msg', 'Erro ao criar nova postagem');
                res.redirect('/admin/postagens');
            })
        }
    })

    router.get('/postagem/edit/:id', (req, res)=>{
        Postagem.findOne({_id: req.params.id}).then((postagem)=>{
            Categoria.find().then((categorias)=>{
                res.render('admin/editPostagem', {postagem:postagem, categorias:categorias});
            })

        })
    })

    router.post('/postagem/edit', (req, res)=>{
        Postagem.findOne({_id: req.body.id}).then((postagem)=>{

            var erros = [];

        if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){
            erros.push({texto: 'Titulo inválido'})
        }
        if(!req.body.slug || typeof req.body.slug == undefined || req.body.titulo == null){
            erros.push({texto: 'Slug inválido'})
        }
        if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){
            erros.push({texto: 'Conteúdo inválido'})
        }
        if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){
            erros.push({texto: 'Descrição inválida'})
        }
        if(!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null || req.body.categoria == 0){
            erros.push({texto: 'Categoria inválida'})
        }
        if(req.body.titulo.length < 2){
            erros.push({texto: 'Titulo muito pequeno'})
        }if(req.body.slug.length < 2){
            erros.push({texto: 'Slug muito pequeno'})
        }if(req.body.conteudo.length < 2){
            erros.push({texto: 'Conteudo muito pequeno'})
        }if(req.body.descricao.length < 2){
            erros.push({texto: 'Descricao muito pequena'})
        }if(req.body.categoria.length < 2){
            erros.push({texto: 'Categoria muito pequena'})
        }

        if(erros > 0){
            res.render('admin/editPostagem', erros)
        }else{
            postagem.titulo = req.body.titulo,
            postagem.conteudo = req.body.conteudo,
            postagem.descricao = req.body.descricao,
            postagem.slug = req.body.slug,
            postagem.categoria = req.body.categoria
            postagem.save().then(()=>{
                req.flash('success_msg', 'Categoria editada com sucesso!')
                res.redirect('/admin/postagens');
            }).catch((err)=>{
                req.flash('error_msg', 'Erro ao editar a postagem ' + err)
                res.redirect('/admin/postagens')
            })
        }
        })
    })

    router.post('/postagem/delete', (req, res)=>{
        Postagem.remove({_id: req.body.id}).then(()=>{
            req.flash('success_msg', "Postagem Deletada com sucesso!")
            res.redirect('/admin/postagens')
        }).catch((err)=>{
            req.flash('error_msg', 'Erro ao deletar a postagem' + err)
            res.redirect('/admin/postagens')
           })
    })

module.exports = router;