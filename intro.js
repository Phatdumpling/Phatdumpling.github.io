const greetings = ["Hello", "Hola", "Bonjour", "Hallo", "Ciao", "こんにちは", "안녕하세요", "你好", "Olá", "Привет"];
const introDiv = document.getElementById('intro');
let index = 0;
var doIntro = false;

function cycleGreetings() {
    if (doIntro) {
        if (index < greetings.length) {
        introDiv.textContent = greetings[index];
        index++;
        setTimeout(cycleGreetings, 100);
        } else {
        introDiv.style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        }
    } else {
        introDiv.style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
    }
    
}