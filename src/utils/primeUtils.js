// src/utils/primeUtils.js

export function generatePrimes(max) {
    const primes = [];
    const isPrime = Array(max + 1).fill(true);
    isPrime[0] = isPrime[1] = false; // 0 and 1 are not primes

    for (let i = 2; i <= max; i++) {
        if (isPrime[i]) {
            primes.push(i);
            for (let multiple = i * i; multiple <= max; multiple += i) {
                isPrime[multiple] = false;
            }
        }
    }
    return primes;
}

export function multiplyArrayElements(arr, N) {
    console.log(arr);
    const initialArray = arr; // Store the original array

    let resultArray = arr.map((i) => [[i], i]); // Start with the initial array
    console.log(resultArray);
    for (let i = 0; i < N; i++) {
        let tempArray = [];
        // Multiply each element in the resultArray with each element in the initialArray
        for (let j = 0; j < resultArray.length; j++) {
            for (let k = 0; k < initialArray.length; k++) {
                tempArray.push([
                    [...resultArray[j][0], initialArray[k]],
                    resultArray[j][1] * initialArray[k],
                ]);
            }
        }
        resultArray = tempArray; // Update the resultArray for the next iteration
    }

    return resultArray;
}
