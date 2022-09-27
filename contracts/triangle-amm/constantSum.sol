// SPDX-License-Identifier: me
pragma solidity 0.8.10;
import "../interfaces/IERC20.sol";

contract ConstantSum {
    IERC20 public immutable token0;
    IERC20 public immutable token1;

    uint public reserve0;
    uint public reserve1;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    constructor(address _token0, address _token1) {
        token0 = IERC20(_token0);
        token1 = IERC20(_token1);
    }

    function _mint(address _to, uint _amount) private {
        balanceOf[_to] += _amount;
        totalSupply += _amount;
    }

    function _burn(address _from, uint _amount) private {
        balanceOf[_from] -= _amount;
        totalSupply -= _amount;
    }

    function _update(uint _res0, uint _res1) private {
        reserve0 = _res0;
        reserve1 = _res1;
    }

    function swap(address _tokenIn, uint _amountIn)
        external
        returns (uint amountOut)
    {
        require(
            _tokenIn == address(token0) || _tokenIn == address(token1),
            "invalid"
        );
        // transfer in
        uint amountIn;
        if (_tokenIn == address(token0)) {
            token0.transferFrom(msg.sender, address(this), _amountIn);
            amountIn = token0.balanceOf(address(this)) - reserve0;
        } else {
            token1.transferFrom(msg.sender, address(this), _amountIn);
            amountIn = token1.balanceOf(address(this)) - reserve1;
        }
        // do math for amount out (add fee)
        amountOut = (amountIn * 997) / 1000;
        // update reserves
        if (_tokenIn == address(token0)) {
            _update(reserve0 + _amountIn, reserve1 - amountOut);
        } else {
            _update(reserve0 - _amountIn, reserve1 + amountOut);
        }
        // transfer token out
        if (_tokenIn == address(token0)) {
            token1.transfer(msg.sender, amountOut);
        } else {
            token0.transfer(msg.sender, amountOut);
        }
    }

    function addLiq() external {}

    function removeLiq() external {}
}
