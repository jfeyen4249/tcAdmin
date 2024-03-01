

const numbers = [2,10,1,43,22,5,32,45,12,56,23,321,6]

let highNumber = [0,0]

for(let i=0; i<numbers.length; i++) {

    if(numbers[i] > highNumber[0]) {
        highNumber[0] = numbers[i]
    }

    
    
}

console.log(highNumber)