// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract CertificateVerification {
    mapping(bytes32 => bool) private certificates;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    function addCertificate(bytes32 hash) external {
        require(msg.sender == admin, "Only admin");
        certificates[hash] = true;
    }

    function verifyCertificate(bytes32 hash) external view returns (bool) {
        return certificates[hash];
    }
}
