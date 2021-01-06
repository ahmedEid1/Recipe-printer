const fs = require('fs');
const Papa = require('papaparse');

// change buttons colors
let printed = change_buttons_color();


// creating the sheet or load the data if exist
let sheet_data;
if(fs.existsSync("history/" + (get_day() + ".csv")) &&  fs.readFileSync("history/" + (get_day() + ".csv")).length !== 0) {
    let csv_data = fs.readFileSync("history/" + (get_day() + ".csv"), 'utf8', function (error, csv_data) {
        if (error) throw error;
    });

    sheet_data = Papa.parse(csv_data).data;
    for (let i = 0; i < sheet_data.length; i++) {
        sheet_data[i].shift();
    }

}else {
    const header = [
        'طباعة', 'المنتج', 'المقاس', 'الاجمالي', 'الكمية', 'ملاحظة',  'المحافظة', 'اسم العميل',
        'العنوان'  , 'الاكونت', 'رقم العميل', 'الصفحة', 'السيلز', "م"
    ];
    sheet_data = [header,];

    // default number of row to start with
    for (let i=1; i <= 300; i++){
        sheet_data.push(['', '', '', '', '', '',  '', '',
            ''  , '', '', '', '', i])
    }
}


const container = document.getElementById('the_sheet');
const hot = new Handsontable(container, {
    data: sheet_data,
    contextMenu: true,
    manualRowMove: true,
    bindRowsWithHeaders: 'strict',
    licenseKey: 'non-commercial-and-evaluation',
    cells: function(row, col) {
        const cellPrp = {};
        if (col === 0 && row !== 0) {
            cellPrp.renderer = myBtns;
            cellPrp.readOnly = true;
        }
        if (row === 0) {
            cellPrp.readOnly = true;
        }
        return cellPrp
    },
    afterChange: function(changes, source) {
        if(!changes) {
            return;
        }else {
            save_change();
        }
    }
});



function myBtns(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    td.innerHTML = '<button id="' + row + '" onclick="javascript:(function(e) {document.getElementById(\'num\').value = e.id;  document.getElementById(\'print_pdf\').submit();})(this)">' + "طباعة" + '</button>'

    for (let i = 0; i < printed.length; i++){
        if (row == printed[i]) {
            td.innerHTML = '<button style="background: red; color: black;" id="' + row + '" onclick="javascript:(function(e) {document.getElementById(\'num\').value = e.id;  document.getElementById(\'print_pdf\').submit();})(this)">' + "طباعة" + '</button>'
        }
    }

}
// document.getElementById('num').value = e.id;

//----------------------------------------------------------------------


function save_change() {

    let today = get_day()
    let filename = today + ".csv"

    let exportPlugin1 = hot.getPlugin('exportFile');
    var exportedString = exportPlugin1.exportAsString('csv', {
        bom: true,
        columnDelimiter: ',',
        columnHeaders: false,
        exportHiddenColumns: true,
        exportHiddenRows: true,
        rowDelimiter: '\r\n',
        rowHeaders: true
    });

    if(fs.existsSync("history/" + filename)) {
        fs.writeFileSync("history/" + filename, exportedString,'utf8',(err) => {
            if(err)
                console.log("not working")
        })

    } else {

        fs.writeFile("history/" + filename, exportedString,'utf8',(err) => {
            if(err)
                console.log(err)
        })
    }

}

function get_day() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    return dd + '_' + mm + '_' + yyyy;
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


let btn = document.querySelector('#clear_all')

Handsontable.dom.addEvent(btn, 'click', function () {
    let path = "history/" + get_day() + ".csv";
    let path1 = "history/" + "prints.txt";

    try {
        fs.truncate(path, 0, function(){console.log('done')})
        //file removed
    } catch(err) {
        console.error(err)
    }

    if(fs.existsSync("history/" + "prints.txt"))
        fs.truncate(path1, 0, function(){console.log('done')})

    try {
        //file removed
    } catch(err) {
        console.error(err)
    }

    document.getElementById('excel').submit();
});


function change_buttons_color() {
    if(fs.existsSync("history/" + "prints.txt")) {
        let data = fs.readFileSync("history/" + "prints.txt", 'utf8', function (error, csv_data) {
            if (error) throw error;
        });


        return data.split("\n")
    }
    return []
}



