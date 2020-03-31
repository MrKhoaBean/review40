const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const PORT = 3000;

app.set('view engine', 'ejs')
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views/admin')));

app.listen(PORT, ()=>{
	console.log('port: *' + PORT);
})

app.get('/', (req, res)=>{
	res.render('admin/index.ejs');
})

app.get('/quanliuser', (req, res) => {
	res.render('admin/quanliuser.ejs');
})

app.get('/quanliadmin', (req, res) => {
	res.render('admin/quanliadmin.ejs');
})

app.get('/checkcmt', (req, res) => {
	res.render('admin/checkcmt.ejs');
})

app.get('/listlink', (req, res) => {
	res.render('admin/listlink.ejs');
})

app.get('/profile', (req, res) => {
	res.render('admin/profile.ejs');
})

app.get('/linkvideo', (req, res) => {
	res.render('admin/linkvideo.ejs');
})

app.get('/linkcmt', (req, res) => {
	res.render('admin/linkcmt.ejs');
})