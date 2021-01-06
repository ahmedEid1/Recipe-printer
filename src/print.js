const fs = require('fs');
const Papa = require('papaparse');

// creating the sheet and load the data if exist
let sheet_data;
if (fs.existsSync("history/" + (get_day() + ".csv"))) {
    let csv_data = fs.readFileSync("history/" + (get_day() + ".csv"), 'utf8', function (error, csv_data) {
        if (error) throw error;
    });

    sheet_data = Papa.parse(csv_data).data;
    for (let i = 0; i < sheet_data.length; i++) {
        sheet_data[i].shift();
    }
}

// getting the data of the line to print
line = get('num');
data = sheet_data[line]
show_bill(data)


// helper functions
// ok
function show_bill(data) {
    const bill = document.getElementById('bill');

    let note = document.getElementById('note')
    note.innerHTML = data[5];

    let address = document.getElementById('address')
    address.innerHTML = data[8];

    let state = document.getElementById('state')
    state.innerHTML = data[6];

    let phone = document.getElementById('phone')
    phone.innerHTML = data[10];

    let product = document.getElementById('product')
    product.innerHTML = data[1];

    let size = document.getElementById('size')
    size.innerHTML = data[2];

    let amount = document.getElementById('amount')
    amount.innerHTML = data[4];

    let total = document.getElementById('total')
    total.innerHTML = data[3];

    let sales = document.getElementById('sales')
    sales.innerHTML = data[12];

    let account = document.getElementById('account')
    account.innerHTML = data[9];

    let page = document.getElementById('page')
    page.innerHTML = data[11];

    let client = document.getElementById('client')
    client.innerHTML = data[7];

    let date = document.getElementById('date')
    date.innerHTML = get_day();

    let bill_num = document.getElementById('bill_num');
    bill_num.innerHTML = get_bill_num();

}
// not really
function get(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search))
        return decodeURIComponent(name[1]);
}
// ok
function get_day() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    return dd + '_' + mm + '_' + yyyy;
}
// ok
function print_pdf() {
    // adding to the print history
    if (fs.existsSync("history/" + "prints.txt")) {
        fs.appendFileSync("history/" + "prints.txt", line + "\n", 'utf8', (err) => {
            if (err)
                console.log(err)
        })

    } else {

        fs.writeFile("history/" + "prints.txt", line + "\n", 'utf8', (err) => {
            if (err)
                console.log(err)
        })
    }

    // changing the content of the page to the printed contented
    const printContents = document.getElementById("bill").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();

    // return the page to its original form
    document.body.innerHTML = originalContents;
}
// ok
function get_bill_num() {
    let date = new Date();

    let currentHours = date.getHours();
    currentHours = ("0" + currentHours).slice(-2);

    let currentMinute = date.getMinutes();
    currentMinute = ("0" + currentminute).slice(-2);

    let currentSecond = date.getSeconds();
    currentSecond = ("0" + currentSecond).slice(-2);

    let currentDay = date.getDate();
    currentDay = ("0" + currentDay).slice(-2);

    let currentMonth = date.getMonth() + 1;
        currentMonth = ("0" + currentMonth).slice(-2)

    return currentMonth + "" + currentDay + "" + currentHours + "" + currentMinute + "" + currentSecond
}
// ok
function go_back() {
    document.getElementById('excel').submit();
}

