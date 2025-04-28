class Bingo {
    constructor(size, amount, content, maxSame, title) {
        this.size = size;
        this.amount = amount;
        this.content = content;
        this.cards = [];
        this.maxSame = maxSame;
        this.title = title;
    }
    print() {}

    createCards() {
        if (this.size ** 2 > this.content.length) {
            console.error("ERROR: There are more fields than possible inputs");
        }
        for (let index = 0; index < this.amount; index++) {
            let tmp = new BingoCard(this.size, this.content);
            tmp.create();
            this.compareCard(tmp)
            this.cards[index] = tmp;
        }
        this.drawCards();
    }

    compareCard(card) {
        for (let index = 0; index < this.cards.length - 1; index++) {
            let same = 0;
            for (let i = 0; i < this.size; i++) {
                if (card.numbers[i] === this.cards[index].numbers[i]) {
                    same++;
                }
                if (same >= this.maxSame) {
                    console.log("Same");
                }
            }
        }
    }
    drawCards() {
        $(".card").remove();
        $(".page-break").remove();
        for (const element of this.cards) {
            let card = document.createElement("div");
            card.classList.add("card");
            let cardTitle = document.createElement("h1");
            cardTitle.innerText = this.title;
            let div = document.createElement("div");
            div.classList.add("boxDiv");

            card.appendChild(cardTitle);
            div.style.gridTemplateColumns = "1fr ".repeat(this.size);
            div.style.gridTemplateRows = "1fr ".repeat(this.size);
            card.appendChild(div);
            for (let j = 0; j < this.size ** 2; j++) {
                let field = document.createElement("div");
                field.innerText = element.numbers[j];
                div.appendChild(field);
            }

            document.getElementById("drawDiv").appendChild(card);

            let cardTop = $(card).position().top;
            const mainDiv = document.getElementById("mainDiv");
            if (window.getComputedStyle(mainDiv, null).display !== "none") {
                cardTop = cardTop - parseInt(window.getComputedStyle(mainDiv, null).height, 10);
            }
            let cardBottom = cardTop + card.getBoundingClientRect().height;
            const pageSize = $("#drawDiv").width() * 1.4142857142857144;
            if (cardTop % pageSize > pageSize - card.getBoundingClientRect().height) {
                let pageBreak = document.createElement("div");
                pageBreak.style.height = Math.abs(pageSize - cardTop % pageSize) + (50 - parseInt(getComputedStyle(document.documentElement).getPropertyValue("--outer-border"))) + "px";
                pageBreak.classList.add("page-break");
                document.getElementById("drawDiv").appendChild(pageBreak);
            }
            $(card).remove();
            document.getElementById("drawDiv").appendChild(card);
        }
    }
}

class BingoCard {
    constructor(size, content) {
        this.size = size;
        this.content = content;
        this.numbers = [];
    }
    create() {
        let list = [];
        for (let i = 0; i < this.size ** 2; i++) {
            while (true) {
                let num;
                num = Math.floor(Math.random() * this.content.length);
                if (list.includes(num)) {
                  // TODO document why this block is empty

                } else {
                    this.numbers[i] = this.content[num];
                    list.push(num);
                    break;
                }
                list.push(num);
            }
        }
    }
}


function getHeight(element) {
    element.style.visibility = "hidden";
    document.body.appendChild(element);
    let height = element.offsetHeight;
    document.body.removeChild(element);
    element.style.visibility = "visible";
    return height;
}

// var x = getOffset( document.getElementById('yourElId') ).left; 

let item = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

var bingo;
// bingo = new Bingo(4, 20, item, 4, "Bingo");
// bingo.createCards();


function createBingo() {
    const amount = document.getElementById("amountSelect");
    const size = document.getElementById("sizeSelect");
    const title = document.getElementById("titleSelect").value;
    let error = false
    let items = [];
    if (size.value == null || size.value < 1) {
        size.classList.add("error");
        error = true;
    } else size.classList.remove("error");

    if (amount.value == null || amount.value < 1) {
        amount.classList.add("error");
        error = true;
    } else amount.classList.remove("error");


    if (document.getElementById("typeSelect").value === "numbers") {
        const numMin = parseInt(document.getElementById("selectnumberMin").value);
        const numMax = parseInt(document.getElementById("selectnumberMax").value);
        if (numMin == null || Number.isNaN(numMin) || numMax == null || Number.isNaN(numMax)) error = true;
        for (let index = numMin; index < numMax; index++) {
            items.push(index);
        }
    } else {
        items = document.getElementById("selectTextField").value.split("\n");
    }

    if (!error) {
        let tmpbingo = new Bingo(size.value, amount.value, items, 4, title);
        tmpbingo.createCards();
        bingo = tmpbingo;
    }

    update();
    setTimeout(adjustFontSizeToBox, 50); // Slight delay to allow DOM to update

}

function showSettings() {
    let setDiv = document.getElementById("settingsDiv");
    if (setDiv.style.display === "none") {
        setDiv.style.display = "flex";
    } else {
        setDiv.style.display = "none";
    }
}

function showInput() {
    let type = document.getElementById("typeSelect").value;
    if (type === "numbers") {
        document.getElementById("selectNumber").style.display = "block";
        document.getElementById("selectText").style.display = "none";
    } else {
        document.getElementById("selectNumber").style.display = "none";
        document.getElementById("selectText").style.display = "block";
    }

}

// createBingo();

function update() {
    let root = document.documentElement;
    root.style.setProperty("--outer-border", document.getElementById("setOuterBorder").value + "px solid black");
    root.style.setProperty("--inner-border", document.getElementById("setInnerBorder").value + "px solid black");
    root.style.setProperty("--title-size", document.getElementById("setTitleSize").value + "px");
    // root.style.setProperty("--font-size", document.getElementById("setFontSize").value + "px");
    root.style.setProperty("--padding", document.getElementById("setPadding").value + "px");
    root.style.setProperty("--box-size", document.getElementById("setBoxSize").value + "px");
    root.style.setProperty("--margin", document.getElementById("setMargin").value + "px");
    bingo.drawCards();
    adjustFontSizeToBox();
}

document.getElementById("typeSelect").value = "numbers";

function showSupport() {
    let div = document.getElementById("supportIframeDiv");
    let supDiv = document.getElementById("supportDiv");
    let h2 = document.getElementById("supportH2");
    console.log(div.style.display);
    if (div.style.display === "block") {
        div.style.display = "none";
        h2.style.display = "none";
        supDiv.style.backgroundColor = "transparent"
    } else {
        div.style.display = "block";
        h2.style.display = "inline";
        supDiv.style.backgroundColor = "#777"
    }
}

function adjustFontSizeToBox() {
    const boxes = document.querySelectorAll('.boxDiv div');

    boxes.forEach(box => {
        let fontSize = parseInt(getComputedStyle(box).height) * 0.5; // Start with 50% of box height
        box.style.fontSize = fontSize + 'px';

        // Shrink font size if content is overflowing
        while (box.scrollHeight > box.clientHeight || box.scrollWidth > box.clientWidth) {
            fontSize -= 1;
            box.style.fontSize = fontSize + 'px';

            // Safety limit
            if (fontSize < 5) break;
        }
    });
}