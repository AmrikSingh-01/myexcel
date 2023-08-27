// blur works before click

let toc=0;
let myown="";
let defaultProperties = {
    "text": "",
    "font-weight": "",
    "font-style": "",
    "text-decoration": "",
    "text-align": "left",
    "background-color": "#ffffff",
    "color": "#000000",
    "font-family": "Noto Sans",
    "font-size": "min(calc(20vw / 10),calc(20vh / 10))"
}
let cellData = {
    "Sheet1": {

    }
}
let selectedSheet = "Sheet1";
let lastlyAddedSheet = 1;
let totalSheets = 1;

$(document).ready(function () {

    let cellContainer = $(".input-cell-container");
    for (let i = 1; i <= 100; i++) {
        let ans = "";
        let n = i;
        while (n > 0) {
            let rem = n % 26;
            if (rem == 0) {
                ans = "Z" + ans;
                n = Math.floor(n / 26) - 1;
            }
            else {
                ans = String.fromCharCode(rem - 1 + 65) + ans;
                n = Math.floor(n / 26);
            }
        }
        let column = $(`<div class="column-name colid-${i}" id="${ans}">${ans}</div>`);
        $(".column-name-container").append(column);
        let row = $(`<div class="row-name">${i}</div>`)
        $(".row-name-container").append(row);
    }
    $(".column-name-container").append($(`<div class="column-name"></div>`));
    $(".row-name-container").append($(`<div class="row-name"></div>`));
    for (let i = 1; i <= 100; i++) {
        let row = $(`<div class="cell-row"></div>`);
        for (let j = 1; j <= 100; j++) {
            let colcode = $(`.colid-${j}`).attr("id");
            let column = $(`<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data="code-${colcode}"></div>`);
            row.append(column);
        }
        $(".input-cell-container").append(row);
    }

    $(".input-cell-container").on('scroll', function () {
        let scrollLeftValue = $(this).scrollLeft();
        let scrollTopValue = $(this).scrollTop();
        $(".column-name-container").scrollLeft(scrollLeftValue);
        $(".row-name-container").scrollTop(scrollTopValue)
    });

    $(".align-icon").click(function () {
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
    });
    $(".style-icon").click(function () {
        $(this).toggleClass("selected");
    });

    $(".input-cell").click(function (e) {
        let [rowid, colid] = getRowCol($(this));

        if (e.ctrlKey) {
            if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
                if (rowid > 1) {
                    let topcellselected = $(`#row-${rowid - 1}-col-${colid}`).hasClass("selected");
                    if (topcellselected) {
                        $(`#row-${rowid - 1}-col-${colid}`).removeClass("bottom-cell-selected");
                    }
                }
                if (rowid < 100) {
                    let bottomcellselected = $(`#row-${rowid + 1}-col-${colid}`).hasClass("selected");
                    if (bottomcellselected) {
                        $(`#row-${rowid + 1}-col-${colid}`).removeClass("top-cell-selected");
                    }
                }
                if (colid > 1) {
                    let leftcellselected = $(`#row-${rowid}-col-${colid - 1}`).hasClass("selected");
                    if (leftcellselected) {
                        $(`#row-${rowid}-col-${colid - 1}`).removeClass("right-cell-selected");
                    }
                }
                if (colid < 100) {
                    let rightcellselected = $(`#row-${rowid}-col-${colid + 1}`).hasClass("selected");
                    if (rightcellselected) {
                        $(`#row-${rowid}-col-${colid + 1}`).removeClass("left-cell-selected");
                    }
                }
            }
            else {
                if (rowid > 1) {
                    let topcellselected = $(`#row-${rowid - 1}-col-${colid}`).hasClass("selected");
                    if (topcellselected) {
                        $(this).addClass("top-cell-selected");
                        $(`#row-${rowid - 1}-col-${colid}`).addClass("bottom-cell-selected");
                    }
                }
                if (rowid < 100) {
                    let bottomcellselected = $(`#row-${rowid + 1}-col-${colid}`).hasClass("selected");
                    if (bottomcellselected) {
                        $(this).addClass("bottom-cell-selected");
                        $(`#row-${rowid + 1}-col-${colid}`).addClass("top-cell-selected");
                    }
                }
                if (colid > 1) {
                    let leftcellselected = $(`#row-${rowid}-col-${colid - 1}`).hasClass("selected");
                    if (leftcellselected) {
                        $(this).addClass("left-cell-selected");
                        $(`#row-${rowid}-col-${colid - 1}`).addClass("right-cell-selected");
                    }
                }
                if (colid < 100) {
                    let rightcellselected = $(`#row-${rowid}-col-${colid + 1}`).hasClass("selected");
                    if (rightcellselected) {
                        $(this).addClass("right-cell-selected");
                        $(`#row-${rowid}-col-${colid + 1}`).addClass("left-cell-selected");
                    }
                }
                $(this).addClass("selected");

            }
        }
        else {
            $(".input-cell.selected").removeClass("selected");
            $(this).addClass("selected");
            for (let i = 1; i <= 100; i++) {
                for (let j = 1; j <= 100; j++) {
                    if ($(`#row-${i}-col-${j + 1}`).hasClass("left-cell-selected")) {
                        $(`#row-${i}-col-${j + 1}`).removeClass("left-cell-selected")
                    }
                    if ($(`#row-${i - 1}-col-${j}`).hasClass("bottom-cell-selected")) {
                        $(`#row-${i - 1}-col-${j}`).removeClass("bottom-cell-selected")
                    }
                    if ($(`#row-${i + 1}-col-${j}`).hasClass("top-cell-selected")) {
                        $(`#row-${i + 1}-col-${j}`).removeClass("top-cell-selected")
                    }
                    if ($(`#row-${i}-col-${j - 1}`).hasClass("right-cell-selected")) {
                        $(`#row-${i}-col-${j - 1}`).removeClass("right-cell-selected")
                    }
                }
            }

            
        }
        changeHeader(this);
        if ($('.input-cell.selected').length) {
            if ($(this).hasClass("selected")) {
                $(".formula-input").text($(this).text());
                $('.selected-cell').text($(this).attr("data").split("-")[1] + rowid);
            }
            else {
                $(".formula-input").text($(".input-cell.selected").text());
                let [rowid, colId] = getRowCol($(".input-cell.selected"));
                $('.selected-cell').text($(".input-cell.selected").attr("data").split("-")[1] + rowid);
            }
        }
        else {
            $(".formula-input").text("");
            $('.selected-cell').text("");
            $(this).attr("contenteditable", "false");
        }
    });


    $(".input-cell").dblclick(function () {


        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
        $(this).attr("contenteditable", "true");
        // $(this).focus();
        moveCursorToEnd($(this));
    })
    $(".input-cell").blur(function () {
        $(".input-cell.selected").attr("contenteditable", "false");
    })


    $(".selected-cell").blur(function () {
        $(this).attr("contenteditable", "false");
        $(this).css("outline", "min(0.12vw, 0.12vh) solid #6f6f6f")
    });

    $(".selected-cell").dblclick(function () {
        $(".formula-input").text("");
        changeHeaderOnSheetChange(0, "#", "#");
        $(this).attr("contenteditable", "true");
        $(this).text("");
        $(this).focus();
        $(this).css("outline", "min(0.2vw, 0.2vh) solid #0f9d99");
        $('.input-cell.selected').each(function () {
            $(this).removeClass("bottom-cell-selected");
            $(this).removeClass("right-cell-selected");
            $(this).removeClass("left-cell-selected");
            $(this).removeClass("top-cell-selected");
            $(this).removeClass("selected");
        });
    });



    $(".selected-cell").keyup(function () {

        let txt = $(this).text().toUpperCase();
        let val = true;
        $('.input-cell.selected').removeClass("selected");
        $(".column-name").each(function () {
            for (let i = 1; i <= 100; i++) {
                if (txt === ($(this).attr("id") + i)) {
                    val = false;
                    break;
                }
            }

            if (val === false) {
                return false;
            }
        });
        if (val) {
            $(this).css("outline", "min(0.2vw, 0.2vh) solid red")
            changeHeaderOnSheetChange(0, "#", "#");
        }
        else {
            $(this).css("outline", "min(0.2vw, 0.2vh) solid rgb(0, 255, 0)");
            let alpha = "";
            let i = 0;
            while (txt[i] >= "A" && txt[i] <= "Z") {
                alpha += txt[i];
                i++;
            }
            let row = "";
            while (i < txt.length) {
                row += txt[i];
                i++;
            }
            let col = $(`#${alpha}`).attr("class").split(" ")[1].split("-")[1];
            $(`#row-${row}-col-${col}`).addClass("selected");
            $(".formula-input").text($(".input-cell.selected").text());
            changeHeader($(`#row-${row}-col-${col}`));
        }
    });


    function moveCursorToEnd(editableDiv) {
        let range = document.createRange();
        let sel = window.getSelection();
        range.selectNodeContents($(editableDiv)[0]);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
        $(editableDiv)[0].focus();
    }

    $(".formula-input").dblclick(function () {
        if ($(".selected-cell").text() == "") {
            warning("A cell has to be selected to use formula bar");
        }
        else {
            $(this).attr("contenteditable", "true");
            $(this).focus();
            moveCursorToEnd(this);
        }
    });

    $(".formula-input").blur(function () {
        $(this).attr("contenteditable", "false");
    });


    function expressioneval() {
        let txt = $(".formula-input").text().toUpperCase().substring(1).trim();
        let bol = /^[A-Z0-9+\-*/.\s]*$/.test(txt);

        if (bol === false) {
            warning("Incorrect Expression");
        }
        else {
            let parts = txt.split(/\s*[\+\-\*\/]\s*/);

            for (let i = 0; i < parts.length; i++) {
                parts[i] = parts[i].trim();
            }
            console.log(parts);
            let validate=false;
            for (let i = 0; i < parts.length; i++) {
                let bol = true;
                if (!(/^(\d+(\.\d*)?|\.\d+)$/.test(parts[i]))) {


                    $(".column-name").each(function () {
                        for (let j = 1; j <= 100; j++) {
                            console.log(parts[i],($(this).attr("id") + j));
                            if (parts[i] === ($(this).attr("id") + j)) {

                                //checking value at this column
                                let alpha = "";
                                let k = 0;
                                while (parts[i][k] >= "A" && parts[i][k] <= "Z") {
                                    alpha += parts[i][k];
                                    k++;
                                }
                                let row = "";
                                while (k < parts[i].length) {
                                    row += parts[i][k];
                                    k++;
                                }
                                let col = $(`#${alpha}`).attr("class").split(" ")[1].split("-")[1];
                                let validtext=$(`#row-${row}-col-${col}`).text();
                                if(/^(\d+(\.\d*)?|\.\d+)$/.test(validtext) || validtext==='')
                                {
                                    if(validtext==='')
                                    {
                                        parts[i]=0;
                                    }
                                    else
                                    {
                                        
                                        parts[i]=parseFloat(validtext);
                                    }
                                }
                                else
                                {
                                    warning("Text inside mentioned cells should be a number.");
                                    validate=true;
                                }
                                bol = false;
                                break;
                            }
                        }

                        if (bol === false) {
                            return false;
                        }
                    });
                    if (bol) {
                        warning("Invalid Expression");
                        validate=true;
                    }
                }
                else {
                    parts[i]=+(parts[i]);
                }
            }
            if(!validate)// saare strings no the
            {
                let text="";
                let j=0,i=0,k=0;
                while(i<txt.length)
                {
                    while(/^[A-Z0-9.\s]*$/.test(txt[i]))
                    {
                        i++;
                    }
                    if(i>k)
                    {
                    if(i<txt.length)
                    text= text + parts[j] + txt[i];
                else
                text= text + parts[j];
                    j++;
                    i++;
                    k=i;
                    }
                    else
                    {
                        i++;
                        k++;
                    }
                }
                let res=eval(text);
                console.log(res);
                if(res===-Infinity || res===Infinity || String(res)==="NaN")
                {
                    warning("Division by 0 not allowed");
                    
                }
                else
                {
                    $(".input-cell.selected").text(`${res}`);
                    updateCell("text",$(".input-cell.selected").text(),false);
                }
            }
        }

    }

    $(".formula-input").keyup(function (event) {


        let txt = $('.selected-cell').text().toUpperCase();
        let alpha = "";
        let i = 0;
        while (txt[i] >= "A" && txt <= "Z") {
            alpha += txt[i];
            i++;
        }
        let row = "";
        while (i < txt.length) {
            row += txt[i];
            i++;
        }
        if ($(".formula-input").text().length >= 1 && $(".formula-input").text()[0] == "=")//expression ke liye
        {
            $(".formula-input").css("text-transform", "uppercase");
            if (event.which === 13) {
                $(this).attr("contenteditable", "false");
                $(".formula-input").blur()
                expressioneval();
            }
        }
        else {
            $(".formula-input").css("text-transform", "none");
            if (event.which === 13) {
                $(this).attr("contenteditable", "false");
                $(".formula-input").blur();
            }
            else {
                if ($(".formula-input").text().length >= 2 && ($(".formula-input").text())[0] == '\\' && ($(".formula-input").text())[1] == "=") {
                    $(".input-cell.selected").text($(".formula-input").text().substring(1));
                }
                else
                    $(".input-cell.selected").text($(".formula-input").text());
                if ($(".input-cell.selected").text() == "") {
                    updateCell("text", "", true);
                }
                else
                    updateCell("text", $(".input-cell.selected").text(), false);
            }
        }
    });








    $('.input-cell').keyup(function () {
        let txt = $(this).text();
        $(".formula-input").text($(this).text());
        let dv = false;
        if (defaultProperties["text"] === txt)

            dv = true;
        updateCell("text", txt, dv);
    });

    //file upload download

    


});
function getRowCol(ele) {
    let idArray = $(ele).attr("id").split("-");//used $(ele) and not just ele
    return [parseInt(idArray[1]), parseInt(idArray[3])];
}
function updateCell(property, value, defaultable) {
    $(".input-cell.selected").each(function () {
        if (property !== "text")
            $(this).css(property, value);

        let [rowId, colId] = getRowCol(this);
        if (cellData[selectedSheet][rowId]) {
            if (cellData[selectedSheet][rowId][colId]) {
                cellData[selectedSheet][rowId][colId][property] = value;
            }
            else {
                cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
                cellData[selectedSheet][rowId][colId][property] = value;
            }
        }
        else {
            cellData[selectedSheet][rowId] = {};
            cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
            cellData[selectedSheet][rowId][colId][property] = value;
        }
        if (defaultable && (JSON.stringify(cellData[selectedSheet][rowId][colId]) == JSON.stringify(defaultProperties))) {
            delete cellData[selectedSheet][rowId][colId];
            if (Object.keys(cellData[selectedSheet][rowId]).length == 0) {
                delete cellData[selectedSheet][rowId];
            }
        }
        // let cellRowHeight = $(".cell-row").eq(rowId - 1).height();
        // $(".row-name").eq(rowId - 1).css("minHeight", cellRowHeight + "px");
        console.log(cellData);
    });

}

$(".icon-bold").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("font-weight", "", true);
    }
    else {
        updateCell("font-weight", "bold", false);
    }
})
$(".icon-italic").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("font-style", "", true);
    }
    else {
        updateCell("font-style", "italic", false);
    }
})
$(".icon-underline").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("text-decoration", "", true);
    }
    else {
        updateCell("text-decoration", "underline", false);
    }
})

$(".icon-align-left").click(function () {
    if (!$(this).hasClass("selected")) {
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
        updateCell("text-align", "left", true);
    }
});
$(".icon-align-center").click(function () {
    if (!$(this).hasClass("selected")) {
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
        updateCell("text-align", "center", false);
    }
});
$(".icon-align-right").click(function () {
    if (!$(this).hasClass("selected")) {
        $(".align-icon.selected").removeClass("selected");
        $(this).addClass("selected");
        updateCell("text-align", "right", false);
    }
});
$(".font-size-selector").on('change', function () {
    // $(".font-size-options.selected").removeClass("selected");
    let fs = $(".font-size-selector option:selected").val();
    let dv = false;
    if (defaultProperties["font-size"] === `min(calc(${fs}vw / 10),calc(${fs}vh / 10))`)
        dv = true;
    updateCell("font-size", `min(calc(${fs}vw / 10),calc(${fs}vh / 10))`, dv);
});
$(".font-family-selector").on('change', function () {
    // $(".font-size-options.selected").removeClass("selected");
    let ff = $(".font-family-selector option:selected").val();
    let dv = false;
    $(this).css('font-family', ff);
    if (defaultProperties["font-family"] === ff)
        dv = true;
    updateCell("font-family", ff, dv);
});
$('.cp-fill').on('change', function () {
    let col = $(this).val();
    let ci = $('.ci-fill');
    ci.css('background-color', col);
    let dv = false;
    if (defaultProperties["background-color"] === col)
        dv = true;
    updateCell("background-color", col, dv);
});
$('.cp-text').on('change', function () {
    let col = $(this).val();
    let ci = $('.ci-text');
    ci.css('background-color', col);
    let dv = false;
    if (defaultProperties["color"] === col)
        dv = true;
    updateCell("color", col, dv);
});

function changeHeader(ele) {
    let [rowId, colId] = getRowCol(ele);
    let cellInfo = defaultProperties;
    if (cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]) {
        cellInfo = cellData[selectedSheet][rowId][colId];
    }
    cellInfo["font-weight"] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected");
    cellInfo["font-style"] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected");
    cellInfo["text-decoration"] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected");
    let num = cellInfo["font-size"];
    let fontSize = num[9] + num[10];
    let fs = $(".font-size-selector option:selected").val();
    if (fs !== fontSize) {
        $(".font-size-selector").val(fontSize);
    }
    let ff = cellInfo["font-family"];
    let FF = $(".font-family-selector option:selected").val();
    if (ff !== FF) {
        $(".font-family-selector").val(ff);
        $(".font-family-selector").css("font-family", ff);
    }
    let alignment = cellInfo["text-align"];
    $(".align-icon.selected").removeClass("selected");
    $(".icon-align-" + alignment).addClass("selected");
    let textcol = $('.cp-text').val();
    let tC = cellInfo["color"];
    if (textcol != tC) {
        $('.cp-text').val(tC);
        $('.ci-text').css('background-color', tC);
    }
    let fillcol = $('.cp-fill').val();
    let fC = cellInfo["background-color"];
    if (fillcol != fC) {
        $('.cp-fill').val(fC);
        $('.ci-fill').css('background-color', fC);
    }
}

function changeHeaderOnSheetChange(k, r, c) {
    if (k == 0) {
        $('.font-family-selector').val('Noto Sans');
        $('.font-family-selector').css("font-family", 'Noto Sans');
        $('.font-size-selector').val('20');
        $('.icon-bold').removeClass("selected");
        $('.icon-italic').removeClass("selected");
        $('.icon-underline').removeClass("selected");
        $('.icon-align-left').addClass("selected");
        $('.icon-align-right').removeClass("selected");
        $('.icon-align-center').removeClass("selected");
        $('.cp-fill').val("#ffffff");
        $('.ci-fill').css("background-color", "#ffffff");
        $('.cp-text').val("#000000");
        $('.ci-text').css("background-color", "#000000");

    }
    else {
        if (cellData[selectedSheet][r] && cellData[selectedSheet][r][c]) {
            let data = cellData[selectedSheet][r][c];
            $('.font-family-selector').val(data["font-family"]);
            $('.font-family-selector').css("font-family", data["font-family"]);
            $('.font-size-selector').val(data["font-size"][9] + data["font-size"][10]);
            if (data["font-weight"])
                $('.icon-bold').addClass("selected");
            if (data["font-style"])
                $('.icon-italic').addClass("selected");
            if (data["text-decoration"])
                $('.icon-underline').addClass("selected");
            if (data["text-align"] === "left")
                $('.icon-align-left').addClass("selected");
            else if (data["text-align"] === "right") {
                $('.icon-align-left').removeClass("selected");
                $('.icon-align-right').addClass("selected");
            }
            else {
                $('.icon-align-left').removeClass("selected");
                $('.icon-align-center').addClass("selected");
            }
            $('.cp-fill').val(data["background-color"]);
            $('.ci-fill').css("background-color", data["background-color"]);
            $('.cp-text').val(data["color"]);
            $('.ci-text').css("background-color", data["color"]);
        }
    }
}

function emptySheet() {
    let sheetInfo = cellData[selectedSheet];

    for (let i of Object.keys(sheetInfo)) {
        for (let j of Object.keys(sheetInfo[i])) {

            $(`#row-${i}-col-${j}`).text("");
            $(`#row-${i}-col-${j}`).css("font-weight", "");
            $(`#row-${i}-col-${j}`).css("font-style", "");
            $(`#row-${i}-col-${j}`).css("text-decoration", "");
            $(`#row-${i}-col-${j}`).css("font-weight", "");
            $(`#row-${i}-col-${j}`).css("text-align", "left");
            $(`#row-${i}-col-${j}`).css("background-color", "#ffffff");
            $(`#row-${i}-col-${j}`).css("color", "#000000");
            $(`#row-${i}-col-${j}`).css("font-family", "Noto Sans");
            $(`#row-${i}-col-${j}`).css("font-size", "min(calc(20vw / 10),calc(20vh / 10))");
            changeHeaderOnSheetChange(0, `${i}`, `${j}`);
        }
    }

}

function loadSheet() {

    let sheetInfo = cellData[selectedSheet];
    for (let i of Object.keys(sheetInfo)) {
        for (let j of Object.keys(sheetInfo[i])) {
            let cellInfo = cellData[selectedSheet][i][j];
            $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
            $(`#row-${i}-col-${j}`).css("font-style", cellInfo["font-style"]);
            $(`#row-${i}-col-${j}`).css("text-decoration", cellInfo["text-decoration"]);
            $(`#row-${i}-col-${j}`).css("font-weight", cellInfo["font-weight"]);
            $(`#row-${i}-col-${j}`).css("text-align", cellInfo["text-align"]);
            $(`#row-${i}-col-${j}`).css("background-color", cellInfo["background-color"]);
            $(`#row-${i}-col-${j}`).css("color", cellInfo["color"]);
            $(`#row-${i}-col-${j}`).css("font-family", cellInfo["font-family"]);
            $(`#row-${i}-col-${j}`).css("font-size", cellInfo["font-size"]);
            changeHeaderOnSheetChange(1, `${i}`, `${j}`);
        }
    }

}

$('.icon-add').click(function() {
    emptySheet();
    $('.sheet-tab.selected-sheet').removeClass('selected-sheet');
    let sheetName;
    if(myown==="")
    sheetName = "Sheet" + (lastlyAddedSheet + 1);
else
    sheetName=myown;
myown="";
if(!cellData[sheetName])
    cellData[sheetName] = {};
    totalSheets += 1;
    lastlyAddedSheet += 1;
    selectedSheet = sheetName;
    // console.log("hello");
    $('.sheet-tab-container').append(`<div class="sheet-tab selected-sheet">${sheetName}</div>`);
    $(".sheet-tab.selected-sheet").click(function () {
        if (!$(this).hasClass("selected-sheet")) {
            $('.sheet-tab.selected-sheet').removeClass('selected-sheet');
            $(this).addClass('selected-sheet');
            emptySheet();
            selectedSheet = $(this).text();
            loadSheet();
        }

    })
    
    if ($(".selected-cell").text()) {
        let txt = $(".selected-cell").text();
        let alpha = "";
        let i = 0;
        while (txt[i] >= "A" && txt <= "Z") {
            alpha += txt[i];
            i++;
        }
        let row = "";
        while (i < txt.length) {
            row += txt[i];
            i++;
        }
        let col = $(`#${alpha}`).attr("class").split(" ")[1].split("-")[1];

        $(".formula-input").text($(`#row-${row}-col-${col}`).text());
    }
    else
        $(".formula-input").text("");
});
// $(".sheet-tab").click(function()
// {
//     console.log("heel");
//     console.log(this);
//     if(!$(this).hasClass("selected-sheet"))
//     {
//         $('.sheet-tab.selected-sheet').removeClass('selected-sheet');
//         $(this).addClass('selected-sheet');
//         emptySheet();
//         selectedSheet=$(this).text();
//         loadSheet();
//     }

// })
document.querySelector('.sheet-tab-container').addEventListener('click', function (e) {
    let sheetTabs = document.querySelectorAll('.sheet-tab');
    for (let sheetTab of sheetTabs) {
        if (e.target === sheetTab) {
            
            let prevsel = document.querySelector('.selected-sheet');
            prevsel.classList.remove("selected-sheet");
            sheetTab.classList.add("selected-sheet");
            emptySheet();
            selectedSheet = sheetTab.innerHTML;
            loadSheet();
            let sc = document.getElementsByClassName("selected-cell")[0];
            if (sc.innerText != "") {
                let txt = sc.innerText;
                let alpha = "";
                let i = 0;
                while (txt[i] >= "A" && txt <= "Z") {
                    alpha += txt[i];
                    i++;
                }
                let row = "";
                while (i < txt.length) {
                    row += txt[i];
                    i++;
                }
                let col = document.getElementById(`${alpha}`).classList[1].split("-")[1];

                document.getElementsByClassName("formula-input")[0].innerText = document.getElementById(`row-${row}-col-${col}`).innerText;
            }

            else {
                document.getElementsByClassName("formula-input")[0].innerText = "";
            }
            // $('.input-cell.selected').click();
            break;
        }
    }
})



$('.container').contextmenu(function (e) {
    if (!$(e.target).hasClass("sheet-tab")) {
        if ($('.sheet-options-modal').length > 0) {
            $('.sheet-options-modal').remove();
        }
    }
    else {

        e.preventDefault();
        emptySheet();
        $(".sheet-tab.selected-sheet").removeClass("selected-sheet");
        $(e.target).addClass("selected-sheet");
        selectedSheet = $(e.target).text();
        loadSheet();
        $(".sheet-rename-modal").remove();
        $(".sheet-options-modal").remove();
        $('.container').append(`<div class="sheet-options-modal">
        <div class="sheet-rename">Rename</div>
        <div class="sheet-delete">Delete</div>
        </div>`);
        let $targetDiv = $(".sheet-tab.selected-sheet");
        let l = $targetDiv.offset().left;
        let v = window.innerWidth;
        l = Math.floor((l / v) * 100) + 'vw';
        let w = ($(".sheet-tab.selected-sheet").width());
        w = ((w / v) * 100) + 'vw';
        $('.sheet-options-modal').css('left', `calc(${l} + ${w})`);
        $('.sheet-options-modal').css('bottom', '4vh');

    }
});


$('.container').click(function (e) {
    if ($('.sheet-options-modal').length > 0) {
        if ((!$(e.target).is($(".sheet-options-modal")[0])) && (!$(e.target).is($(".sheet-rename")[0])) && (!$(e.target).is($(".sheet-delete")[0]))) {

            $('.sheet-options-modal').remove();
        }
        else {
            if ($(e.target).is($(".sheet-delete")[0])) {

                let currSheetIndex = Object.keys(cellData).indexOf(selectedSheet);
                let currSheetName = $('.sheet-tab.selected-sheet').text();
                // console.log(currSheetIndex,cellData,Object.keys(cellData).length);
                if (Object.keys(cellData).length == 1) {
                    emptySheet();

                    selectedSheet = "Sheet1";
                    delete cellData[currSheetName];
                    cellData["Sheet1"] = {};
                    lastlyAddedSheet = 1;
                    totalSheets = 1;
                    $(".sheet-tab.selected-sheet").remove();
                    $('.sheet-tab-container').append(`<div class="sheet-tab selected-sheet">${selectedSheet}</div>`);
                    // console.log(cellData);

                }
                else {
                    $('.sheet-tab.selected-sheet').addClass('temp-sheet');
                    if (currSheetIndex == 0) {
                        $(".sheet-tab.selected-sheet").next().click();
                    }
                    else {
                        $(".sheet-tab.selected-sheet").prev().click();

                    }
                    // console.log(selectedSheet,cellData);
                    $(".sheet-tab.temp-sheet").remove();
                    delete cellData[currSheetName];
                }

                $(".sheet-options-modal").remove();
            }
            // opening rename modal
            else if ($(e.target).is($(".sheet-rename")[0])) {
                if ($(".sheet-rename-modal").length == 0) {
                    $(".sheet-options-modal").remove();
                    $('.container').append(`<form class="sheet-rename-modal" onsubmit="return false;">
            <div id="rename-p"><button type="submit" class="material-icons" id="rename-but">check_circle</button></div>
            <input type="text" id="new-name" required autocomplete="off">
            </form>`);
                    let $targetDiv = $(".sheet-tab.selected-sheet");
                    let l = $targetDiv.offset().left;
                    let v = window.innerWidth;
                    l = Math.floor((l / v) * 100) + 'vw';
                    let w = $(".sheet-tab.selected-sheet").width();
                    w = ((w / v) * 100) + 'vw';
                    $('.sheet-rename-modal').css('left', `calc(${l} + ${w})`);
                    $('.sheet-rename-modal').css('bottom', '4vh');
                    $('#new-name').focus();
                }
            }
        }
    }
    else if ($('.sheet-rename-modal').length > 0) {
        if ((!$(e.target).is($(".sheet-rename-modal")[0])) && (!$(e.target).is($("#rename-p")[0])) && (!$(e.target).is($("#rename-but")[0])) && (!$(e.target).is($("#new-name")[0]))) {

            $('.sheet-rename-modal').remove();
        }
        else {
            if ($(e.target).is($("#rename-but")[0])) {
                let newSheetName = $("#new-name").val();
                let repeat=false;
                for(let key in cellData)
                {
                    if(key===newSheetName)
                    {
                        repeat=true;
                        break;
                    }
                }
                if(repeat)
                {
                    warning(`${newSheetName} already exist.`);
                }
                else
                {
                $(".sheet-tab.selected-sheet").text(newSheetName);
                let newCellData = {};
                for (let key in cellData) {
                    if (key != selectedSheet)
                        newCellData[key] = cellData[key];
                    else {
                        newCellData[newSheetName] = cellData[key];
                    }
                }
                cellData = newCellData;
                selectedSheet = newSheetName;
                $(".sheet-rename-modal").remove();
             }
            }

        }
    }

    //impexp
    if($(e.target).is($('.menu-file')))
    {
        $("#impexp").remove();
        $('.menu-home').removeClass("selected");
        $('.menu-file').addClass("selected");
        $('.container').append($(`<div id="impexp">
        <div id="import"><span class="material-icons">download</span>Import</div>
        <div id="export"><span class="material-icons">upload</span>Export</div>
    </div>`));
    }
    else
    if(!$(e.target).is($("#impexp")) && !$(e.target).is($("#export")) && !$(e.target).is($("#import")) && !$(e.target).is($("#impexp span")))
    {
        $("#impexp").remove();
        $('.menu-file').removeClass("selected");
        $('.menu-home').addClass("selected");
    }
    else
    {
        if($(e.target).is($("#export")) || $(e.target).is($("#export span")))
        {
            toc=0;
            $("#impexp").remove();
            $('.container').append($(`<div id="overlaydown">
            <div id="expcont">
                <label for="downloadallin" id="downloadall">
                    <input type="radio" name="typeofdownload" value="all" class="downloadtype" id="downloadallin" checked>
                    Download all the sheets.
                </label>

                <div id="selectivedownload">


                    <label for="downloadselectivein" id="selectivedownloadhead"><input type="radio"
                            name="typeofdownload" value="selective" class="downloadtype" id="downloadselectivein">Download selective
                        sheets.</label>
                    <div id="sheetstodownload">
                    </div>

                </div>
                <div id="downloadbutcon">
                    <div id="downloadsubbut">Download</div>
                    <div id="cancelsubbut">Cancel</div>
                </div>
            </div>
        </div>
    </div>`));
    for (let key in cellData) {
                $("#sheetstodownload").append($(`<div class="sheetdownoption">
                <input type="checkbox" id='${key}' value='${key}' class="choicestodown">
                <label for='${key}'>${key}</label>
            </div>`));
                      }
                    }



        else if($(e.target).is($("#import"))||$(e.target).is($("#import *")))
        {
            myown=1;
            
            let input=document.createElement("input");
            input.setAttribute("type","file");/////very important new concept
            input.click();
            input.addEventListener('change',(e)=>{
                let fr=new FileReader();
                let files=input.files;
                let fileObj=files[0];
                fr.readAsText(fileObj);
                $("#impexp").remove();
                fr.addEventListener('load',(e)=>{
                    $('.menu-file').removeClass("selected");
                    $('.menu-home').addClass("selected");
                    let readsheetdata=JSON.parse(fr.result);
                    
                    let depth=getObjectDepth(readsheetdata);


                    // importing individual sheet
                    if(depth==0 || depth==3)
                    {
                        myown=fileObj.name.slice(0,-5);
                        let makeit=true;
                        let elem="";
                        let txt=myown;
                        for(key in cellData)
                        {
                            if(key===myown)
                            {
                                myown="";
                                makeit=false;
                                warning(`${key} already exist. Please rename`);
                                $('.sheet-tab').each(function()
                                {
                                    if($(this).text()===key)
                                    {
                                        elem=$(this);
                                        $(elem).css("outline","min(0.2vw,0.2vh) solid red");
                                        return false;
                                    }
                                });
                                break;
                            }
                            
                        }
                        setTimeout(() => {
                            if(elem!="")
                                $(elem).css("outline","none");
                            
                        }, 2000);
                        if(makeit)
                        {
                        cellData[txt]=readsheetdata;
                        $('.icon-add').click();
                        $('.sheet-tab.selected-sheet').click();
                        $('.input-cell.selected').click();
                        changeHeader($('.input-cell.selected'));
                        $('.formula-input').css("text-transform","none");
                        }
                        
                    }
                    else 
                    if(depth==1 || depth==4)
                    {
                        let makeit=true;
                        for(let first in readsheetdata)
                        {
                        myown=first;
                        
                        let elem="";
                        let txt=myown;
                        for(key in cellData)
                        {
                            if(key===myown)
                            {
                                myown="";
                                makeit=false;
                                warning(`${key} already exist. Please rename`);
                                $('.sheet-tab').each(function()
                                {
                                    if($(this).text()===key)
                                    {
                                        elem=$(this);
                                        $(elem).css("outline","min(0.2vw,0.2vh) solid red");
                                        return false;
                                    }
                                });
                                break;
                            }
                            
                        }
                        setTimeout(() => {
                            if(elem!="")
                                $(elem).css("outline","none");
                            
                        }, 2000);
                        if(!makeit)
                        break;
                     }
                        if(makeit)
                        {
                        for(let first in readsheetdata)
                        {
                        cellData[first]=readsheetdata[first];
                        $('.icon-add').click();
                        $('.sheet-tab.selected-sheet').click();
                        $('.input-cell.selected').click();
                        changeHeader($('.input-cell.selected'));
                        $('.formula-input').css("text-transform","none");
                        }
                        }
                        
                    }
                        
                    
                });
            });

            function getObjectDepth(obj, depth = 1) {
                if (Object.keys(obj).length === 0) {
                  return depth - 1;
                }
              
                let maxDepth = depth;
              
                for (const key in obj) {
                  if (typeof obj[key] === 'object' && obj[key] !== null) {
                    const currentDepth = getObjectDepth(obj[key], depth + 1);
                    maxDepth = Math.max(maxDepth, currentDepth);
                  }
                }
              
                return maxDepth;
              }



        }
                    
    }
    if($(e.target).is($("#overlaydown")) || ($(e.target).is($("#overlaydown *")) && !$(e.target).is($("#cancelsubbut"))))
    {
        if(toc===0)
        {
            toc=1;
        $("#downloadall").click();
        
        }
        $('.menu-home').removeClass("selected");
        $('.menu-file').addClass("selected");
        if($(e.target).is($("#downloadall"))||$(e.target).is($("#downloadall *")))
        {
            $("#downloadsubbut").css("filter","grayscale(0)");
            $("#downloadsubbut").css("cursor","pointer");
            $("#downloadsubbut").css("pointer-events","initial");
            $("#sheetstodownload input").prop("checked",false);
            $("#sheetstodownload *").css("pointer-events","none");
            $("#sheetstodownload").css("cursor","no-drop");
            $("#sheetstodownload").css("background","rgb(228, 228, 228)");
        }
        else if($(e.target).is($("#selectivedownloadhead"))||$(e.target).is($("#selectivedownloadhead *")))
        {
            if(toc===1)
            {
            $("#downloadsubbut::before").css("display","block");
            $("#downloadsubbut").css("cursor","no-drop");
            $("#downloadsubbut").css("filter","grayscale(1)");
            }
            $("#sheetstodownload *").css("pointer-events","initial");
            $("#sheetstodownload").css("cursor","initial");
            $("#sheetstodownload").css("background","rgb(244, 244, 244)");
        }
        else if($(e.target).is($(".sheetdownoption>*")))
        {
            if($('.choicestodown:checked').length)
            {
                $("#downloadsubbut").css("filter","grayscale(0)");
                    $("#downloadsubbut").css("cursor","pointer");
                    $("#downloadsubbut").css("pointer-events","initial");
                    toc=2;
            }
            else
            {
                $("#downloadsubbut::before").css("display","block");
            $("#downloadsubbut").css("cursor","no-drop");
            $("#downloadsubbut").css("filter","grayscale(1)");
            toc=1;
            }
        }
        if($(e.target).is($("#downloadsubbut")))
        {
            if($(".downloadtype:checked").val()==="all"){
             download(cellData,"Book1.json");
            }
            else
            {
                let contents=[];
                let filesname=[];
                $('.choicestodown:checked').each(function()
                {
                    contents.push(cellData[$(this).val()]);
                    filesname.push($(this).val());
                });
                
                    
                    if(contents.length===1)
                {
                    console.log(contents[0],filesname[0] + '.json');
                    download(contents[0],filesname[0]);
                }
                else
                {
                    downloadMultipleAsZip(contents,filesname);
                }
            
            }
        }
    }
    else if($(e.target).is($("#cancelsubbut")))
    {
        $("#overlaydown").remove();
    }


});
function download(content,filename)
{
    let jsonData=JSON.stringify(content);
    let file=new Blob([jsonData],{type:"application/json"});
    let a=document.createElement("a");
    a.href=URL.createObjectURL(file);
    a.download=filename;
    a.click();
}

function downloadMultipleAsZip(contents,filesname) {
    let zip = new JSZip();
  
    for (let i = 0; i < contents.length; i++) {
      let jsonData = JSON.stringify(contents[i]);
      zip.file(filesname[i] + '.json', jsonData);
    }
  
    zip.generateAsync({ type: "blob" }).then(function(content) {
      let a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = "Book1.zip";
      a.click();
    });
  }

$(window).resize(function () {
    if ($(".sheet-options-modal").length > 0) {
        let $targetDiv = $(".sheet-tab.selected-sheet");
        let l = $targetDiv.offset().left;
        let v = window.innerWidth;
        l = Math.floor((l / v) * 100) + 'vw';
        let w = ($targetDiv.width());
        w = ((w / v) * 100) + 'vw';
        $('.sheet-options-modal').css('left', `calc(${l} + ${w})`);
        $('.sheet-options-modal').css('bottom', '4vh');
    }
    else if ($(".sheet-rename-modal").length > 0) {
        let $targetDiv = $(".sheet-tab.selected-sheet");
        let l = $targetDiv.offset().left;
        let v = window.innerWidth;
        l = Math.floor((l / v) * 100) + 'vw';
        let w = ($targetDiv.width());
        w = ((w / v) * 100) + 'vw';
        $('.sheet-rename-modal').css('left', `calc(${l} + ${w})`);
        $('.sheet-rename-modal').css('bottom', '4vh');
    }
});
$(".icon-left-scroll").click(function () {
    if ($(".sheet-tab.selected-sheet").prev().length > 0) {
        $(".sheet-tab.selected-sheet").addClass('temp');
        $(".sheet-tab.temp").prev().click();
        $(".sheet-tab.temp").removeClass("temp");
    }
});
$(".icon-right-scroll").click(function () {
    if ($(".sheet-tab.selected-sheet").next().length > 0) {
        $(".sheet-tab.selected-sheet").addClass('temp');
        $(".sheet-tab.temp").next().click();
        $(".sheet-tab.temp").removeClass("temp");
    }
});

let copiedprop = {};

function warning(val) {
    const war = document.getElementById("warning");
    war.style.display = "block";
    war.style.opacity = "1";
    war.innerText = val;
    war.style.animationName = "war";
    setTimeout(() => {
        war.style.opacity = "0";
        war.style.transition = "opacity 0.5s";
    }, 2000);
    setTimeout(() => {
        war.innerText = "";
        war.style.animationName = "";
        war.style.display = "none";
    }, 2500);
}
$('.icon-cut').click(function () {

    if ($('.input-cell.selected').length === 0) {
        warning("Select one cell to perform this operation.");
    }
    else
        if ($('.input-cell.selected').length > 1) {
            warning("This operation does not allow multiple selection.");
        }
        else {
            let [row, col] = getRowCol($('.input-cell.selected'));
            if(cellData[selectedSheet][row] && cellData[selectedSheet][row][col])
            {copiedprop = cellData[selectedSheet][row][col];
                delete cellData[selectedSheet][row][col];}
        else
        copiedprop=defaultProperties;
            
            if (cellData[selectedSheet][row] && Object.keys(cellData[selectedSheet][row]).length === 0) {
                delete cellData[selectedSheet][row];
            }
            $('.input-cell.selected').text("");
            $('.input-cell.selected').css("font-style", "");
            $('.input-cell.selected').css("text-decoration", "");
            $('.input-cell.selected').css("font-weight", "");
            $('.input-cell.selected').css("text-align", "left");
            $('.input-cell.selected').css("background-color", "#ffffff");
            $('.input-cell.selected').css("color", "#000000");
            $('.input-cell.selected').css("font-family", "Noto Sans");
            $('.input-cell.selected').css("font-size", "min(calc(20vw / 10),calc(20vh / 10))");
            changeHeader($('.input-cell.selected'));
        }
});
$('.icon-paste').click(function () {

    if ($('.input-cell.selected').length === 0) {
        warning("Select one cell to perform this operation.");
    }
    else
        if ($('.input-cell.selected').length > 1) {
            warning("This operation does not allow multiple selection.");
        }
        else {
            let [row, col] = getRowCol($('.input-cell.selected'));
            if (!cellData[selectedSheet][row])
                cellData[selectedSheet][row] = {};
            cellData[selectedSheet][row][col] = copiedprop;
            $('.input-cell.selected').text(copiedprop["text"]);
            $('.input-cell.selected').css("font-style", copiedprop["font-style"]);
            $('.input-cell.selected').css("text-decoration", copiedprop["text-decoration"]);
            $('.input-cell.selected').css("font-weight", copiedprop["font-weight"]);
            $('.input-cell.selected').css("text-align", copiedprop["text-align"]);
            $('.input-cell.selected').css("background-color", copiedprop["background-color"]);
            $('.input-cell.selected').css("color", copiedprop["color"]);
            $('.input-cell.selected').css("font-family", copiedprop["font-family"]);
            $('.input-cell.selected').css("font-size", copiedprop["font-size"]);
            changeHeader($('.input-cell.selected'));
        }
});
$('.icon-copy').click(function () {

    if ($('.input-cell.selected').length === 0) {
        warning("Select one cell to perform this operation.");
    }
    else
        if ($('.input-cell.selected').length > 1) {
            warning("This operation does not allow multiple selection.");
        }
        else {
            let [row, col] = getRowCol($('.input-cell.selected'));
            if(cellData[selectedSheet][row] && cellData[selectedSheet][row][col])
            copiedprop = cellData[selectedSheet][row][col];
        else
        copiedprop=defaultProperties;
        }
});



