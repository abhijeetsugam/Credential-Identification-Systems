pragma solidity ^0.4.19;

contract CredToken 
{
    string public constant name = "CREDCOIN";
    string public constant symbol = "CCN";
    uint8 public constant decimals = 2;  
   
    address ERCowner;
    
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);

    mapping(address => uint256) balances;

    uint256 totalSupply_;

    using SafeMath for uint256;

    constructor(uint256 total) public
    {
        totalSupply_ = total;
        balances[msg.sender] = totalSupply_;
        ERCowner = msg.sender; 
    } 

    function totalSupply() public view returns (uint256) 
    {
	    return totalSupply_;
    }
    
    function balanceOf(address tokenOwner) public view returns (uint) 
    {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint numTokens) payable public returns (bool) 
    {
        require(numTokens <= balances[msg.sender]);
        balances[msg.sender] = balances[msg.sender].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function transferFrom(address owner, address buyer, uint numTokens) public returns (bool) 
    {
        require(numTokens <= balances[owner]);        
        balances[owner] = balances[owner].sub(numTokens);
        balances[buyer] = balances[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
    
    function close() public 
    { 
        require(msg.sender == ERCowner);
        selfdestruct(msg.sender); 
    }
}

library SafeMath 
{ 
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}