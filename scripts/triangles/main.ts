const ethers = require('ethers')
require("dotenv").config();
const QuoterABI = require('@uniswap/swap-router-contracts/artifacts/contracts/lens/Quoter.sol/Quoter.json').abi
const IUniswapV3PoolABI = require('@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json').abi
const url: string = `https://eth-mainnet.g.alchemy.com/v2/${ process.env.API_KEY }`
// const url: string = "https://arb1.arbitrum.io/rpc"
const provider = new ethers.providers.JsonRpcProvider(url)
const uni_address: string = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
const aave_address: string = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
const v3_factory_address: string = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const factory_address: string = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f"
const TokenABI = [
    "function name() view returns (string)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function totalSupply() external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function transfer(address to, uint amount) returns (bool)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",

];
const WETHAbi = [
    "function deposit() external payable",
    "function withdraw(uint) external",
    "function balanceOf(address account) external view returns (uint)",
    "function transfer(address to, uint amount) returns (bool)",
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
];
const poolV3Abi = [
    'function factory() external view returns (address)',
    'function token0() external view returns (address)',
    'function token1() external view returns (address)',
    'function fee() external view returns (uint24)',
    // 'function tickSpacing() external view returns (int24)',
    // 'function maxLiquidityPerTick() external view returns (uint128)',
]
// Read File ************
function getFile(fPath: string)
{
    const fs = require("fs")

    try
    {
        const data = fs.readFileSync(fPath, 'utf8')
        return data
    } catch (error)
    {
        return []

    }
}

// CALCULATE ARB //////////////////////////
async function calculateArbitrage(amountIn: number, amountOut: number, surfaceObj: any) {

    // Calculate profit or loss
    let threshold = 0
    let resultArray = [surfaceObj]
    let profitLossPerc = 0
    let profitLoss = amountOut - amountIn
    if (profitLoss > threshold) {
      profitLossPerc = (profitLoss / amountIn) * 100
  
      // Provide Output Result
      resultArray.push({profitLossPerc: profitLossPerc})
      console.log(resultArray)
    }
    return
  }
  

async function getBlockNumber()
{
    let block = await provider.getBlockNumber()
    return block

}
async function getTokenName(address: string)
{
    let tokenContract = new ethers.Contract(address, TokenABI, provider)
    let tokenName = await tokenContract.name()
    return tokenName
}
async function getTokenSymbol(address: string)
{
    let tokenContract = new ethers.Contract(address, TokenABI, provider)
    let tokenSymbol = await tokenContract.symbol()
    return tokenSymbol
}
async function getTokenSupply(address: string)
{
    let tokenContract = new ethers.Contract(address, TokenABI, provider)
    let tokenDecimal = await tokenContract.decimals()
    let tokenTotalSupply = await tokenContract.totalSupply()
    return ethers.utils.formatUnits(tokenTotalSupply, tokenDecimal)
}
async function getTokenDecimals(address: string)
{
    let tokenContract = new ethers.Contract(address, TokenABI, provider)
    let tokenDecimal = await tokenContract.decimals()
    return tokenDecimal
}
// Get Price ************
async function getPrice(factory: any, amountIn: number, tradeDirection: string)
{
    const ABI = [
        'function token0() external view returns (address)',
        'function token1() external view returns (address)',
        'function fee() external view returns (uint24)'
    ];
    const address = factory

    // Get Pool Token Information
    const poolContract = new ethers.Contract(address, ABI, provider)
    let token0Address = await poolContract.token0()
    let token1Address = await poolContract.token1()
    let tokenFee = await poolContract.fee()


    // Token Info
    let addressArray = [token0Address, token1Address]
    let tokenInfoArray = []
    for (let i = 0; i < addressArray.length; i++)
    {
        let tokenAddress = addressArray[i]
        let tokenABI = [
            "function name() view returns (string)",
            "function symbol() view returns (string)",
            "function decimals() view returns (uint)"
        ]
        let contract = new ethers.Contract(tokenAddress, tokenABI, provider)
        let tokenSymbol = await getTokenSymbol(contract.address)
        let tokenName = await getTokenName(contract.address)
        let tokenDecimals = await getTokenDecimals(contract.address)
        let obj = {
            id: "token" + i,
            tokenSymbol: tokenSymbol,
            tokenName: tokenName,
            tokenDecimals: tokenDecimals,
            tokenAddress: tokenAddress
        }
        tokenInfoArray.push(obj)
    }

    // Identify the correct token to input as A and also B respectively
    let inputTokenA: string = ''
    let inputDecimalsA: number = 0
    let inputTokenB: string = ''
    let inputDecimalsB: number = 0

    if (tradeDirection == "baseToQuote")
    {
        inputTokenA = tokenInfoArray[0].tokenAddress
        inputDecimalsA = tokenInfoArray[0].tokenDecimals
        inputTokenB = tokenInfoArray[1].tokenAddress
        inputDecimalsB = tokenInfoArray[1].tokenDecimals
    }

    if (tradeDirection == "quoteToBase")
    {
        inputTokenA = tokenInfoArray[1].tokenAddress
        inputDecimalsA = tokenInfoArray[1].tokenDecimals
        inputTokenB = tokenInfoArray[0].tokenAddress
        inputDecimalsB = tokenInfoArray[0].tokenDecimals
    }

    // Reformat Amount In
    // if (!isNaN(amountIn)) { amountIn = amountIn.toString() }
    let amount = ethers.utils.parseUnits(amountIn.toString(), inputDecimalsA).toString()
    console.log(inputTokenA, inputTokenB)
    console.log(amountIn)
    // Get Uniswap V3 Quote
    const quoterAddress = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6";
    const quoterContract = new ethers.Contract(quoterAddress, QuoterABI, provider)
    let quotedAmountOut = 0
    try
    {
        quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
            inputTokenA,
            inputTokenB,
            tokenFee,
            amount,
            0)
    } catch (err)
    {
        return 0
    }

    // Format Output
    let outputAmount = ethers.utils.formatUnits(quotedAmountOut, inputDecimalsB).toString()
    console.log(outputAmount)
    return outputAmount

}

// Read File ************
async function getDepth(amountIn: number, limit: number)
{
    console.log('Reading Surface Rate info')
    let fileInfo: string = await getFile("uniswap_surface_rates.json")
    let fileJsonArray = JSON.parse(fileInfo)
    let fileJsonArrayLimit = fileJsonArray.slice(0, limit)

    for (let i = 0; i < fileJsonArrayLimit.length; i++)
    {
        // Extract the variables
        let pair1ContractAddress = fileJsonArrayLimit[i].poolContract1
        let pair2ContractAddress = fileJsonArrayLimit[i].poolContract2
        let pair3ContractAddress = fileJsonArrayLimit[i].poolContract3
        let trade1Direction = fileJsonArrayLimit[i].poolDirectionTrade1
        let trade2Direction = fileJsonArrayLimit[i].poolDirectionTrade2
        let trade3Direction = fileJsonArrayLimit[i].poolDirectionTrade3

        // Trade 1
        console.log("Checking trade 1 acquired coin...")
        let acquiredCoinT1 = await getPrice(pair1ContractAddress, amountIn, trade1Direction)

        // Trade 2
        console.log("Checking trade 2 acquired coin...")
        if (acquiredCoinT1 == 0) { return }
        let acquiredCoinT2 = await getPrice(pair2ContractAddress, acquiredCoinT1, trade2Direction)

        // Trade 3
        console.log("Checking trade 3 acquired coin...")
        if (acquiredCoinT2 == 0) { return }
        let acquiredCoinT3 = await getPrice(pair3ContractAddress, acquiredCoinT2, trade3Direction)

        let result = await calculateArbitrage(amountIn, acquiredCoinT3, fileJsonArrayLimit[i])
        // console.log(result)

    }

    return
}


async function main()
{
    getDepth(1, 10)
}

main()