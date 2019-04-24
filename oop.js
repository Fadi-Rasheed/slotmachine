const startButton = document.querySelector(".start");
const wheel1 = document.querySelector(".wheel1");
const wheel2 = document.querySelector(".wheel2");
const wheel3 = document.querySelector(".wheel3");
const message = document.querySelector(".message");
let isSpinning = [false,false,false];
let spinSound = new Audio("./sounds/spin.mp3");
let winSound = new Audio("./sounds/win.mp3");
let loseSound = new Audio("./sounds/lose.mp3");

startButton.addEventListener("click",()=>{
    machine.start();
})

class Machine{
    constructor(beginCredit){
        this.beginCredit = beginCredit;
    }
    start(){
        if (this.beginCredit < 10) {
            message.innerHTML = "You Do Not Have Enough Coins"
            return
        }
        if (isSpinning.every(elem => elem !== false)) return
        spinSound.play();
        spinSound.loop = true;
        this.money(-10);
        firstWheel.slotImg();
        secondWheel.slotImg();
        thirdWheel.slotImg();
        isSpinning = []
        message.classList.remove("show-message");
        message.innerHTML = "";
    };
    win(){
        if (isSpinning.length !== 3 || isSpinning.every(elem => elem !== false)) return
        spinSound.loop = false;
        const pic1 = wheel1.classList[2];
        const pic2 = wheel2.classList[2];
        const pic3 = wheel3.classList[2];
        if (pic1 === "i1" && pic2 === "i1" && pic3==="i1") {
            this.money(200);
            message.classList.add("show-message");
            message.innerHTML = "Jackpot";
            winSound.play();
        } else if (pic1 === "i1") {
            this.money(20);
            message.classList.add("show-message");
            message.innerHTML = "You won 20 coins";
            winSound.play();
        } else if (pic1 === pic2 && pic1 === pic3) {
            this.money(50)
            message.classList.add("show-message");
            message.innerHTML = "You won 50 coins";
            winSound.play();
        } else {
            message.classList.add("show-message");
            message.innerHTML = "You Have Lost, Try Again";
            loseSound.play();
            
        }
    };
    money(amount=0){
        this.beginCredit +=  amount;
        const credit = document.querySelector(".credit");
        credit.innerHTML = this.beginCredit;
    };
}

class Wheels{
    constructor(wheelNum,min,max){
        this.wheelNum = wheelNum;
        this.min = min;
        this.max = max;
        this.lastInt;
    }
    spin(){
        let int = this.randomizer(this.min,this.max);
        if (int !== this.lastInt){
            this.lastInt = int;
            this.appendPic(int);
        } else {
            int = int % 5 + 1;
            this.lastInt = int;
            this.appendPic(int);
        }
    };
    appendPic(classInt){
        const wheelClass = this.wheelNum.classList[2];
        this.wheelNum.classList.remove(`${wheelClass}`);
        this.wheelNum.classList.add(`i${classInt}`);
    };
    randomizer(min,max){
        return Math.floor((Math.random() * (max-min+1)) + min);
    };
    slotImg(){
        let spinning = setInterval(this.spin.bind(this),150);
        setTimeout(function(){
            clearInterval(spinning)
            isSpinning.push(false);
            machine.win();
        }, this.randomizer(1,4)*1000 + 500);
    };
}

let machine = new Machine(500);
let firstWheel = new Wheels(wheel1,1,5);
let secondWheel = new Wheels(wheel2,1,5);
let thirdWheel = new Wheels(wheel3,1,5);

machine.money();