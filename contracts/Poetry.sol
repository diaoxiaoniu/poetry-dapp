// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Poetry {
    address public owner;
    
    struct Poem {
        string title;
        string content;
        address author;
        uint256 timestamp;
        bool isDeleted;
    }
    
    Poem[] public poems;
    
    event PoemCreated(uint256 indexed poemId, string title, address author);
    event PoemDeleted(uint256 indexed poemId, address author);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }
    
    function createPoem(string memory _title, string memory _content) public onlyOwner {
        poems.push(Poem({
            title: _title,
            content: _content,
            author: msg.sender,
            timestamp: block.timestamp,
            isDeleted: false
        }));
        
        emit PoemCreated(poems.length - 1, _title, msg.sender);
    }
    
    function deletePoem(uint256 _poemId) public onlyOwner {
        require(_poemId < poems.length, "Poem does not exist");
        require(!poems[_poemId].isDeleted, "Poem already deleted");
        
        poems[_poemId].isDeleted = true;
        emit PoemDeleted(_poemId, msg.sender);
    }
    
    function getPoem(uint256 _poemId) public view returns (string memory, string memory, address, uint256) {
        require(_poemId < poems.length, "Poem does not exist");
        require(!poems[_poemId].isDeleted, "Poem already deleted");
        
        Poem memory poem = poems[_poemId];
        return (poem.title, poem.content, poem.author, poem.timestamp);
    }
    
    function getActivePoems() public view returns (uint256[] memory) {
        uint256 activeCount = 0;
        for (uint256 i = 0; i < poems.length; i++) {
            if (!poems[i].isDeleted) {
                activeCount++;
            }
        }
        
        uint256[] memory activeIndices = new uint256[](activeCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < poems.length; i++) {
            if (!poems[i].isDeleted) {
                activeIndices[currentIndex] = i;
                currentIndex++;
            }
        }
        
        return activeIndices;
    }
    
    function getPoemCount() public view returns (uint256) {
        return poems.length;
    }
    
    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }
} 