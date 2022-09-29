//SPDX-License-Identifier:
pragma solidity 0.8.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "./SingleOracle.sol";

// https://docs.uniswap.org/protocol/guides/swaps/single-swaps
contract MultiSwapV3 {
    address private constant FACTORY =
        0x1F98431c8aD98523631AE4a59f267346ea31F984;
    ISwapRouter public constant swapRouter =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    constructor() {}

    function getPoolAddress(
        address tokenIn,
        address tokenMid,
        address tokenOut,
        uint24 pool1,
        uint24 pool2
    ) public view returns (address oracle1, address oracle2) {
        oracle1 = SwapOracle(FACTORY).getPool(tokenIn, tokenMid, pool1);
        oracle2 = SwapOracle(FACTORY).getPool(tokenMid, tokenOut, pool2);
        return (oracle1, oracle2);
    }

    function swapMulti(
        address tokenIn,
        address tokenMid,
        address tokenOut,
        uint24 pool1,
        uint24 pool2,
        uint256 amountIn
    ) external returns (uint256 amountOut) {
        TransferHelper.safeTransferFrom(
            tokenIn,
            msg.sender,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(tokenIn, address(swapRouter), amountIn);

        ISwapRouter.ExactInputParams memory params = ISwapRouter
            .ExactInputParams({
                path: abi.encodePacked(
                    tokenIn,
                    pool1,
                    tokenMid,
                    pool2,
                    tokenOut
                ),
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0
            });

        // Executes the swap.
        amountOut = swapRouter.exactInput(params);
    }
}
