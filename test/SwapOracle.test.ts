import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
const FACTORY = "0x1F98431c8aD98523631AE4a59f267346ea31F984";
const DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const DECIMALS_0 = 6n;
const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
const DECIMALS_1 = 18n;
const GMX = "0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a";
const WBTC = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f";
const DECIMALS_3 = 8n;
const FEE = 3000;
// Pair
describe("SwapOracle", function ()
{
  async function deployFixture()
  {
    const [owner, user] = await ethers.getSigners();
    const Oracle = await ethers.getContractFactory("SwapOracle");
    const oracle = await Oracle.deploy(FACTORY);

    return { oracle, owner, user };
  }

  describe("Deployment", function ()
  {
    it("Should get Pool", async function ()
    {
      const { oracle } = await loadFixture(deployFixture);

      let poolAddress = await oracle.getPool(WETH, USDC, FEE);
      console.log(poolAddress)
    });


  });

});
