import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SwapOracle", function ()
{
  async function deployFixture()
  {
    const [owner, user] = await ethers.getSigners();
    const Oracle = await ethers.getContractFactory("SwapOracle");
    const oracle = await Oracle.deploy();

    return { oracle, owner, user };
  }

  describe("Deployment", function ()
  {
    it("Should get TWAP", async function ()
    {
      const { oracle } = await loadFixture(deployFixture);

      expect(await oracle.GetTWAP()).equal(0);
    });


  });

});
