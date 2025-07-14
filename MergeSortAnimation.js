function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

    var vals = shuffle([...Array(ArrayLength).keys()].map(n => n + 1));
    console.log(vals);

    var displayChar = "█";

    function RenderSort(highlightRange = [-1, -1]) {
        var maxval = Math.max(...vals);
        var sorting = "";

        for (let i = 0; i < maxval; i++) {

            // Initialize row
            var currow = "";
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
            await sleep(0);
        }
            RenderSort();
    }


    return (async function main() {
        await MergeSort(0, vals.length);
    })();

}

async function repeatMergeAnimate(id, arraylength, ratio=750, scoreid = null) {

    var curFontSize = ((1/arraylength)*ratio).toString() + "px"
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

let animate = true
if (animate) {
    repeatMergeAnimate("sort1", 300, ratio=750, scoreid="sorted1");
    repeatMergeAnimate("sort2", 50, ratio=750, scoreid="sorted2");
}