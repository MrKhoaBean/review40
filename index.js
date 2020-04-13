class SQLMessage {
    constructor() {
        this.arr = [];
    }

    add(text) {
        if (!!text)
            this.arr.push(text);
    }

    toArray() {
        return this.arr;
    }
}

function validForm(body, checkList, res) { // test lại những ô cần thiết có rổng hay ko
    let isValid = true;
    for (let e of checkList)
        if (!body[e]) {
            res.send({
                alert: 'dialog',
                data: {
                    icon: 'success',
                    title: 'Bạn đã sql injection thành công!',
                    text: 'mà đợi đã :D'
                }
            })
            isValid = false;
            break;
        }
    return isValid;
}

function addMemberCountByMonth(month, value) {
    connect.query('SELECT `membersByMonth` FROM `features` LIMIT 1', (error, result) => {
        let membersByMonth = JSON.parse(result[0].membersByMonth);
        membersByMonth[month] += value;
        connect.query('UPDATE `features` SET `membersByMonth` = ?', [JSON.stringify(membersByMonth)]);
    });
}

function addLinkCount(type) {
    connect.query('UPDATE `features` SET `link_' + type + '` = `link_' + type + '` + 1');
}

function MRES(str) { //mysql_real_escape_string
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function(char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\" + char; // prepends a backslash to backslash, percent,
                // and double/single quotes
            default:
                return char;
        }
    });
}

function checkError(error, result, where) {
    let ignoreList = ['ER_DUP_ENTRY'];
    if (error) {
        if (ignoreList.indexOf(error.code) == -1) {
            console.log(error);
            console.log('Lỗi ở chỗ: ' + where);
        }
        return error.code; // nếu bị lỗi hoặc query trả về mảng rỗng thì trả về true
    } else {
        return null;
    }
}

const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const random = require('random');
const md5 = require('md5');
const { v1: uuidv1 } = require('uuid');
const path = require('path');
const fs = require('fs');
const PORT = 7777;

const mysql = require('mysql');

const connect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'kiemtien40'
});

connect.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

let lines = process.stdout.getWindowSize()[1];
for (let i = 0; i < lines; i++) {
    console.log('\r\n');
}

let checkLoggedIn = function(req, res, next) {
    if (!req.session.username) // kiểm tra login chưa nếu chưa thì phải login
        res.redirect('/login');
    else {
        next();
    }
}

function prepareStaticFlat(config) {
    let { dir, checkLogin, checkPermission } = config;
    fs.readdirSync(path.join(__dirname, 'views', dir)).forEach(file => {
        let regex = /^(.*)\.ejs$/;

        if (regex.test(file)) { // nếu file đó là file ejs
            let subname = regex.exec(file)[1]; // lấy tên file (bỏ đuôi .ejs)
            app.use('/' + subname, express.static(path.join(__dirname, 'views', dir)));

            if (checkLogin)
                app.use('/' + subname, checkLoggedIn);

            if (checkPermission)
                app.use('/' + subname, (req, res, next) => {
                    // console.log(req.session.permission);
                    if (req.session.permission == dir)
                        next();
                    else
                        res.send('Bạn không phải là ' + dir);
                })

        }
    })
}

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: { maxAge: 1000 * 60 * 60 }
}));

app.listen(PORT, () => {
    console.log('port: *' + PORT);
})


let flatDir = [{
        dir: 'trangchu',
        checkLogin: false,
        checkPermission: false
    },
    {
        dir: 'admin',
        checkLogin: true,
        checkPermission: true
    },
    {
        dir: 'member',
        checkLogin: true,
        checkPermission: true
    }
];

for (let e of flatDir) {
    prepareStaticFlat(e);
}

app.use((req, res, next) => {

    next()
})

app.get('/', (req, res) => {
    if (!req.session.username)
        res.redirect('/trangchu');
    else {
        if (req.session.permission == "admin")
            res.redirect('/dashboard');
        else
            res.redirect('/home');
    }
})

app.get('/trangchu', (req, res) => {
    res.render('trangchu/trangchu.ejs');
})

app.use('/login', (req, res, next) => {
    if (req.session.username) {
        if (req.session.permission == "admin")
            res.redirect('/dashboard');
        else
            res.redirect('/home');
    } else
        next();
});
app.get('/login', (req, res) => {
    res.render('trangchu/login.ejs');
})
app.post('/login', (req, res) => {
    if (!validForm(req.body, ['username', 'password'], res)) return;
    let sqlMessages = new SQLMessage();
    connect.query("SELECT * FROM `account` WHERE `username` = ? AND `password` = ? LIMIT 1", [req.body.username, md5(req.body.password)], (error, result) => {
        sqlMessages.add(checkError(error, result, 'login'));
        if (result.length == 1) {
            let { name, username, permission, verify } = result[0];
            if (!verify && permission == "member")
                return res.send({
                    alert: 'dialog',
                    data: {
                        icon: 'error',
                        title: 'Tài khoản của bạn chưa được duyệt!'
                    }
                })
            req.session.name = name;
            req.session.username = username;
            req.session.permission = permission;
            if (result[0].permission == "admin")
                res.send({ redirect: '/dashboard' });
            else {
                res.send({ redirect: '/home' });
            }
        } else {
            res.send({
                alert: 'dialog',
                data: {
                    icon: 'error',
                    title: 'Tài khoản hoặc mật khẩu sai!'
                }
            })
        }
    })
})

app.get('/register', (req, res) => {
    res.render('trangchu/register.ejs');
})

app.post('/register', async (req, res) => { // phải thêm catpcha khúc này
    if (!validForm(req.body, ['name', 'email', 'username', 'password'], res)) return;
    let sqlMessages = new SQLMessage();
    let { name, username, password, email } = req.body;
    let madonhang = uuidv1();
    req.session.tmp = {
        name,
        username,
        password,
        email,
        madonhang
    }
    connect.query("INSERT INTO `account` (`name`, `username`, `password`, `email`, `madonhang`) VALUES (?, ?, ?, ?, ?)", [name, username, md5(password), email, madonhang], (error, result) => {
        sqlMessages.add(checkError(error, result, 'register'));
        if (sqlMessages.toArray().length == 0) {
            addMemberCountByMonth(new Date(Date.now()).getMonth(), 1); // tăng số lượng member đăng kí trong tháng này
            res.send({
                alert: 'dialog',
                data: {
                    icon: 'success',
                    title: 'Bạn đã tạo tài khoản thành công',
                    text: 'Vui lòng chuyển khoản cho phía bên admin để được duyệt tài khoản!',
                    preConfirm_stringcode: "location.assign('/confirm')",
                    confirmButtonText: "Thanh toán ngay!"
                }
            })
        } else {
            let text = sqlMessages.toArray().toString();
            if (text == "ER_DUP_ENTRY")
                text = "Tên tài khoản hoặc địa chỉ Email đã có người sử dụng!";
            res.send({
                alert: 'dialog',
                data: {
                    icon: 'error',
                    title: 'Có lỗi!!!',
                    text
                }
            })
        }
    })
})

app.get('/confirm', (req, res) => {
    if (!req.session.tmp)
        return res.redirect('/trangchu');
    let { name, username, password, email, madonhang } = req.session.tmp;
    req.session.destroy();
    res.render('trangchu/confirm.ejs', { name, username, password, email, madonhang });
})

app.get('/dashboard', (req, res) => {
    //query và xử lí membersMyMonth
    connect.query("SELECT count(*) FROM `account` WHERE `permission`='member' AND `verify` = '1' UNION ALL SELECT count(*) FROM `linkvideo` UNION ALL SELECT count(*) FROM `linkcmt`", (error, count) => {
        connect.query("SELECT `membersByMonth` FROM `features`", (error, result) => {
            let membersAddByMonth = JSON.parse(result[0].membersByMonth);
            let membersCount = count[0]['count(*)'];
            let linkvideoCount = count[1]['count(*)'];
            let linkcmtCount = count[2]['count(*)'];
            let quyen = req.session.permission;
            res.render(`${quyen}/dashboard.ejs`, {
                href: req.url,
                name: req.session.name,
                membersAddByMonth,
                membersCount,
                linkvideoCount,
                linkcmtCount
            });
        })
    })
})

app.get('/quanliuser', (req, res) => {
    connect.query("SELECT count(*) FROM `account` WHERE `permission`='member'", (error, result) => {
        checkError(error, result, 'get page count (member count / 6');
        let count = result[0]['count(*)'];
        let quyen = req.session.permission;
        res.render(`${quyen}/quanliuser.ejs`, {
            href: req.url,
            name: req.session.name,
            count
        });
    })
})

app.get('/quanliuser/getlist', (req, res) => {
    if (!validForm(req.query, ['page'], res)) return;
    let { page } = req.query;
    if (isNaN(page)) {
        res.send('bruh');
        return;
    }
    let offset = (Number(page) - 1) * 6;
    if (offset < 0) {
        res.send([]);
        return;
    }
    connect.query("SELECT * FROM `account` WHERE `permission`='member' ORDER BY `id` DESC LIMIT 6 OFFSET ?", [offset], (error, result) => {
        checkError(error, result, 'get list by page');
        let listUser = [];
        for (let user of result) {
            listUser.push({
                name: user.name,
                username: user.username,
                des: !user.verify ? "<b style='color:red'>Chưa chuyển khoản</b>" : ""
            })
        }
        res.send(listUser);
    })
})

app.get('/quanliuser/getalllist', (req, res) => {
    connect.query("SELECT * FROM `account` WHERE `permission`='member' ORDER BY `id` DESC", (error, result) => {
        checkError(error, result, 'get all list');
        let listUser = [];
        for (let user of result) {
            listUser.push({
                name: user.name,
                username: user.username,
                des: !user.verify ? "<b style='color:red'>Chưa chuyển khoản</b>" : ""
            })
        }
        res.send(listUser);
    })
})

app.post('/quanliuser/duyet', (req, res) => {
    if (!validForm(req.body, ['madonhang'], res)) return;

    let affectedRows = 0;
    let failed = false;
    connect.query("UPDATE `account` SET `verify` = 1 WHERE madonhang = ?", [req.body.madonhang], (error, result) => {
        checkError(error, result, 'duyet thanh vien');

        affectedRows = result.affectedRows;
        if (affectedRows > 0)
            failed = false;
        else
            failed = true;
        connect.query("SELECT `username` FROM `account` WHERE `madonhang` = ? LIMIT 1", [req.body.madonhang], (error, result) => {
            checkError(error, result, 'tim ten theo ma don hang');
            let username = "không tìm thấy";
            if (result.length > 0)
                username = result[0].username;
            res.send({
                username,
                failed
            });
        })
    });
})

app.post('/quanliuser/delete', (req, res) => {
    if (!validForm(req.body, ['username'], res)) return;

    connect.query("DELETE FROM `account` WHERE `username` = ?", [req.body.username], (error, result) => {
        checkError(error, result, 'xoa account');
        res.send({
            success: Boolean(result.affectedRows)
        })
        if (result.affectedRows > 0) {
            addMemberCountByMonth(new Date(Date.now()).getMonth(), -1);
        }
    })
})

//start of quanliadmin

app.get('/quanliadmin', (req, res) => {
    connect.query("SELECT count(*) FROM `account` WHERE `permission`='admin'", (error, result) => {
        checkError(error, result, 'get page count (admin count / 6');
        let count = result[0]['count(*)'];
        let quyen = req.session.permission;
        res.render(`${quyen}/quanliuser.ejs`, {
            href: req.url,
            name: req.session.name,
            count
        });
    })
})

app.get('/quanliadmin/getlist', (req, res) => {
    if (!validForm(req.query, ['page'], res)) return;
    let { page } = req.query;
    if (isNaN(page))
        return res.send('bruh');
    let offset = (Number(page) - 1) * 6;
    if (offset < 0) {
        res.send([]);
        return;
    }
    connect.query("SELECT * FROM `account` WHERE `permission`='admin' ORDER BY `id` DESC LIMIT 6 OFFSET ?", [offset], (error, result) => {
        checkError(error, result, 'get list by page - admin');
        let listAdmin = [];
        for (let admin of result) {
            listAdmin.push({
                name: admin.name,
                username: admin.username,
                des: admin.username == req.session.username ? "<b style='color:red'>Đây là bạn  &#9888;</b>" : ""
            })
        }
        let myIndex = listAdmin.findIndex(e => e.username == req.session.username);
        listAdmin.unshift(listAdmin[myIndex]);
        listAdmin.splice(myIndex + 1, 1);
        res.send(listAdmin);
    })
})

app.get('/quanliadmin/getalllist', (req, res) => {
    connect.query("SELECT * FROM `account` WHERE `permission`='admin' ORDER BY `id` DESC", (error, result) => {
        checkError(error, result, 'get all list');
        let listAdmin = [];
        for (let admin of result) {
            listAdmin.push({
                name: admin.name,
                username: admin.username,
                des: admin.username == req.session.username ? "<b style='color:red'>Đây là bạn  &#9888;</b>" : ""
            })
        }
        let myIndex = listAdmin.findIndex(e => e.username == req.session.username);
        listAdmin.unshift(listAdmin[myIndex]);
        listAdmin.splice(myIndex + 1, 1);
        res.send(listAdmin);
    })
})

app.post('/quanliadmin/duyet', (req, res) => {
    if (!validForm(req.body, ['madonhang'], res)) return;

    let affectedRows = 0;
    let failed = false;
    connect.query("UPDATE `account` SET `verify` = 1, `permission` = 'admin' WHERE madonhang = ?", [req.body.madonhang], (error, result) => {
        checkError(error, result, 'duyet thanh vien - admin');

        affectedRows = result.affectedRows;
        if (affectedRows > 0)
            failed = false;
        else
            failed = true;
        connect.query("SELECT `username` FROM `account` WHERE `madonhang` = ? LIMIT 1", [req.body.madonhang], (error, result) => {
            checkError(error, result, 'tim ten theo ma don hang');
            let username = "không tìm thấy"
            if (result.length > 0)
                username = result[0].username;
            res.send({
                username,
                failed
            });
        })
    });
})

app.post('/quanliadmin/delete', (req, res) => {
    if (!validForm(req.body, ['username'], res)) return;

    connect.query("DELETE FROM `account` WHERE `username` = ?", [req.body.username], (error, result) => {
        checkError(error, result, 'xoa account');
        res.send({
            success: Boolean(result.affectedRows)
        })
        if (result.affectedRows > 0) {
            addMemberCountByMonth(new Date(Date.now()).getMonth(), -1);
        }
    })
})

//end of quanliadmin

app.get('/checkcmt', (req, res) => {
    connect.query("SELECT * FROM `duyetcmt` WHERE `verify` = -1 ORDER BY `id` ASC", (error, result) => {
        checkError(error, result, "lay duyet cmt");
        let quyen = 'admin';
        res.render(`${quyen}/checkcmt.ejs`, {
            href: req.url,
            name: req.session.name,
            listCheck: result
        });
    })

})

app.post('/checkcmt', (req, res) => {
    if (!validForm(req.body, ['id', 'method'], res)) return;
    let { id, method } = req.body;
    let verify = 0;
    if (method.toString() == "true")
        verify = 1;
    connect.query("UPDATE `duyetcmt` SET `verify` = ? WHERE `id` = ? AND `verify` = -1", [verify, id], (error, result) => {
        checkError(error, result, "duyet cmt (true/false)");
        if (result.affectedRows > 0) {
            if (verify == 1) {
                connect.query("SELECT * FROM `duyetcmt` WHERE `id` = ?", [id], (error, duyetResult) => {
                    if (duyetResult.length > 0) {
                        connect.query("UPDATE `account` SET `money` = `money` + ? WHERE `username` = ?", [duyetResult[0].bonus, duyetResult[0].username]);
                        console.log('cong them cho user: ' + duyetResult[0].username + ' so tien: ' + duyetResult[0].bonus);
                    }
                })
            }
            res.send({
                alert: "dialog",
                data: {
                    icon: "success"
                }
            })
        } else {
            res.send({
                alert: "dialog",
                data: {
                    icon: "info",
                    title: "Thông báo!",
                    text: "Bình luận này đã được phê duyệt!"
                }
            })
        }

    })

})

app.get('/listlink', (req, res) => {
    let list = [];
    connect.query("SELECT * FROM `linkvideo` ORDER BY `id` DESC", (error, listVideo) => {
        connect.query("SELECT * FROM `linkcmt` ORDER BY `id` DESC", (error, listCmt) => {
            list = listVideo.concat(listCmt);
            list.sort((a, b) => a.id - b.id);
            let quyen = 'admin';
            res.render(`${quyen}/listlink.ejs`, {
                href: req.url,
                name: req.session.name,
                list
            });
        })
    })
})

app.post('/listlink/delete', (req, res) => {
    if (!validForm(req.body, ['id', 'type'], res)) return;
    let { id, type } = req.body;
    if (['Video', 'Comment'].indexOf(type) == -1)
        return res.send({
            alert: "dialog",
            data: {
                title: "Lỗi",
                icon: "error",
                text: "Hãy thử tải lại trang!"
            }
        })
    type = (type == "Video") ? 'video' : 'cmt';
    connect.query("DELETE FROM `link" + type + "` WHERE `id` = ?", [id], (error, result) => {
        checkError(error, result, "xoa link");
        if (result.affectedRows > 0)
            res.send({
                alert: "dialog",
                data: {
                    title: "Thông báo!",
                    text: "Đã xóa 1 link!",
                    icon: "info"
                }
            })
        else
            res.send({
                alert: "dialog",
                data: {
                    title: "Lỗi!",
                    text: "Không tìm thấy link (có thể đã bị xóa)",
                    icon: "error"
                }
            })
    })
})

app.post('/listlink/edit', (req, res) => {
    if (!validForm(req.body, ['url', 'bonus', 'id', 'type'], res)) return;
    let { url, bonus, id, type } = req.body;
    if (isNaN(bonus) || ['Video', 'Comment'].indexOf(type) == -1)
        return res.send({
            alert: "dialog",
            data: {
                title: "Lỗi",
                icon: "error",
                text: "Hãy thử tải lại trang!"
            }
        })

    type = (type == "Video") ? 'video' : 'cmt';
    let sqlmessages = new SQLMessage();
    connect.query("UPDATE `link" + type + "` SET `url` = ?, `bonus` = ? WHERE `id` = ?", [url, bonus, id], (error, result) => {
        sqlmessages.add(checkError(error, result, "update link (chinh sua)"));
        if (sqlmessages.toArray().toString() == "ER_DUP_ENTRY")
            return res.send({
                alert: "dialog",
                data: {
                    title: "Lỗi!",
                    text: "Trùng url trước đây!!",
                    icon: "error",
                    allowOutsideClick: false
                }
            })

        if (result.affectedRows > 0)
            res.send({
                alert: "dialog",
                data: {
                    title: "Thành công",
                    text: "Đã thay đổi!",
                    icon: "success"
                }
            })
        else
            res.send({
                alert: "dialog",
                data: {
                    title: "Lỗi!",
                    text: "Không tìm thấy link (có thể đã bị xóa)",
                    icon: "error",
                    allowOutsideClick: false
                }
            })
    })
})

app.get('/profile', (req, res) => {
    if (!req.session.username) return res.send('where is username?');
    connect.query("SELECT * FROM `account` WHERE `username` = ? LIMIT 1", [req.session.username], (error, result) => {
        //khúc này không check length result vì middleware đã kiểm tra rồi
        checkError(error, result, 'lay profile theo username')
        let quyen = req.session.permission;
        let { username, name, email } = result[0];
        res.render(`${quyen}/profile.ejs`, {
            href: req.url,
            username,
            name,
            email
        });
    })

})

app.post('/profile', (req, res) => {
    if (!validForm(req.body, ['oldPassword'], res)) return;
    if (req.body.password)
        req.body.password = md5(req.body.password);
    req.body.oldPassword = md5(req.body.oldPassword);
    let list = ['name', 'username', 'email', 'password']; // password luôn ở cuối nếu không thì khi oldpassword đổi thành password thì mấy thằng phía sau ko đổi đc
    let queue = list.length;
    let affected = [];
    let sqlmessages = new SQLMessage();
    connect.query("SELECT * FROM `account` WHERE `username` = ? AND `password` = ?", [req.session.username, req.body.oldPassword], (error, result) => {
        if (result.length <= 0) {
            return res.send({
                alert: "dialog",
                data: {
                    title: "Lỗi",
                    text: "Sai mật khẩu!",
                    icon: "error"
                }
            })
        }

        for (let e of list) {
            if (!!req.body[e])
                connect.query("UPDATE `account` SET `" + e + "` = ? WHERE `username` = ? AND `" + e + "` <> ? AND `password` = ?", [req.body[e], req.session.username, req.body[e], req.body.oldPassword], (error, result) => {
                    if (result.affectedRows > 0) {
                        if (e == "username")
                            req.session.username = req.body[e];
                        affected.push(e);
                    }
                    sqlmessages.add(checkError(error, result, 'update thong tin ca nhan'));
                    queue--;
                    if (queue == 0) {
                        if (sqlmessages.length > 0)
                            res.send({
                                alert: "dialog",
                                data: {
                                    title: "Có lỗi!",
                                    text: "Lỗi: " + sqlmessages.toArray().toString(),
                                    icon: "error"
                                }
                            });
                        else
                            res.send({
                                alert: "dialog",
                                data: {
                                    title: "Thông báo!",
                                    text: affected.length > 0 ? "Đã cập nhật: " + affected.toString().split(',').join(', ') : "Không có gì thay đổi!",
                                    icon: "info"
                                }
                            });
                    }
                });
            else
                queue--;
        }

    })

})

app.get('/linkvideo', (req, res) => {
    let quyen = 'admin';
    res.render(`${quyen}/linkvideo.ejs`, {
        href: req.url,
        name: req.session.name
    });
})

app.post('/linkvideo', (req, res) => {
    if (!validForm(req.body, ['url', 'minutes', 'bonus'], res)) return;
    let { url, minutes, bonus } = req.body;
    let sqlmessages = new SQLMessage();
    connect.query("INSERT `linkvideo` (`url`, `minutes`, `bonus`) VALUES (?, ?, ?)", [url, minutes, bonus], (error, result) => {
        sqlmessages.add(checkError(error, result, 'add link video'));
        if (sqlmessages.toArray().toString() == "ER_DUP_ENTRY")
            res.send({
                alert: "toast",
                data: {
                    icon: "error",
                    title: "Lỗi!!",
                    text: "Trùng url trước đây"
                }
            })
        else
            res.send({
                alert: "toast",
                data: {
                    icon: "success",
                    title: "Thành công!!",
                    text: "Đã thêm 1 link video"
                }
            })
    })
})

app.get('/linkcmt', (req, res) => {
    let quyen = 'admin';
    res.render(`${quyen}/linkcmt.ejs`, {
        href: req.url,
        name: req.session.name
    });
})

app.post('/linkcmt', (req, res) => {
    if (!validForm(req.body, ['url', 'noidung', 'bonus'], res)) return;
    let { url, noidung, bonus } = req.body;
    noidung = escape(noidung).split('%0D%0A');
    for (let i in noidung)
        noidung[i] = unescape(noidung[i]);
    let sqlmessages = new SQLMessage();
    connect.query("INSERT `linkcmt` (`url`, `noidung`, `bonus`) VALUES (?, ?, ?)", [url, JSON.stringify(noidung), bonus], (error, result) => {
        sqlmessages.add(checkError(error, result, 'add link binh luan'));
        if (sqlmessages.toArray().toString() == "ER_DUP_ENTRY")
            res.send({
                alert: "toast",
                data: {
                    icon: "error",
                    title: "Lỗi!!",
                    text: "Trùng url trước đây"
                }
            })
        else
            res.send({
                alert: "toast",
                data: {
                    icon: "success",
                    title: "Thành công!!",
                    text: "Đã thêm 1 link bình luận"
                }
            })
    })
})



//========================MEMBER=============================

app.use('/', (req, res, next) => {
    req.session.permission = "member";
    req.session.username = "khoadau";
    req.session.name = "test name";
    if (req.session.permission == "member") {
        connect.query("SELECT `bonus` FROM `duyetcmt` WHERE `username` = ? AND verify = -1", [req.session.username], (error, bonusResult) => {
            connect.query("SELECT `money` FROM `account` WHERE `username` = ?", [req.session.username], (error, moneyResult) => {
                req.session.choduyet = 0;
                for (let e of bonusResult) {
                    req.session.choduyet += e.bonus;
                }
                req.session.money = moneyResult[0].money;
                next()
            })
        })
    } else
        next();
})

app.get('/home', (req, res) => {
    let quyen = req.session.permission;
    connect.query("SELECT `cmt` FROM `account` WHERE `username` = ? UNION ALL SELECT `video` FROM `account` WHERE `username` = ?", [req.session.username, req.session.username], (error, result) => {
        let cmtArr, videoArr;
        try {
            cmtArr = JSON.parse(result[0]['cmt']);
        } catch (e) {
            cmtArr = [];
            connect.query("UPDATE `account` SET `cmt` = '[]' WHERE `username` = ?", [req.session.username]);
        }
        try {
            videoArr = JSON.parse(result[1]['cmt']); // mượn cột cmt (xài UNION ALL)
        } catch (e) {
            videoArr = [];
            connect.query("UPDATE `account` SET `video` = '[]' WHERE `username` = ?", [req.session.username]);
        }
        res.render(`${quyen}/home.ejs`, {
            name: req.session.name,
            href: '/home',
            choduyet: req.session.choduyet,
            money: req.session.money,
            solinkdabinhluan: cmtArr.length,
            sovideodaxem: videoArr.length
        });
    })
})

app.get('/cmtvideo', (req, res) => {
    connect.query("SELECT `cmt` FROM `account` WHERE `username` = ?", [req.session.username], (error, account) => {
        let { cmt } = account[0];
        try { cmt = JSON.parse(cmt); } catch (e) { cmt = [] }
        connect.query("SELECT * FROM `linkcmt` ORDER BY `id` ASC", (error, result) => {
            checkError(error, result, "lay linkcmt cho member");
            let able = [];
            let maxCount = 10;
            let count = 0;
            for (let r of result) {
                count++;
                if (count > maxCount && able.length > 0)
                    break;
                let { noidung, bonus, url } = r;
                if (cmt.indexOf(url) != -1)
                    continue;
                try {
                    noidung = JSON.parse(noidung);
                    noidung = noidung[random.int(0, noidung.length - 1)];
                } catch (e) {}
                able.push({
                    noidung,
                    bonus,
                    url
                });
            }

            if (able.length <= 0) {
                let quyen = req.session.permission;
                return res.render(`${quyen}/cmtvideo.ejs`, {
                    name: req.session.name,
                    href: '/cmtvideo',
                    choduyet: req.session.choduyet,
                    money: req.session.money,
                    none: true
                });
            }

            let { noidung, bonus, url } = able[random.int(0, able.length - 1)];
            req.session.cmtvideo = {
                noidung,
                bonus,
                url
            }

            let quyen = req.session.permission;
            res.render(`${quyen}/cmtvideo.ejs`, {
                name: req.session.name,
                href: '/cmtvideo',
                choduyet: req.session.choduyet,
                money: req.session.money,
                noidung,
                bonus,
                url
            });
        })
    })
})

let addCmt = (req, url) => {
    return new Promise((resolve, reject) => {
        connect.query("SELECT `cmt` FROM `account` WHERE `username` = ?", [req.session.username], (error, result) => {
            checkError(error, result, "doi array cmt");
            if (result.length <= 0)
            	reject();
            let cmtArr;
            try { cmtArr = JSON.parse(result[0].cmt); } catch (e) { cmtArr = [] }
            if (cmtArr.indexOf(url) != -1) {
                reject();
            } else {
                cmtArr.push(url);
                resolve(cmtArr);
            }
        })
    })
}

app.post('/cmtvideo', (req, res) => { // phải thêm catpcha khúc này
    if (!req.session.cmtvideo)
        return res.send({
            alert: "dialog",
            data: {
                title: "Lỗi!",
                text: "Đã gặp lỗi, hãy thử tải lại trang!",
                icon: "error"
            }
        });
    if (!validForm(req.body, ['cmtUrl'], res)) return;
    let { noidung, bonus, url } = req.session.cmtvideo;
    let { cmtUrl } = req.body;
    addCmt(req, url).then((cmtArr) => {
        let sqlMessages = new SQLMessage();
        connect.query("INSERT INTO `duyetcmt` (`url`, `username`, `bonus`, `noidung`) VALUES (?, ?, ?, ?)", [cmtUrl, req.session.username, bonus, noidung], (error, result) => {
            sqlMessages.add(checkError(error, result, "insert vao bang duyetcmt"));

            if (sqlMessages.toArray().toString() == "ER_DUP_ENTRY")
                return res.send({
                    alert: "dialog",
                    data: {
                        title: "Lỗi!",
                        text: "Trùng url cmt trước đây!",
                        icon: "error"
                    }
                });

            req.session.cmtvideo = undefined;
            connect.query("UPDATE `account` SET `cmt` = ? WHERE `username` = ?", [JSON.stringify(cmtArr), req.session.username], (error, result) => {
                res.send({
                    alert: "dialog",
                    data: {
                        title: "Thành công!",
                        text: "Hãy chờ các admin duyệt cmt của bạn!",
                        icon: "success",
                        preconfirm_string: "location.assign('.');"
                    }
                });
            })

        })
    }).catch(() => {
        res.send({
            alert: "dialog",
            data: {
                title: "Lỗi!",
                text: "Bạn đã cmt link này, hãy thử tải lại trang!",
                icon: "error"
            }
        });
    })
})

app.get('/xemvideo', (req, res) => {
    connect.query("SELECT `video` FROM `account` WHERE `username` = ?", [req.session.username], (error, account) => {
        let { video: videosWatched } = account[0];
        try { videosWatched = JSON.parse(videosWatched); } catch (e) { videosWatched = [] }
        connect.query("SELECT * FROM `linkvideo` ORDER BY `id` ASC", (error, result) => {
            checkError(error, result, "lay linkvideo cho member");
            let ableVideos = []; // tất cả các video available
            let maxCount = 5;
            let count = 0;
            for (let r of result) {
                if (count >= maxCount) // giới hạn count, tăng tốc độ khi query về mảng nhiều kinh khủng
                    break;

                let { url, minutes, bonus } = r;

                if (videosWatched.indexOf(url) != -1) // nếu đã có rồi thì bỏ qua
                    continue;

                ableVideos.push({
                    url,
                    minutes,
                    bonus
                });
            }

            if (ableVideos.length <= 0) { // nếu dò hết mảng mà không có thì send cái này:
                let quyen = req.session.permission;
                return res.render(`${quyen}/xemvideo.ejs`, {
                    name: req.session.name,
                    href: '/xemvideo',
                    choduyet: req.session.choduyet,
                    money: req.session.money,
                    none: true
                });
            }

            let { url, minutes, bonus } = ableVideos[random.int(0, ableVideos.length - 1)];

            req.session.xemvideo = {
                url,
                minutes,
                bonus,
                timeStart: 2 * Date.now()
            }

            let quyen = req.session.permission;
            res.render(`${quyen}/xemvideo.ejs`, {
                name: req.session.name,
                href: '/xemvideo',
                choduyet: req.session.choduyet,
                money: req.session.money,
                url,
                minutes,
                bonus
            });
        })
    })
})

let addVideo = (req, url) => {
    return new Promise((resolve, reject) => {
        connect.query("SELECT `video` FROM `account` WHERE `username` = ?", [req.session.username], (error, result) => {
            checkError(error, result, "doi array video");

            if (result.length <= 0) {
                reject();
            }

            let videoArr; // mảng video đã xem
            try { videoArr = JSON.parse(result[0].video); } catch (e) { videoArr = [] }
            if (videoArr.indexOf(url) != -1) { // đã có url đó trong list
                reject(); // xem rồi thì reject
            } else { //thêm video url nếu chưa xem
                videoArr.push(url);
                connect.query("UPDATE `account` SET `video` = ? WHERE `username` = ?", [JSON.stringify(videoArr), req.session.username], (error, result) => {
                    resolve();
                })
            }
        })
    })
}

app.post('/xemvideo/stop', (req, res) => {
    req.session.xemvideo.timeStart = 2 * Date.now();
    res.sendStatus(200);
})

app.post('/xemvideo/start', (req, res) => {
    req.session.xemvideo.timeStart = Date.now();
    res.sendStatus(200);
})

app.post('/xemvideo', (req, res) => { // kiểm tra xem "xem video hợp lí chưa"
    if (!validForm(req.session.xemvideo, ['url', 'minutes', 'bonus', 'timeStart'], res)) return;

    let { url, minutes, bonus, timeStart } = req.session.xemvideo;
    let minutesCount = (Date.now() - timeStart) / 1000 / 60;
    if (minutesCount >= minutes) { // nếu xem đủ thời gian
        addVideo(req, url).then(() => { // nếu chưa xem video
            connect.query('UPDATE `account` SET `money` = `money` + ? WHERE `username` = ?', [bonus, req.session.username], (error, result) => {
                console.log('cong them cho user: ' + req.session.username + ' so tien: ' + bonus);
                res.send({
                    alert: "dialog",
                    data: {
                        title: "Chúc mừng!",
                        text: "Số dư tài khoản của bạn được cộng thêm: " + bonus.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 'vnđ',
                        icon: "success"
                    }
                })
            });
        }).catch(() => { // nếu đã xem video rồi
            res.send({
                alert: "dialog",
                data: {
                    title: "Lỗi",
                    text: "Có vẻ như bạn đã xem video này, vui lòng tải lại trang!",
                    icon: "error"
                }
            })
        })
        req.session.xemvideo = undefined;
    } else { // nếu không xem đủ thời gian
        res.send({
            alert: "dialog",
            data: {
                title: "Lỗi",
                text: "Có vẻ như bạn đã không xem hết thời gian quy định của video, vui lòng thử lại!",
                icon: "error"
            }
        })
    }
})

app.get('/ruttien', (req, res) => {
    let quyen = req.session.permission;
    res.render(`${quyen}/ruttien.ejs`, {
        name: req.session.name,
        href: '/ruttien',
        choduyet: req.session.choduyet,
        money: req.session.money
    });
})


//==================END OF MEMBER==================

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/trangchu');
})

app.get('*', function(req, res) {
    res.send('404 page not found');
});