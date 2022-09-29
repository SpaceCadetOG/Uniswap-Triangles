//SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "./SingleOracle.sol";

contract SingleSwapV3 {
    address private constant FACTORY =
        0x1F98431c8aD98523631AE4a59f267346ea31F984;
    ISwapRouter public constant swapRouter =
        ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);

    function getPoolAddress(
        address tokenIn,
        address tokenOut,
        uint24 pool
    ) public view returns (address oracle) {
        oracle = SwapOracle(FACTORY).getPool(tokenIn, tokenOut, pool);
        return (oracle);
    }

    function SingleSwap(
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint24 pool
    ) external returns (uint256 amountOut) {
        TransferHelper.safeTransferFrom(
            tokenIn,
            msg.sender,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(tokenIn, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: pool,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }
}
