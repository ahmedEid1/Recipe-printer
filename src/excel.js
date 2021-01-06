const fs = require('fs');
const Papa = require('papaparse');

// the buttons of the row that have been printed
let printed = printed_row();

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

// building the sheet
const container = document.getElementById('the_sheet');
const hot = new Handsontable(container, {
    data: sheet_data,
    contextMenu: true,
    manualRowMove: true,
    bindRowsWithHeaders: 'strict',
    licenseKey: 'non-commercial-and-evaluation',
    cells: function(row, col) {
        const cellPrp = {};

        // the first column is the print buttons
        if (col === 0 && row !== 0) {
            cellPrp.renderer = myBtns;
            cellPrp.readOnly = true;
        }

        // the first row is header can not be changed
        if (row === 0) {
            cellPrp.readOnly = true;
        }
        return cellPrp
    },
    afterChange: function(changes, source) {
        if(changes)
            // save changes to the pdf file
            save_change();
    }
});


// onClick clear the sheet_data file and print history and refresh the page
let btn = document.querySelector('#clear_all')

Handsontable.dom.addEvent(btn, 'click', function () {
    let path = "history/" + get_day() + ".csv";
    let path1 = "history/" + "prints.txt";

    // remove the data of the sheet
    try {
        fs.truncate(path, 0, function(){console.log('done')})
        //file removed
    } catch(err) {
        console.error(err)
    }

    // clear the print history
    try {
        if(fs.existsSync("history/" + "prints.txt"))
            fs.truncate(path1, 0, function(){console.log('done')})

        //file removed
    } catch(err) {
        console.error(err)
    }

    // return to the home page
    document.getElementById('excel').submit();
});




// helper functions

// ok
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

    // if the file exists save to it else create it and write to it
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

// ok
function printed_row() {
    if(fs.existsSync("history/" + "prints.txt")) {
        let data = fs.readFileSync("history/" + "prints.txt", 'utf8', function (error, csv_data) {
            if (error) throw error;
        });

        return data.split("\n")
    }
    return []
}

function myBtns(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);

    // every button carry the row number and onClick should call printPdf with the number of the row
    td.innerHTML = '<button id="' + row + '" onclick="javascript:(function(e) {document.getElementById(\'num\').value = e.id;  document.getElementById(\'print_pdf\').submit();})(this)">' + "طباعة" + '</button>'

    // if the row is in the printed history add custom style to it
    for (let i = 0; i < printed.length; i++){
        if (row == printed[i]) {
            td.innerHTML = '<button style="background: red; color: black;" id="' + row + '" onclick="javascript:(function(e) {document.getElementById(\'num\').value = e.id;  document.getElementById(\'print_pdf\').submit();})(this)">' + "طباعة" + '</button>'
        }
    }

}



