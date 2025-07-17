let isPaused = false;
let pauseResolvers = [];


function sleep(ms) {
  return new Promise(resolve => {
    const check = () => {
      if (isPaused) {
        pauseResolve = () => setTimeout(check, 10);
      } else {
        setTimeout(resolve, ms);
      }
    };
    check();
  });
}
/*
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}*/
function waitWhilePaused() {
  return new Promise(resolve => {
    if (!isPaused) {
      resolve();
    } else {
      pauseResolvers.push(resolve);
    }
  });
}

function pauseAnimation() {
  isPaused = true;
}

function resumeAnimation() {
  isPaused = false;
  while (pauseResolvers.length > 0) {
    const resolve = pauseResolvers.pop();
    resolve();
  }
}



function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  document.removeEventListener('click', initAudio);
}

// Add a one-time listener to unlock audio on first click anywhere
document.addEventListener('click', initAudio);

async function playBeep(frequency = 440, duration = 10, volume = 0.1) {

    return new Promise((resolve) => {
    const now = audioCtx.currentTime;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, now);

    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.linearRampToValueAtTime(0, now + duration / 1000);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(now);
    oscillator.stop(now + duration / 1000);

    oscillator.onended = () => {
        resolve();
    };
    });
}

async function MergeAnimate(CurElementID, ArrayLength = 100) {
    var parSyntaxStart = "<p class = \"closepars\">";
    var parSyntaxEnd = "</p>";
    var spanSyntaxStart = "<span style=\"color: red;\">";
    var spanSyntaxEnd = "</span>";

    //let CurElementID = "sort"
    //var vals = [1,2,3,4,5,5]; 
    //var vals = Array.from({ length: 100 }, () => Math.floor(Math.random() * 50) + 1)
    //var vals = Array.from({ length: 150 }, (_, i) => i + 1).sort(() => Math.random()); reverse
    //var vals = Array.from({ length: 150 }, (_, i) => i + 1).sort(() => Math.random()-1);

    let vals = shuffle([...Array(ArrayLength).keys()].map(n => n + 1));
    console.log(vals);

    var displayChar = "█";

    function RenderSort(highlightRange = [-1, -1]) {
        let maxval = Math.max(...vals);
        let sorting = "";

        for (let i = 0; i < maxval; i++) {

            // Initialize row
            let currow = "";
            for (let j = 0; j < vals.length; j++) {

                // First span index in row
                if (j == highlightRange[0]) {
                    currow += spanSyntaxStart;
                }

                // If there is supposed to be a block place a block otherwise place a space
                if (vals[j] >= maxval - i) {
                    currow += displayChar;
                } else {
                    currow += " ";
                }

                // Last span index in row
                if (j == highlightRange[1]){
                    currow += spanSyntaxEnd;
                }
            }
            //console.log(currow);
            sorting += parSyntaxStart + currow + parSyntaxEnd;
        } 
        //parSyntaxStart + "aaa a" + parSyntaxEnd + parSyntaxStart + "aaaaa" + parSyntaxEnd

        

        document.getElementById(CurElementID).innerHTML = sorting;
    }

    async function MergeSort(startidx, endidx) {
        if (endidx - startidx <= 1) {
            return; // Base case length is 1 or 0
        }

        const mid = Math.floor((startidx + endidx) / 2);

        await MergeSort(startidx, mid);
        await MergeSort(mid, endidx);

        let merged = [];
        let leftidx = startidx;
        let rightidx = mid;

        while (leftidx < mid && rightidx < endidx) {
            if (vals[leftidx] <= vals[rightidx]) {
                merged.push(vals[leftidx]);
                leftidx++;
            } else {
                merged.push(vals[rightidx]);
                rightidx++;
            }
        }

        while (leftidx < mid) {
            merged.push(vals[leftidx]);
            leftidx++;
        }
        while (rightidx < endidx) {
            merged.push(vals[rightidx]);
            rightidx++;
        }

        for (let k = 0; k < merged.length; k++) {
            vals[startidx + k] = merged[k];
            RenderSort([startidx, startidx + k]);

            playBeep(1000*merged[k]/ArrayLength, 100, 0.02);
            
            await waitWhilePaused();
            await sleep(0);
        }
            RenderSort();
    }


    return (async function main() {
        await MergeSort(0, vals.length);
    })();

}

async function repeatMergeAnimate(id, arraylength, ratio=750, scoreid = null) {

    let curFontSize = ((1/arraylength)*ratio).toString() + "px"
    document.getElementById(id).style.fontSize = curFontSize;

    let count = 0
    if (scoreid != null){
        document.getElementById(scoreid).innerHTML = "n = " + arraylength.toString() + ", Sorted " + count.toString() + " Times";

        //document.getElementById(scoreid).style.width = window.getComputedStyle(document.getElementById(id)).width;
    }

    let totalElapsed = 0

    while (true) {
        let startTime = Date.now()
        await MergeAnimate(id, arraylength);
        let endTime = Date.now()
        let elapsedTimeSec = (endTime - startTime)/1000

        count += 1
        totalElapsed += elapsedTimeSec
        let averageElapsed = (totalElapsed/count).toFixed(4);
        let elapsedString = "<br>Recent Run: " + elapsedTimeSec.toString() + "s, Average Runs: " + averageElapsed + "s"

        if (scoreid != null){
            document.getElementById(scoreid).innerHTML = "n = " + arraylength.toString() + ", Sorted " + count.toString() + " Times" + elapsedString;
        }

        await sleep(500);
    }
}