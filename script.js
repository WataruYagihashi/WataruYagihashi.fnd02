'use strict'
// 1行目に記載している 'use strict' は削除しないでください
const myCards = []; //自分の手札のオブジェクトが入った配列
const cpuCards = [];//CPUの手札のオブジェクトが入った配列
let myHandResult = "";//自分の手札の役
let cpuHandResult = "";//相手の手札の役
let myStrongest = 0;//自分の手札の一番強い数字
let cpuStrongest = 0;//相手の手札の一番強い数字
// 役の強さ配列
const handRanks = {
    "ハイカード": 1,
    "ワンペア": 2,
    "ツーペア": 3,
    "スリーカード": 4,
    "フルハウス": 5,
    "フォーカード": 6
}
// 手札の強さと競う数字を返す関数
function judge(cards) {
    const indices = cards.map(c => c.index).sort((a, b) => a - b); //indices = カード強さを小さい順に並べた配列
    const counts = {};
    for (const i of indices) {
        counts[i] = (counts[i] || 0) + 1;
    }
    const countValues = Object.values(counts).sort((a, b) => b - a);
    let role = "ハイカード"; // role = 役の強さ
    let strongestNum = 0;
    if (countValues[0] === 4) {
        role = "フォーカード";
        for (const key in counts) {
            if (counts[key] === 4) {
                strongestNum = Number(key);
                break;
            }
        }
    } else if (countValues[0] === 3 && countValues[1] === 2) {
        role = "フルハウス";
        for (const key in counts) {
            if (counts[key] === 3) {
                strongestNum = Number(key);
                break;
            }
        }
    } else if (countValues[0] === 3) {
        role = "スリーカード";
        for (const key in counts) {
            if (counts[key] === 3) {
                strongestNum = Number(key);
                break;
            }
        }
    } else if (countValues[0] === 2 && countValues[1] === 2) {
        role = "ツーペア";
        const pairs = [];
        for (const key in counts) {
            if (counts[key] === 2) pairs.push(Number(key));
        }
        strongestNum = Math.max(...pairs);
    } else if (countValues[0] === 2) {
        role = "ワンペア";
        for (const key in counts) {
            if (counts[key] === 2) {
                strongestNum = Number(key);
                break;
            }
        }
    } else {
        role = "ハイカード";
        strongestNum = Math.max(...indices);
    }
    return { role, strongestNum, indices };
}
function compareHands(hand1, hand2) {
    // 役の強さ比較
    if (handRanks[hand1.role] > handRanks[hand2.role]) {
        return 1;
    }
    if (handRanks[hand1.role] < handRanks[hand2.role]) {
        return -1;
    }
    if (hand1.strongestNum > hand2.strongestNum) {
        return 1;
    }
    if (hand1.strongestNum < hand2.strongestNum) {
        return -1;
    }
    const hand1Sorted = [...hand1.indices].sort((a, b) => b - a);
    const hand2Sorted = [...hand2.indices].sort((a, b) => b - a);
    for (let i = 0; i < hand1Sorted.length; i++) {
        if (hand1Sorted[i] > hand2Sorted[i]) {
            return 1;
        }
        if (hand1Sorted[i] < hand2Sorted[i]) {
            return -1;
        }
    }
    return 0;
}
// トランプ配列=>オブジェクト  スペード0, ダイヤ1, ハート2,　クローバー3,  supe2.png = "0:2"  supe1.png = "A:14"
const torannpu = [
    ["img/supe2.png", "img/supe3.png", "img/supe4.png", "img/supe5.png", "img/supe6.png", "img/supe7.png", "img/supe8.png", "img/supe9.png", "img/supe10.png",
        "img/supe11.png", "img/supe12.png", "img/supe13.png", "img/supe1.png"],
    ["img/daiya2.png", "img/daiya3.png", "img/daiya4.png", "img/daiya5.png", "img/daiya6.png", "img/daiya7.png", "img/daiya8.png", "img/daiya9.png", "img/daiya10.png",
        "img/daiya11.png", "img/daiya12.png", "img/daiya13.png", "img/daiya1.png"],
    ["img/hat2.png", "img/hat3.png", "img/hat4.png", "img/hat5.png", "img/hat6.png", "img/hat7.png", "img/hat8.png", "img/hat9.png", "img/hat10.png", "img/hat11.png",
        "img/hat12.png", "img/hat13.png", "img/hat1.png"],
    ["img/kura2.png", "img/kura3.png", "img/kura4.png", "img/kura5.png", "img/kura6.png", "img/kura7.png", "img/kura8.png", "img/kura9.png", "img/kura10.png",
        "img/kura11.png", "img/kura12.png", "img/kura13.png", "img/kura1.png"]
]
// スタートボタン関数
function fun() {
    myCards.length = 0;
    cpuCards.length = 0;
    h1.style.display = "none";
    button.style.display = "none";
    //相手の手札//////////////////////////////////////////////////
    const you = document.createElement("span")
    you.id = "youdiv"
    you.innerText = "相手の手札"
    document.body.appendChild(you)
    const yaku = document.createElement("span")
    yaku.className = "yaku"
    yaku.innerText = "? ? ?"
    document.body.appendChild(yaku)
    const cardContainer = document.createElement("div");
    cardContainer.id = "cardContainer";
    document.body.appendChild(cardContainer);
    for (let i = 0; i < 5; i++) {
        const img = document.createElement("img");
        img.src = "ura.png";
        img.className = "uraCard";
        cardContainer.appendChild(img);
    }
    //////////////////////////////////////////////////////////////
    //自分の手札///////////////////////////////////////////////////
    const my = document.createElement("span")
    my.id = "mydiv"
    my.innerText = "自分の手札"
    document.body.appendChild(my)
    const myYaku = document.createElement("span")
    myYaku.className = "yaku"
    myYaku.innerText = ""
    document.body.appendChild(myYaku)
    const cardContainer2 = document.createElement("div");
    cardContainer2.id = "cardContainer2";
    document.body.appendChild(cardContainer2);
    ///////////////////////////////////////////////////////////////////
    //勝負ボタン作成//
    let matchbutton = document.createElement("button")
    matchbutton.id = "match"
    document.body.appendChild(matchbutton)
    //変更ボタン作成//
    let changebutton = document.createElement("button")
    changebutton.id = "change"
    document.body.appendChild(changebutton)
    //自分の手札ランダム(5枚)
    while (myCards.length < 5) {
        const arrRandom = Math.floor(Math.random() * 4);
        const randomNum = Math.floor(Math.random() * 13);
        if (!myCards.some(card => card.suit === arrRandom && card.index === randomNum)) {
            myCards.push({ suit: arrRandom, index: randomNum });  //suit: 柄; index: 強さ; 
        }
    }
    //小さい順に並べる(sort)
    myCards.sort((a, b) => a.index - b.index);
    for (let i = 0; i < myCards.length; i++) {
        const img2 = document.createElement("img");
        const cardSet = torannpu[myCards[i].suit];
        img2.id = "img2"
        img2.src = cardSet[myCards[i].index];
        img2.className = "omoteCard";
        // クリックで選択・解除できるように設定
        img2.addEventListener("click", () => {
            img2.classList.toggle("selected");
        });
        cardContainer2.appendChild(img2);
    }
    //手札関数を呼び出し、代入
    const myJudge = judge(myCards);
    myHandResult = myJudge.role;
    myStrongest = myJudge.strongestNum;

    // 役名表示
    if (myStrongest === 12) {
        myYaku.innerText = `Aの${myHandResult}`;
    } else if (myStrongest === 11) {
        myYaku.innerText = `Kの${myHandResult}`;
    } else if (myStrongest === 10) {
        myYaku.innerText = `Qの${myHandResult}`;
    } else if (myStrongest === 9) {
        myYaku.innerText = `Jの${myHandResult}`;
    } else {
        myYaku.innerText = `${myStrongest + 2}の${myHandResult}`;
    }


    // 変更ボタン関数
    function fun3() {
        changebutton.style.display = "none";
        const cardContainer2 = document.getElementById("cardContainer2");
        const myYaku = document.querySelectorAll(".yaku")[1];
        const imgs = cardContainer2.querySelectorAll("img");
        const selectedIndices = [];
        imgs.forEach((img, i) => {
            if (img.classList.contains("selected")) {
                selectedIndices.push(i);
            }
        });
        


        function getNewCard() {
            while (true) {
                const arrRandom = Math.floor(Math.random() * 4);
                const randomNum = Math.floor(Math.random() * 13);
                const isInMyCards = myCards.some(card => card.suit === arrRandom && card.index === randomNum);
                const isInCpuCards = cpuCards.some(card => card.suit === arrRandom && card.index === randomNum);
                if (!isInMyCards && !isInCpuCards) {
                    return { suit: arrRandom, index: randomNum };
                }
            }
        }


        selectedIndices.forEach(i => {
            let newCard;
            do {
                newCard = getNewCard();
            } while (myCards.some((card, idx) => idx !== i && card.suit === newCard.suit && card.index === newCard.index) ||
                cpuCards.some(card => card.suit === newCard.suit && card.index === newCard.index));
            myCards[i] = newCard;
        });

        myCards.sort((a, b) => a.index - b.index);

        cardContainer2.innerText = "";
        for (let i = 0; i < myCards.length; i++) {
            const img2 = document.createElement("img");
            const cardSet = torannpu[myCards[i].suit];
            img2.src = cardSet[myCards[i].index];
            img2.className = "omoteCard";
            img2.addEventListener("click", () => {
                img2.classList.toggle("selected");
            });
            cardContainer2.appendChild(img2);
        }

        const myJudge = judge(myCards);
        myHandResult = myJudge.role;
        myStrongest = myJudge.strongestNum;
        if (myStrongest === 12) {
            myYaku.innerText = `Aの${myHandResult}`;
        } else if (myStrongest === 11) {
            myYaku.innerText = `Kの${myHandResult}`;
        } else if (myStrongest === 10) {
            myYaku.innerText = `Qの${myHandResult}`;
        } else if (myStrongest === 9) {
            myYaku.innerText = `Jの${myHandResult}`;
        } else {
            myYaku.innerText = `${myStrongest + 2}の${myHandResult}`;
        }
    }
    // 勝負ボタン関数
    function fun2() {
        cpuCards.length = 0;
        changebutton.style.display = "none"
        matchbutton.style.display = "none"
        const yaku = document.querySelector(".yaku");  //yakuというクラスを持つ最初の要素を取得(相手の手札の役)
        const cardContainer = document.getElementById("cardContainer");
        cardContainer.innerText = "";
        


        while (cpuCards.length < 5) {
            const arrRandom = Math.floor(Math.random() * 4);
            const randomNum = Math.floor(Math.random() * 13);
            const isInMyCards = myCards.some(card => card.suit === arrRandom && card.index === randomNum);
            const isInCpuCards = cpuCards.some(card => card.suit === arrRandom && card.index === randomNum);
            if (!isInMyCards && !isInCpuCards) {
                cpuCards.push({ suit: arrRandom, index: randomNum });
            }
        }
        


        cpuCards.sort((a, b) => a.index - b.index);
        for (let i = 0; i < cpuCards.length; i++) {
            const img = document.createElement("img");
            const cardSet = torannpu[cpuCards[i].suit];
            img.src = cardSet[cpuCards[i].index];
            img.className = "omoteCard";
            cardContainer.appendChild(img);
        }
        


        const cpuJudge = judge(cpuCards);
        cpuHandResult = cpuJudge.role;
        cpuStrongest = cpuJudge.strongestNum;
        if (cpuStrongest === 12) {
            yaku.innerText = `Aの${cpuHandResult}`;
        } else if (cpuStrongest === 11) {
            yaku.innerText = `Kの${cpuHandResult}`;
        } else if (cpuStrongest === 10) {
            yaku.innerText = `Qの${cpuHandResult}`;
        } else if (cpuStrongest === 9) {
            yaku.innerText = `Jの${cpuHandResult}`;
        } else {
            yaku.innerText = `${cpuStrongest + 2}の${cpuHandResult}`;
        }
        


        const result = compareHands({ role: myHandResult, strongestNum: myStrongest, indices: myCards.map(c => c.index) }, cpuJudge);
        if (result === -1) {
            let lose = document.createElement("img")
            lose.id = "lose"
            document.body.appendChild(lose)
        } else if (result === 1) {
            const win = document.createElement("img")
            win.id = "win"
            document.body.appendChild(win)
        } else {
            const same = document.createElement("img")
            same.id = "same"
            document.body.appendChild(same)
        }
        let retry = document.createElement("button")
        retry.id = "retry"
        document.body.appendChild(retry)
        retry.addEventListener("click", () => location.reload());
    };


    matchbutton.addEventListener("click", fun2)
    changebutton.addEventListener("click", fun3)
}
let h1 = document.getElementById("title")
let button = document.getElementById("button")
button.addEventListener("click", fun)
