import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, network } from "hardhat";

const FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
// USDC
const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const DECIMALS_0 = 6n;
// WETH
const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
const DECIMALS_1 = 18n;

// GMX
const GMX = "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a";

const WBTC = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f";
const DECIMALS_3 = 8n;

// 0.3%
const FEE = 3000;
// Pair
// 0x8ad599c3A0ff1De082011EFDDc58f1908eb6e6D8

describe("UniswapV3 SWAP", () =>
{
  async function deployFixture()
  {
    // Contracts are deployed using the first signer/account by default
    const [owner, user] = await ethers.getSigners();
    let borrowAmount, fundAmount, weth, dai, usdc;

    // will mock this acct

    const TokenAbi = [
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

    const UniswapV3Swap = await ethers.getContractFactory("SingleSwapV3");
    const swap = await UniswapV3Swap.deploy();
    await swap.deployed();

    // const TestChainlink = await ethers.getContractFactory("ArbitrumPrices");
    // let testChainlink = await TestChainlink.deploy();
    // await testChainlink.deployed();

    weth = await ethers.getContractAt(WETHAbi, WETH);
    dai = await ethers.getContractAt(TokenAbi, DAI);
    usdc = await ethers.getContractAt(TokenAbi, USDC);

    fundAmount = 20000n * 10n ** 18n; // 20000 dai
    let ethAmount = 4n * 10n ** 18n; // 1 eth

    await weth.connect(owner).deposit({ value: ethAmount });
    await weth.connect(owner).approve(swap.address, ethAmount);

    let ethbalance = await owner.getBalance("latest");

    console.log(
      `Balance Of user eth: ${ ethers.utils.formatUnits(ethbalance, 18) }`
    );

    console.log(
      "_______________________________________________________________________________________"
    );
    return {
      owner,
      dai,
      usdc,
      ethAmount,
      swap,
      weth,
    };
  }

  it.only(" WETH => USDC on Uniswap  => 0.05%", async () =>
  {
    const { swap, owner, ethAmount, dai, usdc } =
      await loadFixture(deployFixture);
    let poolAddress = await swap.getPoolAddress(WETH, USDC, FEE);
    console.log(`Pool Address ${poolAddress}`)
    const amount = 10n ** 18n;
    await swap.SingleSwap(WETH, amount, usdc.address, 500);

    console.log(
      ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
    );
  });

  it.only(" WETH => DAI on Uniswap  => 0.05%", async () =>
  {
    const { swap, owner, ethAmount, dai, usdc } =
      await loadFixture(deployFixture);

    const amount = 10n ** 18n;
    await swap.SingleSwap(WETH, amount, dai.address, 500);

    console.log(ethers.utils.formatEther(await dai.balanceOf(owner.address)));
  });

  it.only(" WETH => USDC on Uniswap  => 0.3%", async () =>
  {
    const { swap, owner, ethAmount, dai, usdc } =
      await loadFixture(deployFixture);

    const amount = 10n ** 18n;
    await swap.SingleSwap(WETH, amount, usdc.address, 3000);

    console.log(
      ethers.utils.formatUnits(await usdc.balanceOf(owner.address), 6)
    );
  });

  it.only(" WETH => DAI on Uniswap  => 0.3%", async () =>
  {
    const { swap, owner, ethAmount, dai, usdc } =
      await loadFixture(deployFixture);

    const amount = 10n ** 18n;
    await swap.SingleSwap(WETH, amount, dai.address, 3000);

    console.log(ethers.utils.formatEther(await dai.balanceOf(owner.address)));
  });
});
