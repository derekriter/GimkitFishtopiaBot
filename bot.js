bot = () => {
    //add wss to content security policy
    let csp = document.createElement("meta");
    
    document.head.appendChild(csp);
    
    document.runBot = true;
    
    const Q_BOX_CLASS = "sc-gyChMU bbvGmo";
    const A_CLASS = "sc-eTWrZZ cdbqRc";
    
    const PAIRS = {
        "A": "a",
        "B": "b",
        "C": "c",
        "D": "d",
        "E": "e",
        "F": "f",
        "G": "g",
        "H": "h"
    };
    
    class Question {
        constructor(titleDiv) {
            this.titleDiv = titleDiv;
            this.answerDivs = null;
            this.title = null;
            this.answers = null;
        }
        
        extract() {
            this.title = this.titleDiv.firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.innerHTML;
            
            this.answers = [];
            this.answerDivs = [];
            
            let answerBoxes = document.getElementsByClassName(A_CLASS);
            for(let i = 0; i < answerBoxes.length; i++) {
                this.answerDivs.push(answerBoxes.item(i));
                this.answers.push(answerBoxes.item(i).firstChild.firstChild.firstChild.firstChild.firstChild.firstChild.innerHTML);
            }
        }
    }
    
    function getQuestion() {
        let questionBoxes = document.getElementsByClassName(Q_BOX_CLASS);
        
        if(questionBoxes.length !== 1) {
            return new Question(null, null);
        }
        
        let question = new Question(questionBoxes.item(0).firstChild);
        question.extract();
        
        return question;
    }
    function clickAnswer(answerIndex) {
        ws.send(`CLICK${answerIndex}`);
    }
    
    let wsOpen = false;
    let ws = new WebSocket("ws://localhost:8001");
    ws.onopen = (e) => {
        console.log("Connected to server");
        wsOpen = true;
    };
    ws.onmessage = (e) => {
        console.log(e.data);
        if(e.data === "NEXT") shouldUpdate = true;
    };
    ws.onerror = (e) => {
        console.log("Failed to connect to clicker server.");
        document.runBot = false;
    };
    ws.onclose = (e) => {
        console.log("Server connection closed.");
        document.runBot = false;
        wsOpen = false;
    }
    let shouldUpdate = true;
    
    let loop = setInterval(() => {
        if(!document.runBot){
            clearInterval(loop);
            
            ws.close();
            console.log("Bot stopped. To restart, run 'bot()'");
            return;
        }
        if(!shouldUpdate || !wsOpen) return;
        
        let currentQ = getQuestion();
        let hasQ = currentQ.title !== null;
        
        if(!hasQ) return;
        
        if(PAIRS.hasOwnProperty(currentQ.title)) {
            let answer = PAIRS[currentQ.title];
            
            let answerI = currentQ.answers.indexOf(answer);
            
            if(answerI === -1) console.log(`Incorrect answer | Q: ${currentQ.title}, Current A: ${answer}`);
            else clickAnswer(answerI);
        }
        else console.log(`No answer | Q: ${currentQ.title}`);
        
        shouldUpdate = false;
    }, 10);
};
stopBot = () => {
    document.runBot = false;
}

bot();
