import { ethers } from "ethers";
import { Address } from 'cluster'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
// import { FACTORY_ADDRESS } from '@uniswap/sdk'
const fs = require('fs')
require("dotenv").config();
let eth_url: string = `https://eth-mainnet.g.alchemy.com/v2/${ process.env.API_KEY }`
const provider = new ethers.providers.JsonRpcProvider(eth_url)
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
    'function tickSpacing() external view returns (int24)',
    'function maxLiquidityPerTick() external view returns (uint128)',
]
const IUniswapV2Factory = [
    "event PairCreated(address indexed token0, address indexed token1, address pair, uint)",
    "function getPair(address tokenA, address tokenB) external view returns (address pair)",
    "function allPairs(uint) external view returns (address pair)",
    "function allPairsLength() external view returns (uint)",
]
const IUniswapV3Factory = [
    " function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)",
]
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
async function getPairWithETH(address: string)
{
    // liquidity pool 
    // create tokenA, 100 , 2 1/50 = 0.05 eth
    let uniContract = new ethers.Contract(factory_address, IUniswapV2Factory, provider)


    // WETH
    const weth: string = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    let wethContract = new ethers.Contract(weth, TokenABI, provider)

    let tokenContract = new ethers.Contract(address, TokenABI, provider)
    return uniContract.getPair(wethContract.address, tokenContract.address)
}
async function getPriceInETH_V2(address: string)
{
    // liquidity pool 
    // create tokenA, 100 , 2 1/50 = 0.05 eth
    let uniContract = new ethers.Contract(factory_address, IUniswapV2Factory, provider)


    // WETH
    const wethContract: string = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const tokenContract: string = address
    let weth = new ethers.Contract(wethContract, TokenABI, provider)
    let token = new ethers.Contract(tokenContract, TokenABI, provider)
    let tokenDecimal = await token.decimals()

    let pool = uniContract.getPair(weth.address, token.address)
    let pool_Bal_weth = await weth.balanceOf(pool)
    let pool_Bal_token = await token.balanceOf(pool)

    // console.log(ethers.utils.formatEther(pool_Bal_weth),ethers.utils.formatEther(pool_Bal_token))
    let price = 1 / (pool_Bal_token / pool_Bal_weth)

    return price
}
async function getPriceToETH_V2(address: string)
{
    // liquidity pool 
    // create tokenA, 100 , 2 1/50 = 0.05 eth
    let uniContract = new ethers.Contract(factory_address, IUniswapV2Factory, provider)


    // WETH
    const wethContract: string = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    const tokenContract: string = address
    let weth = new ethers.Contract(wethContract, TokenABI, provider)
    let token = new ethers.Contract(tokenContract, TokenABI, provider)
    let tokenDecimal = await token.decimals()

    let pool = uniContract.getPair(weth.address, token.address)
    let pool_Bal_weth = await weth.balanceOf(pool)
    let pool_Bal_token = await token.balanceOf(pool)



    // console.log(ethers.utils.formatEther(pool_Bal_weth),ethers.utils.formatEther(pool_Bal_token))


    let price = (pool_Bal_token / pool_Bal_weth)

    return price
}
async function getPriceInUSD_V2(address: string)
{
    // liquidity pool 
    // create tokenA, 100 , 2 1/50 = 0.05 eth
    let uniContract = new ethers.Contract(factory_address, IUniswapV2Factory, provider)
    const daiContract: string = "0x6B175474E89094C44Da98b954EedeAC495271d0F"

    let priceEth = await getPriceInETH_V2(daiContract)
    let priceToken = await getPriceInETH_V2(address)
    priceEth = 1 / priceEth
    let price = priceEth * priceToken
    return price
}
async function Pull_Prices_V2(token0: string, token1: string)
{
    const uni_address: string = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
    const aave_address: string = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
    let block = await getBlockNumber()
    const uni_tokenName = await getTokenName(token0)
    const uni_tokenSymbol = await getTokenSymbol(token0)
    const uni_tokenTS = await getTokenSupply(token0)
    const uni_tokenPairAddressWithETH = await getPairWithETH(token0)
    const uni_tokenPriceInETH = await getPriceInETH_V2(token0)
    const uni_tokenPriceToETH = await getPriceToETH_V2(token0)
    const uni_tokenPriceInUSD = await getPriceInUSD_V2(token0)

    console.log(block)
    console.log(`Token Name: ${ uni_tokenName }: Symbol: ${ uni_tokenSymbol } totalSupply: ${ uni_tokenTS }`)
    console.log(`TokenPair: ${ uni_tokenSymbol } / WETH = ${ uni_tokenPairAddressWithETH }`)
    console.log(`Price of 1 ETH for ${ uni_tokenSymbol }: ${ uni_tokenPriceInETH }, Price of 1 ${ uni_tokenSymbol } to ETH: ${ uni_tokenPriceToETH }`)
    console.log(`Price in USD ${ uni_tokenSymbol }: $${ uni_tokenPriceInUSD } in Dai`)

    const aave_tokenName = await getTokenName(token1)
    const aave_tokenSymbol = await getTokenSymbol(token1)
    const aave_tokenTS = await getTokenSupply(token1)
    const aave_tokenPairAddressWithETH = await getPairWithETH(token1)
    const aave_tokenPriceInETH = await getPriceInETH_V2(token1)
    const aave_tokenPriceToETH = await getPriceToETH_V2(token1)
    const aave_tokenPriceInUSD = await getPriceInUSD_V2(token1)

    console.log(block)
    console.log(`Token Name: ${ aave_tokenName }: Symbol: ${ aave_tokenSymbol } totalSupply: ${ aave_tokenTS }`)
    console.log(`TokenPair: ${ aave_tokenSymbol } / WETH = ${ aave_tokenPairAddressWithETH }`)
    console.log(`Price of 1 ETH for ${ aave_tokenSymbol }: ${ aave_tokenPriceInETH }, Price of 1 ${ aave_tokenSymbol } to ETH: ${ aave_tokenPriceToETH }`)
    console.log(`Price in USD ${ aave_tokenSymbol }: $${ aave_tokenPriceInUSD } in Dai`)
}

// async function Pull_Prices_V3(address: string)
// {
//     // liquidity pool 
//     // create tokenA, 100 , 2 1/50 = 0.05 eth
//     let uniFactory = new ethers.Contract(v3_factory_address, IUniswapV3Factory, provider)

//     const weth: string = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
//     let wethContract = new ethers.Contract(weth, TokenABI, provider)
//     let tokenContract = new ethers.Contract(address, TokenABI, provider)
//     let pool = await uniFactory.getPool(tokenContract.address, wethContract.address, 3000)
//     let uniPool = new ethers.Contract(pool, IUniswapV3PoolABI, provider)
//     let token_pool = await uniPool.token0()

//     return token_pool


// }

async function main()
{

    // console.log(await Pull_Prices_V3(uni_address))
}

main()
