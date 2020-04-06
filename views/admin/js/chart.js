// $(function () {
//     "use strict";

//     var myChart = Highcharts.chart('chart', {
//         chart: {
//             type: 'areaspline'
//         },
//         title: {
//             text: 'THỐNG KÊ'
//         },
//         xAxis: {
//             categories: ['1', '2', '3','4', '5', '6']
//         },
//         yAxis: {
//             title: {
//                 text: 'Số thành viên'
//             }
//         },
//         series: [{
//             name: 'Số thành viên tạo tài khoản theo tháng',
//             data: [10,4,3,4,17,10,30,44,33,50,90,5,13]
//         }]
//     });
// });

$(function() {
    "use strict";

    var myChart = Highcharts.chart('chart', {
        chart: {
            type: 'areaspline'
        },
        title: {
            text: 'THỐNG KÊ'
        },
        xAxis: {
            categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        },
        yAxis: {
            title: {
                text: 'Số thành viên'
            }
        },
        series: [{
            name: 'Số thành viên tạo tài khoản theo tháng',
            data: membersAddByMonth
        }]
    });
});