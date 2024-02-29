bot = () => {
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
        "G": "g"
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
    function clickAnswer(q, answerIndex) {
        q.answerDivs[answerIndex].click();
    }
    
    let loop = setInterval(() => {
        if(document.runBot !== true){
            clearInterval(loop);
            return;
        }
        
        let currentQ = getQuestion();
        let hasQ = currentQ.title !== null;
        
        if(!hasQ) return;
        
        if(PAIRS.hasOwnProperty(currentQ.title)) {
            let answer = PAIRS[currentQ.title];
            
            answerI = currentQ.answers.findIndex(answer);
            
            if(answerI === -1) console.log("Incorrect answer");
            else clickAnswer(currentQ, answerI);
        }
        else console.log("No answer");
    }, 100);
};
stopBot = () => {
    document.runBot = false;
}

bot();
