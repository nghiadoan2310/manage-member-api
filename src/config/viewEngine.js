import express from 'express'


const viewEngine = (app) => {
    app.use(express.static('./src/public'))
    app.set('view engine', 'ejs')
    app.set('views', './src/views')
}

export default viewEngine