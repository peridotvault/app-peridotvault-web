import type { Abi } from "viem";

export const PeridotRegistryAbi = [
  /* ======================================================
     CONSTRUCTOR
  ====================================================== */
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },

  /* ======================================================
     ERRORS
  ====================================================== */
  {
    type: "error",
    name: "GameAlreadyRegistered",
    inputs: [],
  },
  {
    type: "error",
    name: "GameNotRegistered",
    inputs: [],
  },
  {
    type: "error",
    name: "InvalidPGC1",
    inputs: [],
  },
  {
    type: "error",
    name: "NotFactory",
    inputs: [],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      { name: "owner", type: "address" },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      { name: "account", type: "address" },
    ],
  },
  {
    type: "error",
    name: "PGC1AlreadyRegistered",
    inputs: [],
  },
  {
    type: "error",
    name: "ZeroAddress",
    inputs: [],
  },

  /* ======================================================
     EVENTS
  ====================================================== */
  {
    type: "event",
    name: "FactorySet",
    anonymous: false,
    inputs: [
      { name: "factory", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "GameRegistered",
    anonymous: false,
    inputs: [
      { name: "gameId", type: "bytes32", indexed: true },
      { name: "pgc1", type: "address", indexed: true },
      { name: "publisher", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "GameStatusSet",
    anonymous: false,
    inputs: [
      { name: "gameId", type: "bytes32", indexed: true },
      { name: "active", type: "bool", indexed: false },
    ],
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    anonymous: false,
    inputs: [
      { name: "previousOwner", type: "address", indexed: true },
      { name: "newOwner", type: "address", indexed: true },
    ],
  },

  /* ======================================================
     READ FUNCTIONS
  ====================================================== */
  {
    type: "function",
    name: "allGameIds",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { type: "bytes32[]" },
    ],
  },
  {
    type: "function",
    name: "factory",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { type: "address" },
    ],
  },
  {
    type: "function",
    name: "gameCount",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { type: "uint256" },
    ],
  },
  {
    type: "function",
    name: "gameIdAt",
    stateMutability: "view",
    inputs: [
      { name: "index", type: "uint256" },
    ],
    outputs: [
      { type: "bytes32" },
    ],
  },
  {
    type: "function",
    name: "gameIdOf",
    stateMutability: "view",
    inputs: [
      { type: "address" },
    ],
    outputs: [
      { type: "bytes32" },
    ],
  },
  {
    type: "function",
    name: "games",
    stateMutability: "view",
    inputs: [
      { type: "bytes32" },
    ],
    outputs: [
      { name: "pgc1", type: "address" },
      { name: "publisher", type: "address" },
      { name: "createdAt", type: "uint64" },
      { name: "active", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [],
    outputs: [
      { type: "address" },
    ],
  },

  /* ======================================================
     WRITE FUNCTIONS
  ====================================================== */
  {
    type: "function",
    name: "registerGame",
    stateMutability: "nonpayable",
    inputs: [
      { name: "gameId", type: "bytes32" },
      { name: "pgc1", type: "address" },
      { name: "publisher", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "renounceOwnership",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "setFactory",
    stateMutability: "nonpayable",
    inputs: [
      { name: "factory_", type: "address" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "setGameActive",
    stateMutability: "nonpayable",
    inputs: [
      { name: "gameId", type: "bytes32" },
      { name: "active", type: "bool" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "transferOwnership",
    stateMutability: "nonpayable",
    inputs: [
      { name: "newOwner", type: "address" },
    ],
    outputs: [],
  },
] as const satisfies Abi;
