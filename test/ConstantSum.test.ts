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
    const sum = await SUM.deploy('', '');

    return { sum, owner, user };
  }

  describe("Deployment", function ()
  {
    it("Should get Token 0 and Token 1", async function ()
    {
      const { sum, owner } = await loadFixture(deployFixture);

      expect(await sum.token0()).equal(owner.address);
    });


  });

  describe("Swap()", function ()
  {
    it("Should get Token 0 and Token 1", async function ()
    {
      const { sum, owner } = await loadFixture(deployFixture);

    });


  });

});
