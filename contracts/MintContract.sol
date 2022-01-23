// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

library SafeMath {
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a, "SafeMath: addition overflow");

    return c;
  }

  function add32(uint32 a, uint32 b) internal pure returns (uint32) {
    uint32 c = a + b;
    require(c >= a, "SafeMath: addition overflow");

    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    return sub(a, b, "SafeMath: subtraction overflow");
  }

  function sub(
    uint256 a,
    uint256 b,
    string memory errorMessage
  ) internal pure returns (uint256) {
    require(b <= a, errorMessage);
    uint256 c = a - b;

    return c;
  }

  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    if (a == 0) {
      return 0;
    }

    uint256 c = a * b;
    require(c / a == b, "SafeMath: multiplication overflow");

    return c;
  }

  function mul32(uint32 a, uint32 b) internal pure returns (uint32) {
    if (a == 0) {
      return 0;
    }

    uint32 c = a * b;
    require(c / a == b, "SafeMath: multiplication overflow");

    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    return div(a, b, "SafeMath: division by zero");
  }

  function div(
    uint256 a,
    uint256 b,
    string memory errorMessage
  ) internal pure returns (uint256) {
    require(b > 0, errorMessage);
    uint256 c = a / b;
    return c;
  }
}

interface IERC20Mintable {
  function mint(uint256 amount_) external;

  function mint(address account_, uint256 ammount_) external;
}

interface IERC20 {
  function decimals() external view returns (uint8);

  function balanceOf(address account) external view returns (uint256);

  function transfer(address recipient, uint256 amount) external returns (bool);

  function approve(address spender, uint256 amount) external returns (bool);

  function totalSupply() external view returns (uint256);

  function transferFrom(
    address sender,
    address recipient,
    uint256 amount
  ) external returns (bool);

  event Transfer(address indexed from, address indexed to, uint256 value);

  event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract MintContract is Ownable {
  using SafeMath for uint256;
  using SafeMath for uint32;

  address public mintableToken;
  address public buyToken;
  uint256 public mintRate = 10000;
  bool public paused = false;

  event WithdrawalERC20(uint256 amount);

  constructor(address _mintableToken, address _buyToken) {
    require(_mintableToken != address(0));
    require(_buyToken != address(0));
    mintableToken = _mintableToken;
    buyToken = _buyToken;
  }

  function mint(uint256 _amount) public {
    require(!paused);
    require(_amount > 0, "Amount too small");
    require( _amount < 10, "Amount too large");

    uint256 amount = _amount.mul( 10**IERC20(buyToken).decimals() );
    IERC20(buyToken).transferFrom(msg.sender, address(this), amount);
    uint256 value = valueOf(_amount);
    IERC20Mintable(mintableToken).mint(msg.sender, value);
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }

  function setRate(uint256 _newRate) public onlyOwner {
    mintRate = _newRate;
  }

  function setBuyToken(address _newBT) public onlyOwner {
    require(_newBT != address(0));
    buyToken = _newBT;
  }

  function setMintableToken(address _newMT) public onlyOwner {
    require(_newMT != address(0));
    mintableToken = _newMT;
  }

  function valueOf(uint256 _amount) public view returns (uint256 value_) {
    uint256 _value_ = _amount.mul( 10**IERC20(mintableToken).decimals() );
    value_ = _value_.mul(mintRate).div(10000);
  }

  function withdrawECR20() public onlyOwner {
    uint256 amount = IERC20(buyToken).balanceOf(address(this));
    IERC20(buyToken).transfer(msg.sender, amount);
    emit WithdrawalERC20(amount);
  }
}
