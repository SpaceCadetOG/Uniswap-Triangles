// set variable types
let token0Name: string
let token1Name: string
let token0Price: number
let token1Price: number

// initalize variable types
token0Name = "eth"
token1Name = "usdc"
token0Price = 1400.32
token1Price = 1
// objects

let token0 = {
    token0: token0Name,
    token0Price: token0Price,
}
let token1 = {
    token1: token1Name,
    token1Price: token1Price
}

let pair = {
    tokenA: token0,
    tokenB: token1

}

console.table({
    token0: pair.tokenA.token0,
    price: pair.tokenA.token0Price,
})
console.table({
    token0: pair.tokenB.token1,
    price: pair.tokenB.token1,
})

