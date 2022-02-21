// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;
//Safe Math Interface
contract SafeMath {
    function safeAdd(uint a, uint b) public pure returns (uint c) {
    c = a + b;
    require(c >= a);

}
function safeSub(uint a, uint b) public pure returns (uint c) {
    require(b <= a);
    c = a - b;
}
function safeMul(uint a, uint b) public pure returns (uint c) {
    c = a * b;
    require(a == 0 || c / a == b);}
    function safeDiv(uint a, uint b) public pure returns (uint c) {
    require(b > 0);
    c = a / b;
    }
}
//Token Contract
contract EdToken is SafeMath {
    //to store the balance of each address
    mapping(address => uint256) private _balances;
    //to store the amount allows to be withdrawn from one account by another
    mapping(address => mapping(address => uint256)) private _allowances;
    uint256 private _totalSupply; //total supply of tokens
    uint256 private _priceOfToken; //price of one token in ether
    string private _name; // name of the token
    string private _symbol; // symbol of the token
    address private _deployer; // deployer of the token gets access to mint new tokens
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    constructor(string memory name_, string memory symbol_, uint256 totalSupply_, uint256
    priceOfToken_) 
    {
        _name = name_;
        _symbol = symbol_;
        _totalSupply = totalSupply_;
        _priceOfToken = priceOfToken_;
        // deduct 1000 tokens from total token supply
        _totalSupply=safeSub(_totalSupply,1000);
        // unchecked{
        // _totalSupply -= 1000;
        // }
        // assigning 1000 tokens to the contract owner
        _balances[msg.sender] = 1000;
        _deployer = msg.sender;
    }
// returns the name of the token
function name() public view returns (string memory) {
    return _name;
}
// returns the symbol of the token
function symbol() public view returns (string memory) {
    return _symbol;
}
// returns the number of decimals accepted in the token value
function decimals() public pure returns (uint8) {
    return 0;
}
// returns the total supply of the tokens
function totalSupply() public view returns (uint256) {
    return _totalSupply;
}
// returns the balance of the specified account
function balanceOf(address account) public view returns (uint256) {
    return _balances[account];
}
// function to transfer amount number of tokens from the caller to the recipient
function transfer(address recipient, uint256 amount) public returns (bool) {
    _transfer(msg.sender, recipient, amount);
    return true;
}
// returns the amount of the tokens spender can spend from the owner's account
function allowance(address owner, address spender) public view returns (uint256) {
    return _allowances[owner][spender];
}
// function to approve amount number of tokens to be spend by the spender from the caller's account
function approve(address spender, uint256 amount) public returns (bool) {
    _approve(msg.sender,spender,amount);
    return true;
}
// function to transfer amount number of tokens from the sender's account to recipient's account
function transferFrom(address sender,address recipient,uint256 amount) public returns (bool) {
    // uint256 currentAllowance = _allowances[sender][recipient];
    // require(currentAllowance >= amount, "EdToken: transfer amount exceeds allowance ");
    _transfer(sender, recipient, amount);
    // uint256 approvAmt = safeSub(currentAllowance,amount);
    // _approve(sender, recipient, approvAmt);
    // unchecked {
    // _approve(sender, recipient, currentAllowance - amount);
    // }
    return true;
}
// function to mint new tokens
function mint(uint256 amount) public returns (uint256) {
    require(msg.sender == _deployer, "EdToken: only the owner can mint new tokens.");
    _totalSupply += amount;
    return _totalSupply;
}

// function to burn the tokens from a specific account to create inflation
function burn(uint256 amount) public returns (uint256) {
    address account = msg.sender;
    require(account != address(0), "EdToken: burn from the zero address");
    uint256 accountBalance = _balances[account];
    require(accountBalance >= amount, "EdToken: burn amount exceeds balance");
    _balances[account] = safeSub(accountBalance,amount);
    // unchecked {
    // _balances[account] = accountBalance - amount;
    // }
    _totalSupply -= amount;
    emit Transfer(account, address(0), amount);
    return _balances[account];
}
// function to buy new tokens by spending ether
function buy(uint256 amount) payable public returns (bool){
    require(msg.value == amount*_priceOfToken , "EdToken: Insufficient or Excess supply of funds");
    require(_totalSupply >= amount,"EdToken: Available tokens less than the required amount");
    _balances[msg.sender] += amount;
    _totalSupply=safeSub(_totalSupply,amount);
    emit Transfer(msg.sender, address(this), amount);
    return true;
}
// function to sell the tokens and transfer ether back to the owner
function sell(uint256 amount,address payable owner) public returns (bool){
    require(_balances[msg.sender] >= amount , "EdToken: Insufficient token balance");
    require(address(this).balance >= amount*_priceOfToken,"EdToken: Insufficient funds in the contract");
    owner.transfer(amount*_priceOfToken);
    _totalSupply += amount;
    _balances[msg.sender] =safeSub(_balances[msg.sender],amount);
    emit Transfer(address(this), msg.sender, amount);
    return true;
}
// returns the total balance of the contract account in terms of ether
function getContractBalance() public view returns(uint256){
    return address(this).balance;
}
// function to transfer amount number of tokens from sender to the recipient
function _transfer(address sender,address recipient,uint256 amount) internal {
    require(sender != address(0), "EdToken: transfer from the zero address");
    require(recipient != address(0), "EdToken: transfer to the zero address");
    uint256 senderBalance = _balances[sender];
    require(senderBalance >= amount, "EdToken: transfer amount exceeds balance");
    _balances[sender]=safeSub(senderBalance,amount);
    _balances[recipient] += amount;

    emit Transfer(sender, recipient, amount);
}
// function to approve spender to spend amount number of tokens from the owner's account
function _approve(address owner,address spender,uint256 amount) internal{
    require(owner != address(0), "EdToken: approve from the zero address");
    require(spender != address(0), "EdToken: approve to the zero address");
    require(_balances[owner] >= amount, "EdToken: approve amount less than the current balance");
    _allowances[owner][spender] = amount;
    emit Approval(owner, spender, amount);
}
}