/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/game_store.json`.
 */
export type GameStore = {
  "address": "DSiyompbYR2k2GsS69FWkvE9N3vf32Da4JNqZKYvn2Pp",
  "metadata": {
    "name": "gameStore",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buyGame",
      "discriminator": [
        230,
        118,
        208,
        28,
        185,
        30,
        230,
        155
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "storeState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "registryState"
        },
        {
          "name": "pgcProgram",
          "address": "BDqzDEUTfzskChktZwNsceHj3Vnr7g3322JgPKrMqsip"
        },
        {
          "name": "pgcGameState",
          "writable": true
        },
        {
          "name": "gameAuthority"
        },
        {
          "name": "storeMinterAuth"
        },
        {
          "name": "licenseAccount",
          "writable": true
        },
        {
          "name": "userGameTokenAccount",
          "writable": true
        },
        {
          "name": "gameMint",
          "writable": true
        },
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "paymentMint",
          "optional": true
        },
        {
          "name": "buyerPaymentTokenAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "treasuryTokenAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "storeVaultTokenAccount",
          "writable": true,
          "optional": true
        },
        {
          "name": "paymentTokenProgram",
          "optional": true
        },
        {
          "name": "licenseTokenProgram",
          "address": "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "string"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "storeState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "governance",
          "type": "pubkey"
        },
        {
          "name": "treasury",
          "type": "pubkey"
        },
        {
          "name": "registry",
          "type": "pubkey"
        },
        {
          "name": "platformFeeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "setDiscount",
      "discriminator": [
        185,
        99,
        11,
        85,
        175,
        2,
        42,
        198
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true
        },
        {
          "name": "storeState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "registryState"
        },
        {
          "name": "pgcGameState"
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "string"
        },
        {
          "name": "discountBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "setGovernance",
      "discriminator": [
        34,
        71,
        128,
        245,
        179,
        42,
        140,
        137
      ],
      "accounts": [
        {
          "name": "governance",
          "signer": true,
          "relations": [
            "storeState"
          ]
        },
        {
          "name": "storeState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "governance",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setPlatformFee",
      "discriminator": [
        19,
        70,
        111,
        182,
        156,
        58,
        208,
        203
      ],
      "accounts": [
        {
          "name": "governance",
          "signer": true,
          "relations": [
            "storeState"
          ]
        },
        {
          "name": "storeState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "feeBps",
          "type": "u16"
        }
      ]
    },
    {
      "name": "setPrice",
      "discriminator": [
        16,
        19,
        182,
        8,
        149,
        83,
        72,
        181
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true
        },
        {
          "name": "storeState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "registryState"
        },
        {
          "name": "pgcGameState"
        },
        {
          "name": "currencyMint",
          "optional": true
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "string"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "currency",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "setTreasury",
      "discriminator": [
        57,
        97,
        196,
        95,
        195,
        206,
        106,
        136
      ],
      "accounts": [
        {
          "name": "governance",
          "signer": true,
          "relations": [
            "storeState"
          ]
        },
        {
          "name": "storeState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "treasury",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "withdraw",
      "discriminator": [
        183,
        18,
        70,
        156,
        148,
        109,
        161,
        34
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true
        },
        {
          "name": "storeState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "paymentMint",
          "writable": true
        },
        {
          "name": "publisherTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "publisher"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "paymentMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "storeVaultTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "token",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "withdrawSol",
      "discriminator": [
        145,
        131,
        74,
        136,
        65,
        137,
        42,
        38
      ],
      "accounts": [
        {
          "name": "publisher",
          "writable": true,
          "signer": true
        },
        {
          "name": "storeState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  97,
                  109,
                  101,
                  95,
                  115,
                  116,
                  111,
                  114,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "gameState",
      "discriminator": [
        144,
        94,
        208,
        172,
        248,
        99,
        134,
        120
      ]
    },
    {
      "name": "minterAuthority",
      "discriminator": [
        64,
        208,
        118,
        12,
        174,
        104,
        47,
        5
      ]
    },
    {
      "name": "registryState",
      "discriminator": [
        29,
        34,
        224,
        195,
        175,
        183,
        99,
        97
      ]
    },
    {
      "name": "storeState",
      "discriminator": [
        216,
        96,
        91,
        102,
        135,
        35,
        32,
        195
      ]
    }
  ],
  "events": [
    {
      "name": "discountSet",
      "discriminator": [
        71,
        35,
        211,
        93,
        195,
        190,
        89,
        76
      ]
    },
    {
      "name": "gamePurchased",
      "discriminator": [
        171,
        159,
        122,
        155,
        186,
        98,
        154,
        92
      ]
    },
    {
      "name": "governanceUpdated",
      "discriminator": [
        242,
        176,
        180,
        4,
        237,
        220,
        12,
        2
      ]
    },
    {
      "name": "nativeSolPublisherWithdrawn",
      "discriminator": [
        101,
        15,
        18,
        251,
        228,
        69,
        62,
        51
      ]
    },
    {
      "name": "platformFeeUpdated",
      "discriminator": [
        210,
        134,
        201,
        4,
        92,
        228,
        80,
        26
      ]
    },
    {
      "name": "priceSet",
      "discriminator": [
        152,
        186,
        196,
        72,
        117,
        210,
        36,
        160
      ]
    },
    {
      "name": "publisherWithdrawn",
      "discriminator": [
        248,
        41,
        83,
        164,
        194,
        248,
        59,
        28
      ]
    },
    {
      "name": "storeInitialized",
      "discriminator": [
        227,
        199,
        199,
        58,
        219,
        60,
        250,
        31
      ]
    },
    {
      "name": "treasuryUpdated",
      "discriminator": [
        80,
        239,
        54,
        168,
        43,
        38,
        85,
        145
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "emptyGameId",
      "msg": "Game ID must not be empty"
    },
    {
      "code": 6001,
      "name": "gameIdTooLong",
      "msg": "Game ID is too long"
    },
    {
      "code": 6002,
      "name": "invalidGovernance",
      "msg": "Invalid governance address"
    },
    {
      "code": 6003,
      "name": "invalidTreasury",
      "msg": "Invalid treasury address"
    },
    {
      "code": 6004,
      "name": "invalidRegistry",
      "msg": "Invalid registry address"
    },
    {
      "code": 6005,
      "name": "invalidCurrency",
      "msg": "Invalid currency address"
    },
    {
      "code": 6006,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6007,
      "name": "gameNotFound",
      "msg": "Game was not found in registry"
    },
    {
      "code": 6008,
      "name": "gameNotApproved",
      "msg": "Game is not approved"
    },
    {
      "code": 6009,
      "name": "priceConfigNotFound",
      "msg": "Price config was not found"
    },
    {
      "code": 6010,
      "name": "invalidDiscountBps",
      "msg": "Discount basis points are invalid"
    },
    {
      "code": 6011,
      "name": "invalidPlatformFeeBps",
      "msg": "Platform fee basis points are invalid"
    },
    {
      "code": 6012,
      "name": "publisherBalanceNotFound",
      "msg": "Publisher balance not found"
    },
    {
      "code": 6013,
      "name": "emptyPublisherBalance",
      "msg": "Publisher balance is zero"
    },
    {
      "code": 6014,
      "name": "contractAddressMismatch",
      "msg": "Registry game contract mismatch"
    },
    {
      "code": 6015,
      "name": "publisherMismatch",
      "msg": "Registry game publisher mismatch"
    },
    {
      "code": 6016,
      "name": "alreadyOwnsValidLicense",
      "msg": "Duplicate purchase is not allowed"
    },
    {
      "code": 6017,
      "name": "invalidPaymentMint",
      "msg": "Invalid payment mint"
    },
    {
      "code": 6018,
      "name": "invalidBuyerTokenAccount",
      "msg": "Invalid buyer token account"
    },
    {
      "code": 6019,
      "name": "invalidTreasuryTokenAccount",
      "msg": "Invalid treasury token account"
    },
    {
      "code": 6020,
      "name": "invalidTreasuryAccount",
      "msg": "Invalid treasury account"
    },
    {
      "code": 6021,
      "name": "invalidStoreVaultTokenAccount",
      "msg": "Invalid store vault token account"
    },
    {
      "code": 6022,
      "name": "priceConfigLimitReached",
      "msg": "Store price config limit reached"
    },
    {
      "code": 6023,
      "name": "publisherBalanceLimitReached",
      "msg": "Store publisher balance limit reached"
    },
    {
      "code": 6024,
      "name": "invalidLicenseAccount",
      "msg": "Invalid license account"
    },
    {
      "code": 6025,
      "name": "nativeSolRequiresDedicatedInstruction",
      "msg": "Use the native SOL instruction for this game price"
    },
    {
      "code": 6026,
      "name": "insufficientStoreLamports",
      "msg": "Store account does not have enough SOL escrow"
    }
  ],
  "types": [
    {
      "name": "discountSet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "discountBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "gamePurchased",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "currency",
            "type": "pubkey"
          },
          {
            "name": "finalPrice",
            "type": "u64"
          },
          {
            "name": "platformFee",
            "type": "u64"
          },
          {
            "name": "publisherRevenue",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "gameState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "authorityBump",
            "type": "u8"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "metadataUri",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "governanceUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oldGovernance",
            "type": "pubkey"
          },
          {
            "name": "newGovernance",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "minterAuthority",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "game",
            "type": "pubkey"
          },
          {
            "name": "account",
            "type": "pubkey"
          },
          {
            "name": "isAuthorized",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "nativeSolPublisherWithdrawn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "platformFeeUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "platformFeeBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "priceConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "currency",
            "type": "pubkey"
          },
          {
            "name": "discountBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "priceSet",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "currency",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "publisherBalance",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "publisherWithdrawn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "publisher",
            "type": "pubkey"
          },
          {
            "name": "token",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "registrationFeeOption",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "paymentMethod",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "registryGame",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "string"
          },
          {
            "name": "contractAddress",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "registryState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "governance",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "factory",
            "type": "pubkey"
          },
          {
            "name": "registrationFeeOptions",
            "type": {
              "vec": {
                "defined": {
                  "name": "registrationFeeOption"
                }
              }
            }
          },
          {
            "name": "admins",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "feeExemptions",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "games",
            "type": {
              "vec": {
                "defined": {
                  "name": "registryGame"
                }
              }
            }
          },
          {
            "name": "allGameIds",
            "type": {
              "vec": "string"
            }
          }
        ]
      }
    },
    {
      "name": "storeInitialized",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "governance",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "registry",
            "type": "pubkey"
          },
          {
            "name": "platformFeeBps",
            "type": "u16"
          }
        ]
      }
    },
    {
      "name": "storeState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "registry",
            "type": "pubkey"
          },
          {
            "name": "governance",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "platformFeeBps",
            "type": "u16"
          },
          {
            "name": "prices",
            "type": {
              "vec": {
                "defined": {
                  "name": "priceConfig"
                }
              }
            }
          },
          {
            "name": "publisherBalances",
            "type": {
              "vec": {
                "defined": {
                  "name": "publisherBalance"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "treasuryUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "oldTreasury",
            "type": "pubkey"
          },
          {
            "name": "newTreasury",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
