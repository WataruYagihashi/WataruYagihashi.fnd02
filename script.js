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
    ["supe2.png", "supe3.png", "supe4.png", "supe5.png", "supe6.png", "supe7.png", "supe8.png", "supe9.png", "supe10.png",
        "supe11.png", "supe12.png", "supe13.png", "supe1.png"],
    ["daiya2.png", "daiya3.png", "daiya4.png", "daiya5.png", "daiya6.png", "daiya7.png", "daiya8.png", "daiya9.png", "daiya10.png",
        "daiya11.png", "daiya12.png", "daiya13.png", "daiya1.png"],
    ["hat2.png", "hat3.png", "hat4.png", "hat5.png", "hat6.png", "hat7.png", "hat8.png", "hat9.png", "hat10.png", "hat11.png",
        "hat12.png", "hat13.png", "hat1.png"],
    ["kura2.png", "kura3.png", "kura4.png", "kura5.png", "kura6.png", "kura7.png", "kura8.png", "kura9.png", "kura10.png",
        "kura11.png", "kura12.png", "kura13.png", "kura1.png"]
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
