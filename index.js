const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const PORT = 3000;

const mysql = require('mysql');

const connect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});

connect.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

app.set('view engine', 'ejs')
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views/admin')));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: { maxAge: 60000 }
}));

app.listen(PORT, () => {
    console.log('port: *' + PORT);
})


app.use('/', (req, res, next) => {
    if (!req.session.name)
        req.session.name = 'khoa dep trai';
    next();
})

app.get('/', (req, res) => {
    //query và xử lí membersAddByMonth
    let quyen = 'admin';
    res.render(`${quyen}/index.ejs`, {
        href: '/',
        name: req.session.name,
        memberCount: 100,
        linkvideoCount: 10,
        linkcmtCount: 5,
        membersAddByMonth: [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1, 0]
    });
})

app.get('/quanliuser', (req, res) => {
    //query và xử lí list user
    let quyen = 'admin';
    res.render(`${quyen}/quanliuser.ejs`, {
        href: 'quanliuser',
        name: req.session.name,
        listUser: [{
                name: 'Khoa ko mlem',
                job: 'aaaa'
            },
            {
                name: 'binh le',
                job: 'bbbb'
            },
            {
                name: 'hung',
                job: 'ccccc'
            },
            {
                name: 'vu hoang anh',
                job: 'ddddd'
            },
            {
                name: 'le tuan anh',
                job: 'eeeee'
            },
            {
                name: 'no name',
                job: 'idk'
            }
        ]
    });
})

app.post('/quanliuser', (req, res)=>{
	//
})

app.get('/quanliadmin', (req, res) => {
    //query và xử lí 
    let quyen = 'admin';
    res.render(`${quyen}/quanliadmin.ejs`, {
        href: 'quanliadmin',
        name: req.session.name,
        listAdmin: [{
                name: 'alo',
                job: 'aaaa'
            },
            {
                name: '1',
                job: 'sssssssssssss'
            },
            {
                name: '2',
                job: 'rrrrrrrrr'
            },
            {
                name: '3',
                job: '3333333'
            },
            {
                name: '4',
                job: 'asdasd'
            },
            {
                name: 'donan jump',
                job: 'president'
            }
        ]
    });
})

app.get('/checkcmt', (req, res) => {
    let quyen = 'admin';
    res.render(`${quyen}/checkcmt.ejs`, { href: 'checkcmt', name: req.session.name });
})

app.get('/listlink', (req, res) => {
    let quyen = 'admin';
    res.render(`${quyen}/listlink.ejs`, { href: 'listlink', name: req.session.name });
})

app.get('/profile', (req, res) => {
    let quyen = 'admin';
    res.render(`${quyen}/profile.ejs`, { href: 'profile', name: req.session.name });
})

app.get('/linkvideo', (req, res) => {
    let quyen = 'admin';
    res.render(`${quyen}/linkvideo.ejs`, { href: 'linkvideo', name: req.session.name });
})

app.get('/linkcmt', (req, res) => {
    let quyen = 'admin';
    res.render(`${quyen}/linkcmt.ejs`, { href: 'linkcmt', name: req.session.name });
})