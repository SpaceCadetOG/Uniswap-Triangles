

import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { doesNotReject } from "assert";

describe("FlashSwap", function ()
{
    async function deployFixture()
    {
        const [owner, user] = await ethers.getSigners();
        const FlashSwap = await ethers.getContractFactory("UniswapV3Flash");
        const flashSwap = await FlashSwap.deploy("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "0xdAC17F958D2ee523a2206206994597C13D831ec7", 3000);
        await network.provider.request({
            method: "hardhat_reset",
            params: [
                {
                    forking: {
                        jsonRpcUrl: "https://mainnet.infura.io/v3/bf2257114f234bbfa9053e6e89d931b3",
                    },
                },
            ],
        });

        return { flashSwap, owner, user };
    }

    describe("Deployment", function ()
    {
        it("Should get TWAP", async function ()
        {
            const { flashSwap } = await loadFixture(deployFixture);
            let p = await flashSwap.flash(1,1)

        });


    });

});
