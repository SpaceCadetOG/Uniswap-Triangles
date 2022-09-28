import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SwapOracle__factory } from "../typechain-types";

describe("ConstantSum", function ()
{
  async function deployFixture()
  {
    const [owner, user] = await ethers.getSigners();
    const SUM = await ethers.getContractFactory("ConstantSum");
    const sum = await SUM.deploy("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "0xdAC17F958D2ee523a2206206994597C13D831ec7");

    return { sum, owner, user };
  }

  describe("Deployment", function ()
  {
    it("Should get Token 0", async function ()
    {
      const { sum, owner } = await loadFixture(deployFixture);

      expect(await sum.token0()).equal("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
    });
    it("Should get Token 1", async function ()
    {
      const { sum, owner } = await loadFixture(deployFixture);

      expect(await sum.token1()).equal("0xdAC17F958D2ee523a2206206994597C13D831ec7");
    });
  });

  describe("Swap()", function ()
  {
    it("Should ...", async function ()
    {
      const { sum, owner } = await loadFixture(deployFixture);

    });


  });

});
